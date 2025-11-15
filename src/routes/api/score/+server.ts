import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { geminiModel } from "$lib/gemini";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { taskText, durationMinutes } = await request.json();

    if (typeof taskText !== "string" || typeof durationMinutes !== "number") {
      return json(
        {
          error:
            "taskText (string) and durationMinutes (number) are required"
        },
        { status: 400 }
      );
    }

    const prompt = `
You are a scoring engine for a wellness game.

The user logs tasks they did today. Your job is to assign POINTS to four categories
based on what they did and how long they spent:

- health: physical exercise, movement, cooking/eating well, sleep, recovery
- discipline: chores, habits, organization, planning, admin, sticking to routines
- community: friends, family, socialising, clubs, community, charity, helping others
- intellectual: study, school/work tasks, focused thinking, learning, creativity, projects

You will receive:
- A natural language description of the task
- The approximate duration in minutes

You must:
1. Decide how BIG the task is overall (total_points) between 5 and 50.
2. Split these total_points between the 4 categories as integers.
3. The sum of all category points MUST equal total_points.

-------------------------------
SCORING SCALE (VERY IMPORTANT)
-------------------------------

The TOTAL POINTS for a single task (across all categories combined) must always be:
- minimum: 5 points
- maximum: 50 points

Interpret the total_points like this:

- 5–10 points: very small or common tasks
  - ~5–15 minutes
  - Low impact, routine actions
- 10–20 points: small to medium tasks
  - ~15–40 minutes
  - Simple but meaningful habits or work
- 20–35 points: solid medium / big effort
  - ~40–90 minutes
  - Noticeable physical, mental, or emotional effort
- 35–45 points: large effort
  - ~1.5–3 hours
  - Multi-step or demanding tasks
- 45–50 points: huge step / milestone
  - Major project, big exam, intense long workout, big event, major volunteering

Use duration as a strong clue, but also consider the TYPE of task:
- 60 minutes of doomscrolling is NOT 50 points.
- 60 minutes of deep study, intense workout, or emotional work can be 25–35 points.
- Finishing a long-term project, important exam, or very intense multi-hour effort can be 40–50 points.

--------------------------------
CATEGORY RUBRIC (GUIDELINES)
--------------------------------

These are approximate examples, NOT exact rules:

Health (physical exercise, cooking/eating well, sleep, movement)
- Light workout (walk, yoga < 30 min) → ~5–10 pts
- Medium workout (gym 30–60 min, run) → ~15–25 pts
- Intense workout (> 60 min, heavy gym, long run) → ~25–40 pts
- Cooked a healthy meal → ~10–15 pts
- Ate healthy all day → ~15–20 pts
- Hit active/step goal → ~10–20 pts
- Slept 7–9 hours intentionally to recover → ~15–25 pts

Discipline (consistent habits, chores, planning, admin, organization)
- Quick chore (dishes, small tidy) → ~5–10 pts
- Cleaned room / laundry / full tidy-up → ~10–20 pts
- Admin tasks (emails, paperwork, budgeting) → ~10–20 pts
- Planned tomorrow (to-do list, schedule) → ~5–15 pts
- Strong habit day (kept several key habits) → ~20–30 pts

Community (charity, social activities, relationships)
- Short call/text to friend/family → ~5–10 pts
- Met a friend / socialised meaningfully → ~10–20 pts
- Participated in club/event → ~15–25 pts
- Volunteering / charity / helping someone significantly → ~20–40 pts

Intellectual (work, creativity, study, learning)
- ~20–30 min focused work/study → ~10–15 pts
- 45–90 min deep work/study → ~15–30 pts
- 30+ min creative work (art, music, writing, coding side project) → ~10–25 pts
- Finished a meaningful project / big exam / major deliverable → ~35–50 pts

When a task clearly belongs to multiple categories, split the points according to relevance.
Categories that are not really involved should get 0 for that task.

---------------------
INPUT YOU RECEIVE
---------------------

User description:
"${taskText}"

Approximate duration in minutes:
${durationMinutes}

---------------------
WHAT YOU MUST RETURN
---------------------

Return ONLY valid JSON with this shape:

{
  "total_points": number,
  "category_points": {
    "health": number,
    "discipline": number,
    "community": number,
    "intellectual": number
  }
}

Rules:
- total_points must be an integer between 5 and 50 (inclusive).
- category_points.* must be integers >= 0.
- health + discipline + community + intellectual MUST sum exactly to total_points.
- If a category is not really relevant, give it 0 points.
- Do NOT include any extra fields or text outside of this JSON.
`;

    let text: string;
    try {
      const result = await geminiModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      });

      text = result.response.text(); 
    } catch (err) {
      console.error("Gemini request failed:", err);
      return json(
        {
          error:
            "Gemini request failed (check API key, model name, or quota in the server logs)"
        },
        { status: 500 }
      );
    }

    let data: {
      total_points?: number;
      category_points?: {
        health?: number;
        discipline?: number;
        community?: number;
        intellectual?: number;
      };
    };

    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", text);
      return json({ error: "Failed to parse AI output" }, { status: 500 });
    }

    if (
      typeof data.total_points !== "number" ||
      !data.category_points
    ) {
      console.error("AI output missing required fields:", data);
      return json({ error: "Invalid AI output shape" }, { status: 500 });
    }

    const {
      health = 0,
      discipline = 0,
      community = 0,
      intellectual = 0
    } = data.category_points;

    const sum = health + discipline + community + intellectual;

    if (sum !== data.total_points) {
      console.warn("AI points do not sum to total_points, adjusting:", data);

      const safeSum = sum || 1;
      const scale = data.total_points / safeSum;

      data.category_points = {
        health: Math.round(health * scale),
        discipline: Math.round(discipline * scale),
        community: Math.round(community * scale),
        intellectual: Math.round(intellectual * scale)
      };
    }

    return json({
      total_points: data.total_points,
      category_points: data.category_points
    });
  } catch (err) {
    console.error("Unexpected error in /api/score:", err);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
