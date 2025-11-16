<script lang="ts">
  import Button from '$lib/components/Button.svelte';
	import Tasktile from '$lib/components/Tasktile.svelte';
  import MenuButton from '$lib/components/ButtonMenu.svelte';
  import ButtonCheckmark from '$lib/components/ButtonCheckmark.svelte';

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
          <MenuButton/>
          <Button text="hi"/>
          {#each tasks as task, i (i)}
            <div class="task-row flex items-center gap-2">
              <ButtonCheckmark 
                text="" 
              />
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

