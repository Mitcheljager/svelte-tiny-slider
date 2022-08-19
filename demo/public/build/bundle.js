
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

    /* ..\src\TinySlider.svelte generated by Svelte v3.49.0 */

    const { window: window_1 } = globals;
    const file$1 = "..\\src\\TinySlider.svelte";

    const get_controls_slot_changes = dirty => ({
    	currentIndex: dirty & /*currentIndex*/ 1,
    	sliderWidth: dirty & /*sliderWidth*/ 32
    });

    const get_controls_slot_context = ctx => ({
    	currentIndex: /*currentIndex*/ ctx[0],
    	setIndex: /*setIndex*/ ctx[1],
    	sliderWidth: /*sliderWidth*/ ctx[5]
    });

    const get_default_slot_changes = dirty => ({ sliderWidth: dirty & /*sliderWidth*/ 32 });
    const get_default_slot_context = ctx => ({ sliderWidth: /*sliderWidth*/ ctx[5] });

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let style_transform = `translateX(${/*currentScrollPosition*/ ctx[3] * -1}px)`;

    	let style_transition_duration = `${/*isDragging*/ ctx[2]
	? 0
	: /*transitionDuration*/ ctx[7]}ms`;

    	let div1_resize_listener;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], get_default_slot_context);
    	const controls_slot_template = /*#slots*/ ctx[12].controls;
    	const controls_slot = create_slot(controls_slot_template, ctx, /*$$scope*/ ctx[11], get_controls_slot_context);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (controls_slot) controls_slot.c();
    			attr_dev(div0, "draggable", false);
    			attr_dev(div0, "class", "slider-content svelte-f4j34j");
    			set_style(div0, "transform", style_transform, false);
    			set_style(div0, "transition-duration", style_transition_duration, false);
    			add_location(div0, file$1, 103, 2, 2537);
    			attr_dev(div1, "class", "slider svelte-f4j34j");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[15].call(div1));
    			add_location(div1, file$1, 102, 0, 2456);
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

    			/*div0_binding*/ ctx[13](div0);
    			/*div1_binding*/ ctx[14](div1);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[15].bind(div1));
    			insert_dev(target, t, anchor);

    			if (controls_slot) {
    				controls_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "mousedown", /*down*/ ctx[8], false, false, false),
    					listen_dev(window_1, "mouseup", /*up*/ ctx[9], false, false, false),
    					listen_dev(window_1, "mousemove", /*move*/ ctx[10], false, false, false),
    					listen_dev(window_1, "touchstart", /*down*/ ctx[8], false, false, false),
    					listen_dev(window_1, "touchend", /*up*/ ctx[9], false, false, false),
    					listen_dev(window_1, "touchmove", /*move*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, sliderWidth*/ 2080)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (dirty & /*currentScrollPosition*/ 8 && style_transform !== (style_transform = `translateX(${/*currentScrollPosition*/ ctx[3] * -1}px)`)) {
    				set_style(div0, "transform", style_transform, false);
    			}

    			if (dirty & /*isDragging*/ 4 && style_transition_duration !== (style_transition_duration = `${/*isDragging*/ ctx[2]
			? 0
			: /*transitionDuration*/ ctx[7]}ms`)) {
    				set_style(div0, "transition-duration", style_transition_duration, false);
    			}

    			if (controls_slot) {
    				if (controls_slot.p && (!current || dirty & /*$$scope, currentIndex, sliderWidth*/ 2081)) {
    					update_slot_base(
    						controls_slot,
    						controls_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(controls_slot_template, /*$$scope*/ ctx[11], dirty, get_controls_slot_changes),
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
    			/*div0_binding*/ ctx[13](null);
    			/*div1_binding*/ ctx[14](null);
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
    	let { currentIndex = 0 } = $$props;
    	let isDragging = false;
    	let movementStartX = 0;
    	let currentScrollPosition = 0;
    	let finalScrollPosition = 0;
    	let sliderElement;
    	let sliderWidth = 0;
    	let contentElement;
    	let transitionDuration = 300;

    	function setIndex(i) {
    		const length = getItemSizes().length;
    		if (i < 0) i = 0;
    		if (i > length - 1) i = length - 1;
    		return snapToPosition({ setIndex: i });
    	}

    	function down(event) {
    		if (event.target != sliderElement && event.target.closest(".slider") != sliderElement) return;
    		movementStartX = event.pageX || event.touches[0].pageX;
    		$$invalidate(2, isDragging = true);
    	}

    	function up() {
    		if (!isDragging) return;
    		const direction = currentScrollPosition > finalScrollPosition ? 1 : -1;
    		snapToPosition({ direction });
    		$$invalidate(2, isDragging = false);
    	}

    	function move(event) {
    		if (!isDragging) return;

    		if (event.touches?.length) {
    			event.pageX = event.touches[0].pageX;
    			event.movementX = event.touches[0].pageX - movementStartX;
    		}

    		if (event.pageX + event.movementX < 0 || event.pageX + event.movementX > window.innerWidth) {
    			up();
    			return;
    		}

    		setScrollPosition(finalScrollPosition + (movementStartX - event.pageX));
    	}

    	function snapToPosition({ setIndex = -1, direction = 1 } = {}) {
    		const sizes = getItemSizes();
    		const total = sizes.reduce((p, c) => p + c);
    		$$invalidate(0, currentIndex = 0);
    		let sum = 0;
    		let i = 0;

    		for (i = 0; i < sizes.length; i++) {
    			if (setIndex != -1) {
    				if (i >= setIndex) break;
    			} else if (direction > 0 && sum > currentScrollPosition || direction < 0 && sum + sizes[currentIndex + 1] > currentScrollPosition) {
    				break;
    			}

    			sum += sizes[i];
    		}

    		$$invalidate(0, currentIndex = Math.min(i, sizes.length - 1));
    		sum = Math.min(sum, total - sliderWidth);
    		setScrollPosition(sum);
    		finalScrollPosition = currentScrollPosition;
    	}

    	function setScrollPosition(left) {
    		const sizes = getItemSizes();
    		left = Math.min(left, sizes.reduce((p, c) => p + c));
    		$$invalidate(3, currentScrollPosition = left);
    	}

    	function getItemSizes() {
    		return Array.from(contentElement.children).map(item => item.clientWidth);
    	}

    	const writable_props = ['currentIndex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TinySlider> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			contentElement = $$value;
    			$$invalidate(6, contentElement);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			sliderElement = $$value;
    			$$invalidate(4, sliderElement);
    		});
    	}

    	function div1_elementresize_handler() {
    		sliderWidth = this.clientWidth;
    		$$invalidate(5, sliderWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('currentIndex' in $$props) $$invalidate(0, currentIndex = $$props.currentIndex);
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		currentIndex,
    		isDragging,
    		movementStartX,
    		currentScrollPosition,
    		finalScrollPosition,
    		sliderElement,
    		sliderWidth,
    		contentElement,
    		transitionDuration,
    		setIndex,
    		down,
    		up,
    		move,
    		snapToPosition,
    		setScrollPosition,
    		getItemSizes
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentIndex' in $$props) $$invalidate(0, currentIndex = $$props.currentIndex);
    		if ('isDragging' in $$props) $$invalidate(2, isDragging = $$props.isDragging);
    		if ('movementStartX' in $$props) movementStartX = $$props.movementStartX;
    		if ('currentScrollPosition' in $$props) $$invalidate(3, currentScrollPosition = $$props.currentScrollPosition);
    		if ('finalScrollPosition' in $$props) finalScrollPosition = $$props.finalScrollPosition;
    		if ('sliderElement' in $$props) $$invalidate(4, sliderElement = $$props.sliderElement);
    		if ('sliderWidth' in $$props) $$invalidate(5, sliderWidth = $$props.sliderWidth);
    		if ('contentElement' in $$props) $$invalidate(6, contentElement = $$props.contentElement);
    		if ('transitionDuration' in $$props) $$invalidate(7, transitionDuration = $$props.transitionDuration);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currentIndex,
    		setIndex,
    		isDragging,
    		currentScrollPosition,
    		sliderElement,
    		sliderWidth,
    		contentElement,
    		transitionDuration,
    		down,
    		up,
    		move,
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
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { currentIndex: 0, setIndex: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TinySlider",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get currentIndex() {
    		throw new Error("<TinySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentIndex(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setIndex() {
    		return this.$$.ctx[1];
    	}

    	set setIndex(value) {
    		throw new Error("<TinySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (37:2) {#each items as item}
    function create_each_block_2(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let style___width = `${/*sliderWidth*/ ctx[9]}px`;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[10])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-2yp90z");
    			add_location(img, file, 41, 4, 1478);
    			attr_dev(div, "class", "item svelte-2yp90z");
    			set_style(div, "--width", style___width, false);
    			set_style(div, "--height", `400px`, false);
    			add_location(div, file, 37, 3, 1384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sliderWidth*/ 512 && style___width !== (style___width = `${/*sliderWidth*/ ctx[9]}px`)) {
    				set_style(div, "--width", style___width, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(37:2) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    // (36:1) <TinySlider bind:setIndex let:currentIndex let:sliderWidth>
    function create_default_slot_1(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*items*/ ctx[1];
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
    			if (dirty & /*sliderWidth, items*/ 514) {
    				each_value_2 = /*items*/ ctx[1];
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
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(36:1) <TinySlider bind:setIndex let:currentIndex let:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (47:3) {#each items as item, i}
    function create_each_block_1(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*i*/ ctx[14]);
    	}

    	function focus_handler() {
    		return /*focus_handler*/ ctx[4](/*i*/ ctx[14]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[10])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "height", "40");
    			attr_dev(img, "class", "svelte-2yp90z");
    			add_location(img, file, 52, 5, 1742);
    			attr_dev(button, "class", "dot svelte-2yp90z");
    			toggle_class(button, "active", /*i*/ ctx[14] == /*currentIndex*/ ctx[8]);
    			add_location(button, file, 47, 4, 1600);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", click_handler, false, false, false),
    					listen_dev(button, "focus", focus_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*currentIndex*/ 256) {
    				toggle_class(button, "active", /*i*/ ctx[14] == /*currentIndex*/ ctx[8]);
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
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(47:3) {#each items as item, i}",
    		ctx
    	});

    	return block;
    }

    // (46:2) 
    function create_controls_slot_1(ctx) {
    	let div;
    	let each_value_1 = /*items*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "slot", "controls");
    			attr_dev(div, "class", "dots svelte-2yp90z");
    			add_location(div, file, 45, 2, 1531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentIndex, setIndex, items*/ 259) {
    				each_value_1 = /*items*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
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
    		source: "(46:2) ",
    		ctx
    	});

    	return block;
    }

    // (66:4) {#each portaitItems as item}
    function create_each_block(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[10])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-2yp90z");
    			add_location(img, file, 67, 6, 2128);
    			attr_dev(div, "class", "item svelte-2yp90z");
    			set_style(div, "--width", `200px`, false);
    			add_location(div, file, 66, 5, 2080);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(66:4) {#each portaitItems as item}",
    		ctx
    	});

    	return block;
    }

    // (65:3) <TinySlider let:setIndex let:currentIndex let:sliderWidth>
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let each_value = /*portaitItems*/ ctx[2];
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
    			if (dirty & /*portaitItems*/ 4) {
    				each_value = /*portaitItems*/ ctx[2];
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
    		source: "(65:3) <TinySlider let:setIndex let:currentIndex let:sliderWidth>",
    		ctx
    	});

    	return block;
    }

    // (73:5) {#if currentIndex > 0}
    function create_if_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[6](/*setIndex*/ ctx[0], /*currentIndex*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "←";
    			attr_dev(button, "class", "arrow left svelte-2yp90z");
    			add_location(button, file, 73, 6, 2257);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(73:5) {#if currentIndex > 0}",
    		ctx
    	});

    	return block;
    }

    // (77:5) {#if currentIndex < portaitItems.length - 1}
    function create_if_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[7](/*setIndex*/ ctx[0], /*currentIndex*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "→";
    			attr_dev(button, "class", "arrow right svelte-2yp90z");
    			add_location(button, file, 77, 6, 2411);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(77:5) {#if currentIndex < portaitItems.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (72:4) <svelte:fragment slot="controls">
    function create_controls_slot(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*currentIndex*/ ctx[8] > 0 && create_if_block_1(ctx);
    	let if_block1 = /*currentIndex*/ ctx[8] < /*portaitItems*/ ctx[2].length - 1 && create_if_block(ctx);

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
    		},
    		p: function update(ctx, dirty) {
    			if (/*currentIndex*/ ctx[8] > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*currentIndex*/ ctx[8] < /*portaitItems*/ ctx[2].length - 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
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
    		source: "(72:4) <svelte:fragment slot=\\\"controls\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div2;
    	let tinyslider0;
    	let updating_setIndex;
    	let t;
    	let div1;
    	let div0;
    	let tinyslider1;
    	let current;

    	function tinyslider0_setIndex_binding(value) {
    		/*tinyslider0_setIndex_binding*/ ctx[5](value);
    	}

    	let tinyslider0_props = {
    		$$slots: {
    			controls: [
    				create_controls_slot_1,
    				({ currentIndex, sliderWidth }) => ({ 8: currentIndex, 9: sliderWidth }),
    				({ currentIndex, sliderWidth }) => (currentIndex ? 256 : 0) | (sliderWidth ? 512 : 0)
    			],
    			default: [
    				create_default_slot_1,
    				({ currentIndex, sliderWidth }) => ({ 8: currentIndex, 9: sliderWidth }),
    				({ currentIndex, sliderWidth }) => (currentIndex ? 256 : 0) | (sliderWidth ? 512 : 0)
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*setIndex*/ ctx[0] !== void 0) {
    		tinyslider0_props.setIndex = /*setIndex*/ ctx[0];
    	}

    	tinyslider0 = new TinySlider({ props: tinyslider0_props, $$inline: true });
    	binding_callbacks.push(() => bind(tinyslider0, 'setIndex', tinyslider0_setIndex_binding));

    	tinyslider1 = new TinySlider({
    			props: {
    				$$slots: {
    					controls: [
    						create_controls_slot,
    						({ setIndex, currentIndex, sliderWidth }) => ({
    							0: setIndex,
    							8: currentIndex,
    							9: sliderWidth
    						}),
    						({ setIndex, currentIndex, sliderWidth }) => (setIndex ? 1 : 0) | (currentIndex ? 256 : 0) | (sliderWidth ? 512 : 0)
    					],
    					default: [
    						create_default_slot,
    						({ setIndex, currentIndex, sliderWidth }) => ({
    							0: setIndex,
    							8: currentIndex,
    							9: sliderWidth
    						}),
    						({ setIndex, currentIndex, sliderWidth }) => (setIndex ? 1 : 0) | (currentIndex ? 256 : 0) | (sliderWidth ? 512 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(tinyslider0.$$.fragment);
    			t = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(tinyslider1.$$.fragment);
    			attr_dev(div0, "class", "slider-wrapper svelte-2yp90z");
    			add_location(div0, file, 63, 2, 1948);
    			attr_dev(div1, "class", "relative svelte-2yp90z");
    			add_location(div1, file, 62, 1, 1922);
    			attr_dev(div2, "class", "wrapper svelte-2yp90z");
    			add_location(div2, file, 34, 0, 1271);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(tinyslider0, div2, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(tinyslider1, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tinyslider0_changes = {};

    			if (dirty & /*$$scope, currentIndex, setIndex, sliderWidth*/ 131841) {
    				tinyslider0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_setIndex && dirty & /*setIndex*/ 1) {
    				updating_setIndex = true;
    				tinyslider0_changes.setIndex = /*setIndex*/ ctx[0];
    				add_flush_callback(() => updating_setIndex = false);
    			}

    			tinyslider0.$set(tinyslider0_changes);
    			const tinyslider1_changes = {};

    			if (dirty & /*$$scope, setIndex, currentIndex*/ 131329) {
    				tinyslider1_changes.$$scope = { dirty, ctx };
    			}

    			tinyslider1.$set(tinyslider1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tinyslider0.$$.fragment, local);
    			transition_in(tinyslider1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tinyslider0.$$.fragment, local);
    			transition_out(tinyslider1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(tinyslider0);
    			destroy_component(tinyslider1);
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

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
    	];

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
    	];

    	let setIndex;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => setIndex(i);
    	const focus_handler = i => setIndex(i);

    	function tinyslider0_setIndex_binding(value) {
    		setIndex = value;
    		$$invalidate(0, setIndex);
    	}

    	const click_handler_1 = (setIndex, currentIndex) => setIndex(currentIndex - 1);
    	const click_handler_2 = (setIndex, currentIndex) => setIndex(currentIndex + 1);

    	$$self.$capture_state = () => ({
    		TinySlider,
    		items,
    		portaitItems,
    		setIndex
    	});

    	$$self.$inject_state = $$props => {
    		if ('setIndex' in $$props) $$invalidate(0, setIndex = $$props.setIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		setIndex,
    		items,
    		portaitItems,
    		click_handler,
    		focus_handler,
    		tinyslider0_setIndex_binding,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

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
