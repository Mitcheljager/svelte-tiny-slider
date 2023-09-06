<script>
	import Arrow from "./Arrow.svelte"
	import TinySlider from "$lib/TinySlider.svelte"

	const items = getItems("editorial")
	const fixedItems = getItems("editorial", "508x350")
	const fixedItems2 = getItems("food", "508x350")
	const fixedItems3 = getItems("3d-render", "508x350")
	const fixedItems4 = getItems("nature", "508x350")
	const fixedItems5 = getItems("food-drink", "200x300")
	const fixedItems6 = getItems("experimental", "508x350")
	const fixedItems7 = getItems("fashion", "200x300", 20)
	const fixedItems8 = getItems("abstract", "508x350")
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

	let setIndex
	let currentIndex

	let sliderWidth
	let distanceToEnd

	let thumbnailsSetIndex

	$: if (distanceToEnd < sliderWidth)
		portaitItems = [...portaitItems, ...getItems("food-drink", "200x300", 10, portaitItems.length)]
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
		<p>Svelte Tiny Slider is an easy to use highly customizable and unopinionated carousel or slider. There is little to no styling and how you structure your content is up to you. Images, videos, or any other element will work. Works with touch and keyboard controls. Made with accessibility in mind.</p>

		<p>The package is less than 250 bytes gzipped (<a target="_blank" href="https://bundlephobia.com/package/svelte-tiny-slider">Bundlephobia</a>) and has no dependencies.</p>

		<p><a target="_blank" href="https://github.com/Mitcheljager/svelte-tiny-slider">GitHub</a></p>

		<h2>Installation</h2>

		<p>Install using Yarn or NPM.</p>

		<code class="well">
			yarn add <mark>svelte-tiny-slider</mark> --dev
		</code>

		<code class="well">
			npm install <mark>svelte-tiny-slider</mark> --save-dev
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

		<p>From this point there are several options to add any kind of controls you can think of. There two ways you can add controls. Either via slot props or via exported props using two way binds.</p>

		<h4>Controls via slot props</h4>

		<p>The easiest way is to use <code class="inline">slot="<mark>controls</mark>"</code> and use it's slot props. There are several available props, but for controls the most relevant are:</p>

		<ul>
			<li><mark>setIndex</mark> is a function that accepts an index of the slide you want to navigate to.</li>
			<li><mark>currentIndex</mark> is an integer of the index you are current only on.</li>
		</ul>

		<p>
			In this example we are using <code class="inline">svelte:fragment</code> but it could be any element you want it to be. Styling isn't included in this code example.
		</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> <br>
				&nbsp;&nbsp;&#123;#each items as item&#125; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; alt="" /&gt; <br>
				&nbsp;&nbsp;&#123;/each&#125; <br>
				<br>
				&nbsp;&nbsp;&lt;svelte:fragment slot="<mark>controls</mark>" let:<mark>setIndex</mark> let:<mark>currentIndex</mark>&gt;&gt; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;#if <mark>currentIndex</mark> &gt; 0&#125; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;button on:click=&#123;() =&gt; <mark>setIndex</mark>(<mark>currentIndex</mark> - 1)&#125;&gt;...&lt;/button&gt; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;/if&#125; <br>
				<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;#if <mark>currentIndex</mark> &lt; items.length - 1&#125; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;button on:click=&#123;() =&gt; <mark>setIndex</mark>(<mark>currentIndex</mark> + 1)&#125;&gt;...&lt;/button&gt; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;/if&#125; <br>
				&nbsp;&nbsp;&lt;/svelte:fragment&gt; <br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<div class="relative">
			<TinySlider>
				{#each fixedItems2 as item}
					<img src={item} alt="" />
				{/each}

				<svelte:fragment slot="controls" let:setIndex let:currentIndex>
					{#if currentIndex > 0}
						<button class="arrow left" on:click={() => setIndex(currentIndex - 1)}><Arrow /></button>
					{/if}

					{#if currentIndex < items.length - 1}
						<button class="arrow right" on:click={() => setIndex(currentIndex + 1)}><Arrow direction="right" /></button>
					{/if}
				</svelte:fragment>
			</TinySlider>
		</div>

		<p>We could use the same props to implement some type of dots navigation.</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark>&gt; <br>
				&nbsp;&nbsp;&#123;#each items as item&#125; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; alt="" /&gt; <br>
				&nbsp;&nbsp;&#123;/each&#125; <br>
				<br>
				&nbsp;&nbsp;&lt;div slot="controls" let:<mark>setIndex</mark> let:<mark>currentIndex</mark>&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;#each items as _, i&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;button<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;class:active=&#123;i == <mark>currentIndex</mark>&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;on:click=&#123;() =&gt; <mark>setIndex</mark>(i)&#125; /&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;/each&#125;<br>
				&nbsp;&nbsp;&lt;/div&gt;<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<div class="relative">
			<TinySlider>
				{#each fixedItems4 as item}
					<img src={item} alt="" />
				{/each}

				<div slot="controls" class="dots" let:setIndex let:currentIndex>
					{#each fixedItems4 as _, i}
						<button
							class="dot"
							class:active={i == currentIndex}
							on:click={() => setIndex(i)} />
					{/each}
				</div>
			</TinySlider>
		</div>

		<p>In a similar way we can also add thumbnail navigation.</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark>&gt; <br>
				&nbsp;&nbsp;&#123;#each items as item&#125; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; alt="" /&gt; <br>
				&nbsp;&nbsp;&#123;/each&#125; <br>
				<br>
				&nbsp;&nbsp;&lt;div slot="controls" let:<mark>setIndex</mark> let:<mark>currentIndex</mark>&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;#each items as _, i&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;button<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;class:active=&#123;i == <mark>currentIndex</mark>&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;on:click=&#123;() =&gt; <mark>setIndex</mark>(i)&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;on:focus=&#123;() =&gt; <mark>setIndex</mark>(i)&#125;&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; alt="" height=60 /&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/button&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;/each&#125;<br>
				&nbsp;&nbsp;&lt;/div&gt;<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<div class="relative">
			<TinySlider>
				{#each fixedItems3 as item}
					<img src={item} alt="" />
				{/each}

				<div slot="controls" class="thumbnails grid" let:setIndex let:currentIndex>
					{#each fixedItems3 as item, i}
						<button
							class="thumbnail"
							class:active={i == currentIndex}
							on:click={() => setIndex(i)}
							on:focus={() => setIndex(i)}>
							<img src={item} alt="" height=60 />
						</button>
					{/each}
				</div>
			</TinySlider>
		</div>

		<p>We can go one level deeper and use a slider for the controls of our slider. Here we are using the on:<mark>change</mark> event to move the thumbnails slider when the main slider also moves.</p>

		<div class="relative">
			<TinySlider on:change={({ detail }) => thumbnailsSetIndex(detail)}>
				{#each fixedItems8 as item}
					<img src={item} alt="" />
				{/each}

				<div slot="controls" class="thumbnails relative" let:setIndex let:currentIndex let:reachedEnd>
					<TinySlider gap="0.5rem" let:sliderWidth bind:setIndex={thumbnailsSetIndex}>
						{#each fixedItems8 as item, i}
							<button
								class="thumbnail inset"
								class:active={i == currentIndex}
								style:width="calc((({sliderWidth}px - 2rem) / 5))"
								on:click={() => setIndex(i)}
								on:focus={() => setIndex(i)}>
								<img src={item} alt="" />
							</button>
						{/each}
					</TinySlider>

					{#if currentIndex > 0}
						<button class="arrow left" on:click={() => setIndex(currentIndex - 1)}><Arrow /></button>
					{/if}

					{#if !reachedEnd}
						<button class="arrow right" on:click={() => setIndex(currentIndex + 1)}><Arrow direction="right" /></button>
					{/if}
				</div>
			</TinySlider>
		</div>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> on:<mark>change</mark>=&#123;(&#123; detail &#125;) => thumbnailsSetIndex(detail)&#125;&gt;<br>
				&nbsp;&nbsp;&#123;#each items as item&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; alt="" /&gt;<br>
				&nbsp;&nbsp;&#123;/each&#125;<br>
				<br>
				&nbsp;&nbsp;&lt;div slot="controls" let:setIndex let:currentIndex let:reachedEnd&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;<mark>TinySlider</mark> gap="0.5rem" bind:setIndex=&#123;thumbnailsSetIndex&#125;&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;#each items as item, i&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;button<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;class:active=&#123;i == currentIndex&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;on:click=&#123;() =&gt; setIndex(i)&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;on:focus=&#123;() =&gt; setIndex(i)&#125;&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; alt="" /&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/button&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;/each&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<mark>TinySlider</mark>&gt;<br>
				<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;#if currentIndex &gt; 0&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;button ...&gt;...&lt;/button&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;/if&#125;<br>
				<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;#if !reachedEnd&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;button ...&gt;...&lt;/button&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&#123;/if&#125;<br>
				&nbsp;&nbsp;&lt;/div&gt;<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<h4>Controls via exported props</h4>

		<p>You don't have to control the component from a slot, you can control it from anywhere using two way binds. Declare any variable you want and bind them using <code class="inline">bind</code> instead of <code class="inline">let</code>. The variable <code class="inline">currentIndex</code> can not be directly modified, it should only be used as a reference.</p>

		<p>
			<code class="well">
				&lt;script&gt;<br>
				&nbsp;&nbsp;let <mark>setIndex</mark><br>
				&lt;/script&gt;<br>
				<br>
				&lt;<mark>TinySlider</mark> <mark>bind</mark>:<mark>setIndex</mark>&gt; <br>
				&nbsp;&nbsp;&#123;#each items as item&#125; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; alt="" /&gt; <br>
				&nbsp;&nbsp;&#123;/each&#125; <br>
				&lt;/<mark>TinySlider</mark>&gt;<br>
				<br>
				&lt;button on:click=&#123;() =&gt; <mark>setIndex</mark>(2)&#125;&gt;...&lt;/button&gt;<br>
				&lt;button on:click=&#123;() =&gt; <mark>setIndex</mark>(5)&#125;&gt;...&lt;/button&gt;<br>
				&lt;button on:click=&#123;() =&gt; <mark>setIndex</mark>(9)&#125;&gt;...&lt;/button&gt;<br>
			</code>
		</p>

		<TinySlider bind:setIndex bind:currentIndex>
			{#each fixedItems4 as item}
				<img src={item} alt="" />
			{/each}
		</TinySlider>

		<p>These buttons are not in a <code class="inline">slot</code> and could be placed anywhere on your page.</p>

		<button class="button" on:click={() => setIndex(2)}>Set index to 2</button>
		<button class="button" on:click={() => setIndex(5)}>Set index to 5</button>
		<button class="button" on:click={() => setIndex(9)}>Set index to 9</button>
	</div>


	<div class="block">
		<h3>Styling</h3>

		<p>There is very little css set by default, you're expected to bring your own. But to help you out there's a handful of props that might be of use. You don't need to use any of these, you could do it all with regular css, which we will also go over.</p>

		<h4>Size</h4>

		<p>So far we've only been using one slide at a time. The number of sliders shown is not controlled by a prop, instead you can do it via css. To help you out there's the slot prop <code class="inline">sliderWidth</code>. This is simply the document width of the slider element. Setting the width of your items to <code class="inline">sliderWidth / 3</code> would cause 3 items to show at once. Once again this could be done with a slot prop or a two way bind, which ever you prefer.</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> let:<mark>sliderWidth</mark>&gt;<br>
				&nbsp;&nbsp;&#123;#each items as item&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; width=&#123;<mark>sliderWidth</mark> / 3&#125; /&gt;<br>
				&nbsp;&nbsp;&#123;/each&#125;<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>


		<TinySlider let:sliderWidth>
			{#each fixedItems5 as item}
				<img loading="lazy" src={item} alt="" width={sliderWidth / 3} />
			{/each}
		</TinySlider>

		<h4>Gap</h4>

		<p>
			The gap prop allows you to set a gap between items. All this does is set the css property <code class="inline">gap</code>, so alternatively you could do something like:
		</p>
			<code class="well">
				:global(.slider-content) &#123; <br>
				&nbsp;&nbsp;gap: 10px; <br>
				&#125;
			</code>

		<p>
			But using the <code class="inline">gap</code> prop might be more convenient. Accepts any css value.
		</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> <mark>gap</mark>="10px"&gt; <br>
				&nbsp;&nbsp;&#123;#each items as item&#125; <br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;... <br>
				&nbsp;&nbsp;&#123;/each&#125; <br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<TinySlider gap="10px" let:sliderWidth>
			{#each fixedItems5 as item}
				<img loading="lazy" src={item} alt="" width={(sliderWidth - 20) / 3} />
			{/each}
		</TinySlider>
	</div>

	<div class="block">
		<h3>Content</h3>

		<p>We've been using images as examples so far, but the content can be anything. Any direct child of the slider will be considered a slide. Links and click events will not fire while dragging to prevent accidental clicks.</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> gap="0.5rem"&gt;<br>
				&nbsp;&nbsp;&#123;#each &#123; length: 20 &#125; as _&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;div class="item"&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;a href="https://svelte.dev" target="_blank"&gt;Link&lt;/a&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br>
				&nbsp;&nbsp;&#123;/each&#125;<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<TinySlider gap="0.5rem">
			{#each { length: 20 } as _}
				<div class="item" style:--width="200px" style:--height="200px">
					<a href="https://svelte.dev" target="_blank">Link</a>
				</div>
			{/each}
		</TinySlider>
	</div>

	<div class="block">
		<h3>Lazy Loading</h3>

		<p>When using images you might want to lazy load any images that are not visible. This can be done using native <code class="inline">loading="lazy"</code>, but this comes with some drawbacks. To overcome these drawback there are several properties you can use.</p>

		<p>For a simple slider you might use <code class="inline">currentIndex</code> to hide any images that are above the current index.

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> let:<mark>currentIndex</mark>&gt;<br>
				&nbsp;&nbsp;&#123;#each items as item, i&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;div&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;#if <mark>currentIndex + 1 &gt;= i</mark>&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; alt="" /&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;/if&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br>
				&nbsp;&nbsp;&#123;/each&#125;<br>
				<br>
				&nbsp;&nbsp;...<br>
				&lt;/<mark>TinySlider</mark>&gt;<br>
			</code>
		</p>

		<p>
			Note how this is using currentIndex + 1 to preload one image ahead.
		</p>

		<div class="relative">
			<TinySlider let:sliderWidth let:currentIndex>
				{#each fixedItems6 as item, i}
					<div style:width="{sliderWidth}px">
						{#if currentIndex + 1 >= i}
							<img src={item} alt="" />
						{/if}
					</div>
				{/each}

				<svelte:fragment slot="controls" let:reachedEnd let:setIndex let:currentIndex>
					{#if currentIndex > 0}
						<button class="arrow left" on:click={() => setIndex(currentIndex - 1)}><Arrow /></button>
					{/if}

					{#if !reachedEnd}
						<button class="arrow right" on:click={() => setIndex(currentIndex + 1)}><Arrow direction="right" /></button>
					{/if}
				</svelte:fragment>
			</TinySlider>
		</div>

		<p>
			For sliders with multiple slides shown at once it might get more complicated when using <mark>currentIndex</mark>, especially when you might have different amounts of slides depending on the screen size. For that purpose you could use the <mark>shown</mark> property. This property returns an array of all indexes that have been onscreen at some point. Just like before this can be used either as <mark>let:shown</mark> or <mark>bind:shown</mark>.
		</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> let:<mark>shown</mark>&gt;<br>
				&nbsp;&nbsp;&#123;#each items as item, index&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;div&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;#if <mark>shown</mark>.includes(index)&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src=&#123;item&#125; alt="" /&gt;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;/if&#125;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br>
				&nbsp;&nbsp;&#123;/each&#125;<br>
				<br>
				&nbsp;&nbsp;...<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<div class="relative">
			<div class="slider-wrapper">
				<TinySlider gap="0.5rem" let:shown>
					{#each fixedItems7 as item, index}
						<div class="item" style:--width="200px" style:--height="300px">
							{#if shown.includes(index)}
								<img src={item} alt="" />
							{/if}
						</div>
					{/each}

					<svelte:fragment slot="controls" let:reachedEnd let:setIndex let:currentIndex>
						{#if currentIndex > 0}
							<button class="arrow left" on:click={() => setIndex(currentIndex - 2)}><Arrow /></button>
						{/if}

						{#if !reachedEnd}
							<button class="arrow right" on:click={() => setIndex(currentIndex + 2)}><Arrow direction="right" /></button>
						{/if}
					</svelte:fragment>
				</TinySlider>
			</div>
		</div>
	</div>

	<div class="block">
		<h3>Infinite Loading</h3>

		<p>There are several properties you could use to implement infinite loading, meaning we load more items in when the user has scroll (almost) to the end of the slider.</p>

		<h4>Event</h4>

		<p>You could use the event <mark>on:end</mark>, which fires when the user has reached the end of the slider based on pixels and not on currentIndex.</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> <mark>on:end</mark>=&#123;() =&gt; console.log('Reached end')&#125;&gt;<br>
				&nbsp;&nbsp;...<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<h4>Properties</h4>

		<p>Similarity to the event you could use the property <mark>reachedEnd</mark>. This turns to true at the same time <mark>on:end</mark> is fired. Once again this can be set using either <mark>let:reachedEnd</mark> or <mark>bind:reachedEnd</mark>.</p>

		<p>
			<code class="well">
				&lt;script&gt;<br>
				&nbsp;&nbsp;let <mark>reachedEnd</mark> = false<br>
				&nbsp;&nbsp;$: if (<mark>reachedEnd</mark>) console.log('Reached end')<br>
				&lt;/script&gt;<br>
				<br>
				&lt;<mark>TinySlider</mark> <mark>bind:reachedEnd</mark>&gt;<br>
				&nbsp;&nbsp;...<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<p>You might want to load more items before the user actually reaches the end to make it actually feel infinite. This could be achieved with the <mark>distanceToEnd</mark> property. Once again this can be set using either <mark>let:distanceToEnd</mark> or <mark>bind:distanceToEnd</mark>.</p>

		<p>
			<code class="well">
				&lt;script&gt;<br>
				&nbsp;&nbsp;let <mark>distanceToEnd</mark><br>
				&nbsp;&nbsp;$: if (<mark>distanceToEnd && distanceToEnd &lt; 500</mark>) console.log('Load more')<br>
				&lt;/script&gt;<br>
				<br>
				&lt;<mark>TinySlider</mark> <mark>bind:distanceToEnd</mark>&gt;<br>
				&nbsp;&nbsp;...<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<div class="relative">
			<div class="slider-wrapper">
				<TinySlider gap="0.5rem" bind:distanceToEnd bind:sliderWidth let:shown>
					{#each portaitItems as item, index}
						<div class="item" style:--width="200px" style:--height="300px">
							{#if shown.includes(index)}
							<img src={item} alt="" />
							{/if}
						</div>
					{/each}

					<svelte:fragment slot="controls" let:setIndex let:currentIndex>
						{#if currentIndex > 0}
							<button class="arrow left" on:click={() => setIndex(currentIndex - 2)}><Arrow /></button>
						{/if}

						<button class="arrow right" on:click={() => setIndex(currentIndex + 2)}><Arrow direction="right" /></button>
					</svelte:fragment>
				</TinySlider>
			</div>
		</div>
	</div>

	<div class="block">
		<h3>Other</h3>

		<h4>Fill</h4>

		<p>When showing multiple slides at once by default the slider will always fill out the full width when reaching the end. This behaviour can be disabled using <mark>fill=&#123;false&#125;</mark>.</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> <mark>fill</mark>=&#123;false&#125;&gt;<br>
				&nbsp;&nbsp;...<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<div class="relative">
			<div class="slider-wrapper">
				<TinySlider gap="0.5rem" fill={false}>
					{#each { length: 10 } as _}
						<div class="item" style:background-color="hsl({Math.floor(Math.random() * 360)}, 80%, 50%)" style:--width="200px" style:--height="200px" />
					{/each}

					<svelte:fragment slot="controls" let:setIndex let:currentIndex>
						{#if currentIndex > 0}
							<button class="arrow left" on:click={() => setIndex(currentIndex - 1)}><Arrow /></button>
						{/if}

						{#if currentIndex < 9}
							<button class="arrow right" on:click={() => setIndex(currentIndex + 1)}><Arrow direction="right" /></button>
						{/if}
					</svelte:fragment>
				</TinySlider>
			</div>
		</div>

		<h4>Transition Duration</h4>

		<p>The slider will always snap to the left side of one of the slides. The speed at which this happens can be set using the <mark>transitionDuration</mark> property. This value is given in milliseconds. This defaults to 300.</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> <mark>transitionDuration</mark>="1000"&gt;<br>
				&nbsp;&nbsp;...<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<div class="relative">
			<div class="slider-wrapper">
				<TinySlider gap="0.5rem" transitionDuration="1000">
					{#each { length: 10 } as _}
						<div class="item" style:background-color="hsl({Math.floor(Math.random() * 360)}, 80%, 50%)" style:--width="200px" style:--height="200px" />
					{/each}

					<svelte:fragment slot="controls" let:setIndex let:currentIndex let:reachedEnd>
						{#if currentIndex > 0}
							<button class="arrow left" on:click={() => setIndex(currentIndex - 1)}><Arrow /></button>
						{/if}

						{#if !reachedEnd}
							<button class="arrow right" on:click={() => setIndex(currentIndex + 1)}><Arrow direction="right" /></button>
						{/if}
					</svelte:fragment>
				</TinySlider>
			</div>
		</div>

		<h4>Threshold</h4>

		<p>When dragging the slider it will not transition to the next slide until a certain threshold has been passed to prevent accidental sliding. This also determines when a link or click event is disabled. This can be set using the <mark>threshold</mark> property. This value is given in pixels. This defaults to 30.</p>

		<p>
			<code class="well">
				&lt;<mark>TinySlider</mark> <mark>threshold</mark>="100"&gt;<br>
				&nbsp;&nbsp;...<br>
				&lt;/<mark>TinySlider</mark>&gt;
			</code>
		</p>

		<div class="relative">
			<div class="slider-wrapper">
				<TinySlider gap="0.5rem" threshold="100">
					{#each { length: 10 } as _}
						<div class="item" style:background-color="hsl({Math.floor(Math.random() * 360)}, 80%, 50%)" style:--width="200px" style:--height="200px" />
					{/each}

					<svelte:fragment slot="controls" let:setIndex let:currentIndex let:reachedEnd>
						{#if currentIndex > 0}
							<button class="arrow left" on:click={() => setIndex(currentIndex - 1)}><Arrow /></button>
						{/if}

						{#if !reachedEnd}
							<button class="arrow right" on:click={() => setIndex(currentIndex + 1)}><Arrow direction="right" /></button>
						{/if}
					</svelte:fragment>
				</TinySlider>
			</div>
		</div>
	</div>
</div>

<div class="cards">
	<TinySlider gap="1rem" let:shown>
		{#each cardItems as item, index}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="card" on:click={() => console.log('click')}>
				<a class="thumbnail" href="https://google.com" target="_blank">
					{#if [index, index + 1, index - 1].some(i => shown.includes(i))}
						<img loading="lazy" src={item} alt="" />
					{/if}
				</a>

				<a class="title" href="https://google.com" target="_blank">Card with links</a>

				<p>
					I am some description to some topic that spans multiple lines.
				</p>

				<!-- svelte-ignore a11y-invalid-attribute -->
				<a class="button" href="#" on:click|preventDefault>Take me there!</a>
			</div>
		{/each}

		<svelte:fragment slot="controls" let:reachedEnd let:setIndex let:currentIndex>
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
	<h2>Properties</h2>

	<div class="block">
		<p>This is a list of all configurable properties.</p>

		<div class="table">
			<strong>Property</strong> <strong>Default</strong> <strong>Description</strong>

			<code>gap</code> <code>0</code> <strong>Gap between each item. Can be any CSS value.</strong>
			<code>fill</code> <code>true</code> <strong>Boolean to set whether the slider is always filled fully when at the end.</strong>
			<code>transitionDuration</code> <code>300</code> <strong>Transition between items in milliseconds.</strong>
			<code>threshold</code> <code>30</code> <strong>Value in pixels for when you navigate when using drag controls.</strong>
			<code>currentIndex</code> <code>0</code> <strong>Index of the current slide (Read only).</strong>
			<code>shown</code> <code>[]</code> <strong>Array of all shown indexes (Read only).</strong>
			<code>sliderWidth</code> <code>0</code> <strong>Box width in pixels of the slider as it is on the page (Read only).</strong>
			<code>maxWidth</code> <code>0</code> <strong>Full width in pixels of all items together (Read only).</strong>
			<code>currentScrollPosition</code> <code>0</code> <strong>Current position in the slider in pixels (Read only).</strong>
			<code>reachedEnd</code> <code>false</code> <strong>Boolean that is set to true when you have reached the end of the slider (Read only).</strong>
			<code>distanceToEnd</code> <code>0</code> <strong>Distance in pixels until you reach the end of the slider (Read only).</strong>
		</div>
	</div>

	<h2>Functions</h2>

	<div class="block">
		<p>This is a list of exported functions.</p>

		<div class="table">
			<strong>Name</strong> <strong>Properties</strong> <strong>Description</strong>

			<code>setIndex</code> <code>index</code> <strong>Used to set the slider to the specified index.</strong>
		</div>
	</div>

	<h2>Events</h2>

	<div class="block">
		<p>This is a list of events.</p>

		<div class="table">
			<strong>Name</strong> <strong></strong> <strong>Description</strong>

			<code>end</code> <code></code> <strong>Fired when the end of the slider has been reached.</strong>
			<code>change</code> <code></code> <strong>Fired when the slider changes it's index. The detail prop of the event is the current index.</strong>
		</div>
	</div>

	<div class="block">
		Made by <a href="https://github.com/Mitcheljager">Mitchel Jager</a>
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
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}

	.dot {
		flex: 0 0 0.75rem;
		width: 0.75rem;
		height: 0.75rem;
		border: 0;
		border-radius: 50%;
		background: var(--border-color);
		cursor: pointer;
	}

	.dot.active,
	.dot:hover,
	.dot:focus-visible {
		background: white;
	}

	.thumbnails {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}

	.thumbnails.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
	}

	.thumbnail {
		padding: 0;
		margin: 0;
		border: 0;
		border-radius: 0.25rem;
		background: gray;
		overflow: hidden;
	}

	.thumbnail:hover {
		background: darkgray;
	}

	.thumbnail:hover img {
		filter: brightness(1.2);
	}

	.thumbnail.active:not(.inset) {
		outline: 2px solid white;
		outline-offset: 2px;
	}

	.thumbnail.active.inset {
		position: relative;
	}

	.thumbnail.active.inset::before {
		content: "";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 0.25rem;
		box-shadow: inset 0 0 0 2px white;
		z-index: 2;
		pointer-events: none;
	}

	.thumbnail img {
		display: block;
		width: 100%;
		height: auto;
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
		opacity: 0.75;
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
		opacity: 1;
	}

	.arrow:focus-within {
    outline: 2px solid white;
		outline-offset: 2px;
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
		background: var(--border-color);
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
		filter: brightness(1.2);
	}

	.button:focus-visible:not(:active) {
		outline: 3px solid var(--text-color-lightest);
	}

	.button:active {
		transform: scale(0.95);
	}

	.well {
		padding: .35rem .5rem;
		border-radius: .5rem;
		border: 1px solid var(--border-color);
		background: var(--bg-well);
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
