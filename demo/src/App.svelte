<script>
	import { TinyGallery } from "svelte-tiny-gallery"

	const items = [
    `https://source.unsplash.com/random?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random?cache=${Math.random() * 1000}`,
		`https://source.unsplash.com/random?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random?cache=${Math.random() * 1000}`,
		`https://source.unsplash.com/random?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random?cache=${Math.random() * 1000}`
	]

	const portaitItems = [
    `https://source.unsplash.com/random/200x300?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random/200x300?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random/200x300?cache=${Math.random() * 1000}`,
		`https://source.unsplash.com/random/200x300?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random/200x300?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random/200x300?cache=${Math.random() * 1000}`,
		`https://source.unsplash.com/random/200x300?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random/200x300?cache=${Math.random() * 1000}`,
    `https://source.unsplash.com/random/200x300?cache=${Math.random() * 1000}`
	]

	// let setIndex
	// let currentIndex
</script>



<div class="wrapper">
	<TinyGallery let:setIndex let:currentIndex let:galleryWidth>
		{#each items as item}
			<div
				class="item"
				style:--width="{galleryWidth}px"
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
	</TinyGallery>

	<!-- <div>
		<div on:click={() => setIndex(2)}>set active to 2</div>
	</div> -->

	<TinyGallery let:setIndex let:currentIndex let:galleryWidth>
		{#each portaitItems as item}
			<div class="item" style:--width="200px">
				<img src={item} alt="" />
			</div>
		{/each}
	</TinyGallery>
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

	:global(.gallery) {
		margin: 0 -0.5rem;
		border-radius: 0.25rem;
		background: var(--bg-well);
		overflow: hidden;
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

	button {
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

	button:hover {
		background: var(--primary-light);
	}

	button:focus-visible:not(:active) {
		outline: 3px solid var(--text-color-lightest);
	}

	button:active {
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
</style>
