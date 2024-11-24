<script>
	import { BROWSER } from "esm-env"
  import { onMount, onDestroy } from "svelte"

  /** @type {{gap?: string, fill?: boolean, transitionDuration?: number, threshold?: number, currentIndex?: number, shown?: any, sliderWidth?: number, currentScrollPosition?: number, maxWidth?: number, reachedEnd?: boolean, distanceToEnd?: number, end?: function, change?: function, children?: import('svelte').Snippet<[any]>, controls?: import('svelte').Snippet<[any]>}} */
  let {
    gap = "0",
    fill = true,
    transitionDuration = 300,
    threshold = 30,
    currentIndex = $bindable(0),
    shown = $bindable([]),
    sliderWidth = $bindable(0),
    currentScrollPosition = $bindable(0),
    maxWidth = $bindable(0),
    reachedEnd = $bindable(false),
    distanceToEnd = $bindable(0),
    end = () => null,
    change = () => null,
    children,
    controls
  } = $props();

  let isDragging = $state(false)
  let passedThreshold = $state(false)
  let movementStartX = 0
  let finalScrollPosition = 0
  let sliderElement = $state()
  let contentElement = $state()
  let observer

  $effect(() => {
    if (contentElement) setShown()
    if (contentElement) distanceToEnd = maxWidth - currentScrollPosition - sliderWidth
  })

  onMount(createResizeObserver)
  onDestroy(() => { if (observer) observer.disconnect(contentElement) })

  export function setIndex(i) {
    const length = contentElement.children.length

    if (i < 0) i = 0
    if (i > length - 1) i = length - 1

    snapToPosition({ setIndex: i })
    setShown()
  }

  function down(event) {
    if (!isCurrentSlider(event.target)) return

    event.preventDefault()

    movementStartX = event.pageX || event.touches[0].pageX
    isDragging = true
  }

  function up() {
    if (!isDragging) return

    if (!passedThreshold) {
      snapToPosition({ setIndex: currentIndex })
    } else {
      const difference = currentScrollPosition - finalScrollPosition
      const direction = difference > 0 ? 1 : -1

      if (difference != 0) snapToPosition({ direction })
    }

    isDragging = false
    passedThreshold = false
  }

  function move(event) {
    if (!isDragging) return

    passedThreshold = Math.abs(currentScrollPosition - finalScrollPosition) > threshold

    let pageX = event.pageX || event.touches[0].pageX

    setScrollPosition(finalScrollPosition + (movementStartX - pageX))
    setShown()
  }

  function keydown(event) {
    if (!isCurrentSlider(document.activeElement)) return

    if (event.key != "ArrowLeft" && event.key != "ArrowRight") return

    if (event.key == "ArrowLeft") setIndex(currentIndex - 1)
    if (event.key == "ArrowRight") setIndex(currentIndex + 1)
  }

  function snapToPosition({ setIndex = -1, direction = 1 } = {}) {
    const offsets = getItemOffsets()
    const startIndex = currentIndex

    currentIndex = 0

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

    if (change && currentIndex != startIndex) change(currentIndex)
  }

  function setScrollPosition(left, limit = false) {
    currentScrollPosition = left

    const endSize = maxWidth - sliderWidth

    reachedEnd = currentScrollPosition >= endSize
    if (!reachedEnd) return

    if (end) end()

    if (fill && limit) currentScrollPosition = endSize
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

  function createResizeObserver() {
    if (!BROWSER) return

    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize
        maxWidth = contentBoxSize.inlineSize
      }
    })

    observer.observe(contentElement)
  }

  function isCurrentSlider(element) {
    return element == sliderElement || element.closest(".slider") == sliderElement
  }
</script>

<svelte:window
  onmousedown={down}
  onmouseup={up}
  onmousemove={move}
  ontouchstart={down}
  ontouchend={up}
  ontouchmove={move}
  onkeydown={keydown} />

<div class="slider" class:dragging={isDragging} class:passed-threshold={passedThreshold} bind:this={sliderElement} bind:clientWidth={sliderWidth} tabindex="-1">
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    bind:this={contentElement}
    tabindex="0"
    class="slider-content"
    style:transform="translateX({currentScrollPosition * -1}px)"
    style:transition-duration="{isDragging ? 0 : transitionDuration}ms"
    style:--gap={parseFloat(gap || "0") ? gap : null}>
    {@render children?.({ sliderWidth, shown, currentIndex, setIndex, currentScrollPosition, maxWidth, reachedEnd, distanceToEnd })}
  </div>
</div>

{@render controls?.({ sliderWidth, shown, currentIndex, setIndex, currentScrollPosition, maxWidth, reachedEnd, distanceToEnd })}

<style>
  .slider {
    overflow-x: hidden;
    touch-action: pan-y;
  }

  @media (pointer: fine) {
    .slider.passed-threshold {
      pointer-events: none;
    }
  }

  .slider-content {
    display: flex;
    align-items: flex-start;
    width: fit-content;
    gap: var(--gap, 0);
    user-select: none;
    transition: transform;
  }

  @media (prefers-reduced-motion) {
    .slider-content {
      transition: none;
    }
  }
</style>
