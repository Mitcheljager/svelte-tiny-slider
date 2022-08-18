<script>
  let active = 0
  let isDragging = false
  let movementStartX = 0
  let currentScrollPosition = 0
  let finalScrollPosition = 0
  let galleryWrapperElement
  let galleryElement
  let transitionDuration = 500

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

    active += currentScrollPosition > finalScrollPosition ? 1 : -1

    console.log(active)

    const total = sizes.reduce((previous, current, index) => {
      if (index > active) return previous
      return previous + current
    })

    const position = total - sizes[sizes.length - 1]

    setScrollPosition(position)
  }

  function setScrollPosition(left) {
    const sizes = getItemSizes()
    left = Math.min(Math.max(0, left), sizes.reduce((p, c) => p + c))

    currentScrollPosition = left
  }

  function getItemSizes() {
    return Array.from(galleryElement.children).map(item => item.width)
  }
</script>


<svelte:window on:mousedown={down} on:mouseup={up} on:mousemove={move} />


<div class="gallery-wrapper" bind:this={galleryWrapperElement}>
  <div
    bind:this={galleryElement}
    draggable={false}
    class="gallery"
    style:transform="translateX({currentScrollPosition * -1}px)"
    style:transition-duration="{isDragging ? 0 : transitionDuration}ms">
    <slot />
  </div>
</div>

<slot name="controls" {active} />



<style>
  .gallery-wrapper {
    overflow-x: hidden;
  }

  .gallery {
    display: flex;
    user-select: none;
    transition: transform;
  }

  .gallery :global(> *) {
    height: 100%;
    width: auto;
  }

  .gallery :global(img) {
    pointer-events: none;
  }
</style>
