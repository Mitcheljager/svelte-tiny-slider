<script>
	import TinySlider from "$lib/TinySlider.svelte";
</script>

<section>
  <TinySlider>
    {#each ["https://picsum.photos/seed/a/200/200", "https://picsum.photos/seed/b/200/200/", "https://picsum.photos/seed/c/200/200/"] as item}
      <img src={item} alt="" class="max-w-screen" />
    {/each}
  </TinySlider>
</section>

<section class="mt-20">
  <TinySlider>
    {#each ["https://picsum.photos/seed/a/200/200", "https://picsum.photos/seed/b/200/200/", "https://picsum.photos/seed/c/200/200/"] as item}
      <div><img src={item} alt="" /></div>
    {/each}
  </TinySlider>
</section>

<style>
  @import "tailwindcss";

  :global(:root) {
    color-scheme: light dark;
  }

  :global(body) {
    background: light-dark(white, black);
  }

  section {
    width: 200px;
  }
</style>
