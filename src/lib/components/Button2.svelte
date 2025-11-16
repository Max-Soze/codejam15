<script>
  export let text = "Button";
  export let disabled = false;
  export let onClick = () => {};
</script>

<button class="btn-primary" on:click={onClick} disabled={disabled}>
  {text}
</button>

<style>
.btn-primary {
    /* Rounded borders */
    border-radius: 40px;

    /* Background*/
    background-color: var(--color-bg);
    padding: 10px 10px;

    /* Text */
    font-weight: var(--font-weight-semibold);
    color: var(--color-yellow-800);

    /* Outside the button */
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-yellow-800);

    cursor: pointer;
    transition: background-color 0.2s ease;

    /* position */
    position: relative;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    margin-bottom: 30px;
    
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-primary:hover {
    @media (hover: hover) {
        background-color: var(--color-hover);
    }
}
.btn-primary:active {
  transform: scale(0.95); 
}
</style>

