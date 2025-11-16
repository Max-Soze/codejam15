<script lang="ts">
    
    export let value: number = 0;
    export let color :string = "#000000";
</script>

<div class = "progress">
    <div class="bar" style="width:{value}%; background:{color};"></div>
</div>

<style>
    .progress{
        width:100%;
        height:10px;
        background-color: beige;
        border-radius: 2px;
        overflow: hidden;
    }
    .bar{
        height:100%;
        transition: width 0.25s ease;
    }
</style>