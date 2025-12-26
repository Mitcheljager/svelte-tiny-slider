<script>
	import { browser } from "$app/environment";
	import TinySlider from "$lib/TinySlider.svelte";
</script>

<div>
  <TinySlider>
    {#each browser ? ["https://picsum.photos/seed/a/200/200", "https://picsum.photos/seed/b/200/200/", "https://picsum.photos/seed/c/200/200/"] : [] as item}
      <img src={item} alt="" />
    {/each}
  </TinySlider>
</div>

<style>
  :global(:root) {
    color-scheme: light dark;
  }

  :global(body) {
    background: light-dark(white, black);
  }

  div {
    width: 200px;
  }
</style>
