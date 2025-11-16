<script lang="ts">
    
    export let value: number = 0;
    export let color :string = "#000000";
</script>

<div class = "progress">
    <div class="bar" style="width:{value}%; background:{color};"></div>
</div>

<style>
    .progress{

        width:90%;
        height:10px;
        background-color: beige;
        border-radius: 20px;
        overflow: hidden;
    }
    .bar{
        height:100%;
        transition: width 0.25s ease;
        border-radius: 20px;
    }
</style>