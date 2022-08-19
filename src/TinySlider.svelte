<script>
  export let currentIndex = 0

  let isDragging = false
  let movementStartX = 0
  let currentScrollPosition = 0
  let finalScrollPosition = 0
  let sliderElement
  let sliderWidth = 0
  let contentElement
  let transitionDuration = 300

  export function setIndex(i) {
    const length = getItemSizes().length

    if (i < 0) i = 0
    if (i > length - 1) i = length - 1

    return snapToPosition({ setIndex: i })
  }

  function down(event) {
    if (event.target != sliderElement && event.target.closest(".slider") != sliderElement) return

    movementStartX = event.pageX || event.touches[0].pageX
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
    const total = sizes.reduce((p, c) => p + c)

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

    currentIndex = Math.min(i, sizes.length - 1)

    sum = Math.min(sum, total - sliderWidth)

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



<div class="slider" bind:this={sliderElement} bind:clientWidth={sliderWidth}>
  <div
    bind:this={contentElement}
    draggable={false}
    class="slider-content"
    style:transform="translateX({currentScrollPosition * -1}px)"
    style:transition-duration="{isDragging ? 0 : transitionDuration}ms">
    <slot {sliderWidth} />
  </div>
</div>

<slot name="controls" {currentIndex} {setIndex} />




<style>
  .slider {
    overflow-x: hidden;
  }

  .slider-content {
    display: flex;
    align-items: flex-start;
    user-select: none;
    transition: transform;
  }

  .slider :global(img) {
    pointer-events: none;
  }
</style>
