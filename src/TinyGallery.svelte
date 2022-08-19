<script>
  export const setIndex = (i) => snapToPosition({ setIndex: i })

  export let currentIndex = 0

  let isDragging = false
  let movementStartX = 0
  let currentScrollPosition = 0
  let finalScrollPosition = 0
  let galleryElement
  let galleryWidth = 0
  let contentElement
  let transitionDuration = 300

  function down(event) {
    console.log('down')
    if (!(event.target == galleryElement || event.target.closest(".gallery") == galleryElement)) return

    movementStartX = event.pageX || event.touches[0].pageX
    isDragging = true
  }

  function up() {
    console.log('up')
    if (!isDragging) return

    const direction = currentScrollPosition > finalScrollPosition ? 1 : -1

    snapToPosition({ direction })

    isDragging = false
  }

  function move(event) {
    if (!isDragging) return


    if (event.touches?.length) {
      event.pageX = event.touches[0].pageX
      event.movementX = event.touches[0].pageX - movementStartX
    }

    if (event.pageX + event.movementX < 0 || event.pageX + event.movementX > window.innerWidth) {
      up()
      return
    }

    setScrollPosition(finalScrollPosition + (movementStartX - event.pageX))
  }

  function snapToPosition({ setIndex = -1, direction = 1 } = {}) {
    const sizes = getItemSizes()

    currentIndex = 0

    let sum = 0
    let i = 0;
    for (i = 0; i < sizes.length; i++) {
      if (setIndex != -1) {
        if (i >= setIndex) break
      } else if (
        (direction > 0 && sum > currentScrollPosition) ||
        (direction < 0 && sum + sizes[currentIndex + 1] > currentScrollPosition)) {
        break
      }

      sum += sizes[i]
    }

    currentIndex = i

    setScrollPosition(sum)

    finalScrollPosition = currentScrollPosition
  }

  function setScrollPosition(left) {
    const sizes = getItemSizes()
    left = Math.min(left, sizes.reduce((p, c) => p + c))

    currentScrollPosition = left
  }

  function getItemSizes() {
    return Array.from(contentElement.children).map(item => item.clientWidth)
  }
</script>



<svelte:window on:mousedown={down} on:mouseup={up} on:mousemove={move} on:touchstart={down} on:touchend={up} on:touchmove={move} />



<div class="gallery" bind:this={galleryElement} bind:clientWidth={galleryWidth}>
  <div
    bind:this={contentElement}
    draggable={false}
    class="gallery-content"
    style:transform="translateX({currentScrollPosition * -1}px)"
    style:transition-duration="{isDragging ? 0 : transitionDuration}ms">
    <slot {galleryWidth} />
  </div>
</div>

<slot name="controls" {currentIndex} {setIndex} />



<style>
  .gallery {
    overflow-x: hidden;
  }

  .gallery-content {
    display: flex;
    align-items: flex-start;
    user-select: none;
    transition: transform;
  }

  .gallery :global(img) {
    pointer-events: none;
  }
</style>
