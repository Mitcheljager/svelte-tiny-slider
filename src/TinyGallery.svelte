<script>
  export const setIndex = (i) => snapToPosition({ setIndex: i })

  let currentIndex = 0
  let isDragging = false
  let movementStartX = 0
  let currentScrollPosition = 0
  let finalScrollPosition = 0
  let galleryWrapperElement
  let galleryWidth = 0
  let galleryElement
  let transitionDuration = 300

  function down(event) {
    if (!(event.target == galleryWrapperElement || event.target.closest(".gallery-wrapper") == galleryWrapperElement)) return

    movementStartX = event.pageX
    isDragging = true
  }

  function up() {
    if (!isDragging) return

    const direction = currentScrollPosition > finalScrollPosition ? 1 : -1

    snapToPosition({ direction })

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

  function snapToPosition({ setIndex = -1, direction = 1 } = {}) {
    const sizes = getItemSizes()

    currentIndex = 0
    let total = 0

    let i = 0;
    for (i = 0; i < sizes.length; i++) {
      if (setIndex != -1) {
        if (i >= setIndex) break
      } else if ((direction > 0 && total > currentScrollPosition) || (direction < 0 && total + sizes[currentIndex + 1] > currentScrollPosition)) {
        break
      }

      total += sizes[i]
    }

    currentIndex = i

    setScrollPosition(total)

    finalScrollPosition = currentScrollPosition
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

<slot name="controls" {currentIndex} />



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
  }
</style>
