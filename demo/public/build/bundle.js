
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Arrow.svelte generated by Svelte v3.49.0 */

    const file$2 = "src\\Arrow.svelte";

    function create_fragment$2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M24.078,26.457c0.977,0.978,0.977,2.559,0,3.536c-0.488,0.488-1.128,0.731-1.77,0.731c-0.639,0-1.278-0.243-1.768-0.731\r\n\t\tL5.914,15.362l14.629-14.63c0.977-0.977,2.559-0.976,3.535,0c0.977,0.977,0.977,2.56,0,3.536L12.984,15.362L24.078,26.457z");
    			add_location(path, file$2, 5, 1, 155);
    			attr_dev(svg, "viewBox", "0 0 30.725 30.725");
    			set_style(svg, "transform", /*direction*/ ctx[0] == "right" ? "rotate(180deg)" : "", false);
    			add_location(svg, file$2, 4, 0, 56);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*direction*/ 1) {
    				set_style(svg, "transform", /*direction*/ ctx[0] == "right" ? "rotate(180deg)" : "", false);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Arrow', slots, []);
    	let { direction = "left" } = $$props;
    	const writable_props = ['direction'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Arrow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('direction' in $$props) $$invalidate(0, direction = $$props.direction);
    	};

    	$$self.$capture_state = () => ({ direction });

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) $$invalidate(0, direction = $$props.direction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [direction];
    }

    class Arrow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { direction: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrow",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get direction() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\src\TinySlider.svelte generated by Svelte v3.49.0 */

    const { window: window_1 } = globals;
    const file$1 = "..\\src\\TinySlider.svelte";

    const get_controls_slot_changes = dirty => ({
    	sliderWidth: dirty[0] & /*sliderWidth*/ 1,
    	shown: dirty[0] & /*shown*/ 16,
    	currentIndex: dirty[0] & /*currentIndex*/ 8,
    	currentScrollPosition: dirty[0] & /*currentScrollPosition*/ 2,
    	maxWidth: dirty[0] & /*maxWidth*/ 4,
    	reachedEnd: dirty[0] & /*reachedEnd*/ 32,
    	distanceToEnd: dirty[0] & /*distanceToEnd*/ 64
    });

    const get_controls_slot_context = ctx => ({
    	sliderWidth: /*sliderWidth*/ ctx[0],
    	shown: /*shown*/ ctx[4],
    	currentIndex: /*currentIndex*/ ctx[3],
    	setIndex: /*setIndex*/ ctx[9],
    	currentScrollPosition: /*currentScrollPosition*/ ctx[1],
    	maxWidth: /*maxWidth*/ ctx[2],
    	reachedEnd: /*reachedEnd*/ ctx[5],
    	distanceToEnd: /*distanceToEnd*/ ctx[6]
    });

    const get_default_slot_changes = dirty => ({
    	sliderWidth: dirty[0] & /*sliderWidth*/ 1,
    	shown: dirty[0] & /*shown*/ 16,
    	currentIndex: dirty[0] & /*currentIndex*/ 8,
    	currentScrollPosition: dirty[0] & /*currentScrollPosition*/ 2,
    	maxWidth: dirty[0] & /*maxWidth*/ 4,
    	reachedEnd: dirty[0] & /*reachedEnd*/ 32,
    	distanceToEnd: dirty[0] & /*distanceToEnd*/ 64
    });

    const get_default_slot_context = ctx => ({
    	sliderWidth: /*sliderWidth*/ ctx[0],
    	shown: /*shown*/ ctx[4],
    	currentIndex: /*currentIndex*/ ctx[3],
    	setIndex: /*setIndex*/ ctx[9],
    	currentScrollPosition: /*currentScrollPosition*/ ctx[1],
    	maxWidth: /*maxWidth*/ ctx[2],
    	reachedEnd: /*reachedEnd*/ ctx[5],
    	distanceToEnd: /*distanceToEnd*/ ctx[6]
    });

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let style_transform = `translateX(${/*currentScrollPosition*/ ctx[1] * -1}px)`;

    	let style_transition_duration = `${/*isDragging*/ ctx[11]
	? 0
	: /*transitionDuration*/ ctx[8]}ms`;

    	let div1_resize_listener;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], get_default_slot_context);
    	const controls_slot_template = /*#slots*/ ctx[22].controls;
    	const controls_slot = create_slot(controls_slot_template, ctx, /*$$scope*/ ctx[21], get_controls_slot_context);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (controls_slot) controls_slot.c();
    			attr_dev(div0, "tabindex", "0");
    			attr_dev(div0, "class", "slider-content svelte-1qdlq75");
    			set_style(div0, "transform", style_transform, false);
    			set_style(div0, "transition-duration", style_transition_duration, false);
    			set_style(div0, "--gap", /*gap*/ ctx[7], false);
    			add_location(div0, file$1, 175, 2, 4770);
    			attr_dev(div1, "class", "slider svelte-1qdlq75");
    			attr_dev(div1, "tabindex", "-1");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[25].call(div1));
    			toggle_class(div1, "dragging", /*isDragging*/ ctx[11]);
    			toggle_class(div1, "passed-threshold", /*passedThreshold*/ ctx[12]);
    			add_location(div1, file$1, 174, 0, 4606);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[23](div0);
    			/*div1_binding*/ ctx[24](div1);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[25].bind(div1));
    			insert_dev(target, t, anchor);

    			if (controls_slot) {
    				controls_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "mousedown", /*down*/ ctx[14], false, false, false),
    					listen_dev(window_1, "mouseup", /*up*/ ctx[15], false, false, false),
    					listen_dev(window_1, "mousemove", /*move*/ ctx[16], false, false, false),
    					listen_dev(window_1, "touchstart", /*down*/ ctx[14], false, false, false),
    					listen_dev(window_1, "touchend", /*up*/ ctx[15], false, false, false),
    					listen_dev(window_1, "touchmove", /*move*/ ctx[16], false, false, false),
    					listen_dev(window_1, "keydown", /*keydown*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope, sliderWidth, shown, currentIndex, currentScrollPosition, maxWidth, reachedEnd, distanceToEnd*/ 2097279)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (dirty[0] & /*currentScrollPosition*/ 2 && style_transform !== (style_transform = `translateX(${/*currentScrollPosition*/ ctx[1] * -1}px)`)) {
    				set_style(div0, "transform", style_transform, false);
    			}

    			if (dirty[0] & /*isDragging, transitionDuration*/ 2304 && style_transition_duration !== (style_transition_duration = `${/*isDragging*/ ctx[11]
			? 0
			: /*transitionDuration*/ ctx[8]}ms`)) {
    				set_style(div0, "transition-duration", style_transition_duration, false);
    			}

    			if (dirty[0] & /*gap*/ 128) {
    				set_style(div0, "--gap", /*gap*/ ctx[7], false);
    			}

    			if (dirty[0] & /*isDragging*/ 2048) {
    				toggle_class(div1, "dragging", /*isDragging*/ ctx[11]);
    			}

    			if (dirty[0] & /*passedThreshold*/ 4096) {
    				toggle_class(div1, "passed-threshold", /*passedThreshold*/ ctx[12]);
    			}

    			if (controls_slot) {
    				if (controls_slot.p && (!current || dirty[0] & /*$$scope, sliderWidth, shown, currentIndex, currentScrollPosition, maxWidth, reachedEnd, distanceToEnd*/ 2097279)) {
    					update_slot_base(
    						controls_slot,
    						controls_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(controls_slot_template, /*$$scope*/ ctx[21], dirty, get_controls_slot_changes),
    						get_controls_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(controls_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(controls_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[23](null);
    			/*div1_binding*/ ctx[24](null);
    			div1_resize_listener();
    			if (detaching) detach_dev(t);
    			if (controls_slot) controls_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TinySlider', slots, ['default','controls']);
    	let { gap = 0 } = $$props;
    	let { snap = true } = $$props;
    	let { fill = true } = $$props;
    	let { transitionDuration = 300 } = $$props;
    	let { threshold = 30 } = $$props;
    	let { currentIndex = 0 } = $$props;
    	let { shown = [] } = $$props;
    	let { sliderWidth = 0 } = $$props;
    	let { currentScrollPosition = 0 } = $$props;
    	let { maxWidth = 0 } = $$props;
    	let { reachedEnd = false } = $$props;
    	let { distanceToEnd = 0 } = $$props;
    	let isDragging = false;
    	let passedThreshold = false;
    	let movementStartX = 0;
    	let finalScrollPosition = 0;
    	let sliderElement;
    	let contentElement;
    	let observer;
    	const dispatch = createEventDispatcher();
    	onMount(createResizeObserver);
    	onDestroy(() => observer.disconnect(contentElement));

    	function setIndex(i) {
    		const length = contentElement.children.length;
    		if (i < 0) i = 0;
    		if (i > length - 1) i = length - 1;
    		snapToPosition({ setIndex: i });
    		setShown();
    	}

    	function down(event) {
    		event.preventDefault();
    		if (!isCurrentSlider(event.target)) return;
    		movementStartX = event.pageX || event.touches[0].pageX;
    		$$invalidate(11, isDragging = true);
    	}

    	function up() {
    		if (!isDragging) return;

    		if (!passedThreshold) {
    			snapToPosition({ setIndex: currentIndex });
    		} else {
    			const difference = currentScrollPosition - finalScrollPosition;
    			const direction = difference > 0 ? 1 : -1;
    			if (difference != 0 && snap) snapToPosition({ direction });
    		}

    		$$invalidate(11, isDragging = false);
    		$$invalidate(12, passedThreshold = false);
    	}

    	function move(event) {
    		if (!isDragging) return;
    		$$invalidate(12, passedThreshold = Math.abs(currentScrollPosition - finalScrollPosition) > threshold);

    		if (event.touches?.length) {
    			event.pageX = event.touches[0].pageX;
    			event.movementX = event.touches[0].pageX - movementStartX;
    		}

    		if (event.pageX + event.movementX < 0 || event.pageX + event.movementX > window.innerWidth) {
    			up();
    			return;
    		}

    		setScrollPosition(finalScrollPosition + (movementStartX - event.pageX));
    		setShown();
    	}

    	function keydown(event) {
    		if (!isCurrentSlider(document.activeElement)) return;
    		if (event.key != "ArrowLeft" && event.key != "ArrowRight") return;
    		if (event.key == "ArrowLeft") setIndex(currentIndex - 1);
    		if (event.key == "ArrowRight") setIndex(currentIndex + 1);
    	}

    	function snapToPosition({ setIndex = -1, direction = 1 } = {}) {
    		const offsets = getItemOffsets();
    		$$invalidate(3, currentIndex = 0);
    		let i;

    		for (i = 0; i < offsets.length; i++) {
    			if (setIndex != -1) {
    				if (i >= setIndex) break;
    			} else if (direction > 0 && offsets[i] > currentScrollPosition || direction < 0 && offsets[i + 1] > currentScrollPosition) {
    				break;
    			}
    		}

    		$$invalidate(3, currentIndex = Math.min(i, getContentChildren().length - 1));
    		setScrollPosition(offsets[currentIndex], true);
    		finalScrollPosition = currentScrollPosition;
    	}

    	function setScrollPosition(left, limit = false) {
    		$$invalidate(1, currentScrollPosition = left);
    		const end = maxWidth - sliderWidth;
    		$$invalidate(5, reachedEnd = currentScrollPosition >= end);
    		if (!reachedEnd) return;
    		dispatch("end");
    		if (fill && limit) $$invalidate(1, currentScrollPosition = end);
    	}

    	function setShown() {
    		const offsets = getItemOffsets();

    		Array.from(offsets).forEach((offset, index) => {
    			if (currentScrollPosition + sliderWidth < offset) return;
    			if (!shown.includes(index)) $$invalidate(4, shown = [...shown, index]);
    		});
    	}

    	function getItemOffsets() {
    		return getContentChildren().map(item => item.offsetLeft);
    	}

    	function getContentChildren() {
    		return Array.from(contentElement.children).filter(c => c.src != "about:blank");
    	}

    	function createResizeObserver() {
    		observer = new ResizeObserver(entries => {
    				for (const entry of entries) {
    					const contentBoxSize = Array.isArray(entry.contentBoxSize)
    					? entry.contentBoxSize[0]
    					: entry.contentBoxSize;

    					$$invalidate(2, maxWidth = contentBoxSize.inlineSize);
    				}
    			});

    		observer.observe(contentElement);
    	}

    	function isCurrentSlider(element) {
    		return element == sliderElement || element.closest(".slider") == sliderElement;
    	}

    	const writable_props = [
    		'gap',
    		'snap',
    		'fill',
    		'transitionDuration',
    		'threshold',
    		'currentIndex',
    		'shown',
    		'sliderWidth',
    		'currentScrollPosition',
    		'maxWidth',
    		'reachedEnd',
    		'distanceToEnd'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TinySlider> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			contentElement = $$value;
    			$$invalidate(10, contentElement);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			sliderElement = $$value;
    			$$invalidate(13, sliderElement);
    		});
    	}

    	function div1_elementresize_handler() {
    		sliderWidth = this.clientWidth;
    		$$invalidate(0, sliderWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('gap' in $$props) $$invalidate(7, gap = $$props.gap);
    		if ('snap' in $$props) $$invalidate(18, snap = $$props.snap);
    		if ('fill' in $$props) $$invalidate(19, fill = $$props.fill);
    		if ('transitionDuration' in $$props) $$invalidate(8, transitionDuration = $$props.transitionDuration);
    		if ('threshold' in $$props) $$invalidate(20, threshold = $$props.threshold);
    		if ('currentIndex' in $$props) $$invalidate(3, currentIndex = $$props.currentIndex);
    		if ('shown' in $$props) $$invalidate(4, shown = $$props.shown);
    		if ('sliderWidth' in $$props) $$invalidate(0, sliderWidth = $$props.sliderWidth);
    		if ('currentScrollPosition' in $$props) $$invalidate(1, currentScrollPosition = $$props.currentScrollPosition);
    		if ('maxWidth' in $$props) $$invalidate(2, maxWidth = $$props.maxWidth);
    		if ('reachedEnd' in $$props) $$invalidate(5, reachedEnd = $$props.reachedEnd);
    		if ('distanceToEnd' in $$props) $$invalidate(6, distanceToEnd = $$props.distanceToEnd);
    		if ('$$scope' in $$props) $$invalidate(21, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		onDestroy,
    		gap,
    		snap,
    		fill,
    		transitionDuration,
    		threshold,
    		currentIndex,
    		shown,
    		sliderWidth,
    		currentScrollPosition,
    		maxWidth,
    		reachedEnd,
    		distanceToEnd,
    		isDragging,
    		passedThreshold,
    		movementStartX,
    		finalScrollPosition,
    		sliderElement,
    		contentElement,
    		observer,
    		dispatch,
    		setIndex,
    		down,
    		up,
    		move,
    		keydown,
    		snapToPosition,
    		setScrollPosition,
    		setShown,
    		getItemOffsets,
    		getContentChildren,
    		createResizeObserver,
    		isCurrentSlider
    	});

    	$$self.$inject_state = $$props => {
    		if ('gap' in $$props) $$invalidate(7, gap = $$props.gap);
    		if ('snap' in $$props) $$invalidate(18, snap = $$props.snap);
    		if ('fill' in $$props) $$invalidate(19, fill = $$props.fill);
    		if ('transitionDuration' in $$props) $$invalidate(8, transitionDuration = $$props.transitionDuration);
    		if ('threshold' in $$props) $$invalidate(20, threshold = $$props.threshold);
    		if ('currentIndex' in $$props) $$invalidate(3, currentIndex = $$props.currentIndex);
    		if ('shown' in $$props) $$invalidate(4, shown = $$props.shown);
    		if ('sliderWidth' in $$props) $$invalidate(0, sliderWidth = $$props.sliderWidth);
    		if ('currentScrollPosition' in $$props) $$invalidate(1, currentScrollPosition = $$props.currentScrollPosition);
    		if ('maxWidth' in $$props) $$invalidate(2, maxWidth = $$props.maxWidth);
    		if ('reachedEnd' in $$props) $$invalidate(5, reachedEnd = $$props.reachedEnd);
    		if ('distanceToEnd' in $$props) $$invalidate(6, distanceToEnd = $$props.distanceToEnd);
    		if ('isDragging' in $$props) $$invalidate(11, isDragging = $$props.isDragging);
    		if ('passedThreshold' in $$props) $$invalidate(12, passedThreshold = $$props.passedThreshold);
    		if ('movementStartX' in $$props) movementStartX = $$props.movementStartX;
    		if ('finalScrollPosition' in $$props) finalScrollPosition = $$props.finalScrollPosition;
    		if ('sliderElement' in $$props) $$invalidate(13, sliderElement = $$props.sliderElement);
    		if ('contentElement' in $$props) $$invalidate(10, contentElement = $$props.contentElement);
    		if ('observer' in $$props) observer = $$props.observer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*contentElement*/ 1024) {
    			if (contentElement) setShown();
    		}

    		if ($$self.$$.dirty[0] & /*contentElement, maxWidth, currentScrollPosition, sliderWidth*/ 1031) {
    			if (contentElement) $$invalidate(6, distanceToEnd = maxWidth - currentScrollPosition - sliderWidth);
    		}
    	};

    	return [
    		sliderWidth,
    		currentScrollPosition,
    		maxWidth,
    		currentIndex,
    		shown,
    		reachedEnd,
    		distanceToEnd,
    		gap,
    		transitionDuration,
    		setIndex,
    		contentElement,
    		isDragging,
    		passedThreshold,
    		sliderElement,
    		down,
    		up,
    		move,
    		keydown,
    		snap,
    		fill,
    		threshold,
    		$$scope,
    		slots,
    		div0_binding,
    		div1_binding,
    		div1_elementresize_handler
    	];
    }

    class TinySlider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				gap: 7,
    				snap: 18,
    				fill: 19,
    				transitionDuration: 8,
    				threshold: 20,
    				currentIndex: 3,
    				shown: 4,
    				sliderWidth: 0,
    				currentScrollPosition: 1,
    				maxWidth: 2,
    				reachedEnd: 5,
    				distanceToEnd: 6,
    				setIndex: 9
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TinySlider",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get gap() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gap(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get snap() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set snap(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionDuration() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionDuration(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get threshold() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set threshold(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentIndex() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentIndex(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shown() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shown(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sliderWidth() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sliderWidth(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentScrollPosition() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentScrollPosition(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxWidth() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxWidth(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reachedEnd() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reachedEnd(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get distanceToEnd() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set distanceToEnd(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setIndex() {
    		return this.$$.ctx[9];
    	}

    	set setIndex(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	child_ctx[26] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	child_ctx[26] = i;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    // (32:2) {#each headerItems as item}
    function create_each_block_6(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[24])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "200");
    			attr_dev(img, "height", "150");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-396iml");
    			add_location(img, file, 32, 3, 870);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(32:2) {#each headerItems as item}",
    		ctx
    	});

    	return block;
    }

    // (31:1) <TinySlider>
    function create_default_slot_5(ctx) {
    	let each_1_anchor;
    	let each_value_6 = /*headerItems*/ ctx[4];
    	validate_each_argument(each_value_6);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*headerItems*/ 16) {
    				each_value_6 = /*headerItems*/ ctx[4];
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_6.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(31:1) <TinySlider>",
    		ctx
    	});

    	return block;
    }

    // (41:3) {#each items as item}
    function create_each_block_5(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let style___width = `${/*sliderWidth*/ ctx[2]}px`;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[24])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-396iml");
    			add_location(img, file, 45, 5, 1267);
    			attr_dev(div, "class", "item svelte-396iml");
    			set_style(div, "--width", style___width, false);
    			set_style(div, "--height", `400px`, false);
    			add_location(div, file, 41, 4, 1169);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sliderWidth*/ 4 && style___width !== (style___width = `${/*sliderWidth*/ ctx[2]}px`)) {
    				set_style(div, "--width", style___width, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(41:3) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    // (40:2) <TinySlider gap="0.5rem" let:setIndex let:currentIndex let:sliderWidth on:end={() => console.log('reached end')}>
    function create_default_slot_4(ctx) {
    	let each_1_anchor;
    	let each_value_5 = /*items*/ ctx[3];
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sliderWidth, items*/ 12) {
    				each_value_5 = /*items*/ ctx[3];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(40:2) <TinySlider gap=\\\"0.5rem\\\" let:setIndex let:currentIndex let:sliderWidth on:end={() => console.log('reached end')}>",
    		ctx
    	});

    	return block;
    }

    // (51:4) {#each items as item, i}
    function create_each_block_4(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[9](/*setIndex*/ ctx[20], /*i*/ ctx[34]);
    	}

    	function focus_handler() {
    		return /*focus_handler*/ ctx[10](/*setIndex*/ ctx[20], /*i*/ ctx[34]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t = space();
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[24])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "height", "60");
    			attr_dev(img, "class", "svelte-396iml");
    			add_location(img, file, 56, 6, 1556);
    			attr_dev(button, "class", "dot svelte-396iml");
    			toggle_class(button, "active", /*i*/ ctx[34] == /*currentIndex*/ ctx[21]);
    			add_location(button, file, 51, 5, 1409);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", click_handler_1, false, false, false),
    					listen_dev(button, "focus", focus_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*currentIndex*/ 2097152) {
    				toggle_class(button, "active", /*i*/ ctx[34] == /*currentIndex*/ ctx[21]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(51:4) {#each items as item, i}",
    		ctx
    	});

    	return block;
    }

    // (50:3) 
    function create_controls_slot_2(ctx) {
    	let div;
    	let each_value_4 = /*items*/ ctx[3];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "slot", "controls");
    			attr_dev(div, "class", "dots svelte-396iml");
    			add_location(div, file, 49, 3, 1338);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentIndex, setIndex, items*/ 3145736) {
    				each_value_4 = /*items*/ ctx[3];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot_2.name,
    		type: "slot",
    		source: "(50:3) ",
    		ctx
    	});

    	return block;
    }

    // (74:7) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}
    function create_if_block_5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[24])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-396iml");
    			add_location(img, file, 74, 8, 2145);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*portaitItems*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[24])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(74:7) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}",
    		ctx
    	});

    	return block;
    }

    // (72:5) {#each portaitItems as item, index}
    function create_each_block_3(ctx) {
    	let div;
    	let show_if = [/*index*/ ctx[26], /*index*/ ctx[26] + 1, /*index*/ ctx[26] - 1].some(func_1);
    	let t;

    	function func_1(...args) {
    		return /*func_1*/ ctx[8](/*shown*/ ctx[22], ...args);
    	}

    	let if_block = show_if && create_if_block_5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div, "class", "item svelte-396iml");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `300px`, false);
    			add_location(div, file, 72, 6, 1999);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*shown*/ 4194304) show_if = [/*index*/ ctx[26], /*index*/ ctx[26] + 1, /*index*/ ctx[26] - 1].some(func_1);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(72:5) {#each portaitItems as item, index}",
    		ctx
    	});

    	return block;
    }

    // (71:4) <TinySlider gap="0.5rem" let:setIndex let:currentIndex let:shown bind:distanceToEnd bind:sliderWidth>
    function create_default_slot_3(ctx) {
    	let each_1_anchor;
    	let each_value_3 = /*portaitItems*/ ctx[0];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*portaitItems, shown*/ 4194305) {
    				each_value_3 = /*portaitItems*/ ctx[0];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(71:4) <TinySlider gap=\\\"0.5rem\\\" let:setIndex let:currentIndex let:shown bind:distanceToEnd bind:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (81:6) {#if currentIndex > 0}
    function create_if_block_4(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[12](/*setIndex*/ ctx[20], /*currentIndex*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-396iml");
    			add_location(button, file, 81, 7, 2308);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(arrow);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(81:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (85:6) {#if currentIndex < portaitItems.length - 1}
    function create_if_block_3(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;

    	arrow = new Arrow({
    			props: { direction: "right" },
    			$$inline: true
    		});

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[13](/*setIndex*/ ctx[20], /*currentIndex*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-396iml");
    			add_location(button, file, 85, 7, 2473);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_3, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(arrow);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(85:6) {#if currentIndex < portaitItems.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (80:5) <svelte:fragment slot="controls">
    function create_controls_slot_1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[21] > 0 && create_if_block_4(ctx);
    	let if_block1 = /*currentIndex*/ ctx[21] < /*portaitItems*/ ctx[0].length - 1 && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*currentIndex*/ ctx[21] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 2097152) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*currentIndex*/ ctx[21] < /*portaitItems*/ ctx[0].length - 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex, portaitItems*/ 2097153) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot_1.name,
    		type: "slot",
    		source: "(80:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (97:4) {#each { length: 20 } as _}
    function create_each_block_2(ctx) {
    	let div;
    	let strong;
    	let t1;
    	let style_background_color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`;

    	const block = {
    		c: function create() {
    			div = element("div");
    			strong = element("strong");
    			strong.textContent = "Word";
    			t1 = space();
    			attr_dev(strong, "class", "svelte-396iml");
    			add_location(strong, file, 98, 6, 2992);
    			attr_dev(div, "class", "item svelte-396iml");
    			set_style(div, "background-color", style_background_color, false);
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 97, 5, 2847);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, strong);
    			append_dev(div, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(97:4) {#each { length: 20 } as _}",
    		ctx
    	});

    	return block;
    }

    // (96:3) <TinySlider gap="0.5rem" fill={false} let:setIndex let:currentIndex let:shown>
    function create_default_slot_2(ctx) {
    	let each_1_anchor;
    	let each_value_2 = { length: 20 };
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Math*/ 0) {
    				each_value_2 = { length: 20 };
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(96:3) <TinySlider gap=\\\"0.5rem\\\" fill={false} let:setIndex let:currentIndex let:shown>",
    		ctx
    	});

    	return block;
    }

    // (109:4) {#each { length: 20 } as _}
    function create_each_block_1(ctx) {
    	let div;
    	let a;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			a.textContent = "Link";
    			t1 = space();
    			attr_dev(a, "href", "https://google.com");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-396iml");
    			add_location(a, file, 110, 6, 3324);
    			attr_dev(div, "class", "item svelte-396iml");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 109, 5, 3215);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_4*/ ctx[16], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(109:4) {#each { length: 20 } as _}",
    		ctx
    	});

    	return block;
    }

    // (108:3) <TinySlider gap="0.5rem" fill={false}>
    function create_default_slot_1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = { length: 20 };
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*console*/ 0) {
    				each_value_1 = { length: 20 };
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(108:3) <TinySlider gap=\\\"0.5rem\\\" fill={false}>",
    		ctx
    	});

    	return block;
    }

    // (124:5) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}
    function create_if_block_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[24])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-396iml");
    			add_location(img, file, 124, 6, 3842);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(124:5) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}",
    		ctx
    	});

    	return block;
    }

    // (121:2) {#each cardItems as item, index}
    function create_each_block(ctx) {
    	let div;
    	let a0;
    	let show_if = [/*index*/ ctx[26], /*index*/ ctx[26] + 1, /*index*/ ctx[26] - 1].some(func);
    	let t0;
    	let a1;
    	let t2;
    	let p;
    	let t4;
    	let a2;
    	let t6;
    	let mounted;
    	let dispose;

    	function func(...args) {
    		return /*func*/ ctx[7](/*shown*/ ctx[22], ...args);
    	}

    	let if_block = show_if && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			if (if_block) if_block.c();
    			t0 = space();
    			a1 = element("a");
    			a1.textContent = "Card with links";
    			t2 = space();
    			p = element("p");
    			p.textContent = "I am some description to some topic that spans multiple lines.";
    			t4 = space();
    			a2 = element("a");
    			a2.textContent = "Take me there!";
    			t6 = space();
    			attr_dev(a0, "class", "thumbnail svelte-396iml");
    			attr_dev(a0, "href", "https://google.com");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file, 122, 4, 3700);
    			attr_dev(a1, "class", "title svelte-396iml");
    			attr_dev(a1, "href", "https://google.com");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file, 128, 4, 3912);
    			attr_dev(p, "class", "svelte-396iml");
    			add_location(p, file, 130, 4, 3998);
    			attr_dev(a2, "class", "button svelte-396iml");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file, 134, 4, 4088);
    			attr_dev(div, "class", "card svelte-396iml");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 121, 3, 3593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			if (if_block) if_block.m(a0, null);
    			append_dev(div, t0);
    			append_dev(div, a1);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(div, t4);
    			append_dev(div, a2);
    			append_dev(div, t6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a2, "click", prevent_default(/*click_handler*/ ctx[6]), false, true, false),
    					listen_dev(div, "click", /*click_handler_7*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*shown*/ 4194304) show_if = [/*index*/ ctx[26], /*index*/ ctx[26] + 1, /*index*/ ctx[26] - 1].some(func);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(a0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(121:2) {#each cardItems as item, index}",
    		ctx
    	});

    	return block;
    }

    // (120:1) <TinySlider gap="1rem" let:setIndex let:currentIndex let:shown let:reachedEnd>
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let each_value = /*cardItems*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*cardItems, shown*/ 4194336) {
    				each_value = /*cardItems*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(120:1) <TinySlider gap=\\\"1rem\\\" let:setIndex let:currentIndex let:shown let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (140:3) {#if currentIndex > 0}
    function create_if_block_1(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[17](/*setIndex*/ ctx[20], /*currentIndex*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-396iml");
    			add_location(button, file, 140, 4, 4251);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_5, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(arrow);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(140:3) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (144:3) {#if !reachedEnd}
    function create_if_block(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;

    	arrow = new Arrow({
    			props: { direction: "right" },
    			$$inline: true
    		});

    	function click_handler_6() {
    		return /*click_handler_6*/ ctx[18](/*setIndex*/ ctx[20], /*currentIndex*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-396iml");
    			add_location(button, file, 144, 4, 4380);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_6, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(arrow);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(144:3) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (139:2) <svelte:fragment slot="controls">
    function create_controls_slot(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[21] > 0 && create_if_block_1(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[23] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*currentIndex*/ ctx[21] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 2097152) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*reachedEnd*/ ctx[23]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*reachedEnd*/ 8388608) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot.name,
    		type: "slot",
    		source: "(139:2) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let h1;
    	let mark;
    	let t1;
    	let t2;
    	let tinyslider0;
    	let t3;
    	let div8;
    	let div0;
    	let tinyslider1;
    	let t4;
    	let div3;
    	let div2;
    	let div1;
    	let tinyslider2;
    	let updating_distanceToEnd;
    	let updating_sliderWidth;
    	let t5;
    	let div5;
    	let div4;
    	let tinyslider3;
    	let t6;
    	let div7;
    	let div6;
    	let tinyslider4;
    	let t7;
    	let div9;
    	let tinyslider5;
    	let t8;
    	let div10;
    	let current;

    	tinyslider0 = new TinySlider({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider1 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				$$slots: {
    					controls: [
    						create_controls_slot_2,
    						({ setIndex, currentIndex, sliderWidth }) => ({
    							20: setIndex,
    							21: currentIndex,
    							2: sliderWidth
    						}),
    						({ setIndex, currentIndex, sliderWidth }) => [
    							(setIndex ? 1048576 : 0) | (currentIndex ? 2097152 : 0) | (sliderWidth ? 4 : 0)
    						]
    					],
    					default: [
    						create_default_slot_4,
    						({ setIndex, currentIndex, sliderWidth }) => ({
    							20: setIndex,
    							21: currentIndex,
    							2: sliderWidth
    						}),
    						({ setIndex, currentIndex, sliderWidth }) => [
    							(setIndex ? 1048576 : 0) | (currentIndex ? 2097152 : 0) | (sliderWidth ? 4 : 0)
    						]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider1.$on("end", /*end_handler*/ ctx[11]);

    	function tinyslider2_distanceToEnd_binding(value) {
    		/*tinyslider2_distanceToEnd_binding*/ ctx[14](value);
    	}

    	function tinyslider2_sliderWidth_binding(value) {
    		/*tinyslider2_sliderWidth_binding*/ ctx[15](value);
    	}

    	let tinyslider2_props = {
    		gap: "0.5rem",
    		$$slots: {
    			controls: [
    				create_controls_slot_1,
    				({ setIndex, currentIndex, shown }) => ({
    					20: setIndex,
    					21: currentIndex,
    					22: shown
    				}),
    				({ setIndex, currentIndex, shown }) => [
    					(setIndex ? 1048576 : 0) | (currentIndex ? 2097152 : 0) | (shown ? 4194304 : 0)
    				]
    			],
    			default: [
    				create_default_slot_3,
    				({ setIndex, currentIndex, shown }) => ({
    					20: setIndex,
    					21: currentIndex,
    					22: shown
    				}),
    				({ setIndex, currentIndex, shown }) => [
    					(setIndex ? 1048576 : 0) | (currentIndex ? 2097152 : 0) | (shown ? 4194304 : 0)
    				]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*distanceToEnd*/ ctx[1] !== void 0) {
    		tinyslider2_props.distanceToEnd = /*distanceToEnd*/ ctx[1];
    	}

    	if (/*sliderWidth*/ ctx[2] !== void 0) {
    		tinyslider2_props.sliderWidth = /*sliderWidth*/ ctx[2];
    	}

    	tinyslider2 = new TinySlider({ props: tinyslider2_props, $$inline: true });
    	binding_callbacks.push(() => bind(tinyslider2, 'distanceToEnd', tinyslider2_distanceToEnd_binding));
    	binding_callbacks.push(() => bind(tinyslider2, 'sliderWidth', tinyslider2_sliderWidth_binding));

    	tinyslider3 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				fill: false,
    				$$slots: {
    					default: [
    						create_default_slot_2,
    						({ setIndex, currentIndex, shown }) => ({
    							20: setIndex,
    							21: currentIndex,
    							22: shown
    						}),
    						({ setIndex, currentIndex, shown }) => [
    							(setIndex ? 1048576 : 0) | (currentIndex ? 2097152 : 0) | (shown ? 4194304 : 0)
    						]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider4 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				fill: false,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider5 = new TinySlider({
    			props: {
    				gap: "1rem",
    				$$slots: {
    					controls: [
    						create_controls_slot,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							20: setIndex,
    							21: currentIndex,
    							22: shown,
    							23: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 1048576 : 0) | (currentIndex ? 2097152 : 0) | (shown ? 4194304 : 0) | (reachedEnd ? 8388608 : 0)
    						]
    					],
    					default: [
    						create_default_slot,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							20: setIndex,
    							21: currentIndex,
    							22: shown,
    							23: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 1048576 : 0) | (currentIndex ? 2097152 : 0) | (shown ? 4194304 : 0) | (reachedEnd ? 8388608 : 0)
    						]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			mark = element("mark");
    			mark.textContent = "Svelte";
    			t1 = text(" Tiny Slider");
    			t2 = space();
    			create_component(tinyslider0.$$.fragment);
    			t3 = space();
    			div8 = element("div");
    			div0 = element("div");
    			create_component(tinyslider1.$$.fragment);
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			create_component(tinyslider2.$$.fragment);
    			t5 = space();
    			div5 = element("div");
    			div4 = element("div");
    			create_component(tinyslider3.$$.fragment);
    			t6 = space();
    			div7 = element("div");
    			div6 = element("div");
    			create_component(tinyslider4.$$.fragment);
    			t7 = space();
    			div9 = element("div");
    			create_component(tinyslider5.$$.fragment);
    			t8 = space();
    			div10 = element("div");
    			attr_dev(mark, "class", "svelte-396iml");
    			add_location(mark, file, 28, 5, 771);
    			attr_dev(h1, "class", "svelte-396iml");
    			add_location(h1, file, 28, 1, 767);
    			attr_dev(header, "class", "svelte-396iml");
    			add_location(header, file, 27, 0, 756);
    			attr_dev(div0, "class", "block svelte-396iml");
    			add_location(div0, file, 38, 1, 1001);
    			attr_dev(div1, "class", "slider-wrapper svelte-396iml");
    			add_location(div1, file, 69, 3, 1814);
    			attr_dev(div2, "class", "relative svelte-396iml");
    			add_location(div2, file, 68, 2, 1787);
    			attr_dev(div3, "class", "block svelte-396iml");
    			add_location(div3, file, 67, 1, 1764);
    			attr_dev(div4, "class", "slider-wrapper svelte-396iml");
    			add_location(div4, file, 94, 2, 2696);
    			attr_dev(div5, "class", "block svelte-396iml");
    			add_location(div5, file, 93, 1, 2673);
    			attr_dev(div6, "class", "slider-wrapper svelte-396iml");
    			add_location(div6, file, 106, 2, 3104);
    			attr_dev(div7, "class", "block svelte-396iml");
    			add_location(div7, file, 105, 1, 3081);
    			attr_dev(div8, "class", "wrapper svelte-396iml");
    			add_location(div8, file, 37, 0, 977);
    			attr_dev(div9, "class", "cards svelte-396iml");
    			add_location(div9, file, 118, 0, 3452);
    			attr_dev(div10, "class", "wrapper svelte-396iml");
    			add_location(div10, file, 150, 0, 4548);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(h1, mark);
    			append_dev(h1, t1);
    			append_dev(header, t2);
    			mount_component(tinyslider0, header, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div0);
    			mount_component(tinyslider1, div0, null);
    			append_dev(div8, t4);
    			append_dev(div8, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			mount_component(tinyslider2, div1, null);
    			append_dev(div8, t5);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			mount_component(tinyslider3, div4, null);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			mount_component(tinyslider4, div6, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div9, anchor);
    			mount_component(tinyslider5, div9, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div10, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tinyslider0_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				tinyslider0_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider0.$set(tinyslider0_changes);
    			const tinyslider1_changes = {};

    			if (dirty[0] & /*currentIndex, setIndex, sliderWidth*/ 3145732 | dirty[1] & /*$$scope*/ 256) {
    				tinyslider1_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider1.$set(tinyslider1_changes);
    			const tinyslider2_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex, portaitItems, shown*/ 7340033 | dirty[1] & /*$$scope*/ 256) {
    				tinyslider2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_distanceToEnd && dirty[0] & /*distanceToEnd*/ 2) {
    				updating_distanceToEnd = true;
    				tinyslider2_changes.distanceToEnd = /*distanceToEnd*/ ctx[1];
    				add_flush_callback(() => updating_distanceToEnd = false);
    			}

    			if (!updating_sliderWidth && dirty[0] & /*sliderWidth*/ 4) {
    				updating_sliderWidth = true;
    				tinyslider2_changes.sliderWidth = /*sliderWidth*/ ctx[2];
    				add_flush_callback(() => updating_sliderWidth = false);
    			}

    			tinyslider2.$set(tinyslider2_changes);
    			const tinyslider3_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				tinyslider3_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider3.$set(tinyslider3_changes);
    			const tinyslider4_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				tinyslider4_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider4.$set(tinyslider4_changes);
    			const tinyslider5_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex, reachedEnd, shown*/ 15728640 | dirty[1] & /*$$scope*/ 256) {
    				tinyslider5_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider5.$set(tinyslider5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tinyslider0.$$.fragment, local);
    			transition_in(tinyslider1.$$.fragment, local);
    			transition_in(tinyslider2.$$.fragment, local);
    			transition_in(tinyslider3.$$.fragment, local);
    			transition_in(tinyslider4.$$.fragment, local);
    			transition_in(tinyslider5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tinyslider0.$$.fragment, local);
    			transition_out(tinyslider1.$$.fragment, local);
    			transition_out(tinyslider2.$$.fragment, local);
    			transition_out(tinyslider3.$$.fragment, local);
    			transition_out(tinyslider4.$$.fragment, local);
    			transition_out(tinyslider5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(tinyslider0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div8);
    			destroy_component(tinyslider1);
    			destroy_component(tinyslider2);
    			destroy_component(tinyslider3);
    			destroy_component(tinyslider4);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div9);
    			destroy_component(tinyslider5);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div10);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getItems(subject, size = "", count = 10, from = 0) {
    	const array = [];

    	for (let i = 1; i <= count; i++) {
    		array.push(`https://source.unsplash.com/random${size ? `/${size}` : ''}?${subject}&${from + i}`);
    	}

    	return array;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const items = getItems("editorial");
    	const headerItems = getItems("3d-render", "200x150", 30);
    	const cardItems = getItems("architecture", "320x180", 20);
    	let portaitItems = getItems("food-drink", "200x300");
    	let sliderWidth;
    	let distanceToEnd;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const func = (shown, i) => shown.includes(i);
    	const func_1 = (shown, i) => shown.includes(i);
    	const click_handler_1 = (setIndex, i) => setIndex(i);
    	const focus_handler = (setIndex, i) => setIndex(i);
    	const end_handler = () => console.log('reached end');
    	const click_handler_2 = (setIndex, currentIndex) => setIndex(currentIndex - 2);
    	const click_handler_3 = (setIndex, currentIndex) => setIndex(currentIndex + 2);

    	function tinyslider2_distanceToEnd_binding(value) {
    		distanceToEnd = value;
    		$$invalidate(1, distanceToEnd);
    	}

    	function tinyslider2_sliderWidth_binding(value) {
    		sliderWidth = value;
    		$$invalidate(2, sliderWidth);
    	}

    	const click_handler_4 = () => console.log('click');
    	const click_handler_5 = (setIndex, currentIndex) => setIndex(currentIndex - 2);
    	const click_handler_6 = (setIndex, currentIndex) => setIndex(currentIndex + 2);
    	const click_handler_7 = () => console.log('click');

    	$$self.$capture_state = () => ({
    		Arrow,
    		TinySlider,
    		items,
    		headerItems,
    		cardItems,
    		portaitItems,
    		getItems,
    		sliderWidth,
    		distanceToEnd
    	});

    	$$self.$inject_state = $$props => {
    		if ('portaitItems' in $$props) $$invalidate(0, portaitItems = $$props.portaitItems);
    		if ('sliderWidth' in $$props) $$invalidate(2, sliderWidth = $$props.sliderWidth);
    		if ('distanceToEnd' in $$props) $$invalidate(1, distanceToEnd = $$props.distanceToEnd);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*distanceToEnd, sliderWidth, portaitItems*/ 7) {
    			if (distanceToEnd < sliderWidth) $$invalidate(0, portaitItems = [
    				...portaitItems,
    				...getItems("fashion", "200x300", 10, portaitItems.length)
    			]);
    		}
    	};

    	return [
    		portaitItems,
    		distanceToEnd,
    		sliderWidth,
    		items,
    		headerItems,
    		cardItems,
    		click_handler,
    		func,
    		func_1,
    		click_handler_1,
    		focus_handler,
    		end_handler,
    		click_handler_2,
    		click_handler_3,
    		tinyslider2_distanceToEnd_binding,
    		tinyslider2_sliderWidth_binding,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
