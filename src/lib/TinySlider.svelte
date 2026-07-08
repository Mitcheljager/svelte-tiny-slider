<script>
  import { onMount } from "svelte";

  /**
   * @typedef {Object} Props
   * @property {string} [gap] The size of gap between elements, as any valid css value.
   * @property {boolean} [fill] Whether to always fill the full width of the container when reaching the end of the slider.
   * @property {boolean} [vertical] By default the slider works horizontal. Use this option for vertical navigation instead.
   * @property {number} [transitionDuration] The duration of the transition when sliding.
   * @property {number} [threshold] The threshold in pixels at which to move to the next/previous item after dragging. For example, a threshold of 10 means you need to move 10 pixels before the slider moves. Any less and the slider will revert back to the current item.
   * @property {number} [moveThreshold] The threshold in pixels at which the slider will begin to move after dragging. `threshold` will only kick in after this value.
   * @property {number} [currentIndex] The index of the currently shown slide.
   * @property {number[]} [shown] An array of all indexes that have been shown.
   * @property {number} [sliderWidth] The width of the slider in pixels.
   * @property {number} [sliderHeight] Used together with `vertical` to get the height of the slider. Height is in pixels.
   * @property {number} [currentScrollPosition] The current scroll position in pixels.
   * @property {number} [maxWidth] The added up width of all items in the slider. The innerWidth of the slider content.
   * @property {number} [maxHeight] The added up height of all items in the slider. The innerHeight of the slider content.
   * @property {boolean} [reachedEnd] Indicates whether the end of the slider has been reached.
   * @property {number} [distanceToEnd] The distance to the end of the slider in pixels.
   * @property {boolean} [passedThreshold] Whether or not the user has currently passed the threshold value.
   * @property {boolean} [passedMoveThreshold] Whether or not the user has currently passed the moveThreshold value.
   * @property {() => void} [end] Deprecated. Alias for `onend`
   * @property {(index: number) => void} [change] Deprecated. Alias for `onchange`
   * @property {boolean} [allowWheel] Whether or not the user can swipe using their scroll wheel horizontally, most likely using a touchpad on a laptop.
   * @property {() => void} [onend] A callback function triggered when the slider reaches the end.
   * @property {(index: number) => void} [onchange] A callback function triggered when the slider changes.
   * @property {() => void} [onresize] A callback function triggered when the contents of the slider resize.
   * @property {import('svelte').Snippet<[any]>} [children] The children elements of the slider.
   * @property {import('svelte').Snippet<[any]>} [controls] The controls for the slider.
   */

  /** @type {Props} */
  let {
    gap = "0",
    fill = true,
    vertical = false,
    transitionDuration = 300,
    threshold = 30,
    moveThreshold = 0,
    currentIndex = $bindable(0),
    shown = $bindable([]),
    sliderWidth = $bindable(0),
    sliderHeight = $bindable(0),
    currentScrollPosition = $bindable(0),
    maxWidth = $bindable(0),
    maxHeight= $bindable(0),
    reachedEnd = $bindable(false),
    distanceToEnd = $bindable(0),
    passedThreshold = $bindable(false),
    passedMoveThreshold = $bindable(false),
    allowWheel = false,
    end = () => null,
    change = (/** @type {number} */ index) => null,
    onend = end,
    onchange = change,
    onresize = () => null,
    children,
    controls
  } = $props();

  let isDragging = $state(false);
  let isRepositioning = $state(false);
  let movementStartOffset = 0;
  let finalScrollPosition = 0;
  let sliderElement = $state();
  let contentElement = $state();

  /** @type {ResizeObserver | null} */
  let observer = null;

  /** @type {ReturnType<typeof setTimeout> | null} */
  let wheelStopTimeout = null;

  $effect(() => {
    if (contentElement) setShown();
    if (contentElement) distanceToEnd = (vertical ? maxHeight : maxWidth) - currentScrollPosition - (vertical ? sliderHeight : sliderWidth);
  });

  onMount(() => {
    createResizeObserver();

    return () => observer?.disconnect();
  });

  /**
   * @param {number} index
   * @returns {void}
   */
  export function setIndex(index) {
    const length = contentElement.children.length;
    const clamped = Math.max(0, Math.min(index, length - 1));

    snapToPosition({ setIndex: clamped });
    setShown();
  }

  /**
   * @returns {void}
   */
  export function reposition() {
    isRepositioning = true;

    setIndex(currentIndex);

    requestAnimationFrame(() => isRepositioning = false);
  }

  /**
   * @param {TouchEvent | MouseEvent} event
   * @returns {void}
   */
  function down(event) {
    if (!isCurrentSlider(/** @type {Element} */ (event.target))) return;

    event.preventDefault();

    movementStartOffset = getEventPageOffset(event);
    isDragging = true;
  }

  /**
   * @returns {void}
   */
  function up() {
    if (!isDragging) return;

    if (!passedThreshold) {
      snapToPosition({ setIndex: currentIndex });
    } else {
      const difference = currentScrollPosition - finalScrollPosition;
      const direction = difference > 0 ? 1 : -1;

      if (difference != 0) snapToPosition({ direction });
    }

    isDragging = false;
    passedThreshold = false;
  }

  /**
   * @param {TouchEvent | MouseEvent} event
   * @returns {void}
   */
  function move(event) {
    if (!isDragging) return;

    const pageOffset = getEventPageOffset(event);
    const difference = finalScrollPosition + (movementStartOffset - pageOffset);
    const mouseDifference = movementStartOffset - pageOffset;

    passedMoveThreshold = Math.abs(mouseDifference) > moveThreshold;
    passedThreshold = Math.abs(currentScrollPosition - finalScrollPosition) > threshold;

    if (!passedMoveThreshold) return;

    setScrollPosition(difference - moveThreshold * (mouseDifference > 0 ? 1 : -1));
    setShown();
  }

  /**
   * @param {WheelEvent} event
   * @returns {void}
   */
   function onwheel(event) {
    if (!allowWheel) return;

    const { deltaX, deltaY } = event;

    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    event.preventDefault();

    const sensitivity = 20;
    const directionDelta = vertical ? deltaY : deltaX;
    const position = currentScrollPosition + directionDelta * sensitivity * 0.02;

    setScrollPosition(position);
    setShown();

    if (wheelStopTimeout) clearTimeout(wheelStopTimeout);

    wheelStopTimeout = setTimeout(() => {
      snapToPosition({ direction: directionDelta > 0 ? 1 : -1 });
    }, 100);
  }

  /**
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  function keydown(event) {
    if (!isCurrentSlider(document.activeElement)) return;

    if (event.key == "ArrowLeft") setIndex(currentIndex - 1);
    if (event.key == "ArrowRight") setIndex(currentIndex + 1);
  }

  function snapToPosition({ setIndex = -1, direction = 1 } = {}) {
    const offsets = getItemOffsets();
    const startIndex = currentIndex;

    currentIndex = 0;

    let index;
    for (index = 0; index < offsets.length; index++) {
      if (setIndex != -1) {
        if (index >= setIndex) break;
      } else if ((direction > 0 && offsets[index] > currentScrollPosition) || (direction < 0 && offsets[index + 1] > currentScrollPosition)) {
        break;
      }
    }

    currentIndex = Math.min(index, getContentChildren().length - 1);
    setScrollPosition(offsets[currentIndex], true);
    finalScrollPosition = currentScrollPosition;

    if (onchange && currentIndex != startIndex) onchange(currentIndex);
  }

  /**
   * @param {number} offset
   * @param {boolean} limit
   * @returns {void}
   */
  function setScrollPosition(offset, limit = false) {
    currentScrollPosition = offset;

    const size = vertical ? maxHeight : maxWidth;
    const maxSize = vertical ? sliderHeight : sliderWidth;
    const endSize = size - maxSize;
    const sizeKey = vertical ? "clientHeight" : "clientWidth";

    reachedEnd = currentScrollPosition >= endSize;
    if (!reachedEnd) return;

    if (onend) onend();

    if (fill && limit) currentScrollPosition = contentElement[sizeKey] < maxSize ? 0 : endSize;
  }

  /** @returns {void} */
  function setShown() {
    const offsets = getItemOffsets();

    Array.from(offsets).forEach((offset, index) => {
      if (currentScrollPosition + sliderWidth < offset) return;
      if (!shown.includes(index)) shown = [...shown, index];
    });
  }

  /**
   * @param {TouchEvent | MouseEvent} event
   * @returns {number}
   */
  function getEventPageOffset(event) {
    const key = vertical ? "pageY" : "pageX";

    return (
      /** @type {MouseEvent} */ (event)[key] ??
      /** @type {TouchEvent} */ (event).touches?.[0]?.[key]
    );
  }

  /** @returns {number[]} */
  function getItemOffsets() {
    return getContentChildren().map(item => vertical ? item.offsetTop : item.offsetLeft);
  }

  /** @returns {HTMLElement[]} */
  function getContentChildren() {
    // @ts-ignore
    return Array.from(contentElement.children).filter(c => c instanceof HTMLElement).filter(c => c.src != "about:blank");
  }

  /** @returns {void} */
  function createResizeObserver() {
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
        maxWidth = contentBoxSize.inlineSize;
        maxHeight = contentBoxSize.blockSize;
      }

      onresize();
    });

    observer.observe(contentElement);
  }

  /**
   * @param {Element | null} element
   * @returns {boolean}
   */
  function isCurrentSlider(element) {
    return element === sliderElement || element?.closest(".slider") === sliderElement;
  }
</script>

<svelte:window
  onmousedown={down}
  onmouseup={up}
  onmousemove={move}
  ontouchstart={down}
  ontouchend={up}
  ontouchmove={move}
  onkeydown={keydown}
  onresize={reposition} />

<div
  class="slider"
  class:dragging={isDragging}
  class:passed-threshold={passedThreshold}
  class:vertical
  tabindex="-1"
  bind:this={sliderElement}
  bind:clientWidth={sliderWidth}
  bind:clientHeight={sliderHeight}
  {onwheel}>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    bind:this={contentElement}
    tabindex="0"
    class="slider-content"
    style:transform="translate{vertical ? "Y" : "X"}({currentScrollPosition * -1}px)"
    style:transition-duration="{isDragging || isRepositioning ? 0 : transitionDuration}ms"
    style:--gap={parseFloat(gap || "0") ? gap : null}>
    {@render children?.({ sliderWidth, sliderHeight, shown, currentIndex, setIndex, currentScrollPosition, maxWidth, reachedEnd, distanceToEnd })}
  </div>
</div>

{@render controls?.({ sliderWidth, sliderHeight, shown, currentIndex, setIndex, currentScrollPosition, maxWidth, reachedEnd, distanceToEnd })}

<style>
  .slider {
    overflow-x: hidden;
    touch-action: pan-y;
  }

  .slider.vertical {
    height: 100%;
    overflow-y: hidden;
    touch-action: pan-x;
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

  .vertical > .slider-content {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>
