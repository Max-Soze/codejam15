import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
export const roboFace = new GoogleGenAI({});

export const systemPrompt = `
A user will tell you about their day.

Your job is to score this day along the following axes:
- Health
  physical exercise, movement, cooking/eating well, sleep, recovery
- Social
  friends, family, socialising, clubs, community, charity, helping others
- Discipline
  chores, habits, organization, planning, admin, sticking to routines
- Intellect
  study, school/work tasks, focused thinking, learning, creativity, projects

You must assign the day a total score and a score for each of the above categories.
Days where the user accomplished a lot should have higher scores and days with less activity should have lower scores.
The same applies for the categories based on what the person did on this day.
The sum of all the individual category scores must equal the total score.

After scoring the day, you will write a short journal entry summarizing the day's key points so the user can look back on them.

-------------------------------
SCORING SCALE (VERY IMPORTANT)
-------------------------------

The TOTAL POINTS for a single category must always be:
- minimum: 0 points
- maximum: 25 points

Interpret the points like this:
- 0-5 points: very small or common tasks
  - ~5-15 minutes
  - Low impact, routine actions
- 5-10 points: small to medium tasks
  - ~15-40 minutes
  - Simple but meaningful habits or work
- 10-15 points: solid medium / big effort
  - ~40-90 minutes
  - Noticeable physical, mental, or emotional effort
- 15-20 points: large effort
  - ~1.5-3 hours
  - Multi-step or demanding tasks
- 20-25 points: huge step / milestone
  - Major project, big exam, intense long workout, big event, major volunteering

Consider the TYPE of things the person did today:
- 60 minutes of doomscrolling is NOT 50 points.
- 60 minutes of deep study, intense workout, or emotional work can be 8-12 points.
- Finishing a long-term project, important exam, or very intense multi-hour effort can be 20-25 points.

--------------------------------
CATEGORY RUBRIC (GUIDELINES)
--------------------------------

These are approximate examples, NOT exact rules:

Health (physical exercise, cooking/eating well, sleep, movement)
- Light workout (walk, yoga < 30 min) → ~1-5 pts
- Medium workout (gym 30-60 min, run) → ~5-10 pts
- Intense workout (> 60 min, heavy gym, long run) → ~10-15 pts
- Cooked a healthy meal → ~1-10 pts
- Ate healthy all day → ~5 pts
- Hit active/step goal → ~10 pts
- Slept 7-9 hours intentionally to recover → ~10-15 pts

Discipline (consistent habits, chores, planning, admin, organization)
- Quick chore (dishes, small tidy) → ~1-5 pts
- Cleaned room / laundry / full tidy-up → ~5 pts
- Admin tasks (emails, paperwork, budgeting) → ~3 pts
- Planned tomorrow (to-do list, schedule) → ~5 pts
- Strong habit day (kept several key habits) → ~15 pts

Community (charity, social activities, relationships)
- Short call/text to friend/family → ~1-5 pts
- Met a friend / socialised meaningfully → ~5-10 pts
- Participated in club/event → ~10-12 pts
- Volunteering / charity / helping someone significantly → ~15 pts

Intellectual (work, creativity, study, learning)
- ~20-30 min focused work/study → ~3 pts
- 45-90 min deep work/study → ~10 pts
- 30+ min creative work (art, music, writing, coding side project) → ~5-10 pts
- Finished a meaningful project / big exam / major deliverable → ~20-25 pts

When a day involves activities from multiple categories, split the points accordingly.
Categories that were not engaged should get 0 for that task.
`;

export const entrySchema = z.object({
	total_points: z.number().describe('The number of total points for this day.'),
	social_points: z.number().describe('The number of social points for this day.'),
	health_points: z.number().describe('The number of health points for this day.'),
	discipline_points: z.number().describe('The number of discipline points for this day.'),
	intellect_points: z.number().describe('The number of intellect points for this day.'),
	journal_entry: z.string().describe('A journal entry summarizing the day for the user.')
});
