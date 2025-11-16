<script lang="ts">
  let taskText = "Went for a 45 min run and cleaned my room";
  let durationMinutes: number = 80;
  let loading = false;
  let error: string | null = null;
  let result: any = null;

  async function scoreTask() {
    loading = true;
    error = null;
    result = null;

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskText,
          durationMinutes: Number(durationMinutes)
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("API error:", res.status, body);
        throw new Error(body.error ?? "API error");
      }

      result = await res.json();
    } catch (e: any) {
      console.error(e);
      error = e?.message ?? "Something went wrong";
    } finally {
      loading = false;
    }
  }
</script>

<h1>Test AI Scoring</h1>

<form on:submit|preventDefault={scoreTask}>
  <label>
    Task description
    <textarea rows="4" bind:value={taskText}></textarea>
  </label>

  <label>
    Duration (minutes)
    <input type="number" min="1" bind:value={durationMinutes} />
  </label>

  <button type="submit" disabled={loading}>
    {#if loading}Scoring...{/if}
    {#if !loading}Score task{/if}
  </button>
</form>

{#if error}
  <p style="color: red;">{error}</p>
{/if}

{#if result}
  <h2>Result</h2>
  <pre>{JSON.stringify(result, null, 2)}</pre>

  {#if result.category_points}
    <ul>
      <li>Health: {result.category_points.health}</li>
      <li>Discipline: {result.category_points.discipline}</li>
      <li>Community: {result.category_points.community}</li>
      <li>Intellectual: {result.category_points.intellectual}</li>
      <li><strong>Total: {result.total_points}</strong></li>
    </ul>
  {/if}
{/if}
