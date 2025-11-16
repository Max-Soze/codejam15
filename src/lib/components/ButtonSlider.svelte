<script lang="ts">
  export let left: string;
  export let right: string;

  // the selected option is passed back to parent
  export let selected: string = left;

  function setLeft(){
    selected = left;
  }
  function setRight(){
    selected = right;
  }
</script>

<div class="toggle" >
  <button
    type="button"
    class="option"
    class:active={selected === left}
    on:click={setLeft}>
    {left}
  </button>

  <button
    type="button"
    class="option"
    class:active={selected === right}
    on:click={setRight}>
    {right}
  </button>

  <div
    class="thumb"
    class:selectedLeft={selected === left}
    class:selectedRight={selected === right}>
  </div>
</div>

<style>
  .toggle {
    position: relative;
    border: 1.5px solid var(--color-yellow-800);
    width: 200px;
    height: 50px;
    background: --color-bg;
    border-radius: 999px;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
  }

  .option {
    flex: 1;
    z-index: 2;
    background: transparent;
    border: none;
    font-size: 15px;
    cursor: pointer;
    color: var(--color-yellow-800);
    border-radius: 999px;
    transition: color .2s;
  }
  .option.active {
    font-weight: 600;
    color: --color-yellow-800;
  }

  .thumb {
    position: absolute;
    top: 5px;
    left: 5px;
    width: calc(50% - 5px);
    height: calc(100% - 10px);
    background: var(--color-amber-50);
    border-radius: 999px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    transition: transform 0.25s ease;
  }

  .thumb.selectedLeft {
    transform: translateX(0);
  }

  .thumb.selectedRight {
    transform: translateX(100%);
  }
</style>
