<script>
  import Button from '$lib/components/Button2.svelte';

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
