<script lang="ts">
    import { T, Canvas, useTask, useThrelte} from '@threlte/core';
    import Scene1 from './scene1.svelte';
    import Scene2 from './scene2.svelte';
    import Popup from './Popup.svelte';
    import { Button, Checkbox, Pane, Separator } from 'svelte-tweakpane-ui';
    import {type CameraControlsRef, useTexture, Environment } from '@threlte/extras'
    import { type Mesh, MathUtils } from 'three'
    
    let controls = $state.raw<CameraControlsRef>();
    let mesh = $state.raw<Mesh>();
    /**
     * controls.enabled can not be bound to since its not reactive
     */
    let enabled = $state(true);
    $effect(() => {
        if (controls !== undefined) {
        controls.enabled = enabled
        }
    })
</script>

<Pane
  title="Movement"
  position="fixed"
>
    <Button
        title="zoom in"
        on:click={() => {
        controls?.dolly(20, true)
        }}
    />
    <Button
        title="zoom out"
        on:click={() => {
        controls?.dolly(-20, true)
        }}
    />
    <Button
        title="turn left"
        on:click={() => {
        controls?.rotate(90 * MathUtils.DEG2RAD, 0, true)
        }}
    />
    <Button
        title="turn right"
        on:click={() => {
        controls?.rotate(-90 * MathUtils.DEG2RAD, 0, true)
        }}
    />
</Pane>

<div class='container'>
    <div class="city">
        <Canvas>
            <Popup bind:controls bind:mesh />
        </Canvas>
    </div>
</div>

<style>
    .container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100vh; /* full height */
}

.container > div {
    flex: 1;             /* each takes up 50% of the space */
    height: 100%;
    overflow: hidden;    /* prevents scrollbars if canvas overflows */
}
</style>