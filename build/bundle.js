
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

    /* ..\src\TinyGallery.svelte generated by Svelte v3.49.0 */

    const { window: window_1 } = globals;
    const file$1 = "..\\src\\TinyGallery.svelte";

    const get_controls_slot_changes = dirty => ({
    	currentIndex: dirty & /*currentIndex*/ 1,
    	galleryWidth: dirty & /*galleryWidth*/ 16
    });

    const get_controls_slot_context = ctx => ({
    	currentIndex: /*currentIndex*/ ctx[0],
    	galleryWidth: /*galleryWidth*/ ctx[4]
    });

    const get_default_slot_changes = dirty => ({
    	galleryWidth: dirty & /*galleryWidth*/ 16
    });

    const get_default_slot_context = ctx => ({ galleryWidth: /*galleryWidth*/ ctx[4] });

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let style_transform = `translateX(${/*currentScrollPosition*/ ctx[2] * -1}px)`;

    	let style_transition_duration = `${/*isDragging*/ ctx[1]
	? 0
	: /*transitionDuration*/ ctx[6]}ms`;

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
    			attr_dev(div0, "class", "gallery svelte-1kgp6bg");
    			set_style(div0, "transform", style_transform, false);
    			set_style(div0, "transition-duration", style_transition_duration, false);
    			add_location(div0, file$1, 82, 2, 2077);
    			attr_dev(div1, "class", "gallery-wrapper svelte-1kgp6bg");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[15].call(div1));
    			add_location(div1, file$1, 81, 0, 1978);
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
    					listen_dev(window_1, "mousedown", /*down*/ ctx[7], false, false, false),
    					listen_dev(window_1, "mouseup", /*up*/ ctx[8], false, false, false),
    					listen_dev(window_1, "mousemove", /*move*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, galleryWidth*/ 2064)) {
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

    			if (dirty & /*currentScrollPosition*/ 4 && style_transform !== (style_transform = `translateX(${/*currentScrollPosition*/ ctx[2] * -1}px)`)) {
    				set_style(div0, "transform", style_transform, false);
    			}

    			if (dirty & /*isDragging*/ 2 && style_transition_duration !== (style_transition_duration = `${/*isDragging*/ ctx[1]
			? 0
			: /*transitionDuration*/ ctx[6]}ms`)) {
    				set_style(div0, "transition-duration", style_transition_duration, false);
    			}

    			if (controls_slot) {
    				if (controls_slot.p && (!current || dirty & /*$$scope, currentIndex, galleryWidth*/ 2065)) {
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
    	validate_slots('TinyGallery', slots, ['default','controls']);
    	const setIndex = i => snapToPosition({ setIndex: i });
    	let currentIndex = 0;
    	let isDragging = false;
    	let movementStartX = 0;
    	let currentScrollPosition = 0;
    	let finalScrollPosition = 0;
    	let galleryWrapperElement;
    	let galleryWidth = 0;
    	let galleryElement;
    	let transitionDuration = 300;

    	function down(event) {
    		if (!(event.target == galleryWrapperElement || event.target.closest(".gallery-wrapper") == galleryWrapperElement)) return;
    		movementStartX = event.pageX;
    		$$invalidate(1, isDragging = true);
    	}

    	function up() {
    		if (!isDragging) return;
    		const direction = currentScrollPosition > finalScrollPosition ? 1 : -1;
    		snapToPosition({ direction });
    		$$invalidate(1, isDragging = false);
    	}

    	function move(event) {
    		if (!isDragging) return;

    		if (event.pageX + event.movementX < 0 || event.pageX + event.movementX > window.innerWidth) {
    			up();
    			return;
    		}

    		setScrollPosition(finalScrollPosition + (movementStartX - event.pageX));
    	}

    	function snapToPosition({ setIndex = -1, direction = 1 } = {}) {
    		const sizes = getItemSizes();
    		$$invalidate(0, currentIndex = 0);
    		let total = 0;
    		let i = 0;

    		for (i = 0; i < sizes.length; i++) {
    			if (setIndex != -1) {
    				if (i >= setIndex) break;
    			} else if (direction > 0 && total > currentScrollPosition || direction < 0 && total + sizes[currentIndex + 1] > currentScrollPosition) {
    				break;
    			}

    			total += sizes[i];
    		}

    		$$invalidate(0, currentIndex = i);
    		setScrollPosition(total);
    		finalScrollPosition = currentScrollPosition;
    	}

    	function setScrollPosition(left) {
    		const sizes = getItemSizes();
    		left = Math.min(left, sizes.reduce((p, c) => p + c));
    		$$invalidate(2, currentScrollPosition = left);
    	}

    	function getItemSizes() {
    		return Array.from(galleryElement.children).map(item => item.width);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TinyGallery> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			galleryElement = $$value;
    			$$invalidate(5, galleryElement);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			galleryWrapperElement = $$value;
    			$$invalidate(3, galleryWrapperElement);
    		});
    	}

    	function div1_elementresize_handler() {
    		galleryWidth = this.clientWidth;
    		$$invalidate(4, galleryWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setIndex,
    		currentIndex,
    		isDragging,
    		movementStartX,
    		currentScrollPosition,
    		finalScrollPosition,
    		galleryWrapperElement,
    		galleryWidth,
    		galleryElement,
    		transitionDuration,
    		down,
    		up,
    		move,
    		snapToPosition,
    		setScrollPosition,
    		getItemSizes
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentIndex' in $$props) $$invalidate(0, currentIndex = $$props.currentIndex);
    		if ('isDragging' in $$props) $$invalidate(1, isDragging = $$props.isDragging);
    		if ('movementStartX' in $$props) movementStartX = $$props.movementStartX;
    		if ('currentScrollPosition' in $$props) $$invalidate(2, currentScrollPosition = $$props.currentScrollPosition);
    		if ('finalScrollPosition' in $$props) finalScrollPosition = $$props.finalScrollPosition;
    		if ('galleryWrapperElement' in $$props) $$invalidate(3, galleryWrapperElement = $$props.galleryWrapperElement);
    		if ('galleryWidth' in $$props) $$invalidate(4, galleryWidth = $$props.galleryWidth);
    		if ('galleryElement' in $$props) $$invalidate(5, galleryElement = $$props.galleryElement);
    		if ('transitionDuration' in $$props) $$invalidate(6, transitionDuration = $$props.transitionDuration);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currentIndex,
    		isDragging,
    		currentScrollPosition,
    		galleryWrapperElement,
    		galleryWidth,
    		galleryElement,
    		transitionDuration,
    		down,
    		up,
    		move,
    		setIndex,
    		$$scope,
    		slots,
    		div0_binding,
    		div1_binding,
    		div1_elementresize_handler
    	];
    }

    class TinyGallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { setIndex: 10 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TinyGallery",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get setIndex() {
    		return this.$$.ctx[10];
    	}

    	set setIndex(value) {
    		throw new Error("<TinyGallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */
    const file = "src\\App.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (24:2) {#each items as item}
    function create_each_block_1(ctx) {
    	let img;
    	let img_src_value;
    	let img_width_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[7])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", img_width_value = /*galleryWidth*/ ctx[6] / Math.ceil(Math.random() * 4));
    			attr_dev(img, "class", "svelte-ez36ym");
    			add_location(img, file, 24, 3, 960);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*galleryWidth*/ 64 && img_width_value !== (img_width_value = /*galleryWidth*/ ctx[6] / Math.ceil(Math.random() * 4))) {
    				attr_dev(img, "width", img_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(24:2) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    // (23:1) <TinyGallery bind:setIndex let:currentIndex let:galleryWidth>
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*items*/ ctx[1];
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
    			if (dirty & /*items, galleryWidth, Math*/ 66) {
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
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(23:1) <TinyGallery bind:setIndex let:currentIndex let:galleryWidth>",
    		ctx
    	});

    	return block;
    }

    // (29:3) {#each items as item, i}
    function create_each_block(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*i*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "dot svelte-ez36ym");
    			toggle_class(div, "active", /*i*/ ctx[9] == /*currentIndex*/ ctx[5]);
    			add_location(div, file, 29, 4, 1123);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*currentIndex*/ 32) {
    				toggle_class(div, "active", /*i*/ ctx[9] == /*currentIndex*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(29:3) {#each items as item, i}",
    		ctx
    	});

    	return block;
    }

    // (28:2) 
    function create_controls_slot(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let mounted;
    	let dispose;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "set active to 2";
    			add_location(div0, file, 32, 3, 1223);
    			attr_dev(div1, "slot", "controls");
    			attr_dev(div1, "class", "dots svelte-ez36ym");
    			add_location(div1, file, 27, 2, 1054);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_1*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentIndex, setIndex*/ 33) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_controls_slot.name,
    		type: "slot",
    		source: "(28:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let tinygallery;
    	let updating_setIndex;
    	let current;

    	function tinygallery_setIndex_binding(value) {
    		/*tinygallery_setIndex_binding*/ ctx[4](value);
    	}

    	let tinygallery_props = {
    		$$slots: {
    			controls: [
    				create_controls_slot,
    				({ currentIndex, galleryWidth }) => ({ 5: currentIndex, 6: galleryWidth }),
    				({ currentIndex, galleryWidth }) => (currentIndex ? 32 : 0) | (galleryWidth ? 64 : 0)
    			],
    			default: [
    				create_default_slot,
    				({ currentIndex, galleryWidth }) => ({ 5: currentIndex, 6: galleryWidth }),
    				({ currentIndex, galleryWidth }) => (currentIndex ? 32 : 0) | (galleryWidth ? 64 : 0)
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*setIndex*/ ctx[0] !== void 0) {
    		tinygallery_props.setIndex = /*setIndex*/ ctx[0];
    	}

    	tinygallery = new TinyGallery({ props: tinygallery_props, $$inline: true });
    	binding_callbacks.push(() => bind(tinygallery, 'setIndex', tinygallery_setIndex_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tinygallery.$$.fragment);
    			attr_dev(div, "class", "wrapper svelte-ez36ym");
    			add_location(div, file, 21, 0, 845);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tinygallery, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tinygallery_changes = {};

    			if (dirty & /*$$scope, setIndex, currentIndex, galleryWidth*/ 4193) {
    				tinygallery_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_setIndex && dirty & /*setIndex*/ 1) {
    				updating_setIndex = true;
    				tinygallery_changes.setIndex = /*setIndex*/ ctx[0];
    				add_flush_callback(() => updating_setIndex = false);
    			}

    			tinygallery.$set(tinygallery_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tinygallery.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tinygallery.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tinygallery);
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
    	];

    	let setIndex;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => setIndex(i);
    	const click_handler_1 = () => setIndex(2);

    	function tinygallery_setIndex_binding(value) {
    		setIndex = value;
    		$$invalidate(0, setIndex);
    	}

    	$$self.$capture_state = () => ({ TinyGallery, items, setIndex });

    	$$self.$inject_state = $$props => {
    		if ('setIndex' in $$props) $$invalidate(0, setIndex = $$props.setIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [setIndex, items, click_handler, click_handler_1, tinygallery_setIndex_binding];
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
