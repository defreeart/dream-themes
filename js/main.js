DreamThemesApp();

function DreamThemesApp() {
    class CommonLogic {
        isType(name, object) {
            let type = Object.prototype.toString.call(object);
            return type === `[object ${name}]`;
        }

        getNodes(name, i, parent) {
            parent = parent || document;
            let a = parent.querySelector(name);
            let b = parent.querySelectorAll(name);
            return (i === 1) ? a : b;
        }

        filterObject(target, ...keys) {
            let rest = Object.keys(target)
                .filter(x => keys.indexOf(x) < 0)
                .reduce((a, b) => Object.assign(a, { [b]: target[b] }), {});
            return rest;
        }
    }

    class Config extends CommonLogic {
        constructor(options, props) {
            super();
            this.main(options, props);
        }

        main(options, props) {
            if (!this.isType('Object', props)) props = {};
            Object.assign(this, this.merge(options, props));
        }

        merge(options, props) {
            for (let key in options) {
                let none = props[key] === undefined;
                if (none) props[key] = options[key];
            }
            return props;
        }
    }

    class VirtualDOM extends CommonLogic {
        constructor(nodes) {
            super();
            this.main(nodes);
        }

        main(nodes) {
            let dom = this.parseRoot(nodes);
            if (!dom) return;
            Object.assign(this, dom);
        }

        parseRoot(nodes) {
            let dom = {};
            for (let key in nodes) {
                dom[key] = this.parseRootNode(nodes[key]);
                if (!dom[key]) return;
            }
            let size = Object.keys(dom).length;
            return size ? dom : this.warn(null);
        }

        parseRootNode(item, $) {
            if (this.isType('Object', item)) {
                return this.parseObject(item, $);
            } else if (this.isType('Array', item)) {
                return this.getArray(item[0], $);
            } else {
                return this.getSingleNode(item, $);
            }
        }

        parseObject(item, parent) {
            let dom = this.getInitialObject(item.$, parent);
            if (!dom) return;
            let children = this.filterObject(item, '$');
            if (!this.getTheRest(children, dom)) return;
            return dom;
        }

        getInitialObject(selector, parent) {
            let node = this.getNodes(selector, 1, parent);
            return (!node) ? this.warn(selector) : { $: node };
        }

        getTheRest(children, dom) {
            for (let key in children) {
                dom[key] = this.parseRootNode(children[key], dom.$);
                if (!dom[key]) return;
            }
            return true;
        }

        getArray(selector, parent) {
            if (this.isType('Object', selector)) {
                return this.getArrayOfObjects(selector, parent);
            } else {
                return this.getArrayOfNodes(selector, parent);
            }
        }

        getArrayOfObjects(selector, parent) {
            let parents = this.getArray(selector.$, parent);
            if (!parents) return;
            parents = parents.map(x => ({ $: x }));
            let children = this.filterObject(selector, '$');
            for (let dom of parents) {
                if (!this.getTheRest(children, dom)) return;
            }
            return parents;
        }

        getArrayOfNodes(selector, parent) {
            let n = this.getNodes(selector, null, parent);
            return (!n.length) ? this.warn(`[${selector}]`) : Array.from(n);
        }

        getSingleNode(selector, parent) {
            let n = this.getNodes(selector, 1, parent);
            return (!n) ? this.warn(selector) : n;
        }

        warn(key) {
            let name = this.constructor.name;
            if (key === null) {
                console.warn(`${name}: No data to retrieve any element`);
            } else {
                console.warn(`${name}: The element is not found: ${key}`);
            }
        }
    }

    class TransitionFunctions {
        linear(t, b, c, d) {
            return c * t / d + b;
        }

        easeInQuad(t, b, c, d) {
            t /= d;
            return c * t * t + b;
        }

        easeOutQuad(t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        }

        easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        easeInCubic(t, b, c, d) {
            t /= d;
            return c * t * t * t + b;
        }

        easeOutCubic(t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t + 1) + b;
        }

        easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }

        easeInQuart(t, b, c, d) {
            t /= d;
            return c * t * t * t * t + b;
        }

        easeOutQuart(t, b, c, d) {
            t /= d;
            t--;
            return -c * (t * t * t * t - 1) + b;
        }

        easeInOutQuart(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t * t + b;
            t -= 2;
            return -c / 2 * (t * t * t * t - 2) + b;
        }

        easeInQuint(t, b, c, d) {
            t /= d;
            return c * t * t * t * t * t + b;
        }

        easeOutQuint(t, b, c, d) {
            t /= d;
            t--;
            return c * (t * t * t * t * t + 1) + b;
        }

        easeInOutQuint(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t * t * t + 2) + b;
        }

        easeInSine(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        }

        easeOutSine(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        }

        easeInOutSine(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }

        easeInExpo(t, b, c, d) {
            return c * Math.pow(2, 10 * (t / d - 1)) + b;
        }

        easeOutExpo(t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }

        easeInOutExpo(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            t--;
            return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
        }

        easeInCirc(t, b, c, d) {
            t /= d;
            return -c * (Math.sqrt(1 - t * t) - 1) + b;
        }

        easeOutCirc(t, b, c, d) {
            t /= d;
            t--;
            return c * Math.sqrt(1 - t * t) + b;
        }

        easeInOutCirc(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            t -= 2;
            return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
        }
    }

    function init() {
        DFMobileHeightFixV1();
        DFHeightAdjusterV1({
            target: 'h3'
        });
        DFCustomSwiperV1({
            speed: 750,
            autoplay: 5250
        });
        DFGlideScrollV1({
            duration: 750,
            header: '.intro-nav'
        });
        DFStickyHeaderV1();
        DFIntroAnimationV1({
            fn: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            duration: 1500,
            delay: 250,
            property: 'transform, opacity'
        });
        DFBurgerV1({
            burger: '.burger',
            activeClass: 'active'
        });
    }

    function DFMobileHeightFixV1(props) {
        const CONFIG = new Config({
            html: 'html',
            variable: '--js-100vh'
        }, props);

        const DOM = new VirtualDOM({
            html: CONFIG.html
        });

        const controller = {
            main() {
                if (!Object.keys(DOM).length) return;
                logic.main();
                listeners.main();
            }
        };

        const logic = {
            main() {
                this.update();
            },
            update() {
                let value = `${window.innerHeight}px`;
                DOM.html.style.setProperty(CONFIG.variable, value);
            }
        };

        const listeners = {
            main() {
                this.onResize();
            },
            onResize() {
                window.addEventListener('resize', () => {
                    logic.main();
                });
            }
        };

        window.addEventListener('load', () => {
            controller.main();
        });
    }

    function DFCustomSwiperV1(props) {
        const CONFIG = new Config({
            swiper: '.swiper-container',
            loop: true,
            speed: 500,
            autoHeight: true,
            autoplay: 5000,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            autoplayBreakpoint: true,
            autoplayMediaQuery: '(max-width: 640px)'
        }, props);

        const DOM = new VirtualDOM({
            swiper: CONFIG.swiper
        });

        let store = {
            swiper: null
        };

        const controller = {
            main() {
                if (!Object.keys(DOM).length) return;
                logic.main();
                listeners.main();
            }
        };

        const logic = {
            main() {
                this.setSwiper();
            },
            setSwiper() {
                store.swiper = new Swiper(CONFIG.swiper, {
                    loop: CONFIG.loop,
                    speed: CONFIG.speed,
                    autoHeight: CONFIG.autoHeight,
                    autoplay: this.getAutoplay(),
                    navigation: {
                        nextEl: CONFIG.nextButton,
                        prevEl: CONFIG.prevButton
                    }
                });
            },
            getAutoplay() {
                return this.isFixed() ? false : { delay: CONFIG.autoplay };
            },
            isFixed() {
                let a = matchMedia(CONFIG.autoplayMediaQuery).matches;
                let b = CONFIG.autoplayBreakpoint;
                return a && b;
            }
        };

        const listeners = {
            main() {
                this.onResize();
            },
            onResize() {
                window.addEventListener('resize', () => {
                    update.main();
                });
            }
        };

        const update = {
            main() {
                this.resetSwiper();
            },
            resetSwiper() {
                if (!logic.isFixed()) return;
                this.change(store, 'destroy');
                logic.main();
            },
            change({ swiper }, fn) {
                if (!Array.isArray(swiper)) return swiper[fn]();
                for (let item of swiper) item[fn]();
            }
        };

        window.addEventListener('load', () => {
            controller.main();
        });
    }

    function DFStickyHeaderV1(props) {
        const CONFIG = new Config({
            header: '.df-sticky-header',
            relative: '.df-sticky-header-relative',
            fixedClass: 'js-fixed'
        }, props);

        const DOM = new VirtualDOM({
            header: CONFIG.header
        });

        let store = {
            relative: {
                node: document.querySelector(CONFIG.relative),
                height: 1
            }
        };

        const controller = {
            main() {
                if (!Object.keys(DOM).length) return;
                logic.main();
                listeners.main();
            }
        };

        const logic = {
            main() {
                this.setHeight(store.relative);
                this.switchBar(DOM);
            },
            setHeight({ node }) {
                if (!node) return;
                let box = node.getBoundingClientRect();
                store.relative.height = box.height;
            },
            switchBar({ header }) {
                if (window.pageYOffset >= store.relative.height) {
                    header.classList.add(CONFIG.fixedClass);
                } else {
                    header.classList.remove(CONFIG.fixedClass);
                }
            }
        };

        const listeners = {
            main() {
                this.onScroll();
                this.onResize();
            },
            onScroll() {
                window.addEventListener('scroll', () => {
                    logic.switchBar(DOM);
                });
            },
            onResize() {
                window.addEventListener('resize', () => {
                    logic.main();
                });
            }
        };

        window.addEventListener('load', () => {
            controller.main();
        });
    }

    function DFGlideScrollV1(props) {
        const CONFIG = new Config({
            functionName: 'easeOutQuad',
            linkAttribute: 'data-df-glide-scroll',
            header: '[data-df-glide-scroll-header]',
            fixedClass: 'js-fixed',
            duration: 1000
        }, props);

        const DOM = new VirtualDOM({
            links: [`[${CONFIG.linkAttribute}]`]
        });

        let store = {
            fn: TransitionFunctions.prototype[CONFIG.functionName],
            header: document.querySelector(CONFIG.header),
            duration: null,
            anchor: null,
            target: null,
            main() {
                this.setDuration();
            },
            setDuration() {
                this.duration = this.getValid(CONFIG.duration);
            },
            getValid(n) {
                let a = Number.isFinite(n);
                let b = n >= 0;
                return (a && b) ? n : 0;
            },
            setAnchor(link) {
                this.anchor = this.getAnchor(link);
                return this.anchor ? true : false;
            },
            getAnchor(link) {
                let anchor = link.getAttribute(CONFIG.linkAttribute);
                return anchor ? document.querySelector(anchor) : null;
            }
        };

        const controller = {
            main() {
                if (!Object.keys(DOM).length) return;
                store.main();
                listeners.main();
            },
            process(link) {
                if (!store.setAnchor(link)) return;
                logic.main();
            }
        };

        const logic = {
            main() {
                this.setTargetCoordinates();
                requestAnimationFrame(time => {
                    this.animate(time, store);
                });
            },
            setTargetCoordinates() {
                let top = store.anchor.getBoundingClientRect().top;
                let y = window.pageYOffset;
                let destination = top + y;
                let shift = this.getShift(destination);
                top -= shift;
                destination -= shift;
                store.target = { top, y, destination };
            },
            getShift(destination) {
                let h = this.getFixedHeaderHeight(store);
                return (destination > h) ? h : 0;
            },
            getFixedHeaderHeight({ header }) {
                if (!header) return 0;
                if (header.classList.contains(CONFIG.fixedClass)) {
                    return header.getBoundingClientRect().height;
                } else {
                    return this.getUpcomingHeight(store);
                }
            },
            getUpcomingHeight({ header }) {
                header.classList.add(CONFIG.fixedClass);
                let h = header.getBoundingClientRect().height;
                header.classList.remove(CONFIG.fixedClass);
                return h;
            },
            animate(time, { fn, duration, target: t }) {
                if (!t.start) t.start = time;
                let elapsed = time - t.start;
                if (elapsed >= duration) {
                    window.scrollTo(0, t.destination);
                } else {
                    let step = fn(elapsed, t.y, t.top, duration);
                    window.scrollTo(0, Math.round(step));
                    requestAnimationFrame(time => {
                        this.animate(time, store);
                    });
                }
            }
        };

        const listeners = {
            main() {
                this.onClick();
            },
            onClick() {
                DOM.links.forEach(link => {
                    link.addEventListener('click', e => {
                        e.preventDefault();
                        controller.process(link);
                    });
                });
            }
        };

        window.addEventListener('load', () => {
            controller.main();
        });
    }

    function DFHeightAdjusterV1(props) {
        const CONFIG = new Config({
            wrapper: '[data-df-height-adjuster]',
            target: '[data-df-height-adjuster-target]'
        }, props);

        const DOM = new VirtualDOM({
            wrappers: [{
                $: CONFIG.wrapper,
                targets: [CONFIG.target]
            }]
        });

        let store = {
            map: new Map()
        };

        const controller = {
            main() {
                if (!Object.keys(DOM).length) return;
                logic.main();
                listeners.main();
            }
        };

        const logic = {
            main() {
                this.addTopPositionToMap(store);
                this.adjustHeights(store);
            },
            addTopPositionToMap({ map }) {
                map.clear();
                DOM.wrappers.forEach(wrapper => {
                    wrapper.targets.forEach(node => {
                        let box = node.getBoundingClientRect();
                        let offset = box.top + window.pageYOffset;
                        let list = map.get(offset) || [];
                        list.push(node);
                        map.set(offset, list);
                    });
                });
            },
            adjustHeights({ map }) {
                map.forEach(list => {
                    list.forEach(x => x.style.minHeight = '');
                    let heights = list.map(x => x.offsetHeight);
                    let max = Math.max(...heights);
                    if (heights.every(x => x === max)) return;
                    list.forEach(x => x.style.minHeight = max + 'px');
                });
            }
        };

        const listeners = {
            main() {
                this.onResize();
            },
            onResize() {
                window.addEventListener('resize', () => {
                    logic.main();
                });
            }
        };

        window.addEventListener('load', () => {
            controller.main();
        });
    }

    function DFBurgerV1(props) {
        const CONFIG = new Config({
            burger: '[data-df-burger]',
            target: '[data-df-burger-target]',
            activeClass: 'js-active',
            burgerLines: 3,
            disableClosingOnTarget: true,
            attribute: 'data-df-burger-animation',
            top: 'df-burger-top',
            middle: 'df-burger-middle',
            bottom: 'df-burger-bottom',
            top0: `
                top: 0;
                transform: translateY(0%);
            `,
            middle0: `
                top: 50%;
                transform: translateY(-50%);
                visibility: visible;
            `,
            bottom0: `
                top: 100%;
                transform: translateY(-100%);
            `,
            top50: `
                top: 50%;
                transform: translateY(-50%);
            `,
            middle50: `
                top: 50%;
                transform: translateY(-50%);
                visibility: hidden;
            `,
            bottom50: `
                top: 50%;
                transform: translateY(-50%);
            `,
            top100: `
                top: 50%;
                transform: translateY(-50%) rotate(-45deg);
            `,
            middle100: `
                visibility: hidden;
            `,
            bottom100: `
                top: 50%;
                transform: translateY(-50%) rotate(45deg);
            `
        }, props);

        const DOM = new VirtualDOM({
            burger: CONFIG.burger,
            targets: [CONFIG.target]
        });

        let store = {
            burgerLines: null,
            event: null,
            lockClicks: false,
            css: {
                top: {
                    child: '*:first-child',
                    animation: CONFIG.top,
                    1: CONFIG.top0,
                    2: CONFIG.top50,
                    3: CONFIG.top100
                },
                middle: {
                    child: '*:nth-child(2)',
                    animation: CONFIG.middle,
                    1: CONFIG.middle0,
                    2: CONFIG.middle50,
                    3: CONFIG.middle100
                },
                bottom: {
                    child: '*:last-child',
                    animation: CONFIG.bottom,
                    1: CONFIG.bottom0,
                    2: CONFIG.bottom50,
                    3: CONFIG.bottom100
                }
            },
            main() {
                this.setBurgerLines();
                this.removeSpacesInCSS();
            },
            setBurgerLines() {
                this.burgerLines = this.getValid(CONFIG.burgerLines);
            },
            getValid(lines) {
                return ([2, 3].some(x => x === lines)) ? lines : 3;
            },
            removeSpacesInCSS() {
                this.getValues(this.css).forEach(item => {
                    Object.keys(item).forEach(key => {
                        item[key] = item[key].trim().replace(/\s+/g, ' ');
                    });
                });
            },
            getValues(object) {
                return Object.keys(object).map(key => object[key]);
            },
            setClick(event) {
                this.event = event;
            }
        };

        const controller = {
            main() {
                if (!Object.keys(DOM).length) return;
                store.main();
                builder.main();
                listeners.main();
            },
            process(event) {
                if (store.lockClicks) return;
                store.setClick(event);
                logic.main();
            }
        };

        const builder = {
            main() {
                this.insertBurgerLines(DOM);
                this.setAnimationNames(CONFIG);
                this.insertCSS();
            },
            insertBurgerLines({ burger }) {
                burger.textContent = '';
                for (let i = 0; i < store.burgerLines; i++) {
                    let line = document.createElement('div');
                    burger.appendChild(line);
                }
            },
            setAnimationNames({ top, middle, bottom, attribute }) {
                let nodes = DOM.burger.children;
                nodes[0].setAttribute(attribute, top);
                nodes[nodes.length - 1].setAttribute(attribute, bottom);
                if (store.burgerLines === 2) return;
                nodes[1].setAttribute(attribute, middle);
            },
            insertCSS() {
                let style = this.createStyleTag(store.css);
                let before = this.findBeforeTag();
                document.head.insertBefore(style, before);
            },
            createStyleTag({ top, middle, bottom }) {
                let style = document.createElement('style');
                style.setAttribute('type', 'text/css');
                style.textContent += this.setStyles(top);
                style.textContent += this.setStyles(bottom);
                if (store.burgerLines === 2) return style;
                style.textContent += this.setStyles(middle);
                return style;
            },
            setStyles(place) {
                let { burger, activeClass } = CONFIG;
                let css = '';
                css += `${burger} > ${place.child} {\n`;
                css += `    ${place[1]}\n}\n`;
                css += `${burger}.${activeClass} > ${place.child} {\n`;
                css += `    ${place[3]}\n}\n`;
                css += `@keyframes ${place.animation} {\n`;
                css += `    0% { ${place[1]} }\n`;
                css += `    50% { ${place[2]} }\n`;
                css += `    100% { ${place[3]} }\n`;
                css += `}\n`;
                return css;
            },
            findBeforeTag() {
                let nodes = document.head.childNodes;
                let before = null;
                for (let item of nodes) {
                    let tag = item.tagName || '';
                    tag = tag.toLowerCase();
                    let names = ['style', 'link'];
                    if (names.indexOf(tag) > -1) {
                        before = item;
                        break;
                    }
                }
                return before;
            }
        };

        const logic = {
            main() {
                this.processClick();
            },
            processClick() {
                if (check.isBurger()) return this.switchState();
                this.processWindowClick();
            },
            switchState() {
                if (!check.isActive(DOM.burger)) {
                    this.toggleActiveClass('add');
                    this.runBurgerAnimation('normal');
                } else {
                    this.toggleActiveClass('remove');
                    this.dropTransition();
                    this.runBurgerAnimation('reverse');
                }
            },
            toggleActiveClass(fn) {
                [...DOM.targets, DOM.burger].forEach(node => {
                    node.classList[fn](CONFIG.activeClass);
                });
            },
            dropTransition() {
                DOM.targets.forEach(node => node.style.transition = '');
            },
            runBurgerAnimation(direction) {
                [...DOM.burger.children].forEach(node => {
                    let name = node.getAttribute(CONFIG.attribute);
                    node.style.animationFillMode = 'forwards';
                    node.style.animationName = name;
                    node.style.animationDirection = direction;
                });
            },
            processWindowClick() {
                if (!check.isActive(DOM.burger)) return;
                if (check.isDeadZone()) return;
                this.switchState();
            },
            disableTransition({ target }) {
                if (!check.isTarget(target)) return;
                if (!check.isActive(target)) return;
                target.style.transition = 'none';
            },
            lockClicks({ target }) {
                if (!check.isBurgerLine(target)) return;
                if (!store.lockClicks) store.lockClicks = true;
            },
            stopBurgerAnimation({ target }) {
                if (!check.isBurgerLine(target)) return;
                target.style.animationName = 'none';
                if (store.lockClicks) store.lockClicks = false;
            }
        };

        const check = {
            isBurger() {
                return store.event.target.closest(CONFIG.burger);
            },
            isActive(node) {
                return node.classList.contains(CONFIG.activeClass);
            },
            isDeadZone() {
                let a = CONFIG.disableClosingOnTarget;
                let b = this.isTarget(store.event.target);
                return a && b;
            },
            isTarget(node) {
                return DOM.targets.some(x => x === node);
            },
            isBurgerLine(node) {
                return [...DOM.burger.children].some(x => x === node);
            }
        };

        const listeners = {
            main() {
                this.onClick();
                this.onTransitionEnd();
                this.onAnimationStart();
                this.onAnimationEnd();
            },
            onClick() {
                window.addEventListener('click', e => {
                    controller.process(e);
                });
            },
            onTransitionEnd() {
                window.addEventListener('transitionend', e => {
                    logic.disableTransition(e);
                });
            },
            onAnimationStart() {
                DOM.burger.addEventListener('animationstart', e => {
                    logic.lockClicks(e);
                });
            },
            onAnimationEnd() {
                DOM.burger.addEventListener('animationend', e => {
                    logic.stopBurgerAnimation(e);
                });
            }
        };

        window.addEventListener('load', () => {
            controller.main();
        });
    }

    function DFIntroAnimationV1(props) {
        const CONFIG = new Config({
            target: 'data-df-intro-animation',
            animatedClass: 'js-animated',
            filterDisplayedNodes: true,
            sync: false,
            blockEvents: true,
            fn: 'ease-in-out',
            duration: 1000,
            property: 'transform',
            delay: 0,
            shift: 0
        }, props);

        const DOM = new VirtualDOM({
            targets: [`[${CONFIG.target}]`]
        });

        let store = {
            groups: new Map(),
            displayed: null,
            duration: null,
            delay: null,
            shift: null,
            main() {
                this.setTiming();
            },
            setTiming() {
                this.duration = this.getValid(CONFIG.duration);
                this.delay = this.getValid(CONFIG.delay);
                this.shift = this.getValid(CONFIG.shift);
            },
            getValid(n) {
                let a = Number.isFinite(n);
                let b = n >= 0;
                return (a && b) ? n : 0;
            }
        };

        const controller = {
            main() {
                if (!Object.keys(DOM).length) return;
                store.main();
                builder.main();
                logic.main();
                listeners.main();
            }
        };

        const builder = {
            main() {
                this.validateTargets();
                this.sortTargets();
                this.addGroups();
                this.filterDisplayedGroups();
            },
            validateTargets() {
                DOM.targets.forEach(node => {
                    let value = node.getAttribute(CONFIG.target);
                    if (this.isPositiveInteger(value)) return;
                    node.setAttribute(CONFIG.target, 1);
                });
            },
            isPositiveInteger(value) {
                let n = Number(value);
                let a = Number.isInteger(n);
                let b = n > 0;
                return a && b;
            },
            sortTargets() {
                DOM.targets.sort((a, b) => {
                    let keyA = this.getQueueValue(a);
                    let keyB = this.getQueueValue(b);
                    return keyA > keyB ? 1 : -1;
                });
            },
            getQueueValue(node) {
                return Number(node.getAttribute(CONFIG.target));
            },
            addGroups() {
                DOM.targets.forEach(node => {
                    let key = this.getQueueValue(node);
                    let group = store.groups.get(key) || [];
                    group.push(node);
                    store.groups.set(key, group);
                });
            },
            filterDisplayedGroups() {
                let array = Array.from(store.groups);
                array.forEach(group => {
                    group[1] = this.getDisplayedNodes(group[1]);
                });
                store.displayed = new Map(array);
            },
            getDisplayedNodes(group) {
                if (!CONFIG.filterDisplayedNodes) return group;
                return group.filter(x => x.clientWidth || x.clientHeight);
            }
        };

        const logic = {
            main() {
                this.runAnimation();
            },
            runAnimation() {
                store.groups.forEach(group => {
                    group.forEach(node => this.addAnimatedClass(node));
                });
                store.displayed.forEach(group => {
                    group.forEach(node => this.setStyles(node, store));
                    if (group.length) this.setNextDelay(store);
                });
            },
            setStyles(node, { duration, delay }) {
                node.style.transitionTimingFunction = CONFIG.fn;
                node.style.transitionDuration = `${duration}ms`;
                node.style.transitionDelay = `${delay}ms`;
                node.style.transitionProperty = CONFIG.property;
                if (!CONFIG.blockEvents) return;
                node.style.pointerEvents = 'none';
            },
            addAnimatedClass(node) {
                node.classList.add(CONFIG.animatedClass);
            },
            setNextDelay({ delay, duration, shift }) {
                if (CONFIG.sync) return;
                store.delay = duration + delay + shift;
            },
            removeStyles(e, node) {
                if (e.target !== node) return;
                node.style.transition = '';
                node.style.pointerEvents = '';
                node.removeEventListener('transitionend', listeners.clean);
            }
        };

        const listeners = {
            main() {
                this.onTransitionEnd();
            },
            onTransitionEnd() {
                store.displayed.forEach(group => {
                    group.forEach(node => {
                        node.addEventListener('transitionend', this.clean);
                    });
                });
            },
            clean(event) {
                logic.removeStyles(event, this);
            }
        };

        window.addEventListener('load', () => {
            controller.main();
        });
    }

    init();
}