
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
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], get_default_slot_context);
    	const controls_slot_template = /*#slots*/ ctx[21].controls;
    	const controls_slot = create_slot(controls_slot_template, ctx, /*$$scope*/ ctx[20], get_controls_slot_context);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (controls_slot) controls_slot.c();
    			attr_dev(div0, "tabindex", "0");
    			attr_dev(div0, "class", "slider-content svelte-45yjjo");
    			set_style(div0, "transform", style_transform, false);
    			set_style(div0, "transition-duration", style_transition_duration, false);
    			set_style(div0, "--gap", /*gap*/ ctx[7], false);
    			add_location(div0, file$1, 174, 2, 4736);
    			attr_dev(div1, "class", "slider svelte-45yjjo");
    			attr_dev(div1, "tabindex", "-1");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[24].call(div1));
    			toggle_class(div1, "dragging", /*isDragging*/ ctx[11]);
    			toggle_class(div1, "passed-threshold", /*passedThreshold*/ ctx[12]);
    			add_location(div1, file$1, 173, 0, 4572);
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

    			/*div0_binding*/ ctx[22](div0);
    			/*div1_binding*/ ctx[23](div1);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[24].bind(div1));
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
    				if (default_slot.p && (!current || dirty[0] & /*$$scope, sliderWidth, shown, currentIndex, currentScrollPosition, maxWidth, reachedEnd, distanceToEnd*/ 1048703)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, get_default_slot_changes),
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
    				if (controls_slot.p && (!current || dirty[0] & /*$$scope, sliderWidth, shown, currentIndex, currentScrollPosition, maxWidth, reachedEnd, distanceToEnd*/ 1048703)) {
    					update_slot_base(
    						controls_slot,
    						controls_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(controls_slot_template, /*$$scope*/ ctx[20], dirty, get_controls_slot_changes),
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
    			/*div0_binding*/ ctx[22](null);
    			/*div1_binding*/ ctx[23](null);
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
    			if (difference != 0) snapToPosition({ direction });
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
    		if ('fill' in $$props) $$invalidate(18, fill = $$props.fill);
    		if ('transitionDuration' in $$props) $$invalidate(8, transitionDuration = $$props.transitionDuration);
    		if ('threshold' in $$props) $$invalidate(19, threshold = $$props.threshold);
    		if ('currentIndex' in $$props) $$invalidate(3, currentIndex = $$props.currentIndex);
    		if ('shown' in $$props) $$invalidate(4, shown = $$props.shown);
    		if ('sliderWidth' in $$props) $$invalidate(0, sliderWidth = $$props.sliderWidth);
    		if ('currentScrollPosition' in $$props) $$invalidate(1, currentScrollPosition = $$props.currentScrollPosition);
    		if ('maxWidth' in $$props) $$invalidate(2, maxWidth = $$props.maxWidth);
    		if ('reachedEnd' in $$props) $$invalidate(5, reachedEnd = $$props.reachedEnd);
    		if ('distanceToEnd' in $$props) $$invalidate(6, distanceToEnd = $$props.distanceToEnd);
    		if ('$$scope' in $$props) $$invalidate(20, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		onDestroy,
    		gap,
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
    		if ('fill' in $$props) $$invalidate(18, fill = $$props.fill);
    		if ('transitionDuration' in $$props) $$invalidate(8, transitionDuration = $$props.transitionDuration);
    		if ('threshold' in $$props) $$invalidate(19, threshold = $$props.threshold);
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
    				fill: 18,
    				transitionDuration: 8,
    				threshold: 19,
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
    	child_ctx[47] = list[i];
    	child_ctx[49] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	child_ctx[49] = i;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	child_ctx[49] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	child_ctx[60] = i;
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    function get_each_context_9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    function get_each_context_10(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    function get_each_context_12(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    function get_each_context_11(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	child_ctx[60] = i;
    	return child_ctx;
    }

    function get_each_context_14(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    function get_each_context_13(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	child_ctx[60] = i;
    	return child_ctx;
    }

    function get_each_context_15(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    function get_each_context_16(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    function get_each_context_17(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    // (43:2) {#each headerItems as item}
    function create_each_block_17(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "200");
    			attr_dev(img, "height", "150");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 43, 3, 1343);
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
    		id: create_each_block_17.name,
    		type: "each",
    		source: "(43:2) {#each headerItems as item}",
    		ctx
    	});

    	return block;
    }

    // (42:1) <TinySlider>
    function create_default_slot_15(ctx) {
    	let each_1_anchor;
    	let each_value_17 = /*headerItems*/ ctx[13];
    	validate_each_argument(each_value_17);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_17.length; i += 1) {
    		each_blocks[i] = create_each_block_17(get_each_context_17(ctx, each_value_17, i));
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
    			if (dirty[0] & /*headerItems*/ 8192) {
    				each_value_17 = /*headerItems*/ ctx[13];
    				validate_each_argument(each_value_17);
    				let i;

    				for (i = 0; i < each_value_17.length; i += 1) {
    					const child_ctx = get_each_context_17(ctx, each_value_17, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_17(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_17.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(42:1) <TinySlider>",
    		ctx
    	});

    	return block;
    }

    // (96:3) {#each fixedItems as item}
    function create_each_block_16(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 96, 4, 3082);
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
    		id: create_each_block_16.name,
    		type: "each",
    		source: "(96:3) {#each fixedItems as item}",
    		ctx
    	});

    	return block;
    }

    // (95:2) <TinySlider>
    function create_default_slot_14(ctx) {
    	let each_1_anchor;
    	let each_value_16 = /*fixedItems*/ ctx[6];
    	validate_each_argument(each_value_16);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_16.length; i += 1) {
    		each_blocks[i] = create_each_block_16(get_each_context_16(ctx, each_value_16, i));
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
    			if (dirty[0] & /*fixedItems*/ 64) {
    				each_value_16 = /*fixedItems*/ ctx[6];
    				validate_each_argument(each_value_16);
    				let i;

    				for (i = 0; i < each_value_16.length; i += 1) {
    					const child_ctx = get_each_context_16(ctx, each_value_16, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_16(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_16.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(95:2) <TinySlider>",
    		ctx
    	});

    	return block;
    }

    // (143:4) {#each fixedItems2 as item}
    function create_each_block_15(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 143, 5, 5252);
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
    		id: create_each_block_15.name,
    		type: "each",
    		source: "(143:4) {#each fixedItems2 as item}",
    		ctx
    	});

    	return block;
    }

    // (142:3) <TinySlider let:setIndex let:currentIndex>
    function create_default_slot_13(ctx) {
    	let each_1_anchor;
    	let each_value_15 = /*fixedItems2*/ ctx[7];
    	validate_each_argument(each_value_15);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_15.length; i += 1) {
    		each_blocks[i] = create_each_block_15(get_each_context_15(ctx, each_value_15, i));
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
    			if (dirty[0] & /*fixedItems2*/ 128) {
    				each_value_15 = /*fixedItems2*/ ctx[7];
    				validate_each_argument(each_value_15);
    				let i;

    				for (i = 0; i < each_value_15.length; i += 1) {
    					const child_ctx = get_each_context_15(ctx, each_value_15, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_15(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_15.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(142:3) <TinySlider let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (148:5) {#if currentIndex > 0}
    function create_if_block_18(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[17](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-lfm80c");
    			add_location(button, file, 148, 6, 5368);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
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
    		id: create_if_block_18.name,
    		type: "if",
    		source: "(148:5) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (152:5) {#if currentIndex < items.length - 1}
    function create_if_block_17(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;

    	arrow = new Arrow({
    			props: { direction: "right" },
    			$$inline: true
    		});

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[18](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-lfm80c");
    			add_location(button, file, 152, 6, 5523);
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
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(152:5) {#if currentIndex < items.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (147:4) <svelte:fragment slot="controls">
    function create_controls_slot_9(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_18(ctx);
    	let if_block1 = /*currentIndex*/ ctx[4] < /*items*/ ctx[5].length - 1 && create_if_block_17(ctx);

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
    			if (/*currentIndex*/ ctx[4] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_18(ctx);
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

    			if (/*currentIndex*/ ctx[4] < /*items*/ ctx[5].length - 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_17(ctx);
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
    		id: create_controls_slot_9.name,
    		type: "slot",
    		source: "(147:4) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (181:4) {#each fixedItems4 as item}
    function create_each_block_14(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 181, 5, 6748);
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
    		id: create_each_block_14.name,
    		type: "each",
    		source: "(181:4) {#each fixedItems4 as item}",
    		ctx
    	});

    	return block;
    }

    // (180:3) <TinySlider let:setIndex let:currentIndex>
    function create_default_slot_12(ctx) {
    	let each_1_anchor;
    	let each_value_14 = /*fixedItems4*/ ctx[9];
    	validate_each_argument(each_value_14);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_14.length; i += 1) {
    		each_blocks[i] = create_each_block_14(get_each_context_14(ctx, each_value_14, i));
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
    			if (dirty[0] & /*fixedItems4*/ 512) {
    				each_value_14 = /*fixedItems4*/ ctx[9];
    				validate_each_argument(each_value_14);
    				let i;

    				for (i = 0; i < each_value_14.length; i += 1) {
    					const child_ctx = get_each_context_14(ctx, each_value_14, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_14(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_14.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(180:3) <TinySlider let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (186:5) {#each fixedItems4 as _, i}
    function create_each_block_13(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[19](/*setIndex*/ ctx[3], /*i*/ ctx[60]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "dot svelte-lfm80c");
    			toggle_class(button, "active", /*i*/ ctx[60] == /*currentIndex*/ ctx[4]);
    			add_location(button, file, 186, 6, 6870);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_3, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*currentIndex*/ 16) {
    				toggle_class(button, "active", /*i*/ ctx[60] == /*currentIndex*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_13.name,
    		type: "each",
    		source: "(186:5) {#each fixedItems4 as _, i}",
    		ctx
    	});

    	return block;
    }

    // (185:4) 
    function create_controls_slot_8(ctx) {
    	let div;
    	let each_value_13 = /*fixedItems4*/ ctx[9];
    	validate_each_argument(each_value_13);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_13.length; i += 1) {
    		each_blocks[i] = create_each_block_13(get_each_context_13(ctx, each_value_13, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "slot", "controls");
    			attr_dev(div, "class", "dots svelte-lfm80c");
    			add_location(div, file, 184, 4, 6794);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentIndex, setIndex*/ 24) {
    				each_value_13 = /*fixedItems4*/ ctx[9];
    				validate_each_argument(each_value_13);
    				let i;

    				for (i = 0; i < each_value_13.length; i += 1) {
    					const child_ctx = get_each_context_13(ctx, each_value_13, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_13(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_13.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot_8.name,
    		type: "slot",
    		source: "(185:4) ",
    		ctx
    	});

    	return block;
    }

    // (221:4) {#each fixedItems3 as item}
    function create_each_block_12(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 221, 5, 8349);
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
    		id: create_each_block_12.name,
    		type: "each",
    		source: "(221:4) {#each fixedItems3 as item}",
    		ctx
    	});

    	return block;
    }

    // (220:3) <TinySlider let:setIndex let:currentIndex>
    function create_default_slot_11(ctx) {
    	let each_1_anchor;
    	let each_value_12 = /*fixedItems3*/ ctx[8];
    	validate_each_argument(each_value_12);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_12.length; i += 1) {
    		each_blocks[i] = create_each_block_12(get_each_context_12(ctx, each_value_12, i));
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
    			if (dirty[0] & /*fixedItems3*/ 256) {
    				each_value_12 = /*fixedItems3*/ ctx[8];
    				validate_each_argument(each_value_12);
    				let i;

    				for (i = 0; i < each_value_12.length; i += 1) {
    					const child_ctx = get_each_context_12(ctx, each_value_12, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_12(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_12.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(220:3) <TinySlider let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (226:5) {#each fixedItems3 as item, i}
    function create_each_block_11(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[20](/*setIndex*/ ctx[3], /*i*/ ctx[60]);
    	}

    	function focus_handler() {
    		return /*focus_handler*/ ctx[21](/*setIndex*/ ctx[3], /*i*/ ctx[60]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "height", "60");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 231, 7, 8643);
    			attr_dev(button, "class", "thumbnail svelte-lfm80c");
    			toggle_class(button, "active", /*i*/ ctx[60] == /*currentIndex*/ ctx[4]);
    			add_location(button, file, 226, 6, 8485);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", click_handler_4, false, false, false),
    					listen_dev(button, "focus", focus_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*currentIndex*/ 16) {
    				toggle_class(button, "active", /*i*/ ctx[60] == /*currentIndex*/ ctx[4]);
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
    		id: create_each_block_11.name,
    		type: "each",
    		source: "(226:5) {#each fixedItems3 as item, i}",
    		ctx
    	});

    	return block;
    }

    // (225:4) 
    function create_controls_slot_7(ctx) {
    	let div;
    	let each_value_11 = /*fixedItems3*/ ctx[8];
    	validate_each_argument(each_value_11);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_11.length; i += 1) {
    		each_blocks[i] = create_each_block_11(get_each_context_11(ctx, each_value_11, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "slot", "controls");
    			attr_dev(div, "class", "thumbnails grid svelte-lfm80c");
    			add_location(div, file, 224, 4, 8395);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentIndex, setIndex, fixedItems3*/ 280) {
    				each_value_11 = /*fixedItems3*/ ctx[8];
    				validate_each_argument(each_value_11);
    				let i;

    				for (i = 0; i < each_value_11.length; i += 1) {
    					const child_ctx = get_each_context_11(ctx, each_value_11, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_11(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_11.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot_7.name,
    		type: "slot",
    		source: "(225:4) ",
    		ctx
    	});

    	return block;
    }

    // (262:3) {#each fixedItems4 as item}
    function create_each_block_10(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 262, 4, 10002);
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
    		id: create_each_block_10.name,
    		type: "each",
    		source: "(262:3) {#each fixedItems4 as item}",
    		ctx
    	});

    	return block;
    }

    // (261:2) <TinySlider bind:setIndex bind:currentIndex>
    function create_default_slot_10(ctx) {
    	let each_1_anchor;
    	let each_value_10 = /*fixedItems4*/ ctx[9];
    	validate_each_argument(each_value_10);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_10.length; i += 1) {
    		each_blocks[i] = create_each_block_10(get_each_context_10(ctx, each_value_10, i));
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
    			if (dirty[0] & /*fixedItems4*/ 512) {
    				each_value_10 = /*fixedItems4*/ ctx[9];
    				validate_each_argument(each_value_10);
    				let i;

    				for (i = 0; i < each_value_10.length; i += 1) {
    					const child_ctx = get_each_context_10(ctx, each_value_10, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_10(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_10.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(261:2) <TinySlider bind:setIndex bind:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (296:3) {#each fixedItems5 as item}
    function create_each_block_9(ctx) {
    	let img;
    	let img_src_value;
    	let img_width_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", img_width_value = /*sliderWidth*/ ctx[2] / 3);
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 296, 4, 11676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sliderWidth*/ 4 && img_width_value !== (img_width_value = /*sliderWidth*/ ctx[2] / 3)) {
    				attr_dev(img, "width", img_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_9.name,
    		type: "each",
    		source: "(296:3) {#each fixedItems5 as item}",
    		ctx
    	});

    	return block;
    }

    // (295:2) <TinySlider let:sliderWidth>
    function create_default_slot_9(ctx) {
    	let each_1_anchor;
    	let each_value_9 = /*fixedItems5*/ ctx[10];
    	validate_each_argument(each_value_9);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_9.length; i += 1) {
    		each_blocks[i] = create_each_block_9(get_each_context_9(ctx, each_value_9, i));
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
    			if (dirty[0] & /*fixedItems5, sliderWidth*/ 1028) {
    				each_value_9 = /*fixedItems5*/ ctx[10];
    				validate_each_argument(each_value_9);
    				let i;

    				for (i = 0; i < each_value_9.length; i += 1) {
    					const child_ctx = get_each_context_9(ctx, each_value_9, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_9.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(295:2) <TinySlider let:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (327:3) {#each fixedItems5 as item}
    function create_each_block_8(ctx) {
    	let img;
    	let img_src_value;
    	let img_width_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", img_width_value = (/*sliderWidth*/ ctx[2] - 20) / 3);
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 327, 4, 12605);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sliderWidth*/ 4 && img_width_value !== (img_width_value = (/*sliderWidth*/ ctx[2] - 20) / 3)) {
    				attr_dev(img, "width", img_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_8.name,
    		type: "each",
    		source: "(327:3) {#each fixedItems5 as item}",
    		ctx
    	});

    	return block;
    }

    // (326:2) <TinySlider gap="10px" let:sliderWidth>
    function create_default_slot_8(ctx) {
    	let each_1_anchor;
    	let each_value_8 = /*fixedItems5*/ ctx[10];
    	validate_each_argument(each_value_8);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_8.length; i += 1) {
    		each_blocks[i] = create_each_block_8(get_each_context_8(ctx, each_value_8, i));
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
    			if (dirty[0] & /*fixedItems5, sliderWidth*/ 1028) {
    				each_value_8 = /*fixedItems5*/ ctx[10];
    				validate_each_argument(each_value_8);
    				let i;

    				for (i = 0; i < each_value_8.length; i += 1) {
    					const child_ctx = get_each_context_8(ctx, each_value_8, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_8.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(326:2) <TinySlider gap=\\\"10px\\\" let:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (351:3) {#each { length: 20 } as _}
    function create_each_block_7(ctx) {
    	let div;
    	let a;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			a.textContent = "Link";
    			t1 = space();
    			attr_dev(a, "href", "https://svelte.dev");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-lfm80c");
    			add_location(a, file, 352, 5, 13595);
    			attr_dev(div, "class", "item svelte-lfm80c");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 351, 4, 13525);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(div, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_7.name,
    		type: "each",
    		source: "(351:3) {#each { length: 20 } as _}",
    		ctx
    	});

    	return block;
    }

    // (350:2) <TinySlider gap="0.5rem">
    function create_default_slot_7(ctx) {
    	let each_1_anchor;
    	let each_value_7 = { length: 20 };
    	validate_each_argument(each_value_7);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_7.length; i += 1) {
    		each_blocks[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
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
    		p: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(350:2) <TinySlider gap=\\\"0.5rem\\\">",
    		ctx
    	});

    	return block;
    }

    // (390:6) {#if currentIndex + 1 >= i}
    function create_if_block_16(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 390, 7, 15116);
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
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(390:6) {#if currentIndex + 1 >= i}",
    		ctx
    	});

    	return block;
    }

    // (388:4) {#each fixedItems6 as item, i}
    function create_each_block_6(ctx) {
    	let div;
    	let t;
    	let style_width = `${/*sliderWidth*/ ctx[2]}px`;
    	let if_block = /*currentIndex*/ ctx[4] + 1 >= /*i*/ ctx[60] && create_if_block_16(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div, "class", "svelte-lfm80c");
    			set_style(div, "width", style_width, false);
    			add_location(div, file, 388, 5, 15037);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*currentIndex*/ ctx[4] + 1 >= /*i*/ ctx[60]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_16(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*sliderWidth*/ 4 && style_width !== (style_width = `${/*sliderWidth*/ ctx[2]}px`)) {
    				set_style(div, "width", style_width, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(388:4) {#each fixedItems6 as item, i}",
    		ctx
    	});

    	return block;
    }

    // (387:3) <TinySlider let:setIndex let:currentIndex let:sliderWidth let:reachedEnd>
    function create_default_slot_6(ctx) {
    	let each_1_anchor;
    	let each_value_6 = /*fixedItems6*/ ctx[11];
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
    			if (dirty[0] & /*sliderWidth, fixedItems6, currentIndex*/ 2068) {
    				each_value_6 = /*fixedItems6*/ ctx[11];
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
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(387:3) <TinySlider let:setIndex let:currentIndex let:sliderWidth let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (397:5) {#if currentIndex > 0}
    function create_if_block_15(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_8() {
    		return /*click_handler_8*/ ctx[27](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-lfm80c");
    			add_location(button, file, 397, 6, 15258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_8, false, false, false);
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
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(397:5) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (401:5) {#if !reachedEnd}
    function create_if_block_14(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;

    	arrow = new Arrow({
    			props: { direction: "right" },
    			$$inline: true
    		});

    	function click_handler_9() {
    		return /*click_handler_9*/ ctx[28](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-lfm80c");
    			add_location(button, file, 401, 6, 15393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_9, false, false, false);
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
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(401:5) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (396:4) <svelte:fragment slot="controls">
    function create_controls_slot_6(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_15(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[46] && create_if_block_14(ctx);

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
    			if (/*currentIndex*/ ctx[4] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_15(ctx);
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

    			if (!/*reachedEnd*/ ctx[46]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*reachedEnd*/ 32768) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_14(ctx);
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
    		id: create_controls_slot_6.name,
    		type: "slot",
    		source: "(396:4) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (433:7) {#if shown.includes(index)}
    function create_if_block_13(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 433, 8, 16975);
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
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(433:7) {#if shown.includes(index)}",
    		ctx
    	});

    	return block;
    }

    // (431:5) {#each fixedItems7 as item, index}
    function create_each_block_5(ctx) {
    	let div;
    	let show_if = /*shown*/ ctx[45].includes(/*index*/ ctx[49]);
    	let t;
    	let if_block = show_if && create_if_block_13(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div, "class", "item svelte-lfm80c");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `300px`, false);
    			add_location(div, file, 431, 6, 16866);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*shown*/ 16384) show_if = /*shown*/ ctx[45].includes(/*index*/ ctx[49]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_13(ctx);
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
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(431:5) {#each fixedItems7 as item, index}",
    		ctx
    	});

    	return block;
    }

    // (430:4) <TinySlider gap="0.5rem" let:setIndex let:currentIndex let:shown let:reachedEnd>
    function create_default_slot_5(ctx) {
    	let each_1_anchor;
    	let each_value_5 = /*fixedItems7*/ ctx[12];
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
    			if (dirty[0] & /*fixedItems7*/ 4096 | dirty[1] & /*shown*/ 16384) {
    				each_value_5 = /*fixedItems7*/ ctx[12];
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
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(430:4) <TinySlider gap=\\\"0.5rem\\\" let:setIndex let:currentIndex let:shown let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (440:6) {#if currentIndex > 0}
    function create_if_block_12(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_10() {
    		return /*click_handler_10*/ ctx[29](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-lfm80c");
    			add_location(button, file, 440, 7, 17123);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_10, false, false, false);
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
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(440:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (444:6) {#if !reachedEnd}
    function create_if_block_11(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;

    	arrow = new Arrow({
    			props: { direction: "right" },
    			$$inline: true
    		});

    	function click_handler_11() {
    		return /*click_handler_11*/ ctx[30](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-lfm80c");
    			add_location(button, file, 444, 7, 17261);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_11, false, false, false);
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
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(444:6) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (439:5) <svelte:fragment slot="controls">
    function create_controls_slot_5(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_12(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[46] && create_if_block_11(ctx);

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
    			if (/*currentIndex*/ ctx[4] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_12(ctx);
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

    			if (!/*reachedEnd*/ ctx[46]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*reachedEnd*/ 32768) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_11(ctx);
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
    		id: create_controls_slot_5.name,
    		type: "slot",
    		source: "(439:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (507:7) {#if shown.includes(index)}
    function create_if_block_10(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 507, 7, 19781);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*portaitItems*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(507:7) {#if shown.includes(index)}",
    		ctx
    	});

    	return block;
    }

    // (505:5) {#each portaitItems as item, index}
    function create_each_block_4(ctx) {
    	let div;
    	let show_if = /*shown*/ ctx[45].includes(/*index*/ ctx[49]);
    	let t;
    	let if_block = show_if && create_if_block_10(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div, "class", "item svelte-lfm80c");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `300px`, false);
    			add_location(div, file, 505, 6, 19673);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*shown*/ 16384) show_if = /*shown*/ ctx[45].includes(/*index*/ ctx[49]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_10(ctx);
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
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(505:5) {#each portaitItems as item, index}",
    		ctx
    	});

    	return block;
    }

    // (504:4) <TinySlider gap="0.5rem" let:setIndex let:currentIndex let:shown bind:distanceToEnd bind:sliderWidth>
    function create_default_slot_4(ctx) {
    	let each_1_anchor;
    	let each_value_4 = /*portaitItems*/ ctx[0];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
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
    			if (dirty[0] & /*portaitItems*/ 1 | dirty[1] & /*shown*/ 16384) {
    				each_value_4 = /*portaitItems*/ ctx[0];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
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
    		source: "(504:4) <TinySlider gap=\\\"0.5rem\\\" let:setIndex let:currentIndex let:shown bind:distanceToEnd bind:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (514:6) {#if currentIndex > 0}
    function create_if_block_9(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_12() {
    		return /*click_handler_12*/ ctx[31](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-lfm80c");
    			add_location(button, file, 514, 7, 19929);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_12, false, false, false);
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
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(514:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (513:5) <svelte:fragment slot="controls">
    function create_controls_slot_4(ctx) {
    	let t;
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*currentIndex*/ ctx[4] > 0 && create_if_block_9(ctx);

    	arrow = new Arrow({
    			props: { direction: "right" },
    			$$inline: true
    		});

    	function click_handler_13() {
    		return /*click_handler_13*/ ctx[32](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-lfm80c");
    			add_location(button, file, 517, 6, 20041);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_13, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*currentIndex*/ ctx[4] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_9(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(arrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(arrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(button);
    			destroy_component(arrow);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot_4.name,
    		type: "slot",
    		source: "(513:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (543:5) {#each { length: 10 } as _}
    function create_each_block_3(ctx) {
    	let div;
    	let style_background_color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "item svelte-lfm80c");
    			set_style(div, "background-color", style_background_color, false);
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 543, 6, 20858);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(543:5) {#each { length: 10 } as _}",
    		ctx
    	});

    	return block;
    }

    // (542:4) <TinySlider gap="0.5rem" fill={false} let:setIndex let:currentIndex>
    function create_default_slot_3(ctx) {
    	let each_1_anchor;
    	let each_value_3 = { length: 10 };
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
    			if (dirty & /*Math*/ 0) {
    				each_value_3 = { length: 10 };
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
    		source: "(542:4) <TinySlider gap=\\\"0.5rem\\\" fill={false} let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (548:6) {#if currentIndex > 0}
    function create_if_block_8(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_14() {
    		return /*click_handler_14*/ ctx[35](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-lfm80c");
    			add_location(button, file, 548, 7, 21092);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_14, false, false, false);
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
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(548:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (552:6) {#if currentIndex < 9}
    function create_if_block_7(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;

    	arrow = new Arrow({
    			props: { direction: "right" },
    			$$inline: true
    		});

    	function click_handler_15() {
    		return /*click_handler_15*/ ctx[36](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-lfm80c");
    			add_location(button, file, 552, 7, 21235);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_15, false, false, false);
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
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(552:6) {#if currentIndex < 9}",
    		ctx
    	});

    	return block;
    }

    // (547:5) <svelte:fragment slot="controls">
    function create_controls_slot_3(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_8(ctx);
    	let if_block1 = /*currentIndex*/ ctx[4] < 9 && create_if_block_7(ctx);

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
    			if (/*currentIndex*/ ctx[4] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_8(ctx);
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

    			if (/*currentIndex*/ ctx[4] < 9) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_7(ctx);
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
    		id: create_controls_slot_3.name,
    		type: "slot",
    		source: "(547:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (575:5) {#each { length: 10 } as _}
    function create_each_block_2(ctx) {
    	let div;
    	let style_background_color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "item svelte-lfm80c");
    			set_style(div, "background-color", style_background_color, false);
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 575, 6, 22089);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
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
    		source: "(575:5) {#each { length: 10 } as _}",
    		ctx
    	});

    	return block;
    }

    // (574:4) <TinySlider gap="0.5rem" transitionDuration="1000" let:setIndex let:currentIndex let:reachedEnd>
    function create_default_slot_2(ctx) {
    	let each_1_anchor;
    	let each_value_2 = { length: 10 };
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
    				each_value_2 = { length: 10 };
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
    		source: "(574:4) <TinySlider gap=\\\"0.5rem\\\" transitionDuration=\\\"1000\\\" let:setIndex let:currentIndex let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (580:6) {#if currentIndex > 0}
    function create_if_block_6(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_16() {
    		return /*click_handler_16*/ ctx[37](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-lfm80c");
    			add_location(button, file, 580, 7, 22323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_16, false, false, false);
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(580:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (584:6) {#if !reachedEnd}
    function create_if_block_5(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;

    	arrow = new Arrow({
    			props: { direction: "right" },
    			$$inline: true
    		});

    	function click_handler_17() {
    		return /*click_handler_17*/ ctx[38](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-lfm80c");
    			add_location(button, file, 584, 7, 22461);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_17, false, false, false);
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
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(584:6) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (579:5) <svelte:fragment slot="controls">
    function create_controls_slot_2(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_6(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[46] && create_if_block_5(ctx);

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
    			if (/*currentIndex*/ ctx[4] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6(ctx);
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

    			if (!/*reachedEnd*/ ctx[46]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*reachedEnd*/ 32768) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_5(ctx);
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
    		id: create_controls_slot_2.name,
    		type: "slot",
    		source: "(579:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (607:5) {#each { length: 10 } as _}
    function create_each_block_1(ctx) {
    	let div;
    	let style_background_color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "item svelte-lfm80c");
    			set_style(div, "background-color", style_background_color, false);
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 607, 6, 23374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(607:5) {#each { length: 10 } as _}",
    		ctx
    	});

    	return block;
    }

    // (606:4) <TinySlider gap="0.5rem" threshold="100" let:setIndex let:currentIndex let:reachedEnd>
    function create_default_slot_1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = { length: 10 };
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
    			if (dirty & /*Math*/ 0) {
    				each_value_1 = { length: 10 };
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
    		source: "(606:4) <TinySlider gap=\\\"0.5rem\\\" threshold=\\\"100\\\" let:setIndex let:currentIndex let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (612:6) {#if currentIndex > 0}
    function create_if_block_4(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_18() {
    		return /*click_handler_18*/ ctx[39](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-lfm80c");
    			add_location(button, file, 612, 7, 23608);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_18, false, false, false);
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
    		source: "(612:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (616:6) {#if !reachedEnd}
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

    	function click_handler_19() {
    		return /*click_handler_19*/ ctx[40](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-lfm80c");
    			add_location(button, file, 616, 7, 23746);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_19, false, false, false);
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
    		source: "(616:6) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (611:5) <svelte:fragment slot="controls">
    function create_controls_slot_1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_4(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[46] && create_if_block_3(ctx);

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
    			if (/*currentIndex*/ ctx[4] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16) {
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

    			if (!/*reachedEnd*/ ctx[46]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*reachedEnd*/ 32768) {
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
    		source: "(611:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (631:5) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}
    function create_if_block_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[47])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 631, 6, 24298);
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
    		source: "(631:5) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}",
    		ctx
    	});

    	return block;
    }

    // (628:2) {#each cardItems as item, index}
    function create_each_block(ctx) {
    	let div;
    	let a0;
    	let show_if = [/*index*/ ctx[49], /*index*/ ctx[49] + 1, /*index*/ ctx[49] - 1].some(func);
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
    		return /*func*/ ctx[16](/*shown*/ ctx[45], ...args);
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
    			attr_dev(a0, "class", "thumbnail svelte-lfm80c");
    			attr_dev(a0, "href", "https://google.com");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file, 629, 4, 24156);
    			attr_dev(a1, "class", "title svelte-lfm80c");
    			attr_dev(a1, "href", "https://google.com");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file, 635, 4, 24368);
    			attr_dev(p, "class", "svelte-lfm80c");
    			add_location(p, file, 637, 4, 24454);
    			attr_dev(a2, "class", "button svelte-lfm80c");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file, 641, 4, 24544);
    			attr_dev(div, "class", "card svelte-lfm80c");
    			add_location(div, file, 628, 3, 24094);
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
    					listen_dev(a2, "click", prevent_default(/*click_handler*/ ctx[15]), false, true, false),
    					listen_dev(div, "click", /*click_handler_22*/ ctx[43], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[1] & /*shown*/ 16384) show_if = [/*index*/ ctx[49], /*index*/ ctx[49] + 1, /*index*/ ctx[49] - 1].some(func);

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
    		source: "(628:2) {#each cardItems as item, index}",
    		ctx
    	});

    	return block;
    }

    // (627:1) <TinySlider gap="1rem" let:setIndex let:currentIndex let:shown let:reachedEnd>
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let each_value = /*cardItems*/ ctx[14];
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
    			if (dirty[0] & /*cardItems*/ 16384 | dirty[1] & /*shown*/ 16384) {
    				each_value = /*cardItems*/ ctx[14];
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
    		source: "(627:1) <TinySlider gap=\\\"1rem\\\" let:setIndex let:currentIndex let:shown let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (647:3) {#if currentIndex > 0}
    function create_if_block_1(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_20() {
    		return /*click_handler_20*/ ctx[41](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-lfm80c");
    			add_location(button, file, 647, 4, 24707);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_20, false, false, false);
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
    		source: "(647:3) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (651:3) {#if !reachedEnd}
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

    	function click_handler_21() {
    		return /*click_handler_21*/ ctx[42](/*setIndex*/ ctx[3], /*currentIndex*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-lfm80c");
    			add_location(button, file, 651, 4, 24836);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_21, false, false, false);
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
    		source: "(651:3) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (646:2) <svelte:fragment slot="controls">
    function create_controls_slot(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_1(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[46] && create_if_block(ctx);

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
    			if (/*currentIndex*/ ctx[4] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16) {
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

    			if (!/*reachedEnd*/ ctx[46]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*reachedEnd*/ 32768) {
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
    		source: "(646:2) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let h1;
    	let mark0;
    	let t1;
    	let t2;
    	let tinyslider0;
    	let t3;
    	let div22;
    	let div0;
    	let p0;
    	let t5;
    	let p1;
    	let a0;
    	let t7;
    	let h20;
    	let t9;
    	let p2;
    	let t11;
    	let code0;
    	let t12;
    	let mark1;
    	let t14;
    	let code1;
    	let t15;
    	let mark2;
    	let t17;
    	let p3;
    	let t19;
    	let code2;
    	let t20;
    	let mark3;
    	let t22;
    	let mark4;
    	let t24;
    	let t25;
    	let code3;
    	let t26;
    	let mark5;
    	let t28;
    	let mark6;
    	let t30;
    	let t31;
    	let h21;
    	let t33;
    	let div1;
    	let p4;
    	let t35;
    	let p5;
    	let code4;
    	let t36;
    	let mark7;
    	let t38;
    	let br0;
    	let t39;
    	let br1;
    	let t40;
    	let br2;
    	let t41;
    	let br3;
    	let t42;
    	let mark8;
    	let t44;
    	let t45;
    	let tinyslider1;
    	let t46;
    	let div5;
    	let h30;
    	let t48;
    	let p6;
    	let h40;
    	let t51;
    	let p7;
    	let t52;
    	let code5;
    	let t53;
    	let mark9;
    	let t55;
    	let t56;
    	let t57;
    	let ul;
    	let li0;
    	let mark10;
    	let t59;
    	let t60;
    	let li1;
    	let mark11;
    	let t62;
    	let t63;
    	let p8;
    	let t64;
    	let code6;
    	let t66;
    	let t67;
    	let p9;
    	let code7;
    	let t68;
    	let mark12;
    	let t70;
    	let mark13;
    	let t72;
    	let mark14;
    	let t74;
    	let br4;
    	let t75;
    	let br5;
    	let t76;
    	let br6;
    	let t77;
    	let br7;
    	let t78;
    	let br8;
    	let t79;
    	let mark15;
    	let t81;
    	let br9;
    	let t82;
    	let mark16;
    	let t84;
    	let br10;
    	let t85;
    	let mark17;
    	let t87;
    	let mark18;
    	let t89;
    	let br11;
    	let t90;
    	let br12;
    	let t91;
    	let br13;
    	let t92;
    	let mark19;
    	let t94;
    	let br14;
    	let t95;
    	let mark20;
    	let t97;
    	let mark21;
    	let t99;
    	let br15;
    	let t100;
    	let br16;
    	let t101;
    	let br17;
    	let t102;
    	let mark22;
    	let t104;
    	let t105;
    	let div2;
    	let tinyslider2;
    	let t106;
    	let p10;
    	let t108;
    	let p11;
    	let code8;
    	let t109;
    	let mark23;
    	let t111;
    	let mark24;
    	let t113;
    	let mark25;
    	let t115;
    	let br18;
    	let t116;
    	let br19;
    	let t117;
    	let br20;
    	let t118;
    	let br21;
    	let t119;
    	let br22;
    	let t120;
    	let br23;
    	let t121;
    	let br24;
    	let t122;
    	let br25;
    	let t123;
    	let mark26;
    	let t125;
    	let br26;
    	let t126;
    	let mark27;
    	let t128;
    	let br27;
    	let t129;
    	let br28;
    	let t130;
    	let br29;
    	let t131;
    	let mark28;
    	let t133;
    	let t134;
    	let div3;
    	let tinyslider3;
    	let t135;
    	let p12;
    	let t137;
    	let p13;
    	let code9;
    	let t138;
    	let mark29;
    	let t140;
    	let mark30;
    	let t142;
    	let mark31;
    	let t144;
    	let br30;
    	let t145;
    	let br31;
    	let t146;
    	let br32;
    	let t147;
    	let br33;
    	let t148;
    	let br34;
    	let t149;
    	let br35;
    	let t150;
    	let br36;
    	let t151;
    	let br37;
    	let t152;
    	let mark32;
    	let t154;
    	let br38;
    	let t155;
    	let mark33;
    	let t157;
    	let br39;
    	let t158;
    	let mark34;
    	let t160;
    	let br40;
    	let t161;
    	let br41;
    	let t162;
    	let br42;
    	let t163;
    	let br43;
    	let t164;
    	let br44;
    	let t165;
    	let mark35;
    	let t167;
    	let t168;
    	let div4;
    	let tinyslider4;
    	let t169;
    	let h41;
    	let t171;
    	let p14;
    	let t172;
    	let code10;
    	let t174;
    	let code11;
    	let t176;
    	let code12;
    	let t178;
    	let t179;
    	let p15;
    	let code13;
    	let t180;
    	let br45;
    	let t181;
    	let mark36;
    	let br46;
    	let t183;
    	let br47;
    	let t184;
    	let br48;
    	let t185;
    	let mark37;
    	let t187;
    	let mark38;
    	let t189;
    	let mark39;
    	let t191;
    	let br49;
    	let t192;
    	let br50;
    	let t193;
    	let br51;
    	let t194;
    	let br52;
    	let t195;
    	let mark40;
    	let t197;
    	let br53;
    	let t198;
    	let br54;
    	let t199;
    	let mark41;
    	let t201;
    	let br55;
    	let t202;
    	let mark42;
    	let t204;
    	let br56;
    	let t205;
    	let mark43;
    	let t207;
    	let br57;
    	let t208;
    	let tinyslider5;
    	let updating_setIndex;
    	let updating_currentIndex;
    	let t209;
    	let p16;
    	let t210;
    	let code14;
    	let t212;
    	let t213;
    	let button0;
    	let t215;
    	let button1;
    	let t217;
    	let button2;
    	let t219;
    	let div6;
    	let h31;
    	let t221;
    	let p17;
    	let t223;
    	let h42;
    	let t225;
    	let p18;
    	let t226;
    	let code15;
    	let t228;
    	let code16;
    	let t230;
    	let t231;
    	let p19;
    	let code17;
    	let t232;
    	let mark44;
    	let t234;
    	let mark45;
    	let t236;
    	let br58;
    	let t237;
    	let br59;
    	let t238;
    	let mark46;
    	let t240;
    	let br60;
    	let t241;
    	let br61;
    	let t242;
    	let mark47;
    	let t244;
    	let t245;
    	let tinyslider6;
    	let t246;
    	let h43;
    	let t248;
    	let p20;
    	let t249;
    	let code18;
    	let t251;
    	let t252;
    	let code19;
    	let t253;
    	let br62;
    	let t254;
    	let br63;
    	let t255;
    	let t256;
    	let p21;
    	let t257;
    	let code20;
    	let t259;
    	let t260;
    	let p22;
    	let code21;
    	let t261;
    	let mark48;
    	let t263;
    	let mark49;
    	let t265;
    	let br64;
    	let t266;
    	let br65;
    	let t267;
    	let br66;
    	let t268;
    	let br67;
    	let t269;
    	let mark50;
    	let t271;
    	let t272;
    	let tinyslider7;
    	let t273;
    	let div7;
    	let h32;
    	let t275;
    	let p23;
    	let t277;
    	let p24;
    	let code22;
    	let t278;
    	let mark51;
    	let t280;
    	let br68;
    	let t281;
    	let br69;
    	let t282;
    	let br70;
    	let t283;
    	let br71;
    	let t284;
    	let br72;
    	let t285;
    	let br73;
    	let t286;
    	let mark52;
    	let t288;
    	let t289;
    	let tinyslider8;
    	let t290;
    	let div11;
    	let h33;
    	let t292;
    	let p25;
    	let t293;
    	let code23;
    	let t295;
    	let t296;
    	let p26;
    	let t297;
    	let code24;
    	let t299;
    	let p27;
    	let code25;
    	let t300;
    	let mark53;
    	let t302;
    	let mark54;
    	let t304;
    	let br74;
    	let t305;
    	let br75;
    	let t306;
    	let br76;
    	let t307;
    	let mark55;
    	let t309;
    	let br77;
    	let t310;
    	let br78;
    	let t311;
    	let br79;
    	let t312;
    	let br80;
    	let t313;
    	let br81;
    	let t314;
    	let br82;
    	let t315;
    	let br83;
    	let t316;
    	let mark56;
    	let t318;
    	let br84;
    	let t319;
    	let p28;
    	let t321;
    	let div8;
    	let tinyslider9;
    	let t322;
    	let p29;
    	let t323;
    	let mark57;
    	let t325;
    	let mark58;
    	let t327;
    	let mark59;
    	let t329;
    	let mark60;
    	let t331;
    	let t332;
    	let p30;
    	let code26;
    	let t333;
    	let mark61;
    	let t335;
    	let mark62;
    	let t337;
    	let br85;
    	let t338;
    	let br86;
    	let t339;
    	let br87;
    	let t340;
    	let mark63;
    	let t342;
    	let br88;
    	let t343;
    	let br89;
    	let t344;
    	let br90;
    	let t345;
    	let br91;
    	let t346;
    	let br92;
    	let t347;
    	let br93;
    	let t348;
    	let br94;
    	let t349;
    	let mark64;
    	let t351;
    	let t352;
    	let div10;
    	let div9;
    	let tinyslider10;
    	let t353;
    	let div14;
    	let h34;
    	let t355;
    	let p31;
    	let t357;
    	let h44;
    	let t359;
    	let p32;
    	let t360;
    	let mark65;
    	let t362;
    	let t363;
    	let p33;
    	let code27;
    	let t364;
    	let mark66;
    	let t366;
    	let mark67;
    	let t368;
    	let br95;
    	let t369;
    	let br96;
    	let t370;
    	let mark68;
    	let t372;
    	let t373;
    	let h45;
    	let t375;
    	let p34;
    	let t376;
    	let mark69;
    	let t378;
    	let mark70;
    	let t380;
    	let mark71;
    	let t382;
    	let mark72;
    	let t384;
    	let t385;
    	let p35;
    	let code28;
    	let t386;
    	let br97;
    	let t387;
    	let mark73;
    	let t389;
    	let br98;
    	let t390;
    	let mark74;
    	let t392;
    	let br99;
    	let t393;
    	let br100;
    	let t394;
    	let br101;
    	let t395;
    	let mark75;
    	let t397;
    	let mark76;
    	let t399;
    	let br102;
    	let t400;
    	let br103;
    	let t401;
    	let mark77;
    	let t403;
    	let t404;
    	let p36;
    	let t405;
    	let mark78;
    	let t407;
    	let mark79;
    	let t409;
    	let mark80;
    	let t411;
    	let t412;
    	let p37;
    	let code29;
    	let t413;
    	let br104;
    	let t414;
    	let mark81;
    	let br105;
    	let t416;
    	let mark82;
    	let t418;
    	let br106;
    	let t419;
    	let br107;
    	let t420;
    	let br108;
    	let t421;
    	let mark83;
    	let t423;
    	let mark84;
    	let t425;
    	let br109;
    	let t426;
    	let br110;
    	let t427;
    	let mark85;
    	let t429;
    	let t430;
    	let div13;
    	let div12;
    	let tinyslider11;
    	let updating_distanceToEnd;
    	let updating_sliderWidth;
    	let t431;
    	let div21;
    	let h35;
    	let t433;
    	let h46;
    	let t435;
    	let p38;
    	let t436;
    	let mark86;
    	let t438;
    	let t439;
    	let p39;
    	let code30;
    	let t440;
    	let mark87;
    	let t442;
    	let mark88;
    	let t444;
    	let br111;
    	let t445;
    	let br112;
    	let t446;
    	let mark89;
    	let t448;
    	let t449;
    	let div16;
    	let div15;
    	let tinyslider12;
    	let t450;
    	let h47;
    	let t452;
    	let p40;
    	let t453;
    	let mark90;
    	let t455;
    	let t456;
    	let p41;
    	let code31;
    	let t457;
    	let mark91;
    	let t459;
    	let mark92;
    	let t461;
    	let br113;
    	let t462;
    	let br114;
    	let t463;
    	let mark93;
    	let t465;
    	let t466;
    	let div18;
    	let div17;
    	let tinyslider13;
    	let t467;
    	let h48;
    	let t469;
    	let p42;
    	let t470;
    	let mark94;
    	let t472;
    	let t473;
    	let p43;
    	let code32;
    	let t474;
    	let mark95;
    	let t476;
    	let mark96;
    	let t478;
    	let br115;
    	let t479;
    	let br116;
    	let t480;
    	let mark97;
    	let t482;
    	let t483;
    	let div20;
    	let div19;
    	let tinyslider14;
    	let t484;
    	let div23;
    	let tinyslider15;
    	let t485;
    	let div31;
    	let h22;
    	let t487;
    	let div25;
    	let p44;
    	let t489;
    	let div24;
    	let strong0;
    	let t491;
    	let strong1;
    	let t493;
    	let strong2;
    	let t495;
    	let code33;
    	let t497;
    	let code34;
    	let t499;
    	let strong3;
    	let t501;
    	let code35;
    	let t503;
    	let code36;
    	let t505;
    	let strong4;
    	let t507;
    	let code37;
    	let t509;
    	let code38;
    	let t511;
    	let strong5;
    	let t513;
    	let code39;
    	let t515;
    	let code40;
    	let t517;
    	let strong6;
    	let t519;
    	let code41;
    	let t521;
    	let code42;
    	let t523;
    	let strong7;
    	let t525;
    	let code43;
    	let t527;
    	let code44;
    	let t529;
    	let strong8;
    	let t531;
    	let code45;
    	let t533;
    	let code46;
    	let t535;
    	let strong9;
    	let t537;
    	let code47;
    	let t539;
    	let code48;
    	let t541;
    	let strong10;
    	let t543;
    	let code49;
    	let t545;
    	let code50;
    	let t547;
    	let strong11;
    	let t549;
    	let code51;
    	let t551;
    	let code52;
    	let t553;
    	let strong12;
    	let t555;
    	let code53;
    	let t557;
    	let code54;
    	let t559;
    	let strong13;
    	let t561;
    	let h23;
    	let t563;
    	let div27;
    	let p45;
    	let t565;
    	let div26;
    	let strong14;
    	let t567;
    	let strong15;
    	let t569;
    	let strong16;
    	let t571;
    	let code55;
    	let t573;
    	let code56;
    	let t575;
    	let strong17;
    	let t577;
    	let h24;
    	let t579;
    	let div29;
    	let p46;
    	let t581;
    	let div28;
    	let strong18;
    	let t583;
    	let strong19;
    	let t584;
    	let strong20;
    	let t586;
    	let code57;
    	let t588;
    	let code58;
    	let t589;
    	let strong21;
    	let t591;
    	let div30;
    	let t592;
    	let a1;
    	let current;
    	let mounted;
    	let dispose;

    	tinyslider0 = new TinySlider({
    			props: {
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider1 = new TinySlider({
    			props: {
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider2 = new TinySlider({
    			props: {
    				$$slots: {
    					controls: [
    						create_controls_slot_9,
    						({ setIndex, currentIndex }) => ({ 3: setIndex, 4: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0)]
    					],
    					default: [
    						create_default_slot_13,
    						({ setIndex, currentIndex }) => ({ 3: setIndex, 4: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0)]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider3 = new TinySlider({
    			props: {
    				$$slots: {
    					controls: [
    						create_controls_slot_8,
    						({ setIndex, currentIndex }) => ({ 3: setIndex, 4: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0)]
    					],
    					default: [
    						create_default_slot_12,
    						({ setIndex, currentIndex }) => ({ 3: setIndex, 4: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0)]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider4 = new TinySlider({
    			props: {
    				$$slots: {
    					controls: [
    						create_controls_slot_7,
    						({ setIndex, currentIndex }) => ({ 3: setIndex, 4: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0)]
    					],
    					default: [
    						create_default_slot_11,
    						({ setIndex, currentIndex }) => ({ 3: setIndex, 4: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0)]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function tinyslider5_setIndex_binding(value) {
    		/*tinyslider5_setIndex_binding*/ ctx[22](value);
    	}

    	function tinyslider5_currentIndex_binding(value) {
    		/*tinyslider5_currentIndex_binding*/ ctx[23](value);
    	}

    	let tinyslider5_props = {
    		$$slots: { default: [create_default_slot_10] },
    		$$scope: { ctx }
    	};

    	if (/*setIndex*/ ctx[3] !== void 0) {
    		tinyslider5_props.setIndex = /*setIndex*/ ctx[3];
    	}

    	if (/*currentIndex*/ ctx[4] !== void 0) {
    		tinyslider5_props.currentIndex = /*currentIndex*/ ctx[4];
    	}

    	tinyslider5 = new TinySlider({ props: tinyslider5_props, $$inline: true });
    	binding_callbacks.push(() => bind(tinyslider5, 'setIndex', tinyslider5_setIndex_binding));
    	binding_callbacks.push(() => bind(tinyslider5, 'currentIndex', tinyslider5_currentIndex_binding));

    	tinyslider6 = new TinySlider({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot_9,
    						({ sliderWidth }) => ({ 2: sliderWidth }),
    						({ sliderWidth }) => [sliderWidth ? 4 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider7 = new TinySlider({
    			props: {
    				gap: "10px",
    				$$slots: {
    					default: [
    						create_default_slot_8,
    						({ sliderWidth }) => ({ 2: sliderWidth }),
    						({ sliderWidth }) => [sliderWidth ? 4 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider8 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider9 = new TinySlider({
    			props: {
    				$$slots: {
    					controls: [
    						create_controls_slot_6,
    						({ setIndex, currentIndex, sliderWidth, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							2: sliderWidth,
    							46: reachedEnd
    						}),
    						({ setIndex, currentIndex, sliderWidth, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0) | (sliderWidth ? 4 : 0),
    							reachedEnd ? 32768 : 0
    						]
    					],
    					default: [
    						create_default_slot_6,
    						({ setIndex, currentIndex, sliderWidth, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							2: sliderWidth,
    							46: reachedEnd
    						}),
    						({ setIndex, currentIndex, sliderWidth, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0) | (sliderWidth ? 4 : 0),
    							reachedEnd ? 32768 : 0
    						]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider10 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				$$slots: {
    					controls: [
    						create_controls_slot_5,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							45: shown,
    							46: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0),
    							(shown ? 16384 : 0) | (reachedEnd ? 32768 : 0)
    						]
    					],
    					default: [
    						create_default_slot_5,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							45: shown,
    							46: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0),
    							(shown ? 16384 : 0) | (reachedEnd ? 32768 : 0)
    						]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function tinyslider11_distanceToEnd_binding(value) {
    		/*tinyslider11_distanceToEnd_binding*/ ctx[33](value);
    	}

    	function tinyslider11_sliderWidth_binding(value) {
    		/*tinyslider11_sliderWidth_binding*/ ctx[34](value);
    	}

    	let tinyslider11_props = {
    		gap: "0.5rem",
    		$$slots: {
    			controls: [
    				create_controls_slot_4,
    				({ setIndex, currentIndex, shown }) => ({ 3: setIndex, 4: currentIndex, 45: shown }),
    				({ setIndex, currentIndex, shown }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), shown ? 16384 : 0]
    			],
    			default: [
    				create_default_slot_4,
    				({ setIndex, currentIndex, shown }) => ({ 3: setIndex, 4: currentIndex, 45: shown }),
    				({ setIndex, currentIndex, shown }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), shown ? 16384 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*distanceToEnd*/ ctx[1] !== void 0) {
    		tinyslider11_props.distanceToEnd = /*distanceToEnd*/ ctx[1];
    	}

    	if (/*sliderWidth*/ ctx[2] !== void 0) {
    		tinyslider11_props.sliderWidth = /*sliderWidth*/ ctx[2];
    	}

    	tinyslider11 = new TinySlider({
    			props: tinyslider11_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(tinyslider11, 'distanceToEnd', tinyslider11_distanceToEnd_binding));
    	binding_callbacks.push(() => bind(tinyslider11, 'sliderWidth', tinyslider11_sliderWidth_binding));

    	tinyslider12 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				fill: false,
    				$$slots: {
    					controls: [
    						create_controls_slot_3,
    						({ setIndex, currentIndex }) => ({ 3: setIndex, 4: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0)]
    					],
    					default: [
    						create_default_slot_3,
    						({ setIndex, currentIndex }) => ({ 3: setIndex, 4: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0)]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider13 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				transitionDuration: "1000",
    				$$slots: {
    					controls: [
    						create_controls_slot_2,
    						({ setIndex, currentIndex, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							46: reachedEnd
    						}),
    						({ setIndex, currentIndex, reachedEnd }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), reachedEnd ? 32768 : 0]
    					],
    					default: [
    						create_default_slot_2,
    						({ setIndex, currentIndex, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							46: reachedEnd
    						}),
    						({ setIndex, currentIndex, reachedEnd }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), reachedEnd ? 32768 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider14 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				threshold: "100",
    				$$slots: {
    					controls: [
    						create_controls_slot_1,
    						({ setIndex, currentIndex, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							46: reachedEnd
    						}),
    						({ setIndex, currentIndex, reachedEnd }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), reachedEnd ? 32768 : 0]
    					],
    					default: [
    						create_default_slot_1,
    						({ setIndex, currentIndex, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							46: reachedEnd
    						}),
    						({ setIndex, currentIndex, reachedEnd }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), reachedEnd ? 32768 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider15 = new TinySlider({
    			props: {
    				gap: "1rem",
    				$$slots: {
    					controls: [
    						create_controls_slot,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							45: shown,
    							46: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0),
    							(shown ? 16384 : 0) | (reachedEnd ? 32768 : 0)
    						]
    					],
    					default: [
    						create_default_slot,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							45: shown,
    							46: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0),
    							(shown ? 16384 : 0) | (reachedEnd ? 32768 : 0)
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
    			mark0 = element("mark");
    			mark0.textContent = "Svelte";
    			t1 = text(" Tiny Slider");
    			t2 = space();
    			create_component(tinyslider0.$$.fragment);
    			t3 = space();
    			div22 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Svelte Tiny Slider is an easy to use highly customizable and unopinionated carousel or slider. There is little to no styling and how you structure your content is up to you. Images, videos, or any other element will work. Works with touch and keyboard controls. Made with accessiblity in mind.";
    			t5 = space();
    			p1 = element("p");
    			a0 = element("a");
    			a0.textContent = "GitHub";
    			t7 = space();
    			h20 = element("h2");
    			h20.textContent = "Installation";
    			t9 = space();
    			p2 = element("p");
    			p2.textContent = "Install using Yarn or NPM.";
    			t11 = space();
    			code0 = element("code");
    			t12 = text("yarn add ");
    			mark1 = element("mark");
    			mark1.textContent = "svelte-tiny-slider";
    			t14 = space();
    			code1 = element("code");
    			t15 = text("npm install --save ");
    			mark2 = element("mark");
    			mark2.textContent = "svelte-tiny-slider";
    			t17 = space();
    			p3 = element("p");
    			p3.textContent = "Include the slider in your app.";
    			t19 = space();
    			code2 = element("code");
    			t20 = text("import { ");
    			mark3 = element("mark");
    			mark3.textContent = "TinySlider";
    			t22 = text(" } from \"");
    			mark4 = element("mark");
    			mark4.textContent = "svelte-tiny-slider";
    			t24 = text("\"");
    			t25 = space();
    			code3 = element("code");
    			t26 = text("<");
    			mark5 = element("mark");
    			mark5.textContent = "TinySlider";
    			t28 = text(">\r\n\t\t\t\t...\r\n\t\t\t</");
    			mark6 = element("mark");
    			mark6.textContent = "TinySlider";
    			t30 = text(">");
    			t31 = space();
    			h21 = element("h2");
    			h21.textContent = "Usage";
    			t33 = space();
    			div1 = element("div");
    			p4 = element("p");
    			p4.textContent = "In it's most basic state the slider is just a horizontal carousel that can only be controlled through dragging the image either with your mouse or with touch controls. The carousel items can be whatever you want them to be, in this case we're using images.";
    			t35 = space();
    			p5 = element("p");
    			code4 = element("code");
    			t36 = text("<");
    			mark7 = element("mark");
    			mark7.textContent = "TinySlider";
    			t38 = text("> ");
    			br0 = element("br");
    			t39 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br1 = element("br");
    			t40 = text("\r\n\t\t\t\t    <img src={item} alt=\"\" /> ");
    			br2 = element("br");
    			t41 = text("\r\n\t\t\t\t  {/each} ");
    			br3 = element("br");
    			t42 = text("\r\n\t\t\t\t</");
    			mark8 = element("mark");
    			mark8.textContent = "TinySlider";
    			t44 = text(">");
    			t45 = space();
    			create_component(tinyslider1.$$.fragment);
    			t46 = space();
    			div5 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Controls";
    			t48 = space();
    			p6 = element("p");
    			p6.textContent = "From this point there are several options to add any kind of controls you can think of. There two ways you can add controls. Either via slot props or via exported props using two way binds.\r\n\r\n\t\t";
    			h40 = element("h4");
    			h40.textContent = "Controls via slot props";
    			t51 = space();
    			p7 = element("p");
    			t52 = text("The easiest way is to use ");
    			code5 = element("code");
    			t53 = text("slot=\"");
    			mark9 = element("mark");
    			mark9.textContent = "controls";
    			t55 = text("\"");
    			t56 = text(" and use it's slot props. There are several available props, but for controls the most relevant are:");
    			t57 = space();
    			ul = element("ul");
    			li0 = element("li");
    			mark10 = element("mark");
    			mark10.textContent = "setIndex";
    			t59 = text(" is a function that accepts an index of the slide you want to navigate to.");
    			t60 = space();
    			li1 = element("li");
    			mark11 = element("mark");
    			mark11.textContent = "currentIndex";
    			t62 = text(" is an integer of the index you are current only on.");
    			t63 = space();
    			p8 = element("p");
    			t64 = text("In this example we are using ");
    			code6 = element("code");
    			code6.textContent = "svelte:fragment";
    			t66 = text(" but it could be any element you want it to be. Styling isn't included in this code example.");
    			t67 = space();
    			p9 = element("p");
    			code7 = element("code");
    			t68 = text("<");
    			mark12 = element("mark");
    			mark12.textContent = "TinySlider";
    			t70 = text(" let:");
    			mark13 = element("mark");
    			mark13.textContent = "setIndex";
    			t72 = text(" let:");
    			mark14 = element("mark");
    			mark14.textContent = "currentIndex";
    			t74 = text("> ");
    			br4 = element("br");
    			t75 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br5 = element("br");
    			t76 = text("\r\n\t\t\t\t    <img src={item} alt=\"\" /> ");
    			br6 = element("br");
    			t77 = text("\r\n\t\t\t\t  {/each} ");
    			br7 = element("br");
    			t78 = space();
    			br8 = element("br");
    			t79 = text("\r\n\t\t\t\t  <svelte:fragment slot=\"");
    			mark15 = element("mark");
    			mark15.textContent = "controls";
    			t81 = text("\"> ");
    			br9 = element("br");
    			t82 = text("\r\n\t\t\t\t    {#if ");
    			mark16 = element("mark");
    			mark16.textContent = "currentIndex";
    			t84 = text(" > 0} ");
    			br10 = element("br");
    			t85 = text("\r\n\t\t\t\t      <button on:click={() => ");
    			mark17 = element("mark");
    			mark17.textContent = "setIndex";
    			t87 = text("(");
    			mark18 = element("mark");
    			mark18.textContent = "currentIndex";
    			t89 = text(" - 1)}>...</button> ");
    			br11 = element("br");
    			t90 = text("\r\n\t\t\t\t    {/if} ");
    			br12 = element("br");
    			t91 = space();
    			br13 = element("br");
    			t92 = text("\r\n\t\t\t\t    {#if ");
    			mark19 = element("mark");
    			mark19.textContent = "currentIndex";
    			t94 = text(" < items.length - 1} ");
    			br14 = element("br");
    			t95 = text("\r\n\t\t\t\t      <button on:click={() => ");
    			mark20 = element("mark");
    			mark20.textContent = "setIndex";
    			t97 = text("(");
    			mark21 = element("mark");
    			mark21.textContent = "currentIndex";
    			t99 = text(" + 1)}>...</button> ");
    			br15 = element("br");
    			t100 = text("\r\n\t\t\t\t    {/if} ");
    			br16 = element("br");
    			t101 = text("\r\n\t\t\t\t  </svelte:fragment> ");
    			br17 = element("br");
    			t102 = text("\r\n\t\t\t\t</");
    			mark22 = element("mark");
    			mark22.textContent = "TinySlider";
    			t104 = text(">");
    			t105 = space();
    			div2 = element("div");
    			create_component(tinyslider2.$$.fragment);
    			t106 = space();
    			p10 = element("p");
    			p10.textContent = "We could use the same props to implement some type of dots navigation.";
    			t108 = space();
    			p11 = element("p");
    			code8 = element("code");
    			t109 = text("<");
    			mark23 = element("mark");
    			mark23.textContent = "TinySlider";
    			t111 = text(" let:");
    			mark24 = element("mark");
    			mark24.textContent = "setIndex";
    			t113 = text(" let:");
    			mark25 = element("mark");
    			mark25.textContent = "currentIndex";
    			t115 = text("> ");
    			br18 = element("br");
    			t116 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br19 = element("br");
    			t117 = text("\r\n\t\t\t\t    <img src={item} alt=\"\" /> ");
    			br20 = element("br");
    			t118 = text("\r\n\t\t\t\t  {/each} ");
    			br21 = element("br");
    			t119 = space();
    			br22 = element("br");
    			t120 = text("\r\n\t\t\t\t  <div slot=\"controls\">");
    			br23 = element("br");
    			t121 = text("\r\n\t\t\t\t    {#each items as _, i}");
    			br24 = element("br");
    			t122 = text("\r\n\t\t\t\t      <button");
    			br25 = element("br");
    			t123 = text("\r\n\t\t\t\t        class:active={i == ");
    			mark26 = element("mark");
    			mark26.textContent = "currentIndex";
    			t125 = text("}");
    			br26 = element("br");
    			t126 = text("\r\n\t\t\t\t        on:click={() => ");
    			mark27 = element("mark");
    			mark27.textContent = "setIndex";
    			t128 = text("(i)} />");
    			br27 = element("br");
    			t129 = text("\r\n\t\t\t\t    {/each}");
    			br28 = element("br");
    			t130 = text("\r\n\t\t\t\t  </div>");
    			br29 = element("br");
    			t131 = text("\r\n\t\t\t\t</");
    			mark28 = element("mark");
    			mark28.textContent = "TinySlider";
    			t133 = text(">");
    			t134 = space();
    			div3 = element("div");
    			create_component(tinyslider3.$$.fragment);
    			t135 = space();
    			p12 = element("p");
    			p12.textContent = "In a similar way we can also add thumbnail navigation.";
    			t137 = space();
    			p13 = element("p");
    			code9 = element("code");
    			t138 = text("<");
    			mark29 = element("mark");
    			mark29.textContent = "TinySlider";
    			t140 = text(" let:");
    			mark30 = element("mark");
    			mark30.textContent = "setIndex";
    			t142 = text(" let:");
    			mark31 = element("mark");
    			mark31.textContent = "currentIndex";
    			t144 = text("> ");
    			br30 = element("br");
    			t145 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br31 = element("br");
    			t146 = text("\r\n\t\t\t\t    <img src={item} alt=\"\" /> ");
    			br32 = element("br");
    			t147 = text("\r\n\t\t\t\t  {/each} ");
    			br33 = element("br");
    			t148 = space();
    			br34 = element("br");
    			t149 = text("\r\n\t\t\t\t  <div slot=\"controls\">");
    			br35 = element("br");
    			t150 = text("\r\n\t\t\t\t    {#each items as _, i}");
    			br36 = element("br");
    			t151 = text("\r\n\t\t\t\t      <button");
    			br37 = element("br");
    			t152 = text("\r\n\t\t\t\t        class:active={i == ");
    			mark32 = element("mark");
    			mark32.textContent = "currentIndex";
    			t154 = text("}");
    			br38 = element("br");
    			t155 = text("\r\n\t\t\t\t        on:click={() => ");
    			mark33 = element("mark");
    			mark33.textContent = "setIndex";
    			t157 = text("(i)}");
    			br39 = element("br");
    			t158 = text("\r\n\t\t\t\t        on:focus={() => ");
    			mark34 = element("mark");
    			mark34.textContent = "setIndex";
    			t160 = text("(i)}>");
    			br40 = element("br");
    			t161 = text("\r\n\t\t\t\t        <img src={item} alt=\"\" height=60 />");
    			br41 = element("br");
    			t162 = text("\r\n\t\t\t\t      </button>");
    			br42 = element("br");
    			t163 = text("\r\n\t\t\t\t    {/each}");
    			br43 = element("br");
    			t164 = text("\r\n\t\t\t\t  </div>");
    			br44 = element("br");
    			t165 = text("\r\n\t\t\t\t</");
    			mark35 = element("mark");
    			mark35.textContent = "TinySlider";
    			t167 = text(">");
    			t168 = space();
    			div4 = element("div");
    			create_component(tinyslider4.$$.fragment);
    			t169 = space();
    			h41 = element("h4");
    			h41.textContent = "Controls via exported props";
    			t171 = space();
    			p14 = element("p");
    			t172 = text("You don't have to control the component from a slot, you can control it from anywhere using two way binds. Declare any variable you want and bind them using ");
    			code10 = element("code");
    			code10.textContent = "bind";
    			t174 = text(" instead of ");
    			code11 = element("code");
    			code11.textContent = "let";
    			t176 = text(". The variable ");
    			code12 = element("code");
    			code12.textContent = "currentIndex";
    			t178 = text(" can not be directly modified, it should only be used as a reference.");
    			t179 = space();
    			p15 = element("p");
    			code13 = element("code");
    			t180 = text("<script>");
    			br45 = element("br");
    			t181 = text("\r\n\t\t\t\t  let ");
    			mark36 = element("mark");
    			mark36.textContent = "setIndex";
    			br46 = element("br");
    			t183 = text("\r\n\t\t\t\t</script>");
    			br47 = element("br");
    			t184 = space();
    			br48 = element("br");
    			t185 = text("\r\n\t\t\t\t<");
    			mark37 = element("mark");
    			mark37.textContent = "TinySlider";
    			t187 = space();
    			mark38 = element("mark");
    			mark38.textContent = "bind";
    			t189 = text(":");
    			mark39 = element("mark");
    			mark39.textContent = "setIndex";
    			t191 = text("> ");
    			br49 = element("br");
    			t192 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br50 = element("br");
    			t193 = text("\r\n\t\t\t\t    <img src={item} alt=\"\" /> ");
    			br51 = element("br");
    			t194 = text("\r\n\t\t\t\t  {/each} ");
    			br52 = element("br");
    			t195 = text("\r\n\t\t\t\t</");
    			mark40 = element("mark");
    			mark40.textContent = "TinySlider";
    			t197 = text(">");
    			br53 = element("br");
    			t198 = space();
    			br54 = element("br");
    			t199 = text("\r\n\t\t\t\t<button on:click={() => ");
    			mark41 = element("mark");
    			mark41.textContent = "setIndex";
    			t201 = text("(2)}>...</button>");
    			br55 = element("br");
    			t202 = text("\r\n\t\t\t\t<button on:click={() => ");
    			mark42 = element("mark");
    			mark42.textContent = "setIndex";
    			t204 = text("(5)}>...</button>");
    			br56 = element("br");
    			t205 = text("\r\n\t\t\t\t<button on:click={() => ");
    			mark43 = element("mark");
    			mark43.textContent = "setIndex";
    			t207 = text("(9)}>...</button>");
    			br57 = element("br");
    			t208 = space();
    			create_component(tinyslider5.$$.fragment);
    			t209 = space();
    			p16 = element("p");
    			t210 = text("These buttons are not in a ");
    			code14 = element("code");
    			code14.textContent = "slot";
    			t212 = text(" and could be placed anywhere on your page.");
    			t213 = space();
    			button0 = element("button");
    			button0.textContent = "Set index to 2";
    			t215 = space();
    			button1 = element("button");
    			button1.textContent = "Set index to 5";
    			t217 = space();
    			button2 = element("button");
    			button2.textContent = "Set index to 9";
    			t219 = space();
    			div6 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Styling";
    			t221 = space();
    			p17 = element("p");
    			p17.textContent = "There is very little css set by default, you're expected to bring your own. But to help you out there's a handful of props that might be of use. You don't need to use any of these, you could do it all with regular css, which we will also go over.";
    			t223 = space();
    			h42 = element("h4");
    			h42.textContent = "Size";
    			t225 = space();
    			p18 = element("p");
    			t226 = text("So far we've only been using one slide at a time. The number of sliders shown is not controlled by a prop, instead you can do it via css. To help you out there's the slot prop ");
    			code15 = element("code");
    			code15.textContent = "sliderWidth";
    			t228 = text(". This is simply the document width of the slider element. Setting the width of your items to ");
    			code16 = element("code");
    			code16.textContent = "sliderWidth / 3";
    			t230 = text(" would cause 3 items to show at once. Once again this could be done with a slot prop or a two way bind, which ever you prefer.");
    			t231 = space();
    			p19 = element("p");
    			code17 = element("code");
    			t232 = text("<");
    			mark44 = element("mark");
    			mark44.textContent = "TinySlider";
    			t234 = text(" let:");
    			mark45 = element("mark");
    			mark45.textContent = "sliderWidth";
    			t236 = text(">");
    			br58 = element("br");
    			t237 = text("\r\n\t\t\t\t  {#each items as item}");
    			br59 = element("br");
    			t238 = text("\r\n\t\t\t\t    <img src={item} width={");
    			mark46 = element("mark");
    			mark46.textContent = "sliderWidth";
    			t240 = text(" / 3} />");
    			br60 = element("br");
    			t241 = text("\r\n\t\t\t\t  {/each}");
    			br61 = element("br");
    			t242 = text("\r\n\t\t\t\t</");
    			mark47 = element("mark");
    			mark47.textContent = "TinySlider";
    			t244 = text(">");
    			t245 = space();
    			create_component(tinyslider6.$$.fragment);
    			t246 = space();
    			h43 = element("h4");
    			h43.textContent = "Gap";
    			t248 = space();
    			p20 = element("p");
    			t249 = text("The gap prop allows you to set a gap between items. All this does is set the css property ");
    			code18 = element("code");
    			code18.textContent = "gap";
    			t251 = text(", so alternatively you could do something like:");
    			t252 = space();
    			code19 = element("code");
    			t253 = text(":global(.slider-content) { ");
    			br62 = element("br");
    			t254 = text("\r\n\t\t\t\t  gap: 10px; ");
    			br63 = element("br");
    			t255 = text("\r\n\t\t\t\t}");
    			t256 = space();
    			p21 = element("p");
    			t257 = text("But using the ");
    			code20 = element("code");
    			code20.textContent = "gap";
    			t259 = text(" prop might be more convenient. Accepts any css value.");
    			t260 = space();
    			p22 = element("p");
    			code21 = element("code");
    			t261 = text("<");
    			mark48 = element("mark");
    			mark48.textContent = "TinySlider";
    			t263 = space();
    			mark49 = element("mark");
    			mark49.textContent = "gap";
    			t265 = text("=\"10px\"> ");
    			br64 = element("br");
    			t266 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br65 = element("br");
    			t267 = text("\r\n\t\t\t\t      ... ");
    			br66 = element("br");
    			t268 = text("\r\n\t\t\t\t  {/each} ");
    			br67 = element("br");
    			t269 = text("\r\n\t\t\t\t</");
    			mark50 = element("mark");
    			mark50.textContent = "TinySlider";
    			t271 = text(">");
    			t272 = space();
    			create_component(tinyslider7.$$.fragment);
    			t273 = space();
    			div7 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Content";
    			t275 = space();
    			p23 = element("p");
    			p23.textContent = "We've been using images as examples so far, but the content can be anything. Any direct child of the slider will be considered a slide. Links and click events will not fire while dragging to prevent accidental clicks.";
    			t277 = space();
    			p24 = element("p");
    			code22 = element("code");
    			t278 = text("<");
    			mark51 = element("mark");
    			mark51.textContent = "TinySlider";
    			t280 = text(" gap=\"0.5rem\">");
    			br68 = element("br");
    			t281 = text("\r\n\t\t\t\t  {#each { length: 20 } as _}");
    			br69 = element("br");
    			t282 = text("\r\n\t\t\t\t    <div class=\"item\">");
    			br70 = element("br");
    			t283 = text("\r\n\t\t\t\t      <a href=\"https://svelte.dev\" target=\"_blank\">Link</a>");
    			br71 = element("br");
    			t284 = text("\r\n\t\t\t\t    </div>");
    			br72 = element("br");
    			t285 = text("\r\n\t\t\t\t  {/each}");
    			br73 = element("br");
    			t286 = text("\r\n\t\t\t\t</");
    			mark52 = element("mark");
    			mark52.textContent = "TinySlider";
    			t288 = text(">");
    			t289 = space();
    			create_component(tinyslider8.$$.fragment);
    			t290 = space();
    			div11 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Lazy Loading";
    			t292 = space();
    			p25 = element("p");
    			t293 = text("When using images you might want to lazy load any images that are not visible. This can be done using native ");
    			code23 = element("code");
    			code23.textContent = "loading=\"lazy\"";
    			t295 = text(", but this comes with some drawbacks. To overcome these drawback there are several properties you can use.");
    			t296 = space();
    			p26 = element("p");
    			t297 = text("For a simple slider you might use ");
    			code24 = element("code");
    			code24.textContent = "currentIndex";
    			t299 = text(" to hide any images that are above the current index.\r\n\r\n\t\t");
    			p27 = element("p");
    			code25 = element("code");
    			t300 = text("<");
    			mark53 = element("mark");
    			mark53.textContent = "TinySlider";
    			t302 = text(" let:");
    			mark54 = element("mark");
    			mark54.textContent = "currentIndex";
    			t304 = text(">");
    			br74 = element("br");
    			t305 = text("\r\n\t\t\t\t  {#each items as item, i}");
    			br75 = element("br");
    			t306 = text("\r\n\t\t\t\t    <div>");
    			br76 = element("br");
    			t307 = text("\r\n\t\t\t\t      {#if ");
    			mark55 = element("mark");
    			mark55.textContent = "currentIndex + 1 >= i";
    			t309 = text("}");
    			br77 = element("br");
    			t310 = text("\r\n\t\t\t\t        <img src={item} alt=\"\" />");
    			br78 = element("br");
    			t311 = text("\r\n\t\t\t\t      {/if}");
    			br79 = element("br");
    			t312 = text("\r\n\t\t\t\t    </div>");
    			br80 = element("br");
    			t313 = text("\r\n\t\t\t\t  {/each}");
    			br81 = element("br");
    			t314 = space();
    			br82 = element("br");
    			t315 = text("\r\n\t\t\t\t  ...");
    			br83 = element("br");
    			t316 = text("\r\n\t\t\t\t</");
    			mark56 = element("mark");
    			mark56.textContent = "TinySlider";
    			t318 = text(">");
    			br84 = element("br");
    			t319 = space();
    			p28 = element("p");
    			p28.textContent = "Note how this is using currentIndex + 1 to preload one image ahead.";
    			t321 = space();
    			div8 = element("div");
    			create_component(tinyslider9.$$.fragment);
    			t322 = space();
    			p29 = element("p");
    			t323 = text("For sliders with multiple slides shown at once it might get more complicated when using ");
    			mark57 = element("mark");
    			mark57.textContent = "currentIndex";
    			t325 = text(", especially when you might have different amounts of slides depending on the screen size. For that purpose you could use the ");
    			mark58 = element("mark");
    			mark58.textContent = "shown";
    			t327 = text(" property. This property returns an array of all indexes that have been onscreen at some point. Just like before this can be used either as ");
    			mark59 = element("mark");
    			mark59.textContent = "let:shown";
    			t329 = text(" or ");
    			mark60 = element("mark");
    			mark60.textContent = "bind:shown";
    			t331 = text(".");
    			t332 = space();
    			p30 = element("p");
    			code26 = element("code");
    			t333 = text("<");
    			mark61 = element("mark");
    			mark61.textContent = "TinySlider";
    			t335 = text(" let:");
    			mark62 = element("mark");
    			mark62.textContent = "shown";
    			t337 = text(">");
    			br85 = element("br");
    			t338 = text("\r\n\t\t\t\t  {#each items as item, index}");
    			br86 = element("br");
    			t339 = text("\r\n\t\t\t\t    <div>");
    			br87 = element("br");
    			t340 = text("\r\n\t\t\t\t      {#if ");
    			mark63 = element("mark");
    			mark63.textContent = "shown";
    			t342 = text(".includes(index)}");
    			br88 = element("br");
    			t343 = text("\r\n\t\t\t\t        <img src={item} alt=\"\" />");
    			br89 = element("br");
    			t344 = text("\r\n\t\t\t\t      {/if}");
    			br90 = element("br");
    			t345 = text("\r\n\t\t\t\t    </div>");
    			br91 = element("br");
    			t346 = text("\r\n\t\t\t\t  {/each}");
    			br92 = element("br");
    			t347 = space();
    			br93 = element("br");
    			t348 = text("\r\n\t\t\t\t  ...");
    			br94 = element("br");
    			t349 = text("\r\n\t\t\t\t</");
    			mark64 = element("mark");
    			mark64.textContent = "TinySlider";
    			t351 = text(">");
    			t352 = space();
    			div10 = element("div");
    			div9 = element("div");
    			create_component(tinyslider10.$$.fragment);
    			t353 = space();
    			div14 = element("div");
    			h34 = element("h3");
    			h34.textContent = "Infinite Loading";
    			t355 = space();
    			p31 = element("p");
    			p31.textContent = "There are several properties you could use to implement infinite loading, meaning we load more items in when the user has scroll (almost) to the end of the slider.";
    			t357 = space();
    			h44 = element("h4");
    			h44.textContent = "Event";
    			t359 = space();
    			p32 = element("p");
    			t360 = text("You could use the event ");
    			mark65 = element("mark");
    			mark65.textContent = "on:end";
    			t362 = text(", which fires when the user has reached the end of the slider based on pixels and not on currentIndex.");
    			t363 = space();
    			p33 = element("p");
    			code27 = element("code");
    			t364 = text("<");
    			mark66 = element("mark");
    			mark66.textContent = "TinySlider";
    			t366 = space();
    			mark67 = element("mark");
    			mark67.textContent = "on:end";
    			t368 = text("={() => console.log('Reached end')}>");
    			br95 = element("br");
    			t369 = text("\r\n\t\t\t\t  ...");
    			br96 = element("br");
    			t370 = text("\r\n\t\t\t\t</");
    			mark68 = element("mark");
    			mark68.textContent = "TinySlider";
    			t372 = text(">");
    			t373 = space();
    			h45 = element("h4");
    			h45.textContent = "Properties";
    			t375 = space();
    			p34 = element("p");
    			t376 = text("Similarity to the event you could use the property ");
    			mark69 = element("mark");
    			mark69.textContent = "reachedEnd";
    			t378 = text(". This turns to true at the same time ");
    			mark70 = element("mark");
    			mark70.textContent = "on:end";
    			t380 = text(" is fired. Once again this can be set using either ");
    			mark71 = element("mark");
    			mark71.textContent = "let:reachedEnd";
    			t382 = text(" or ");
    			mark72 = element("mark");
    			mark72.textContent = "bind:reachedEnd";
    			t384 = text(".");
    			t385 = space();
    			p35 = element("p");
    			code28 = element("code");
    			t386 = text("<script>");
    			br97 = element("br");
    			t387 = text("\r\n\t\t\t\t  let ");
    			mark73 = element("mark");
    			mark73.textContent = "reachedEnd";
    			t389 = text(" = false");
    			br98 = element("br");
    			t390 = text("\r\n\t\t\t\t  $: if (");
    			mark74 = element("mark");
    			mark74.textContent = "reachedEnd";
    			t392 = text(") console.log('Reached end')");
    			br99 = element("br");
    			t393 = text("\r\n\t\t\t\t</script>");
    			br100 = element("br");
    			t394 = space();
    			br101 = element("br");
    			t395 = text("\r\n\t\t\t\t<");
    			mark75 = element("mark");
    			mark75.textContent = "TinySlider";
    			t397 = space();
    			mark76 = element("mark");
    			mark76.textContent = "bind:reachedEnd";
    			t399 = text(">");
    			br102 = element("br");
    			t400 = text("\r\n\t\t\t\t  ...");
    			br103 = element("br");
    			t401 = text("\r\n\t\t\t\t</");
    			mark77 = element("mark");
    			mark77.textContent = "TinySlider";
    			t403 = text(">");
    			t404 = space();
    			p36 = element("p");
    			t405 = text("You might want to load more items before the user actually reaches the end to make it actually feel infinite. This could be achieved with the ");
    			mark78 = element("mark");
    			mark78.textContent = "distanceToEnd";
    			t407 = text(" property. Once again this can be set using either ");
    			mark79 = element("mark");
    			mark79.textContent = "let:distanceToEnd";
    			t409 = text(" or ");
    			mark80 = element("mark");
    			mark80.textContent = "bind:distanceToEnd";
    			t411 = text(".");
    			t412 = space();
    			p37 = element("p");
    			code29 = element("code");
    			t413 = text("<script>");
    			br104 = element("br");
    			t414 = text("\r\n\t\t\t\t  let ");
    			mark81 = element("mark");
    			mark81.textContent = "distanceToEnd";
    			br105 = element("br");
    			t416 = text("\r\n\t\t\t\t  $: if (");
    			mark82 = element("mark");
    			mark82.textContent = "distanceToEnd && distanceToEnd < 500";
    			t418 = text(") console.log('Load more')");
    			br106 = element("br");
    			t419 = text("\r\n\t\t\t\t</script>");
    			br107 = element("br");
    			t420 = space();
    			br108 = element("br");
    			t421 = text("\r\n\t\t\t\t<");
    			mark83 = element("mark");
    			mark83.textContent = "TinySlider";
    			t423 = space();
    			mark84 = element("mark");
    			mark84.textContent = "bind:distanceToEnd";
    			t425 = text(">");
    			br109 = element("br");
    			t426 = text("\r\n\t\t\t\t  ...");
    			br110 = element("br");
    			t427 = text("\r\n\t\t\t\t</");
    			mark85 = element("mark");
    			mark85.textContent = "TinySlider";
    			t429 = text(">");
    			t430 = space();
    			div13 = element("div");
    			div12 = element("div");
    			create_component(tinyslider11.$$.fragment);
    			t431 = space();
    			div21 = element("div");
    			h35 = element("h3");
    			h35.textContent = "Other";
    			t433 = space();
    			h46 = element("h4");
    			h46.textContent = "Fill";
    			t435 = space();
    			p38 = element("p");
    			t436 = text("When showing multiple slides at once by default the slider will always fill out the full width when reaching the end. This behaviour can be disabled using ");
    			mark86 = element("mark");
    			mark86.textContent = "fill={false}";
    			t438 = text(".");
    			t439 = space();
    			p39 = element("p");
    			code30 = element("code");
    			t440 = text("<");
    			mark87 = element("mark");
    			mark87.textContent = "TinySlider";
    			t442 = space();
    			mark88 = element("mark");
    			mark88.textContent = "fill";
    			t444 = text("={false}>");
    			br111 = element("br");
    			t445 = text("\r\n\t\t\t\t  ...");
    			br112 = element("br");
    			t446 = text("\r\n\t\t\t\t</");
    			mark89 = element("mark");
    			mark89.textContent = "TinySlider";
    			t448 = text(">");
    			t449 = space();
    			div16 = element("div");
    			div15 = element("div");
    			create_component(tinyslider12.$$.fragment);
    			t450 = space();
    			h47 = element("h4");
    			h47.textContent = "Transition Duration";
    			t452 = space();
    			p40 = element("p");
    			t453 = text("The slider will always snap to the left side of one of the slides. The speed at which this happens can be set using the ");
    			mark90 = element("mark");
    			mark90.textContent = "transitionDuration";
    			t455 = text(" property. This value is given in milliseconds. This defaults to 300.");
    			t456 = space();
    			p41 = element("p");
    			code31 = element("code");
    			t457 = text("<");
    			mark91 = element("mark");
    			mark91.textContent = "TinySlider";
    			t459 = space();
    			mark92 = element("mark");
    			mark92.textContent = "transitionDuration";
    			t461 = text("=\"1000\">");
    			br113 = element("br");
    			t462 = text("\r\n\t\t\t\t  ...");
    			br114 = element("br");
    			t463 = text("\r\n\t\t\t\t</");
    			mark93 = element("mark");
    			mark93.textContent = "TinySlider";
    			t465 = text(">");
    			t466 = space();
    			div18 = element("div");
    			div17 = element("div");
    			create_component(tinyslider13.$$.fragment);
    			t467 = space();
    			h48 = element("h4");
    			h48.textContent = "Threshold";
    			t469 = space();
    			p42 = element("p");
    			t470 = text("When dragging the slider it will not transition to the next slide until a certain threshold has been passed to prevent accidental sliding. This also determines when a link or click event is disabled. This can be set using the ");
    			mark94 = element("mark");
    			mark94.textContent = "treshold";
    			t472 = text(" property. This value is given in pixels. This defaults to 30.");
    			t473 = space();
    			p43 = element("p");
    			code32 = element("code");
    			t474 = text("<");
    			mark95 = element("mark");
    			mark95.textContent = "TinySlider";
    			t476 = space();
    			mark96 = element("mark");
    			mark96.textContent = "threshold";
    			t478 = text("=\"100\">");
    			br115 = element("br");
    			t479 = text("\r\n\t\t\t\t  ...");
    			br116 = element("br");
    			t480 = text("\r\n\t\t\t\t</");
    			mark97 = element("mark");
    			mark97.textContent = "TinySlider";
    			t482 = text(">");
    			t483 = space();
    			div20 = element("div");
    			div19 = element("div");
    			create_component(tinyslider14.$$.fragment);
    			t484 = space();
    			div23 = element("div");
    			create_component(tinyslider15.$$.fragment);
    			t485 = space();
    			div31 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Properties";
    			t487 = space();
    			div25 = element("div");
    			p44 = element("p");
    			p44.textContent = "This is a list of all configurable properties.";
    			t489 = space();
    			div24 = element("div");
    			strong0 = element("strong");
    			strong0.textContent = "Property";
    			t491 = space();
    			strong1 = element("strong");
    			strong1.textContent = "Default";
    			t493 = space();
    			strong2 = element("strong");
    			strong2.textContent = "Description";
    			t495 = space();
    			code33 = element("code");
    			code33.textContent = "gap";
    			t497 = space();
    			code34 = element("code");
    			code34.textContent = "0";
    			t499 = space();
    			strong3 = element("strong");
    			strong3.textContent = "Gap between each item. Can be any CSS value.";
    			t501 = space();
    			code35 = element("code");
    			code35.textContent = "fill";
    			t503 = space();
    			code36 = element("code");
    			code36.textContent = "true";
    			t505 = space();
    			strong4 = element("strong");
    			strong4.textContent = "Boolean to set whether the slider is always filled fully when at the end.";
    			t507 = space();
    			code37 = element("code");
    			code37.textContent = "transitionDuration";
    			t509 = space();
    			code38 = element("code");
    			code38.textContent = "300";
    			t511 = space();
    			strong5 = element("strong");
    			strong5.textContent = "Transition between items in milliseconds.";
    			t513 = space();
    			code39 = element("code");
    			code39.textContent = "threshold";
    			t515 = space();
    			code40 = element("code");
    			code40.textContent = "30";
    			t517 = space();
    			strong6 = element("strong");
    			strong6.textContent = "Value in pixels for when you navigate when using drag controls.";
    			t519 = space();
    			code41 = element("code");
    			code41.textContent = "currentIndex";
    			t521 = space();
    			code42 = element("code");
    			code42.textContent = "0";
    			t523 = space();
    			strong7 = element("strong");
    			strong7.textContent = "Index of the current slide (Read only).";
    			t525 = space();
    			code43 = element("code");
    			code43.textContent = "shown";
    			t527 = space();
    			code44 = element("code");
    			code44.textContent = "[]";
    			t529 = space();
    			strong8 = element("strong");
    			strong8.textContent = "Array of all shown indexes (Read only).";
    			t531 = space();
    			code45 = element("code");
    			code45.textContent = "sliderWidth";
    			t533 = space();
    			code46 = element("code");
    			code46.textContent = "0";
    			t535 = space();
    			strong9 = element("strong");
    			strong9.textContent = "Box width in pixels of the slider as it is on the page (Read only).";
    			t537 = space();
    			code47 = element("code");
    			code47.textContent = "maxWidth";
    			t539 = space();
    			code48 = element("code");
    			code48.textContent = "0";
    			t541 = space();
    			strong10 = element("strong");
    			strong10.textContent = "Full width in pixels of all items together (Read only).";
    			t543 = space();
    			code49 = element("code");
    			code49.textContent = "currentScrollPosition";
    			t545 = space();
    			code50 = element("code");
    			code50.textContent = "0";
    			t547 = space();
    			strong11 = element("strong");
    			strong11.textContent = "Current position in the slider in pixels (Read only).";
    			t549 = space();
    			code51 = element("code");
    			code51.textContent = "reachedEnd";
    			t551 = space();
    			code52 = element("code");
    			code52.textContent = "false";
    			t553 = space();
    			strong12 = element("strong");
    			strong12.textContent = "Boolean that is set to true when you have reached the end of the slider (Read only).";
    			t555 = space();
    			code53 = element("code");
    			code53.textContent = "distanceToEnd";
    			t557 = space();
    			code54 = element("code");
    			code54.textContent = "0";
    			t559 = space();
    			strong13 = element("strong");
    			strong13.textContent = "Distance in pixels until you reach the end of the slider (Read only).";
    			t561 = space();
    			h23 = element("h2");
    			h23.textContent = "Functions";
    			t563 = space();
    			div27 = element("div");
    			p45 = element("p");
    			p45.textContent = "This is a list of exported functions.";
    			t565 = space();
    			div26 = element("div");
    			strong14 = element("strong");
    			strong14.textContent = "Name";
    			t567 = space();
    			strong15 = element("strong");
    			strong15.textContent = "Properties";
    			t569 = space();
    			strong16 = element("strong");
    			strong16.textContent = "Description";
    			t571 = space();
    			code55 = element("code");
    			code55.textContent = "setIndex";
    			t573 = space();
    			code56 = element("code");
    			code56.textContent = "index";
    			t575 = space();
    			strong17 = element("strong");
    			strong17.textContent = "Used to set the slider to the specified index.";
    			t577 = space();
    			h24 = element("h2");
    			h24.textContent = "Events";
    			t579 = space();
    			div29 = element("div");
    			p46 = element("p");
    			p46.textContent = "This is a list of events.";
    			t581 = space();
    			div28 = element("div");
    			strong18 = element("strong");
    			strong18.textContent = "Name";
    			t583 = space();
    			strong19 = element("strong");
    			t584 = space();
    			strong20 = element("strong");
    			strong20.textContent = "Description";
    			t586 = space();
    			code57 = element("code");
    			code57.textContent = "end";
    			t588 = space();
    			code58 = element("code");
    			t589 = space();
    			strong21 = element("strong");
    			strong21.textContent = "Fired when the end of the slider has been reached.";
    			t591 = space();
    			div30 = element("div");
    			t592 = text("Made by ");
    			a1 = element("a");
    			a1.textContent = "Mitchel Jager";
    			attr_dev(mark0, "class", "svelte-lfm80c");
    			add_location(mark0, file, 39, 5, 1244);
    			attr_dev(h1, "class", "svelte-lfm80c");
    			add_location(h1, file, 39, 1, 1240);
    			attr_dev(header, "class", "svelte-lfm80c");
    			add_location(header, file, 38, 0, 1229);
    			attr_dev(p0, "class", "svelte-lfm80c");
    			add_location(p0, file, 50, 2, 1497);
    			attr_dev(a0, "href", "https://github.com/Mitcheljager/svelte-tiny-slider");
    			attr_dev(a0, "class", "svelte-lfm80c");
    			add_location(a0, file, 52, 5, 1806);
    			attr_dev(p1, "class", "svelte-lfm80c");
    			add_location(p1, file, 52, 2, 1803);
    			attr_dev(h20, "class", "svelte-lfm80c");
    			add_location(h20, file, 54, 2, 1887);
    			attr_dev(p2, "class", "svelte-lfm80c");
    			add_location(p2, file, 56, 2, 1914);
    			attr_dev(mark1, "class", "svelte-lfm80c");
    			add_location(mark1, file, 59, 12, 1986);
    			attr_dev(code0, "class", "well svelte-lfm80c");
    			add_location(code0, file, 58, 2, 1953);
    			attr_dev(mark2, "class", "svelte-lfm80c");
    			add_location(mark2, file, 63, 22, 2077);
    			attr_dev(code1, "class", "well svelte-lfm80c");
    			add_location(code1, file, 62, 2, 2034);
    			attr_dev(p3, "class", "svelte-lfm80c");
    			add_location(p3, file, 66, 2, 2125);
    			attr_dev(mark3, "class", "svelte-lfm80c");
    			add_location(mark3, file, 69, 17, 2207);
    			attr_dev(mark4, "class", "svelte-lfm80c");
    			add_location(mark4, file, 69, 54, 2244);
    			attr_dev(code2, "class", "well svelte-lfm80c");
    			add_location(code2, file, 68, 2, 2169);
    			attr_dev(mark5, "class", "svelte-lfm80c");
    			add_location(mark5, file, 73, 7, 2321);
    			attr_dev(mark6, "class", "svelte-lfm80c");
    			add_location(mark6, file, 75, 8, 2367);
    			attr_dev(code3, "class", "well svelte-lfm80c");
    			add_location(code3, file, 72, 2, 2293);
    			attr_dev(div0, "class", "block svelte-lfm80c");
    			add_location(div0, file, 49, 1, 1474);
    			attr_dev(h21, "class", "svelte-lfm80c");
    			add_location(h21, file, 79, 1, 2419);
    			attr_dev(p4, "class", "svelte-lfm80c");
    			add_location(p4, file, 82, 2, 2461);
    			attr_dev(mark7, "class", "svelte-lfm80c");
    			add_location(mark7, file, 86, 8, 2767);
    			attr_dev(br0, "class", "svelte-lfm80c");
    			add_location(br0, file, 86, 36, 2795);
    			attr_dev(br1, "class", "svelte-lfm80c");
    			add_location(br1, file, 87, 48, 2849);
    			attr_dev(br2, "class", "svelte-lfm80c");
    			add_location(br2, file, 88, 70, 2925);
    			attr_dev(br3, "class", "svelte-lfm80c");
    			add_location(br3, file, 89, 34, 2965);
    			attr_dev(mark8, "class", "svelte-lfm80c");
    			add_location(mark8, file, 90, 9, 2980);
    			attr_dev(code4, "class", "well svelte-lfm80c");
    			add_location(code4, file, 85, 3, 2738);
    			attr_dev(p5, "class", "svelte-lfm80c");
    			add_location(p5, file, 84, 2, 2730);
    			attr_dev(div1, "class", "block svelte-lfm80c");
    			add_location(div1, file, 81, 1, 2438);
    			attr_dev(h30, "class", "svelte-lfm80c");
    			add_location(h30, file, 102, 2, 3173);
    			attr_dev(p6, "class", "svelte-lfm80c");
    			add_location(p6, file, 104, 2, 3196);
    			attr_dev(h40, "class", "svelte-lfm80c");
    			add_location(h40, file, 107, 2, 3399);
    			attr_dev(mark9, "class", "svelte-lfm80c");
    			add_location(mark9, file, 109, 58, 3493);
    			attr_dev(code5, "class", "inline svelte-lfm80c");
    			add_location(code5, file, 109, 31, 3466);
    			attr_dev(p7, "class", "svelte-lfm80c");
    			add_location(p7, file, 109, 2, 3437);
    			attr_dev(mark10, "class", "svelte-lfm80c");
    			add_location(mark10, file, 112, 7, 3645);
    			attr_dev(li0, "class", "svelte-lfm80c");
    			add_location(li0, file, 112, 3, 3641);
    			attr_dev(mark11, "class", "svelte-lfm80c");
    			add_location(mark11, file, 113, 7, 3754);
    			attr_dev(li1, "class", "svelte-lfm80c");
    			add_location(li1, file, 113, 3, 3750);
    			attr_dev(ul, "class", "svelte-lfm80c");
    			add_location(ul, file, 111, 2, 3632);
    			attr_dev(code6, "class", "inline svelte-lfm80c");
    			add_location(code6, file, 117, 32, 3888);
    			attr_dev(p8, "class", "svelte-lfm80c");
    			add_location(p8, file, 116, 2, 3851);
    			attr_dev(mark12, "class", "svelte-lfm80c");
    			add_location(mark12, file, 122, 8, 4074);
    			attr_dev(mark13, "class", "svelte-lfm80c");
    			add_location(mark13, file, 122, 36, 4102);
    			attr_dev(mark14, "class", "svelte-lfm80c");
    			add_location(mark14, file, 122, 62, 4128);
    			attr_dev(br4, "class", "svelte-lfm80c");
    			add_location(br4, file, 122, 92, 4158);
    			attr_dev(br5, "class", "svelte-lfm80c");
    			add_location(br5, file, 123, 48, 4212);
    			attr_dev(br6, "class", "svelte-lfm80c");
    			add_location(br6, file, 124, 70, 4288);
    			attr_dev(br7, "class", "svelte-lfm80c");
    			add_location(br7, file, 125, 34, 4328);
    			attr_dev(br8, "class", "svelte-lfm80c");
    			add_location(br8, file, 126, 4, 4338);
    			attr_dev(mark15, "class", "svelte-lfm80c");
    			add_location(mark15, file, 127, 42, 4386);
    			attr_dev(br9, "class", "svelte-lfm80c");
    			add_location(br9, file, 127, 69, 4413);
    			attr_dev(mark16, "class", "svelte-lfm80c");
    			add_location(mark16, file, 128, 38, 4457);
    			attr_dev(br10, "class", "svelte-lfm80c");
    			add_location(br10, file, 128, 77, 4496);
    			attr_dev(mark17, "class", "svelte-lfm80c");
    			add_location(mark17, file, 129, 75, 4577);
    			attr_dev(mark18, "class", "svelte-lfm80c");
    			add_location(mark18, file, 129, 97, 4599);
    			attr_dev(br11, "class", "svelte-lfm80c");
    			add_location(br11, file, 129, 156, 4658);
    			attr_dev(br12, "class", "svelte-lfm80c");
    			add_location(br12, file, 130, 44, 4708);
    			attr_dev(br13, "class", "svelte-lfm80c");
    			add_location(br13, file, 131, 4, 4718);
    			attr_dev(mark19, "class", "svelte-lfm80c");
    			add_location(mark19, file, 132, 38, 4762);
    			attr_dev(br14, "class", "svelte-lfm80c");
    			add_location(br14, file, 132, 92, 4816);
    			attr_dev(mark20, "class", "svelte-lfm80c");
    			add_location(mark20, file, 133, 75, 4897);
    			attr_dev(mark21, "class", "svelte-lfm80c");
    			add_location(mark21, file, 133, 97, 4919);
    			attr_dev(br15, "class", "svelte-lfm80c");
    			add_location(br15, file, 133, 156, 4978);
    			attr_dev(br16, "class", "svelte-lfm80c");
    			add_location(br16, file, 134, 44, 5028);
    			attr_dev(br17, "class", "svelte-lfm80c");
    			add_location(br17, file, 135, 41, 5075);
    			attr_dev(mark22, "class", "svelte-lfm80c");
    			add_location(mark22, file, 136, 9, 5090);
    			attr_dev(code7, "class", "well svelte-lfm80c");
    			add_location(code7, file, 121, 3, 4045);
    			attr_dev(p9, "class", "svelte-lfm80c");
    			add_location(p9, file, 120, 2, 4037);
    			attr_dev(div2, "class", "relative svelte-lfm80c");
    			add_location(div2, file, 140, 2, 5143);
    			attr_dev(p10, "class", "svelte-lfm80c");
    			add_location(p10, file, 158, 2, 5701);
    			attr_dev(mark23, "class", "svelte-lfm80c");
    			add_location(mark23, file, 162, 8, 5821);
    			attr_dev(mark24, "class", "svelte-lfm80c");
    			add_location(mark24, file, 162, 36, 5849);
    			attr_dev(mark25, "class", "svelte-lfm80c");
    			add_location(mark25, file, 162, 62, 5875);
    			attr_dev(br18, "class", "svelte-lfm80c");
    			add_location(br18, file, 162, 92, 5905);
    			attr_dev(br19, "class", "svelte-lfm80c");
    			add_location(br19, file, 163, 48, 5959);
    			attr_dev(br20, "class", "svelte-lfm80c");
    			add_location(br20, file, 164, 70, 6035);
    			attr_dev(br21, "class", "svelte-lfm80c");
    			add_location(br21, file, 165, 34, 6075);
    			attr_dev(br22, "class", "svelte-lfm80c");
    			add_location(br22, file, 166, 4, 6085);
    			attr_dev(br23, "class", "svelte-lfm80c");
    			add_location(br23, file, 167, 43, 6134);
    			attr_dev(br24, "class", "svelte-lfm80c");
    			add_location(br24, file, 168, 59, 6199);
    			attr_dev(br25, "class", "svelte-lfm80c");
    			add_location(br25, file, 169, 50, 6255);
    			attr_dev(mark26, "class", "svelte-lfm80c");
    			add_location(mark26, file, 170, 76, 6337);
    			attr_dev(br26, "class", "svelte-lfm80c");
    			add_location(br26, file, 170, 107, 6368);
    			attr_dev(mark27, "class", "svelte-lfm80c");
    			add_location(mark27, file, 171, 76, 6450);
    			attr_dev(br27, "class", "svelte-lfm80c");
    			add_location(br27, file, 171, 112, 6486);
    			attr_dev(br28, "class", "svelte-lfm80c");
    			add_location(br28, file, 172, 45, 6537);
    			attr_dev(br29, "class", "svelte-lfm80c");
    			add_location(br29, file, 173, 28, 6571);
    			attr_dev(mark28, "class", "svelte-lfm80c");
    			add_location(mark28, file, 174, 9, 6586);
    			attr_dev(code8, "class", "well svelte-lfm80c");
    			add_location(code8, file, 161, 3, 5792);
    			attr_dev(p11, "class", "svelte-lfm80c");
    			add_location(p11, file, 160, 2, 5784);
    			attr_dev(div3, "class", "relative svelte-lfm80c");
    			add_location(div3, file, 178, 2, 6639);
    			attr_dev(p12, "class", "svelte-lfm80c");
    			add_location(p12, file, 195, 2, 7038);
    			attr_dev(mark29, "class", "svelte-lfm80c");
    			add_location(mark29, file, 199, 8, 7142);
    			attr_dev(mark30, "class", "svelte-lfm80c");
    			add_location(mark30, file, 199, 36, 7170);
    			attr_dev(mark31, "class", "svelte-lfm80c");
    			add_location(mark31, file, 199, 62, 7196);
    			attr_dev(br30, "class", "svelte-lfm80c");
    			add_location(br30, file, 199, 92, 7226);
    			attr_dev(br31, "class", "svelte-lfm80c");
    			add_location(br31, file, 200, 48, 7280);
    			attr_dev(br32, "class", "svelte-lfm80c");
    			add_location(br32, file, 201, 70, 7356);
    			attr_dev(br33, "class", "svelte-lfm80c");
    			add_location(br33, file, 202, 34, 7396);
    			attr_dev(br34, "class", "svelte-lfm80c");
    			add_location(br34, file, 203, 4, 7406);
    			attr_dev(br35, "class", "svelte-lfm80c");
    			add_location(br35, file, 204, 43, 7455);
    			attr_dev(br36, "class", "svelte-lfm80c");
    			add_location(br36, file, 205, 59, 7520);
    			attr_dev(br37, "class", "svelte-lfm80c");
    			add_location(br37, file, 206, 50, 7576);
    			attr_dev(mark32, "class", "svelte-lfm80c");
    			add_location(mark32, file, 207, 76, 7658);
    			attr_dev(br38, "class", "svelte-lfm80c");
    			add_location(br38, file, 207, 107, 7689);
    			attr_dev(mark33, "class", "svelte-lfm80c");
    			add_location(mark33, file, 208, 76, 7771);
    			attr_dev(br39, "class", "svelte-lfm80c");
    			add_location(br39, file, 208, 106, 7801);
    			attr_dev(mark34, "class", "svelte-lfm80c");
    			add_location(mark34, file, 209, 76, 7883);
    			attr_dev(br40, "class", "svelte-lfm80c");
    			add_location(br40, file, 209, 110, 7917);
    			attr_dev(br41, "class", "svelte-lfm80c");
    			add_location(br41, file, 210, 103, 8026);
    			attr_dev(br42, "class", "svelte-lfm80c");
    			add_location(br42, file, 211, 55, 8087);
    			attr_dev(br43, "class", "svelte-lfm80c");
    			add_location(br43, file, 212, 45, 8138);
    			attr_dev(br44, "class", "svelte-lfm80c");
    			add_location(br44, file, 213, 28, 8172);
    			attr_dev(mark35, "class", "svelte-lfm80c");
    			add_location(mark35, file, 214, 9, 8187);
    			attr_dev(code9, "class", "well svelte-lfm80c");
    			add_location(code9, file, 198, 3, 7113);
    			attr_dev(p13, "class", "svelte-lfm80c");
    			add_location(p13, file, 197, 2, 7105);
    			attr_dev(div4, "class", "relative svelte-lfm80c");
    			add_location(div4, file, 218, 2, 8240);
    			attr_dev(h41, "class", "svelte-lfm80c");
    			add_location(h41, file, 238, 2, 8755);
    			attr_dev(code10, "class", "inline svelte-lfm80c");
    			add_location(code10, file, 240, 162, 8957);
    			attr_dev(code11, "class", "inline svelte-lfm80c");
    			add_location(code11, file, 240, 206, 9001);
    			attr_dev(code12, "class", "inline svelte-lfm80c");
    			add_location(code12, file, 240, 252, 9047);
    			attr_dev(p14, "class", "svelte-lfm80c");
    			add_location(p14, file, 240, 2, 8797);
    			attr_dev(br45, "class", "svelte-lfm80c");
    			add_location(br45, file, 244, 18, 9213);
    			attr_dev(mark36, "class", "svelte-lfm80c");
    			add_location(mark36, file, 245, 20, 9239);
    			attr_dev(br46, "class", "svelte-lfm80c");
    			add_location(br46, file, 245, 41, 9260);
    			attr_dev(br47, "class", "svelte-lfm80c");
    			add_location(br47, file, 246, 19, 9285);
    			attr_dev(br48, "class", "svelte-lfm80c");
    			add_location(br48, file, 247, 4, 9295);
    			attr_dev(mark37, "class", "svelte-lfm80c");
    			add_location(mark37, file, 248, 8, 9309);
    			attr_dev(mark38, "class", "svelte-lfm80c");
    			add_location(mark38, file, 248, 32, 9333);
    			attr_dev(mark39, "class", "svelte-lfm80c");
    			add_location(mark39, file, 248, 50, 9351);
    			attr_dev(br49, "class", "svelte-lfm80c");
    			add_location(br49, file, 248, 76, 9377);
    			attr_dev(br50, "class", "svelte-lfm80c");
    			add_location(br50, file, 249, 48, 9431);
    			attr_dev(br51, "class", "svelte-lfm80c");
    			add_location(br51, file, 250, 70, 9507);
    			attr_dev(br52, "class", "svelte-lfm80c");
    			add_location(br52, file, 251, 34, 9547);
    			attr_dev(mark40, "class", "svelte-lfm80c");
    			add_location(mark40, file, 252, 9, 9562);
    			attr_dev(br53, "class", "svelte-lfm80c");
    			add_location(br53, file, 252, 36, 9589);
    			attr_dev(br54, "class", "svelte-lfm80c");
    			add_location(br54, file, 253, 4, 9599);
    			attr_dev(mark41, "class", "svelte-lfm80c");
    			add_location(mark41, file, 254, 39, 9644);
    			attr_dev(br55, "class", "svelte-lfm80c");
    			add_location(br55, file, 254, 91, 9696);
    			attr_dev(mark42, "class", "svelte-lfm80c");
    			add_location(mark42, file, 255, 39, 9741);
    			attr_dev(br56, "class", "svelte-lfm80c");
    			add_location(br56, file, 255, 91, 9793);
    			attr_dev(mark43, "class", "svelte-lfm80c");
    			add_location(mark43, file, 256, 39, 9838);
    			attr_dev(br57, "class", "svelte-lfm80c");
    			add_location(br57, file, 256, 91, 9890);
    			attr_dev(code13, "class", "well svelte-lfm80c");
    			add_location(code13, file, 243, 3, 9174);
    			attr_dev(p15, "class", "svelte-lfm80c");
    			add_location(p15, file, 242, 2, 9166);
    			attr_dev(code14, "class", "inline svelte-lfm80c");
    			add_location(code14, file, 266, 32, 10092);
    			attr_dev(p16, "class", "svelte-lfm80c");
    			add_location(p16, file, 266, 2, 10062);
    			attr_dev(button0, "class", "button svelte-lfm80c");
    			add_location(button0, file, 268, 2, 10177);
    			attr_dev(button1, "class", "button svelte-lfm80c");
    			add_location(button1, file, 269, 2, 10256);
    			attr_dev(button2, "class", "button svelte-lfm80c");
    			add_location(button2, file, 270, 2, 10335);
    			attr_dev(div5, "class", "block svelte-lfm80c");
    			add_location(div5, file, 101, 1, 3150);
    			attr_dev(h31, "class", "svelte-lfm80c");
    			add_location(h31, file, 275, 2, 10449);
    			attr_dev(p17, "class", "svelte-lfm80c");
    			add_location(p17, file, 277, 2, 10471);
    			attr_dev(h42, "class", "svelte-lfm80c");
    			add_location(h42, file, 279, 2, 10730);
    			attr_dev(code15, "class", "inline svelte-lfm80c");
    			add_location(code15, file, 281, 181, 10928);
    			attr_dev(code16, "class", "inline svelte-lfm80c");
    			add_location(code16, file, 281, 314, 11061);
    			attr_dev(p18, "class", "svelte-lfm80c");
    			add_location(p18, file, 281, 2, 10749);
    			attr_dev(mark44, "class", "svelte-lfm80c");
    			add_location(mark44, file, 285, 8, 11277);
    			attr_dev(mark45, "class", "svelte-lfm80c");
    			add_location(mark45, file, 285, 36, 11305);
    			attr_dev(br58, "class", "svelte-lfm80c");
    			add_location(br58, file, 285, 64, 11333);
    			attr_dev(br59, "class", "svelte-lfm80c");
    			add_location(br59, file, 286, 47, 11386);
    			attr_dev(mark46, "class", "svelte-lfm80c");
    			add_location(mark46, file, 287, 69, 11461);
    			attr_dev(br60, "class", "svelte-lfm80c");
    			add_location(br60, file, 287, 109, 11501);
    			attr_dev(br61, "class", "svelte-lfm80c");
    			add_location(br61, file, 288, 33, 11540);
    			attr_dev(mark47, "class", "svelte-lfm80c");
    			add_location(mark47, file, 289, 9, 11555);
    			attr_dev(code17, "class", "well svelte-lfm80c");
    			add_location(code17, file, 284, 3, 11248);
    			attr_dev(p19, "class", "svelte-lfm80c");
    			add_location(p19, file, 283, 2, 11240);
    			attr_dev(h43, "class", "svelte-lfm80c");
    			add_location(h43, file, 300, 2, 11775);
    			attr_dev(code18, "class", "inline svelte-lfm80c");
    			add_location(code18, file, 303, 93, 11891);
    			attr_dev(p20, "class", "svelte-lfm80c");
    			add_location(p20, file, 302, 2, 11793);
    			attr_dev(br62, "class", "svelte-lfm80c");
    			add_location(br62, file, 306, 36, 12039);
    			attr_dev(br63, "class", "svelte-lfm80c");
    			add_location(br63, file, 307, 27, 12072);
    			attr_dev(code19, "class", "well svelte-lfm80c");
    			add_location(code19, file, 305, 3, 11982);
    			attr_dev(code20, "class", "inline svelte-lfm80c");
    			add_location(code20, file, 312, 17, 12128);
    			attr_dev(p21, "class", "svelte-lfm80c");
    			add_location(p21, file, 311, 2, 12106);
    			attr_dev(mark48, "class", "svelte-lfm80c");
    			add_location(mark48, file, 317, 8, 12264);
    			attr_dev(mark49, "class", "svelte-lfm80c");
    			add_location(mark49, file, 317, 32, 12288);
    			attr_dev(br64, "class", "svelte-lfm80c");
    			add_location(br64, file, 317, 60, 12316);
    			attr_dev(br65, "class", "svelte-lfm80c");
    			add_location(br65, file, 318, 48, 12370);
    			attr_dev(br66, "class", "svelte-lfm80c");
    			add_location(br66, file, 319, 44, 12420);
    			attr_dev(br67, "class", "svelte-lfm80c");
    			add_location(br67, file, 320, 34, 12460);
    			attr_dev(mark50, "class", "svelte-lfm80c");
    			add_location(mark50, file, 321, 9, 12475);
    			attr_dev(code21, "class", "well svelte-lfm80c");
    			add_location(code21, file, 316, 3, 12235);
    			attr_dev(p22, "class", "svelte-lfm80c");
    			add_location(p22, file, 315, 2, 12227);
    			attr_dev(div6, "class", "block svelte-lfm80c");
    			add_location(div6, file, 274, 1, 10426);
    			attr_dev(h32, "class", "svelte-lfm80c");
    			add_location(h32, file, 333, 2, 12742);
    			attr_dev(p23, "class", "svelte-lfm80c");
    			add_location(p23, file, 335, 2, 12764);
    			attr_dev(mark51, "class", "svelte-lfm80c");
    			add_location(mark51, file, 339, 8, 13031);
    			attr_dev(br68, "class", "svelte-lfm80c");
    			add_location(br68, file, 339, 48, 13071);
    			attr_dev(br69, "class", "svelte-lfm80c");
    			add_location(br69, file, 340, 63, 13140);
    			attr_dev(br70, "class", "svelte-lfm80c");
    			add_location(br70, file, 341, 52, 13198);
    			attr_dev(br71, "class", "svelte-lfm80c");
    			add_location(br71, file, 342, 105, 13309);
    			attr_dev(br72, "class", "svelte-lfm80c");
    			add_location(br72, file, 343, 40, 13355);
    			attr_dev(br73, "class", "svelte-lfm80c");
    			add_location(br73, file, 344, 33, 13394);
    			attr_dev(mark52, "class", "svelte-lfm80c");
    			add_location(mark52, file, 345, 9, 13409);
    			attr_dev(code22, "class", "well svelte-lfm80c");
    			add_location(code22, file, 338, 3, 13002);
    			attr_dev(p24, "class", "svelte-lfm80c");
    			add_location(p24, file, 337, 2, 12994);
    			attr_dev(div7, "class", "block svelte-lfm80c");
    			add_location(div7, file, 332, 1, 12719);
    			attr_dev(h33, "class", "svelte-lfm80c");
    			add_location(h33, file, 359, 2, 13726);
    			attr_dev(code23, "class", "inline svelte-lfm80c");
    			add_location(code23, file, 361, 114, 13865);
    			attr_dev(p25, "class", "svelte-lfm80c");
    			add_location(p25, file, 361, 2, 13753);
    			attr_dev(code24, "class", "inline svelte-lfm80c");
    			add_location(code24, file, 363, 39, 14060);
    			attr_dev(p26, "class", "svelte-lfm80c");
    			add_location(p26, file, 363, 2, 14023);
    			attr_dev(mark53, "class", "svelte-lfm80c");
    			add_location(mark53, file, 367, 8, 14196);
    			attr_dev(mark54, "class", "svelte-lfm80c");
    			add_location(mark54, file, 367, 36, 14224);
    			attr_dev(br74, "class", "svelte-lfm80c");
    			add_location(br74, file, 367, 65, 14253);
    			attr_dev(br75, "class", "svelte-lfm80c");
    			add_location(br75, file, 368, 50, 14309);
    			attr_dev(br76, "class", "svelte-lfm80c");
    			add_location(br76, file, 369, 39, 14354);
    			attr_dev(mark55, "class", "svelte-lfm80c");
    			add_location(mark55, file, 370, 50, 14410);
    			attr_dev(br77, "class", "svelte-lfm80c");
    			add_location(br77, file, 370, 93, 14453);
    			attr_dev(br78, "class", "svelte-lfm80c");
    			add_location(br78, file, 371, 93, 14552);
    			attr_dev(br79, "class", "svelte-lfm80c");
    			add_location(br79, file, 372, 55, 14613);
    			attr_dev(br80, "class", "svelte-lfm80c");
    			add_location(br80, file, 373, 40, 14659);
    			attr_dev(br81, "class", "svelte-lfm80c");
    			add_location(br81, file, 374, 33, 14698);
    			attr_dev(br82, "class", "svelte-lfm80c");
    			add_location(br82, file, 375, 4, 14708);
    			attr_dev(br83, "class", "svelte-lfm80c");
    			add_location(br83, file, 376, 19, 14733);
    			attr_dev(mark56, "class", "svelte-lfm80c");
    			add_location(mark56, file, 377, 9, 14748);
    			attr_dev(br84, "class", "svelte-lfm80c");
    			add_location(br84, file, 377, 36, 14775);
    			attr_dev(code25, "class", "well svelte-lfm80c");
    			add_location(code25, file, 366, 3, 14167);
    			attr_dev(p27, "class", "svelte-lfm80c");
    			add_location(p27, file, 365, 2, 14159);
    			attr_dev(p28, "class", "svelte-lfm80c");
    			add_location(p28, file, 381, 2, 14805);
    			attr_dev(div8, "class", "relative svelte-lfm80c");
    			add_location(div8, file, 385, 2, 14894);
    			attr_dev(mark57, "class", "svelte-lfm80c");
    			add_location(mark57, file, 408, 91, 15667);
    			attr_dev(mark58, "class", "svelte-lfm80c");
    			add_location(mark58, file, 408, 242, 15818);
    			attr_dev(mark59, "class", "svelte-lfm80c");
    			add_location(mark59, file, 408, 400, 15976);
    			attr_dev(mark60, "class", "svelte-lfm80c");
    			add_location(mark60, file, 408, 426, 16002);
    			attr_dev(p29, "class", "svelte-lfm80c");
    			add_location(p29, file, 407, 2, 15571);
    			attr_dev(mark61, "class", "svelte-lfm80c");
    			add_location(mark61, file, 413, 8, 16077);
    			attr_dev(mark62, "class", "svelte-lfm80c");
    			add_location(mark62, file, 413, 36, 16105);
    			attr_dev(br85, "class", "svelte-lfm80c");
    			add_location(br85, file, 413, 58, 16127);
    			attr_dev(br86, "class", "svelte-lfm80c");
    			add_location(br86, file, 414, 54, 16187);
    			attr_dev(br87, "class", "svelte-lfm80c");
    			add_location(br87, file, 415, 39, 16232);
    			attr_dev(mark63, "class", "svelte-lfm80c");
    			add_location(mark63, file, 416, 50, 16288);
    			attr_dev(br88, "class", "svelte-lfm80c");
    			add_location(br88, file, 416, 90, 16328);
    			attr_dev(br89, "class", "svelte-lfm80c");
    			add_location(br89, file, 417, 93, 16427);
    			attr_dev(br90, "class", "svelte-lfm80c");
    			add_location(br90, file, 418, 55, 16488);
    			attr_dev(br91, "class", "svelte-lfm80c");
    			add_location(br91, file, 419, 40, 16534);
    			attr_dev(br92, "class", "svelte-lfm80c");
    			add_location(br92, file, 420, 33, 16573);
    			attr_dev(br93, "class", "svelte-lfm80c");
    			add_location(br93, file, 421, 4, 16583);
    			attr_dev(br94, "class", "svelte-lfm80c");
    			add_location(br94, file, 422, 19, 16608);
    			attr_dev(mark64, "class", "svelte-lfm80c");
    			add_location(mark64, file, 423, 9, 16623);
    			attr_dev(code26, "class", "well svelte-lfm80c");
    			add_location(code26, file, 412, 3, 16048);
    			attr_dev(p30, "class", "svelte-lfm80c");
    			add_location(p30, file, 411, 2, 16040);
    			attr_dev(div9, "class", "slider-wrapper svelte-lfm80c");
    			add_location(div9, file, 428, 3, 16703);
    			attr_dev(div10, "class", "relative svelte-lfm80c");
    			add_location(div10, file, 427, 2, 16676);
    			attr_dev(div11, "class", "block svelte-lfm80c");
    			add_location(div11, file, 358, 1, 13703);
    			attr_dev(h34, "class", "svelte-lfm80c");
    			add_location(h34, file, 453, 2, 17484);
    			attr_dev(p31, "class", "svelte-lfm80c");
    			add_location(p31, file, 455, 2, 17515);
    			attr_dev(h44, "class", "svelte-lfm80c");
    			add_location(h44, file, 457, 2, 17691);
    			attr_dev(mark65, "class", "svelte-lfm80c");
    			add_location(mark65, file, 459, 29, 17738);
    			attr_dev(p32, "class", "svelte-lfm80c");
    			add_location(p32, file, 459, 2, 17711);
    			attr_dev(mark66, "class", "svelte-lfm80c");
    			add_location(mark66, file, 463, 8, 17906);
    			attr_dev(mark67, "class", "svelte-lfm80c");
    			add_location(mark67, file, 463, 32, 17930);
    			attr_dev(br95, "class", "svelte-lfm80c");
    			add_location(br95, file, 463, 103, 18001);
    			attr_dev(br96, "class", "svelte-lfm80c");
    			add_location(br96, file, 464, 19, 18026);
    			attr_dev(mark68, "class", "svelte-lfm80c");
    			add_location(mark68, file, 465, 9, 18041);
    			attr_dev(code27, "class", "well svelte-lfm80c");
    			add_location(code27, file, 462, 3, 17877);
    			attr_dev(p33, "class", "svelte-lfm80c");
    			add_location(p33, file, 461, 2, 17869);
    			attr_dev(h45, "class", "svelte-lfm80c");
    			add_location(h45, file, 469, 2, 18094);
    			attr_dev(mark69, "class", "svelte-lfm80c");
    			add_location(mark69, file, 471, 56, 18173);
    			attr_dev(mark70, "class", "svelte-lfm80c");
    			add_location(mark70, file, 471, 117, 18234);
    			attr_dev(mark71, "class", "svelte-lfm80c");
    			add_location(mark71, file, 471, 187, 18304);
    			attr_dev(mark72, "class", "svelte-lfm80c");
    			add_location(mark72, file, 471, 218, 18335);
    			attr_dev(p34, "class", "svelte-lfm80c");
    			add_location(p34, file, 471, 2, 18119);
    			attr_dev(br97, "class", "svelte-lfm80c");
    			add_location(br97, file, 475, 18, 18421);
    			attr_dev(mark73, "class", "svelte-lfm80c");
    			add_location(mark73, file, 476, 20, 18447);
    			attr_dev(br98, "class", "svelte-lfm80c");
    			add_location(br98, file, 476, 51, 18478);
    			attr_dev(mark74, "class", "svelte-lfm80c");
    			add_location(mark74, file, 477, 23, 18507);
    			attr_dev(br99, "class", "svelte-lfm80c");
    			add_location(br99, file, 477, 74, 18558);
    			attr_dev(br100, "class", "svelte-lfm80c");
    			add_location(br100, file, 478, 19, 18583);
    			attr_dev(br101, "class", "svelte-lfm80c");
    			add_location(br101, file, 479, 4, 18593);
    			attr_dev(mark75, "class", "svelte-lfm80c");
    			add_location(mark75, file, 480, 8, 18607);
    			attr_dev(mark76, "class", "svelte-lfm80c");
    			add_location(mark76, file, 480, 32, 18631);
    			attr_dev(br102, "class", "svelte-lfm80c");
    			add_location(br102, file, 480, 64, 18663);
    			attr_dev(br103, "class", "svelte-lfm80c");
    			add_location(br103, file, 481, 19, 18688);
    			attr_dev(mark77, "class", "svelte-lfm80c");
    			add_location(mark77, file, 482, 9, 18703);
    			attr_dev(code28, "class", "well svelte-lfm80c");
    			add_location(code28, file, 474, 3, 18382);
    			attr_dev(p35, "class", "svelte-lfm80c");
    			add_location(p35, file, 473, 2, 18374);
    			attr_dev(mark78, "class", "svelte-lfm80c");
    			add_location(mark78, file, 486, 147, 18901);
    			attr_dev(mark79, "class", "svelte-lfm80c");
    			add_location(mark79, file, 486, 224, 18978);
    			attr_dev(mark80, "class", "svelte-lfm80c");
    			add_location(mark80, file, 486, 258, 19012);
    			attr_dev(p36, "class", "svelte-lfm80c");
    			add_location(p36, file, 486, 2, 18756);
    			attr_dev(br104, "class", "svelte-lfm80c");
    			add_location(br104, file, 490, 18, 19101);
    			attr_dev(mark81, "class", "svelte-lfm80c");
    			add_location(mark81, file, 491, 20, 19127);
    			attr_dev(br105, "class", "svelte-lfm80c");
    			add_location(br105, file, 491, 46, 19153);
    			attr_dev(mark82, "class", "svelte-lfm80c");
    			add_location(mark82, file, 492, 23, 19182);
    			attr_dev(br106, "class", "svelte-lfm80c");
    			add_location(br106, file, 492, 101, 19260);
    			attr_dev(br107, "class", "svelte-lfm80c");
    			add_location(br107, file, 493, 19, 19285);
    			attr_dev(br108, "class", "svelte-lfm80c");
    			add_location(br108, file, 494, 4, 19295);
    			attr_dev(mark83, "class", "svelte-lfm80c");
    			add_location(mark83, file, 495, 8, 19309);
    			attr_dev(mark84, "class", "svelte-lfm80c");
    			add_location(mark84, file, 495, 32, 19333);
    			attr_dev(br109, "class", "svelte-lfm80c");
    			add_location(br109, file, 495, 67, 19368);
    			attr_dev(br110, "class", "svelte-lfm80c");
    			add_location(br110, file, 496, 19, 19393);
    			attr_dev(mark85, "class", "svelte-lfm80c");
    			add_location(mark85, file, 497, 9, 19408);
    			attr_dev(code29, "class", "well svelte-lfm80c");
    			add_location(code29, file, 489, 3, 19062);
    			attr_dev(p37, "class", "svelte-lfm80c");
    			add_location(p37, file, 488, 2, 19054);
    			attr_dev(div12, "class", "slider-wrapper svelte-lfm80c");
    			add_location(div12, file, 502, 3, 19488);
    			attr_dev(div13, "class", "relative svelte-lfm80c");
    			add_location(div13, file, 501, 2, 19461);
    			attr_dev(div14, "class", "block svelte-lfm80c");
    			add_location(div14, file, 452, 1, 17461);
    			attr_dev(h35, "class", "svelte-lfm80c");
    			add_location(h35, file, 525, 2, 20251);
    			attr_dev(h46, "class", "svelte-lfm80c");
    			add_location(h46, file, 527, 2, 20271);
    			attr_dev(mark86, "class", "svelte-lfm80c");
    			add_location(mark86, file, 529, 160, 20448);
    			attr_dev(p38, "class", "svelte-lfm80c");
    			add_location(p38, file, 529, 2, 20290);
    			attr_dev(mark87, "class", "svelte-lfm80c");
    			add_location(mark87, file, 533, 8, 20531);
    			attr_dev(mark88, "class", "svelte-lfm80c");
    			add_location(mark88, file, 533, 32, 20555);
    			attr_dev(br111, "class", "svelte-lfm80c");
    			add_location(br111, file, 533, 71, 20594);
    			attr_dev(br112, "class", "svelte-lfm80c");
    			add_location(br112, file, 534, 19, 20619);
    			attr_dev(mark89, "class", "svelte-lfm80c");
    			add_location(mark89, file, 535, 9, 20634);
    			attr_dev(code30, "class", "well svelte-lfm80c");
    			add_location(code30, file, 532, 3, 20502);
    			attr_dev(p39, "class", "svelte-lfm80c");
    			add_location(p39, file, 531, 2, 20494);
    			attr_dev(div15, "class", "slider-wrapper svelte-lfm80c");
    			add_location(div15, file, 540, 3, 20714);
    			attr_dev(div16, "class", "relative svelte-lfm80c");
    			add_location(div16, file, 539, 2, 20687);
    			attr_dev(h47, "class", "svelte-lfm80c");
    			add_location(h47, file, 559, 2, 21427);
    			attr_dev(mark90, "class", "svelte-lfm80c");
    			add_location(mark90, file, 561, 125, 21584);
    			attr_dev(p40, "class", "svelte-lfm80c");
    			add_location(p40, file, 561, 2, 21461);
    			attr_dev(mark91, "class", "svelte-lfm80c");
    			add_location(mark91, file, 565, 8, 21731);
    			attr_dev(mark92, "class", "svelte-lfm80c");
    			add_location(mark92, file, 565, 32, 21755);
    			attr_dev(br113, "class", "svelte-lfm80c");
    			add_location(br113, file, 565, 74, 21797);
    			attr_dev(br114, "class", "svelte-lfm80c");
    			add_location(br114, file, 566, 19, 21822);
    			attr_dev(mark93, "class", "svelte-lfm80c");
    			add_location(mark93, file, 567, 9, 21837);
    			attr_dev(code31, "class", "well svelte-lfm80c");
    			add_location(code31, file, 564, 3, 21702);
    			attr_dev(p41, "class", "svelte-lfm80c");
    			add_location(p41, file, 563, 2, 21694);
    			attr_dev(div17, "class", "slider-wrapper svelte-lfm80c");
    			add_location(div17, file, 572, 3, 21917);
    			attr_dev(div18, "class", "relative svelte-lfm80c");
    			add_location(div18, file, 571, 2, 21890);
    			attr_dev(h48, "class", "svelte-lfm80c");
    			add_location(h48, file, 591, 2, 22653);
    			attr_dev(mark94, "class", "svelte-lfm80c");
    			add_location(mark94, file, 593, 231, 22906);
    			attr_dev(p42, "class", "svelte-lfm80c");
    			add_location(p42, file, 593, 2, 22677);
    			attr_dev(mark95, "class", "svelte-lfm80c");
    			add_location(mark95, file, 597, 8, 23036);
    			attr_dev(mark96, "class", "svelte-lfm80c");
    			add_location(mark96, file, 597, 32, 23060);
    			attr_dev(br115, "class", "svelte-lfm80c");
    			add_location(br115, file, 597, 64, 23092);
    			attr_dev(br116, "class", "svelte-lfm80c");
    			add_location(br116, file, 598, 19, 23117);
    			attr_dev(mark97, "class", "svelte-lfm80c");
    			add_location(mark97, file, 599, 9, 23132);
    			attr_dev(code32, "class", "well svelte-lfm80c");
    			add_location(code32, file, 596, 3, 23007);
    			attr_dev(p43, "class", "svelte-lfm80c");
    			add_location(p43, file, 595, 2, 22999);
    			attr_dev(div19, "class", "slider-wrapper svelte-lfm80c");
    			add_location(div19, file, 604, 3, 23212);
    			attr_dev(div20, "class", "relative svelte-lfm80c");
    			add_location(div20, file, 603, 2, 23185);
    			attr_dev(div21, "class", "block svelte-lfm80c");
    			add_location(div21, file, 524, 1, 20228);
    			attr_dev(div22, "class", "wrapper svelte-lfm80c");
    			add_location(div22, file, 48, 0, 1450);
    			attr_dev(div23, "class", "cards svelte-lfm80c");
    			add_location(div23, file, 625, 0, 23953);
    			attr_dev(h22, "class", "svelte-lfm80c");
    			add_location(h22, file, 658, 1, 25028);
    			attr_dev(p44, "class", "svelte-lfm80c");
    			add_location(p44, file, 661, 2, 25075);
    			attr_dev(strong0, "class", "svelte-lfm80c");
    			add_location(strong0, file, 664, 3, 25158);
    			attr_dev(strong1, "class", "svelte-lfm80c");
    			add_location(strong1, file, 664, 29, 25184);
    			attr_dev(strong2, "class", "svelte-lfm80c");
    			add_location(strong2, file, 664, 54, 25209);
    			attr_dev(code33, "class", "svelte-lfm80c");
    			add_location(code33, file, 666, 3, 25244);
    			attr_dev(code34, "class", "svelte-lfm80c");
    			add_location(code34, file, 666, 20, 25261);
    			attr_dev(strong3, "class", "svelte-lfm80c");
    			add_location(strong3, file, 666, 35, 25276);
    			attr_dev(code35, "class", "svelte-lfm80c");
    			add_location(code35, file, 667, 3, 25342);
    			attr_dev(code36, "class", "svelte-lfm80c");
    			add_location(code36, file, 667, 21, 25360);
    			attr_dev(strong4, "class", "svelte-lfm80c");
    			add_location(strong4, file, 667, 39, 25378);
    			attr_dev(code37, "class", "svelte-lfm80c");
    			add_location(code37, file, 668, 3, 25473);
    			attr_dev(code38, "class", "svelte-lfm80c");
    			add_location(code38, file, 668, 35, 25505);
    			attr_dev(strong5, "class", "svelte-lfm80c");
    			add_location(strong5, file, 668, 52, 25522);
    			attr_dev(code39, "class", "svelte-lfm80c");
    			add_location(code39, file, 669, 3, 25585);
    			attr_dev(code40, "class", "svelte-lfm80c");
    			add_location(code40, file, 669, 26, 25608);
    			attr_dev(strong6, "class", "svelte-lfm80c");
    			add_location(strong6, file, 669, 42, 25624);
    			attr_dev(code41, "class", "svelte-lfm80c");
    			add_location(code41, file, 670, 3, 25709);
    			attr_dev(code42, "class", "svelte-lfm80c");
    			add_location(code42, file, 670, 29, 25735);
    			attr_dev(strong7, "class", "svelte-lfm80c");
    			add_location(strong7, file, 670, 44, 25750);
    			attr_dev(code43, "class", "svelte-lfm80c");
    			add_location(code43, file, 671, 3, 25811);
    			attr_dev(code44, "class", "svelte-lfm80c");
    			add_location(code44, file, 671, 22, 25830);
    			attr_dev(strong8, "class", "svelte-lfm80c");
    			add_location(strong8, file, 671, 38, 25846);
    			attr_dev(code45, "class", "svelte-lfm80c");
    			add_location(code45, file, 672, 3, 25907);
    			attr_dev(code46, "class", "svelte-lfm80c");
    			add_location(code46, file, 672, 28, 25932);
    			attr_dev(strong9, "class", "svelte-lfm80c");
    			add_location(strong9, file, 672, 43, 25947);
    			attr_dev(code47, "class", "svelte-lfm80c");
    			add_location(code47, file, 673, 3, 26036);
    			attr_dev(code48, "class", "svelte-lfm80c");
    			add_location(code48, file, 673, 25, 26058);
    			attr_dev(strong10, "class", "svelte-lfm80c");
    			add_location(strong10, file, 673, 40, 26073);
    			attr_dev(code49, "class", "svelte-lfm80c");
    			add_location(code49, file, 674, 3, 26150);
    			attr_dev(code50, "class", "svelte-lfm80c");
    			add_location(code50, file, 674, 38, 26185);
    			attr_dev(strong11, "class", "svelte-lfm80c");
    			add_location(strong11, file, 674, 53, 26200);
    			attr_dev(code51, "class", "svelte-lfm80c");
    			add_location(code51, file, 675, 3, 26275);
    			attr_dev(code52, "class", "svelte-lfm80c");
    			add_location(code52, file, 675, 27, 26299);
    			attr_dev(strong12, "class", "svelte-lfm80c");
    			add_location(strong12, file, 675, 46, 26318);
    			attr_dev(code53, "class", "svelte-lfm80c");
    			add_location(code53, file, 676, 3, 26424);
    			attr_dev(code54, "class", "svelte-lfm80c");
    			add_location(code54, file, 676, 30, 26451);
    			attr_dev(strong13, "class", "svelte-lfm80c");
    			add_location(strong13, file, 676, 45, 26466);
    			attr_dev(div24, "class", "table svelte-lfm80c");
    			add_location(div24, file, 663, 2, 25134);
    			attr_dev(div25, "class", "block svelte-lfm80c");
    			add_location(div25, file, 660, 1, 25052);
    			attr_dev(h23, "class", "svelte-lfm80c");
    			add_location(h23, file, 680, 1, 26576);
    			attr_dev(p45, "class", "svelte-lfm80c");
    			add_location(p45, file, 683, 2, 26622);
    			attr_dev(strong14, "class", "svelte-lfm80c");
    			add_location(strong14, file, 686, 3, 26696);
    			attr_dev(strong15, "class", "svelte-lfm80c");
    			add_location(strong15, file, 686, 25, 26718);
    			attr_dev(strong16, "class", "svelte-lfm80c");
    			add_location(strong16, file, 686, 53, 26746);
    			attr_dev(code55, "class", "svelte-lfm80c");
    			add_location(code55, file, 688, 3, 26781);
    			attr_dev(code56, "class", "svelte-lfm80c");
    			add_location(code56, file, 688, 25, 26803);
    			attr_dev(strong17, "class", "svelte-lfm80c");
    			add_location(strong17, file, 688, 44, 26822);
    			attr_dev(div26, "class", "table svelte-lfm80c");
    			add_location(div26, file, 685, 2, 26672);
    			attr_dev(div27, "class", "block svelte-lfm80c");
    			add_location(div27, file, 682, 1, 26599);
    			attr_dev(h24, "class", "svelte-lfm80c");
    			add_location(h24, file, 692, 1, 26909);
    			attr_dev(p46, "class", "svelte-lfm80c");
    			add_location(p46, file, 695, 2, 26952);
    			attr_dev(strong18, "class", "svelte-lfm80c");
    			add_location(strong18, file, 698, 3, 27014);
    			attr_dev(strong19, "class", "svelte-lfm80c");
    			add_location(strong19, file, 698, 25, 27036);
    			attr_dev(strong20, "class", "svelte-lfm80c");
    			add_location(strong20, file, 698, 43, 27054);
    			attr_dev(code57, "class", "svelte-lfm80c");
    			add_location(code57, file, 700, 3, 27089);
    			attr_dev(code58, "class", "svelte-lfm80c");
    			add_location(code58, file, 700, 20, 27106);
    			attr_dev(strong21, "class", "svelte-lfm80c");
    			add_location(strong21, file, 700, 34, 27120);
    			attr_dev(div28, "class", "table svelte-lfm80c");
    			add_location(div28, file, 697, 2, 26990);
    			attr_dev(div29, "class", "block svelte-lfm80c");
    			add_location(div29, file, 694, 1, 26929);
    			attr_dev(a1, "href", "https://github.com/Mitcheljager");
    			attr_dev(a1, "class", "svelte-lfm80c");
    			add_location(a1, file, 705, 10, 27242);
    			attr_dev(div30, "class", "block svelte-lfm80c");
    			add_location(div30, file, 704, 1, 27211);
    			attr_dev(div31, "class", "wrapper svelte-lfm80c");
    			add_location(div31, file, 657, 0, 25004);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(h1, mark0);
    			append_dev(h1, t1);
    			append_dev(header, t2);
    			mount_component(tinyslider0, header, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div22, anchor);
    			append_dev(div22, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t5);
    			append_dev(div0, p1);
    			append_dev(p1, a0);
    			append_dev(div0, t7);
    			append_dev(div0, h20);
    			append_dev(div0, t9);
    			append_dev(div0, p2);
    			append_dev(div0, t11);
    			append_dev(div0, code0);
    			append_dev(code0, t12);
    			append_dev(code0, mark1);
    			append_dev(div0, t14);
    			append_dev(div0, code1);
    			append_dev(code1, t15);
    			append_dev(code1, mark2);
    			append_dev(div0, t17);
    			append_dev(div0, p3);
    			append_dev(div0, t19);
    			append_dev(div0, code2);
    			append_dev(code2, t20);
    			append_dev(code2, mark3);
    			append_dev(code2, t22);
    			append_dev(code2, mark4);
    			append_dev(code2, t24);
    			append_dev(div0, t25);
    			append_dev(div0, code3);
    			append_dev(code3, t26);
    			append_dev(code3, mark5);
    			append_dev(code3, t28);
    			append_dev(code3, mark6);
    			append_dev(code3, t30);
    			append_dev(div22, t31);
    			append_dev(div22, h21);
    			append_dev(div22, t33);
    			append_dev(div22, div1);
    			append_dev(div1, p4);
    			append_dev(div1, t35);
    			append_dev(div1, p5);
    			append_dev(p5, code4);
    			append_dev(code4, t36);
    			append_dev(code4, mark7);
    			append_dev(code4, t38);
    			append_dev(code4, br0);
    			append_dev(code4, t39);
    			append_dev(code4, br1);
    			append_dev(code4, t40);
    			append_dev(code4, br2);
    			append_dev(code4, t41);
    			append_dev(code4, br3);
    			append_dev(code4, t42);
    			append_dev(code4, mark8);
    			append_dev(code4, t44);
    			append_dev(div1, t45);
    			mount_component(tinyslider1, div1, null);
    			append_dev(div22, t46);
    			append_dev(div22, div5);
    			append_dev(div5, h30);
    			append_dev(div5, t48);
    			append_dev(div5, p6);
    			append_dev(div5, h40);
    			append_dev(div5, t51);
    			append_dev(div5, p7);
    			append_dev(p7, t52);
    			append_dev(p7, code5);
    			append_dev(code5, t53);
    			append_dev(code5, mark9);
    			append_dev(code5, t55);
    			append_dev(p7, t56);
    			append_dev(div5, t57);
    			append_dev(div5, ul);
    			append_dev(ul, li0);
    			append_dev(li0, mark10);
    			append_dev(li0, t59);
    			append_dev(ul, t60);
    			append_dev(ul, li1);
    			append_dev(li1, mark11);
    			append_dev(li1, t62);
    			append_dev(div5, t63);
    			append_dev(div5, p8);
    			append_dev(p8, t64);
    			append_dev(p8, code6);
    			append_dev(p8, t66);
    			append_dev(div5, t67);
    			append_dev(div5, p9);
    			append_dev(p9, code7);
    			append_dev(code7, t68);
    			append_dev(code7, mark12);
    			append_dev(code7, t70);
    			append_dev(code7, mark13);
    			append_dev(code7, t72);
    			append_dev(code7, mark14);
    			append_dev(code7, t74);
    			append_dev(code7, br4);
    			append_dev(code7, t75);
    			append_dev(code7, br5);
    			append_dev(code7, t76);
    			append_dev(code7, br6);
    			append_dev(code7, t77);
    			append_dev(code7, br7);
    			append_dev(code7, t78);
    			append_dev(code7, br8);
    			append_dev(code7, t79);
    			append_dev(code7, mark15);
    			append_dev(code7, t81);
    			append_dev(code7, br9);
    			append_dev(code7, t82);
    			append_dev(code7, mark16);
    			append_dev(code7, t84);
    			append_dev(code7, br10);
    			append_dev(code7, t85);
    			append_dev(code7, mark17);
    			append_dev(code7, t87);
    			append_dev(code7, mark18);
    			append_dev(code7, t89);
    			append_dev(code7, br11);
    			append_dev(code7, t90);
    			append_dev(code7, br12);
    			append_dev(code7, t91);
    			append_dev(code7, br13);
    			append_dev(code7, t92);
    			append_dev(code7, mark19);
    			append_dev(code7, t94);
    			append_dev(code7, br14);
    			append_dev(code7, t95);
    			append_dev(code7, mark20);
    			append_dev(code7, t97);
    			append_dev(code7, mark21);
    			append_dev(code7, t99);
    			append_dev(code7, br15);
    			append_dev(code7, t100);
    			append_dev(code7, br16);
    			append_dev(code7, t101);
    			append_dev(code7, br17);
    			append_dev(code7, t102);
    			append_dev(code7, mark22);
    			append_dev(code7, t104);
    			append_dev(div5, t105);
    			append_dev(div5, div2);
    			mount_component(tinyslider2, div2, null);
    			append_dev(div5, t106);
    			append_dev(div5, p10);
    			append_dev(div5, t108);
    			append_dev(div5, p11);
    			append_dev(p11, code8);
    			append_dev(code8, t109);
    			append_dev(code8, mark23);
    			append_dev(code8, t111);
    			append_dev(code8, mark24);
    			append_dev(code8, t113);
    			append_dev(code8, mark25);
    			append_dev(code8, t115);
    			append_dev(code8, br18);
    			append_dev(code8, t116);
    			append_dev(code8, br19);
    			append_dev(code8, t117);
    			append_dev(code8, br20);
    			append_dev(code8, t118);
    			append_dev(code8, br21);
    			append_dev(code8, t119);
    			append_dev(code8, br22);
    			append_dev(code8, t120);
    			append_dev(code8, br23);
    			append_dev(code8, t121);
    			append_dev(code8, br24);
    			append_dev(code8, t122);
    			append_dev(code8, br25);
    			append_dev(code8, t123);
    			append_dev(code8, mark26);
    			append_dev(code8, t125);
    			append_dev(code8, br26);
    			append_dev(code8, t126);
    			append_dev(code8, mark27);
    			append_dev(code8, t128);
    			append_dev(code8, br27);
    			append_dev(code8, t129);
    			append_dev(code8, br28);
    			append_dev(code8, t130);
    			append_dev(code8, br29);
    			append_dev(code8, t131);
    			append_dev(code8, mark28);
    			append_dev(code8, t133);
    			append_dev(div5, t134);
    			append_dev(div5, div3);
    			mount_component(tinyslider3, div3, null);
    			append_dev(div5, t135);
    			append_dev(div5, p12);
    			append_dev(div5, t137);
    			append_dev(div5, p13);
    			append_dev(p13, code9);
    			append_dev(code9, t138);
    			append_dev(code9, mark29);
    			append_dev(code9, t140);
    			append_dev(code9, mark30);
    			append_dev(code9, t142);
    			append_dev(code9, mark31);
    			append_dev(code9, t144);
    			append_dev(code9, br30);
    			append_dev(code9, t145);
    			append_dev(code9, br31);
    			append_dev(code9, t146);
    			append_dev(code9, br32);
    			append_dev(code9, t147);
    			append_dev(code9, br33);
    			append_dev(code9, t148);
    			append_dev(code9, br34);
    			append_dev(code9, t149);
    			append_dev(code9, br35);
    			append_dev(code9, t150);
    			append_dev(code9, br36);
    			append_dev(code9, t151);
    			append_dev(code9, br37);
    			append_dev(code9, t152);
    			append_dev(code9, mark32);
    			append_dev(code9, t154);
    			append_dev(code9, br38);
    			append_dev(code9, t155);
    			append_dev(code9, mark33);
    			append_dev(code9, t157);
    			append_dev(code9, br39);
    			append_dev(code9, t158);
    			append_dev(code9, mark34);
    			append_dev(code9, t160);
    			append_dev(code9, br40);
    			append_dev(code9, t161);
    			append_dev(code9, br41);
    			append_dev(code9, t162);
    			append_dev(code9, br42);
    			append_dev(code9, t163);
    			append_dev(code9, br43);
    			append_dev(code9, t164);
    			append_dev(code9, br44);
    			append_dev(code9, t165);
    			append_dev(code9, mark35);
    			append_dev(code9, t167);
    			append_dev(div5, t168);
    			append_dev(div5, div4);
    			mount_component(tinyslider4, div4, null);
    			append_dev(div5, t169);
    			append_dev(div5, h41);
    			append_dev(div5, t171);
    			append_dev(div5, p14);
    			append_dev(p14, t172);
    			append_dev(p14, code10);
    			append_dev(p14, t174);
    			append_dev(p14, code11);
    			append_dev(p14, t176);
    			append_dev(p14, code12);
    			append_dev(p14, t178);
    			append_dev(div5, t179);
    			append_dev(div5, p15);
    			append_dev(p15, code13);
    			append_dev(code13, t180);
    			append_dev(code13, br45);
    			append_dev(code13, t181);
    			append_dev(code13, mark36);
    			append_dev(code13, br46);
    			append_dev(code13, t183);
    			append_dev(code13, br47);
    			append_dev(code13, t184);
    			append_dev(code13, br48);
    			append_dev(code13, t185);
    			append_dev(code13, mark37);
    			append_dev(code13, t187);
    			append_dev(code13, mark38);
    			append_dev(code13, t189);
    			append_dev(code13, mark39);
    			append_dev(code13, t191);
    			append_dev(code13, br49);
    			append_dev(code13, t192);
    			append_dev(code13, br50);
    			append_dev(code13, t193);
    			append_dev(code13, br51);
    			append_dev(code13, t194);
    			append_dev(code13, br52);
    			append_dev(code13, t195);
    			append_dev(code13, mark40);
    			append_dev(code13, t197);
    			append_dev(code13, br53);
    			append_dev(code13, t198);
    			append_dev(code13, br54);
    			append_dev(code13, t199);
    			append_dev(code13, mark41);
    			append_dev(code13, t201);
    			append_dev(code13, br55);
    			append_dev(code13, t202);
    			append_dev(code13, mark42);
    			append_dev(code13, t204);
    			append_dev(code13, br56);
    			append_dev(code13, t205);
    			append_dev(code13, mark43);
    			append_dev(code13, t207);
    			append_dev(code13, br57);
    			append_dev(div5, t208);
    			mount_component(tinyslider5, div5, null);
    			append_dev(div5, t209);
    			append_dev(div5, p16);
    			append_dev(p16, t210);
    			append_dev(p16, code14);
    			append_dev(p16, t212);
    			append_dev(div5, t213);
    			append_dev(div5, button0);
    			append_dev(div5, t215);
    			append_dev(div5, button1);
    			append_dev(div5, t217);
    			append_dev(div5, button2);
    			append_dev(div22, t219);
    			append_dev(div22, div6);
    			append_dev(div6, h31);
    			append_dev(div6, t221);
    			append_dev(div6, p17);
    			append_dev(div6, t223);
    			append_dev(div6, h42);
    			append_dev(div6, t225);
    			append_dev(div6, p18);
    			append_dev(p18, t226);
    			append_dev(p18, code15);
    			append_dev(p18, t228);
    			append_dev(p18, code16);
    			append_dev(p18, t230);
    			append_dev(div6, t231);
    			append_dev(div6, p19);
    			append_dev(p19, code17);
    			append_dev(code17, t232);
    			append_dev(code17, mark44);
    			append_dev(code17, t234);
    			append_dev(code17, mark45);
    			append_dev(code17, t236);
    			append_dev(code17, br58);
    			append_dev(code17, t237);
    			append_dev(code17, br59);
    			append_dev(code17, t238);
    			append_dev(code17, mark46);
    			append_dev(code17, t240);
    			append_dev(code17, br60);
    			append_dev(code17, t241);
    			append_dev(code17, br61);
    			append_dev(code17, t242);
    			append_dev(code17, mark47);
    			append_dev(code17, t244);
    			append_dev(div6, t245);
    			mount_component(tinyslider6, div6, null);
    			append_dev(div6, t246);
    			append_dev(div6, h43);
    			append_dev(div6, t248);
    			append_dev(div6, p20);
    			append_dev(p20, t249);
    			append_dev(p20, code18);
    			append_dev(p20, t251);
    			append_dev(div6, t252);
    			append_dev(div6, code19);
    			append_dev(code19, t253);
    			append_dev(code19, br62);
    			append_dev(code19, t254);
    			append_dev(code19, br63);
    			append_dev(code19, t255);
    			append_dev(div6, t256);
    			append_dev(div6, p21);
    			append_dev(p21, t257);
    			append_dev(p21, code20);
    			append_dev(p21, t259);
    			append_dev(div6, t260);
    			append_dev(div6, p22);
    			append_dev(p22, code21);
    			append_dev(code21, t261);
    			append_dev(code21, mark48);
    			append_dev(code21, t263);
    			append_dev(code21, mark49);
    			append_dev(code21, t265);
    			append_dev(code21, br64);
    			append_dev(code21, t266);
    			append_dev(code21, br65);
    			append_dev(code21, t267);
    			append_dev(code21, br66);
    			append_dev(code21, t268);
    			append_dev(code21, br67);
    			append_dev(code21, t269);
    			append_dev(code21, mark50);
    			append_dev(code21, t271);
    			append_dev(div6, t272);
    			mount_component(tinyslider7, div6, null);
    			append_dev(div22, t273);
    			append_dev(div22, div7);
    			append_dev(div7, h32);
    			append_dev(div7, t275);
    			append_dev(div7, p23);
    			append_dev(div7, t277);
    			append_dev(div7, p24);
    			append_dev(p24, code22);
    			append_dev(code22, t278);
    			append_dev(code22, mark51);
    			append_dev(code22, t280);
    			append_dev(code22, br68);
    			append_dev(code22, t281);
    			append_dev(code22, br69);
    			append_dev(code22, t282);
    			append_dev(code22, br70);
    			append_dev(code22, t283);
    			append_dev(code22, br71);
    			append_dev(code22, t284);
    			append_dev(code22, br72);
    			append_dev(code22, t285);
    			append_dev(code22, br73);
    			append_dev(code22, t286);
    			append_dev(code22, mark52);
    			append_dev(code22, t288);
    			append_dev(div7, t289);
    			mount_component(tinyslider8, div7, null);
    			append_dev(div22, t290);
    			append_dev(div22, div11);
    			append_dev(div11, h33);
    			append_dev(div11, t292);
    			append_dev(div11, p25);
    			append_dev(p25, t293);
    			append_dev(p25, code23);
    			append_dev(p25, t295);
    			append_dev(div11, t296);
    			append_dev(div11, p26);
    			append_dev(p26, t297);
    			append_dev(p26, code24);
    			append_dev(p26, t299);
    			append_dev(div11, p27);
    			append_dev(p27, code25);
    			append_dev(code25, t300);
    			append_dev(code25, mark53);
    			append_dev(code25, t302);
    			append_dev(code25, mark54);
    			append_dev(code25, t304);
    			append_dev(code25, br74);
    			append_dev(code25, t305);
    			append_dev(code25, br75);
    			append_dev(code25, t306);
    			append_dev(code25, br76);
    			append_dev(code25, t307);
    			append_dev(code25, mark55);
    			append_dev(code25, t309);
    			append_dev(code25, br77);
    			append_dev(code25, t310);
    			append_dev(code25, br78);
    			append_dev(code25, t311);
    			append_dev(code25, br79);
    			append_dev(code25, t312);
    			append_dev(code25, br80);
    			append_dev(code25, t313);
    			append_dev(code25, br81);
    			append_dev(code25, t314);
    			append_dev(code25, br82);
    			append_dev(code25, t315);
    			append_dev(code25, br83);
    			append_dev(code25, t316);
    			append_dev(code25, mark56);
    			append_dev(code25, t318);
    			append_dev(code25, br84);
    			append_dev(div11, t319);
    			append_dev(div11, p28);
    			append_dev(div11, t321);
    			append_dev(div11, div8);
    			mount_component(tinyslider9, div8, null);
    			append_dev(div11, t322);
    			append_dev(div11, p29);
    			append_dev(p29, t323);
    			append_dev(p29, mark57);
    			append_dev(p29, t325);
    			append_dev(p29, mark58);
    			append_dev(p29, t327);
    			append_dev(p29, mark59);
    			append_dev(p29, t329);
    			append_dev(p29, mark60);
    			append_dev(p29, t331);
    			append_dev(div11, t332);
    			append_dev(div11, p30);
    			append_dev(p30, code26);
    			append_dev(code26, t333);
    			append_dev(code26, mark61);
    			append_dev(code26, t335);
    			append_dev(code26, mark62);
    			append_dev(code26, t337);
    			append_dev(code26, br85);
    			append_dev(code26, t338);
    			append_dev(code26, br86);
    			append_dev(code26, t339);
    			append_dev(code26, br87);
    			append_dev(code26, t340);
    			append_dev(code26, mark63);
    			append_dev(code26, t342);
    			append_dev(code26, br88);
    			append_dev(code26, t343);
    			append_dev(code26, br89);
    			append_dev(code26, t344);
    			append_dev(code26, br90);
    			append_dev(code26, t345);
    			append_dev(code26, br91);
    			append_dev(code26, t346);
    			append_dev(code26, br92);
    			append_dev(code26, t347);
    			append_dev(code26, br93);
    			append_dev(code26, t348);
    			append_dev(code26, br94);
    			append_dev(code26, t349);
    			append_dev(code26, mark64);
    			append_dev(code26, t351);
    			append_dev(div11, t352);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			mount_component(tinyslider10, div9, null);
    			append_dev(div22, t353);
    			append_dev(div22, div14);
    			append_dev(div14, h34);
    			append_dev(div14, t355);
    			append_dev(div14, p31);
    			append_dev(div14, t357);
    			append_dev(div14, h44);
    			append_dev(div14, t359);
    			append_dev(div14, p32);
    			append_dev(p32, t360);
    			append_dev(p32, mark65);
    			append_dev(p32, t362);
    			append_dev(div14, t363);
    			append_dev(div14, p33);
    			append_dev(p33, code27);
    			append_dev(code27, t364);
    			append_dev(code27, mark66);
    			append_dev(code27, t366);
    			append_dev(code27, mark67);
    			append_dev(code27, t368);
    			append_dev(code27, br95);
    			append_dev(code27, t369);
    			append_dev(code27, br96);
    			append_dev(code27, t370);
    			append_dev(code27, mark68);
    			append_dev(code27, t372);
    			append_dev(div14, t373);
    			append_dev(div14, h45);
    			append_dev(div14, t375);
    			append_dev(div14, p34);
    			append_dev(p34, t376);
    			append_dev(p34, mark69);
    			append_dev(p34, t378);
    			append_dev(p34, mark70);
    			append_dev(p34, t380);
    			append_dev(p34, mark71);
    			append_dev(p34, t382);
    			append_dev(p34, mark72);
    			append_dev(p34, t384);
    			append_dev(div14, t385);
    			append_dev(div14, p35);
    			append_dev(p35, code28);
    			append_dev(code28, t386);
    			append_dev(code28, br97);
    			append_dev(code28, t387);
    			append_dev(code28, mark73);
    			append_dev(code28, t389);
    			append_dev(code28, br98);
    			append_dev(code28, t390);
    			append_dev(code28, mark74);
    			append_dev(code28, t392);
    			append_dev(code28, br99);
    			append_dev(code28, t393);
    			append_dev(code28, br100);
    			append_dev(code28, t394);
    			append_dev(code28, br101);
    			append_dev(code28, t395);
    			append_dev(code28, mark75);
    			append_dev(code28, t397);
    			append_dev(code28, mark76);
    			append_dev(code28, t399);
    			append_dev(code28, br102);
    			append_dev(code28, t400);
    			append_dev(code28, br103);
    			append_dev(code28, t401);
    			append_dev(code28, mark77);
    			append_dev(code28, t403);
    			append_dev(div14, t404);
    			append_dev(div14, p36);
    			append_dev(p36, t405);
    			append_dev(p36, mark78);
    			append_dev(p36, t407);
    			append_dev(p36, mark79);
    			append_dev(p36, t409);
    			append_dev(p36, mark80);
    			append_dev(p36, t411);
    			append_dev(div14, t412);
    			append_dev(div14, p37);
    			append_dev(p37, code29);
    			append_dev(code29, t413);
    			append_dev(code29, br104);
    			append_dev(code29, t414);
    			append_dev(code29, mark81);
    			append_dev(code29, br105);
    			append_dev(code29, t416);
    			append_dev(code29, mark82);
    			append_dev(code29, t418);
    			append_dev(code29, br106);
    			append_dev(code29, t419);
    			append_dev(code29, br107);
    			append_dev(code29, t420);
    			append_dev(code29, br108);
    			append_dev(code29, t421);
    			append_dev(code29, mark83);
    			append_dev(code29, t423);
    			append_dev(code29, mark84);
    			append_dev(code29, t425);
    			append_dev(code29, br109);
    			append_dev(code29, t426);
    			append_dev(code29, br110);
    			append_dev(code29, t427);
    			append_dev(code29, mark85);
    			append_dev(code29, t429);
    			append_dev(div14, t430);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			mount_component(tinyslider11, div12, null);
    			append_dev(div22, t431);
    			append_dev(div22, div21);
    			append_dev(div21, h35);
    			append_dev(div21, t433);
    			append_dev(div21, h46);
    			append_dev(div21, t435);
    			append_dev(div21, p38);
    			append_dev(p38, t436);
    			append_dev(p38, mark86);
    			append_dev(p38, t438);
    			append_dev(div21, t439);
    			append_dev(div21, p39);
    			append_dev(p39, code30);
    			append_dev(code30, t440);
    			append_dev(code30, mark87);
    			append_dev(code30, t442);
    			append_dev(code30, mark88);
    			append_dev(code30, t444);
    			append_dev(code30, br111);
    			append_dev(code30, t445);
    			append_dev(code30, br112);
    			append_dev(code30, t446);
    			append_dev(code30, mark89);
    			append_dev(code30, t448);
    			append_dev(div21, t449);
    			append_dev(div21, div16);
    			append_dev(div16, div15);
    			mount_component(tinyslider12, div15, null);
    			append_dev(div21, t450);
    			append_dev(div21, h47);
    			append_dev(div21, t452);
    			append_dev(div21, p40);
    			append_dev(p40, t453);
    			append_dev(p40, mark90);
    			append_dev(p40, t455);
    			append_dev(div21, t456);
    			append_dev(div21, p41);
    			append_dev(p41, code31);
    			append_dev(code31, t457);
    			append_dev(code31, mark91);
    			append_dev(code31, t459);
    			append_dev(code31, mark92);
    			append_dev(code31, t461);
    			append_dev(code31, br113);
    			append_dev(code31, t462);
    			append_dev(code31, br114);
    			append_dev(code31, t463);
    			append_dev(code31, mark93);
    			append_dev(code31, t465);
    			append_dev(div21, t466);
    			append_dev(div21, div18);
    			append_dev(div18, div17);
    			mount_component(tinyslider13, div17, null);
    			append_dev(div21, t467);
    			append_dev(div21, h48);
    			append_dev(div21, t469);
    			append_dev(div21, p42);
    			append_dev(p42, t470);
    			append_dev(p42, mark94);
    			append_dev(p42, t472);
    			append_dev(div21, t473);
    			append_dev(div21, p43);
    			append_dev(p43, code32);
    			append_dev(code32, t474);
    			append_dev(code32, mark95);
    			append_dev(code32, t476);
    			append_dev(code32, mark96);
    			append_dev(code32, t478);
    			append_dev(code32, br115);
    			append_dev(code32, t479);
    			append_dev(code32, br116);
    			append_dev(code32, t480);
    			append_dev(code32, mark97);
    			append_dev(code32, t482);
    			append_dev(div21, t483);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			mount_component(tinyslider14, div19, null);
    			insert_dev(target, t484, anchor);
    			insert_dev(target, div23, anchor);
    			mount_component(tinyslider15, div23, null);
    			insert_dev(target, t485, anchor);
    			insert_dev(target, div31, anchor);
    			append_dev(div31, h22);
    			append_dev(div31, t487);
    			append_dev(div31, div25);
    			append_dev(div25, p44);
    			append_dev(div25, t489);
    			append_dev(div25, div24);
    			append_dev(div24, strong0);
    			append_dev(div24, t491);
    			append_dev(div24, strong1);
    			append_dev(div24, t493);
    			append_dev(div24, strong2);
    			append_dev(div24, t495);
    			append_dev(div24, code33);
    			append_dev(div24, t497);
    			append_dev(div24, code34);
    			append_dev(div24, t499);
    			append_dev(div24, strong3);
    			append_dev(div24, t501);
    			append_dev(div24, code35);
    			append_dev(div24, t503);
    			append_dev(div24, code36);
    			append_dev(div24, t505);
    			append_dev(div24, strong4);
    			append_dev(div24, t507);
    			append_dev(div24, code37);
    			append_dev(div24, t509);
    			append_dev(div24, code38);
    			append_dev(div24, t511);
    			append_dev(div24, strong5);
    			append_dev(div24, t513);
    			append_dev(div24, code39);
    			append_dev(div24, t515);
    			append_dev(div24, code40);
    			append_dev(div24, t517);
    			append_dev(div24, strong6);
    			append_dev(div24, t519);
    			append_dev(div24, code41);
    			append_dev(div24, t521);
    			append_dev(div24, code42);
    			append_dev(div24, t523);
    			append_dev(div24, strong7);
    			append_dev(div24, t525);
    			append_dev(div24, code43);
    			append_dev(div24, t527);
    			append_dev(div24, code44);
    			append_dev(div24, t529);
    			append_dev(div24, strong8);
    			append_dev(div24, t531);
    			append_dev(div24, code45);
    			append_dev(div24, t533);
    			append_dev(div24, code46);
    			append_dev(div24, t535);
    			append_dev(div24, strong9);
    			append_dev(div24, t537);
    			append_dev(div24, code47);
    			append_dev(div24, t539);
    			append_dev(div24, code48);
    			append_dev(div24, t541);
    			append_dev(div24, strong10);
    			append_dev(div24, t543);
    			append_dev(div24, code49);
    			append_dev(div24, t545);
    			append_dev(div24, code50);
    			append_dev(div24, t547);
    			append_dev(div24, strong11);
    			append_dev(div24, t549);
    			append_dev(div24, code51);
    			append_dev(div24, t551);
    			append_dev(div24, code52);
    			append_dev(div24, t553);
    			append_dev(div24, strong12);
    			append_dev(div24, t555);
    			append_dev(div24, code53);
    			append_dev(div24, t557);
    			append_dev(div24, code54);
    			append_dev(div24, t559);
    			append_dev(div24, strong13);
    			append_dev(div31, t561);
    			append_dev(div31, h23);
    			append_dev(div31, t563);
    			append_dev(div31, div27);
    			append_dev(div27, p45);
    			append_dev(div27, t565);
    			append_dev(div27, div26);
    			append_dev(div26, strong14);
    			append_dev(div26, t567);
    			append_dev(div26, strong15);
    			append_dev(div26, t569);
    			append_dev(div26, strong16);
    			append_dev(div26, t571);
    			append_dev(div26, code55);
    			append_dev(div26, t573);
    			append_dev(div26, code56);
    			append_dev(div26, t575);
    			append_dev(div26, strong17);
    			append_dev(div31, t577);
    			append_dev(div31, h24);
    			append_dev(div31, t579);
    			append_dev(div31, div29);
    			append_dev(div29, p46);
    			append_dev(div29, t581);
    			append_dev(div29, div28);
    			append_dev(div28, strong18);
    			append_dev(div28, t583);
    			append_dev(div28, strong19);
    			append_dev(div28, t584);
    			append_dev(div28, strong20);
    			append_dev(div28, t586);
    			append_dev(div28, code57);
    			append_dev(div28, t588);
    			append_dev(div28, code58);
    			append_dev(div28, t589);
    			append_dev(div28, strong21);
    			append_dev(div31, t591);
    			append_dev(div31, div30);
    			append_dev(div30, t592);
    			append_dev(div30, a1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_5*/ ctx[24], false, false, false),
    					listen_dev(button1, "click", /*click_handler_6*/ ctx[25], false, false, false),
    					listen_dev(button2, "click", /*click_handler_7*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const tinyslider0_changes = {};

    			if (dirty[2] & /*$$scope*/ 524288) {
    				tinyslider0_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider0.$set(tinyslider0_changes);
    			const tinyslider1_changes = {};

    			if (dirty[2] & /*$$scope*/ 524288) {
    				tinyslider1_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider1.$set(tinyslider1_changes);
    			const tinyslider2_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider2_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider2.$set(tinyslider2_changes);
    			const tinyslider3_changes = {};

    			if (dirty[0] & /*currentIndex, setIndex*/ 24 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider3_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider3.$set(tinyslider3_changes);
    			const tinyslider4_changes = {};

    			if (dirty[0] & /*currentIndex, setIndex*/ 24 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider4_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider4.$set(tinyslider4_changes);
    			const tinyslider5_changes = {};

    			if (dirty[2] & /*$$scope*/ 524288) {
    				tinyslider5_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_setIndex && dirty[0] & /*setIndex*/ 8) {
    				updating_setIndex = true;
    				tinyslider5_changes.setIndex = /*setIndex*/ ctx[3];
    				add_flush_callback(() => updating_setIndex = false);
    			}

    			if (!updating_currentIndex && dirty[0] & /*currentIndex*/ 16) {
    				updating_currentIndex = true;
    				tinyslider5_changes.currentIndex = /*currentIndex*/ ctx[4];
    				add_flush_callback(() => updating_currentIndex = false);
    			}

    			tinyslider5.$set(tinyslider5_changes);
    			const tinyslider6_changes = {};

    			if (dirty[0] & /*sliderWidth*/ 4 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider6_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider6.$set(tinyslider6_changes);
    			const tinyslider7_changes = {};

    			if (dirty[0] & /*sliderWidth*/ 4 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider7_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider7.$set(tinyslider7_changes);
    			const tinyslider8_changes = {};

    			if (dirty[2] & /*$$scope*/ 524288) {
    				tinyslider8_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider8.$set(tinyslider8_changes);
    			const tinyslider9_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex, sliderWidth*/ 28 | dirty[1] & /*reachedEnd*/ 32768 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider9_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider9.$set(tinyslider9_changes);
    			const tinyslider10_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[1] & /*reachedEnd, shown*/ 49152 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider10_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider10.$set(tinyslider10_changes);
    			const tinyslider11_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex, portaitItems*/ 25 | dirty[1] & /*shown*/ 16384 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider11_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_distanceToEnd && dirty[0] & /*distanceToEnd*/ 2) {
    				updating_distanceToEnd = true;
    				tinyslider11_changes.distanceToEnd = /*distanceToEnd*/ ctx[1];
    				add_flush_callback(() => updating_distanceToEnd = false);
    			}

    			if (!updating_sliderWidth && dirty[0] & /*sliderWidth*/ 4) {
    				updating_sliderWidth = true;
    				tinyslider11_changes.sliderWidth = /*sliderWidth*/ ctx[2];
    				add_flush_callback(() => updating_sliderWidth = false);
    			}

    			tinyslider11.$set(tinyslider11_changes);
    			const tinyslider12_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider12_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider12.$set(tinyslider12_changes);
    			const tinyslider13_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[1] & /*reachedEnd*/ 32768 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider13_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider13.$set(tinyslider13_changes);
    			const tinyslider14_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[1] & /*reachedEnd*/ 32768 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider14_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider14.$set(tinyslider14_changes);
    			const tinyslider15_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[1] & /*reachedEnd, shown*/ 49152 | dirty[2] & /*$$scope*/ 524288) {
    				tinyslider15_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider15.$set(tinyslider15_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tinyslider0.$$.fragment, local);
    			transition_in(tinyslider1.$$.fragment, local);
    			transition_in(tinyslider2.$$.fragment, local);
    			transition_in(tinyslider3.$$.fragment, local);
    			transition_in(tinyslider4.$$.fragment, local);
    			transition_in(tinyslider5.$$.fragment, local);
    			transition_in(tinyslider6.$$.fragment, local);
    			transition_in(tinyslider7.$$.fragment, local);
    			transition_in(tinyslider8.$$.fragment, local);
    			transition_in(tinyslider9.$$.fragment, local);
    			transition_in(tinyslider10.$$.fragment, local);
    			transition_in(tinyslider11.$$.fragment, local);
    			transition_in(tinyslider12.$$.fragment, local);
    			transition_in(tinyslider13.$$.fragment, local);
    			transition_in(tinyslider14.$$.fragment, local);
    			transition_in(tinyslider15.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tinyslider0.$$.fragment, local);
    			transition_out(tinyslider1.$$.fragment, local);
    			transition_out(tinyslider2.$$.fragment, local);
    			transition_out(tinyslider3.$$.fragment, local);
    			transition_out(tinyslider4.$$.fragment, local);
    			transition_out(tinyslider5.$$.fragment, local);
    			transition_out(tinyslider6.$$.fragment, local);
    			transition_out(tinyslider7.$$.fragment, local);
    			transition_out(tinyslider8.$$.fragment, local);
    			transition_out(tinyslider9.$$.fragment, local);
    			transition_out(tinyslider10.$$.fragment, local);
    			transition_out(tinyslider11.$$.fragment, local);
    			transition_out(tinyslider12.$$.fragment, local);
    			transition_out(tinyslider13.$$.fragment, local);
    			transition_out(tinyslider14.$$.fragment, local);
    			transition_out(tinyslider15.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(tinyslider0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div22);
    			destroy_component(tinyslider1);
    			destroy_component(tinyslider2);
    			destroy_component(tinyslider3);
    			destroy_component(tinyslider4);
    			destroy_component(tinyslider5);
    			destroy_component(tinyslider6);
    			destroy_component(tinyslider7);
    			destroy_component(tinyslider8);
    			destroy_component(tinyslider9);
    			destroy_component(tinyslider10);
    			destroy_component(tinyslider11);
    			destroy_component(tinyslider12);
    			destroy_component(tinyslider13);
    			destroy_component(tinyslider14);
    			if (detaching) detach_dev(t484);
    			if (detaching) detach_dev(div23);
    			destroy_component(tinyslider15);
    			if (detaching) detach_dev(t485);
    			if (detaching) detach_dev(div31);
    			mounted = false;
    			run_all(dispose);
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
    	const fixedItems = getItems("editorial", "508x350");
    	const fixedItems2 = getItems("food", "508x350");
    	const fixedItems3 = getItems("3d-render", "508x350");
    	const fixedItems4 = getItems("nature", "508x350");
    	const fixedItems5 = getItems("food-drink", "200x300");
    	const fixedItems6 = getItems("experimental", "508x350");
    	const fixedItems7 = getItems("fashion", "200x300", 20);
    	const fixedItems8 = getItems("nature", "200x300");
    	const headerItems = getItems("3d-render", "200x150", 30);
    	const cardItems = getItems("architecture", "320x180", 20);
    	let portaitItems = getItems("food-drink", "200x300");
    	let setIndex;
    	let currentIndex;
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
    	const click_handler_1 = (setIndex, currentIndex) => setIndex(currentIndex - 1);
    	const click_handler_2 = (setIndex, currentIndex) => setIndex(currentIndex + 1);
    	const click_handler_3 = (setIndex, i) => setIndex(i);
    	const click_handler_4 = (setIndex, i) => setIndex(i);
    	const focus_handler = (setIndex, i) => setIndex(i);

    	function tinyslider5_setIndex_binding(value) {
    		setIndex = value;
    		$$invalidate(3, setIndex);
    	}

    	function tinyslider5_currentIndex_binding(value) {
    		currentIndex = value;
    		$$invalidate(4, currentIndex);
    	}

    	const click_handler_5 = () => setIndex(2);
    	const click_handler_6 = () => setIndex(5);
    	const click_handler_7 = () => setIndex(9);
    	const click_handler_8 = (setIndex, currentIndex) => setIndex(currentIndex - 1);
    	const click_handler_9 = (setIndex, currentIndex) => setIndex(currentIndex + 1);
    	const click_handler_10 = (setIndex, currentIndex) => setIndex(currentIndex - 2);
    	const click_handler_11 = (setIndex, currentIndex) => setIndex(currentIndex + 2);
    	const click_handler_12 = (setIndex, currentIndex) => setIndex(currentIndex - 2);
    	const click_handler_13 = (setIndex, currentIndex) => setIndex(currentIndex + 2);

    	function tinyslider11_distanceToEnd_binding(value) {
    		distanceToEnd = value;
    		$$invalidate(1, distanceToEnd);
    	}

    	function tinyslider11_sliderWidth_binding(value) {
    		sliderWidth = value;
    		$$invalidate(2, sliderWidth);
    	}

    	const click_handler_14 = (setIndex, currentIndex) => setIndex(currentIndex - 1);
    	const click_handler_15 = (setIndex, currentIndex) => setIndex(currentIndex + 1);
    	const click_handler_16 = (setIndex, currentIndex) => setIndex(currentIndex - 1);
    	const click_handler_17 = (setIndex, currentIndex) => setIndex(currentIndex + 1);
    	const click_handler_18 = (setIndex, currentIndex) => setIndex(currentIndex - 1);
    	const click_handler_19 = (setIndex, currentIndex) => setIndex(currentIndex + 1);
    	const click_handler_20 = (setIndex, currentIndex) => setIndex(currentIndex - 2);
    	const click_handler_21 = (setIndex, currentIndex) => setIndex(currentIndex + 2);
    	const click_handler_22 = () => console.log('click');

    	$$self.$capture_state = () => ({
    		Arrow,
    		TinySlider,
    		items,
    		fixedItems,
    		fixedItems2,
    		fixedItems3,
    		fixedItems4,
    		fixedItems5,
    		fixedItems6,
    		fixedItems7,
    		fixedItems8,
    		headerItems,
    		cardItems,
    		portaitItems,
    		getItems,
    		setIndex,
    		currentIndex,
    		sliderWidth,
    		distanceToEnd
    	});

    	$$self.$inject_state = $$props => {
    		if ('portaitItems' in $$props) $$invalidate(0, portaitItems = $$props.portaitItems);
    		if ('setIndex' in $$props) $$invalidate(3, setIndex = $$props.setIndex);
    		if ('currentIndex' in $$props) $$invalidate(4, currentIndex = $$props.currentIndex);
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
    				...getItems("food-drink", "200x300", 10, portaitItems.length)
    			]);
    		}
    	};

    	return [
    		portaitItems,
    		distanceToEnd,
    		sliderWidth,
    		setIndex,
    		currentIndex,
    		items,
    		fixedItems,
    		fixedItems2,
    		fixedItems3,
    		fixedItems4,
    		fixedItems5,
    		fixedItems6,
    		fixedItems7,
    		headerItems,
    		cardItems,
    		click_handler,
    		func,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		focus_handler,
    		tinyslider5_setIndex_binding,
    		tinyslider5_currentIndex_binding,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		click_handler_13,
    		tinyslider11_distanceToEnd_binding,
    		tinyslider11_sliderWidth_binding,
    		click_handler_14,
    		click_handler_15,
    		click_handler_16,
    		click_handler_17,
    		click_handler_18,
    		click_handler_19,
    		click_handler_20,
    		click_handler_21,
    		click_handler_22
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1, -1]);

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
