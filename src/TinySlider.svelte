<script>
  import { createEventDispatcher } from 'svelte'

  export let gap = 0
  export let snap = true
  export let fill = true
  export let transitionDuration = 300
  export let currentIndex = 0
  export let shown = []
  export let sliderWidth = 0
  export let currentScrollPosition = 0
  export let maxWidth = 0

  let isDragging = false
  let movementStartX = 0
  let finalScrollPosition = 0
  let sliderElement
  let contentElement

  const dispatch = createEventDispatcher()

  $: if (contentElement) setShown()

  export function setIndex(i) {
    const length = contentElement.children.length

    if (i < 0) i = 0
    if (i > length - 1) i = length - 1

    snapToPosition({ setIndex: i })
    setShown()
  }

  function down(event) {
    if (event.target != sliderElement && event.target.closest(".slider") != sliderElement) return

    movementStartX = event.pageX || event.touches[0].pageX
    isDragging = true
  }

  function up() {
    if (!isDragging) return

    const difference  = currentScrollPosition - finalScrollPosition
    const direction = difference > 0 ? 1 : -1

    if (difference != 0 && snap) snapToPosition({ direction })

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
    setShown()
  }

  function snapToPosition({ setIndex = -1, direction = 1 } = {}) {
    const offsets = getItemOffsets()

    currentIndex = 0

    console.log('snap')

    let i;
    for (i = 0; i < offsets.length; i++) {
      if (setIndex != -1) {
        if (i >= setIndex) break
      } else if (
        (direction > 0 && offsets[i] > currentScrollPosition) ||
        (direction < 0 && offsets[i + 1] > currentScrollPosition)) {
        break
      }
    }

    currentIndex = Math.min(i, getContentChildren().length - 1)
    setScrollPosition(offsets[currentIndex], true)
    finalScrollPosition = currentScrollPosition
  }

  function setScrollPosition(left, limit = false) {
    currentScrollPosition = left

    const end = maxWidth - sliderWidth
    if (currentScrollPosition < end) return
    dispatch("end")
    if (fill && limit) currentScrollPosition = end
  }

  function setShown() {
    const offsets = getItemOffsets()

    Array.from(offsets).forEach((offset, index) => {
      if (currentScrollPosition + sliderWidth < offset) return
      if (!shown.includes(index)) shown = [...shown, index]
    })
  }

  function getItemOffsets() {
    return getContentChildren().map(item => item.offsetLeft)
  }

  function getContentChildren() {
    return Array.from(contentElement.children).filter(c => c.src != "about:blank")
  }
</script>



<svelte:window on:mousedown={down} on:mouseup={up} on:mousemove={move} on:touchstart={down} on:touchend={up} on:touchmove={move} />



<div class="slider" class:dragging={isDragging} bind:this={sliderElement} bind:clientWidth={sliderWidth}>
  <div
    bind:this={contentElement}
    bind:clientWidth={maxWidth}
    draggable={false}
    class="slider-content"
    style:transform="translateX({currentScrollPosition * -1}px)"
    style:transition-duration="{isDragging ? 0 : transitionDuration}ms"
    style:--gap={gap}>
    <slot {sliderWidth} {shown} {currentIndex} {setIndex} {currentScrollPosition} {maxWidth} />
  </div>
</div>

<slot name="controls" />




<style>
  .slider {
    overflow-x: hidden;
  }

  .slider.dragging {
    pointer-events: none;
  }

  .slider-content {
    display: flex;
    align-items: flex-start;
    width: fit-content;
    gap: var(--gap, 0);
    user-select: none;
    transition: transform;
  }

  .slider :global(img) {
    pointer-events: none;
  }
</style>
