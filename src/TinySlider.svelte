<script>
  import { createEventDispatcher } from 'svelte'

  export let gap = 0
  export let snap = true
  export let currentIndex = 0
  export let shown = []

  let isDragging = false
  let movementStartX = 0
  let currentScrollPosition = 0
  let finalScrollPosition = 0
  let sliderElement
  let sliderWidth = 0
  let contentElement
  let transitionDuration = 300

  const dispatch = createEventDispatcher()

  $: if (contentElement) setShown()

  export function setIndex(i) {
    const length = contentElement.children.length

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

    if (snap) snapToPosition({ direction })

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

    let i = 0;
    for (i = 0; i < offsets.length; i++) {
      if (setIndex != -1) {
        if (i >= setIndex) break
      } else if (
        (direction > 0 && offsets[i] > currentScrollPosition) ||
        (direction < 0 && offsets[i + 1] > currentScrollPosition)) {
        break
      }
    }

    currentIndex = Math.min(i, offsets.length - 1)

    const maxWidth = contentElement.outerWidth - sliderWidth
    if (offsets[i] > maxWidth) {
      currentIndex = offsets.length - 1
      dispatch("end")
    }

    setScrollPosition(offsets[currentIndex])

    finalScrollPosition = currentScrollPosition
  }

  function setScrollPosition(left) {
    currentScrollPosition = left
  }

  function setShown() {
    const offsets = getItemOffsets()

    Array.from(offsets).forEach((offset, index) => {
      if (currentScrollPosition + sliderWidth < offset) return
      if (!shown.includes(index)) shown = [...shown, index]
    })
  }

  function getItemOffsets() {
    return Array.from(contentElement.children).map(item => item.offsetLeft)
  }
</script>



<svelte:window on:mousedown={down} on:mouseup={up} on:mousemove={move} on:touchstart={down} on:touchend={up} on:touchmove={move} />



<div class="slider" bind:this={sliderElement} bind:clientWidth={sliderWidth}>
  <div
    bind:this={contentElement}
    draggable={false}
    class="slider-content"
    style:transform="translateX({currentScrollPosition * -1}px)"
    style:transition-duration="{isDragging ? 0 : transitionDuration}ms"
    style:--gap={gap}>
    <slot {sliderWidth} {shown} {currentIndex} {setIndex} />
  </div>
</div>

<slot name="controls" />




<style>
  .slider {
    overflow-x: hidden;
  }

  .slider-content {
    display: flex;
    align-items: flex-start;
    gap: var(--gap, 0);
    user-select: none;
    transition: transform;
  }

  .slider :global(img) {
    pointer-events: none;
  }
</style>
