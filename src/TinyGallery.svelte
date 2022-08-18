<script>
  export let index = 0

  let active = 0
  let isDragging = false
  let movementStartX = 0
  let currentScrollPosition = 0
  let finalScrollPosition = 0
  let galleryWrapperElement
  let galleryWidth = 0
  let galleryElement
  let transitionDuration = 300

  // $: setActive(index)

  function down(event) {
    if (!(event.target == galleryWrapperElement || event.target.closest(".gallery-wrapper") == galleryWrapperElement)) return

    movementStartX = event.pageX
    isDragging = true
  }

  function up() {
    if (!isDragging) return

    snapToPosition()

    finalScrollPosition = currentScrollPosition
    isDragging = false
  }

  function move(event) {
    if (!isDragging) return

    if (event.pageX + event.movementX < 0 || event.pageX + event.movementX > window.innerWidth) {
      up()
      return
    }

    setScrollPosition(finalScrollPosition + (movementStartX - event.pageX))
  }

  function snapToPosition() {
    const sizes = getItemSizes()

    const direction = currentScrollPosition > finalScrollPosition ? 1 : -1

    active = 0
    const total = sizes.reduce((previous, current, index) => {
      if (((direction > 0 && previous - current > currentScrollPosition)) || (direction < 0 && previous > currentScrollPosition)) return previous
      active = index
      return previous + current
    })

    const position = total - sizes[sizes.length - 1]

    setScrollPosition(position)
  }

  function setScrollPosition(left) {
    const sizes = getItemSizes()
    left = Math.min(left, sizes.reduce((p, c) => p + c))

    currentScrollPosition = left
  }

  function getItemSizes() {
    return Array.from(galleryElement.children).map(item => item.width)
  }
</script>


<svelte:window on:mousedown={down} on:mouseup={up} on:mousemove={move} />


<div class="gallery-wrapper" bind:this={galleryWrapperElement} bind:clientWidth={galleryWidth}>
  <div
    bind:this={galleryElement}
    draggable={false}
    class="gallery"
    style:transform="translateX({currentScrollPosition * -1}px)"
    style:transition-duration="{isDragging ? 0 : transitionDuration}ms">
    <slot {galleryWidth} />
  </div>
</div>

<slot name="controls" {active} />



<style>
  .gallery-wrapper {
    overflow-x: hidden;
  }

  .gallery {
    display: flex;
    align-items: flex-start;
    user-select: none;
    transition: transform;
  }

  .gallery :global(img) {
    pointer-events: none;
    height: auto;
  }
</style>
