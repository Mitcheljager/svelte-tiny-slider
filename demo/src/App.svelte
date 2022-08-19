<script>
	import { TinySlider } from "svelte-tiny-slider"

	const items = [
    `https://source.unsplash.com/random?3d-renders&1`,
    `https://source.unsplash.com/random?3d-renders&2`,
    `https://source.unsplash.com/random?3d-renders&3`,
		`https://source.unsplash.com/random?3d-renders&4`,
    `https://source.unsplash.com/random?3d-renders&5`,
    `https://source.unsplash.com/random?3d-renders&6`,
		`https://source.unsplash.com/random?3d-renders&7`,
    `https://source.unsplash.com/random?3d-renders&8`,
    `https://source.unsplash.com/random?3d-renders&9`,
    `https://source.unsplash.com/random?3d-renders&10`
	]

	const portaitItems = [
    `https://source.unsplash.com/random/200x300?fashion&1`,
    `https://source.unsplash.com/random/200x300?fashion&2`,
    `https://source.unsplash.com/random/200x300?fashion&3`,
		`https://source.unsplash.com/random/200x300?fashion&4`,
    `https://source.unsplash.com/random/200x300?fashion&5`,
    `https://source.unsplash.com/random/200x300?fashion&6`,
		`https://source.unsplash.com/random/200x300?fashion&7`,
    `https://source.unsplash.com/random/200x300?fashion&8`,
    `https://source.unsplash.com/random/200x300?fashion&9`
	]

	let setIndex
	// let currentIndex
</script>



<div class="wrapper">
	<TinySlider bind:setIndex let:currentIndex let:sliderWidth>
		{#each items as item}
			<div
				class="item"
				style:--width="{sliderWidth}px"
				style:--height="400px">
				<img src={item} alt="" />
			</div>
		{/each}

		<div slot="controls" class="dots">
			{#each items as item, i}
				<button
					class="dot"
					class:active={i == currentIndex}
					on:click={() => setIndex(i)}
					on:focus={() => setIndex(i)}>
					<img src={item} alt="" height=40 />
				</button>
			{/each}
		</div>
	</TinySlider>

	<!-- <div>
		<div on:click={() => setIndex(2)}>set active to 2</div>
	</div> -->

	<div class="relative">
		<div class="slider-wrapper">
			<TinySlider let:setIndex let:currentIndex let:sliderWidth>
				{#each portaitItems as item}
					<div class="item" style:--width="200px">
						<img src={item} alt="" />
					</div>
				{/each}

				<svelte:fragment slot="controls">
					{#if currentIndex > 0}
						<button class="arrow left" on:click={() => setIndex(currentIndex - 1)}>←</button>
					{/if}

					{#if currentIndex < portaitItems.length - 1}
						<button class="arrow right" on:click={() => setIndex(currentIndex + 1)}>→</button>
					{/if}
				</svelte:fragment>
			</TinySlider>
		</div>
	</div>
</div>



<style>
	:global(:root) {
		--primary: #ff3e00;
		--primary-light: #ff602b;
		--text-color: #444;
		--text-color-light: #999;
		--text-color-lightest: black;
		--border-color: #edf3f0;
		--bg-well: #f6fafd;
		--bg-body: #fff;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--text-color: #b7c0d1;
			--text-color-light: #8e99af;
			--text-color-lightest: white;
			--border-color: #363d49;
			--bg-well: #21242c;
			--bg-body: #16181d;
		}
	}

	:global(body) {
		padding: 0;
		margin: 0;
		background: var(--bg-body);
		color: var(--text-color);
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		overflow-x: hidden;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(.slider) {
		margin: 0 -0.5rem;
	}

	.slider-wrapper {
		overflow: hidden;
		border-radius: 0.25rem;
	}

	img {
		display: block;
	}

	.item {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 0 0 var(--width);
		width: var(--width);
		height: var(--height);
		padding: 0 0.5rem;
		border-radius: 0.25rem;
		overflow: hidden;
	}

	.item img {
		max-width: 100%;
		height: auto;
		border-radius: 0.25rem;
		overflow: hidden;
	}

	.dots {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}

	.dot {
		padding: 0;
		margin: 0;
		border: 0;
		border-radius: 0.25rem;
		background: gray;
		overflow: hidden;
	}

	.dot:hover {
		background: darkgray;
	}

	.dot.active,
	.dot:focus {
		outline: 2px solid white;
		outline-offset: 2px;
	}

	.dot img {
		display: block;
		width: auto;
	}

	.arrow {
		position: absolute;
		left: 0;
		top: 50%;
		width: 2rem;
		height: 2rem;
		padding: 0;
		margin: 0;
		border: 0;
		border-radius: 50%;
		background: var(--bg-well);
		transform: translateX(-50%) translateY(-50%);
		font-size: 1.5rem;
		line-height: 1.65rem;
		font-family: inherit;
		text-align: center;
		font-weight: bold;
		color: white;
		z-index: 2;
	}

	.arrow.right {
		left: auto;
		right: 0;
		transform: translateX(50%) translateY(-50%);
	}

	h1 {
		display: flex;
		align-items: center;
		margin: 0;
		color: var(--text-color-lightest);
	}

	h2 {
		margin: 3rem 0 1.5rem;
		color: var(--text-color-lightest);
	}

	h3 {
		margin-top: 0;
	}

	code {
		display: block;
		margin-top: 1rem;
		color: var(--text-color-light);
		font-size: .75rem;
		line-height: 1.5em;
	}

	code.inline {
		display: inline;
	}

	mark {
		background: none;
		color: var(--primary);
	}

	a {
		color: var(--primary);
	}

	p:first-child {
		margin-top: 0;
	}

	.button {
		appearance: none;
		-webkit-appearance: none;
		background: var(--primary);
		padding: 0.5rem 0.75rem;
		margin: 0.25rem 0;
		border: 0;
		border-radius: 0.25rem;
		font-size: 1rem;
		color: white;
		cursor: pointer;
		transition: outline 100ms, transform 100ms;
	}

	.button:hover {
		background: var(--primary-light);
	}

	.button:focus-visible:not(:active) {
		outline: 3px solid var(--text-color-lightest);
	}

	.button:active {
		transform: scale(0.95);
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.5rem;
	}

	.button-code-group {
		display: grid;
		grid-template-columns: 7rem auto;
		align-items: center;
		gap: 1rem;
		margin: 0.5rem 0;
	}

	.button-code-group button {
		width: 100%;
	}

	.button-code-group code {
		margin: 0;
	}

	.well {
		padding: .35rem .5rem;
		border-radius: .5rem;
		border: 1px solid var(--border-color);
		background: var(--bg-well);
	}

	.header {
		margin: 6rem 0 0;
	}

	:global(.header svg) {
		width: 100%;
		height: 5px;
	}

	.wrapper {
		max-width: 540px;
		margin: 0 auto;
		padding: 0 1rem 6rem;
	}

	.block {
		padding: 3rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	.description {
		margin-bottom: 1rem;
	}

	@media (min-width: 600px) {
		.description {
			margin-bottom: 0;
		}
	}

	.table {
		display: grid;
		grid-template-columns: 1fr 1fr 3fr;
		grid-gap: 1rem .5rem;
	}

	.table strong {
		color: var(--text-color);
	}

	.table code {
		margin-top: 0;
		line-height: 1.3rem;
	}

	.relative {
		position: relative;
	}
</style>
