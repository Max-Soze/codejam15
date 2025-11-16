<script lang="ts">
    
    export let value: number = 0;
    export let category: string;
    export let color :string = "#000000";
    
    function getProgress(value:number, category:string){
        const thresholdsStats = [0, 50, 150, 300, 500];
        const thresholdsOverall = [0, 100, 250, 500, 1000];
        const thresholds =  category === "overall" ? thresholdsOverall : thresholdsStats;

        let level = 0;

        for (let i = 0; i < thresholds.length; i++) {
            if (value >= thresholds[i]) {
                level = i + 1;
            }
        }
        const threshold = thresholds[level - 1]
        const nextThreshold = thresholds[level] ?? thresholds[thresholds.length - 1];
        const remaining = Math.max(0, nextThreshold - value);
        const totalRange = nextThreshold - threshold;

        const percentage = totalRange === 0 ? 100 : ((value - threshold) / totalRange) * 100;

        return {
            level,
            threshold,
            nextThreshold,
            remaining,
            percentage,
        };
    }

    $: result = getProgress(value, category);
</script>



<div class = "progress">
    <div class="bar" style="width:{result.percentage}%; background:{color};"></div>
</div>

    <div>
        Level {result.level} {value}/{result.nextThreshold}
    </div>
    <div>
        
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