<script lang="ts">
  import Button from '$lib/components/Button.svelte';
	import Tasktile from '$lib/components/Tasktile.svelte';
  import MenuButton from '$lib/components/ButtonMenu.svelte';
  import ButtonSlider from '$lib/components/ButtonSlider.svelte';
  let mode = "Automatic";
  type Task = {
    name: string;
    done: boolean;
  };

  let tasks = [
    { name: "Clean room", done: false },
    { name: "Do homework", done: false },
  ];

  function addTask() {
    tasks = [...tasks, { name: "", done: false }];
  }

  function removeTask(index:number) {
    tasks = tasks.filter((_, i) => i !== index);
  }
</script>

<div class = "min-h-screen bg-bg min-w-screen" >
  <div class= "text-yellow-800">
    <div class = "container">
      <div class = "left-panel">
    

        <div class ="text-area">
          <ButtonSlider
            left="Manual"
            right="Automatic"
            bind:selected={mode}
          />

          {#if mode == "Manual"}
            <p> hi </p>

          {:else}
            <p> bye </p>

          {/if}
          <MenuButton/>
          <Button text="hi"/>
          {#each tasks as task, i (i)}
            <div class="task-row flex items-center gap-2">
              <Tasktile bind:TaskName={task.name} />
              <Button text="❌" onClick={() => removeTask(i)} />
            </div>
          {/each}
        </div>
      </div>
      <div class = "right-panel">
        <div class ="textarea">
          <button  class = "btn-primary" >
            hello
          </button>
          hi
        </div>
    

        
      </div>
    </div>

  </div>

</div>



<style lang="postcss">
  @reference "tailwindcss";

  

</style>

