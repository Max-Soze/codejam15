<div class="overlay">
    <div class="window">
        <slot />
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .window {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        min-width: 300px;
    }
</style>