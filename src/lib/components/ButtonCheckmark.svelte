<script>
  import Button from '$lib/components/Button.svelte';

  let checked = false;
  export let onClick = () => {};
  export let text = "";
</script>

<Button
  text={checked ? "✅" : text}
  onClick={() => {
    checked = !checked;
    onClick();
  }}
/>
