<script>

   import Button from '$lib/components/Button2.svelte';
   export let TaskName = "TaskName";
</script>

<div class="TextArea">
   <input type="text" bind:value={TaskName} class="task-input"/>

</div>

 
