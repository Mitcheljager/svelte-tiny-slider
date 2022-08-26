
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
    			attr_dev(div0, "class", "slider-content svelte-45yjjo");
    			set_style(div0, "transform", style_transform, false);
    			set_style(div0, "transition-duration", style_transition_duration, false);
    			set_style(div0, "--gap", /*gap*/ ctx[7], false);
    			add_location(div0, file$1, 175, 2, 4770);
    			attr_dev(div1, "class", "slider svelte-45yjjo");
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
    	child_ctx[27] = list[i];
    	child_ctx[29] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	child_ctx[29] = i;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	child_ctx[37] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    // (33:2) {#each headerItems as item}
    function create_each_block_8(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[27])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "200");
    			attr_dev(img, "height", "150");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-w36hk7");
    			add_location(img, file, 33, 3, 924);
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
    		id: create_each_block_8.name,
    		type: "each",
    		source: "(33:2) {#each headerItems as item}",
    		ctx
    	});

    	return block;
    }

    // (32:1) <TinySlider>
    function create_default_slot_7(ctx) {
    	let each_1_anchor;
    	let each_value_8 = /*headerItems*/ ctx[5];
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
    			if (dirty[0] & /*headerItems*/ 32) {
    				each_value_8 = /*headerItems*/ ctx[5];
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
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(32:1) <TinySlider>",
    		ctx
    	});

    	return block;
    }

    // (86:3) {#each fixedItems as item}
    function create_each_block_7(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[27])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-w36hk7");
    			add_location(img, file, 86, 4, 2622);
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
    		id: create_each_block_7.name,
    		type: "each",
    		source: "(86:3) {#each fixedItems as item}",
    		ctx
    	});

    	return block;
    }

    // (85:2) <TinySlider>
    function create_default_slot_6(ctx) {
    	let each_1_anchor;
    	let each_value_7 = /*fixedItems*/ ctx[4];
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
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*fixedItems*/ 16) {
    				each_value_7 = /*fixedItems*/ ctx[4];
    				validate_each_argument(each_value_7);
    				let i;

    				for (i = 0; i < each_value_7.length; i += 1) {
    					const child_ctx = get_each_context_7(ctx, each_value_7, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_7.length;
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
    		source: "(85:2) <TinySlider>",
    		ctx
    	});

    	return block;
    }

    // (130:4) {#each fixedItems as item}
    function create_each_block_6(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[27])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-w36hk7");
    			add_location(img, file, 130, 5, 4620);
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
    		source: "(130:4) {#each fixedItems as item}",
    		ctx
    	});

    	return block;
    }

    // (129:3) <TinySlider let:setIndex let:currentIndex>
    function create_default_slot_5(ctx) {
    	let each_1_anchor;
    	let each_value_6 = /*fixedItems*/ ctx[4];
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
    			if (dirty[0] & /*fixedItems*/ 16) {
    				each_value_6 = /*fixedItems*/ ctx[4];
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
    		source: "(129:3) <TinySlider let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (135:5) {#if currentIndex > 0}
    function create_if_block_7(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[10](/*setIndex*/ ctx[23], /*currentIndex*/ ctx[24]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-w36hk7");
    			add_location(button, file, 135, 6, 4736);
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
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(135:5) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (139:5) {#if currentIndex < items.length - 1}
    function create_if_block_6(ctx) {
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
    		return /*click_handler_2*/ ctx[11](/*setIndex*/ ctx[23], /*currentIndex*/ ctx[24]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-w36hk7");
    			add_location(button, file, 139, 6, 4891);
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(139:5) {#if currentIndex < items.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (134:4) <svelte:fragment slot="controls">
    function create_controls_slot_3(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[24] > 0 && create_if_block_7(ctx);
    	let if_block1 = /*currentIndex*/ ctx[24] < /*items*/ ctx[3].length - 1 && create_if_block_6(ctx);

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
    			if (/*currentIndex*/ ctx[24] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16777216) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_7(ctx);
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

    			if (/*currentIndex*/ ctx[24] < /*items*/ ctx[3].length - 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16777216) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_6(ctx);
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
    		source: "(134:4) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (149:3) {#each items as item}
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
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[27])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-w36hk7");
    			add_location(img, file, 153, 5, 5343);
    			attr_dev(div, "class", "item svelte-w36hk7");
    			set_style(div, "--width", style___width, false);
    			set_style(div, "--height", `400px`, false);
    			add_location(div, file, 149, 4, 5245);
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
    		source: "(149:3) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    // (148:2) <TinySlider gap="0.5rem" let:setIndex let:currentIndex let:sliderWidth on:end={() => console.log('reached end')}>
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
    		source: "(148:2) <TinySlider gap=\\\"0.5rem\\\" let:setIndex let:currentIndex let:sliderWidth on:end={() => console.log('reached end')}>",
    		ctx
    	});

    	return block;
    }

    // (159:4) {#each items as item, i}
    function create_each_block_4(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[12](/*setIndex*/ ctx[23], /*i*/ ctx[37]);
    	}

    	function focus_handler() {
    		return /*focus_handler*/ ctx[13](/*setIndex*/ ctx[23], /*i*/ ctx[37]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t = space();
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[27])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "height", "60");
    			attr_dev(img, "class", "svelte-w36hk7");
    			add_location(img, file, 164, 6, 5632);
    			attr_dev(button, "class", "dot svelte-w36hk7");
    			toggle_class(button, "active", /*i*/ ctx[37] == /*currentIndex*/ ctx[24]);
    			add_location(button, file, 159, 5, 5485);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", click_handler_3, false, false, false),
    					listen_dev(button, "focus", focus_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*currentIndex*/ 16777216) {
    				toggle_class(button, "active", /*i*/ ctx[37] == /*currentIndex*/ ctx[24]);
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
    		source: "(159:4) {#each items as item, i}",
    		ctx
    	});

    	return block;
    }

    // (158:3) 
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
    			attr_dev(div, "class", "dots svelte-w36hk7");
    			add_location(div, file, 157, 3, 5414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentIndex, setIndex, items*/ 25165832) {
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
    		source: "(158:3) ",
    		ctx
    	});

    	return block;
    }

    // (182:7) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}
    function create_if_block_5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[27])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-w36hk7");
    			add_location(img, file, 182, 8, 6221);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*portaitItems*/ 1 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[27])) {
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
    		source: "(182:7) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}",
    		ctx
    	});

    	return block;
    }

    // (180:5) {#each portaitItems as item, index}
    function create_each_block_3(ctx) {
    	let div;
    	let show_if = [/*index*/ ctx[29], /*index*/ ctx[29] + 1, /*index*/ ctx[29] - 1].some(func_1);
    	let t;

    	function func_1(...args) {
    		return /*func_1*/ ctx[9](/*shown*/ ctx[25], ...args);
    	}

    	let if_block = show_if && create_if_block_5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div, "class", "item svelte-w36hk7");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `300px`, false);
    			add_location(div, file, 180, 6, 6075);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*shown*/ 33554432) show_if = [/*index*/ ctx[29], /*index*/ ctx[29] + 1, /*index*/ ctx[29] - 1].some(func_1);

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
    		source: "(180:5) {#each portaitItems as item, index}",
    		ctx
    	});

    	return block;
    }

    // (179:4) <TinySlider gap="0.5rem" let:setIndex let:currentIndex let:shown bind:distanceToEnd bind:sliderWidth>
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
    			if (dirty[0] & /*portaitItems, shown*/ 33554433) {
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
    		source: "(179:4) <TinySlider gap=\\\"0.5rem\\\" let:setIndex let:currentIndex let:shown bind:distanceToEnd bind:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (189:6) {#if currentIndex > 0}
    function create_if_block_4(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[15](/*setIndex*/ ctx[23], /*currentIndex*/ ctx[24]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-w36hk7");
    			add_location(button, file, 189, 7, 6384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_4, false, false, false);
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
    		source: "(189:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (193:6) {#if currentIndex < portaitItems.length - 1}
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

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[16](/*setIndex*/ ctx[23], /*currentIndex*/ ctx[24]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-w36hk7");
    			add_location(button, file, 193, 7, 6549);
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(193:6) {#if currentIndex < portaitItems.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (188:5) <svelte:fragment slot="controls">
    function create_controls_slot_1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[24] > 0 && create_if_block_4(ctx);
    	let if_block1 = /*currentIndex*/ ctx[24] < /*portaitItems*/ ctx[0].length - 1 && create_if_block_3(ctx);

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
    			if (/*currentIndex*/ ctx[24] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16777216) {
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

    			if (/*currentIndex*/ ctx[24] < /*portaitItems*/ ctx[0].length - 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex, portaitItems*/ 16777217) {
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
    		source: "(188:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (205:4) {#each { length: 20 } as _}
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
    			attr_dev(strong, "class", "svelte-w36hk7");
    			add_location(strong, file, 206, 6, 7068);
    			attr_dev(div, "class", "item svelte-w36hk7");
    			set_style(div, "background-color", style_background_color, false);
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 205, 5, 6923);
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
    		source: "(205:4) {#each { length: 20 } as _}",
    		ctx
    	});

    	return block;
    }

    // (204:3) <TinySlider gap="0.5rem" fill={false} let:setIndex let:currentIndex let:shown>
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
    		source: "(204:3) <TinySlider gap=\\\"0.5rem\\\" fill={false} let:setIndex let:currentIndex let:shown>",
    		ctx
    	});

    	return block;
    }

    // (217:4) {#each { length: 20 } as _}
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
    			attr_dev(a, "class", "svelte-w36hk7");
    			add_location(a, file, 218, 6, 7400);
    			attr_dev(div, "class", "item svelte-w36hk7");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 217, 5, 7291);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_6*/ ctx[19], false, false, false);
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
    		source: "(217:4) {#each { length: 20 } as _}",
    		ctx
    	});

    	return block;
    }

    // (216:3) <TinySlider gap="0.5rem" fill={false}>
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
    		source: "(216:3) <TinySlider gap=\\\"0.5rem\\\" fill={false}>",
    		ctx
    	});

    	return block;
    }

    // (232:5) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}
    function create_if_block_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[27])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-w36hk7");
    			add_location(img, file, 232, 6, 7918);
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
    		source: "(232:5) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}",
    		ctx
    	});

    	return block;
    }

    // (229:2) {#each cardItems as item, index}
    function create_each_block(ctx) {
    	let div;
    	let a0;
    	let show_if = [/*index*/ ctx[29], /*index*/ ctx[29] + 1, /*index*/ ctx[29] - 1].some(func);
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
    		return /*func*/ ctx[8](/*shown*/ ctx[25], ...args);
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
    			attr_dev(a0, "class", "thumbnail svelte-w36hk7");
    			attr_dev(a0, "href", "https://google.com");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file, 230, 4, 7776);
    			attr_dev(a1, "class", "title svelte-w36hk7");
    			attr_dev(a1, "href", "https://google.com");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file, 236, 4, 7988);
    			attr_dev(p, "class", "svelte-w36hk7");
    			add_location(p, file, 238, 4, 8074);
    			attr_dev(a2, "class", "button svelte-w36hk7");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file, 242, 4, 8164);
    			attr_dev(div, "class", "card svelte-w36hk7");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 229, 3, 7669);
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
    					listen_dev(a2, "click", prevent_default(/*click_handler*/ ctx[7]), false, true, false),
    					listen_dev(div, "click", /*click_handler_9*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*shown*/ 33554432) show_if = [/*index*/ ctx[29], /*index*/ ctx[29] + 1, /*index*/ ctx[29] - 1].some(func);

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
    		source: "(229:2) {#each cardItems as item, index}",
    		ctx
    	});

    	return block;
    }

    // (228:1) <TinySlider gap="1rem" let:setIndex let:currentIndex let:shown let:reachedEnd>
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let each_value = /*cardItems*/ ctx[6];
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
    			if (dirty[0] & /*cardItems, shown*/ 33554496) {
    				each_value = /*cardItems*/ ctx[6];
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
    		source: "(228:1) <TinySlider gap=\\\"1rem\\\" let:setIndex let:currentIndex let:shown let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (248:3) {#if currentIndex > 0}
    function create_if_block_1(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_7() {
    		return /*click_handler_7*/ ctx[20](/*setIndex*/ ctx[23], /*currentIndex*/ ctx[24]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-w36hk7");
    			add_location(button, file, 248, 4, 8327);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(arrow, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_7, false, false, false);
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
    		source: "(248:3) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (252:3) {#if !reachedEnd}
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

    	function click_handler_8() {
    		return /*click_handler_8*/ ctx[21](/*setIndex*/ ctx[23], /*currentIndex*/ ctx[24]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-w36hk7");
    			add_location(button, file, 252, 4, 8456);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(252:3) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (247:2) <svelte:fragment slot="controls">
    function create_controls_slot(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[24] > 0 && create_if_block_1(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[26] && create_if_block(ctx);

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
    			if (/*currentIndex*/ ctx[24] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 16777216) {
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

    			if (!/*reachedEnd*/ ctx[26]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*reachedEnd*/ 67108864) {
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
    		source: "(247:2) <svelte:fragment slot=\\\"controls\\\">",
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
    	let div12;
    	let div0;
    	let p0;
    	let t5;
    	let p1;
    	let a;
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
    	let div3;
    	let h3;
    	let t48;
    	let p6;
    	let t49;
    	let code5;
    	let t50;
    	let mark9;
    	let t52;
    	let t53;
    	let t54;
    	let ul;
    	let li0;
    	let mark10;
    	let t56;
    	let t57;
    	let li1;
    	let mark11;
    	let t59;
    	let t60;
    	let p7;
    	let t61;
    	let code6;
    	let t63;
    	let t64;
    	let p8;
    	let code7;
    	let t65;
    	let mark12;
    	let t67;
    	let mark13;
    	let t69;
    	let mark14;
    	let t71;
    	let br4;
    	let t72;
    	let br5;
    	let t73;
    	let br6;
    	let t74;
    	let br7;
    	let t75;
    	let br8;
    	let t76;
    	let mark15;
    	let t78;
    	let br9;
    	let t79;
    	let mark16;
    	let t81;
    	let br10;
    	let t82;
    	let mark17;
    	let t84;
    	let mark18;
    	let t86;
    	let br11;
    	let t87;
    	let br12;
    	let t88;
    	let br13;
    	let t89;
    	let mark19;
    	let t91;
    	let br14;
    	let t92;
    	let mark20;
    	let t94;
    	let mark21;
    	let t96;
    	let br15;
    	let t97;
    	let br16;
    	let t98;
    	let br17;
    	let t99;
    	let mark22;
    	let t101;
    	let t102;
    	let div2;
    	let tinyslider2;
    	let t103;
    	let div4;
    	let tinyslider3;
    	let t104;
    	let div7;
    	let div6;
    	let div5;
    	let tinyslider4;
    	let updating_distanceToEnd;
    	let updating_sliderWidth;
    	let t105;
    	let div9;
    	let div8;
    	let tinyslider5;
    	let t106;
    	let div11;
    	let div10;
    	let tinyslider6;
    	let t107;
    	let div13;
    	let tinyslider7;
    	let t108;
    	let div14;
    	let current;

    	tinyslider0 = new TinySlider({
    			props: {
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider1 = new TinySlider({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider2 = new TinySlider({
    			props: {
    				$$slots: {
    					controls: [
    						create_controls_slot_3,
    						({ setIndex, currentIndex }) => ({ 23: setIndex, 24: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 8388608 : 0) | (currentIndex ? 16777216 : 0)]
    					],
    					default: [
    						create_default_slot_5,
    						({ setIndex, currentIndex }) => ({ 23: setIndex, 24: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 8388608 : 0) | (currentIndex ? 16777216 : 0)]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider3 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				$$slots: {
    					controls: [
    						create_controls_slot_2,
    						({ setIndex, currentIndex, sliderWidth }) => ({
    							23: setIndex,
    							24: currentIndex,
    							2: sliderWidth
    						}),
    						({ setIndex, currentIndex, sliderWidth }) => [
    							(setIndex ? 8388608 : 0) | (currentIndex ? 16777216 : 0) | (sliderWidth ? 4 : 0)
    						]
    					],
    					default: [
    						create_default_slot_4,
    						({ setIndex, currentIndex, sliderWidth }) => ({
    							23: setIndex,
    							24: currentIndex,
    							2: sliderWidth
    						}),
    						({ setIndex, currentIndex, sliderWidth }) => [
    							(setIndex ? 8388608 : 0) | (currentIndex ? 16777216 : 0) | (sliderWidth ? 4 : 0)
    						]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider3.$on("end", /*end_handler*/ ctx[14]);

    	function tinyslider4_distanceToEnd_binding(value) {
    		/*tinyslider4_distanceToEnd_binding*/ ctx[17](value);
    	}

    	function tinyslider4_sliderWidth_binding(value) {
    		/*tinyslider4_sliderWidth_binding*/ ctx[18](value);
    	}

    	let tinyslider4_props = {
    		gap: "0.5rem",
    		$$slots: {
    			controls: [
    				create_controls_slot_1,
    				({ setIndex, currentIndex, shown }) => ({
    					23: setIndex,
    					24: currentIndex,
    					25: shown
    				}),
    				({ setIndex, currentIndex, shown }) => [
    					(setIndex ? 8388608 : 0) | (currentIndex ? 16777216 : 0) | (shown ? 33554432 : 0)
    				]
    			],
    			default: [
    				create_default_slot_3,
    				({ setIndex, currentIndex, shown }) => ({
    					23: setIndex,
    					24: currentIndex,
    					25: shown
    				}),
    				({ setIndex, currentIndex, shown }) => [
    					(setIndex ? 8388608 : 0) | (currentIndex ? 16777216 : 0) | (shown ? 33554432 : 0)
    				]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*distanceToEnd*/ ctx[1] !== void 0) {
    		tinyslider4_props.distanceToEnd = /*distanceToEnd*/ ctx[1];
    	}

    	if (/*sliderWidth*/ ctx[2] !== void 0) {
    		tinyslider4_props.sliderWidth = /*sliderWidth*/ ctx[2];
    	}

    	tinyslider4 = new TinySlider({ props: tinyslider4_props, $$inline: true });
    	binding_callbacks.push(() => bind(tinyslider4, 'distanceToEnd', tinyslider4_distanceToEnd_binding));
    	binding_callbacks.push(() => bind(tinyslider4, 'sliderWidth', tinyslider4_sliderWidth_binding));

    	tinyslider5 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				fill: false,
    				$$slots: {
    					default: [
    						create_default_slot_2,
    						({ setIndex, currentIndex, shown }) => ({
    							23: setIndex,
    							24: currentIndex,
    							25: shown
    						}),
    						({ setIndex, currentIndex, shown }) => [
    							(setIndex ? 8388608 : 0) | (currentIndex ? 16777216 : 0) | (shown ? 33554432 : 0)
    						]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider6 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				fill: false,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider7 = new TinySlider({
    			props: {
    				gap: "1rem",
    				$$slots: {
    					controls: [
    						create_controls_slot,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							23: setIndex,
    							24: currentIndex,
    							25: shown,
    							26: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 8388608 : 0) | (currentIndex ? 16777216 : 0) | (shown ? 33554432 : 0) | (reachedEnd ? 67108864 : 0)
    						]
    					],
    					default: [
    						create_default_slot,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							23: setIndex,
    							24: currentIndex,
    							25: shown,
    							26: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 8388608 : 0) | (currentIndex ? 16777216 : 0) | (shown ? 33554432 : 0) | (reachedEnd ? 67108864 : 0)
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
    			div12 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Svelte Tiny Slider is an easy to use highly customizable and unopinionated carousel or slider. There is little to no styling and how you structure your content is up to you. Works with touch and keyboard controls. Made with accessiblity in mind.";
    			t5 = space();
    			p1 = element("p");
    			a = element("a");
    			a.textContent = "GitHub";
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
    			div3 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Controls";
    			t48 = space();
    			p6 = element("p");
    			t49 = text("From this point there are several options to any kind of controls you can think of. There are several ways you can add controls. The easiest way is to use ");
    			code5 = element("code");
    			t50 = text("slot=\"");
    			mark9 = element("mark");
    			mark9.textContent = "controls";
    			t52 = text("\"");
    			t53 = text(" and use it's slot props.");
    			t54 = space();
    			ul = element("ul");
    			li0 = element("li");
    			mark10 = element("mark");
    			mark10.textContent = "setIndex";
    			t56 = text(" is a function that accepts an index of the slide you want to navigate to.");
    			t57 = space();
    			li1 = element("li");
    			mark11 = element("mark");
    			mark11.textContent = "currentIndex";
    			t59 = text(" is an integer of the index you are current only on.");
    			t60 = space();
    			p7 = element("p");
    			t61 = text("In this example we are using ");
    			code6 = element("code");
    			code6.textContent = "svelte:fragment";
    			t63 = text(" but it could be any element you want it to be. Styling isn't included in this code example.");
    			t64 = space();
    			p8 = element("p");
    			code7 = element("code");
    			t65 = text("<");
    			mark12 = element("mark");
    			mark12.textContent = "TinySlider";
    			t67 = text(" let:");
    			mark13 = element("mark");
    			mark13.textContent = "setIndex";
    			t69 = text(" let:");
    			mark14 = element("mark");
    			mark14.textContent = "currentIndex";
    			t71 = text("> ");
    			br4 = element("br");
    			t72 = text("\r\n\t\t\t\t  {#each items as item} ");
    			br5 = element("br");
    			t73 = text("\r\n\t\t\t\t    <img src={item} alt=\"\" /> ");
    			br6 = element("br");
    			t74 = text("\r\n\t\t\t\t  {/each} ");
    			br7 = element("br");
    			t75 = space();
    			br8 = element("br");
    			t76 = text("\r\n\t\t\t\t  <svelte:fragment slot=\"");
    			mark15 = element("mark");
    			mark15.textContent = "controls";
    			t78 = text("\"> ");
    			br9 = element("br");
    			t79 = text("\r\n\t\t\t\t    {#if ");
    			mark16 = element("mark");
    			mark16.textContent = "currentIndex";
    			t81 = text(" > 0} ");
    			br10 = element("br");
    			t82 = text("\r\n\t\t\t\t      <button on:click={() => ");
    			mark17 = element("mark");
    			mark17.textContent = "setIndex";
    			t84 = text("(");
    			mark18 = element("mark");
    			mark18.textContent = "currentIndex";
    			t86 = text(" - 1)}>...</button> ");
    			br11 = element("br");
    			t87 = text("\r\n\t\t\t\t    {/if} ");
    			br12 = element("br");
    			t88 = space();
    			br13 = element("br");
    			t89 = text("\r\n\t\t\t\t    {#if ");
    			mark19 = element("mark");
    			mark19.textContent = "currentIndex";
    			t91 = text(" < portaitItems.length - 1} ");
    			br14 = element("br");
    			t92 = text("\r\n\t\t\t\t      <button on:click={() => ");
    			mark20 = element("mark");
    			mark20.textContent = "setIndex";
    			t94 = text("(");
    			mark21 = element("mark");
    			mark21.textContent = "currentIndex";
    			t96 = text(" + 1)}>...</button> ");
    			br15 = element("br");
    			t97 = text("\r\n\t\t\t\t    {/if} ");
    			br16 = element("br");
    			t98 = text("\r\n\t\t\t\t  </svelte:fragment> ");
    			br17 = element("br");
    			t99 = text("\r\n\t\t\t\t</");
    			mark22 = element("mark");
    			mark22.textContent = "TinySlider";
    			t101 = text(">");
    			t102 = space();
    			div2 = element("div");
    			create_component(tinyslider2.$$.fragment);
    			t103 = space();
    			div4 = element("div");
    			create_component(tinyslider3.$$.fragment);
    			t104 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			create_component(tinyslider4.$$.fragment);
    			t105 = space();
    			div9 = element("div");
    			div8 = element("div");
    			create_component(tinyslider5.$$.fragment);
    			t106 = space();
    			div11 = element("div");
    			div10 = element("div");
    			create_component(tinyslider6.$$.fragment);
    			t107 = space();
    			div13 = element("div");
    			create_component(tinyslider7.$$.fragment);
    			t108 = space();
    			div14 = element("div");
    			attr_dev(mark0, "class", "svelte-w36hk7");
    			add_location(mark0, file, 29, 5, 825);
    			attr_dev(h1, "class", "svelte-w36hk7");
    			add_location(h1, file, 29, 1, 821);
    			attr_dev(header, "class", "svelte-w36hk7");
    			add_location(header, file, 28, 0, 810);
    			attr_dev(p0, "class", "svelte-w36hk7");
    			add_location(p0, file, 40, 2, 1078);
    			attr_dev(a, "href", "https://github.com/Mitcheljager/svelte-tiny-linked-charts");
    			attr_dev(a, "class", "svelte-w36hk7");
    			add_location(a, file, 42, 5, 1339);
    			attr_dev(p1, "class", "svelte-w36hk7");
    			add_location(p1, file, 42, 2, 1336);
    			attr_dev(h20, "class", "svelte-w36hk7");
    			add_location(h20, file, 44, 2, 1427);
    			attr_dev(p2, "class", "svelte-w36hk7");
    			add_location(p2, file, 46, 2, 1454);
    			attr_dev(mark1, "class", "svelte-w36hk7");
    			add_location(mark1, file, 49, 12, 1526);
    			attr_dev(code0, "class", "well svelte-w36hk7");
    			add_location(code0, file, 48, 2, 1493);
    			attr_dev(mark2, "class", "svelte-w36hk7");
    			add_location(mark2, file, 53, 22, 1617);
    			attr_dev(code1, "class", "well svelte-w36hk7");
    			add_location(code1, file, 52, 2, 1574);
    			attr_dev(p3, "class", "svelte-w36hk7");
    			add_location(p3, file, 56, 2, 1665);
    			attr_dev(mark3, "class", "svelte-w36hk7");
    			add_location(mark3, file, 59, 17, 1747);
    			attr_dev(mark4, "class", "svelte-w36hk7");
    			add_location(mark4, file, 59, 54, 1784);
    			attr_dev(code2, "class", "well svelte-w36hk7");
    			add_location(code2, file, 58, 2, 1709);
    			attr_dev(mark5, "class", "svelte-w36hk7");
    			add_location(mark5, file, 63, 7, 1861);
    			attr_dev(mark6, "class", "svelte-w36hk7");
    			add_location(mark6, file, 65, 8, 1907);
    			attr_dev(code3, "class", "well svelte-w36hk7");
    			add_location(code3, file, 62, 2, 1833);
    			attr_dev(div0, "class", "block svelte-w36hk7");
    			add_location(div0, file, 39, 1, 1055);
    			attr_dev(h21, "class", "svelte-w36hk7");
    			add_location(h21, file, 69, 1, 1959);
    			attr_dev(p4, "class", "svelte-w36hk7");
    			add_location(p4, file, 72, 2, 2001);
    			attr_dev(mark7, "class", "svelte-w36hk7");
    			add_location(mark7, file, 76, 8, 2307);
    			attr_dev(br0, "class", "svelte-w36hk7");
    			add_location(br0, file, 76, 36, 2335);
    			attr_dev(br1, "class", "svelte-w36hk7");
    			add_location(br1, file, 77, 48, 2389);
    			attr_dev(br2, "class", "svelte-w36hk7");
    			add_location(br2, file, 78, 70, 2465);
    			attr_dev(br3, "class", "svelte-w36hk7");
    			add_location(br3, file, 79, 34, 2505);
    			attr_dev(mark8, "class", "svelte-w36hk7");
    			add_location(mark8, file, 80, 9, 2520);
    			attr_dev(code4, "class", "well svelte-w36hk7");
    			add_location(code4, file, 75, 3, 2278);
    			attr_dev(p5, "class", "svelte-w36hk7");
    			add_location(p5, file, 74, 2, 2270);
    			attr_dev(div1, "class", "block svelte-w36hk7");
    			add_location(div1, file, 71, 1, 1978);
    			attr_dev(h3, "class", "svelte-w36hk7");
    			add_location(h3, file, 92, 2, 2713);
    			attr_dev(mark9, "class", "svelte-w36hk7");
    			add_location(mark9, file, 95, 185, 2926);
    			attr_dev(code5, "class", "inline svelte-w36hk7");
    			add_location(code5, file, 95, 158, 2899);
    			attr_dev(p6, "class", "svelte-w36hk7");
    			add_location(p6, file, 94, 2, 2736);
    			attr_dev(mark10, "class", "svelte-w36hk7");
    			add_location(mark10, file, 99, 7, 3007);
    			attr_dev(li0, "class", "svelte-w36hk7");
    			add_location(li0, file, 99, 3, 3003);
    			attr_dev(mark11, "class", "svelte-w36hk7");
    			add_location(mark11, file, 100, 7, 3116);
    			attr_dev(li1, "class", "svelte-w36hk7");
    			add_location(li1, file, 100, 3, 3112);
    			attr_dev(ul, "class", "svelte-w36hk7");
    			add_location(ul, file, 98, 2, 2994);
    			attr_dev(code6, "class", "inline svelte-w36hk7");
    			add_location(code6, file, 104, 32, 3250);
    			attr_dev(p7, "class", "svelte-w36hk7");
    			add_location(p7, file, 103, 2, 3213);
    			attr_dev(mark12, "class", "svelte-w36hk7");
    			add_location(mark12, file, 109, 8, 3436);
    			attr_dev(mark13, "class", "svelte-w36hk7");
    			add_location(mark13, file, 109, 36, 3464);
    			attr_dev(mark14, "class", "svelte-w36hk7");
    			add_location(mark14, file, 109, 62, 3490);
    			attr_dev(br4, "class", "svelte-w36hk7");
    			add_location(br4, file, 109, 92, 3520);
    			attr_dev(br5, "class", "svelte-w36hk7");
    			add_location(br5, file, 110, 48, 3574);
    			attr_dev(br6, "class", "svelte-w36hk7");
    			add_location(br6, file, 111, 70, 3650);
    			attr_dev(br7, "class", "svelte-w36hk7");
    			add_location(br7, file, 112, 34, 3690);
    			attr_dev(br8, "class", "svelte-w36hk7");
    			add_location(br8, file, 113, 4, 3700);
    			attr_dev(mark15, "class", "svelte-w36hk7");
    			add_location(mark15, file, 114, 42, 3748);
    			attr_dev(br9, "class", "svelte-w36hk7");
    			add_location(br9, file, 114, 69, 3775);
    			attr_dev(mark16, "class", "svelte-w36hk7");
    			add_location(mark16, file, 115, 38, 3819);
    			attr_dev(br10, "class", "svelte-w36hk7");
    			add_location(br10, file, 115, 77, 3858);
    			attr_dev(mark17, "class", "svelte-w36hk7");
    			add_location(mark17, file, 116, 75, 3939);
    			attr_dev(mark18, "class", "svelte-w36hk7");
    			add_location(mark18, file, 116, 97, 3961);
    			attr_dev(br11, "class", "svelte-w36hk7");
    			add_location(br11, file, 116, 156, 4020);
    			attr_dev(br12, "class", "svelte-w36hk7");
    			add_location(br12, file, 117, 44, 4070);
    			attr_dev(br13, "class", "svelte-w36hk7");
    			add_location(br13, file, 118, 4, 4080);
    			attr_dev(mark19, "class", "svelte-w36hk7");
    			add_location(mark19, file, 119, 38, 4124);
    			attr_dev(br14, "class", "svelte-w36hk7");
    			add_location(br14, file, 119, 99, 4185);
    			attr_dev(mark20, "class", "svelte-w36hk7");
    			add_location(mark20, file, 120, 75, 4266);
    			attr_dev(mark21, "class", "svelte-w36hk7");
    			add_location(mark21, file, 120, 97, 4288);
    			attr_dev(br15, "class", "svelte-w36hk7");
    			add_location(br15, file, 120, 156, 4347);
    			attr_dev(br16, "class", "svelte-w36hk7");
    			add_location(br16, file, 121, 44, 4397);
    			attr_dev(br17, "class", "svelte-w36hk7");
    			add_location(br17, file, 122, 41, 4444);
    			attr_dev(mark22, "class", "svelte-w36hk7");
    			add_location(mark22, file, 123, 9, 4459);
    			attr_dev(code7, "class", "well svelte-w36hk7");
    			add_location(code7, file, 108, 3, 3407);
    			attr_dev(p8, "class", "svelte-w36hk7");
    			add_location(p8, file, 107, 2, 3399);
    			attr_dev(div2, "class", "relative svelte-w36hk7");
    			add_location(div2, file, 127, 2, 4512);
    			attr_dev(div3, "class", "block svelte-w36hk7");
    			add_location(div3, file, 91, 1, 2690);
    			attr_dev(div4, "class", "block svelte-w36hk7");
    			add_location(div4, file, 146, 1, 5077);
    			attr_dev(div5, "class", "slider-wrapper svelte-w36hk7");
    			add_location(div5, file, 177, 3, 5890);
    			attr_dev(div6, "class", "relative svelte-w36hk7");
    			add_location(div6, file, 176, 2, 5863);
    			attr_dev(div7, "class", "block svelte-w36hk7");
    			add_location(div7, file, 175, 1, 5840);
    			attr_dev(div8, "class", "slider-wrapper svelte-w36hk7");
    			add_location(div8, file, 202, 2, 6772);
    			attr_dev(div9, "class", "block svelte-w36hk7");
    			add_location(div9, file, 201, 1, 6749);
    			attr_dev(div10, "class", "slider-wrapper svelte-w36hk7");
    			add_location(div10, file, 214, 2, 7180);
    			attr_dev(div11, "class", "block svelte-w36hk7");
    			add_location(div11, file, 213, 1, 7157);
    			attr_dev(div12, "class", "wrapper svelte-w36hk7");
    			add_location(div12, file, 38, 0, 1031);
    			attr_dev(div13, "class", "cards svelte-w36hk7");
    			add_location(div13, file, 226, 0, 7528);
    			attr_dev(div14, "class", "wrapper svelte-w36hk7");
    			add_location(div14, file, 258, 0, 8624);
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
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t5);
    			append_dev(div0, p1);
    			append_dev(p1, a);
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
    			append_dev(div12, t31);
    			append_dev(div12, h21);
    			append_dev(div12, t33);
    			append_dev(div12, div1);
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
    			append_dev(div12, t46);
    			append_dev(div12, div3);
    			append_dev(div3, h3);
    			append_dev(div3, t48);
    			append_dev(div3, p6);
    			append_dev(p6, t49);
    			append_dev(p6, code5);
    			append_dev(code5, t50);
    			append_dev(code5, mark9);
    			append_dev(code5, t52);
    			append_dev(p6, t53);
    			append_dev(div3, t54);
    			append_dev(div3, ul);
    			append_dev(ul, li0);
    			append_dev(li0, mark10);
    			append_dev(li0, t56);
    			append_dev(ul, t57);
    			append_dev(ul, li1);
    			append_dev(li1, mark11);
    			append_dev(li1, t59);
    			append_dev(div3, t60);
    			append_dev(div3, p7);
    			append_dev(p7, t61);
    			append_dev(p7, code6);
    			append_dev(p7, t63);
    			append_dev(div3, t64);
    			append_dev(div3, p8);
    			append_dev(p8, code7);
    			append_dev(code7, t65);
    			append_dev(code7, mark12);
    			append_dev(code7, t67);
    			append_dev(code7, mark13);
    			append_dev(code7, t69);
    			append_dev(code7, mark14);
    			append_dev(code7, t71);
    			append_dev(code7, br4);
    			append_dev(code7, t72);
    			append_dev(code7, br5);
    			append_dev(code7, t73);
    			append_dev(code7, br6);
    			append_dev(code7, t74);
    			append_dev(code7, br7);
    			append_dev(code7, t75);
    			append_dev(code7, br8);
    			append_dev(code7, t76);
    			append_dev(code7, mark15);
    			append_dev(code7, t78);
    			append_dev(code7, br9);
    			append_dev(code7, t79);
    			append_dev(code7, mark16);
    			append_dev(code7, t81);
    			append_dev(code7, br10);
    			append_dev(code7, t82);
    			append_dev(code7, mark17);
    			append_dev(code7, t84);
    			append_dev(code7, mark18);
    			append_dev(code7, t86);
    			append_dev(code7, br11);
    			append_dev(code7, t87);
    			append_dev(code7, br12);
    			append_dev(code7, t88);
    			append_dev(code7, br13);
    			append_dev(code7, t89);
    			append_dev(code7, mark19);
    			append_dev(code7, t91);
    			append_dev(code7, br14);
    			append_dev(code7, t92);
    			append_dev(code7, mark20);
    			append_dev(code7, t94);
    			append_dev(code7, mark21);
    			append_dev(code7, t96);
    			append_dev(code7, br15);
    			append_dev(code7, t97);
    			append_dev(code7, br16);
    			append_dev(code7, t98);
    			append_dev(code7, br17);
    			append_dev(code7, t99);
    			append_dev(code7, mark22);
    			append_dev(code7, t101);
    			append_dev(div3, t102);
    			append_dev(div3, div2);
    			mount_component(tinyslider2, div2, null);
    			append_dev(div12, t103);
    			append_dev(div12, div4);
    			mount_component(tinyslider3, div4, null);
    			append_dev(div12, t104);
    			append_dev(div12, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			mount_component(tinyslider4, div5, null);
    			append_dev(div12, t105);
    			append_dev(div12, div9);
    			append_dev(div9, div8);
    			mount_component(tinyslider5, div8, null);
    			append_dev(div12, t106);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			mount_component(tinyslider6, div10, null);
    			insert_dev(target, t107, anchor);
    			insert_dev(target, div13, anchor);
    			mount_component(tinyslider7, div13, null);
    			insert_dev(target, t108, anchor);
    			insert_dev(target, div14, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tinyslider0_changes = {};

    			if (dirty[1] & /*$$scope*/ 32768) {
    				tinyslider0_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider0.$set(tinyslider0_changes);
    			const tinyslider1_changes = {};

    			if (dirty[1] & /*$$scope*/ 32768) {
    				tinyslider1_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider1.$set(tinyslider1_changes);
    			const tinyslider2_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 25165824 | dirty[1] & /*$$scope*/ 32768) {
    				tinyslider2_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider2.$set(tinyslider2_changes);
    			const tinyslider3_changes = {};

    			if (dirty[0] & /*currentIndex, setIndex, sliderWidth*/ 25165828 | dirty[1] & /*$$scope*/ 32768) {
    				tinyslider3_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider3.$set(tinyslider3_changes);
    			const tinyslider4_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex, portaitItems, shown*/ 58720257 | dirty[1] & /*$$scope*/ 32768) {
    				tinyslider4_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_distanceToEnd && dirty[0] & /*distanceToEnd*/ 2) {
    				updating_distanceToEnd = true;
    				tinyslider4_changes.distanceToEnd = /*distanceToEnd*/ ctx[1];
    				add_flush_callback(() => updating_distanceToEnd = false);
    			}

    			if (!updating_sliderWidth && dirty[0] & /*sliderWidth*/ 4) {
    				updating_sliderWidth = true;
    				tinyslider4_changes.sliderWidth = /*sliderWidth*/ ctx[2];
    				add_flush_callback(() => updating_sliderWidth = false);
    			}

    			tinyslider4.$set(tinyslider4_changes);
    			const tinyslider5_changes = {};

    			if (dirty[1] & /*$$scope*/ 32768) {
    				tinyslider5_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider5.$set(tinyslider5_changes);
    			const tinyslider6_changes = {};

    			if (dirty[1] & /*$$scope*/ 32768) {
    				tinyslider6_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider6.$set(tinyslider6_changes);
    			const tinyslider7_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex, reachedEnd, shown*/ 125829120 | dirty[1] & /*$$scope*/ 32768) {
    				tinyslider7_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider7.$set(tinyslider7_changes);
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
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(tinyslider0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div12);
    			destroy_component(tinyslider1);
    			destroy_component(tinyslider2);
    			destroy_component(tinyslider3);
    			destroy_component(tinyslider4);
    			destroy_component(tinyslider5);
    			destroy_component(tinyslider6);
    			if (detaching) detach_dev(t107);
    			if (detaching) detach_dev(div13);
    			destroy_component(tinyslider7);
    			if (detaching) detach_dev(t108);
    			if (detaching) detach_dev(div14);
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
    	const click_handler_1 = (setIndex, currentIndex) => setIndex(currentIndex - 1);
    	const click_handler_2 = (setIndex, currentIndex) => setIndex(currentIndex + 1);
    	const click_handler_3 = (setIndex, i) => setIndex(i);
    	const focus_handler = (setIndex, i) => setIndex(i);
    	const end_handler = () => console.log('reached end');
    	const click_handler_4 = (setIndex, currentIndex) => setIndex(currentIndex - 2);
    	const click_handler_5 = (setIndex, currentIndex) => setIndex(currentIndex + 2);

    	function tinyslider4_distanceToEnd_binding(value) {
    		distanceToEnd = value;
    		$$invalidate(1, distanceToEnd);
    	}

    	function tinyslider4_sliderWidth_binding(value) {
    		sliderWidth = value;
    		$$invalidate(2, sliderWidth);
    	}

    	const click_handler_6 = () => console.log('click');
    	const click_handler_7 = (setIndex, currentIndex) => setIndex(currentIndex - 2);
    	const click_handler_8 = (setIndex, currentIndex) => setIndex(currentIndex + 2);
    	const click_handler_9 = () => console.log('click');

    	$$self.$capture_state = () => ({
    		Arrow,
    		TinySlider,
    		items,
    		fixedItems,
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
    		fixedItems,
    		headerItems,
    		cardItems,
    		click_handler,
    		func,
    		func_1,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		focus_handler,
    		end_handler,
    		click_handler_4,
    		click_handler_5,
    		tinyslider4_distanceToEnd_binding,
    		tinyslider4_sliderWidth_binding,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9
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
