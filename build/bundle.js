
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
    		if (!isCurrentSlider(event.target)) return;
    		event.preventDefault();
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
    	child_ctx[46] = list[i];
    	child_ctx[48] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[49] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[49] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[49] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	child_ctx[48] = i;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	child_ctx[48] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	child_ctx[59] = i;
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[49] = list[i];
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    function get_each_context_9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    function get_each_context_10(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    function get_each_context_12(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    function get_each_context_11(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	child_ctx[59] = i;
    	return child_ctx;
    }

    function get_each_context_14(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    function get_each_context_13(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[49] = list[i];
    	child_ctx[59] = i;
    	return child_ctx;
    }

    function get_each_context_15(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    function get_each_context_16(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    function get_each_context_17(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    // (42:2) {#each headerItems as item}
    function create_each_block_17(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "200");
    			attr_dev(img, "height", "150");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 42, 3, 1291);
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
    		source: "(42:2) {#each headerItems as item}",
    		ctx
    	});

    	return block;
    }

    // (41:1) <TinySlider>
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
    		source: "(41:1) <TinySlider>",
    		ctx
    	});

    	return block;
    }

    // (97:3) {#each fixedItems as item}
    function create_each_block_16(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 97, 4, 3223);
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
    		source: "(97:3) {#each fixedItems as item}",
    		ctx
    	});

    	return block;
    }

    // (96:2) <TinySlider>
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
    		source: "(96:2) <TinySlider>",
    		ctx
    	});

    	return block;
    }

    // (144:4) {#each fixedItems2 as item}
    function create_each_block_15(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 144, 5, 5393);
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
    		source: "(144:4) {#each fixedItems2 as item}",
    		ctx
    	});

    	return block;
    }

    // (143:3) <TinySlider let:setIndex let:currentIndex>
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
    		source: "(143:3) <TinySlider let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (149:5) {#if currentIndex > 0}
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
    			add_location(button, file, 149, 6, 5509);
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
    		source: "(149:5) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (153:5) {#if currentIndex < items.length - 1}
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
    			add_location(button, file, 153, 6, 5664);
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
    		source: "(153:5) {#if currentIndex < items.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (148:4) <svelte:fragment slot="controls">
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
    		source: "(148:4) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (182:4) {#each fixedItems4 as item}
    function create_each_block_14(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 182, 5, 6889);
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
    		source: "(182:4) {#each fixedItems4 as item}",
    		ctx
    	});

    	return block;
    }

    // (181:3) <TinySlider let:setIndex let:currentIndex>
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
    		source: "(181:3) <TinySlider let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (187:5) {#each fixedItems4 as _, i}
    function create_each_block_13(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[19](/*setIndex*/ ctx[3], /*i*/ ctx[59]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "dot svelte-lfm80c");
    			toggle_class(button, "active", /*i*/ ctx[59] == /*currentIndex*/ ctx[4]);
    			add_location(button, file, 187, 6, 7011);
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
    				toggle_class(button, "active", /*i*/ ctx[59] == /*currentIndex*/ ctx[4]);
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
    		source: "(187:5) {#each fixedItems4 as _, i}",
    		ctx
    	});

    	return block;
    }

    // (186:4) 
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
    			add_location(div, file, 185, 4, 6935);
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
    		source: "(186:4) ",
    		ctx
    	});

    	return block;
    }

    // (222:4) {#each fixedItems3 as item}
    function create_each_block_12(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 222, 5, 8490);
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
    		source: "(222:4) {#each fixedItems3 as item}",
    		ctx
    	});

    	return block;
    }

    // (221:3) <TinySlider let:setIndex let:currentIndex>
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
    		source: "(221:3) <TinySlider let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (227:5) {#each fixedItems3 as item, i}
    function create_each_block_11(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[20](/*setIndex*/ ctx[3], /*i*/ ctx[59]);
    	}

    	function focus_handler() {
    		return /*focus_handler*/ ctx[21](/*setIndex*/ ctx[3], /*i*/ ctx[59]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "height", "60");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 232, 7, 8784);
    			attr_dev(button, "class", "thumbnail svelte-lfm80c");
    			toggle_class(button, "active", /*i*/ ctx[59] == /*currentIndex*/ ctx[4]);
    			add_location(button, file, 227, 6, 8626);
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
    				toggle_class(button, "active", /*i*/ ctx[59] == /*currentIndex*/ ctx[4]);
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
    		source: "(227:5) {#each fixedItems3 as item, i}",
    		ctx
    	});

    	return block;
    }

    // (226:4) 
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
    			add_location(div, file, 225, 4, 8536);
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
    		source: "(226:4) ",
    		ctx
    	});

    	return block;
    }

    // (263:3) {#each fixedItems4 as item}
    function create_each_block_10(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 263, 4, 10143);
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
    		source: "(263:3) {#each fixedItems4 as item}",
    		ctx
    	});

    	return block;
    }

    // (262:2) <TinySlider bind:setIndex bind:currentIndex>
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
    		source: "(262:2) <TinySlider bind:setIndex bind:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (297:3) {#each fixedItems5 as item}
    function create_each_block_9(ctx) {
    	let img;
    	let img_src_value;
    	let img_width_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", img_width_value = /*sliderWidth*/ ctx[2] / 3);
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 297, 4, 11817);
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
    		source: "(297:3) {#each fixedItems5 as item}",
    		ctx
    	});

    	return block;
    }

    // (296:2) <TinySlider let:sliderWidth>
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
    		source: "(296:2) <TinySlider let:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (328:3) {#each fixedItems5 as item}
    function create_each_block_8(ctx) {
    	let img;
    	let img_src_value;
    	let img_width_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", img_width_value = (/*sliderWidth*/ ctx[2] - 20) / 3);
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 328, 4, 12746);
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
    		source: "(328:3) {#each fixedItems5 as item}",
    		ctx
    	});

    	return block;
    }

    // (327:2) <TinySlider gap="10px" let:sliderWidth>
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
    		source: "(327:2) <TinySlider gap=\\\"10px\\\" let:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (352:3) {#each { length: 20 } as _}
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
    			add_location(a, file, 353, 5, 13736);
    			attr_dev(div, "class", "item svelte-lfm80c");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 352, 4, 13666);
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
    		source: "(352:3) {#each { length: 20 } as _}",
    		ctx
    	});

    	return block;
    }

    // (351:2) <TinySlider gap="0.5rem">
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
    		source: "(351:2) <TinySlider gap=\\\"0.5rem\\\">",
    		ctx
    	});

    	return block;
    }

    // (391:6) {#if currentIndex + 1 >= i}
    function create_if_block_16(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 391, 7, 15257);
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
    		source: "(391:6) {#if currentIndex + 1 >= i}",
    		ctx
    	});

    	return block;
    }

    // (389:4) {#each fixedItems6 as item, i}
    function create_each_block_6(ctx) {
    	let div;
    	let t;
    	let style_width = `${/*sliderWidth*/ ctx[2]}px`;
    	let if_block = /*currentIndex*/ ctx[4] + 1 >= /*i*/ ctx[59] && create_if_block_16(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div, "class", "svelte-lfm80c");
    			set_style(div, "width", style_width, false);
    			add_location(div, file, 389, 5, 15178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*currentIndex*/ ctx[4] + 1 >= /*i*/ ctx[59]) {
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
    		source: "(389:4) {#each fixedItems6 as item, i}",
    		ctx
    	});

    	return block;
    }

    // (388:3) <TinySlider let:setIndex let:currentIndex let:sliderWidth let:reachedEnd>
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
    		source: "(388:3) <TinySlider let:setIndex let:currentIndex let:sliderWidth let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (398:5) {#if currentIndex > 0}
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
    			add_location(button, file, 398, 6, 15399);
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
    		source: "(398:5) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (402:5) {#if !reachedEnd}
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
    			add_location(button, file, 402, 6, 15534);
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
    		source: "(402:5) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (397:4) <svelte:fragment slot="controls">
    function create_controls_slot_6(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_15(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[45] && create_if_block_14(ctx);

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

    			if (!/*reachedEnd*/ ctx[45]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*reachedEnd*/ 16384) {
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
    		source: "(397:4) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (434:7) {#if shown.includes(index)}
    function create_if_block_13(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 434, 8, 17116);
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
    		source: "(434:7) {#if shown.includes(index)}",
    		ctx
    	});

    	return block;
    }

    // (432:5) {#each fixedItems7 as item, index}
    function create_each_block_5(ctx) {
    	let div;
    	let show_if = /*shown*/ ctx[44].includes(/*index*/ ctx[48]);
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
    			add_location(div, file, 432, 6, 17007);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*shown*/ 8192) show_if = /*shown*/ ctx[44].includes(/*index*/ ctx[48]);

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
    		source: "(432:5) {#each fixedItems7 as item, index}",
    		ctx
    	});

    	return block;
    }

    // (431:4) <TinySlider gap="0.5rem" let:setIndex let:currentIndex let:shown let:reachedEnd>
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
    			if (dirty[0] & /*fixedItems7*/ 4096 | dirty[1] & /*shown*/ 8192) {
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
    		source: "(431:4) <TinySlider gap=\\\"0.5rem\\\" let:setIndex let:currentIndex let:shown let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (441:6) {#if currentIndex > 0}
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
    			add_location(button, file, 441, 7, 17264);
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
    		source: "(441:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (445:6) {#if !reachedEnd}
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
    			add_location(button, file, 445, 7, 17402);
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
    		source: "(445:6) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (440:5) <svelte:fragment slot="controls">
    function create_controls_slot_5(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_12(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[45] && create_if_block_11(ctx);

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

    			if (!/*reachedEnd*/ ctx[45]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*reachedEnd*/ 16384) {
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
    		source: "(440:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (508:7) {#if shown.includes(index)}
    function create_if_block_10(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 508, 7, 19922);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*portaitItems*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) {
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
    		source: "(508:7) {#if shown.includes(index)}",
    		ctx
    	});

    	return block;
    }

    // (506:5) {#each portaitItems as item, index}
    function create_each_block_4(ctx) {
    	let div;
    	let show_if = /*shown*/ ctx[44].includes(/*index*/ ctx[48]);
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
    			add_location(div, file, 506, 6, 19814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*shown*/ 8192) show_if = /*shown*/ ctx[44].includes(/*index*/ ctx[48]);

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
    		source: "(506:5) {#each portaitItems as item, index}",
    		ctx
    	});

    	return block;
    }

    // (505:4) <TinySlider gap="0.5rem" let:setIndex let:currentIndex let:shown bind:distanceToEnd bind:sliderWidth>
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
    			if (dirty[0] & /*portaitItems*/ 1 | dirty[1] & /*shown*/ 8192) {
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
    		source: "(505:4) <TinySlider gap=\\\"0.5rem\\\" let:setIndex let:currentIndex let:shown bind:distanceToEnd bind:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (515:6) {#if currentIndex > 0}
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
    			add_location(button, file, 515, 7, 20070);
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
    		source: "(515:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (514:5) <svelte:fragment slot="controls">
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
    			add_location(button, file, 518, 6, 20182);
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
    		source: "(514:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (544:5) {#each { length: 10 } as _}
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
    			add_location(div, file, 544, 6, 20999);
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
    		source: "(544:5) {#each { length: 10 } as _}",
    		ctx
    	});

    	return block;
    }

    // (543:4) <TinySlider gap="0.5rem" fill={false} let:setIndex let:currentIndex>
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
    		source: "(543:4) <TinySlider gap=\\\"0.5rem\\\" fill={false} let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (549:6) {#if currentIndex > 0}
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
    			add_location(button, file, 549, 7, 21233);
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
    		source: "(549:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (553:6) {#if currentIndex < 9}
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
    			add_location(button, file, 553, 7, 21376);
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
    		source: "(553:6) {#if currentIndex < 9}",
    		ctx
    	});

    	return block;
    }

    // (548:5) <svelte:fragment slot="controls">
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
    		source: "(548:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (576:5) {#each { length: 10 } as _}
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
    			add_location(div, file, 576, 6, 22230);
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
    		source: "(576:5) {#each { length: 10 } as _}",
    		ctx
    	});

    	return block;
    }

    // (575:4) <TinySlider gap="0.5rem" transitionDuration="1000" let:setIndex let:currentIndex let:reachedEnd>
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
    		source: "(575:4) <TinySlider gap=\\\"0.5rem\\\" transitionDuration=\\\"1000\\\" let:setIndex let:currentIndex let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (581:6) {#if currentIndex > 0}
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
    			add_location(button, file, 581, 7, 22464);
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
    		source: "(581:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (585:6) {#if !reachedEnd}
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
    			add_location(button, file, 585, 7, 22602);
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
    		source: "(585:6) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (580:5) <svelte:fragment slot="controls">
    function create_controls_slot_2(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_6(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[45] && create_if_block_5(ctx);

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

    			if (!/*reachedEnd*/ ctx[45]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*reachedEnd*/ 16384) {
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
    		source: "(580:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (608:5) {#each { length: 10 } as _}
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
    			add_location(div, file, 608, 6, 23515);
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
    		source: "(608:5) {#each { length: 10 } as _}",
    		ctx
    	});

    	return block;
    }

    // (607:4) <TinySlider gap="0.5rem" threshold="100" let:setIndex let:currentIndex let:reachedEnd>
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
    		source: "(607:4) <TinySlider gap=\\\"0.5rem\\\" threshold=\\\"100\\\" let:setIndex let:currentIndex let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (613:6) {#if currentIndex > 0}
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
    			add_location(button, file, 613, 7, 23749);
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
    		source: "(613:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (617:6) {#if !reachedEnd}
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
    			add_location(button, file, 617, 7, 23887);
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
    		source: "(617:6) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (612:5) <svelte:fragment slot="controls">
    function create_controls_slot_1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_4(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[45] && create_if_block_3(ctx);

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

    			if (!/*reachedEnd*/ ctx[45]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*reachedEnd*/ 16384) {
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
    		source: "(612:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (632:5) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}
    function create_if_block_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[46])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-lfm80c");
    			add_location(img, file, 632, 6, 24439);
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
    		source: "(632:5) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}",
    		ctx
    	});

    	return block;
    }

    // (629:2) {#each cardItems as item, index}
    function create_each_block(ctx) {
    	let div;
    	let a0;
    	let show_if = [/*index*/ ctx[48], /*index*/ ctx[48] + 1, /*index*/ ctx[48] - 1].some(func);
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
    		return /*func*/ ctx[16](/*shown*/ ctx[44], ...args);
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
    			add_location(a0, file, 630, 4, 24297);
    			attr_dev(a1, "class", "title svelte-lfm80c");
    			attr_dev(a1, "href", "https://google.com");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file, 636, 4, 24509);
    			attr_dev(p, "class", "svelte-lfm80c");
    			add_location(p, file, 638, 4, 24595);
    			attr_dev(a2, "class", "button svelte-lfm80c");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file, 642, 4, 24685);
    			attr_dev(div, "class", "card svelte-lfm80c");
    			add_location(div, file, 629, 3, 24235);
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
    			if (dirty[1] & /*shown*/ 8192) show_if = [/*index*/ ctx[48], /*index*/ ctx[48] + 1, /*index*/ ctx[48] - 1].some(func);

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
    		source: "(629:2) {#each cardItems as item, index}",
    		ctx
    	});

    	return block;
    }

    // (628:1) <TinySlider gap="1rem" let:setIndex let:currentIndex let:shown let:reachedEnd>
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
    			if (dirty[0] & /*cardItems*/ 16384 | dirty[1] & /*shown*/ 8192) {
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
    		source: "(628:1) <TinySlider gap=\\\"1rem\\\" let:setIndex let:currentIndex let:shown let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (648:3) {#if currentIndex > 0}
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
    			add_location(button, file, 648, 4, 24848);
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
    		source: "(648:3) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (652:3) {#if !reachedEnd}
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
    			add_location(button, file, 652, 4, 24977);
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
    		source: "(652:3) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (647:2) <svelte:fragment slot="controls">
    function create_controls_slot(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[4] > 0 && create_if_block_1(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[45] && create_if_block(ctx);

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

    			if (!/*reachedEnd*/ ctx[45]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*reachedEnd*/ 16384) {
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
    		source: "(647:2) <svelte:fragment slot=\\\"controls\\\">",
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
    	let t6;
    	let a0;
    	let t8;
    	let t9;
    	let p2;
    	let a1;
    	let t11;
    	let h20;
    	let t13;
    	let p3;
    	let t15;
    	let code0;
    	let t16;
    	let mark1;
    	let t18;
    	let code1;
    	let t19;
    	let mark2;
    	let t21;
    	let p4;
    	let t23;
    	let code2;
    	let t24;
    	let mark3;
    	let t26;
    	let mark4;
    	let t28;
    	let t29;
    	let code3;
    	let t30;
    	let mark5;
    	let t32;
    	let mark6;
    	let t34;
    	let t35;
    	let h21;
    	let t37;
    	let div1;
    	let p5;
    	let t39;
    	let p6;
    	let code4;
    	let t40;
    	let mark7;
    	let t42;
    	let br0;
    	let t43;
    	let br1;
    	let t44;
    	let br2;
    	let t45;
    	let br3;
    	let t46;
    	let mark8;
    	let t48;
    	let t49;
    	let tinyslider1;
    	let t50;
    	let div5;
    	let h30;
    	let t52;
    	let p7;
    	let h40;
    	let t55;
    	let p8;
    	let t56;
    	let code5;
    	let t57;
    	let mark9;
    	let t59;
    	let t60;
    	let t61;
    	let ul;
    	let li0;
    	let mark10;
    	let t63;
    	let t64;
    	let li1;
    	let mark11;
    	let t66;
    	let t67;
    	let p9;
    	let t68;
    	let code6;
    	let t70;
    	let t71;
    	let p10;
    	let code7;
    	let t72;
    	let mark12;
    	let t74;
    	let mark13;
    	let t76;
    	let mark14;
    	let t78;
    	let br4;
    	let t79;
    	let br5;
    	let t80;
    	let br6;
    	let t81;
    	let br7;
    	let t82;
    	let br8;
    	let t83;
    	let mark15;
    	let t85;
    	let br9;
    	let t86;
    	let mark16;
    	let t88;
    	let br10;
    	let t89;
    	let mark17;
    	let t91;
    	let mark18;
    	let t93;
    	let br11;
    	let t94;
    	let br12;
    	let t95;
    	let br13;
    	let t96;
    	let mark19;
    	let t98;
    	let br14;
    	let t99;
    	let mark20;
    	let t101;
    	let mark21;
    	let t103;
    	let br15;
    	let t104;
    	let br16;
    	let t105;
    	let br17;
    	let t106;
    	let mark22;
    	let t108;
    	let t109;
    	let div2;
    	let tinyslider2;
    	let t110;
    	let p11;
    	let t112;
    	let p12;
    	let code8;
    	let t113;
    	let mark23;
    	let t115;
    	let mark24;
    	let t117;
    	let mark25;
    	let t119;
    	let br18;
    	let t120;
    	let br19;
    	let t121;
    	let br20;
    	let t122;
    	let br21;
    	let t123;
    	let br22;
    	let t124;
    	let br23;
    	let t125;
    	let br24;
    	let t126;
    	let br25;
    	let t127;
    	let mark26;
    	let t129;
    	let br26;
    	let t130;
    	let mark27;
    	let t132;
    	let br27;
    	let t133;
    	let br28;
    	let t134;
    	let br29;
    	let t135;
    	let mark28;
    	let t137;
    	let t138;
    	let div3;
    	let tinyslider3;
    	let t139;
    	let p13;
    	let t141;
    	let p14;
    	let code9;
    	let t142;
    	let mark29;
    	let t144;
    	let mark30;
    	let t146;
    	let mark31;
    	let t148;
    	let br30;
    	let t149;
    	let br31;
    	let t150;
    	let br32;
    	let t151;
    	let br33;
    	let t152;
    	let br34;
    	let t153;
    	let br35;
    	let t154;
    	let br36;
    	let t155;
    	let br37;
    	let t156;
    	let mark32;
    	let t158;
    	let br38;
    	let t159;
    	let mark33;
    	let t161;
    	let br39;
    	let t162;
    	let mark34;
    	let t164;
    	let br40;
    	let t165;
    	let br41;
    	let t166;
    	let br42;
    	let t167;
    	let br43;
    	let t168;
    	let br44;
    	let t169;
    	let mark35;
    	let t171;
    	let t172;
    	let div4;
    	let tinyslider4;
    	let t173;
    	let h41;
    	let t175;
    	let p15;
    	let t176;
    	let code10;
    	let t178;
    	let code11;
    	let t180;
    	let code12;
    	let t182;
    	let t183;
    	let p16;
    	let code13;
    	let t184;
    	let br45;
    	let t185;
    	let mark36;
    	let br46;
    	let t187;
    	let br47;
    	let t188;
    	let br48;
    	let t189;
    	let mark37;
    	let t191;
    	let mark38;
    	let t193;
    	let mark39;
    	let t195;
    	let br49;
    	let t196;
    	let br50;
    	let t197;
    	let br51;
    	let t198;
    	let br52;
    	let t199;
    	let mark40;
    	let t201;
    	let br53;
    	let t202;
    	let br54;
    	let t203;
    	let mark41;
    	let t205;
    	let br55;
    	let t206;
    	let mark42;
    	let t208;
    	let br56;
    	let t209;
    	let mark43;
    	let t211;
    	let br57;
    	let t212;
    	let tinyslider5;
    	let updating_setIndex;
    	let updating_currentIndex;
    	let t213;
    	let p17;
    	let t214;
    	let code14;
    	let t216;
    	let t217;
    	let button0;
    	let t219;
    	let button1;
    	let t221;
    	let button2;
    	let t223;
    	let div6;
    	let h31;
    	let t225;
    	let p18;
    	let t227;
    	let h42;
    	let t229;
    	let p19;
    	let t230;
    	let code15;
    	let t232;
    	let code16;
    	let t234;
    	let t235;
    	let p20;
    	let code17;
    	let t236;
    	let mark44;
    	let t238;
    	let mark45;
    	let t240;
    	let br58;
    	let t241;
    	let br59;
    	let t242;
    	let mark46;
    	let t244;
    	let br60;
    	let t245;
    	let br61;
    	let t246;
    	let mark47;
    	let t248;
    	let t249;
    	let tinyslider6;
    	let t250;
    	let h43;
    	let t252;
    	let p21;
    	let t253;
    	let code18;
    	let t255;
    	let t256;
    	let code19;
    	let t257;
    	let br62;
    	let t258;
    	let br63;
    	let t259;
    	let t260;
    	let p22;
    	let t261;
    	let code20;
    	let t263;
    	let t264;
    	let p23;
    	let code21;
    	let t265;
    	let mark48;
    	let t267;
    	let mark49;
    	let t269;
    	let br64;
    	let t270;
    	let br65;
    	let t271;
    	let br66;
    	let t272;
    	let br67;
    	let t273;
    	let mark50;
    	let t275;
    	let t276;
    	let tinyslider7;
    	let t277;
    	let div7;
    	let h32;
    	let t279;
    	let p24;
    	let t281;
    	let p25;
    	let code22;
    	let t282;
    	let mark51;
    	let t284;
    	let br68;
    	let t285;
    	let br69;
    	let t286;
    	let br70;
    	let t287;
    	let br71;
    	let t288;
    	let br72;
    	let t289;
    	let br73;
    	let t290;
    	let mark52;
    	let t292;
    	let t293;
    	let tinyslider8;
    	let t294;
    	let div11;
    	let h33;
    	let t296;
    	let p26;
    	let t297;
    	let code23;
    	let t299;
    	let t300;
    	let p27;
    	let t301;
    	let code24;
    	let t303;
    	let p28;
    	let code25;
    	let t304;
    	let mark53;
    	let t306;
    	let mark54;
    	let t308;
    	let br74;
    	let t309;
    	let br75;
    	let t310;
    	let br76;
    	let t311;
    	let mark55;
    	let t313;
    	let br77;
    	let t314;
    	let br78;
    	let t315;
    	let br79;
    	let t316;
    	let br80;
    	let t317;
    	let br81;
    	let t318;
    	let br82;
    	let t319;
    	let br83;
    	let t320;
    	let mark56;
    	let t322;
    	let br84;
    	let t323;
    	let p29;
    	let t325;
    	let div8;
    	let tinyslider9;
    	let t326;
    	let p30;
    	let t327;
    	let mark57;
    	let t329;
    	let mark58;
    	let t331;
    	let mark59;
    	let t333;
    	let mark60;
    	let t335;
    	let t336;
    	let p31;
    	let code26;
    	let t337;
    	let mark61;
    	let t339;
    	let mark62;
    	let t341;
    	let br85;
    	let t342;
    	let br86;
    	let t343;
    	let br87;
    	let t344;
    	let mark63;
    	let t346;
    	let br88;
    	let t347;
    	let br89;
    	let t348;
    	let br90;
    	let t349;
    	let br91;
    	let t350;
    	let br92;
    	let t351;
    	let br93;
    	let t352;
    	let br94;
    	let t353;
    	let mark64;
    	let t355;
    	let t356;
    	let div10;
    	let div9;
    	let tinyslider10;
    	let t357;
    	let div14;
    	let h34;
    	let t359;
    	let p32;
    	let t361;
    	let h44;
    	let t363;
    	let p33;
    	let t364;
    	let mark65;
    	let t366;
    	let t367;
    	let p34;
    	let code27;
    	let t368;
    	let mark66;
    	let t370;
    	let mark67;
    	let t372;
    	let br95;
    	let t373;
    	let br96;
    	let t374;
    	let mark68;
    	let t376;
    	let t377;
    	let h45;
    	let t379;
    	let p35;
    	let t380;
    	let mark69;
    	let t382;
    	let mark70;
    	let t384;
    	let mark71;
    	let t386;
    	let mark72;
    	let t388;
    	let t389;
    	let p36;
    	let code28;
    	let t390;
    	let br97;
    	let t391;
    	let mark73;
    	let t393;
    	let br98;
    	let t394;
    	let mark74;
    	let t396;
    	let br99;
    	let t397;
    	let br100;
    	let t398;
    	let br101;
    	let t399;
    	let mark75;
    	let t401;
    	let mark76;
    	let t403;
    	let br102;
    	let t404;
    	let br103;
    	let t405;
    	let mark77;
    	let t407;
    	let t408;
    	let p37;
    	let t409;
    	let mark78;
    	let t411;
    	let mark79;
    	let t413;
    	let mark80;
    	let t415;
    	let t416;
    	let p38;
    	let code29;
    	let t417;
    	let br104;
    	let t418;
    	let mark81;
    	let br105;
    	let t420;
    	let mark82;
    	let t422;
    	let br106;
    	let t423;
    	let br107;
    	let t424;
    	let br108;
    	let t425;
    	let mark83;
    	let t427;
    	let mark84;
    	let t429;
    	let br109;
    	let t430;
    	let br110;
    	let t431;
    	let mark85;
    	let t433;
    	let t434;
    	let div13;
    	let div12;
    	let tinyslider11;
    	let updating_distanceToEnd;
    	let updating_sliderWidth;
    	let t435;
    	let div21;
    	let h35;
    	let t437;
    	let h46;
    	let t439;
    	let p39;
    	let t440;
    	let mark86;
    	let t442;
    	let t443;
    	let p40;
    	let code30;
    	let t444;
    	let mark87;
    	let t446;
    	let mark88;
    	let t448;
    	let br111;
    	let t449;
    	let br112;
    	let t450;
    	let mark89;
    	let t452;
    	let t453;
    	let div16;
    	let div15;
    	let tinyslider12;
    	let t454;
    	let h47;
    	let t456;
    	let p41;
    	let t457;
    	let mark90;
    	let t459;
    	let t460;
    	let p42;
    	let code31;
    	let t461;
    	let mark91;
    	let t463;
    	let mark92;
    	let t465;
    	let br113;
    	let t466;
    	let br114;
    	let t467;
    	let mark93;
    	let t469;
    	let t470;
    	let div18;
    	let div17;
    	let tinyslider13;
    	let t471;
    	let h48;
    	let t473;
    	let p43;
    	let t474;
    	let mark94;
    	let t476;
    	let t477;
    	let p44;
    	let code32;
    	let t478;
    	let mark95;
    	let t480;
    	let mark96;
    	let t482;
    	let br115;
    	let t483;
    	let br116;
    	let t484;
    	let mark97;
    	let t486;
    	let t487;
    	let div20;
    	let div19;
    	let tinyslider14;
    	let t488;
    	let div23;
    	let tinyslider15;
    	let t489;
    	let div31;
    	let h22;
    	let t491;
    	let div25;
    	let p45;
    	let t493;
    	let div24;
    	let strong0;
    	let t495;
    	let strong1;
    	let t497;
    	let strong2;
    	let t499;
    	let code33;
    	let t501;
    	let code34;
    	let t503;
    	let strong3;
    	let t505;
    	let code35;
    	let t507;
    	let code36;
    	let t509;
    	let strong4;
    	let t511;
    	let code37;
    	let t513;
    	let code38;
    	let t515;
    	let strong5;
    	let t517;
    	let code39;
    	let t519;
    	let code40;
    	let t521;
    	let strong6;
    	let t523;
    	let code41;
    	let t525;
    	let code42;
    	let t527;
    	let strong7;
    	let t529;
    	let code43;
    	let t531;
    	let code44;
    	let t533;
    	let strong8;
    	let t535;
    	let code45;
    	let t537;
    	let code46;
    	let t539;
    	let strong9;
    	let t541;
    	let code47;
    	let t543;
    	let code48;
    	let t545;
    	let strong10;
    	let t547;
    	let code49;
    	let t549;
    	let code50;
    	let t551;
    	let strong11;
    	let t553;
    	let code51;
    	let t555;
    	let code52;
    	let t557;
    	let strong12;
    	let t559;
    	let code53;
    	let t561;
    	let code54;
    	let t563;
    	let strong13;
    	let t565;
    	let h23;
    	let t567;
    	let div27;
    	let p46;
    	let t569;
    	let div26;
    	let strong14;
    	let t571;
    	let strong15;
    	let t573;
    	let strong16;
    	let t575;
    	let code55;
    	let t577;
    	let code56;
    	let t579;
    	let strong17;
    	let t581;
    	let h24;
    	let t583;
    	let div29;
    	let p47;
    	let t585;
    	let div28;
    	let strong18;
    	let t587;
    	let strong19;
    	let t588;
    	let strong20;
    	let t590;
    	let code57;
    	let t592;
    	let code58;
    	let t593;
    	let strong21;
    	let t595;
    	let div30;
    	let t596;
    	let a2;
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
    							45: reachedEnd
    						}),
    						({ setIndex, currentIndex, sliderWidth, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0) | (sliderWidth ? 4 : 0),
    							reachedEnd ? 16384 : 0
    						]
    					],
    					default: [
    						create_default_slot_6,
    						({ setIndex, currentIndex, sliderWidth, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							2: sliderWidth,
    							45: reachedEnd
    						}),
    						({ setIndex, currentIndex, sliderWidth, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0) | (sliderWidth ? 4 : 0),
    							reachedEnd ? 16384 : 0
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
    							44: shown,
    							45: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0),
    							(shown ? 8192 : 0) | (reachedEnd ? 16384 : 0)
    						]
    					],
    					default: [
    						create_default_slot_5,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							44: shown,
    							45: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0),
    							(shown ? 8192 : 0) | (reachedEnd ? 16384 : 0)
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
    				({ setIndex, currentIndex, shown }) => ({ 3: setIndex, 4: currentIndex, 44: shown }),
    				({ setIndex, currentIndex, shown }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), shown ? 8192 : 0]
    			],
    			default: [
    				create_default_slot_4,
    				({ setIndex, currentIndex, shown }) => ({ 3: setIndex, 4: currentIndex, 44: shown }),
    				({ setIndex, currentIndex, shown }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), shown ? 8192 : 0]
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
    							45: reachedEnd
    						}),
    						({ setIndex, currentIndex, reachedEnd }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), reachedEnd ? 16384 : 0]
    					],
    					default: [
    						create_default_slot_2,
    						({ setIndex, currentIndex, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							45: reachedEnd
    						}),
    						({ setIndex, currentIndex, reachedEnd }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), reachedEnd ? 16384 : 0]
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
    							45: reachedEnd
    						}),
    						({ setIndex, currentIndex, reachedEnd }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), reachedEnd ? 16384 : 0]
    					],
    					default: [
    						create_default_slot_1,
    						({ setIndex, currentIndex, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							45: reachedEnd
    						}),
    						({ setIndex, currentIndex, reachedEnd }) => [(setIndex ? 8 : 0) | (currentIndex ? 16 : 0), reachedEnd ? 16384 : 0]
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
    							44: shown,
    							45: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0),
    							(shown ? 8192 : 0) | (reachedEnd ? 16384 : 0)
    						]
    					],
    					default: [
    						create_default_slot,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							3: setIndex,
    							4: currentIndex,
    							44: shown,
    							45: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 8 : 0) | (currentIndex ? 16 : 0),
    							(shown ? 8192 : 0) | (reachedEnd ? 16384 : 0)
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
    			t6 = text("The package is less than 250 bytes gzipped (");
    			a0 = element("a");
    			a0.textContent = "Bundlephobia";
    			t8 = text(") and has no dependencies.");
    			t9 = space();
    			p2 = element("p");
    			a1 = element("a");
    			a1.textContent = "GitHub";
    			t11 = space();
    			h20 = element("h2");
    			h20.textContent = "Installation";
    			t13 = space();
    			p3 = element("p");
    			p3.textContent = "Install using Yarn or NPM.";
    			t15 = space();
    			code0 = element("code");
    			t16 = text("yarn add ");
    			mark1 = element("mark");
    			mark1.textContent = "svelte-tiny-slider";
    			t18 = space();
    			code1 = element("code");
    			t19 = text("npm install --save ");
    			mark2 = element("mark");
    			mark2.textContent = "svelte-tiny-slider";
    			t21 = space();
    			p4 = element("p");
    			p4.textContent = "Include the slider in your app.";
    			t23 = space();
    			code2 = element("code");
    			t24 = text("import { ");
    			mark3 = element("mark");
    			mark3.textContent = "TinySlider";
    			t26 = text(" } from \"");
    			mark4 = element("mark");
    			mark4.textContent = "svelte-tiny-slider";
    			t28 = text("\"");
    			t29 = space();
    			code3 = element("code");
    			t30 = text("<");
    			mark5 = element("mark");
    			mark5.textContent = "TinySlider";
    			t32 = text(">\r\n\t\t\t\t...\r\n\t\t\t</");
    			mark6 = element("mark");
    			mark6.textContent = "TinySlider";
    			t34 = text(">");
    			t35 = space();
    			h21 = element("h2");
    			h21.textContent = "Usage";
    			t37 = space();
    			div1 = element("div");
    			p5 = element("p");
    			p5.textContent = "In it's most basic state the slider is just a horizontal carousel that can only be controlled through dragging the image either with your mouse or with touch controls. The carousel items can be whatever you want them to be, in this case we're using images.";
    			t39 = space();
    			p6 = element("p");
    			code4 = element("code");
    			t40 = text("<");
    			mark7 = element("mark");
    			mark7.textContent = "TinySlider";
    			t42 = text("> ");
    			br0 = element("br");
    			t43 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br1 = element("br");
    			t44 = text("\r\n\t\t\t\t    <img src={item} alt=\"\" /> ");
    			br2 = element("br");
    			t45 = text("\r\n\t\t\t\t  {/each} ");
    			br3 = element("br");
    			t46 = text("\r\n\t\t\t\t</");
    			mark8 = element("mark");
    			mark8.textContent = "TinySlider";
    			t48 = text(">");
    			t49 = space();
    			create_component(tinyslider1.$$.fragment);
    			t50 = space();
    			div5 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Controls";
    			t52 = space();
    			p7 = element("p");
    			p7.textContent = "From this point there are several options to add any kind of controls you can think of. There two ways you can add controls. Either via slot props or via exported props using two way binds.\r\n\r\n\t\t";
    			h40 = element("h4");
    			h40.textContent = "Controls via slot props";
    			t55 = space();
    			p8 = element("p");
    			t56 = text("The easiest way is to use ");
    			code5 = element("code");
    			t57 = text("slot=\"");
    			mark9 = element("mark");
    			mark9.textContent = "controls";
    			t59 = text("\"");
    			t60 = text(" and use it's slot props. There are several available props, but for controls the most relevant are:");
    			t61 = space();
    			ul = element("ul");
    			li0 = element("li");
    			mark10 = element("mark");
    			mark10.textContent = "setIndex";
    			t63 = text(" is a function that accepts an index of the slide you want to navigate to.");
    			t64 = space();
    			li1 = element("li");
    			mark11 = element("mark");
    			mark11.textContent = "currentIndex";
    			t66 = text(" is an integer of the index you are current only on.");
    			t67 = space();
    			p9 = element("p");
    			t68 = text("In this example we are using ");
    			code6 = element("code");
    			code6.textContent = "svelte:fragment";
    			t70 = text(" but it could be any element you want it to be. Styling isn't included in this code example.");
    			t71 = space();
    			p10 = element("p");
    			code7 = element("code");
    			t72 = text("<");
    			mark12 = element("mark");
    			mark12.textContent = "TinySlider";
    			t74 = text(" let:");
    			mark13 = element("mark");
    			mark13.textContent = "setIndex";
    			t76 = text(" let:");
    			mark14 = element("mark");
    			mark14.textContent = "currentIndex";
    			t78 = text("> ");
    			br4 = element("br");
    			t79 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br5 = element("br");
    			t80 = text("\r\n\t\t\t\t    <img src={item} alt=\"\" /> ");
    			br6 = element("br");
    			t81 = text("\r\n\t\t\t\t  {/each} ");
    			br7 = element("br");
    			t82 = space();
    			br8 = element("br");
    			t83 = text("\r\n\t\t\t\t  <svelte:fragment slot=\"");
    			mark15 = element("mark");
    			mark15.textContent = "controls";
    			t85 = text("\"> ");
    			br9 = element("br");
    			t86 = text("\r\n\t\t\t\t    {#if ");
    			mark16 = element("mark");
    			mark16.textContent = "currentIndex";
    			t88 = text(" > 0} ");
    			br10 = element("br");
    			t89 = text("\r\n\t\t\t\t      <button on:click={() => ");
    			mark17 = element("mark");
    			mark17.textContent = "setIndex";
    			t91 = text("(");
    			mark18 = element("mark");
    			mark18.textContent = "currentIndex";
    			t93 = text(" - 1)}>...</button> ");
    			br11 = element("br");
    			t94 = text("\r\n\t\t\t\t    {/if} ");
    			br12 = element("br");
    			t95 = space();
    			br13 = element("br");
    			t96 = text("\r\n\t\t\t\t    {#if ");
    			mark19 = element("mark");
    			mark19.textContent = "currentIndex";
    			t98 = text(" < items.length - 1} ");
    			br14 = element("br");
    			t99 = text("\r\n\t\t\t\t      <button on:click={() => ");
    			mark20 = element("mark");
    			mark20.textContent = "setIndex";
    			t101 = text("(");
    			mark21 = element("mark");
    			mark21.textContent = "currentIndex";
    			t103 = text(" + 1)}>...</button> ");
    			br15 = element("br");
    			t104 = text("\r\n\t\t\t\t    {/if} ");
    			br16 = element("br");
    			t105 = text("\r\n\t\t\t\t  </svelte:fragment> ");
    			br17 = element("br");
    			t106 = text("\r\n\t\t\t\t</");
    			mark22 = element("mark");
    			mark22.textContent = "TinySlider";
    			t108 = text(">");
    			t109 = space();
    			div2 = element("div");
    			create_component(tinyslider2.$$.fragment);
    			t110 = space();
    			p11 = element("p");
    			p11.textContent = "We could use the same props to implement some type of dots navigation.";
    			t112 = space();
    			p12 = element("p");
    			code8 = element("code");
    			t113 = text("<");
    			mark23 = element("mark");
    			mark23.textContent = "TinySlider";
    			t115 = text(" let:");
    			mark24 = element("mark");
    			mark24.textContent = "setIndex";
    			t117 = text(" let:");
    			mark25 = element("mark");
    			mark25.textContent = "currentIndex";
    			t119 = text("> ");
    			br18 = element("br");
    			t120 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br19 = element("br");
    			t121 = text("\r\n\t\t\t\t    <img src={item} alt=\"\" /> ");
    			br20 = element("br");
    			t122 = text("\r\n\t\t\t\t  {/each} ");
    			br21 = element("br");
    			t123 = space();
    			br22 = element("br");
    			t124 = text("\r\n\t\t\t\t  <div slot=\"controls\">");
    			br23 = element("br");
    			t125 = text("\r\n\t\t\t\t    {#each items as _, i}");
    			br24 = element("br");
    			t126 = text("\r\n\t\t\t\t      <button");
    			br25 = element("br");
    			t127 = text("\r\n\t\t\t\t        class:active={i == ");
    			mark26 = element("mark");
    			mark26.textContent = "currentIndex";
    			t129 = text("}");
    			br26 = element("br");
    			t130 = text("\r\n\t\t\t\t        on:click={() => ");
    			mark27 = element("mark");
    			mark27.textContent = "setIndex";
    			t132 = text("(i)} />");
    			br27 = element("br");
    			t133 = text("\r\n\t\t\t\t    {/each}");
    			br28 = element("br");
    			t134 = text("\r\n\t\t\t\t  </div>");
    			br29 = element("br");
    			t135 = text("\r\n\t\t\t\t</");
    			mark28 = element("mark");
    			mark28.textContent = "TinySlider";
    			t137 = text(">");
    			t138 = space();
    			div3 = element("div");
    			create_component(tinyslider3.$$.fragment);
    			t139 = space();
    			p13 = element("p");
    			p13.textContent = "In a similar way we can also add thumbnail navigation.";
    			t141 = space();
    			p14 = element("p");
    			code9 = element("code");
    			t142 = text("<");
    			mark29 = element("mark");
    			mark29.textContent = "TinySlider";
    			t144 = text(" let:");
    			mark30 = element("mark");
    			mark30.textContent = "setIndex";
    			t146 = text(" let:");
    			mark31 = element("mark");
    			mark31.textContent = "currentIndex";
    			t148 = text("> ");
    			br30 = element("br");
    			t149 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br31 = element("br");
    			t150 = text("\r\n\t\t\t\t    <img src={item} alt=\"\" /> ");
    			br32 = element("br");
    			t151 = text("\r\n\t\t\t\t  {/each} ");
    			br33 = element("br");
    			t152 = space();
    			br34 = element("br");
    			t153 = text("\r\n\t\t\t\t  <div slot=\"controls\">");
    			br35 = element("br");
    			t154 = text("\r\n\t\t\t\t    {#each items as _, i}");
    			br36 = element("br");
    			t155 = text("\r\n\t\t\t\t      <button");
    			br37 = element("br");
    			t156 = text("\r\n\t\t\t\t        class:active={i == ");
    			mark32 = element("mark");
    			mark32.textContent = "currentIndex";
    			t158 = text("}");
    			br38 = element("br");
    			t159 = text("\r\n\t\t\t\t        on:click={() => ");
    			mark33 = element("mark");
    			mark33.textContent = "setIndex";
    			t161 = text("(i)}");
    			br39 = element("br");
    			t162 = text("\r\n\t\t\t\t        on:focus={() => ");
    			mark34 = element("mark");
    			mark34.textContent = "setIndex";
    			t164 = text("(i)}>");
    			br40 = element("br");
    			t165 = text("\r\n\t\t\t\t        <img src={item} alt=\"\" height=60 />");
    			br41 = element("br");
    			t166 = text("\r\n\t\t\t\t      </button>");
    			br42 = element("br");
    			t167 = text("\r\n\t\t\t\t    {/each}");
    			br43 = element("br");
    			t168 = text("\r\n\t\t\t\t  </div>");
    			br44 = element("br");
    			t169 = text("\r\n\t\t\t\t</");
    			mark35 = element("mark");
    			mark35.textContent = "TinySlider";
    			t171 = text(">");
    			t172 = space();
    			div4 = element("div");
    			create_component(tinyslider4.$$.fragment);
    			t173 = space();
    			h41 = element("h4");
    			h41.textContent = "Controls via exported props";
    			t175 = space();
    			p15 = element("p");
    			t176 = text("You don't have to control the component from a slot, you can control it from anywhere using two way binds. Declare any variable you want and bind them using ");
    			code10 = element("code");
    			code10.textContent = "bind";
    			t178 = text(" instead of ");
    			code11 = element("code");
    			code11.textContent = "let";
    			t180 = text(". The variable ");
    			code12 = element("code");
    			code12.textContent = "currentIndex";
    			t182 = text(" can not be directly modified, it should only be used as a reference.");
    			t183 = space();
    			p16 = element("p");
    			code13 = element("code");
    			t184 = text("<script>");
    			br45 = element("br");
    			t185 = text("\r\n\t\t\t\t  let ");
    			mark36 = element("mark");
    			mark36.textContent = "setIndex";
    			br46 = element("br");
    			t187 = text("\r\n\t\t\t\t</script>");
    			br47 = element("br");
    			t188 = space();
    			br48 = element("br");
    			t189 = text("\r\n\t\t\t\t<");
    			mark37 = element("mark");
    			mark37.textContent = "TinySlider";
    			t191 = space();
    			mark38 = element("mark");
    			mark38.textContent = "bind";
    			t193 = text(":");
    			mark39 = element("mark");
    			mark39.textContent = "setIndex";
    			t195 = text("> ");
    			br49 = element("br");
    			t196 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br50 = element("br");
    			t197 = text("\r\n\t\t\t\t    <img src={item} alt=\"\" /> ");
    			br51 = element("br");
    			t198 = text("\r\n\t\t\t\t  {/each} ");
    			br52 = element("br");
    			t199 = text("\r\n\t\t\t\t</");
    			mark40 = element("mark");
    			mark40.textContent = "TinySlider";
    			t201 = text(">");
    			br53 = element("br");
    			t202 = space();
    			br54 = element("br");
    			t203 = text("\r\n\t\t\t\t<button on:click={() => ");
    			mark41 = element("mark");
    			mark41.textContent = "setIndex";
    			t205 = text("(2)}>...</button>");
    			br55 = element("br");
    			t206 = text("\r\n\t\t\t\t<button on:click={() => ");
    			mark42 = element("mark");
    			mark42.textContent = "setIndex";
    			t208 = text("(5)}>...</button>");
    			br56 = element("br");
    			t209 = text("\r\n\t\t\t\t<button on:click={() => ");
    			mark43 = element("mark");
    			mark43.textContent = "setIndex";
    			t211 = text("(9)}>...</button>");
    			br57 = element("br");
    			t212 = space();
    			create_component(tinyslider5.$$.fragment);
    			t213 = space();
    			p17 = element("p");
    			t214 = text("These buttons are not in a ");
    			code14 = element("code");
    			code14.textContent = "slot";
    			t216 = text(" and could be placed anywhere on your page.");
    			t217 = space();
    			button0 = element("button");
    			button0.textContent = "Set index to 2";
    			t219 = space();
    			button1 = element("button");
    			button1.textContent = "Set index to 5";
    			t221 = space();
    			button2 = element("button");
    			button2.textContent = "Set index to 9";
    			t223 = space();
    			div6 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Styling";
    			t225 = space();
    			p18 = element("p");
    			p18.textContent = "There is very little css set by default, you're expected to bring your own. But to help you out there's a handful of props that might be of use. You don't need to use any of these, you could do it all with regular css, which we will also go over.";
    			t227 = space();
    			h42 = element("h4");
    			h42.textContent = "Size";
    			t229 = space();
    			p19 = element("p");
    			t230 = text("So far we've only been using one slide at a time. The number of sliders shown is not controlled by a prop, instead you can do it via css. To help you out there's the slot prop ");
    			code15 = element("code");
    			code15.textContent = "sliderWidth";
    			t232 = text(". This is simply the document width of the slider element. Setting the width of your items to ");
    			code16 = element("code");
    			code16.textContent = "sliderWidth / 3";
    			t234 = text(" would cause 3 items to show at once. Once again this could be done with a slot prop or a two way bind, which ever you prefer.");
    			t235 = space();
    			p20 = element("p");
    			code17 = element("code");
    			t236 = text("<");
    			mark44 = element("mark");
    			mark44.textContent = "TinySlider";
    			t238 = text(" let:");
    			mark45 = element("mark");
    			mark45.textContent = "sliderWidth";
    			t240 = text(">");
    			br58 = element("br");
    			t241 = text("\r\n\t\t\t\t  {#each items as item}");
    			br59 = element("br");
    			t242 = text("\r\n\t\t\t\t    <img src={item} width={");
    			mark46 = element("mark");
    			mark46.textContent = "sliderWidth";
    			t244 = text(" / 3} />");
    			br60 = element("br");
    			t245 = text("\r\n\t\t\t\t  {/each}");
    			br61 = element("br");
    			t246 = text("\r\n\t\t\t\t</");
    			mark47 = element("mark");
    			mark47.textContent = "TinySlider";
    			t248 = text(">");
    			t249 = space();
    			create_component(tinyslider6.$$.fragment);
    			t250 = space();
    			h43 = element("h4");
    			h43.textContent = "Gap";
    			t252 = space();
    			p21 = element("p");
    			t253 = text("The gap prop allows you to set a gap between items. All this does is set the css property ");
    			code18 = element("code");
    			code18.textContent = "gap";
    			t255 = text(", so alternatively you could do something like:");
    			t256 = space();
    			code19 = element("code");
    			t257 = text(":global(.slider-content) { ");
    			br62 = element("br");
    			t258 = text("\r\n\t\t\t\t  gap: 10px; ");
    			br63 = element("br");
    			t259 = text("\r\n\t\t\t\t}");
    			t260 = space();
    			p22 = element("p");
    			t261 = text("But using the ");
    			code20 = element("code");
    			code20.textContent = "gap";
    			t263 = text(" prop might be more convenient. Accepts any css value.");
    			t264 = space();
    			p23 = element("p");
    			code21 = element("code");
    			t265 = text("<");
    			mark48 = element("mark");
    			mark48.textContent = "TinySlider";
    			t267 = space();
    			mark49 = element("mark");
    			mark49.textContent = "gap";
    			t269 = text("=\"10px\"> ");
    			br64 = element("br");
    			t270 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br65 = element("br");
    			t271 = text("\r\n\t\t\t\t      ... ");
    			br66 = element("br");
    			t272 = text("\r\n\t\t\t\t  {/each} ");
    			br67 = element("br");
    			t273 = text("\r\n\t\t\t\t</");
    			mark50 = element("mark");
    			mark50.textContent = "TinySlider";
    			t275 = text(">");
    			t276 = space();
    			create_component(tinyslider7.$$.fragment);
    			t277 = space();
    			div7 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Content";
    			t279 = space();
    			p24 = element("p");
    			p24.textContent = "We've been using images as examples so far, but the content can be anything. Any direct child of the slider will be considered a slide. Links and click events will not fire while dragging to prevent accidental clicks.";
    			t281 = space();
    			p25 = element("p");
    			code22 = element("code");
    			t282 = text("<");
    			mark51 = element("mark");
    			mark51.textContent = "TinySlider";
    			t284 = text(" gap=\"0.5rem\">");
    			br68 = element("br");
    			t285 = text("\r\n\t\t\t\t  {#each { length: 20 } as _}");
    			br69 = element("br");
    			t286 = text("\r\n\t\t\t\t    <div class=\"item\">");
    			br70 = element("br");
    			t287 = text("\r\n\t\t\t\t      <a href=\"https://svelte.dev\" target=\"_blank\">Link</a>");
    			br71 = element("br");
    			t288 = text("\r\n\t\t\t\t    </div>");
    			br72 = element("br");
    			t289 = text("\r\n\t\t\t\t  {/each}");
    			br73 = element("br");
    			t290 = text("\r\n\t\t\t\t</");
    			mark52 = element("mark");
    			mark52.textContent = "TinySlider";
    			t292 = text(">");
    			t293 = space();
    			create_component(tinyslider8.$$.fragment);
    			t294 = space();
    			div11 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Lazy Loading";
    			t296 = space();
    			p26 = element("p");
    			t297 = text("When using images you might want to lazy load any images that are not visible. This can be done using native ");
    			code23 = element("code");
    			code23.textContent = "loading=\"lazy\"";
    			t299 = text(", but this comes with some drawbacks. To overcome these drawback there are several properties you can use.");
    			t300 = space();
    			p27 = element("p");
    			t301 = text("For a simple slider you might use ");
    			code24 = element("code");
    			code24.textContent = "currentIndex";
    			t303 = text(" to hide any images that are above the current index.\r\n\r\n\t\t");
    			p28 = element("p");
    			code25 = element("code");
    			t304 = text("<");
    			mark53 = element("mark");
    			mark53.textContent = "TinySlider";
    			t306 = text(" let:");
    			mark54 = element("mark");
    			mark54.textContent = "currentIndex";
    			t308 = text(">");
    			br74 = element("br");
    			t309 = text("\r\n\t\t\t\t  {#each items as item, i}");
    			br75 = element("br");
    			t310 = text("\r\n\t\t\t\t    <div>");
    			br76 = element("br");
    			t311 = text("\r\n\t\t\t\t      {#if ");
    			mark55 = element("mark");
    			mark55.textContent = "currentIndex + 1 >= i";
    			t313 = text("}");
    			br77 = element("br");
    			t314 = text("\r\n\t\t\t\t        <img src={item} alt=\"\" />");
    			br78 = element("br");
    			t315 = text("\r\n\t\t\t\t      {/if}");
    			br79 = element("br");
    			t316 = text("\r\n\t\t\t\t    </div>");
    			br80 = element("br");
    			t317 = text("\r\n\t\t\t\t  {/each}");
    			br81 = element("br");
    			t318 = space();
    			br82 = element("br");
    			t319 = text("\r\n\t\t\t\t  ...");
    			br83 = element("br");
    			t320 = text("\r\n\t\t\t\t</");
    			mark56 = element("mark");
    			mark56.textContent = "TinySlider";
    			t322 = text(">");
    			br84 = element("br");
    			t323 = space();
    			p29 = element("p");
    			p29.textContent = "Note how this is using currentIndex + 1 to preload one image ahead.";
    			t325 = space();
    			div8 = element("div");
    			create_component(tinyslider9.$$.fragment);
    			t326 = space();
    			p30 = element("p");
    			t327 = text("For sliders with multiple slides shown at once it might get more complicated when using ");
    			mark57 = element("mark");
    			mark57.textContent = "currentIndex";
    			t329 = text(", especially when you might have different amounts of slides depending on the screen size. For that purpose you could use the ");
    			mark58 = element("mark");
    			mark58.textContent = "shown";
    			t331 = text(" property. This property returns an array of all indexes that have been onscreen at some point. Just like before this can be used either as ");
    			mark59 = element("mark");
    			mark59.textContent = "let:shown";
    			t333 = text(" or ");
    			mark60 = element("mark");
    			mark60.textContent = "bind:shown";
    			t335 = text(".");
    			t336 = space();
    			p31 = element("p");
    			code26 = element("code");
    			t337 = text("<");
    			mark61 = element("mark");
    			mark61.textContent = "TinySlider";
    			t339 = text(" let:");
    			mark62 = element("mark");
    			mark62.textContent = "shown";
    			t341 = text(">");
    			br85 = element("br");
    			t342 = text("\r\n\t\t\t\t  {#each items as item, index}");
    			br86 = element("br");
    			t343 = text("\r\n\t\t\t\t    <div>");
    			br87 = element("br");
    			t344 = text("\r\n\t\t\t\t      {#if ");
    			mark63 = element("mark");
    			mark63.textContent = "shown";
    			t346 = text(".includes(index)}");
    			br88 = element("br");
    			t347 = text("\r\n\t\t\t\t        <img src={item} alt=\"\" />");
    			br89 = element("br");
    			t348 = text("\r\n\t\t\t\t      {/if}");
    			br90 = element("br");
    			t349 = text("\r\n\t\t\t\t    </div>");
    			br91 = element("br");
    			t350 = text("\r\n\t\t\t\t  {/each}");
    			br92 = element("br");
    			t351 = space();
    			br93 = element("br");
    			t352 = text("\r\n\t\t\t\t  ...");
    			br94 = element("br");
    			t353 = text("\r\n\t\t\t\t</");
    			mark64 = element("mark");
    			mark64.textContent = "TinySlider";
    			t355 = text(">");
    			t356 = space();
    			div10 = element("div");
    			div9 = element("div");
    			create_component(tinyslider10.$$.fragment);
    			t357 = space();
    			div14 = element("div");
    			h34 = element("h3");
    			h34.textContent = "Infinite Loading";
    			t359 = space();
    			p32 = element("p");
    			p32.textContent = "There are several properties you could use to implement infinite loading, meaning we load more items in when the user has scroll (almost) to the end of the slider.";
    			t361 = space();
    			h44 = element("h4");
    			h44.textContent = "Event";
    			t363 = space();
    			p33 = element("p");
    			t364 = text("You could use the event ");
    			mark65 = element("mark");
    			mark65.textContent = "on:end";
    			t366 = text(", which fires when the user has reached the end of the slider based on pixels and not on currentIndex.");
    			t367 = space();
    			p34 = element("p");
    			code27 = element("code");
    			t368 = text("<");
    			mark66 = element("mark");
    			mark66.textContent = "TinySlider";
    			t370 = space();
    			mark67 = element("mark");
    			mark67.textContent = "on:end";
    			t372 = text("={() => console.log('Reached end')}>");
    			br95 = element("br");
    			t373 = text("\r\n\t\t\t\t  ...");
    			br96 = element("br");
    			t374 = text("\r\n\t\t\t\t</");
    			mark68 = element("mark");
    			mark68.textContent = "TinySlider";
    			t376 = text(">");
    			t377 = space();
    			h45 = element("h4");
    			h45.textContent = "Properties";
    			t379 = space();
    			p35 = element("p");
    			t380 = text("Similarity to the event you could use the property ");
    			mark69 = element("mark");
    			mark69.textContent = "reachedEnd";
    			t382 = text(". This turns to true at the same time ");
    			mark70 = element("mark");
    			mark70.textContent = "on:end";
    			t384 = text(" is fired. Once again this can be set using either ");
    			mark71 = element("mark");
    			mark71.textContent = "let:reachedEnd";
    			t386 = text(" or ");
    			mark72 = element("mark");
    			mark72.textContent = "bind:reachedEnd";
    			t388 = text(".");
    			t389 = space();
    			p36 = element("p");
    			code28 = element("code");
    			t390 = text("<script>");
    			br97 = element("br");
    			t391 = text("\r\n\t\t\t\t  let ");
    			mark73 = element("mark");
    			mark73.textContent = "reachedEnd";
    			t393 = text(" = false");
    			br98 = element("br");
    			t394 = text("\r\n\t\t\t\t  $: if (");
    			mark74 = element("mark");
    			mark74.textContent = "reachedEnd";
    			t396 = text(") console.log('Reached end')");
    			br99 = element("br");
    			t397 = text("\r\n\t\t\t\t</script>");
    			br100 = element("br");
    			t398 = space();
    			br101 = element("br");
    			t399 = text("\r\n\t\t\t\t<");
    			mark75 = element("mark");
    			mark75.textContent = "TinySlider";
    			t401 = space();
    			mark76 = element("mark");
    			mark76.textContent = "bind:reachedEnd";
    			t403 = text(">");
    			br102 = element("br");
    			t404 = text("\r\n\t\t\t\t  ...");
    			br103 = element("br");
    			t405 = text("\r\n\t\t\t\t</");
    			mark77 = element("mark");
    			mark77.textContent = "TinySlider";
    			t407 = text(">");
    			t408 = space();
    			p37 = element("p");
    			t409 = text("You might want to load more items before the user actually reaches the end to make it actually feel infinite. This could be achieved with the ");
    			mark78 = element("mark");
    			mark78.textContent = "distanceToEnd";
    			t411 = text(" property. Once again this can be set using either ");
    			mark79 = element("mark");
    			mark79.textContent = "let:distanceToEnd";
    			t413 = text(" or ");
    			mark80 = element("mark");
    			mark80.textContent = "bind:distanceToEnd";
    			t415 = text(".");
    			t416 = space();
    			p38 = element("p");
    			code29 = element("code");
    			t417 = text("<script>");
    			br104 = element("br");
    			t418 = text("\r\n\t\t\t\t  let ");
    			mark81 = element("mark");
    			mark81.textContent = "distanceToEnd";
    			br105 = element("br");
    			t420 = text("\r\n\t\t\t\t  $: if (");
    			mark82 = element("mark");
    			mark82.textContent = "distanceToEnd && distanceToEnd < 500";
    			t422 = text(") console.log('Load more')");
    			br106 = element("br");
    			t423 = text("\r\n\t\t\t\t</script>");
    			br107 = element("br");
    			t424 = space();
    			br108 = element("br");
    			t425 = text("\r\n\t\t\t\t<");
    			mark83 = element("mark");
    			mark83.textContent = "TinySlider";
    			t427 = space();
    			mark84 = element("mark");
    			mark84.textContent = "bind:distanceToEnd";
    			t429 = text(">");
    			br109 = element("br");
    			t430 = text("\r\n\t\t\t\t  ...");
    			br110 = element("br");
    			t431 = text("\r\n\t\t\t\t</");
    			mark85 = element("mark");
    			mark85.textContent = "TinySlider";
    			t433 = text(">");
    			t434 = space();
    			div13 = element("div");
    			div12 = element("div");
    			create_component(tinyslider11.$$.fragment);
    			t435 = space();
    			div21 = element("div");
    			h35 = element("h3");
    			h35.textContent = "Other";
    			t437 = space();
    			h46 = element("h4");
    			h46.textContent = "Fill";
    			t439 = space();
    			p39 = element("p");
    			t440 = text("When showing multiple slides at once by default the slider will always fill out the full width when reaching the end. This behaviour can be disabled using ");
    			mark86 = element("mark");
    			mark86.textContent = "fill={false}";
    			t442 = text(".");
    			t443 = space();
    			p40 = element("p");
    			code30 = element("code");
    			t444 = text("<");
    			mark87 = element("mark");
    			mark87.textContent = "TinySlider";
    			t446 = space();
    			mark88 = element("mark");
    			mark88.textContent = "fill";
    			t448 = text("={false}>");
    			br111 = element("br");
    			t449 = text("\r\n\t\t\t\t  ...");
    			br112 = element("br");
    			t450 = text("\r\n\t\t\t\t</");
    			mark89 = element("mark");
    			mark89.textContent = "TinySlider";
    			t452 = text(">");
    			t453 = space();
    			div16 = element("div");
    			div15 = element("div");
    			create_component(tinyslider12.$$.fragment);
    			t454 = space();
    			h47 = element("h4");
    			h47.textContent = "Transition Duration";
    			t456 = space();
    			p41 = element("p");
    			t457 = text("The slider will always snap to the left side of one of the slides. The speed at which this happens can be set using the ");
    			mark90 = element("mark");
    			mark90.textContent = "transitionDuration";
    			t459 = text(" property. This value is given in milliseconds. This defaults to 300.");
    			t460 = space();
    			p42 = element("p");
    			code31 = element("code");
    			t461 = text("<");
    			mark91 = element("mark");
    			mark91.textContent = "TinySlider";
    			t463 = space();
    			mark92 = element("mark");
    			mark92.textContent = "transitionDuration";
    			t465 = text("=\"1000\">");
    			br113 = element("br");
    			t466 = text("\r\n\t\t\t\t  ...");
    			br114 = element("br");
    			t467 = text("\r\n\t\t\t\t</");
    			mark93 = element("mark");
    			mark93.textContent = "TinySlider";
    			t469 = text(">");
    			t470 = space();
    			div18 = element("div");
    			div17 = element("div");
    			create_component(tinyslider13.$$.fragment);
    			t471 = space();
    			h48 = element("h4");
    			h48.textContent = "Threshold";
    			t473 = space();
    			p43 = element("p");
    			t474 = text("When dragging the slider it will not transition to the next slide until a certain threshold has been passed to prevent accidental sliding. This also determines when a link or click event is disabled. This can be set using the ");
    			mark94 = element("mark");
    			mark94.textContent = "treshold";
    			t476 = text(" property. This value is given in pixels. This defaults to 30.");
    			t477 = space();
    			p44 = element("p");
    			code32 = element("code");
    			t478 = text("<");
    			mark95 = element("mark");
    			mark95.textContent = "TinySlider";
    			t480 = space();
    			mark96 = element("mark");
    			mark96.textContent = "threshold";
    			t482 = text("=\"100\">");
    			br115 = element("br");
    			t483 = text("\r\n\t\t\t\t  ...");
    			br116 = element("br");
    			t484 = text("\r\n\t\t\t\t</");
    			mark97 = element("mark");
    			mark97.textContent = "TinySlider";
    			t486 = text(">");
    			t487 = space();
    			div20 = element("div");
    			div19 = element("div");
    			create_component(tinyslider14.$$.fragment);
    			t488 = space();
    			div23 = element("div");
    			create_component(tinyslider15.$$.fragment);
    			t489 = space();
    			div31 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Properties";
    			t491 = space();
    			div25 = element("div");
    			p45 = element("p");
    			p45.textContent = "This is a list of all configurable properties.";
    			t493 = space();
    			div24 = element("div");
    			strong0 = element("strong");
    			strong0.textContent = "Property";
    			t495 = space();
    			strong1 = element("strong");
    			strong1.textContent = "Default";
    			t497 = space();
    			strong2 = element("strong");
    			strong2.textContent = "Description";
    			t499 = space();
    			code33 = element("code");
    			code33.textContent = "gap";
    			t501 = space();
    			code34 = element("code");
    			code34.textContent = "0";
    			t503 = space();
    			strong3 = element("strong");
    			strong3.textContent = "Gap between each item. Can be any CSS value.";
    			t505 = space();
    			code35 = element("code");
    			code35.textContent = "fill";
    			t507 = space();
    			code36 = element("code");
    			code36.textContent = "true";
    			t509 = space();
    			strong4 = element("strong");
    			strong4.textContent = "Boolean to set whether the slider is always filled fully when at the end.";
    			t511 = space();
    			code37 = element("code");
    			code37.textContent = "transitionDuration";
    			t513 = space();
    			code38 = element("code");
    			code38.textContent = "300";
    			t515 = space();
    			strong5 = element("strong");
    			strong5.textContent = "Transition between items in milliseconds.";
    			t517 = space();
    			code39 = element("code");
    			code39.textContent = "threshold";
    			t519 = space();
    			code40 = element("code");
    			code40.textContent = "30";
    			t521 = space();
    			strong6 = element("strong");
    			strong6.textContent = "Value in pixels for when you navigate when using drag controls.";
    			t523 = space();
    			code41 = element("code");
    			code41.textContent = "currentIndex";
    			t525 = space();
    			code42 = element("code");
    			code42.textContent = "0";
    			t527 = space();
    			strong7 = element("strong");
    			strong7.textContent = "Index of the current slide (Read only).";
    			t529 = space();
    			code43 = element("code");
    			code43.textContent = "shown";
    			t531 = space();
    			code44 = element("code");
    			code44.textContent = "[]";
    			t533 = space();
    			strong8 = element("strong");
    			strong8.textContent = "Array of all shown indexes (Read only).";
    			t535 = space();
    			code45 = element("code");
    			code45.textContent = "sliderWidth";
    			t537 = space();
    			code46 = element("code");
    			code46.textContent = "0";
    			t539 = space();
    			strong9 = element("strong");
    			strong9.textContent = "Box width in pixels of the slider as it is on the page (Read only).";
    			t541 = space();
    			code47 = element("code");
    			code47.textContent = "maxWidth";
    			t543 = space();
    			code48 = element("code");
    			code48.textContent = "0";
    			t545 = space();
    			strong10 = element("strong");
    			strong10.textContent = "Full width in pixels of all items together (Read only).";
    			t547 = space();
    			code49 = element("code");
    			code49.textContent = "currentScrollPosition";
    			t549 = space();
    			code50 = element("code");
    			code50.textContent = "0";
    			t551 = space();
    			strong11 = element("strong");
    			strong11.textContent = "Current position in the slider in pixels (Read only).";
    			t553 = space();
    			code51 = element("code");
    			code51.textContent = "reachedEnd";
    			t555 = space();
    			code52 = element("code");
    			code52.textContent = "false";
    			t557 = space();
    			strong12 = element("strong");
    			strong12.textContent = "Boolean that is set to true when you have reached the end of the slider (Read only).";
    			t559 = space();
    			code53 = element("code");
    			code53.textContent = "distanceToEnd";
    			t561 = space();
    			code54 = element("code");
    			code54.textContent = "0";
    			t563 = space();
    			strong13 = element("strong");
    			strong13.textContent = "Distance in pixels until you reach the end of the slider (Read only).";
    			t565 = space();
    			h23 = element("h2");
    			h23.textContent = "Functions";
    			t567 = space();
    			div27 = element("div");
    			p46 = element("p");
    			p46.textContent = "This is a list of exported functions.";
    			t569 = space();
    			div26 = element("div");
    			strong14 = element("strong");
    			strong14.textContent = "Name";
    			t571 = space();
    			strong15 = element("strong");
    			strong15.textContent = "Properties";
    			t573 = space();
    			strong16 = element("strong");
    			strong16.textContent = "Description";
    			t575 = space();
    			code55 = element("code");
    			code55.textContent = "setIndex";
    			t577 = space();
    			code56 = element("code");
    			code56.textContent = "index";
    			t579 = space();
    			strong17 = element("strong");
    			strong17.textContent = "Used to set the slider to the specified index.";
    			t581 = space();
    			h24 = element("h2");
    			h24.textContent = "Events";
    			t583 = space();
    			div29 = element("div");
    			p47 = element("p");
    			p47.textContent = "This is a list of events.";
    			t585 = space();
    			div28 = element("div");
    			strong18 = element("strong");
    			strong18.textContent = "Name";
    			t587 = space();
    			strong19 = element("strong");
    			t588 = space();
    			strong20 = element("strong");
    			strong20.textContent = "Description";
    			t590 = space();
    			code57 = element("code");
    			code57.textContent = "end";
    			t592 = space();
    			code58 = element("code");
    			t593 = space();
    			strong21 = element("strong");
    			strong21.textContent = "Fired when the end of the slider has been reached.";
    			t595 = space();
    			div30 = element("div");
    			t596 = text("Made by ");
    			a2 = element("a");
    			a2.textContent = "Mitchel Jager";
    			attr_dev(mark0, "class", "svelte-lfm80c");
    			add_location(mark0, file, 38, 5, 1192);
    			attr_dev(h1, "class", "svelte-lfm80c");
    			add_location(h1, file, 38, 1, 1188);
    			attr_dev(header, "class", "svelte-lfm80c");
    			add_location(header, file, 37, 0, 1177);
    			attr_dev(p0, "class", "svelte-lfm80c");
    			add_location(p0, file, 49, 2, 1445);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "href", "https://bundlephobia.com/package/svelte-tiny-slider");
    			attr_dev(a0, "class", "svelte-lfm80c");
    			add_location(a0, file, 51, 49, 1798);
    			attr_dev(p1, "class", "svelte-lfm80c");
    			add_location(p1, file, 51, 2, 1751);
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "href", "https://github.com/Mitcheljager/svelte-tiny-slider");
    			attr_dev(a1, "class", "svelte-lfm80c");
    			add_location(a1, file, 53, 5, 1931);
    			attr_dev(p2, "class", "svelte-lfm80c");
    			add_location(p2, file, 53, 2, 1928);
    			attr_dev(h20, "class", "svelte-lfm80c");
    			add_location(h20, file, 55, 2, 2028);
    			attr_dev(p3, "class", "svelte-lfm80c");
    			add_location(p3, file, 57, 2, 2055);
    			attr_dev(mark1, "class", "svelte-lfm80c");
    			add_location(mark1, file, 60, 12, 2127);
    			attr_dev(code0, "class", "well svelte-lfm80c");
    			add_location(code0, file, 59, 2, 2094);
    			attr_dev(mark2, "class", "svelte-lfm80c");
    			add_location(mark2, file, 64, 22, 2218);
    			attr_dev(code1, "class", "well svelte-lfm80c");
    			add_location(code1, file, 63, 2, 2175);
    			attr_dev(p4, "class", "svelte-lfm80c");
    			add_location(p4, file, 67, 2, 2266);
    			attr_dev(mark3, "class", "svelte-lfm80c");
    			add_location(mark3, file, 70, 17, 2348);
    			attr_dev(mark4, "class", "svelte-lfm80c");
    			add_location(mark4, file, 70, 54, 2385);
    			attr_dev(code2, "class", "well svelte-lfm80c");
    			add_location(code2, file, 69, 2, 2310);
    			attr_dev(mark5, "class", "svelte-lfm80c");
    			add_location(mark5, file, 74, 7, 2462);
    			attr_dev(mark6, "class", "svelte-lfm80c");
    			add_location(mark6, file, 76, 8, 2508);
    			attr_dev(code3, "class", "well svelte-lfm80c");
    			add_location(code3, file, 73, 2, 2434);
    			attr_dev(div0, "class", "block svelte-lfm80c");
    			add_location(div0, file, 48, 1, 1422);
    			attr_dev(h21, "class", "svelte-lfm80c");
    			add_location(h21, file, 80, 1, 2560);
    			attr_dev(p5, "class", "svelte-lfm80c");
    			add_location(p5, file, 83, 2, 2602);
    			attr_dev(mark7, "class", "svelte-lfm80c");
    			add_location(mark7, file, 87, 8, 2908);
    			attr_dev(br0, "class", "svelte-lfm80c");
    			add_location(br0, file, 87, 36, 2936);
    			attr_dev(br1, "class", "svelte-lfm80c");
    			add_location(br1, file, 88, 48, 2990);
    			attr_dev(br2, "class", "svelte-lfm80c");
    			add_location(br2, file, 89, 70, 3066);
    			attr_dev(br3, "class", "svelte-lfm80c");
    			add_location(br3, file, 90, 34, 3106);
    			attr_dev(mark8, "class", "svelte-lfm80c");
    			add_location(mark8, file, 91, 9, 3121);
    			attr_dev(code4, "class", "well svelte-lfm80c");
    			add_location(code4, file, 86, 3, 2879);
    			attr_dev(p6, "class", "svelte-lfm80c");
    			add_location(p6, file, 85, 2, 2871);
    			attr_dev(div1, "class", "block svelte-lfm80c");
    			add_location(div1, file, 82, 1, 2579);
    			attr_dev(h30, "class", "svelte-lfm80c");
    			add_location(h30, file, 103, 2, 3314);
    			attr_dev(p7, "class", "svelte-lfm80c");
    			add_location(p7, file, 105, 2, 3337);
    			attr_dev(h40, "class", "svelte-lfm80c");
    			add_location(h40, file, 108, 2, 3540);
    			attr_dev(mark9, "class", "svelte-lfm80c");
    			add_location(mark9, file, 110, 58, 3634);
    			attr_dev(code5, "class", "inline svelte-lfm80c");
    			add_location(code5, file, 110, 31, 3607);
    			attr_dev(p8, "class", "svelte-lfm80c");
    			add_location(p8, file, 110, 2, 3578);
    			attr_dev(mark10, "class", "svelte-lfm80c");
    			add_location(mark10, file, 113, 7, 3786);
    			attr_dev(li0, "class", "svelte-lfm80c");
    			add_location(li0, file, 113, 3, 3782);
    			attr_dev(mark11, "class", "svelte-lfm80c");
    			add_location(mark11, file, 114, 7, 3895);
    			attr_dev(li1, "class", "svelte-lfm80c");
    			add_location(li1, file, 114, 3, 3891);
    			attr_dev(ul, "class", "svelte-lfm80c");
    			add_location(ul, file, 112, 2, 3773);
    			attr_dev(code6, "class", "inline svelte-lfm80c");
    			add_location(code6, file, 118, 32, 4029);
    			attr_dev(p9, "class", "svelte-lfm80c");
    			add_location(p9, file, 117, 2, 3992);
    			attr_dev(mark12, "class", "svelte-lfm80c");
    			add_location(mark12, file, 123, 8, 4215);
    			attr_dev(mark13, "class", "svelte-lfm80c");
    			add_location(mark13, file, 123, 36, 4243);
    			attr_dev(mark14, "class", "svelte-lfm80c");
    			add_location(mark14, file, 123, 62, 4269);
    			attr_dev(br4, "class", "svelte-lfm80c");
    			add_location(br4, file, 123, 92, 4299);
    			attr_dev(br5, "class", "svelte-lfm80c");
    			add_location(br5, file, 124, 48, 4353);
    			attr_dev(br6, "class", "svelte-lfm80c");
    			add_location(br6, file, 125, 70, 4429);
    			attr_dev(br7, "class", "svelte-lfm80c");
    			add_location(br7, file, 126, 34, 4469);
    			attr_dev(br8, "class", "svelte-lfm80c");
    			add_location(br8, file, 127, 4, 4479);
    			attr_dev(mark15, "class", "svelte-lfm80c");
    			add_location(mark15, file, 128, 42, 4527);
    			attr_dev(br9, "class", "svelte-lfm80c");
    			add_location(br9, file, 128, 69, 4554);
    			attr_dev(mark16, "class", "svelte-lfm80c");
    			add_location(mark16, file, 129, 38, 4598);
    			attr_dev(br10, "class", "svelte-lfm80c");
    			add_location(br10, file, 129, 77, 4637);
    			attr_dev(mark17, "class", "svelte-lfm80c");
    			add_location(mark17, file, 130, 75, 4718);
    			attr_dev(mark18, "class", "svelte-lfm80c");
    			add_location(mark18, file, 130, 97, 4740);
    			attr_dev(br11, "class", "svelte-lfm80c");
    			add_location(br11, file, 130, 156, 4799);
    			attr_dev(br12, "class", "svelte-lfm80c");
    			add_location(br12, file, 131, 44, 4849);
    			attr_dev(br13, "class", "svelte-lfm80c");
    			add_location(br13, file, 132, 4, 4859);
    			attr_dev(mark19, "class", "svelte-lfm80c");
    			add_location(mark19, file, 133, 38, 4903);
    			attr_dev(br14, "class", "svelte-lfm80c");
    			add_location(br14, file, 133, 92, 4957);
    			attr_dev(mark20, "class", "svelte-lfm80c");
    			add_location(mark20, file, 134, 75, 5038);
    			attr_dev(mark21, "class", "svelte-lfm80c");
    			add_location(mark21, file, 134, 97, 5060);
    			attr_dev(br15, "class", "svelte-lfm80c");
    			add_location(br15, file, 134, 156, 5119);
    			attr_dev(br16, "class", "svelte-lfm80c");
    			add_location(br16, file, 135, 44, 5169);
    			attr_dev(br17, "class", "svelte-lfm80c");
    			add_location(br17, file, 136, 41, 5216);
    			attr_dev(mark22, "class", "svelte-lfm80c");
    			add_location(mark22, file, 137, 9, 5231);
    			attr_dev(code7, "class", "well svelte-lfm80c");
    			add_location(code7, file, 122, 3, 4186);
    			attr_dev(p10, "class", "svelte-lfm80c");
    			add_location(p10, file, 121, 2, 4178);
    			attr_dev(div2, "class", "relative svelte-lfm80c");
    			add_location(div2, file, 141, 2, 5284);
    			attr_dev(p11, "class", "svelte-lfm80c");
    			add_location(p11, file, 159, 2, 5842);
    			attr_dev(mark23, "class", "svelte-lfm80c");
    			add_location(mark23, file, 163, 8, 5962);
    			attr_dev(mark24, "class", "svelte-lfm80c");
    			add_location(mark24, file, 163, 36, 5990);
    			attr_dev(mark25, "class", "svelte-lfm80c");
    			add_location(mark25, file, 163, 62, 6016);
    			attr_dev(br18, "class", "svelte-lfm80c");
    			add_location(br18, file, 163, 92, 6046);
    			attr_dev(br19, "class", "svelte-lfm80c");
    			add_location(br19, file, 164, 48, 6100);
    			attr_dev(br20, "class", "svelte-lfm80c");
    			add_location(br20, file, 165, 70, 6176);
    			attr_dev(br21, "class", "svelte-lfm80c");
    			add_location(br21, file, 166, 34, 6216);
    			attr_dev(br22, "class", "svelte-lfm80c");
    			add_location(br22, file, 167, 4, 6226);
    			attr_dev(br23, "class", "svelte-lfm80c");
    			add_location(br23, file, 168, 43, 6275);
    			attr_dev(br24, "class", "svelte-lfm80c");
    			add_location(br24, file, 169, 59, 6340);
    			attr_dev(br25, "class", "svelte-lfm80c");
    			add_location(br25, file, 170, 50, 6396);
    			attr_dev(mark26, "class", "svelte-lfm80c");
    			add_location(mark26, file, 171, 76, 6478);
    			attr_dev(br26, "class", "svelte-lfm80c");
    			add_location(br26, file, 171, 107, 6509);
    			attr_dev(mark27, "class", "svelte-lfm80c");
    			add_location(mark27, file, 172, 76, 6591);
    			attr_dev(br27, "class", "svelte-lfm80c");
    			add_location(br27, file, 172, 112, 6627);
    			attr_dev(br28, "class", "svelte-lfm80c");
    			add_location(br28, file, 173, 45, 6678);
    			attr_dev(br29, "class", "svelte-lfm80c");
    			add_location(br29, file, 174, 28, 6712);
    			attr_dev(mark28, "class", "svelte-lfm80c");
    			add_location(mark28, file, 175, 9, 6727);
    			attr_dev(code8, "class", "well svelte-lfm80c");
    			add_location(code8, file, 162, 3, 5933);
    			attr_dev(p12, "class", "svelte-lfm80c");
    			add_location(p12, file, 161, 2, 5925);
    			attr_dev(div3, "class", "relative svelte-lfm80c");
    			add_location(div3, file, 179, 2, 6780);
    			attr_dev(p13, "class", "svelte-lfm80c");
    			add_location(p13, file, 196, 2, 7179);
    			attr_dev(mark29, "class", "svelte-lfm80c");
    			add_location(mark29, file, 200, 8, 7283);
    			attr_dev(mark30, "class", "svelte-lfm80c");
    			add_location(mark30, file, 200, 36, 7311);
    			attr_dev(mark31, "class", "svelte-lfm80c");
    			add_location(mark31, file, 200, 62, 7337);
    			attr_dev(br30, "class", "svelte-lfm80c");
    			add_location(br30, file, 200, 92, 7367);
    			attr_dev(br31, "class", "svelte-lfm80c");
    			add_location(br31, file, 201, 48, 7421);
    			attr_dev(br32, "class", "svelte-lfm80c");
    			add_location(br32, file, 202, 70, 7497);
    			attr_dev(br33, "class", "svelte-lfm80c");
    			add_location(br33, file, 203, 34, 7537);
    			attr_dev(br34, "class", "svelte-lfm80c");
    			add_location(br34, file, 204, 4, 7547);
    			attr_dev(br35, "class", "svelte-lfm80c");
    			add_location(br35, file, 205, 43, 7596);
    			attr_dev(br36, "class", "svelte-lfm80c");
    			add_location(br36, file, 206, 59, 7661);
    			attr_dev(br37, "class", "svelte-lfm80c");
    			add_location(br37, file, 207, 50, 7717);
    			attr_dev(mark32, "class", "svelte-lfm80c");
    			add_location(mark32, file, 208, 76, 7799);
    			attr_dev(br38, "class", "svelte-lfm80c");
    			add_location(br38, file, 208, 107, 7830);
    			attr_dev(mark33, "class", "svelte-lfm80c");
    			add_location(mark33, file, 209, 76, 7912);
    			attr_dev(br39, "class", "svelte-lfm80c");
    			add_location(br39, file, 209, 106, 7942);
    			attr_dev(mark34, "class", "svelte-lfm80c");
    			add_location(mark34, file, 210, 76, 8024);
    			attr_dev(br40, "class", "svelte-lfm80c");
    			add_location(br40, file, 210, 110, 8058);
    			attr_dev(br41, "class", "svelte-lfm80c");
    			add_location(br41, file, 211, 103, 8167);
    			attr_dev(br42, "class", "svelte-lfm80c");
    			add_location(br42, file, 212, 55, 8228);
    			attr_dev(br43, "class", "svelte-lfm80c");
    			add_location(br43, file, 213, 45, 8279);
    			attr_dev(br44, "class", "svelte-lfm80c");
    			add_location(br44, file, 214, 28, 8313);
    			attr_dev(mark35, "class", "svelte-lfm80c");
    			add_location(mark35, file, 215, 9, 8328);
    			attr_dev(code9, "class", "well svelte-lfm80c");
    			add_location(code9, file, 199, 3, 7254);
    			attr_dev(p14, "class", "svelte-lfm80c");
    			add_location(p14, file, 198, 2, 7246);
    			attr_dev(div4, "class", "relative svelte-lfm80c");
    			add_location(div4, file, 219, 2, 8381);
    			attr_dev(h41, "class", "svelte-lfm80c");
    			add_location(h41, file, 239, 2, 8896);
    			attr_dev(code10, "class", "inline svelte-lfm80c");
    			add_location(code10, file, 241, 162, 9098);
    			attr_dev(code11, "class", "inline svelte-lfm80c");
    			add_location(code11, file, 241, 206, 9142);
    			attr_dev(code12, "class", "inline svelte-lfm80c");
    			add_location(code12, file, 241, 252, 9188);
    			attr_dev(p15, "class", "svelte-lfm80c");
    			add_location(p15, file, 241, 2, 8938);
    			attr_dev(br45, "class", "svelte-lfm80c");
    			add_location(br45, file, 245, 18, 9354);
    			attr_dev(mark36, "class", "svelte-lfm80c");
    			add_location(mark36, file, 246, 20, 9380);
    			attr_dev(br46, "class", "svelte-lfm80c");
    			add_location(br46, file, 246, 41, 9401);
    			attr_dev(br47, "class", "svelte-lfm80c");
    			add_location(br47, file, 247, 19, 9426);
    			attr_dev(br48, "class", "svelte-lfm80c");
    			add_location(br48, file, 248, 4, 9436);
    			attr_dev(mark37, "class", "svelte-lfm80c");
    			add_location(mark37, file, 249, 8, 9450);
    			attr_dev(mark38, "class", "svelte-lfm80c");
    			add_location(mark38, file, 249, 32, 9474);
    			attr_dev(mark39, "class", "svelte-lfm80c");
    			add_location(mark39, file, 249, 50, 9492);
    			attr_dev(br49, "class", "svelte-lfm80c");
    			add_location(br49, file, 249, 76, 9518);
    			attr_dev(br50, "class", "svelte-lfm80c");
    			add_location(br50, file, 250, 48, 9572);
    			attr_dev(br51, "class", "svelte-lfm80c");
    			add_location(br51, file, 251, 70, 9648);
    			attr_dev(br52, "class", "svelte-lfm80c");
    			add_location(br52, file, 252, 34, 9688);
    			attr_dev(mark40, "class", "svelte-lfm80c");
    			add_location(mark40, file, 253, 9, 9703);
    			attr_dev(br53, "class", "svelte-lfm80c");
    			add_location(br53, file, 253, 36, 9730);
    			attr_dev(br54, "class", "svelte-lfm80c");
    			add_location(br54, file, 254, 4, 9740);
    			attr_dev(mark41, "class", "svelte-lfm80c");
    			add_location(mark41, file, 255, 39, 9785);
    			attr_dev(br55, "class", "svelte-lfm80c");
    			add_location(br55, file, 255, 91, 9837);
    			attr_dev(mark42, "class", "svelte-lfm80c");
    			add_location(mark42, file, 256, 39, 9882);
    			attr_dev(br56, "class", "svelte-lfm80c");
    			add_location(br56, file, 256, 91, 9934);
    			attr_dev(mark43, "class", "svelte-lfm80c");
    			add_location(mark43, file, 257, 39, 9979);
    			attr_dev(br57, "class", "svelte-lfm80c");
    			add_location(br57, file, 257, 91, 10031);
    			attr_dev(code13, "class", "well svelte-lfm80c");
    			add_location(code13, file, 244, 3, 9315);
    			attr_dev(p16, "class", "svelte-lfm80c");
    			add_location(p16, file, 243, 2, 9307);
    			attr_dev(code14, "class", "inline svelte-lfm80c");
    			add_location(code14, file, 267, 32, 10233);
    			attr_dev(p17, "class", "svelte-lfm80c");
    			add_location(p17, file, 267, 2, 10203);
    			attr_dev(button0, "class", "button svelte-lfm80c");
    			add_location(button0, file, 269, 2, 10318);
    			attr_dev(button1, "class", "button svelte-lfm80c");
    			add_location(button1, file, 270, 2, 10397);
    			attr_dev(button2, "class", "button svelte-lfm80c");
    			add_location(button2, file, 271, 2, 10476);
    			attr_dev(div5, "class", "block svelte-lfm80c");
    			add_location(div5, file, 102, 1, 3291);
    			attr_dev(h31, "class", "svelte-lfm80c");
    			add_location(h31, file, 276, 2, 10590);
    			attr_dev(p18, "class", "svelte-lfm80c");
    			add_location(p18, file, 278, 2, 10612);
    			attr_dev(h42, "class", "svelte-lfm80c");
    			add_location(h42, file, 280, 2, 10871);
    			attr_dev(code15, "class", "inline svelte-lfm80c");
    			add_location(code15, file, 282, 181, 11069);
    			attr_dev(code16, "class", "inline svelte-lfm80c");
    			add_location(code16, file, 282, 314, 11202);
    			attr_dev(p19, "class", "svelte-lfm80c");
    			add_location(p19, file, 282, 2, 10890);
    			attr_dev(mark44, "class", "svelte-lfm80c");
    			add_location(mark44, file, 286, 8, 11418);
    			attr_dev(mark45, "class", "svelte-lfm80c");
    			add_location(mark45, file, 286, 36, 11446);
    			attr_dev(br58, "class", "svelte-lfm80c");
    			add_location(br58, file, 286, 64, 11474);
    			attr_dev(br59, "class", "svelte-lfm80c");
    			add_location(br59, file, 287, 47, 11527);
    			attr_dev(mark46, "class", "svelte-lfm80c");
    			add_location(mark46, file, 288, 69, 11602);
    			attr_dev(br60, "class", "svelte-lfm80c");
    			add_location(br60, file, 288, 109, 11642);
    			attr_dev(br61, "class", "svelte-lfm80c");
    			add_location(br61, file, 289, 33, 11681);
    			attr_dev(mark47, "class", "svelte-lfm80c");
    			add_location(mark47, file, 290, 9, 11696);
    			attr_dev(code17, "class", "well svelte-lfm80c");
    			add_location(code17, file, 285, 3, 11389);
    			attr_dev(p20, "class", "svelte-lfm80c");
    			add_location(p20, file, 284, 2, 11381);
    			attr_dev(h43, "class", "svelte-lfm80c");
    			add_location(h43, file, 301, 2, 11916);
    			attr_dev(code18, "class", "inline svelte-lfm80c");
    			add_location(code18, file, 304, 93, 12032);
    			attr_dev(p21, "class", "svelte-lfm80c");
    			add_location(p21, file, 303, 2, 11934);
    			attr_dev(br62, "class", "svelte-lfm80c");
    			add_location(br62, file, 307, 36, 12180);
    			attr_dev(br63, "class", "svelte-lfm80c");
    			add_location(br63, file, 308, 27, 12213);
    			attr_dev(code19, "class", "well svelte-lfm80c");
    			add_location(code19, file, 306, 3, 12123);
    			attr_dev(code20, "class", "inline svelte-lfm80c");
    			add_location(code20, file, 313, 17, 12269);
    			attr_dev(p22, "class", "svelte-lfm80c");
    			add_location(p22, file, 312, 2, 12247);
    			attr_dev(mark48, "class", "svelte-lfm80c");
    			add_location(mark48, file, 318, 8, 12405);
    			attr_dev(mark49, "class", "svelte-lfm80c");
    			add_location(mark49, file, 318, 32, 12429);
    			attr_dev(br64, "class", "svelte-lfm80c");
    			add_location(br64, file, 318, 60, 12457);
    			attr_dev(br65, "class", "svelte-lfm80c");
    			add_location(br65, file, 319, 48, 12511);
    			attr_dev(br66, "class", "svelte-lfm80c");
    			add_location(br66, file, 320, 44, 12561);
    			attr_dev(br67, "class", "svelte-lfm80c");
    			add_location(br67, file, 321, 34, 12601);
    			attr_dev(mark50, "class", "svelte-lfm80c");
    			add_location(mark50, file, 322, 9, 12616);
    			attr_dev(code21, "class", "well svelte-lfm80c");
    			add_location(code21, file, 317, 3, 12376);
    			attr_dev(p23, "class", "svelte-lfm80c");
    			add_location(p23, file, 316, 2, 12368);
    			attr_dev(div6, "class", "block svelte-lfm80c");
    			add_location(div6, file, 275, 1, 10567);
    			attr_dev(h32, "class", "svelte-lfm80c");
    			add_location(h32, file, 334, 2, 12883);
    			attr_dev(p24, "class", "svelte-lfm80c");
    			add_location(p24, file, 336, 2, 12905);
    			attr_dev(mark51, "class", "svelte-lfm80c");
    			add_location(mark51, file, 340, 8, 13172);
    			attr_dev(br68, "class", "svelte-lfm80c");
    			add_location(br68, file, 340, 48, 13212);
    			attr_dev(br69, "class", "svelte-lfm80c");
    			add_location(br69, file, 341, 63, 13281);
    			attr_dev(br70, "class", "svelte-lfm80c");
    			add_location(br70, file, 342, 52, 13339);
    			attr_dev(br71, "class", "svelte-lfm80c");
    			add_location(br71, file, 343, 105, 13450);
    			attr_dev(br72, "class", "svelte-lfm80c");
    			add_location(br72, file, 344, 40, 13496);
    			attr_dev(br73, "class", "svelte-lfm80c");
    			add_location(br73, file, 345, 33, 13535);
    			attr_dev(mark52, "class", "svelte-lfm80c");
    			add_location(mark52, file, 346, 9, 13550);
    			attr_dev(code22, "class", "well svelte-lfm80c");
    			add_location(code22, file, 339, 3, 13143);
    			attr_dev(p25, "class", "svelte-lfm80c");
    			add_location(p25, file, 338, 2, 13135);
    			attr_dev(div7, "class", "block svelte-lfm80c");
    			add_location(div7, file, 333, 1, 12860);
    			attr_dev(h33, "class", "svelte-lfm80c");
    			add_location(h33, file, 360, 2, 13867);
    			attr_dev(code23, "class", "inline svelte-lfm80c");
    			add_location(code23, file, 362, 114, 14006);
    			attr_dev(p26, "class", "svelte-lfm80c");
    			add_location(p26, file, 362, 2, 13894);
    			attr_dev(code24, "class", "inline svelte-lfm80c");
    			add_location(code24, file, 364, 39, 14201);
    			attr_dev(p27, "class", "svelte-lfm80c");
    			add_location(p27, file, 364, 2, 14164);
    			attr_dev(mark53, "class", "svelte-lfm80c");
    			add_location(mark53, file, 368, 8, 14337);
    			attr_dev(mark54, "class", "svelte-lfm80c");
    			add_location(mark54, file, 368, 36, 14365);
    			attr_dev(br74, "class", "svelte-lfm80c");
    			add_location(br74, file, 368, 65, 14394);
    			attr_dev(br75, "class", "svelte-lfm80c");
    			add_location(br75, file, 369, 50, 14450);
    			attr_dev(br76, "class", "svelte-lfm80c");
    			add_location(br76, file, 370, 39, 14495);
    			attr_dev(mark55, "class", "svelte-lfm80c");
    			add_location(mark55, file, 371, 50, 14551);
    			attr_dev(br77, "class", "svelte-lfm80c");
    			add_location(br77, file, 371, 93, 14594);
    			attr_dev(br78, "class", "svelte-lfm80c");
    			add_location(br78, file, 372, 93, 14693);
    			attr_dev(br79, "class", "svelte-lfm80c");
    			add_location(br79, file, 373, 55, 14754);
    			attr_dev(br80, "class", "svelte-lfm80c");
    			add_location(br80, file, 374, 40, 14800);
    			attr_dev(br81, "class", "svelte-lfm80c");
    			add_location(br81, file, 375, 33, 14839);
    			attr_dev(br82, "class", "svelte-lfm80c");
    			add_location(br82, file, 376, 4, 14849);
    			attr_dev(br83, "class", "svelte-lfm80c");
    			add_location(br83, file, 377, 19, 14874);
    			attr_dev(mark56, "class", "svelte-lfm80c");
    			add_location(mark56, file, 378, 9, 14889);
    			attr_dev(br84, "class", "svelte-lfm80c");
    			add_location(br84, file, 378, 36, 14916);
    			attr_dev(code25, "class", "well svelte-lfm80c");
    			add_location(code25, file, 367, 3, 14308);
    			attr_dev(p28, "class", "svelte-lfm80c");
    			add_location(p28, file, 366, 2, 14300);
    			attr_dev(p29, "class", "svelte-lfm80c");
    			add_location(p29, file, 382, 2, 14946);
    			attr_dev(div8, "class", "relative svelte-lfm80c");
    			add_location(div8, file, 386, 2, 15035);
    			attr_dev(mark57, "class", "svelte-lfm80c");
    			add_location(mark57, file, 409, 91, 15808);
    			attr_dev(mark58, "class", "svelte-lfm80c");
    			add_location(mark58, file, 409, 242, 15959);
    			attr_dev(mark59, "class", "svelte-lfm80c");
    			add_location(mark59, file, 409, 400, 16117);
    			attr_dev(mark60, "class", "svelte-lfm80c");
    			add_location(mark60, file, 409, 426, 16143);
    			attr_dev(p30, "class", "svelte-lfm80c");
    			add_location(p30, file, 408, 2, 15712);
    			attr_dev(mark61, "class", "svelte-lfm80c");
    			add_location(mark61, file, 414, 8, 16218);
    			attr_dev(mark62, "class", "svelte-lfm80c");
    			add_location(mark62, file, 414, 36, 16246);
    			attr_dev(br85, "class", "svelte-lfm80c");
    			add_location(br85, file, 414, 58, 16268);
    			attr_dev(br86, "class", "svelte-lfm80c");
    			add_location(br86, file, 415, 54, 16328);
    			attr_dev(br87, "class", "svelte-lfm80c");
    			add_location(br87, file, 416, 39, 16373);
    			attr_dev(mark63, "class", "svelte-lfm80c");
    			add_location(mark63, file, 417, 50, 16429);
    			attr_dev(br88, "class", "svelte-lfm80c");
    			add_location(br88, file, 417, 90, 16469);
    			attr_dev(br89, "class", "svelte-lfm80c");
    			add_location(br89, file, 418, 93, 16568);
    			attr_dev(br90, "class", "svelte-lfm80c");
    			add_location(br90, file, 419, 55, 16629);
    			attr_dev(br91, "class", "svelte-lfm80c");
    			add_location(br91, file, 420, 40, 16675);
    			attr_dev(br92, "class", "svelte-lfm80c");
    			add_location(br92, file, 421, 33, 16714);
    			attr_dev(br93, "class", "svelte-lfm80c");
    			add_location(br93, file, 422, 4, 16724);
    			attr_dev(br94, "class", "svelte-lfm80c");
    			add_location(br94, file, 423, 19, 16749);
    			attr_dev(mark64, "class", "svelte-lfm80c");
    			add_location(mark64, file, 424, 9, 16764);
    			attr_dev(code26, "class", "well svelte-lfm80c");
    			add_location(code26, file, 413, 3, 16189);
    			attr_dev(p31, "class", "svelte-lfm80c");
    			add_location(p31, file, 412, 2, 16181);
    			attr_dev(div9, "class", "slider-wrapper svelte-lfm80c");
    			add_location(div9, file, 429, 3, 16844);
    			attr_dev(div10, "class", "relative svelte-lfm80c");
    			add_location(div10, file, 428, 2, 16817);
    			attr_dev(div11, "class", "block svelte-lfm80c");
    			add_location(div11, file, 359, 1, 13844);
    			attr_dev(h34, "class", "svelte-lfm80c");
    			add_location(h34, file, 454, 2, 17625);
    			attr_dev(p32, "class", "svelte-lfm80c");
    			add_location(p32, file, 456, 2, 17656);
    			attr_dev(h44, "class", "svelte-lfm80c");
    			add_location(h44, file, 458, 2, 17832);
    			attr_dev(mark65, "class", "svelte-lfm80c");
    			add_location(mark65, file, 460, 29, 17879);
    			attr_dev(p33, "class", "svelte-lfm80c");
    			add_location(p33, file, 460, 2, 17852);
    			attr_dev(mark66, "class", "svelte-lfm80c");
    			add_location(mark66, file, 464, 8, 18047);
    			attr_dev(mark67, "class", "svelte-lfm80c");
    			add_location(mark67, file, 464, 32, 18071);
    			attr_dev(br95, "class", "svelte-lfm80c");
    			add_location(br95, file, 464, 103, 18142);
    			attr_dev(br96, "class", "svelte-lfm80c");
    			add_location(br96, file, 465, 19, 18167);
    			attr_dev(mark68, "class", "svelte-lfm80c");
    			add_location(mark68, file, 466, 9, 18182);
    			attr_dev(code27, "class", "well svelte-lfm80c");
    			add_location(code27, file, 463, 3, 18018);
    			attr_dev(p34, "class", "svelte-lfm80c");
    			add_location(p34, file, 462, 2, 18010);
    			attr_dev(h45, "class", "svelte-lfm80c");
    			add_location(h45, file, 470, 2, 18235);
    			attr_dev(mark69, "class", "svelte-lfm80c");
    			add_location(mark69, file, 472, 56, 18314);
    			attr_dev(mark70, "class", "svelte-lfm80c");
    			add_location(mark70, file, 472, 117, 18375);
    			attr_dev(mark71, "class", "svelte-lfm80c");
    			add_location(mark71, file, 472, 187, 18445);
    			attr_dev(mark72, "class", "svelte-lfm80c");
    			add_location(mark72, file, 472, 218, 18476);
    			attr_dev(p35, "class", "svelte-lfm80c");
    			add_location(p35, file, 472, 2, 18260);
    			attr_dev(br97, "class", "svelte-lfm80c");
    			add_location(br97, file, 476, 18, 18562);
    			attr_dev(mark73, "class", "svelte-lfm80c");
    			add_location(mark73, file, 477, 20, 18588);
    			attr_dev(br98, "class", "svelte-lfm80c");
    			add_location(br98, file, 477, 51, 18619);
    			attr_dev(mark74, "class", "svelte-lfm80c");
    			add_location(mark74, file, 478, 23, 18648);
    			attr_dev(br99, "class", "svelte-lfm80c");
    			add_location(br99, file, 478, 74, 18699);
    			attr_dev(br100, "class", "svelte-lfm80c");
    			add_location(br100, file, 479, 19, 18724);
    			attr_dev(br101, "class", "svelte-lfm80c");
    			add_location(br101, file, 480, 4, 18734);
    			attr_dev(mark75, "class", "svelte-lfm80c");
    			add_location(mark75, file, 481, 8, 18748);
    			attr_dev(mark76, "class", "svelte-lfm80c");
    			add_location(mark76, file, 481, 32, 18772);
    			attr_dev(br102, "class", "svelte-lfm80c");
    			add_location(br102, file, 481, 64, 18804);
    			attr_dev(br103, "class", "svelte-lfm80c");
    			add_location(br103, file, 482, 19, 18829);
    			attr_dev(mark77, "class", "svelte-lfm80c");
    			add_location(mark77, file, 483, 9, 18844);
    			attr_dev(code28, "class", "well svelte-lfm80c");
    			add_location(code28, file, 475, 3, 18523);
    			attr_dev(p36, "class", "svelte-lfm80c");
    			add_location(p36, file, 474, 2, 18515);
    			attr_dev(mark78, "class", "svelte-lfm80c");
    			add_location(mark78, file, 487, 147, 19042);
    			attr_dev(mark79, "class", "svelte-lfm80c");
    			add_location(mark79, file, 487, 224, 19119);
    			attr_dev(mark80, "class", "svelte-lfm80c");
    			add_location(mark80, file, 487, 258, 19153);
    			attr_dev(p37, "class", "svelte-lfm80c");
    			add_location(p37, file, 487, 2, 18897);
    			attr_dev(br104, "class", "svelte-lfm80c");
    			add_location(br104, file, 491, 18, 19242);
    			attr_dev(mark81, "class", "svelte-lfm80c");
    			add_location(mark81, file, 492, 20, 19268);
    			attr_dev(br105, "class", "svelte-lfm80c");
    			add_location(br105, file, 492, 46, 19294);
    			attr_dev(mark82, "class", "svelte-lfm80c");
    			add_location(mark82, file, 493, 23, 19323);
    			attr_dev(br106, "class", "svelte-lfm80c");
    			add_location(br106, file, 493, 101, 19401);
    			attr_dev(br107, "class", "svelte-lfm80c");
    			add_location(br107, file, 494, 19, 19426);
    			attr_dev(br108, "class", "svelte-lfm80c");
    			add_location(br108, file, 495, 4, 19436);
    			attr_dev(mark83, "class", "svelte-lfm80c");
    			add_location(mark83, file, 496, 8, 19450);
    			attr_dev(mark84, "class", "svelte-lfm80c");
    			add_location(mark84, file, 496, 32, 19474);
    			attr_dev(br109, "class", "svelte-lfm80c");
    			add_location(br109, file, 496, 67, 19509);
    			attr_dev(br110, "class", "svelte-lfm80c");
    			add_location(br110, file, 497, 19, 19534);
    			attr_dev(mark85, "class", "svelte-lfm80c");
    			add_location(mark85, file, 498, 9, 19549);
    			attr_dev(code29, "class", "well svelte-lfm80c");
    			add_location(code29, file, 490, 3, 19203);
    			attr_dev(p38, "class", "svelte-lfm80c");
    			add_location(p38, file, 489, 2, 19195);
    			attr_dev(div12, "class", "slider-wrapper svelte-lfm80c");
    			add_location(div12, file, 503, 3, 19629);
    			attr_dev(div13, "class", "relative svelte-lfm80c");
    			add_location(div13, file, 502, 2, 19602);
    			attr_dev(div14, "class", "block svelte-lfm80c");
    			add_location(div14, file, 453, 1, 17602);
    			attr_dev(h35, "class", "svelte-lfm80c");
    			add_location(h35, file, 526, 2, 20392);
    			attr_dev(h46, "class", "svelte-lfm80c");
    			add_location(h46, file, 528, 2, 20412);
    			attr_dev(mark86, "class", "svelte-lfm80c");
    			add_location(mark86, file, 530, 160, 20589);
    			attr_dev(p39, "class", "svelte-lfm80c");
    			add_location(p39, file, 530, 2, 20431);
    			attr_dev(mark87, "class", "svelte-lfm80c");
    			add_location(mark87, file, 534, 8, 20672);
    			attr_dev(mark88, "class", "svelte-lfm80c");
    			add_location(mark88, file, 534, 32, 20696);
    			attr_dev(br111, "class", "svelte-lfm80c");
    			add_location(br111, file, 534, 71, 20735);
    			attr_dev(br112, "class", "svelte-lfm80c");
    			add_location(br112, file, 535, 19, 20760);
    			attr_dev(mark89, "class", "svelte-lfm80c");
    			add_location(mark89, file, 536, 9, 20775);
    			attr_dev(code30, "class", "well svelte-lfm80c");
    			add_location(code30, file, 533, 3, 20643);
    			attr_dev(p40, "class", "svelte-lfm80c");
    			add_location(p40, file, 532, 2, 20635);
    			attr_dev(div15, "class", "slider-wrapper svelte-lfm80c");
    			add_location(div15, file, 541, 3, 20855);
    			attr_dev(div16, "class", "relative svelte-lfm80c");
    			add_location(div16, file, 540, 2, 20828);
    			attr_dev(h47, "class", "svelte-lfm80c");
    			add_location(h47, file, 560, 2, 21568);
    			attr_dev(mark90, "class", "svelte-lfm80c");
    			add_location(mark90, file, 562, 125, 21725);
    			attr_dev(p41, "class", "svelte-lfm80c");
    			add_location(p41, file, 562, 2, 21602);
    			attr_dev(mark91, "class", "svelte-lfm80c");
    			add_location(mark91, file, 566, 8, 21872);
    			attr_dev(mark92, "class", "svelte-lfm80c");
    			add_location(mark92, file, 566, 32, 21896);
    			attr_dev(br113, "class", "svelte-lfm80c");
    			add_location(br113, file, 566, 74, 21938);
    			attr_dev(br114, "class", "svelte-lfm80c");
    			add_location(br114, file, 567, 19, 21963);
    			attr_dev(mark93, "class", "svelte-lfm80c");
    			add_location(mark93, file, 568, 9, 21978);
    			attr_dev(code31, "class", "well svelte-lfm80c");
    			add_location(code31, file, 565, 3, 21843);
    			attr_dev(p42, "class", "svelte-lfm80c");
    			add_location(p42, file, 564, 2, 21835);
    			attr_dev(div17, "class", "slider-wrapper svelte-lfm80c");
    			add_location(div17, file, 573, 3, 22058);
    			attr_dev(div18, "class", "relative svelte-lfm80c");
    			add_location(div18, file, 572, 2, 22031);
    			attr_dev(h48, "class", "svelte-lfm80c");
    			add_location(h48, file, 592, 2, 22794);
    			attr_dev(mark94, "class", "svelte-lfm80c");
    			add_location(mark94, file, 594, 231, 23047);
    			attr_dev(p43, "class", "svelte-lfm80c");
    			add_location(p43, file, 594, 2, 22818);
    			attr_dev(mark95, "class", "svelte-lfm80c");
    			add_location(mark95, file, 598, 8, 23177);
    			attr_dev(mark96, "class", "svelte-lfm80c");
    			add_location(mark96, file, 598, 32, 23201);
    			attr_dev(br115, "class", "svelte-lfm80c");
    			add_location(br115, file, 598, 64, 23233);
    			attr_dev(br116, "class", "svelte-lfm80c");
    			add_location(br116, file, 599, 19, 23258);
    			attr_dev(mark97, "class", "svelte-lfm80c");
    			add_location(mark97, file, 600, 9, 23273);
    			attr_dev(code32, "class", "well svelte-lfm80c");
    			add_location(code32, file, 597, 3, 23148);
    			attr_dev(p44, "class", "svelte-lfm80c");
    			add_location(p44, file, 596, 2, 23140);
    			attr_dev(div19, "class", "slider-wrapper svelte-lfm80c");
    			add_location(div19, file, 605, 3, 23353);
    			attr_dev(div20, "class", "relative svelte-lfm80c");
    			add_location(div20, file, 604, 2, 23326);
    			attr_dev(div21, "class", "block svelte-lfm80c");
    			add_location(div21, file, 525, 1, 20369);
    			attr_dev(div22, "class", "wrapper svelte-lfm80c");
    			add_location(div22, file, 47, 0, 1398);
    			attr_dev(div23, "class", "cards svelte-lfm80c");
    			add_location(div23, file, 626, 0, 24094);
    			attr_dev(h22, "class", "svelte-lfm80c");
    			add_location(h22, file, 659, 1, 25169);
    			attr_dev(p45, "class", "svelte-lfm80c");
    			add_location(p45, file, 662, 2, 25216);
    			attr_dev(strong0, "class", "svelte-lfm80c");
    			add_location(strong0, file, 665, 3, 25299);
    			attr_dev(strong1, "class", "svelte-lfm80c");
    			add_location(strong1, file, 665, 29, 25325);
    			attr_dev(strong2, "class", "svelte-lfm80c");
    			add_location(strong2, file, 665, 54, 25350);
    			attr_dev(code33, "class", "svelte-lfm80c");
    			add_location(code33, file, 667, 3, 25385);
    			attr_dev(code34, "class", "svelte-lfm80c");
    			add_location(code34, file, 667, 20, 25402);
    			attr_dev(strong3, "class", "svelte-lfm80c");
    			add_location(strong3, file, 667, 35, 25417);
    			attr_dev(code35, "class", "svelte-lfm80c");
    			add_location(code35, file, 668, 3, 25483);
    			attr_dev(code36, "class", "svelte-lfm80c");
    			add_location(code36, file, 668, 21, 25501);
    			attr_dev(strong4, "class", "svelte-lfm80c");
    			add_location(strong4, file, 668, 39, 25519);
    			attr_dev(code37, "class", "svelte-lfm80c");
    			add_location(code37, file, 669, 3, 25614);
    			attr_dev(code38, "class", "svelte-lfm80c");
    			add_location(code38, file, 669, 35, 25646);
    			attr_dev(strong5, "class", "svelte-lfm80c");
    			add_location(strong5, file, 669, 52, 25663);
    			attr_dev(code39, "class", "svelte-lfm80c");
    			add_location(code39, file, 670, 3, 25726);
    			attr_dev(code40, "class", "svelte-lfm80c");
    			add_location(code40, file, 670, 26, 25749);
    			attr_dev(strong6, "class", "svelte-lfm80c");
    			add_location(strong6, file, 670, 42, 25765);
    			attr_dev(code41, "class", "svelte-lfm80c");
    			add_location(code41, file, 671, 3, 25850);
    			attr_dev(code42, "class", "svelte-lfm80c");
    			add_location(code42, file, 671, 29, 25876);
    			attr_dev(strong7, "class", "svelte-lfm80c");
    			add_location(strong7, file, 671, 44, 25891);
    			attr_dev(code43, "class", "svelte-lfm80c");
    			add_location(code43, file, 672, 3, 25952);
    			attr_dev(code44, "class", "svelte-lfm80c");
    			add_location(code44, file, 672, 22, 25971);
    			attr_dev(strong8, "class", "svelte-lfm80c");
    			add_location(strong8, file, 672, 38, 25987);
    			attr_dev(code45, "class", "svelte-lfm80c");
    			add_location(code45, file, 673, 3, 26048);
    			attr_dev(code46, "class", "svelte-lfm80c");
    			add_location(code46, file, 673, 28, 26073);
    			attr_dev(strong9, "class", "svelte-lfm80c");
    			add_location(strong9, file, 673, 43, 26088);
    			attr_dev(code47, "class", "svelte-lfm80c");
    			add_location(code47, file, 674, 3, 26177);
    			attr_dev(code48, "class", "svelte-lfm80c");
    			add_location(code48, file, 674, 25, 26199);
    			attr_dev(strong10, "class", "svelte-lfm80c");
    			add_location(strong10, file, 674, 40, 26214);
    			attr_dev(code49, "class", "svelte-lfm80c");
    			add_location(code49, file, 675, 3, 26291);
    			attr_dev(code50, "class", "svelte-lfm80c");
    			add_location(code50, file, 675, 38, 26326);
    			attr_dev(strong11, "class", "svelte-lfm80c");
    			add_location(strong11, file, 675, 53, 26341);
    			attr_dev(code51, "class", "svelte-lfm80c");
    			add_location(code51, file, 676, 3, 26416);
    			attr_dev(code52, "class", "svelte-lfm80c");
    			add_location(code52, file, 676, 27, 26440);
    			attr_dev(strong12, "class", "svelte-lfm80c");
    			add_location(strong12, file, 676, 46, 26459);
    			attr_dev(code53, "class", "svelte-lfm80c");
    			add_location(code53, file, 677, 3, 26565);
    			attr_dev(code54, "class", "svelte-lfm80c");
    			add_location(code54, file, 677, 30, 26592);
    			attr_dev(strong13, "class", "svelte-lfm80c");
    			add_location(strong13, file, 677, 45, 26607);
    			attr_dev(div24, "class", "table svelte-lfm80c");
    			add_location(div24, file, 664, 2, 25275);
    			attr_dev(div25, "class", "block svelte-lfm80c");
    			add_location(div25, file, 661, 1, 25193);
    			attr_dev(h23, "class", "svelte-lfm80c");
    			add_location(h23, file, 681, 1, 26717);
    			attr_dev(p46, "class", "svelte-lfm80c");
    			add_location(p46, file, 684, 2, 26763);
    			attr_dev(strong14, "class", "svelte-lfm80c");
    			add_location(strong14, file, 687, 3, 26837);
    			attr_dev(strong15, "class", "svelte-lfm80c");
    			add_location(strong15, file, 687, 25, 26859);
    			attr_dev(strong16, "class", "svelte-lfm80c");
    			add_location(strong16, file, 687, 53, 26887);
    			attr_dev(code55, "class", "svelte-lfm80c");
    			add_location(code55, file, 689, 3, 26922);
    			attr_dev(code56, "class", "svelte-lfm80c");
    			add_location(code56, file, 689, 25, 26944);
    			attr_dev(strong17, "class", "svelte-lfm80c");
    			add_location(strong17, file, 689, 44, 26963);
    			attr_dev(div26, "class", "table svelte-lfm80c");
    			add_location(div26, file, 686, 2, 26813);
    			attr_dev(div27, "class", "block svelte-lfm80c");
    			add_location(div27, file, 683, 1, 26740);
    			attr_dev(h24, "class", "svelte-lfm80c");
    			add_location(h24, file, 693, 1, 27050);
    			attr_dev(p47, "class", "svelte-lfm80c");
    			add_location(p47, file, 696, 2, 27093);
    			attr_dev(strong18, "class", "svelte-lfm80c");
    			add_location(strong18, file, 699, 3, 27155);
    			attr_dev(strong19, "class", "svelte-lfm80c");
    			add_location(strong19, file, 699, 25, 27177);
    			attr_dev(strong20, "class", "svelte-lfm80c");
    			add_location(strong20, file, 699, 43, 27195);
    			attr_dev(code57, "class", "svelte-lfm80c");
    			add_location(code57, file, 701, 3, 27230);
    			attr_dev(code58, "class", "svelte-lfm80c");
    			add_location(code58, file, 701, 20, 27247);
    			attr_dev(strong21, "class", "svelte-lfm80c");
    			add_location(strong21, file, 701, 34, 27261);
    			attr_dev(div28, "class", "table svelte-lfm80c");
    			add_location(div28, file, 698, 2, 27131);
    			attr_dev(div29, "class", "block svelte-lfm80c");
    			add_location(div29, file, 695, 1, 27070);
    			attr_dev(a2, "href", "https://github.com/Mitcheljager");
    			attr_dev(a2, "class", "svelte-lfm80c");
    			add_location(a2, file, 706, 10, 27383);
    			attr_dev(div30, "class", "block svelte-lfm80c");
    			add_location(div30, file, 705, 1, 27352);
    			attr_dev(div31, "class", "wrapper svelte-lfm80c");
    			add_location(div31, file, 658, 0, 25145);
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
    			append_dev(p1, t6);
    			append_dev(p1, a0);
    			append_dev(p1, t8);
    			append_dev(div0, t9);
    			append_dev(div0, p2);
    			append_dev(p2, a1);
    			append_dev(div0, t11);
    			append_dev(div0, h20);
    			append_dev(div0, t13);
    			append_dev(div0, p3);
    			append_dev(div0, t15);
    			append_dev(div0, code0);
    			append_dev(code0, t16);
    			append_dev(code0, mark1);
    			append_dev(div0, t18);
    			append_dev(div0, code1);
    			append_dev(code1, t19);
    			append_dev(code1, mark2);
    			append_dev(div0, t21);
    			append_dev(div0, p4);
    			append_dev(div0, t23);
    			append_dev(div0, code2);
    			append_dev(code2, t24);
    			append_dev(code2, mark3);
    			append_dev(code2, t26);
    			append_dev(code2, mark4);
    			append_dev(code2, t28);
    			append_dev(div0, t29);
    			append_dev(div0, code3);
    			append_dev(code3, t30);
    			append_dev(code3, mark5);
    			append_dev(code3, t32);
    			append_dev(code3, mark6);
    			append_dev(code3, t34);
    			append_dev(div22, t35);
    			append_dev(div22, h21);
    			append_dev(div22, t37);
    			append_dev(div22, div1);
    			append_dev(div1, p5);
    			append_dev(div1, t39);
    			append_dev(div1, p6);
    			append_dev(p6, code4);
    			append_dev(code4, t40);
    			append_dev(code4, mark7);
    			append_dev(code4, t42);
    			append_dev(code4, br0);
    			append_dev(code4, t43);
    			append_dev(code4, br1);
    			append_dev(code4, t44);
    			append_dev(code4, br2);
    			append_dev(code4, t45);
    			append_dev(code4, br3);
    			append_dev(code4, t46);
    			append_dev(code4, mark8);
    			append_dev(code4, t48);
    			append_dev(div1, t49);
    			mount_component(tinyslider1, div1, null);
    			append_dev(div22, t50);
    			append_dev(div22, div5);
    			append_dev(div5, h30);
    			append_dev(div5, t52);
    			append_dev(div5, p7);
    			append_dev(div5, h40);
    			append_dev(div5, t55);
    			append_dev(div5, p8);
    			append_dev(p8, t56);
    			append_dev(p8, code5);
    			append_dev(code5, t57);
    			append_dev(code5, mark9);
    			append_dev(code5, t59);
    			append_dev(p8, t60);
    			append_dev(div5, t61);
    			append_dev(div5, ul);
    			append_dev(ul, li0);
    			append_dev(li0, mark10);
    			append_dev(li0, t63);
    			append_dev(ul, t64);
    			append_dev(ul, li1);
    			append_dev(li1, mark11);
    			append_dev(li1, t66);
    			append_dev(div5, t67);
    			append_dev(div5, p9);
    			append_dev(p9, t68);
    			append_dev(p9, code6);
    			append_dev(p9, t70);
    			append_dev(div5, t71);
    			append_dev(div5, p10);
    			append_dev(p10, code7);
    			append_dev(code7, t72);
    			append_dev(code7, mark12);
    			append_dev(code7, t74);
    			append_dev(code7, mark13);
    			append_dev(code7, t76);
    			append_dev(code7, mark14);
    			append_dev(code7, t78);
    			append_dev(code7, br4);
    			append_dev(code7, t79);
    			append_dev(code7, br5);
    			append_dev(code7, t80);
    			append_dev(code7, br6);
    			append_dev(code7, t81);
    			append_dev(code7, br7);
    			append_dev(code7, t82);
    			append_dev(code7, br8);
    			append_dev(code7, t83);
    			append_dev(code7, mark15);
    			append_dev(code7, t85);
    			append_dev(code7, br9);
    			append_dev(code7, t86);
    			append_dev(code7, mark16);
    			append_dev(code7, t88);
    			append_dev(code7, br10);
    			append_dev(code7, t89);
    			append_dev(code7, mark17);
    			append_dev(code7, t91);
    			append_dev(code7, mark18);
    			append_dev(code7, t93);
    			append_dev(code7, br11);
    			append_dev(code7, t94);
    			append_dev(code7, br12);
    			append_dev(code7, t95);
    			append_dev(code7, br13);
    			append_dev(code7, t96);
    			append_dev(code7, mark19);
    			append_dev(code7, t98);
    			append_dev(code7, br14);
    			append_dev(code7, t99);
    			append_dev(code7, mark20);
    			append_dev(code7, t101);
    			append_dev(code7, mark21);
    			append_dev(code7, t103);
    			append_dev(code7, br15);
    			append_dev(code7, t104);
    			append_dev(code7, br16);
    			append_dev(code7, t105);
    			append_dev(code7, br17);
    			append_dev(code7, t106);
    			append_dev(code7, mark22);
    			append_dev(code7, t108);
    			append_dev(div5, t109);
    			append_dev(div5, div2);
    			mount_component(tinyslider2, div2, null);
    			append_dev(div5, t110);
    			append_dev(div5, p11);
    			append_dev(div5, t112);
    			append_dev(div5, p12);
    			append_dev(p12, code8);
    			append_dev(code8, t113);
    			append_dev(code8, mark23);
    			append_dev(code8, t115);
    			append_dev(code8, mark24);
    			append_dev(code8, t117);
    			append_dev(code8, mark25);
    			append_dev(code8, t119);
    			append_dev(code8, br18);
    			append_dev(code8, t120);
    			append_dev(code8, br19);
    			append_dev(code8, t121);
    			append_dev(code8, br20);
    			append_dev(code8, t122);
    			append_dev(code8, br21);
    			append_dev(code8, t123);
    			append_dev(code8, br22);
    			append_dev(code8, t124);
    			append_dev(code8, br23);
    			append_dev(code8, t125);
    			append_dev(code8, br24);
    			append_dev(code8, t126);
    			append_dev(code8, br25);
    			append_dev(code8, t127);
    			append_dev(code8, mark26);
    			append_dev(code8, t129);
    			append_dev(code8, br26);
    			append_dev(code8, t130);
    			append_dev(code8, mark27);
    			append_dev(code8, t132);
    			append_dev(code8, br27);
    			append_dev(code8, t133);
    			append_dev(code8, br28);
    			append_dev(code8, t134);
    			append_dev(code8, br29);
    			append_dev(code8, t135);
    			append_dev(code8, mark28);
    			append_dev(code8, t137);
    			append_dev(div5, t138);
    			append_dev(div5, div3);
    			mount_component(tinyslider3, div3, null);
    			append_dev(div5, t139);
    			append_dev(div5, p13);
    			append_dev(div5, t141);
    			append_dev(div5, p14);
    			append_dev(p14, code9);
    			append_dev(code9, t142);
    			append_dev(code9, mark29);
    			append_dev(code9, t144);
    			append_dev(code9, mark30);
    			append_dev(code9, t146);
    			append_dev(code9, mark31);
    			append_dev(code9, t148);
    			append_dev(code9, br30);
    			append_dev(code9, t149);
    			append_dev(code9, br31);
    			append_dev(code9, t150);
    			append_dev(code9, br32);
    			append_dev(code9, t151);
    			append_dev(code9, br33);
    			append_dev(code9, t152);
    			append_dev(code9, br34);
    			append_dev(code9, t153);
    			append_dev(code9, br35);
    			append_dev(code9, t154);
    			append_dev(code9, br36);
    			append_dev(code9, t155);
    			append_dev(code9, br37);
    			append_dev(code9, t156);
    			append_dev(code9, mark32);
    			append_dev(code9, t158);
    			append_dev(code9, br38);
    			append_dev(code9, t159);
    			append_dev(code9, mark33);
    			append_dev(code9, t161);
    			append_dev(code9, br39);
    			append_dev(code9, t162);
    			append_dev(code9, mark34);
    			append_dev(code9, t164);
    			append_dev(code9, br40);
    			append_dev(code9, t165);
    			append_dev(code9, br41);
    			append_dev(code9, t166);
    			append_dev(code9, br42);
    			append_dev(code9, t167);
    			append_dev(code9, br43);
    			append_dev(code9, t168);
    			append_dev(code9, br44);
    			append_dev(code9, t169);
    			append_dev(code9, mark35);
    			append_dev(code9, t171);
    			append_dev(div5, t172);
    			append_dev(div5, div4);
    			mount_component(tinyslider4, div4, null);
    			append_dev(div5, t173);
    			append_dev(div5, h41);
    			append_dev(div5, t175);
    			append_dev(div5, p15);
    			append_dev(p15, t176);
    			append_dev(p15, code10);
    			append_dev(p15, t178);
    			append_dev(p15, code11);
    			append_dev(p15, t180);
    			append_dev(p15, code12);
    			append_dev(p15, t182);
    			append_dev(div5, t183);
    			append_dev(div5, p16);
    			append_dev(p16, code13);
    			append_dev(code13, t184);
    			append_dev(code13, br45);
    			append_dev(code13, t185);
    			append_dev(code13, mark36);
    			append_dev(code13, br46);
    			append_dev(code13, t187);
    			append_dev(code13, br47);
    			append_dev(code13, t188);
    			append_dev(code13, br48);
    			append_dev(code13, t189);
    			append_dev(code13, mark37);
    			append_dev(code13, t191);
    			append_dev(code13, mark38);
    			append_dev(code13, t193);
    			append_dev(code13, mark39);
    			append_dev(code13, t195);
    			append_dev(code13, br49);
    			append_dev(code13, t196);
    			append_dev(code13, br50);
    			append_dev(code13, t197);
    			append_dev(code13, br51);
    			append_dev(code13, t198);
    			append_dev(code13, br52);
    			append_dev(code13, t199);
    			append_dev(code13, mark40);
    			append_dev(code13, t201);
    			append_dev(code13, br53);
    			append_dev(code13, t202);
    			append_dev(code13, br54);
    			append_dev(code13, t203);
    			append_dev(code13, mark41);
    			append_dev(code13, t205);
    			append_dev(code13, br55);
    			append_dev(code13, t206);
    			append_dev(code13, mark42);
    			append_dev(code13, t208);
    			append_dev(code13, br56);
    			append_dev(code13, t209);
    			append_dev(code13, mark43);
    			append_dev(code13, t211);
    			append_dev(code13, br57);
    			append_dev(div5, t212);
    			mount_component(tinyslider5, div5, null);
    			append_dev(div5, t213);
    			append_dev(div5, p17);
    			append_dev(p17, t214);
    			append_dev(p17, code14);
    			append_dev(p17, t216);
    			append_dev(div5, t217);
    			append_dev(div5, button0);
    			append_dev(div5, t219);
    			append_dev(div5, button1);
    			append_dev(div5, t221);
    			append_dev(div5, button2);
    			append_dev(div22, t223);
    			append_dev(div22, div6);
    			append_dev(div6, h31);
    			append_dev(div6, t225);
    			append_dev(div6, p18);
    			append_dev(div6, t227);
    			append_dev(div6, h42);
    			append_dev(div6, t229);
    			append_dev(div6, p19);
    			append_dev(p19, t230);
    			append_dev(p19, code15);
    			append_dev(p19, t232);
    			append_dev(p19, code16);
    			append_dev(p19, t234);
    			append_dev(div6, t235);
    			append_dev(div6, p20);
    			append_dev(p20, code17);
    			append_dev(code17, t236);
    			append_dev(code17, mark44);
    			append_dev(code17, t238);
    			append_dev(code17, mark45);
    			append_dev(code17, t240);
    			append_dev(code17, br58);
    			append_dev(code17, t241);
    			append_dev(code17, br59);
    			append_dev(code17, t242);
    			append_dev(code17, mark46);
    			append_dev(code17, t244);
    			append_dev(code17, br60);
    			append_dev(code17, t245);
    			append_dev(code17, br61);
    			append_dev(code17, t246);
    			append_dev(code17, mark47);
    			append_dev(code17, t248);
    			append_dev(div6, t249);
    			mount_component(tinyslider6, div6, null);
    			append_dev(div6, t250);
    			append_dev(div6, h43);
    			append_dev(div6, t252);
    			append_dev(div6, p21);
    			append_dev(p21, t253);
    			append_dev(p21, code18);
    			append_dev(p21, t255);
    			append_dev(div6, t256);
    			append_dev(div6, code19);
    			append_dev(code19, t257);
    			append_dev(code19, br62);
    			append_dev(code19, t258);
    			append_dev(code19, br63);
    			append_dev(code19, t259);
    			append_dev(div6, t260);
    			append_dev(div6, p22);
    			append_dev(p22, t261);
    			append_dev(p22, code20);
    			append_dev(p22, t263);
    			append_dev(div6, t264);
    			append_dev(div6, p23);
    			append_dev(p23, code21);
    			append_dev(code21, t265);
    			append_dev(code21, mark48);
    			append_dev(code21, t267);
    			append_dev(code21, mark49);
    			append_dev(code21, t269);
    			append_dev(code21, br64);
    			append_dev(code21, t270);
    			append_dev(code21, br65);
    			append_dev(code21, t271);
    			append_dev(code21, br66);
    			append_dev(code21, t272);
    			append_dev(code21, br67);
    			append_dev(code21, t273);
    			append_dev(code21, mark50);
    			append_dev(code21, t275);
    			append_dev(div6, t276);
    			mount_component(tinyslider7, div6, null);
    			append_dev(div22, t277);
    			append_dev(div22, div7);
    			append_dev(div7, h32);
    			append_dev(div7, t279);
    			append_dev(div7, p24);
    			append_dev(div7, t281);
    			append_dev(div7, p25);
    			append_dev(p25, code22);
    			append_dev(code22, t282);
    			append_dev(code22, mark51);
    			append_dev(code22, t284);
    			append_dev(code22, br68);
    			append_dev(code22, t285);
    			append_dev(code22, br69);
    			append_dev(code22, t286);
    			append_dev(code22, br70);
    			append_dev(code22, t287);
    			append_dev(code22, br71);
    			append_dev(code22, t288);
    			append_dev(code22, br72);
    			append_dev(code22, t289);
    			append_dev(code22, br73);
    			append_dev(code22, t290);
    			append_dev(code22, mark52);
    			append_dev(code22, t292);
    			append_dev(div7, t293);
    			mount_component(tinyslider8, div7, null);
    			append_dev(div22, t294);
    			append_dev(div22, div11);
    			append_dev(div11, h33);
    			append_dev(div11, t296);
    			append_dev(div11, p26);
    			append_dev(p26, t297);
    			append_dev(p26, code23);
    			append_dev(p26, t299);
    			append_dev(div11, t300);
    			append_dev(div11, p27);
    			append_dev(p27, t301);
    			append_dev(p27, code24);
    			append_dev(p27, t303);
    			append_dev(div11, p28);
    			append_dev(p28, code25);
    			append_dev(code25, t304);
    			append_dev(code25, mark53);
    			append_dev(code25, t306);
    			append_dev(code25, mark54);
    			append_dev(code25, t308);
    			append_dev(code25, br74);
    			append_dev(code25, t309);
    			append_dev(code25, br75);
    			append_dev(code25, t310);
    			append_dev(code25, br76);
    			append_dev(code25, t311);
    			append_dev(code25, mark55);
    			append_dev(code25, t313);
    			append_dev(code25, br77);
    			append_dev(code25, t314);
    			append_dev(code25, br78);
    			append_dev(code25, t315);
    			append_dev(code25, br79);
    			append_dev(code25, t316);
    			append_dev(code25, br80);
    			append_dev(code25, t317);
    			append_dev(code25, br81);
    			append_dev(code25, t318);
    			append_dev(code25, br82);
    			append_dev(code25, t319);
    			append_dev(code25, br83);
    			append_dev(code25, t320);
    			append_dev(code25, mark56);
    			append_dev(code25, t322);
    			append_dev(code25, br84);
    			append_dev(div11, t323);
    			append_dev(div11, p29);
    			append_dev(div11, t325);
    			append_dev(div11, div8);
    			mount_component(tinyslider9, div8, null);
    			append_dev(div11, t326);
    			append_dev(div11, p30);
    			append_dev(p30, t327);
    			append_dev(p30, mark57);
    			append_dev(p30, t329);
    			append_dev(p30, mark58);
    			append_dev(p30, t331);
    			append_dev(p30, mark59);
    			append_dev(p30, t333);
    			append_dev(p30, mark60);
    			append_dev(p30, t335);
    			append_dev(div11, t336);
    			append_dev(div11, p31);
    			append_dev(p31, code26);
    			append_dev(code26, t337);
    			append_dev(code26, mark61);
    			append_dev(code26, t339);
    			append_dev(code26, mark62);
    			append_dev(code26, t341);
    			append_dev(code26, br85);
    			append_dev(code26, t342);
    			append_dev(code26, br86);
    			append_dev(code26, t343);
    			append_dev(code26, br87);
    			append_dev(code26, t344);
    			append_dev(code26, mark63);
    			append_dev(code26, t346);
    			append_dev(code26, br88);
    			append_dev(code26, t347);
    			append_dev(code26, br89);
    			append_dev(code26, t348);
    			append_dev(code26, br90);
    			append_dev(code26, t349);
    			append_dev(code26, br91);
    			append_dev(code26, t350);
    			append_dev(code26, br92);
    			append_dev(code26, t351);
    			append_dev(code26, br93);
    			append_dev(code26, t352);
    			append_dev(code26, br94);
    			append_dev(code26, t353);
    			append_dev(code26, mark64);
    			append_dev(code26, t355);
    			append_dev(div11, t356);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			mount_component(tinyslider10, div9, null);
    			append_dev(div22, t357);
    			append_dev(div22, div14);
    			append_dev(div14, h34);
    			append_dev(div14, t359);
    			append_dev(div14, p32);
    			append_dev(div14, t361);
    			append_dev(div14, h44);
    			append_dev(div14, t363);
    			append_dev(div14, p33);
    			append_dev(p33, t364);
    			append_dev(p33, mark65);
    			append_dev(p33, t366);
    			append_dev(div14, t367);
    			append_dev(div14, p34);
    			append_dev(p34, code27);
    			append_dev(code27, t368);
    			append_dev(code27, mark66);
    			append_dev(code27, t370);
    			append_dev(code27, mark67);
    			append_dev(code27, t372);
    			append_dev(code27, br95);
    			append_dev(code27, t373);
    			append_dev(code27, br96);
    			append_dev(code27, t374);
    			append_dev(code27, mark68);
    			append_dev(code27, t376);
    			append_dev(div14, t377);
    			append_dev(div14, h45);
    			append_dev(div14, t379);
    			append_dev(div14, p35);
    			append_dev(p35, t380);
    			append_dev(p35, mark69);
    			append_dev(p35, t382);
    			append_dev(p35, mark70);
    			append_dev(p35, t384);
    			append_dev(p35, mark71);
    			append_dev(p35, t386);
    			append_dev(p35, mark72);
    			append_dev(p35, t388);
    			append_dev(div14, t389);
    			append_dev(div14, p36);
    			append_dev(p36, code28);
    			append_dev(code28, t390);
    			append_dev(code28, br97);
    			append_dev(code28, t391);
    			append_dev(code28, mark73);
    			append_dev(code28, t393);
    			append_dev(code28, br98);
    			append_dev(code28, t394);
    			append_dev(code28, mark74);
    			append_dev(code28, t396);
    			append_dev(code28, br99);
    			append_dev(code28, t397);
    			append_dev(code28, br100);
    			append_dev(code28, t398);
    			append_dev(code28, br101);
    			append_dev(code28, t399);
    			append_dev(code28, mark75);
    			append_dev(code28, t401);
    			append_dev(code28, mark76);
    			append_dev(code28, t403);
    			append_dev(code28, br102);
    			append_dev(code28, t404);
    			append_dev(code28, br103);
    			append_dev(code28, t405);
    			append_dev(code28, mark77);
    			append_dev(code28, t407);
    			append_dev(div14, t408);
    			append_dev(div14, p37);
    			append_dev(p37, t409);
    			append_dev(p37, mark78);
    			append_dev(p37, t411);
    			append_dev(p37, mark79);
    			append_dev(p37, t413);
    			append_dev(p37, mark80);
    			append_dev(p37, t415);
    			append_dev(div14, t416);
    			append_dev(div14, p38);
    			append_dev(p38, code29);
    			append_dev(code29, t417);
    			append_dev(code29, br104);
    			append_dev(code29, t418);
    			append_dev(code29, mark81);
    			append_dev(code29, br105);
    			append_dev(code29, t420);
    			append_dev(code29, mark82);
    			append_dev(code29, t422);
    			append_dev(code29, br106);
    			append_dev(code29, t423);
    			append_dev(code29, br107);
    			append_dev(code29, t424);
    			append_dev(code29, br108);
    			append_dev(code29, t425);
    			append_dev(code29, mark83);
    			append_dev(code29, t427);
    			append_dev(code29, mark84);
    			append_dev(code29, t429);
    			append_dev(code29, br109);
    			append_dev(code29, t430);
    			append_dev(code29, br110);
    			append_dev(code29, t431);
    			append_dev(code29, mark85);
    			append_dev(code29, t433);
    			append_dev(div14, t434);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			mount_component(tinyslider11, div12, null);
    			append_dev(div22, t435);
    			append_dev(div22, div21);
    			append_dev(div21, h35);
    			append_dev(div21, t437);
    			append_dev(div21, h46);
    			append_dev(div21, t439);
    			append_dev(div21, p39);
    			append_dev(p39, t440);
    			append_dev(p39, mark86);
    			append_dev(p39, t442);
    			append_dev(div21, t443);
    			append_dev(div21, p40);
    			append_dev(p40, code30);
    			append_dev(code30, t444);
    			append_dev(code30, mark87);
    			append_dev(code30, t446);
    			append_dev(code30, mark88);
    			append_dev(code30, t448);
    			append_dev(code30, br111);
    			append_dev(code30, t449);
    			append_dev(code30, br112);
    			append_dev(code30, t450);
    			append_dev(code30, mark89);
    			append_dev(code30, t452);
    			append_dev(div21, t453);
    			append_dev(div21, div16);
    			append_dev(div16, div15);
    			mount_component(tinyslider12, div15, null);
    			append_dev(div21, t454);
    			append_dev(div21, h47);
    			append_dev(div21, t456);
    			append_dev(div21, p41);
    			append_dev(p41, t457);
    			append_dev(p41, mark90);
    			append_dev(p41, t459);
    			append_dev(div21, t460);
    			append_dev(div21, p42);
    			append_dev(p42, code31);
    			append_dev(code31, t461);
    			append_dev(code31, mark91);
    			append_dev(code31, t463);
    			append_dev(code31, mark92);
    			append_dev(code31, t465);
    			append_dev(code31, br113);
    			append_dev(code31, t466);
    			append_dev(code31, br114);
    			append_dev(code31, t467);
    			append_dev(code31, mark93);
    			append_dev(code31, t469);
    			append_dev(div21, t470);
    			append_dev(div21, div18);
    			append_dev(div18, div17);
    			mount_component(tinyslider13, div17, null);
    			append_dev(div21, t471);
    			append_dev(div21, h48);
    			append_dev(div21, t473);
    			append_dev(div21, p43);
    			append_dev(p43, t474);
    			append_dev(p43, mark94);
    			append_dev(p43, t476);
    			append_dev(div21, t477);
    			append_dev(div21, p44);
    			append_dev(p44, code32);
    			append_dev(code32, t478);
    			append_dev(code32, mark95);
    			append_dev(code32, t480);
    			append_dev(code32, mark96);
    			append_dev(code32, t482);
    			append_dev(code32, br115);
    			append_dev(code32, t483);
    			append_dev(code32, br116);
    			append_dev(code32, t484);
    			append_dev(code32, mark97);
    			append_dev(code32, t486);
    			append_dev(div21, t487);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			mount_component(tinyslider14, div19, null);
    			insert_dev(target, t488, anchor);
    			insert_dev(target, div23, anchor);
    			mount_component(tinyslider15, div23, null);
    			insert_dev(target, t489, anchor);
    			insert_dev(target, div31, anchor);
    			append_dev(div31, h22);
    			append_dev(div31, t491);
    			append_dev(div31, div25);
    			append_dev(div25, p45);
    			append_dev(div25, t493);
    			append_dev(div25, div24);
    			append_dev(div24, strong0);
    			append_dev(div24, t495);
    			append_dev(div24, strong1);
    			append_dev(div24, t497);
    			append_dev(div24, strong2);
    			append_dev(div24, t499);
    			append_dev(div24, code33);
    			append_dev(div24, t501);
    			append_dev(div24, code34);
    			append_dev(div24, t503);
    			append_dev(div24, strong3);
    			append_dev(div24, t505);
    			append_dev(div24, code35);
    			append_dev(div24, t507);
    			append_dev(div24, code36);
    			append_dev(div24, t509);
    			append_dev(div24, strong4);
    			append_dev(div24, t511);
    			append_dev(div24, code37);
    			append_dev(div24, t513);
    			append_dev(div24, code38);
    			append_dev(div24, t515);
    			append_dev(div24, strong5);
    			append_dev(div24, t517);
    			append_dev(div24, code39);
    			append_dev(div24, t519);
    			append_dev(div24, code40);
    			append_dev(div24, t521);
    			append_dev(div24, strong6);
    			append_dev(div24, t523);
    			append_dev(div24, code41);
    			append_dev(div24, t525);
    			append_dev(div24, code42);
    			append_dev(div24, t527);
    			append_dev(div24, strong7);
    			append_dev(div24, t529);
    			append_dev(div24, code43);
    			append_dev(div24, t531);
    			append_dev(div24, code44);
    			append_dev(div24, t533);
    			append_dev(div24, strong8);
    			append_dev(div24, t535);
    			append_dev(div24, code45);
    			append_dev(div24, t537);
    			append_dev(div24, code46);
    			append_dev(div24, t539);
    			append_dev(div24, strong9);
    			append_dev(div24, t541);
    			append_dev(div24, code47);
    			append_dev(div24, t543);
    			append_dev(div24, code48);
    			append_dev(div24, t545);
    			append_dev(div24, strong10);
    			append_dev(div24, t547);
    			append_dev(div24, code49);
    			append_dev(div24, t549);
    			append_dev(div24, code50);
    			append_dev(div24, t551);
    			append_dev(div24, strong11);
    			append_dev(div24, t553);
    			append_dev(div24, code51);
    			append_dev(div24, t555);
    			append_dev(div24, code52);
    			append_dev(div24, t557);
    			append_dev(div24, strong12);
    			append_dev(div24, t559);
    			append_dev(div24, code53);
    			append_dev(div24, t561);
    			append_dev(div24, code54);
    			append_dev(div24, t563);
    			append_dev(div24, strong13);
    			append_dev(div31, t565);
    			append_dev(div31, h23);
    			append_dev(div31, t567);
    			append_dev(div31, div27);
    			append_dev(div27, p46);
    			append_dev(div27, t569);
    			append_dev(div27, div26);
    			append_dev(div26, strong14);
    			append_dev(div26, t571);
    			append_dev(div26, strong15);
    			append_dev(div26, t573);
    			append_dev(div26, strong16);
    			append_dev(div26, t575);
    			append_dev(div26, code55);
    			append_dev(div26, t577);
    			append_dev(div26, code56);
    			append_dev(div26, t579);
    			append_dev(div26, strong17);
    			append_dev(div31, t581);
    			append_dev(div31, h24);
    			append_dev(div31, t583);
    			append_dev(div31, div29);
    			append_dev(div29, p47);
    			append_dev(div29, t585);
    			append_dev(div29, div28);
    			append_dev(div28, strong18);
    			append_dev(div28, t587);
    			append_dev(div28, strong19);
    			append_dev(div28, t588);
    			append_dev(div28, strong20);
    			append_dev(div28, t590);
    			append_dev(div28, code57);
    			append_dev(div28, t592);
    			append_dev(div28, code58);
    			append_dev(div28, t593);
    			append_dev(div28, strong21);
    			append_dev(div31, t595);
    			append_dev(div31, div30);
    			append_dev(div30, t596);
    			append_dev(div30, a2);
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

    			if (dirty[2] & /*$$scope*/ 262144) {
    				tinyslider0_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider0.$set(tinyslider0_changes);
    			const tinyslider1_changes = {};

    			if (dirty[2] & /*$$scope*/ 262144) {
    				tinyslider1_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider1.$set(tinyslider1_changes);
    			const tinyslider2_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[2] & /*$$scope*/ 262144) {
    				tinyslider2_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider2.$set(tinyslider2_changes);
    			const tinyslider3_changes = {};

    			if (dirty[0] & /*currentIndex, setIndex*/ 24 | dirty[2] & /*$$scope*/ 262144) {
    				tinyslider3_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider3.$set(tinyslider3_changes);
    			const tinyslider4_changes = {};

    			if (dirty[0] & /*currentIndex, setIndex*/ 24 | dirty[2] & /*$$scope*/ 262144) {
    				tinyslider4_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider4.$set(tinyslider4_changes);
    			const tinyslider5_changes = {};

    			if (dirty[2] & /*$$scope*/ 262144) {
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

    			if (dirty[0] & /*sliderWidth*/ 4 | dirty[2] & /*$$scope*/ 262144) {
    				tinyslider6_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider6.$set(tinyslider6_changes);
    			const tinyslider7_changes = {};

    			if (dirty[0] & /*sliderWidth*/ 4 | dirty[2] & /*$$scope*/ 262144) {
    				tinyslider7_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider7.$set(tinyslider7_changes);
    			const tinyslider8_changes = {};

    			if (dirty[2] & /*$$scope*/ 262144) {
    				tinyslider8_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider8.$set(tinyslider8_changes);
    			const tinyslider9_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex, sliderWidth*/ 28 | dirty[1] & /*reachedEnd*/ 16384 | dirty[2] & /*$$scope*/ 262144) {
    				tinyslider9_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider9.$set(tinyslider9_changes);
    			const tinyslider10_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[1] & /*reachedEnd, shown*/ 24576 | dirty[2] & /*$$scope*/ 262144) {
    				tinyslider10_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider10.$set(tinyslider10_changes);
    			const tinyslider11_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex, portaitItems*/ 25 | dirty[1] & /*shown*/ 8192 | dirty[2] & /*$$scope*/ 262144) {
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

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[2] & /*$$scope*/ 262144) {
    				tinyslider12_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider12.$set(tinyslider12_changes);
    			const tinyslider13_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[1] & /*reachedEnd*/ 16384 | dirty[2] & /*$$scope*/ 262144) {
    				tinyslider13_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider13.$set(tinyslider13_changes);
    			const tinyslider14_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[1] & /*reachedEnd*/ 16384 | dirty[2] & /*$$scope*/ 262144) {
    				tinyslider14_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider14.$set(tinyslider14_changes);
    			const tinyslider15_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 24 | dirty[1] & /*reachedEnd, shown*/ 24576 | dirty[2] & /*$$scope*/ 262144) {
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
    			if (detaching) detach_dev(t488);
    			if (detaching) detach_dev(div23);
    			destroy_component(tinyslider15);
    			if (detaching) detach_dev(t489);
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
