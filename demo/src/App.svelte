<script>
	import Arrow from "./Arrow.svelte"
	import { TinySlider } from "svelte-tiny-slider"

	const items = getItems("editorial")
	const fixedItems = getItems("editorial", "508x350")
	const headerItems = getItems("3d-render", "200x150", 30)
	const cardItems = getItems("architecture", "320x180", 20)
	let portaitItems = getItems("food-drink", "200x300")

	function getItems(subject, size = "", count = 10, from = 0) {
		const array = []
		for (let i = 1; i <= count; i++) {
			array.push(`https://source.unsplash.com/random${size ? `/${size}` : ''}?${subject}&${from + i}`)
		}

		return array
	}

	let sliderWidth
	let distanceToEnd

	$: if (distanceToEnd < sliderWidth)
		portaitItems = [...portaitItems, ...getItems("fashion", "200x300", 10, portaitItems.length)]
</script>



<header>
	<h1><mark>Svelte</mark>&nbsp;Tiny&nbsp;Slider</h1>

	<TinySlider>
		{#each headerItems as item}
			<img loading="lazy" src={item} width="200" height="150" alt="" />
		{/each}
	</TinySlider>
</header>

<div class="wrapper">
	<div class="block">
		<p>Svelte Tiny Slider is an easy to use highly customizable and unopinionated carousel or slider. There is little to no styling and how you structure your content is up to you. Works with touch and keyboard controls. Made with accessiblity in mind.</p>

		<p><a href="https://github.com/Mitcheljager/svelte-tiny-linked-charts">GitHub</a></p>

		<h2>Installation</h2>

		<p>Install using Yarn or NPM.</p>

		<code class="well">
			yarn add <mark>svelte-tiny-slider</mark>
		</code>

		<code class="well">
			npm install --save <mark>svelte-tiny-slider</mark>
		</code>

		<p>Include the slider in your app.</p>

		<code class="well">
			import &#123; <mark>TinySlider</mark> &#125; from "<mark>svelte-tiny-slider</mark>"
		</code>

		<code class="well">
			&lt;<mark>TinySlider</mark>&gt;
				...
			&lt;/<mark>TinySlider</mark>&gt;
		</code>
	</div>

	<h2>Usage</h2>

	<div class="block">
		<p>In it's most basic state the slider is just a horizontal carousel that can only be controlled through dragging the image either with your mouse or with touch controls. The carousel items can be whatever you want them to be, in this case we're using images.</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark>&gt; <br>
				&nbsp;&nbsp;&#123;#each items as item&#125; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; alt="" /&gt; <br>
				&nbsp;&nbsp;&#123;/each&#125; <br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<TinySlider>
			{#each fixedItems as item}
				<img src={item} alt="" />
			{/each}
		</TinySlider>
	</div>

	<div class="block">
		<h3>Controls</h3>

		<p>
			From this point there are several options to any kind of controls you can think of. There are several ways you can add controls. The easiest way is to use <code class="inline">slot="<mark>controls</mark>"</code> and use it's slot props.
		</p>

		<ul>
			<li><mark>setIndex</mark> is a function that accepts an index of the slide you want to navigate to.</li>
			<li><mark>currentIndex</mark> is an integer of the index you are current only on.</li>
		</ul>

		<p>
			In this example we are using <code class="inline">svelte:fragment</code> but it could be any element you want it to be. Styling isn't included in this code example.
		</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> let:<mark>setIndex</mark> let:<mark>currentIndex</mark>&gt; <br>
				&nbsp;&nbsp;&#123;#each items as item&#125; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; alt="" /&gt; <br>
				&nbsp;&nbsp;&#123;/each&#125; <br>
				<br>
				&nbsp;&nbsp;&lt;svelte:fragment slot="<mark>controls</mark>"&gt; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;#if <mark>currentIndex</mark> &gt; 0&#125; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;button on:click=&#123;() =&gt; <mark>setIndex</mark>(<mark>currentIndex</mark> - 1)&#125;&gt;...&lt;/button&gt; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;/if&#125; <br>
				<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;#if <mark>currentIndex</mark> &lt; portaitItems.length - 1&#125; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;button on:click=&#123;() =&gt; <mark>setIndex</mark>(<mark>currentIndex</mark> + 1)&#125;&gt;...&lt;/button&gt; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;/if&#125; <br>
				&nbsp;&nbsp;&lt;/svelte:fragment&gt; <br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<div class="relative">
			<TinySlider let:setIndex let:currentIndex>
				{#each fixedItems as item}
					<img src={item} alt="" />
				{/each}

				<svelte:fragment slot="controls">
					{#if currentIndex > 0}
						<button class="arrow left" on:click={() => setIndex(currentIndex - 1)}><Arrow /></button>
					{/if}

					{#if currentIndex < items.length - 1}
						<button class="arrow right" on:click={() => setIndex(currentIndex + 1)}><Arrow direction="right" /></button>
					{/if}
				</svelte:fragment>
			</TinySlider>
		</div>
	</div>

	<div class="block">
		<TinySlider gap="0.5rem" let:setIndex let:currentIndex let:sliderWidth on:end={() => console.log('reached end')}>
			{#each items as item}
				<div
					class="item"
					style:--width="{sliderWidth}px"
					style:--height="400px">
					<img loading="lazy" src={item} alt="" />
				</div>
			{/each}

			<div slot="controls" class="dots">
				{#each items as item, i}
					<button
						class="dot"
						class:active={i == currentIndex}
						on:click={() => setIndex(i)}
						on:focus={() => setIndex(i)}>
						<img loading="lazy" src={item} alt="" height=60 />
					</button>
				{/each}
			</div>
		</TinySlider>
	</div>

	<!-- <div>
		<div on:click={() => setIndex(2)}>set active to 2</div>
	</div> -->

	<div class="block">
		<div class="relative">
			<div class="slider-wrapper">
				<TinySlider gap="0.5rem" let:setIndex let:currentIndex let:shown bind:distanceToEnd bind:sliderWidth>
					{#each portaitItems as item, index}
						<div class="item" style:--width="200px" style:--height="300px">
							{#if [index, index + 1, index - 1].some(i => shown.includes(i))}
								<img loading="lazy" src={item} alt="" />
							{/if}
						</div>
					{/each}

					<svelte:fragment slot="controls">
						{#if currentIndex > 0}
							<button class="arrow left" on:click={() => setIndex(currentIndex - 2)}><Arrow /></button>
						{/if}

						{#if currentIndex < portaitItems.length - 1}
							<button class="arrow right" on:click={() => setIndex(currentIndex + 2)}><Arrow direction="right" /></button>
						{/if}
					</svelte:fragment>
				</TinySlider>
			</div>
		</div>
	</div>

	<div class="block">
		<div class="slider-wrapper">
			<TinySlider gap="0.5rem" fill={false} let:setIndex let:currentIndex let:shown>
				{#each { length: 20 } as _}
					<div class="item" style:background-color="hsl({Math.floor(Math.random() * 360)}, 80%, 50%)" style:--width="200px" style:--height="200px">
						<strong>Word</strong>
					</div>
				{/each}
			</TinySlider>
		</div>
	</div>

	<div class="block">
		<div class="slider-wrapper">
			<TinySlider gap="0.5rem" fill={false}>
				{#each { length: 20 } as _}
					<div class="item" style:--width="200px" style:--height="200px" on:click={() => console.log('click')}>
						<a href="https://google.com" target="_blank">Link</a>
					</div>
				{/each}
			</TinySlider>
		</div>
	</div>
</div>

<div class="cards">
	<TinySlider gap="1rem" let:setIndex let:currentIndex let:shown let:reachedEnd>
		{#each cardItems as item, index}
			<div class="card" style:--width="200px" style:--height="200px" on:click={() => console.log('click')}>
				<a class="thumbnail" href="https://google.com" target="_blank">
					{#if [index, index + 1, index - 1].some(i => shown.includes(i))}
						<img loading="lazy" src={item} alt="" />
					{/if}
				</a>

				<a class="title" href="https://google.com" target="_blank">Card with links</a>

				<p>
					I am some description to some topic that spans multiple lines.
				</p>

				<a class="button" href="#" on:click|preventDefault>Take me there!</a>
			</div>
		{/each}

		<svelte:fragment slot="controls">
			{#if currentIndex > 0}
				<button class="arrow left" on:click={() => setIndex(currentIndex - 2)}><Arrow /></button>
			{/if}

			{#if !reachedEnd}
				<button class="arrow right" on:click={() => setIndex(currentIndex + 2)}><Arrow direction="right" /></button>
			{/if}
		</svelte:fragment>
	</TinySlider>
</div>

<div class="wrapper">

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

	* {
		box-sizing: border-box;
	}

	header {
		position: relative;
	}

	header h1 {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateY(-50%) translateX(-50%);
		padding: 0.5rem 1rem;
		margin: 0;
		background: var(--bg-body);
		text-align: center;
		font-size: clamp(2rem, 7vw, 3rem);
		pointer-events: none;
		z-index: 10;
	}

	.slider-wrapper {
		overflow: hidden;
		border-radius: 0.25rem;
	}

	:global(.slider:focus-within),
	.slider-wrapper:focus-within {
    outline: 2px solid white;
		outline-offset: 2px;
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
		height: var(--height, 100%);
		border-radius: 0.25rem;
		background: var(--bg-well);
		overflow: hidden;
		color: white;
	}

	.item img {
		max-width: 100%;
		height: auto;
	}

	.cards {
		position: relative;
		padding: 3rem 0;
	}

	.cards :global(.slider) {
		padding: 0 1rem;
	}

	.cards .arrow {
		left: 3rem;
		background: var(--border-color);
	}

	.cards .arrow.right {
		right: 3rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		width: clamp(200px, 20vw, 300px);
		border-radius: 1rem;
		background: var(--bg-well);
	}

	.card a:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
	}

	.card p {
		margin: 0;
	}

	@keyframes gradient-shine {
		from { transform: translateX(-100%) }
		to { transform: translateX(100%) }
	}

	.card .thumbnail {
		position: relative;
		width: 100%;
		aspect-ratio: 16/9;
		border-radius: 1rem;
		background: var(--bg-body);
		overflow: hidden;
	}

	.card .thumbnail::after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: linear-gradient(to right, var(--bg-body), var(--border-color), var(--bg-body));
		animation: gradient-shine 500ms infinite;
	}

	.card .title {
		font-size: 1.25rem;
		font-weight: bold;
		color: var(--text-color-lightest);
		text-decoration: none;
	}

	.card .title:hover {
		text-decoration: underline
	}

	.card img {
		position: relative;
		width: 100%;
		z-index: 2;
	}

	.card img:hover {
		filter: brightness(1.2);
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
		background: var(--text-color-lightest);
		transform: translateX(-50%) translateY(-50%);
		font-size: 1.5rem;
		line-height: 1.5rem;
		font-family: inherit;
		text-align: center;
		font-weight: bold;
		color: white;
		z-index: 2;
		cursor: pointer;
	}

	.arrow :global(svg) {
		height: 18px;
		width: 18px;
	}

	.arrow :global(svg path) {
		fill: var(--bg-body);
	}

	.arrow:hover {
		background: var(--text-color-light);
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
		text-decoration: none;
		text-align: center;
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
		padding: 0 1rem;
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
