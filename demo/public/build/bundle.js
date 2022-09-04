
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
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[46] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[46] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    function get_each_context_9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    function get_each_context_11(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    function get_each_context_10(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[46] = i;
    	return child_ctx;
    }

    function get_each_context_13(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    function get_each_context_12(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	child_ctx[46] = i;
    	return child_ctx;
    }

    function get_each_context_14(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    function get_each_context_15(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    function get_each_context_16(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    // (42:2) {#each headerItems as item}
    function create_each_block_16(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "200");
    			attr_dev(img, "height", "150");
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-37w21y");
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
    		id: create_each_block_16.name,
    		type: "each",
    		source: "(42:2) {#each headerItems as item}",
    		ctx
    	});

    	return block;
    }

    // (41:1) <TinySlider>
    function create_default_slot_13(ctx) {
    	let each_1_anchor;
    	let each_value_16 = /*headerItems*/ ctx[11];
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
    			if (dirty[0] & /*headerItems*/ 2048) {
    				each_value_16 = /*headerItems*/ ctx[11];
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
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(41:1) <TinySlider>",
    		ctx
    	});

    	return block;
    }

    // (95:3) {#each fixedItems as item}
    function create_each_block_15(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 95, 4, 3030);
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
    		source: "(95:3) {#each fixedItems as item}",
    		ctx
    	});

    	return block;
    }

    // (94:2) <TinySlider>
    function create_default_slot_12(ctx) {
    	let each_1_anchor;
    	let each_value_15 = /*fixedItems*/ ctx[4];
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
    			if (dirty[0] & /*fixedItems*/ 16) {
    				each_value_15 = /*fixedItems*/ ctx[4];
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
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(94:2) <TinySlider>",
    		ctx
    	});

    	return block;
    }

    // (142:4) {#each fixedItems2 as item}
    function create_each_block_14(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 142, 5, 5207);
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
    		source: "(142:4) {#each fixedItems2 as item}",
    		ctx
    	});

    	return block;
    }

    // (141:3) <TinySlider let:setIndex let:currentIndex>
    function create_default_slot_11(ctx) {
    	let each_1_anchor;
    	let each_value_14 = /*fixedItems2*/ ctx[5];
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
    			if (dirty[0] & /*fixedItems2*/ 32) {
    				each_value_14 = /*fixedItems2*/ ctx[5];
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
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(141:3) <TinySlider let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (147:5) {#if currentIndex > 0}
    function create_if_block_10(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[16](/*setIndex*/ ctx[1], /*currentIndex*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-37w21y");
    			add_location(button, file, 147, 6, 5323);
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
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(147:5) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (151:5) {#if currentIndex < items.length - 1}
    function create_if_block_9(ctx) {
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
    		return /*click_handler_2*/ ctx[17](/*setIndex*/ ctx[1], /*currentIndex*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-37w21y");
    			add_location(button, file, 151, 6, 5478);
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
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(151:5) {#if currentIndex < items.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (146:4) <svelte:fragment slot="controls">
    function create_controls_slot_6(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[2] > 0 && create_if_block_10(ctx);
    	let if_block1 = /*currentIndex*/ ctx[2] < /*items*/ ctx[3].length - 1 && create_if_block_9(ctx);

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
    			if (/*currentIndex*/ ctx[2] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_10(ctx);
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

    			if (/*currentIndex*/ ctx[2] < /*items*/ ctx[3].length - 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_9(ctx);
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
    		source: "(146:4) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (180:4) {#each fixedItems4 as item}
    function create_each_block_13(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 180, 5, 6703);
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
    		id: create_each_block_13.name,
    		type: "each",
    		source: "(180:4) {#each fixedItems4 as item}",
    		ctx
    	});

    	return block;
    }

    // (179:3) <TinySlider let:setIndex let:currentIndex>
    function create_default_slot_10(ctx) {
    	let each_1_anchor;
    	let each_value_13 = /*fixedItems4*/ ctx[7];
    	validate_each_argument(each_value_13);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_13.length; i += 1) {
    		each_blocks[i] = create_each_block_13(get_each_context_13(ctx, each_value_13, i));
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
    			if (dirty[0] & /*fixedItems4*/ 128) {
    				each_value_13 = /*fixedItems4*/ ctx[7];
    				validate_each_argument(each_value_13);
    				let i;

    				for (i = 0; i < each_value_13.length; i += 1) {
    					const child_ctx = get_each_context_13(ctx, each_value_13, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_13(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_13.length;
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
    		source: "(179:3) <TinySlider let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (185:5) {#each fixedItems4 as _, i}
    function create_each_block_12(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[18](/*setIndex*/ ctx[1], /*i*/ ctx[46]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "dot svelte-37w21y");
    			toggle_class(button, "active", /*i*/ ctx[46] == /*currentIndex*/ ctx[2]);
    			add_location(button, file, 185, 6, 6825);
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

    			if (dirty[0] & /*currentIndex*/ 4) {
    				toggle_class(button, "active", /*i*/ ctx[46] == /*currentIndex*/ ctx[2]);
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
    		id: create_each_block_12.name,
    		type: "each",
    		source: "(185:5) {#each fixedItems4 as _, i}",
    		ctx
    	});

    	return block;
    }

    // (184:4) 
    function create_controls_slot_5(ctx) {
    	let div;
    	let each_value_12 = /*fixedItems4*/ ctx[7];
    	validate_each_argument(each_value_12);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_12.length; i += 1) {
    		each_blocks[i] = create_each_block_12(get_each_context_12(ctx, each_value_12, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "slot", "controls");
    			attr_dev(div, "class", "dots svelte-37w21y");
    			add_location(div, file, 183, 4, 6749);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentIndex, setIndex*/ 6) {
    				each_value_12 = /*fixedItems4*/ ctx[7];
    				validate_each_argument(each_value_12);
    				let i;

    				for (i = 0; i < each_value_12.length; i += 1) {
    					const child_ctx = get_each_context_12(ctx, each_value_12, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_12(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_12.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot_5.name,
    		type: "slot",
    		source: "(184:4) ",
    		ctx
    	});

    	return block;
    }

    // (220:4) {#each fixedItems3 as item}
    function create_each_block_11(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 220, 5, 8304);
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
    		id: create_each_block_11.name,
    		type: "each",
    		source: "(220:4) {#each fixedItems3 as item}",
    		ctx
    	});

    	return block;
    }

    // (219:3) <TinySlider let:setIndex let:currentIndex>
    function create_default_slot_9(ctx) {
    	let each_1_anchor;
    	let each_value_11 = /*fixedItems3*/ ctx[6];
    	validate_each_argument(each_value_11);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_11.length; i += 1) {
    		each_blocks[i] = create_each_block_11(get_each_context_11(ctx, each_value_11, i));
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
    			if (dirty[0] & /*fixedItems3*/ 64) {
    				each_value_11 = /*fixedItems3*/ ctx[6];
    				validate_each_argument(each_value_11);
    				let i;

    				for (i = 0; i < each_value_11.length; i += 1) {
    					const child_ctx = get_each_context_11(ctx, each_value_11, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_11(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_11.length;
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
    		source: "(219:3) <TinySlider let:setIndex let:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (225:5) {#each fixedItems3 as item, i}
    function create_each_block_10(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[19](/*setIndex*/ ctx[1], /*i*/ ctx[46]);
    	}

    	function focus_handler() {
    		return /*focus_handler*/ ctx[20](/*setIndex*/ ctx[1], /*i*/ ctx[46]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "height", "60");
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 230, 7, 8598);
    			attr_dev(button, "class", "thumbnail svelte-37w21y");
    			toggle_class(button, "active", /*i*/ ctx[46] == /*currentIndex*/ ctx[2]);
    			add_location(button, file, 225, 6, 8440);
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

    			if (dirty[0] & /*currentIndex*/ 4) {
    				toggle_class(button, "active", /*i*/ ctx[46] == /*currentIndex*/ ctx[2]);
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
    		id: create_each_block_10.name,
    		type: "each",
    		source: "(225:5) {#each fixedItems3 as item, i}",
    		ctx
    	});

    	return block;
    }

    // (224:4) 
    function create_controls_slot_4(ctx) {
    	let div;
    	let each_value_10 = /*fixedItems3*/ ctx[6];
    	validate_each_argument(each_value_10);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_10.length; i += 1) {
    		each_blocks[i] = create_each_block_10(get_each_context_10(ctx, each_value_10, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "slot", "controls");
    			attr_dev(div, "class", "thumbnails grid svelte-37w21y");
    			add_location(div, file, 223, 4, 8350);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentIndex, setIndex, fixedItems3*/ 70) {
    				each_value_10 = /*fixedItems3*/ ctx[6];
    				validate_each_argument(each_value_10);
    				let i;

    				for (i = 0; i < each_value_10.length; i += 1) {
    					const child_ctx = get_each_context_10(ctx, each_value_10, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_10(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_10.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot_4.name,
    		type: "slot",
    		source: "(224:4) ",
    		ctx
    	});

    	return block;
    }

    // (261:3) {#each fixedItems4 as item}
    function create_each_block_9(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 261, 4, 9957);
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
    		id: create_each_block_9.name,
    		type: "each",
    		source: "(261:3) {#each fixedItems4 as item}",
    		ctx
    	});

    	return block;
    }

    // (260:2) <TinySlider bind:setIndex bind:currentIndex>
    function create_default_slot_8(ctx) {
    	let each_1_anchor;
    	let each_value_9 = /*fixedItems4*/ ctx[7];
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
    			if (dirty[0] & /*fixedItems4*/ 128) {
    				each_value_9 = /*fixedItems4*/ ctx[7];
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
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(260:2) <TinySlider bind:setIndex bind:currentIndex>",
    		ctx
    	});

    	return block;
    }

    // (295:3) {#each fixedItems5 as item}
    function create_each_block_8(ctx) {
    	let img;
    	let img_src_value;
    	let img_width_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", img_width_value = /*sliderWidth*/ ctx[13] / 3);
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 295, 4, 11631);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sliderWidth*/ 8192 && img_width_value !== (img_width_value = /*sliderWidth*/ ctx[13] / 3)) {
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
    		source: "(295:3) {#each fixedItems5 as item}",
    		ctx
    	});

    	return block;
    }

    // (294:2) <TinySlider let:sliderWidth>
    function create_default_slot_7(ctx) {
    	let each_1_anchor;
    	let each_value_8 = /*fixedItems5*/ ctx[8];
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
    			if (dirty[0] & /*fixedItems5, sliderWidth*/ 8448) {
    				each_value_8 = /*fixedItems5*/ ctx[8];
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
    		source: "(294:2) <TinySlider let:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (326:3) {#each fixedItems5 as item}
    function create_each_block_7(ctx) {
    	let img;
    	let img_src_value;
    	let img_width_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", img_width_value = (/*sliderWidth*/ ctx[13] - 20) / 3);
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 326, 4, 12560);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sliderWidth*/ 8192 && img_width_value !== (img_width_value = (/*sliderWidth*/ ctx[13] - 20) / 3)) {
    				attr_dev(img, "width", img_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_7.name,
    		type: "each",
    		source: "(326:3) {#each fixedItems5 as item}",
    		ctx
    	});

    	return block;
    }

    // (325:2) <TinySlider gap="10px" let:sliderWidth>
    function create_default_slot_6(ctx) {
    	let each_1_anchor;
    	let each_value_7 = /*fixedItems5*/ ctx[8];
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
    			if (dirty[0] & /*fixedItems5, sliderWidth*/ 8448) {
    				each_value_7 = /*fixedItems5*/ ctx[8];
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
    		source: "(325:2) <TinySlider gap=\\\"10px\\\" let:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (350:3) {#each { length: 20 } as _}
    function create_each_block_6(ctx) {
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
    			attr_dev(a, "class", "svelte-37w21y");
    			add_location(a, file, 351, 5, 13550);
    			attr_dev(div, "class", "item svelte-37w21y");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 350, 4, 13480);
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
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(350:3) {#each { length: 20 } as _}",
    		ctx
    	});

    	return block;
    }

    // (349:2) <TinySlider gap="0.5rem">
    function create_default_slot_5(ctx) {
    	let each_1_anchor;
    	let each_value_6 = { length: 20 };
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
    		p: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(349:2) <TinySlider gap=\\\"0.5rem\\\">",
    		ctx
    	});

    	return block;
    }

    // (389:6) {#if currentIndex + 1 >= i}
    function create_if_block_8(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 389, 7, 15052);
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
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(389:6) {#if currentIndex + 1 >= i}",
    		ctx
    	});

    	return block;
    }

    // (387:4) {#each fixedItems6 as item, i}
    function create_each_block_5(ctx) {
    	let div;
    	let t;
    	let style_width = `${/*sliderWidth*/ ctx[13]}px`;
    	let if_block = /*currentIndex*/ ctx[2] + 1 >= /*i*/ ctx[46] && create_if_block_8(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div, "class", "svelte-37w21y");
    			set_style(div, "width", style_width, false);
    			add_location(div, file, 387, 5, 14973);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*currentIndex*/ ctx[2] + 1 >= /*i*/ ctx[46]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_8(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*sliderWidth*/ 8192 && style_width !== (style_width = `${/*sliderWidth*/ ctx[13]}px`)) {
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
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(387:4) {#each fixedItems6 as item, i}",
    		ctx
    	});

    	return block;
    }

    // (386:3) <TinySlider let:setIndex let:currentIndex let:sliderWidth>
    function create_default_slot_4(ctx) {
    	let each_1_anchor;
    	let each_value_5 = /*fixedItems6*/ ctx[9];
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
    			if (dirty[0] & /*sliderWidth, fixedItems6, currentIndex*/ 8708) {
    				each_value_5 = /*fixedItems6*/ ctx[9];
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
    		source: "(386:3) <TinySlider let:setIndex let:currentIndex let:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (396:5) {#if currentIndex > 0}
    function create_if_block_7(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_8() {
    		return /*click_handler_8*/ ctx[26](/*setIndex*/ ctx[1], /*currentIndex*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-37w21y");
    			add_location(button, file, 396, 6, 15194);
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
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(396:5) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (400:5) {#if currentIndex < portaitItems.length - 1}
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

    	function click_handler_9() {
    		return /*click_handler_9*/ ctx[27](/*setIndex*/ ctx[1], /*currentIndex*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-37w21y");
    			add_location(button, file, 400, 6, 15356);
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(400:5) {#if currentIndex < portaitItems.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (395:4) <svelte:fragment slot="controls">
    function create_controls_slot_3(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[2] > 0 && create_if_block_7(ctx);
    	let if_block1 = /*currentIndex*/ ctx[2] < /*portaitItems*/ ctx[0].length - 1 && create_if_block_6(ctx);

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
    			if (/*currentIndex*/ ctx[2] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 4) {
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

    			if (/*currentIndex*/ ctx[2] < /*portaitItems*/ ctx[0].length - 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex, portaitItems*/ 5) {
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
    		source: "(395:4) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (432:7) {#if shown.includes(index)}
    function create_if_block_5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 432, 8, 16923);
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
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(432:7) {#if shown.includes(index)}",
    		ctx
    	});

    	return block;
    }

    // (430:5) {#each fixedItems7 as item, index}
    function create_each_block_4(ctx) {
    	let div;
    	let show_if = /*shown*/ ctx[37].includes(/*index*/ ctx[41]);
    	let t;
    	let if_block = show_if && create_if_block_5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div, "class", "item svelte-37w21y");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `300px`, false);
    			add_location(div, file, 430, 6, 16814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*shown*/ 64) show_if = /*shown*/ ctx[37].includes(/*index*/ ctx[41]);

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
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(430:5) {#each fixedItems7 as item, index}",
    		ctx
    	});

    	return block;
    }

    // (429:4) <TinySlider gap="0.5rem" let:setIndex let:currentIndex let:shown>
    function create_default_slot_3(ctx) {
    	let each_1_anchor;
    	let each_value_4 = /*fixedItems7*/ ctx[10];
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
    			if (dirty[0] & /*fixedItems7*/ 1024 | dirty[1] & /*shown*/ 64) {
    				each_value_4 = /*fixedItems7*/ ctx[10];
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
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(429:4) <TinySlider gap=\\\"0.5rem\\\" let:setIndex let:currentIndex let:shown>",
    		ctx
    	});

    	return block;
    }

    // (439:6) {#if currentIndex > 0}
    function create_if_block_4(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_10() {
    		return /*click_handler_10*/ ctx[28](/*setIndex*/ ctx[1], /*currentIndex*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-37w21y");
    			add_location(button, file, 439, 7, 17071);
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(439:6) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (443:6) {#if currentIndex < portaitItems.length - 1}
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

    	function click_handler_11() {
    		return /*click_handler_11*/ ctx[29](/*setIndex*/ ctx[1], /*currentIndex*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-37w21y");
    			add_location(button, file, 443, 7, 17236);
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(443:6) {#if currentIndex < portaitItems.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (438:5) <svelte:fragment slot="controls">
    function create_controls_slot_2(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[2] > 0 && create_if_block_4(ctx);
    	let if_block1 = /*currentIndex*/ ctx[2] < /*portaitItems*/ ctx[0].length - 1 && create_if_block_3(ctx);

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
    			if (/*currentIndex*/ ctx[2] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 4) {
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

    			if (/*currentIndex*/ ctx[2] < /*portaitItems*/ ctx[0].length - 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex, portaitItems*/ 5) {
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
    		id: create_controls_slot_2.name,
    		type: "slot",
    		source: "(438:5) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    // (454:3) {#each fixedItems5 as item}
    function create_each_block_3(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let style___width = `${/*sliderWidth*/ ctx[13]}px`;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 458, 5, 17666);
    			attr_dev(div, "class", "item svelte-37w21y");
    			set_style(div, "--width", style___width, false);
    			set_style(div, "--height", `400px`, false);
    			add_location(div, file, 454, 4, 17568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sliderWidth*/ 8192 && style___width !== (style___width = `${/*sliderWidth*/ ctx[13]}px`)) {
    				set_style(div, "--width", style___width, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(454:3) {#each fixedItems5 as item}",
    		ctx
    	});

    	return block;
    }

    // (453:2) <TinySlider gap="0.5rem" let:setIndex let:currentIndex let:sliderWidth>
    function create_default_slot_2(ctx) {
    	let each_1_anchor;
    	let each_value_3 = /*fixedItems5*/ ctx[8];
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
    			if (dirty[0] & /*sliderWidth, fixedItems5*/ 8448) {
    				each_value_3 = /*fixedItems5*/ ctx[8];
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
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(453:2) <TinySlider gap=\\\"0.5rem\\\" let:setIndex let:currentIndex let:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (464:4) {#each items as item, i}
    function create_each_block_2(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_12() {
    		return /*click_handler_12*/ ctx[30](/*setIndex*/ ctx[1], /*i*/ ctx[46]);
    	}

    	function focus_handler_1() {
    		return /*focus_handler_1*/ ctx[31](/*setIndex*/ ctx[1], /*i*/ ctx[46]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t = space();
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "height", "60");
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 469, 6, 17967);
    			attr_dev(button, "class", "thumbnail svelte-37w21y");
    			toggle_class(button, "active", /*i*/ ctx[46] == /*currentIndex*/ ctx[2]);
    			add_location(button, file, 464, 5, 17814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", click_handler_12, false, false, false),
    					listen_dev(button, "focus", focus_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*currentIndex*/ 4) {
    				toggle_class(button, "active", /*i*/ ctx[46] == /*currentIndex*/ ctx[2]);
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
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(464:4) {#each items as item, i}",
    		ctx
    	});

    	return block;
    }

    // (463:3) 
    function create_controls_slot_1(ctx) {
    	let div;
    	let each_value_2 = /*items*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "slot", "controls");
    			attr_dev(div, "class", "thumbnails svelte-37w21y");
    			add_location(div, file, 462, 3, 17737);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentIndex, setIndex, items*/ 14) {
    				each_value_2 = /*items*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot_1.name,
    		type: "slot",
    		source: "(463:3) ",
    		ctx
    	});

    	return block;
    }

    // (480:4) {#each { length: 20 } as _}
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
    			attr_dev(a, "class", "svelte-37w21y");
    			add_location(a, file, 481, 6, 18331);
    			attr_dev(div, "class", "item svelte-37w21y");
    			set_style(div, "--width", `200px`, false);
    			set_style(div, "--height", `200px`, false);
    			add_location(div, file, 480, 5, 18222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_13*/ ctx[32], false, false, false);
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
    		source: "(480:4) {#each { length: 20 } as _}",
    		ctx
    	});

    	return block;
    }

    // (479:3) <TinySlider gap="0.5rem" fill={false}>
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
    		source: "(479:3) <TinySlider gap=\\\"0.5rem\\\" fill={false}>",
    		ctx
    	});

    	return block;
    }

    // (495:5) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}
    function create_if_block_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[39])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-37w21y");
    			add_location(img, file, 495, 6, 18804);
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
    		source: "(495:5) {#if [index, index + 1, index - 1].some(i => shown.includes(i))}",
    		ctx
    	});

    	return block;
    }

    // (492:2) {#each cardItems as item, index}
    function create_each_block(ctx) {
    	let div;
    	let a0;
    	let show_if = [/*index*/ ctx[41], /*index*/ ctx[41] + 1, /*index*/ ctx[41] - 1].some(func);
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
    		return /*func*/ ctx[15](/*shown*/ ctx[37], ...args);
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
    			attr_dev(a0, "class", "thumbnail svelte-37w21y");
    			attr_dev(a0, "href", "https://google.com");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file, 493, 4, 18662);
    			attr_dev(a1, "class", "title svelte-37w21y");
    			attr_dev(a1, "href", "https://google.com");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file, 499, 4, 18874);
    			attr_dev(p, "class", "svelte-37w21y");
    			add_location(p, file, 501, 4, 18960);
    			attr_dev(a2, "class", "button svelte-37w21y");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file, 505, 4, 19050);
    			attr_dev(div, "class", "card svelte-37w21y");
    			add_location(div, file, 492, 3, 18600);
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
    					listen_dev(a2, "click", prevent_default(/*click_handler*/ ctx[14]), false, true, false),
    					listen_dev(div, "click", /*click_handler_16*/ ctx[35], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[1] & /*shown*/ 64) show_if = [/*index*/ ctx[41], /*index*/ ctx[41] + 1, /*index*/ ctx[41] - 1].some(func);

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
    		source: "(492:2) {#each cardItems as item, index}",
    		ctx
    	});

    	return block;
    }

    // (491:1) <TinySlider gap="1rem" let:setIndex let:currentIndex let:shown let:reachedEnd>
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let each_value = /*cardItems*/ ctx[12];
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
    			if (dirty[0] & /*cardItems*/ 4096 | dirty[1] & /*shown*/ 64) {
    				each_value = /*cardItems*/ ctx[12];
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
    		source: "(491:1) <TinySlider gap=\\\"1rem\\\" let:setIndex let:currentIndex let:shown let:reachedEnd>",
    		ctx
    	});

    	return block;
    }

    // (511:3) {#if currentIndex > 0}
    function create_if_block_1(ctx) {
    	let button;
    	let arrow;
    	let current;
    	let mounted;
    	let dispose;
    	arrow = new Arrow({ $$inline: true });

    	function click_handler_14() {
    		return /*click_handler_14*/ ctx[33](/*setIndex*/ ctx[1], /*currentIndex*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow left svelte-37w21y");
    			add_location(button, file, 511, 4, 19213);
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(511:3) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (515:3) {#if !reachedEnd}
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

    	function click_handler_15() {
    		return /*click_handler_15*/ ctx[34](/*setIndex*/ ctx[1], /*currentIndex*/ ctx[2]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(arrow.$$.fragment);
    			attr_dev(button, "class", "arrow right svelte-37w21y");
    			add_location(button, file, 515, 4, 19342);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(515:3) {#if !reachedEnd}",
    		ctx
    	});

    	return block;
    }

    // (510:2) <svelte:fragment slot="controls">
    function create_controls_slot(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*currentIndex*/ ctx[2] > 0 && create_if_block_1(ctx);
    	let if_block1 = !/*reachedEnd*/ ctx[38] && create_if_block(ctx);

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
    			if (/*currentIndex*/ ctx[2] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentIndex*/ 4) {
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

    			if (!/*reachedEnd*/ ctx[38]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[1] & /*reachedEnd*/ 128) {
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
    		source: "(510:2) <svelte:fragment slot=\\\"controls\\\">",
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
    	let div15;
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
    	let mark56;
    	let t317;
    	let br83;
    	let t318;
    	let p28;
    	let t320;
    	let div8;
    	let tinyslider9;
    	let t321;
    	let p29;
    	let t322;
    	let mark57;
    	let t324;
    	let mark58;
    	let t326;
    	let mark59;
    	let t328;
    	let mark60;
    	let t330;
    	let t331;
    	let p30;
    	let code26;
    	let t332;
    	let mark61;
    	let t334;
    	let mark62;
    	let t336;
    	let br84;
    	let t337;
    	let br85;
    	let t338;
    	let br86;
    	let t339;
    	let mark63;
    	let t341;
    	let br87;
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
    	let mark64;
    	let t350;
    	let t351;
    	let div10;
    	let div9;
    	let tinyslider10;
    	let t352;
    	let div12;
    	let tinyslider11;
    	let t353;
    	let div14;
    	let div13;
    	let tinyslider12;
    	let t354;
    	let div16;
    	let tinyslider13;
    	let t355;
    	let div17;
    	let current;
    	let mounted;
    	let dispose;

    	tinyslider0 = new TinySlider({
    			props: {
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider1 = new TinySlider({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider2 = new TinySlider({
    			props: {
    				$$slots: {
    					controls: [
    						create_controls_slot_6,
    						({ setIndex, currentIndex }) => ({ 1: setIndex, 2: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 2 : 0) | (currentIndex ? 4 : 0)]
    					],
    					default: [
    						create_default_slot_11,
    						({ setIndex, currentIndex }) => ({ 1: setIndex, 2: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 2 : 0) | (currentIndex ? 4 : 0)]
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
    						create_controls_slot_5,
    						({ setIndex, currentIndex }) => ({ 1: setIndex, 2: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 2 : 0) | (currentIndex ? 4 : 0)]
    					],
    					default: [
    						create_default_slot_10,
    						({ setIndex, currentIndex }) => ({ 1: setIndex, 2: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 2 : 0) | (currentIndex ? 4 : 0)]
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
    						create_controls_slot_4,
    						({ setIndex, currentIndex }) => ({ 1: setIndex, 2: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 2 : 0) | (currentIndex ? 4 : 0)]
    					],
    					default: [
    						create_default_slot_9,
    						({ setIndex, currentIndex }) => ({ 1: setIndex, 2: currentIndex }),
    						({ setIndex, currentIndex }) => [(setIndex ? 2 : 0) | (currentIndex ? 4 : 0)]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function tinyslider5_setIndex_binding(value) {
    		/*tinyslider5_setIndex_binding*/ ctx[21](value);
    	}

    	function tinyslider5_currentIndex_binding(value) {
    		/*tinyslider5_currentIndex_binding*/ ctx[22](value);
    	}

    	let tinyslider5_props = {
    		$$slots: { default: [create_default_slot_8] },
    		$$scope: { ctx }
    	};

    	if (/*setIndex*/ ctx[1] !== void 0) {
    		tinyslider5_props.setIndex = /*setIndex*/ ctx[1];
    	}

    	if (/*currentIndex*/ ctx[2] !== void 0) {
    		tinyslider5_props.currentIndex = /*currentIndex*/ ctx[2];
    	}

    	tinyslider5 = new TinySlider({ props: tinyslider5_props, $$inline: true });
    	binding_callbacks.push(() => bind(tinyslider5, 'setIndex', tinyslider5_setIndex_binding));
    	binding_callbacks.push(() => bind(tinyslider5, 'currentIndex', tinyslider5_currentIndex_binding));

    	tinyslider6 = new TinySlider({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot_7,
    						({ sliderWidth }) => ({ 13: sliderWidth }),
    						({ sliderWidth }) => [sliderWidth ? 8192 : 0]
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
    						create_default_slot_6,
    						({ sliderWidth }) => ({ 13: sliderWidth }),
    						({ sliderWidth }) => [sliderWidth ? 8192 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider8 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider9 = new TinySlider({
    			props: {
    				$$slots: {
    					controls: [
    						create_controls_slot_3,
    						({ setIndex, currentIndex, sliderWidth }) => ({
    							1: setIndex,
    							2: currentIndex,
    							13: sliderWidth
    						}),
    						({ setIndex, currentIndex, sliderWidth }) => [
    							(setIndex ? 2 : 0) | (currentIndex ? 4 : 0) | (sliderWidth ? 8192 : 0)
    						]
    					],
    					default: [
    						create_default_slot_4,
    						({ setIndex, currentIndex, sliderWidth }) => ({
    							1: setIndex,
    							2: currentIndex,
    							13: sliderWidth
    						}),
    						({ setIndex, currentIndex, sliderWidth }) => [
    							(setIndex ? 2 : 0) | (currentIndex ? 4 : 0) | (sliderWidth ? 8192 : 0)
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
    						create_controls_slot_2,
    						({ setIndex, currentIndex, shown }) => ({ 1: setIndex, 2: currentIndex, 37: shown }),
    						({ setIndex, currentIndex, shown }) => [(setIndex ? 2 : 0) | (currentIndex ? 4 : 0), shown ? 64 : 0]
    					],
    					default: [
    						create_default_slot_3,
    						({ setIndex, currentIndex, shown }) => ({ 1: setIndex, 2: currentIndex, 37: shown }),
    						({ setIndex, currentIndex, shown }) => [(setIndex ? 2 : 0) | (currentIndex ? 4 : 0), shown ? 64 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider11 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				$$slots: {
    					controls: [
    						create_controls_slot_1,
    						({ setIndex, currentIndex, sliderWidth }) => ({
    							1: setIndex,
    							2: currentIndex,
    							13: sliderWidth
    						}),
    						({ setIndex, currentIndex, sliderWidth }) => [
    							(setIndex ? 2 : 0) | (currentIndex ? 4 : 0) | (sliderWidth ? 8192 : 0)
    						]
    					],
    					default: [
    						create_default_slot_2,
    						({ setIndex, currentIndex, sliderWidth }) => ({
    							1: setIndex,
    							2: currentIndex,
    							13: sliderWidth
    						}),
    						({ setIndex, currentIndex, sliderWidth }) => [
    							(setIndex ? 2 : 0) | (currentIndex ? 4 : 0) | (sliderWidth ? 8192 : 0)
    						]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider12 = new TinySlider({
    			props: {
    				gap: "0.5rem",
    				fill: false,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tinyslider13 = new TinySlider({
    			props: {
    				gap: "1rem",
    				$$slots: {
    					controls: [
    						create_controls_slot,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							1: setIndex,
    							2: currentIndex,
    							37: shown,
    							38: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 2 : 0) | (currentIndex ? 4 : 0),
    							(shown ? 64 : 0) | (reachedEnd ? 128 : 0)
    						]
    					],
    					default: [
    						create_default_slot,
    						({ setIndex, currentIndex, shown, reachedEnd }) => ({
    							1: setIndex,
    							2: currentIndex,
    							37: shown,
    							38: reachedEnd
    						}),
    						({ setIndex, currentIndex, shown, reachedEnd }) => [
    							(setIndex ? 2 : 0) | (currentIndex ? 4 : 0),
    							(shown ? 64 : 0) | (reachedEnd ? 128 : 0)
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
    			div15 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Svelte Tiny Slider is an easy to use highly customizable and unopinionated carousel or slider. There is little to no styling and how you structure your content is up to you. Images, videos, or any other element will work. Works with touch and keyboard controls. Made with accessiblity in mind.";
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
    			t94 = text(" < portaitItems.length - 1} ");
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
    			t315 = text("\r\n\t\t\t\t  ...\r\n\t\t\t\t</");
    			mark56 = element("mark");
    			mark56.textContent = "TinySlider";
    			t317 = text(">");
    			br83 = element("br");
    			t318 = space();
    			p28 = element("p");
    			p28.textContent = "Note how this is using currentIndex + 1 to preload one image ahead.";
    			t320 = space();
    			div8 = element("div");
    			create_component(tinyslider9.$$.fragment);
    			t321 = space();
    			p29 = element("p");
    			t322 = text("For sliders with multiple slides shown at once it might get more complicated when using ");
    			mark57 = element("mark");
    			mark57.textContent = "currentIndex";
    			t324 = text(", especially when you might have different amounts of slides depending on the screen size. For that purpose you could use the ");
    			mark58 = element("mark");
    			mark58.textContent = "shown";
    			t326 = text(" property. This property returns an array of all indexes that have been onscreen at some point. Just like before this can be used either as ");
    			mark59 = element("mark");
    			mark59.textContent = "let:shown";
    			t328 = text(" or ");
    			mark60 = element("mark");
    			mark60.textContent = "bind:shown";
    			t330 = text(".");
    			t331 = space();
    			p30 = element("p");
    			code26 = element("code");
    			t332 = text("<");
    			mark61 = element("mark");
    			mark61.textContent = "TinySlider";
    			t334 = text(" let:");
    			mark62 = element("mark");
    			mark62.textContent = "shown";
    			t336 = text(">");
    			br84 = element("br");
    			t337 = text("\r\n\t\t\t\t  {#each items as item, index}");
    			br85 = element("br");
    			t338 = text("\r\n\t\t\t\t    <div>");
    			br86 = element("br");
    			t339 = text("\r\n\t\t\t\t      {#if ");
    			mark63 = element("mark");
    			mark63.textContent = "shown";
    			t341 = text(".includes(index)}");
    			br87 = element("br");
    			t342 = text("\r\n\t\t\t\t        <img src={item} alt=\"\" />");
    			br88 = element("br");
    			t343 = text("\r\n\t\t\t\t      {/if}");
    			br89 = element("br");
    			t344 = text("\r\n\t\t\t\t    </div>");
    			br90 = element("br");
    			t345 = text("\r\n\t\t\t\t  {/each}");
    			br91 = element("br");
    			t346 = space();
    			br92 = element("br");
    			t347 = text("\r\n\t\t\t\t  ...");
    			br93 = element("br");
    			t348 = text("\r\n\t\t\t\t</");
    			mark64 = element("mark");
    			mark64.textContent = "TinySlider";
    			t350 = text(">");
    			t351 = space();
    			div10 = element("div");
    			div9 = element("div");
    			create_component(tinyslider10.$$.fragment);
    			t352 = space();
    			div12 = element("div");
    			create_component(tinyslider11.$$.fragment);
    			t353 = space();
    			div14 = element("div");
    			div13 = element("div");
    			create_component(tinyslider12.$$.fragment);
    			t354 = space();
    			div16 = element("div");
    			create_component(tinyslider13.$$.fragment);
    			t355 = space();
    			div17 = element("div");
    			attr_dev(mark0, "class", "svelte-37w21y");
    			add_location(mark0, file, 38, 5, 1192);
    			attr_dev(h1, "class", "svelte-37w21y");
    			add_location(h1, file, 38, 1, 1188);
    			attr_dev(header, "class", "svelte-37w21y");
    			add_location(header, file, 37, 0, 1177);
    			attr_dev(p0, "class", "svelte-37w21y");
    			add_location(p0, file, 49, 2, 1445);
    			attr_dev(a, "href", "https://github.com/Mitcheljager/svelte-tiny-slider");
    			attr_dev(a, "class", "svelte-37w21y");
    			add_location(a, file, 51, 5, 1754);
    			attr_dev(p1, "class", "svelte-37w21y");
    			add_location(p1, file, 51, 2, 1751);
    			attr_dev(h20, "class", "svelte-37w21y");
    			add_location(h20, file, 53, 2, 1835);
    			attr_dev(p2, "class", "svelte-37w21y");
    			add_location(p2, file, 55, 2, 1862);
    			attr_dev(mark1, "class", "svelte-37w21y");
    			add_location(mark1, file, 58, 12, 1934);
    			attr_dev(code0, "class", "well svelte-37w21y");
    			add_location(code0, file, 57, 2, 1901);
    			attr_dev(mark2, "class", "svelte-37w21y");
    			add_location(mark2, file, 62, 22, 2025);
    			attr_dev(code1, "class", "well svelte-37w21y");
    			add_location(code1, file, 61, 2, 1982);
    			attr_dev(p3, "class", "svelte-37w21y");
    			add_location(p3, file, 65, 2, 2073);
    			attr_dev(mark3, "class", "svelte-37w21y");
    			add_location(mark3, file, 68, 17, 2155);
    			attr_dev(mark4, "class", "svelte-37w21y");
    			add_location(mark4, file, 68, 54, 2192);
    			attr_dev(code2, "class", "well svelte-37w21y");
    			add_location(code2, file, 67, 2, 2117);
    			attr_dev(mark5, "class", "svelte-37w21y");
    			add_location(mark5, file, 72, 7, 2269);
    			attr_dev(mark6, "class", "svelte-37w21y");
    			add_location(mark6, file, 74, 8, 2315);
    			attr_dev(code3, "class", "well svelte-37w21y");
    			add_location(code3, file, 71, 2, 2241);
    			attr_dev(div0, "class", "block svelte-37w21y");
    			add_location(div0, file, 48, 1, 1422);
    			attr_dev(h21, "class", "svelte-37w21y");
    			add_location(h21, file, 78, 1, 2367);
    			attr_dev(p4, "class", "svelte-37w21y");
    			add_location(p4, file, 81, 2, 2409);
    			attr_dev(mark7, "class", "svelte-37w21y");
    			add_location(mark7, file, 85, 8, 2715);
    			attr_dev(br0, "class", "svelte-37w21y");
    			add_location(br0, file, 85, 36, 2743);
    			attr_dev(br1, "class", "svelte-37w21y");
    			add_location(br1, file, 86, 48, 2797);
    			attr_dev(br2, "class", "svelte-37w21y");
    			add_location(br2, file, 87, 70, 2873);
    			attr_dev(br3, "class", "svelte-37w21y");
    			add_location(br3, file, 88, 34, 2913);
    			attr_dev(mark8, "class", "svelte-37w21y");
    			add_location(mark8, file, 89, 9, 2928);
    			attr_dev(code4, "class", "well svelte-37w21y");
    			add_location(code4, file, 84, 3, 2686);
    			attr_dev(p5, "class", "svelte-37w21y");
    			add_location(p5, file, 83, 2, 2678);
    			attr_dev(div1, "class", "block svelte-37w21y");
    			add_location(div1, file, 80, 1, 2386);
    			attr_dev(h30, "class", "svelte-37w21y");
    			add_location(h30, file, 101, 2, 3121);
    			attr_dev(p6, "class", "svelte-37w21y");
    			add_location(p6, file, 103, 2, 3144);
    			attr_dev(h40, "class", "svelte-37w21y");
    			add_location(h40, file, 106, 2, 3347);
    			attr_dev(mark9, "class", "svelte-37w21y");
    			add_location(mark9, file, 108, 58, 3441);
    			attr_dev(code5, "class", "inline svelte-37w21y");
    			add_location(code5, file, 108, 31, 3414);
    			attr_dev(p7, "class", "svelte-37w21y");
    			add_location(p7, file, 108, 2, 3385);
    			attr_dev(mark10, "class", "svelte-37w21y");
    			add_location(mark10, file, 111, 7, 3593);
    			attr_dev(li0, "class", "svelte-37w21y");
    			add_location(li0, file, 111, 3, 3589);
    			attr_dev(mark11, "class", "svelte-37w21y");
    			add_location(mark11, file, 112, 7, 3702);
    			attr_dev(li1, "class", "svelte-37w21y");
    			add_location(li1, file, 112, 3, 3698);
    			attr_dev(ul, "class", "svelte-37w21y");
    			add_location(ul, file, 110, 2, 3580);
    			attr_dev(code6, "class", "inline svelte-37w21y");
    			add_location(code6, file, 116, 32, 3836);
    			attr_dev(p8, "class", "svelte-37w21y");
    			add_location(p8, file, 115, 2, 3799);
    			attr_dev(mark12, "class", "svelte-37w21y");
    			add_location(mark12, file, 121, 8, 4022);
    			attr_dev(mark13, "class", "svelte-37w21y");
    			add_location(mark13, file, 121, 36, 4050);
    			attr_dev(mark14, "class", "svelte-37w21y");
    			add_location(mark14, file, 121, 62, 4076);
    			attr_dev(br4, "class", "svelte-37w21y");
    			add_location(br4, file, 121, 92, 4106);
    			attr_dev(br5, "class", "svelte-37w21y");
    			add_location(br5, file, 122, 48, 4160);
    			attr_dev(br6, "class", "svelte-37w21y");
    			add_location(br6, file, 123, 70, 4236);
    			attr_dev(br7, "class", "svelte-37w21y");
    			add_location(br7, file, 124, 34, 4276);
    			attr_dev(br8, "class", "svelte-37w21y");
    			add_location(br8, file, 125, 4, 4286);
    			attr_dev(mark15, "class", "svelte-37w21y");
    			add_location(mark15, file, 126, 42, 4334);
    			attr_dev(br9, "class", "svelte-37w21y");
    			add_location(br9, file, 126, 69, 4361);
    			attr_dev(mark16, "class", "svelte-37w21y");
    			add_location(mark16, file, 127, 38, 4405);
    			attr_dev(br10, "class", "svelte-37w21y");
    			add_location(br10, file, 127, 77, 4444);
    			attr_dev(mark17, "class", "svelte-37w21y");
    			add_location(mark17, file, 128, 75, 4525);
    			attr_dev(mark18, "class", "svelte-37w21y");
    			add_location(mark18, file, 128, 97, 4547);
    			attr_dev(br11, "class", "svelte-37w21y");
    			add_location(br11, file, 128, 156, 4606);
    			attr_dev(br12, "class", "svelte-37w21y");
    			add_location(br12, file, 129, 44, 4656);
    			attr_dev(br13, "class", "svelte-37w21y");
    			add_location(br13, file, 130, 4, 4666);
    			attr_dev(mark19, "class", "svelte-37w21y");
    			add_location(mark19, file, 131, 38, 4710);
    			attr_dev(br14, "class", "svelte-37w21y");
    			add_location(br14, file, 131, 99, 4771);
    			attr_dev(mark20, "class", "svelte-37w21y");
    			add_location(mark20, file, 132, 75, 4852);
    			attr_dev(mark21, "class", "svelte-37w21y");
    			add_location(mark21, file, 132, 97, 4874);
    			attr_dev(br15, "class", "svelte-37w21y");
    			add_location(br15, file, 132, 156, 4933);
    			attr_dev(br16, "class", "svelte-37w21y");
    			add_location(br16, file, 133, 44, 4983);
    			attr_dev(br17, "class", "svelte-37w21y");
    			add_location(br17, file, 134, 41, 5030);
    			attr_dev(mark22, "class", "svelte-37w21y");
    			add_location(mark22, file, 135, 9, 5045);
    			attr_dev(code7, "class", "well svelte-37w21y");
    			add_location(code7, file, 120, 3, 3993);
    			attr_dev(p9, "class", "svelte-37w21y");
    			add_location(p9, file, 119, 2, 3985);
    			attr_dev(div2, "class", "relative svelte-37w21y");
    			add_location(div2, file, 139, 2, 5098);
    			attr_dev(p10, "class", "svelte-37w21y");
    			add_location(p10, file, 157, 2, 5656);
    			attr_dev(mark23, "class", "svelte-37w21y");
    			add_location(mark23, file, 161, 8, 5776);
    			attr_dev(mark24, "class", "svelte-37w21y");
    			add_location(mark24, file, 161, 36, 5804);
    			attr_dev(mark25, "class", "svelte-37w21y");
    			add_location(mark25, file, 161, 62, 5830);
    			attr_dev(br18, "class", "svelte-37w21y");
    			add_location(br18, file, 161, 92, 5860);
    			attr_dev(br19, "class", "svelte-37w21y");
    			add_location(br19, file, 162, 48, 5914);
    			attr_dev(br20, "class", "svelte-37w21y");
    			add_location(br20, file, 163, 70, 5990);
    			attr_dev(br21, "class", "svelte-37w21y");
    			add_location(br21, file, 164, 34, 6030);
    			attr_dev(br22, "class", "svelte-37w21y");
    			add_location(br22, file, 165, 4, 6040);
    			attr_dev(br23, "class", "svelte-37w21y");
    			add_location(br23, file, 166, 43, 6089);
    			attr_dev(br24, "class", "svelte-37w21y");
    			add_location(br24, file, 167, 59, 6154);
    			attr_dev(br25, "class", "svelte-37w21y");
    			add_location(br25, file, 168, 50, 6210);
    			attr_dev(mark26, "class", "svelte-37w21y");
    			add_location(mark26, file, 169, 76, 6292);
    			attr_dev(br26, "class", "svelte-37w21y");
    			add_location(br26, file, 169, 107, 6323);
    			attr_dev(mark27, "class", "svelte-37w21y");
    			add_location(mark27, file, 170, 76, 6405);
    			attr_dev(br27, "class", "svelte-37w21y");
    			add_location(br27, file, 170, 112, 6441);
    			attr_dev(br28, "class", "svelte-37w21y");
    			add_location(br28, file, 171, 45, 6492);
    			attr_dev(br29, "class", "svelte-37w21y");
    			add_location(br29, file, 172, 28, 6526);
    			attr_dev(mark28, "class", "svelte-37w21y");
    			add_location(mark28, file, 173, 9, 6541);
    			attr_dev(code8, "class", "well svelte-37w21y");
    			add_location(code8, file, 160, 3, 5747);
    			attr_dev(p11, "class", "svelte-37w21y");
    			add_location(p11, file, 159, 2, 5739);
    			attr_dev(div3, "class", "relative svelte-37w21y");
    			add_location(div3, file, 177, 2, 6594);
    			attr_dev(p12, "class", "svelte-37w21y");
    			add_location(p12, file, 194, 2, 6993);
    			attr_dev(mark29, "class", "svelte-37w21y");
    			add_location(mark29, file, 198, 8, 7097);
    			attr_dev(mark30, "class", "svelte-37w21y");
    			add_location(mark30, file, 198, 36, 7125);
    			attr_dev(mark31, "class", "svelte-37w21y");
    			add_location(mark31, file, 198, 62, 7151);
    			attr_dev(br30, "class", "svelte-37w21y");
    			add_location(br30, file, 198, 92, 7181);
    			attr_dev(br31, "class", "svelte-37w21y");
    			add_location(br31, file, 199, 48, 7235);
    			attr_dev(br32, "class", "svelte-37w21y");
    			add_location(br32, file, 200, 70, 7311);
    			attr_dev(br33, "class", "svelte-37w21y");
    			add_location(br33, file, 201, 34, 7351);
    			attr_dev(br34, "class", "svelte-37w21y");
    			add_location(br34, file, 202, 4, 7361);
    			attr_dev(br35, "class", "svelte-37w21y");
    			add_location(br35, file, 203, 43, 7410);
    			attr_dev(br36, "class", "svelte-37w21y");
    			add_location(br36, file, 204, 59, 7475);
    			attr_dev(br37, "class", "svelte-37w21y");
    			add_location(br37, file, 205, 50, 7531);
    			attr_dev(mark32, "class", "svelte-37w21y");
    			add_location(mark32, file, 206, 76, 7613);
    			attr_dev(br38, "class", "svelte-37w21y");
    			add_location(br38, file, 206, 107, 7644);
    			attr_dev(mark33, "class", "svelte-37w21y");
    			add_location(mark33, file, 207, 76, 7726);
    			attr_dev(br39, "class", "svelte-37w21y");
    			add_location(br39, file, 207, 106, 7756);
    			attr_dev(mark34, "class", "svelte-37w21y");
    			add_location(mark34, file, 208, 76, 7838);
    			attr_dev(br40, "class", "svelte-37w21y");
    			add_location(br40, file, 208, 110, 7872);
    			attr_dev(br41, "class", "svelte-37w21y");
    			add_location(br41, file, 209, 103, 7981);
    			attr_dev(br42, "class", "svelte-37w21y");
    			add_location(br42, file, 210, 55, 8042);
    			attr_dev(br43, "class", "svelte-37w21y");
    			add_location(br43, file, 211, 45, 8093);
    			attr_dev(br44, "class", "svelte-37w21y");
    			add_location(br44, file, 212, 28, 8127);
    			attr_dev(mark35, "class", "svelte-37w21y");
    			add_location(mark35, file, 213, 9, 8142);
    			attr_dev(code9, "class", "well svelte-37w21y");
    			add_location(code9, file, 197, 3, 7068);
    			attr_dev(p13, "class", "svelte-37w21y");
    			add_location(p13, file, 196, 2, 7060);
    			attr_dev(div4, "class", "relative svelte-37w21y");
    			add_location(div4, file, 217, 2, 8195);
    			attr_dev(h41, "class", "svelte-37w21y");
    			add_location(h41, file, 237, 2, 8710);
    			attr_dev(code10, "class", "inline svelte-37w21y");
    			add_location(code10, file, 239, 162, 8912);
    			attr_dev(code11, "class", "inline svelte-37w21y");
    			add_location(code11, file, 239, 206, 8956);
    			attr_dev(code12, "class", "inline svelte-37w21y");
    			add_location(code12, file, 239, 252, 9002);
    			attr_dev(p14, "class", "svelte-37w21y");
    			add_location(p14, file, 239, 2, 8752);
    			attr_dev(br45, "class", "svelte-37w21y");
    			add_location(br45, file, 243, 18, 9168);
    			attr_dev(mark36, "class", "svelte-37w21y");
    			add_location(mark36, file, 244, 20, 9194);
    			attr_dev(br46, "class", "svelte-37w21y");
    			add_location(br46, file, 244, 41, 9215);
    			attr_dev(br47, "class", "svelte-37w21y");
    			add_location(br47, file, 245, 19, 9240);
    			attr_dev(br48, "class", "svelte-37w21y");
    			add_location(br48, file, 246, 4, 9250);
    			attr_dev(mark37, "class", "svelte-37w21y");
    			add_location(mark37, file, 247, 8, 9264);
    			attr_dev(mark38, "class", "svelte-37w21y");
    			add_location(mark38, file, 247, 32, 9288);
    			attr_dev(mark39, "class", "svelte-37w21y");
    			add_location(mark39, file, 247, 50, 9306);
    			attr_dev(br49, "class", "svelte-37w21y");
    			add_location(br49, file, 247, 76, 9332);
    			attr_dev(br50, "class", "svelte-37w21y");
    			add_location(br50, file, 248, 48, 9386);
    			attr_dev(br51, "class", "svelte-37w21y");
    			add_location(br51, file, 249, 70, 9462);
    			attr_dev(br52, "class", "svelte-37w21y");
    			add_location(br52, file, 250, 34, 9502);
    			attr_dev(mark40, "class", "svelte-37w21y");
    			add_location(mark40, file, 251, 9, 9517);
    			attr_dev(br53, "class", "svelte-37w21y");
    			add_location(br53, file, 251, 36, 9544);
    			attr_dev(br54, "class", "svelte-37w21y");
    			add_location(br54, file, 252, 4, 9554);
    			attr_dev(mark41, "class", "svelte-37w21y");
    			add_location(mark41, file, 253, 39, 9599);
    			attr_dev(br55, "class", "svelte-37w21y");
    			add_location(br55, file, 253, 91, 9651);
    			attr_dev(mark42, "class", "svelte-37w21y");
    			add_location(mark42, file, 254, 39, 9696);
    			attr_dev(br56, "class", "svelte-37w21y");
    			add_location(br56, file, 254, 91, 9748);
    			attr_dev(mark43, "class", "svelte-37w21y");
    			add_location(mark43, file, 255, 39, 9793);
    			attr_dev(br57, "class", "svelte-37w21y");
    			add_location(br57, file, 255, 91, 9845);
    			attr_dev(code13, "class", "well svelte-37w21y");
    			add_location(code13, file, 242, 3, 9129);
    			attr_dev(p15, "class", "svelte-37w21y");
    			add_location(p15, file, 241, 2, 9121);
    			attr_dev(code14, "class", "inline svelte-37w21y");
    			add_location(code14, file, 265, 32, 10047);
    			attr_dev(p16, "class", "svelte-37w21y");
    			add_location(p16, file, 265, 2, 10017);
    			attr_dev(button0, "class", "button svelte-37w21y");
    			add_location(button0, file, 267, 2, 10132);
    			attr_dev(button1, "class", "button svelte-37w21y");
    			add_location(button1, file, 268, 2, 10211);
    			attr_dev(button2, "class", "button svelte-37w21y");
    			add_location(button2, file, 269, 2, 10290);
    			attr_dev(div5, "class", "block svelte-37w21y");
    			add_location(div5, file, 100, 1, 3098);
    			attr_dev(h31, "class", "svelte-37w21y");
    			add_location(h31, file, 274, 2, 10404);
    			attr_dev(p17, "class", "svelte-37w21y");
    			add_location(p17, file, 276, 2, 10426);
    			attr_dev(h42, "class", "svelte-37w21y");
    			add_location(h42, file, 278, 2, 10685);
    			attr_dev(code15, "class", "inline svelte-37w21y");
    			add_location(code15, file, 280, 181, 10883);
    			attr_dev(code16, "class", "inline svelte-37w21y");
    			add_location(code16, file, 280, 314, 11016);
    			attr_dev(p18, "class", "svelte-37w21y");
    			add_location(p18, file, 280, 2, 10704);
    			attr_dev(mark44, "class", "svelte-37w21y");
    			add_location(mark44, file, 284, 8, 11232);
    			attr_dev(mark45, "class", "svelte-37w21y");
    			add_location(mark45, file, 284, 36, 11260);
    			attr_dev(br58, "class", "svelte-37w21y");
    			add_location(br58, file, 284, 64, 11288);
    			attr_dev(br59, "class", "svelte-37w21y");
    			add_location(br59, file, 285, 47, 11341);
    			attr_dev(mark46, "class", "svelte-37w21y");
    			add_location(mark46, file, 286, 69, 11416);
    			attr_dev(br60, "class", "svelte-37w21y");
    			add_location(br60, file, 286, 109, 11456);
    			attr_dev(br61, "class", "svelte-37w21y");
    			add_location(br61, file, 287, 33, 11495);
    			attr_dev(mark47, "class", "svelte-37w21y");
    			add_location(mark47, file, 288, 9, 11510);
    			attr_dev(code17, "class", "well svelte-37w21y");
    			add_location(code17, file, 283, 3, 11203);
    			attr_dev(p19, "class", "svelte-37w21y");
    			add_location(p19, file, 282, 2, 11195);
    			attr_dev(h43, "class", "svelte-37w21y");
    			add_location(h43, file, 299, 2, 11730);
    			attr_dev(code18, "class", "inline svelte-37w21y");
    			add_location(code18, file, 302, 93, 11846);
    			attr_dev(p20, "class", "svelte-37w21y");
    			add_location(p20, file, 301, 2, 11748);
    			attr_dev(br62, "class", "svelte-37w21y");
    			add_location(br62, file, 305, 36, 11994);
    			attr_dev(br63, "class", "svelte-37w21y");
    			add_location(br63, file, 306, 27, 12027);
    			attr_dev(code19, "class", "well svelte-37w21y");
    			add_location(code19, file, 304, 3, 11937);
    			attr_dev(code20, "class", "inline svelte-37w21y");
    			add_location(code20, file, 311, 17, 12083);
    			attr_dev(p21, "class", "svelte-37w21y");
    			add_location(p21, file, 310, 2, 12061);
    			attr_dev(mark48, "class", "svelte-37w21y");
    			add_location(mark48, file, 316, 8, 12219);
    			attr_dev(mark49, "class", "svelte-37w21y");
    			add_location(mark49, file, 316, 32, 12243);
    			attr_dev(br64, "class", "svelte-37w21y");
    			add_location(br64, file, 316, 60, 12271);
    			attr_dev(br65, "class", "svelte-37w21y");
    			add_location(br65, file, 317, 48, 12325);
    			attr_dev(br66, "class", "svelte-37w21y");
    			add_location(br66, file, 318, 44, 12375);
    			attr_dev(br67, "class", "svelte-37w21y");
    			add_location(br67, file, 319, 34, 12415);
    			attr_dev(mark50, "class", "svelte-37w21y");
    			add_location(mark50, file, 320, 9, 12430);
    			attr_dev(code21, "class", "well svelte-37w21y");
    			add_location(code21, file, 315, 3, 12190);
    			attr_dev(p22, "class", "svelte-37w21y");
    			add_location(p22, file, 314, 2, 12182);
    			attr_dev(div6, "class", "block svelte-37w21y");
    			add_location(div6, file, 273, 1, 10381);
    			attr_dev(h32, "class", "svelte-37w21y");
    			add_location(h32, file, 332, 2, 12697);
    			attr_dev(p23, "class", "svelte-37w21y");
    			add_location(p23, file, 334, 2, 12719);
    			attr_dev(mark51, "class", "svelte-37w21y");
    			add_location(mark51, file, 338, 8, 12986);
    			attr_dev(br68, "class", "svelte-37w21y");
    			add_location(br68, file, 338, 48, 13026);
    			attr_dev(br69, "class", "svelte-37w21y");
    			add_location(br69, file, 339, 63, 13095);
    			attr_dev(br70, "class", "svelte-37w21y");
    			add_location(br70, file, 340, 52, 13153);
    			attr_dev(br71, "class", "svelte-37w21y");
    			add_location(br71, file, 341, 105, 13264);
    			attr_dev(br72, "class", "svelte-37w21y");
    			add_location(br72, file, 342, 40, 13310);
    			attr_dev(br73, "class", "svelte-37w21y");
    			add_location(br73, file, 343, 33, 13349);
    			attr_dev(mark52, "class", "svelte-37w21y");
    			add_location(mark52, file, 344, 9, 13364);
    			attr_dev(code22, "class", "well svelte-37w21y");
    			add_location(code22, file, 337, 3, 12957);
    			attr_dev(p24, "class", "svelte-37w21y");
    			add_location(p24, file, 336, 2, 12949);
    			attr_dev(div7, "class", "block svelte-37w21y");
    			add_location(div7, file, 331, 1, 12674);
    			attr_dev(h33, "class", "svelte-37w21y");
    			add_location(h33, file, 358, 2, 13681);
    			attr_dev(code23, "class", "inline svelte-37w21y");
    			add_location(code23, file, 360, 114, 13820);
    			attr_dev(p25, "class", "svelte-37w21y");
    			add_location(p25, file, 360, 2, 13708);
    			attr_dev(code24, "class", "inline svelte-37w21y");
    			add_location(code24, file, 362, 39, 14015);
    			attr_dev(p26, "class", "svelte-37w21y");
    			add_location(p26, file, 362, 2, 13978);
    			attr_dev(mark53, "class", "svelte-37w21y");
    			add_location(mark53, file, 366, 8, 14151);
    			attr_dev(mark54, "class", "svelte-37w21y");
    			add_location(mark54, file, 366, 36, 14179);
    			attr_dev(br74, "class", "svelte-37w21y");
    			add_location(br74, file, 366, 65, 14208);
    			attr_dev(br75, "class", "svelte-37w21y");
    			add_location(br75, file, 367, 50, 14264);
    			attr_dev(br76, "class", "svelte-37w21y");
    			add_location(br76, file, 368, 39, 14309);
    			attr_dev(mark55, "class", "svelte-37w21y");
    			add_location(mark55, file, 369, 50, 14365);
    			attr_dev(br77, "class", "svelte-37w21y");
    			add_location(br77, file, 369, 93, 14408);
    			attr_dev(br78, "class", "svelte-37w21y");
    			add_location(br78, file, 370, 93, 14507);
    			attr_dev(br79, "class", "svelte-37w21y");
    			add_location(br79, file, 371, 55, 14568);
    			attr_dev(br80, "class", "svelte-37w21y");
    			add_location(br80, file, 372, 40, 14614);
    			attr_dev(br81, "class", "svelte-37w21y");
    			add_location(br81, file, 373, 33, 14653);
    			attr_dev(br82, "class", "svelte-37w21y");
    			add_location(br82, file, 374, 4, 14663);
    			attr_dev(mark56, "class", "svelte-37w21y");
    			add_location(mark56, file, 376, 9, 14699);
    			attr_dev(br83, "class", "svelte-37w21y");
    			add_location(br83, file, 376, 36, 14726);
    			attr_dev(code25, "class", "well svelte-37w21y");
    			add_location(code25, file, 365, 3, 14122);
    			attr_dev(p27, "class", "svelte-37w21y");
    			add_location(p27, file, 364, 2, 14114);
    			attr_dev(p28, "class", "svelte-37w21y");
    			add_location(p28, file, 380, 2, 14756);
    			attr_dev(div8, "class", "relative svelte-37w21y");
    			add_location(div8, file, 384, 2, 14845);
    			attr_dev(mark57, "class", "svelte-37w21y");
    			add_location(mark57, file, 407, 91, 15630);
    			attr_dev(mark58, "class", "svelte-37w21y");
    			add_location(mark58, file, 407, 242, 15781);
    			attr_dev(mark59, "class", "svelte-37w21y");
    			add_location(mark59, file, 407, 400, 15939);
    			attr_dev(mark60, "class", "svelte-37w21y");
    			add_location(mark60, file, 407, 426, 15965);
    			attr_dev(p29, "class", "svelte-37w21y");
    			add_location(p29, file, 406, 2, 15534);
    			attr_dev(mark61, "class", "svelte-37w21y");
    			add_location(mark61, file, 412, 8, 16040);
    			attr_dev(mark62, "class", "svelte-37w21y");
    			add_location(mark62, file, 412, 36, 16068);
    			attr_dev(br84, "class", "svelte-37w21y");
    			add_location(br84, file, 412, 58, 16090);
    			attr_dev(br85, "class", "svelte-37w21y");
    			add_location(br85, file, 413, 54, 16150);
    			attr_dev(br86, "class", "svelte-37w21y");
    			add_location(br86, file, 414, 39, 16195);
    			attr_dev(mark63, "class", "svelte-37w21y");
    			add_location(mark63, file, 415, 50, 16251);
    			attr_dev(br87, "class", "svelte-37w21y");
    			add_location(br87, file, 415, 90, 16291);
    			attr_dev(br88, "class", "svelte-37w21y");
    			add_location(br88, file, 416, 93, 16390);
    			attr_dev(br89, "class", "svelte-37w21y");
    			add_location(br89, file, 417, 55, 16451);
    			attr_dev(br90, "class", "svelte-37w21y");
    			add_location(br90, file, 418, 40, 16497);
    			attr_dev(br91, "class", "svelte-37w21y");
    			add_location(br91, file, 419, 33, 16536);
    			attr_dev(br92, "class", "svelte-37w21y");
    			add_location(br92, file, 420, 4, 16546);
    			attr_dev(br93, "class", "svelte-37w21y");
    			add_location(br93, file, 421, 19, 16571);
    			attr_dev(mark64, "class", "svelte-37w21y");
    			add_location(mark64, file, 422, 9, 16586);
    			attr_dev(code26, "class", "well svelte-37w21y");
    			add_location(code26, file, 411, 3, 16011);
    			attr_dev(p30, "class", "svelte-37w21y");
    			add_location(p30, file, 410, 2, 16003);
    			attr_dev(div9, "class", "slider-wrapper svelte-37w21y");
    			add_location(div9, file, 427, 3, 16666);
    			attr_dev(div10, "class", "relative svelte-37w21y");
    			add_location(div10, file, 426, 2, 16639);
    			attr_dev(div11, "class", "block svelte-37w21y");
    			add_location(div11, file, 357, 1, 13658);
    			attr_dev(div12, "class", "block svelte-37w21y");
    			add_location(div12, file, 451, 1, 17436);
    			attr_dev(div13, "class", "slider-wrapper svelte-37w21y");
    			add_location(div13, file, 477, 2, 18111);
    			attr_dev(div14, "class", "block svelte-37w21y");
    			add_location(div14, file, 476, 1, 18088);
    			attr_dev(div15, "class", "wrapper svelte-37w21y");
    			add_location(div15, file, 47, 0, 1398);
    			attr_dev(div16, "class", "cards svelte-37w21y");
    			add_location(div16, file, 489, 0, 18459);
    			attr_dev(div17, "class", "wrapper svelte-37w21y");
    			add_location(div17, file, 521, 0, 19510);
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
    			insert_dev(target, div15, anchor);
    			append_dev(div15, div0);
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
    			append_dev(div15, t31);
    			append_dev(div15, h21);
    			append_dev(div15, t33);
    			append_dev(div15, div1);
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
    			append_dev(div15, t46);
    			append_dev(div15, div5);
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
    			append_dev(div15, t219);
    			append_dev(div15, div6);
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
    			append_dev(div15, t273);
    			append_dev(div15, div7);
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
    			append_dev(div15, t290);
    			append_dev(div15, div11);
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
    			append_dev(code25, mark56);
    			append_dev(code25, t317);
    			append_dev(code25, br83);
    			append_dev(div11, t318);
    			append_dev(div11, p28);
    			append_dev(div11, t320);
    			append_dev(div11, div8);
    			mount_component(tinyslider9, div8, null);
    			append_dev(div11, t321);
    			append_dev(div11, p29);
    			append_dev(p29, t322);
    			append_dev(p29, mark57);
    			append_dev(p29, t324);
    			append_dev(p29, mark58);
    			append_dev(p29, t326);
    			append_dev(p29, mark59);
    			append_dev(p29, t328);
    			append_dev(p29, mark60);
    			append_dev(p29, t330);
    			append_dev(div11, t331);
    			append_dev(div11, p30);
    			append_dev(p30, code26);
    			append_dev(code26, t332);
    			append_dev(code26, mark61);
    			append_dev(code26, t334);
    			append_dev(code26, mark62);
    			append_dev(code26, t336);
    			append_dev(code26, br84);
    			append_dev(code26, t337);
    			append_dev(code26, br85);
    			append_dev(code26, t338);
    			append_dev(code26, br86);
    			append_dev(code26, t339);
    			append_dev(code26, mark63);
    			append_dev(code26, t341);
    			append_dev(code26, br87);
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
    			append_dev(code26, mark64);
    			append_dev(code26, t350);
    			append_dev(div11, t351);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			mount_component(tinyslider10, div9, null);
    			append_dev(div15, t352);
    			append_dev(div15, div12);
    			mount_component(tinyslider11, div12, null);
    			append_dev(div15, t353);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			mount_component(tinyslider12, div13, null);
    			insert_dev(target, t354, anchor);
    			insert_dev(target, div16, anchor);
    			mount_component(tinyslider13, div16, null);
    			insert_dev(target, t355, anchor);
    			insert_dev(target, div17, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_5*/ ctx[23], false, false, false),
    					listen_dev(button1, "click", /*click_handler_6*/ ctx[24], false, false, false),
    					listen_dev(button2, "click", /*click_handler_7*/ ctx[25], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const tinyslider0_changes = {};

    			if (dirty[2] & /*$$scope*/ 512) {
    				tinyslider0_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider0.$set(tinyslider0_changes);
    			const tinyslider1_changes = {};

    			if (dirty[2] & /*$$scope*/ 512) {
    				tinyslider1_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider1.$set(tinyslider1_changes);
    			const tinyslider2_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 6 | dirty[2] & /*$$scope*/ 512) {
    				tinyslider2_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider2.$set(tinyslider2_changes);
    			const tinyslider3_changes = {};

    			if (dirty[0] & /*currentIndex, setIndex*/ 6 | dirty[2] & /*$$scope*/ 512) {
    				tinyslider3_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider3.$set(tinyslider3_changes);
    			const tinyslider4_changes = {};

    			if (dirty[0] & /*currentIndex, setIndex*/ 6 | dirty[2] & /*$$scope*/ 512) {
    				tinyslider4_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider4.$set(tinyslider4_changes);
    			const tinyslider5_changes = {};

    			if (dirty[2] & /*$$scope*/ 512) {
    				tinyslider5_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_setIndex && dirty[0] & /*setIndex*/ 2) {
    				updating_setIndex = true;
    				tinyslider5_changes.setIndex = /*setIndex*/ ctx[1];
    				add_flush_callback(() => updating_setIndex = false);
    			}

    			if (!updating_currentIndex && dirty[0] & /*currentIndex*/ 4) {
    				updating_currentIndex = true;
    				tinyslider5_changes.currentIndex = /*currentIndex*/ ctx[2];
    				add_flush_callback(() => updating_currentIndex = false);
    			}

    			tinyslider5.$set(tinyslider5_changes);
    			const tinyslider6_changes = {};

    			if (dirty[0] & /*sliderWidth*/ 8192 | dirty[2] & /*$$scope*/ 512) {
    				tinyslider6_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider6.$set(tinyslider6_changes);
    			const tinyslider7_changes = {};

    			if (dirty[0] & /*sliderWidth*/ 8192 | dirty[2] & /*$$scope*/ 512) {
    				tinyslider7_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider7.$set(tinyslider7_changes);
    			const tinyslider8_changes = {};

    			if (dirty[2] & /*$$scope*/ 512) {
    				tinyslider8_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider8.$set(tinyslider8_changes);
    			const tinyslider9_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex, portaitItems, sliderWidth*/ 8199 | dirty[2] & /*$$scope*/ 512) {
    				tinyslider9_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider9.$set(tinyslider9_changes);
    			const tinyslider10_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex, portaitItems*/ 7 | dirty[1] & /*shown*/ 64 | dirty[2] & /*$$scope*/ 512) {
    				tinyslider10_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider10.$set(tinyslider10_changes);
    			const tinyslider11_changes = {};

    			if (dirty[0] & /*currentIndex, setIndex, sliderWidth*/ 8198 | dirty[2] & /*$$scope*/ 512) {
    				tinyslider11_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider11.$set(tinyslider11_changes);
    			const tinyslider12_changes = {};

    			if (dirty[2] & /*$$scope*/ 512) {
    				tinyslider12_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider12.$set(tinyslider12_changes);
    			const tinyslider13_changes = {};

    			if (dirty[0] & /*setIndex, currentIndex*/ 6 | dirty[1] & /*reachedEnd, shown*/ 192 | dirty[2] & /*$$scope*/ 512) {
    				tinyslider13_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider13.$set(tinyslider13_changes);
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
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(tinyslider0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div15);
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
    			if (detaching) detach_dev(t354);
    			if (detaching) detach_dev(div16);
    			destroy_component(tinyslider13);
    			if (detaching) detach_dev(t355);
    			if (detaching) detach_dev(div17);
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
    		$$invalidate(1, setIndex);
    	}

    	function tinyslider5_currentIndex_binding(value) {
    		currentIndex = value;
    		$$invalidate(2, currentIndex);
    	}

    	const click_handler_5 = () => setIndex(2);
    	const click_handler_6 = () => setIndex(5);
    	const click_handler_7 = () => setIndex(9);
    	const click_handler_8 = (setIndex, currentIndex) => setIndex(currentIndex - 1);
    	const click_handler_9 = (setIndex, currentIndex) => setIndex(currentIndex + 1);
    	const click_handler_10 = (setIndex, currentIndex) => setIndex(currentIndex - 2);
    	const click_handler_11 = (setIndex, currentIndex) => setIndex(currentIndex + 2);
    	const click_handler_12 = (setIndex, i) => setIndex(i);
    	const focus_handler_1 = (setIndex, i) => setIndex(i);
    	const click_handler_13 = () => console.log('click');
    	const click_handler_14 = (setIndex, currentIndex) => setIndex(currentIndex - 2);
    	const click_handler_15 = (setIndex, currentIndex) => setIndex(currentIndex + 2);
    	const click_handler_16 = () => console.log('click');

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
    		if ('setIndex' in $$props) $$invalidate(1, setIndex = $$props.setIndex);
    		if ('currentIndex' in $$props) $$invalidate(2, currentIndex = $$props.currentIndex);
    		if ('sliderWidth' in $$props) $$invalidate(13, sliderWidth = $$props.sliderWidth);
    		if ('distanceToEnd' in $$props) $$invalidate(36, distanceToEnd = $$props.distanceToEnd);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*portaitItems*/ 1) {
    			if (distanceToEnd < sliderWidth) $$invalidate(0, portaitItems = [
    				...portaitItems,
    				...getItems("food-drink", "200x300", 10, portaitItems.length)
    			]);
    		}
    	};

    	return [
    		portaitItems,
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
    		sliderWidth,
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
    		focus_handler_1,
    		click_handler_13,
    		click_handler_14,
    		click_handler_15,
    		click_handler_16
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
