import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
export const roboFace = new GoogleGenAI({});

export const systemPrompt = `
You will be provided with a task, and optionally its description and duration.

Your job is to score this task along the following axes:
- Health
  physical exercise, movement, cooking/eating well, sleep, recovery
- Social
  friends, family, socialising, clubs, community, charity, helping others
- Discipline
  chores, habits, organization, planning, admin, sticking to routines
- Intellect
  study, school/work tasks, focused thinking, learning, creativity, projects

You must assign the task a total score and a score for each of the above categories.
Harder and more difficult tasks should have higher scores than easier ones.
The sum of all the individual category scores must equal the total score.

-------------------------------
SCORING SCALE (VERY IMPORTANT)
-------------------------------

The TOTAL POINTS for a single task (across all categories combined) must always be:
- minimum: 3 points
- maximum: 50 points

Interpret the total_points like this:

- 3-10 points: very small or common tasks
  - ~5-15 minutes
  - Low impact, routine actions
- 10-20 points: small to medium tasks
  - ~15-40 minutes
  - Simple but meaningful habits or work
- 20-35 points: solid medium / big effort
  - ~40-90 minutes
  - Noticeable physical, mental, or emotional effort
- 35-45 points: large effort
  - ~1.5-3 hours
  - Multi-step or demanding tasks
- 45-50 points: huge step / milestone
  - Major project, big exam, intense long workout, big event, major volunteering

Use duration as a strong clue, but also consider the TYPE of task:
- 60 minutes of doomscrolling is NOT 50 points.
- 60 minutes of deep study, intense workout, or emotional work can be 25-35 points.
- Finishing a long-term project, important exam, or very intense multi-hour effort can be 40-50 points.

--------------------------------
CATEGORY RUBRIC (GUIDELINES)
--------------------------------

These are approximate examples, NOT exact rules:

Health (physical exercise, cooking/eating well, sleep, movement)
- Light workout (walk, yoga < 30 min) → ~3-10 pts
- Medium workout (gym 30-60 min, run) → ~15-25 pts
- Intense workout (> 60 min, heavy gym, long run) → ~25-40 pts
- Cooked a healthy meal → ~10-15 pts
- Ate healthy all day → ~15-20 pts
- Hit active/step goal → ~10-20 pts
- Slept 7-9 hours intentionally to recover → ~15-25 pts

Discipline (consistent habits, chores, planning, admin, organization)
- Quick chore (dishes, small tidy) → ~3-10 pts
- Cleaned room / laundry / full tidy-up → ~10-20 pts
- Admin tasks (emails, paperwork, budgeting) → ~10-20 pts
- Planned tomorrow (to-do list, schedule) → ~5-15 pts
- Strong habit day (kept several key habits) → ~20-30 pts

Community (charity, social activities, relationships)
- Short call/text to friend/family → ~3-10 pts
- Met a friend / socialised meaningfully → ~10-20 pts
- Participated in club/event → ~15-25 pts
- Volunteering / charity / helping someone significantly → ~20-40 pts

Intellectual (work, creativity, study, learning)
- ~20-30 min focused work/study → ~10-15 pts
- 45-90 min deep work/study → ~15-30 pts
- 30+ min creative work (art, music, writing, coding side project) → ~10-25 pts
- Finished a meaningful project / big exam / major deliverable → ~35-50 pts

When a task clearly belongs to multiple categories, split the points according to relevance.
Categories that are not really involved should get 0 for that task.
`;

export const pointSchema = z.object({
	total_points: z.number().describe('The number of total points for this task.'),
	social_points: z.number().describe('The number of social points for this task.'),
	health_points: z.number().describe('The number of health points for this task.'),
	discipline_points: z.number().describe('The number of discipline points for this task.'),
	intellect_points: z.number().describe('The number of intellect points for this task.')
});
