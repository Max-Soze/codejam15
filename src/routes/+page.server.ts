import type { PageServerLoad, Actions } from './$types';
import { mongo } from '$lib/server/mongo';
import { ObjectId } from 'mongodb';

// Days between two dates, ignoring time of day
function daysBetween(today: Date, prev: Date): number {
  const d1 = new Date(today.toDateString());
  const d2 = new Date(prev.toDateString());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((d1.getTime() - d2.getTime()) / msPerDay);
}

// DECAY
function applyDecay(pointsCategory: number, lastActiveDate: Date | null, today: Date): number {
  if (!lastActiveDate) return pointsCategory;

  const daysGap = daysBetween(today, lastActiveDate);

  if (daysGap <= 2) {
    // same day, yesterday, or 1-day grace → no decay
    return pointsCategory;
  }

  const missedDays = daysGap - 2; // everything after the grace day
  const a = 0.2;

  const decayFactor = 1 / (1 + a * Math.log(1 + missedDays)); // ln
  return Math.round(pointsCategory * decayFactor);
}

// MULTIPLIER
function streakMultiplier(streakDays: number): number {
  const maxStreak = 30;
  const p = 1.5;

  if (streakDays <= 1) return 1.0;

  const clamped = Math.min(streakDays - 1, maxStreak - 1);
  const x = clamped / (maxStreak - 1);   // 0 → 1
  const mult = 1 + Math.pow(x, p);       // 1 → 2

  return Math.min(mult, 2.0);            // hard cap at 2x
}

export const load: PageServerLoad = async () => {
  // Load tasks from Mongo
  const client = await mongo;
  const database = client.db('TaskTown');
  const tasks = database.collection('tasks');
  const count = await tasks.countDocuments();
  const allTasks = await tasks.find({ complete: false }).toArray();
  const taskList = JSON.parse(JSON.stringify(allTasks));

  // Load User Data from Mongo
  const userData = await database.collection('users').findOne({});
  const user = JSON.parse(JSON.stringify(userData));
  return { count, taskList, user };
};

export const actions = {
  createTask: async ({ request }) => {
    const client = await mongo;
    const tasks = client.db('TaskTown').collection('tasks');
    const taskData = await request.formData();
    const newTask = {
      task: taskData.get('task'),
      complete: false,
      xpSocial: taskData.get('xpSocial'),
      xpHealth: taskData.get('xpHealth'),
      xpDiscipline: taskData.get('xpDiscipline'),
      xpIntellect: taskData.get('xpIntellect'),
      dueDate: taskData.get('dueDate')
    };
    await tasks.insertOne(newTask);
  },

  completeTask: async ({ request }) => {
    const client = await mongo;
    const db = client.db('TaskTown');
    const tasks = db.collection('tasks');
    const usersCol = db.collection('users');

    const data = await request.formData();

    const id = data.get('id')?.toString();
    if (!id) return;

    // base XP from the task (before multiplier/decay)
    const xpSocialTask = Number(data.get('xpSocial') ?? 0);
    const xpHealthTask = Number(data.get('xpHealth') ?? 0);
    const xpDisciplineTask = Number(data.get('xpDiscipline') ?? 0);
    const xpIntellectTask = Number(data.get('xpIntellect') ?? 0);

    // mark task complete
    await tasks.updateOne({ _id: new ObjectId(id) }, { $set: { complete: true } });

    // single hardcoded user
    const user: any = await usersCol.findOne({});
    if (!user) return;

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

    // helper to process ONE category (Social / Health / Discipline / Intellect)
    function processCategory(
      baseXpTask: number,
      xpField: string,        // "xpSocial"
      multField: string,      // "multSocial"
      lastField: string,      // "lastSocial"
      streakField: string     // "streakSocial" (we'll create these)
    ) {
      let currentXp: number = user[xpField] ?? 0;
      let streak: number = user[streakField] ?? 0;

      const lastStr: string | null = user[lastField] ?? null;
      const lastDate: Date | null = lastStr ? new Date(lastStr) : null;

      // 1) Apply decay to current XP for this category
      currentXp = applyDecay(currentXp, lastDate, now);

      // If this task doesn't give XP in this category, just return decayed state
      if (baseXpTask <= 0) {
        const mult = streakMultiplier(streak);
        return {
          newXp: currentXp,
          newMult: mult,
          newStreak: streak,
          newLast: lastStr ?? todayStr
        };
      }

      // 2) Update streak based on days since last activity (using last*)
      let daysGap: number | null = null;
      if (lastDate) {
        daysGap = daysBetween(now, lastDate);
      }

      if (daysGap === null) {
        streak = 1;                 // first time
      } else if (daysGap <= 1) {
        streak = streak + 1;        // same day or yesterday → continue streak
      } else if (daysGap === 2) {
        streak = Math.max(1, streak - 1); // 2-day gap → soft penalty
      } else {
        streak = 1;                 // bigger gap → reset
      }

      // 3) Apply multiplier based on streak
      const mult = streakMultiplier(streak);
      const gained = Math.round(baseXpTask * mult);

      const newXp = currentXp + gained;
      const newLast = todayStr;

      return {
        newXp,
        newMult: mult,
        newStreak: streak,
        newLast
      };
    }

    // Apply per category, using your existing field names
    const social = processCategory(
      xpSocialTask,
      'xpSocial',
      'multSocial',
      'lastSocial',
      'streakSocial'
    );
    const health = processCategory(
      xpHealthTask,
      'xpHealth',
      'multHealth',
      'lastHealth',
      'streakHealth'
    );
    const discipline = processCategory(
      xpDisciplineTask,
      'xpDiscipline',
      'multDiscipline',
      'lastDiscipline',
      'streakDiscipline'
    );
    const intellect = processCategory(
      xpIntellectTask,
      'xpIntellect',
      'multIntellect',
      'lastIntellect',
      'streakIntellect'
    );

    // Total XP from all categories after decay + multiplier
    const newXpTotal =
      social.newXp + health.newXp + discipline.newXp + intellect.newXp;

    // Still "hardcoded" user: updateOne({}, { $set: ... })
    await usersCol.updateOne(
      {},
      {
        $set: {
          xpSocial: social.newXp,
          xpHealth: health.newXp,
          xpDiscipline: discipline.newXp,
          xpIntellect: intellect.newXp,
          xpTotal: newXpTotal,

          multSocial: social.newMult,
          multHealth: health.newMult,
          multDiscipline: discipline.newMult,
          multIntellect: intellect.newMult,

          streakSocial: social.newStreak,
          streakHealth: health.newStreak,
          streakDiscipline: discipline.newStreak,
          streakIntellect: intellect.newStreak,

          lastSocial: social.newLast,
          lastHealth: health.newLast,
          lastDiscipline: discipline.newLast,
          lastIntellect: intellect.newLast
        }
      }
    );
  },

  generateTask: async ({ request }) => {
    const client = await mongo;
    const tasks = client.db('TaskTown').collection('tasks');
    const data = await request.formData();
    console.log('generated task');
  }
} satisfies Actions;
