# Svelte Tiny Slider

Svelte Tiny Slider is an easy to use highly customizable and unopinionated carousel or slider. There is little to no styling and how you structure your content is up to you. Images, videos, or any other element will work. Works with touch and keyboard controls. Made with accessiblity in mind.

[![npm version](https://badgen.net/npm/v/svelte-tiny-slider)](https://www.npmjs.com/package/svelte-tiny-slider)
[![npm downloads](https://badgen.net/npm/dt/svelte-tiny-slider)](https://www.npmjs.com/package/svelte-tiny-slider)
[![bundle size](https://badgen.net/bundlephobia/minzip/svelte-tiny-slider)](https://bundlephobia.com/package/svelte-tiny-slider)

The package is less than 250 bytes gzipped ([Bundlephopbia](https://bundlephobia.com/package/svelte-tiny-slider)) and has no dependencies.

**Demo and Docs**: https://mitcheljager.github.io/svelte-tiny-slider/

### Installation

Install using Yarn or NPM.
```js
yarn add svelte-tiny-slider
```
```js
npm install --save svelte-tiny-slider
```

Include the component in your app.
```js
import { TinySlider } from "svelte-tiny-slider"
```
```svelte
<TinySlider>
  ...
</TinySlider>
```

## Usage

For detailed documentation on every property check out: [https://mitcheljager.github.io/svelte-tiny-slider/](https://mitcheljager.github.io/svelte-tiny-slider/)

### Configuration

#### Properties

| Property | Default | Description |
|---|---|---|
| gap | 0 | Gap between each item. Can be any CSS value. |
| fill | true | Boolean to set whether the slider is always filled fully when at the end. |
| transitionDuration | 300 | Transition between items in milliseconds. |
| threshold | 30 | Value in pixels for when you navigate when using drag controls. |
| currentIndex | 0 | Index of the current slide (Read only). |
| shown | [] | Array of all shown indexes (Read only). |
| sliderWidth | 0 | Box width in pixels of the slider as it is on the page (Read only). |
| maxWidth | 0 | Full width in pixels of all items together (Read only). |
| currentScrollPosition | 0 | Current position in the slider in pixels (Read only). |
| reachedEnd | false | Boolean that is set to true when you have reached the end of the slider (Read only). |
| distanceToEnd | 0 | Distance in pixels until you reach the end of the slider (Read only). |

#### Function

| Name | Properties | Description |
|---|---|---|
| setIndex | index | Used to set the slider to the specified index. |

#### Events

| Name | Description |
|---|---|
| end | Fired when the end of the slider has been reached. |
