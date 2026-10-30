/*
 * トップページ専用の3D（three.js）とスクロール演出（GSAP ScrollTrigger）。
 * 試作 showcases/katsucoderenewal/assets/js/home.js の移植。トップ以外のページでは読み込まない（Home.jsx から動的に読み込む）。
 * 試作と違う点：
 * - document 全体ではなく、公開レイアウトの .ss-public（root）の中だけを操作する
 * - Inertiaでページを移動したときのために、イベント・ScrollTrigger・WebGLの後始末（戻り値の関数）を持つ
 * - 制作実績のセクションは0件のとき表示しないので、無い場合も動くようにしている
 */
import * as T from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function mountHome(root, logoSource) {
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => [...root.querySelectorAll(s)];
    const events = new AbortController();
    const on = (target, type, handler, options = {}) => target?.addEventListener(type, handler, { ...options, signal: events.signal });

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width:760px)");
    const journey = $(".journey");
    const copies = $$(".journey-copy");
    const slots = [$("#hero-scene"), $("#footer-scene")].filter(Boolean);
    const heroSlot = $("#hero-scene");
    const footerSlot = $("#footer-scene");
    let paused = reduced.matches;
    let context, gallery, renderer, scene, camera, logo, ring, environment, activeSlot, resizeObserver;
    let visible = false, frame = 0, last = 0, elapsed = 0, drag = 0, dragStart;
    const motion = { hero: 0, footer: 0 };
    const pointer = { x: 0, y: 0 };
    const parts = [], devices = [], seeds = [];
    const clamp = T.MathUtils.clamp;
    const smooth = (a, b, x) => {
        const p = clamp((x - a) / (b - a), 0, 1);
        return p * p * (3 - 2 * p);
    };
    const copyStops = [0, 0.33, 0.66, 1];
    let activeChapter = -1;

    function updateCopy() {
        const q = motion.hero * 3;
        const index = Math.round(q);
        copies.forEach((el, i) => {
            const amount = clamp(1 - Math.abs(q - i), 0, 1);
            el.style.opacity = amount;
            el.style.visibility = amount < 0.015 ? "hidden" : "visible";
            el.style.transform = `translateY(${(1 - amount) * 18}px)`;
            el.style.pointerEvents = i === index ? "auto" : "none";
        });
        if (index !== activeChapter) {
            activeChapter = index;
            copies.forEach((el, i) => {
                el.classList.toggle("active", i === index);
                el.inert = i !== index;
                el.setAttribute("aria-hidden", String(i !== index));
            });
            $$("[data-chapter-go]").forEach((b, i) => b.setAttribute("aria-current", String(i === index)));
        }
        requestRender();
    }
    function clearCopies() {
        copies.forEach((el) => {
            el.removeAttribute("style");
            el.removeAttribute("aria-hidden");
            el.inert = false;
        });
    }

    // 制作実績の横スクロール（0件のときはセクション自体が無い）
    const track = $(".works-track");
    const cards = $$(".work");
    const workPrev = $("#work-prev");
    const workNext = $("#work-next");
    function galleryUI(p) {
        const meter = $(".work-meter span");
        if (meter) meter.style.transform = `scaleX(${0.12 + 0.88 * p})`;
        if (workPrev) workPrev.disabled = p < 0.01;
        if (workNext) workNext.disabled = p > 0.99;
    }
    function moveWork(direction) {
        if (gallery) {
            const st = gallery.scrollTrigger;
            const p = clamp(Math.round(st.progress * 2) / 2 + direction / 2, 0, 1);
            scrollTo({ top: st.start + (st.end - st.start) * p, behavior: "smooth" });
        } else if (track && cards[0]) {
            track.scrollBy({ left: direction * (cards[0].offsetWidth + 20), behavior: paused ? "instant" : "smooth" });
        }
    }
    on(workPrev, "click", () => moveWork(-1));
    on(workNext, "click", () => moveWork(1));
    on(track, "scroll", () => {
        if (!gallery) galleryUI(track.scrollLeft / (track.scrollWidth - track.clientWidth) || 0);
    }, { passive: true });
    cards.forEach((el, i) =>
        on(el, "focusin", () => {
            if (!gallery) return;
            const st = gallery.scrollTrigger;
            scrollTo({ top: st.start + ((st.end - st.start) * i) / Math.max(1, cards.length - 1), behavior: "instant" });
        }),
    );
    $$("[data-chapter-go]").forEach((b, i) =>
        on(b, "click", () => {
            if (paused || !journey) return;
            scrollTo({
                top: journey.getBoundingClientRect().top + scrollY + (journey.offsetHeight - $(".hero-stage").offsetHeight) * copyStops[i],
                behavior: "smooth",
            });
        }),
    );

    // サービス紹介の画面イメージを、マウスの位置に合わせて少し傾ける（試作 main.js）
    $$(".service-visual").forEach((el) => {
        const surface = el.querySelector(".tilt-surface");
        if (!surface) return;
        on(el, "pointermove", (e) => {
            if (e.pointerType !== "mouse" || paused) return;
            const r = el.getBoundingClientRect();
            surface.style.transition = "transform .35s ease-out";
            surface.style.transform = `rotateX(${(-(e.clientY - r.top - r.height / 2) / r.height) * 7}deg) rotateY(${((e.clientX - r.left - r.width / 2) / r.width) * 9}deg)`;
        });
        on(el, "pointerleave", () => {
            surface.style.transition = "transform .7s ease";
            surface.style.transform = "";
        });
    });

    function setup() {
        context?.revert();
        gallery = null;
        clearCopies();
        activeChapter = -1;
        motion.hero = 0;
        motion.footer = 0;
        journey?.classList.toggle("enhanced", !paused && !!renderer);
        journey?.classList.toggle("static-view", paused || !renderer);
        root.classList.toggle("no-motion", paused);
        const toggle = $(".motion-toggle");
        if (toggle) {
            toggle.setAttribute("aria-pressed", String(paused));
            $(".motion-label").textContent = paused ? "動きを再生" : "動きを止める";
            $(".motion-icon").textContent = paused ? "▶" : "Ⅱ";
        }

        if (!paused) {
            context = gsap.context(() => {
                if (renderer && journey) {
                    gsap.to(motion, {
                        hero: 1,
                        ease: "none",
                        onUpdate: updateCopy,
                        scrollTrigger: {
                            trigger: journey,
                            start: "top top",
                            end: () => "+=" + (journey.offsetHeight - $(".hero-stage").offsetHeight),
                            scrub: 0.8,
                            invalidateOnRefresh: true,
                        },
                    });
                }
                if ($(".highlight")) gsap.to(".highlight", { backgroundSize: "100% 100%", duration: 1.3, scrollTrigger: { trigger: ".intro-heading", start: "top 80%" } });
                $$("[data-parallax]").forEach((el) =>
                    gsap.fromTo(el, { y: 65 }, { y: Number(el.dataset.parallax), ease: "none", scrollTrigger: { trigger: ".intro", start: "top bottom", end: "bottom top", scrub: 1 } }),
                );
                $$(".service-panel").forEach((el, i) => {
                    if (!mobile.matches && i < 2 && el.nextElementSibling) {
                        gsap.to(el, { scale: 0.965, ease: "none", scrollTrigger: { trigger: el.nextElementSibling, start: "top 80%", end: "top 100px", scrub: 0.7 } });
                    }
                });
                if (!mobile.matches && track && $(".works-pin")) {
                    gallery = gsap.to(track, {
                        x: () => -(track.scrollWidth - innerWidth),
                        ease: "none",
                        scrollTrigger: {
                            trigger: ".works-pin",
                            start: "top 85px",
                            end: () => "+=" + (track.scrollWidth - innerWidth),
                            pin: true,
                            scrub: 0.8,
                            invalidateOnRefresh: true,
                            onUpdate: (self) => galleryUI(self.progress),
                        },
                    });
                }
                if ($(".support")) {
                    gsap.fromTo(".project-dashboard", { y: 50, rotation: 7 }, { y: -15, rotation: -2, ease: "none", scrollTrigger: { trigger: ".support", start: "top 80%", end: "bottom 35%", scrub: 1 } });
                    gsap.fromTo(".report-float", { y: 55, rotation: -9 }, { y: -20, rotation: 2, ease: "none", scrollTrigger: { trigger: ".support", start: "top 65%", end: "bottom 35%", scrub: 1 } });
                    ScrollTrigger.create({
                        trigger: ".support-visual",
                        start: "top 80%",
                        end: "bottom 20%",
                        onUpdate: (self) => $$(".dash-steps>span").forEach((el, i) => el.classList.toggle("active", i <= Math.floor(self.progress * 4))),
                    });
                }
                if ($("#contact")) {
                    gsap.fromTo(".contact-bg", { scale: 0.4 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "#contact", start: "top bottom", end: "60% bottom", scrub: 1 } });
                    gsap.to(motion, { footer: 1, ease: "none", scrollTrigger: { trigger: "#contact", start: "top bottom", end: "bottom bottom", scrub: 1 } });
                }
                gsap.from(".footer-word", { yPercent: 35, opacity: 0.3, ease: "none", scrollTrigger: { trigger: ".footer", start: "top 95%", end: "bottom bottom", scrub: 1 } });
            }, root);
        } else {
            $$(".highlight").forEach((el) => (el.style.backgroundSize = "100% 100%"));
            $$(".waiting").forEach((el) => el.classList.remove("waiting"));
        }
        if (!paused && renderer) updateCopy();
        galleryUI(0);
        ScrollTrigger.refresh();
        chooseScene();
        requestRender();
    }

    on($(".motion-toggle"), "click", () => {
        paused = !paused;
        setup();
    });
    on(reduced, "change", () => {
        paused = reduced.matches;
        setup();
    });
    on(mobile, "change", () => {
        setup();
        resize();
    });
    $$("details").forEach((el) => on(el, "toggle", () => ScrollTrigger.refresh()));

    function requestRender() {
        if (renderer && !frame && !document.hidden && visible) frame = requestAnimationFrame(render);
    }
    function resize() {
        if (!renderer || !activeSlot) return;
        const r = activeSlot.getBoundingClientRect();
        if (!r.width || !r.height) return;
        renderer.setSize(r.width, r.height);
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
        requestRender();
    }
    function chooseScene() {
        if (!renderer || !heroSlot) return;
        const foot = footerSlot?.getBoundingClientRect();
        const hero = heroSlot.getBoundingClientRect();
        const next = foot && foot.top < innerHeight && foot.bottom > 0 ? footerSlot : heroSlot;
        visible = next === footerSlot || (hero.bottom > 0 && hero.top < innerHeight);
        if (activeSlot !== next) {
            activeSlot?.classList.remove("ready");
            activeSlot = next;
            activeSlot.append(renderer.domElement);
            activeSlot.classList.add("ready");
            resize();
        }
        requestRender();
    }

    const poses = [
        { x: 2.5, y: 0.25, scale: 1.06, ry: -0.32, rz: -0.13 },
        { x: -2.55, y: 0.12, scale: 0.91, ry: 0.32, rz: 0.1 },
        { x: 2.7, y: 0.15, scale: 0.87, ry: -0.35, rz: -0.08 },
        { x: -2.6, y: 0.1, scale: 0.78, ry: 0.38, rz: 0.1 },
    ];
    function pose(p) {
        const q = clamp(p * 3, 0, 3);
        const i = Math.min(2, Math.floor(q));
        const a = poses[i], b = poses[i + 1], t = smooth(0, 1, q - i);
        return Object.fromEntries(["x", "y", "scale", "ry", "rz"].map((k) => [k, T.MathUtils.lerp(a[k], b[k], t)]));
    }
    function render(now) {
        frame = 0;
        if (!renderer || !visible || document.hidden) return;
        const dt = Math.min((now - last) / 1000, 0.05) || 0;
        last = now;
        if (!paused) elapsed += dt;
        const t = elapsed;
        const isFooter = activeSlot === footerSlot;
        const small = mobile.matches;
        const p = isFooter ? 0 : motion.hero;
        const position = pose(p);
        camera.position.set(0, small ? 0.5 : 1.5, small ? 15 : 13.8);
        camera.lookAt(0, 0, 0);
        logo.position.set(isFooter ? 0 : small ? position.x * 0.12 : position.x, isFooter ? 0.1 : small ? -2.1 : position.y, 0);
        logo.position.y += Math.sin(t * 0.7) * 0.09;
        logo.scale.setScalar(isFooter ? (small ? 0.8 : 1) : small ? 0.5 : position.scale);
        logo.rotation.set(-0.08 + pointer.y * 0.06, position.ry + drag + pointer.x * 0.15 + Math.sin(t * 0.35) * 0.09, position.rz + Math.sin(t * 0.45) * 0.025);
        parts.forEach((part) => {
            const amount = Math.sin(p * Math.PI) * 0.22;
            part.position.x = part.userData.isLeaf ? -amount : 0;
            part.position.y = part.userData.isLeaf ? amount : 0;
        });
        devices.forEach((d, i) => {
            const target = [0.33, 0.66, 1][i];
            const weight = clamp(1 - Math.abs(p - target) * 5, 0, 1);
            d.visible = !isFooter && !paused && weight > 0.02;
            const side = position.x < 0 ? -1 : 1;
            d.position.set(small ? side * 0.9 : position.x + side * 1.15, small ? -1.85 : position.y + 0.65, -0.1 + i * 0.2);
            d.scale.setScalar((small ? 0.42 : 0.72) * weight);
            d.rotation.set(0.05 + Math.sin(t * 0.35 + i) * 0.08, side * 0.25, side * -0.08);
        });
        ring.position.x = isFooter ? 0 : small ? 0 : position.x;
        seeds.forEach((s, i) => {
            s.position.y = s.userData.base + Math.sin(t * 0.7 + i) * 0.18;
            s.rotation.y = t * 0.2 + i;
        });
        renderer.render(scene, camera);
        if (!paused) requestRender();
    }

    // 3Dの中に浮かぶ「画面」の絵（Web制作・システム・アプリ）
    function texture(type) {
        const cv = document.createElement("canvas");
        cv.width = 768;
        cv.height = type === "app" ? 1080 : 500;
        const c = cv.getContext("2d"), w = cv.width, h = cv.height;
        const rect = (x, y, width, height, r, color) => {
            c.fillStyle = color;
            c.beginPath();
            c.roundRect(x, y, width, height, r);
            c.fill();
        };
        const text = (str, x, y, size = 20, color = "#234331") => {
            c.fillStyle = color;
            c.font = `${size}px sans-serif`;
            c.fillText(str, x, y);
        };
        rect(0, 0, w, h, 0, "#f8faf3");
        if (type === "web") {
            text("SmartSprouts", 38, 53, 26);
            text("暮らしをつくる。", 44, 152, 43);
            text("この街で、育てる日々。", 44, 209, 35);
            rect(440, 110, 280, 310, 80, "#dce8b7");
            rect(465, 220, 200, 180, 100, "#9bb77c");
            text("わたしたちについて", 44, 305, 15);
            rect(44, 350, 220, 50, 25, "#355a3f");
            text("詳しく見る  →", 72, 382, 17, "#fff");
        } else if (type === "system") {
            rect(0, 0, 155, h, 0, "#294c3b");
            text("SmartSprouts", 16, 48, 19, "#fff");
            ["進捗", "書類", "メッセージ"].forEach((s, i) => text(s, 24, 140 + i * 70, 20, "#e9f1dc"));
            text("制作の状況", 193, 59, 28);
            rect(190, 90, 535, 114, 14, "#e5edce");
            text("デザインを確認中です", 215, 130, 21);
            rect(215, 162, 480, 9, 4, "#c8d6b3");
            rect(215, 162, 310, 9, 4, "#88a752");
            ["ヒアリング", "設計", "デザイン"].forEach((s, i) => {
                rect(190, 238 + i * 72, 535, 55, 10, "#fff");
                text(s, 215, 273 + i * 72, 19);
                text(i < 2 ? "完了" : "確認中", 630, 273 + i * 72, 15);
            });
        } else {
            text("いつもの教室を、", 45, 95, 35);
            text("もっと身近に。", 45, 147, 35);
            rect(40, 195, 688, 280, 30, "#e1eaca");
            text("レッスンを予約", 70, 255, 26);
            for (let i = 0; i < 21; i++) text(String(i + 1), 78 + (i % 7) * 87, 320 + Math.floor(i / 7) * 53, 22);
            text("キッズクラス", 48, 570, 28);
            text("15:00 — 16:00", 48, 616, 22);
            rect(40, 683, 688, 220, 30, "#e9efe0");
            text("小さな一歩を、ここから。", 67, 752, 26);
            rect(40, 946, 688, 74, 36, "#31583e");
            text("予約する  →", 280, 994, 26, "#fff");
        }
        const tex = new T.CanvasTexture(cv);
        tex.colorSpace = T.SRGBColorSpace;
        return tex;
    }
    function device(type) {
        const g = new T.Group();
        const w = type === "app" ? 1.9 : 3.5;
        const h = type === "app" ? 2.7 : 2.28;
        const body = new T.Mesh(
            new RoundedBoxGeometry(w + 0.12, h + 0.12, 0.14, 3, 0.08),
            new T.MeshPhysicalMaterial({ color: "#edf1df", metalness: 0.4, roughness: 0.28, clearcoat: 1 }),
        );
        const screen = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: texture(type) }));
        screen.position.z = 0.076;
        g.add(body, screen);
        scene.add(g);
        g.visible = false;
        return g;
    }

    if (heroSlot) {
        try {
            renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
            renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
            renderer.outputColorSpace = T.SRGBColorSpace;
            renderer.toneMapping = T.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.2;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = T.PCFSoftShadowMap;
            scene = new T.Scene();
            camera = new T.PerspectiveCamera(36, 1, 0.1, 80);
            const pmrem = new T.PMREMGenerator(renderer);
            const room = new RoomEnvironment();
            environment = pmrem.fromScene(room, 0.035);
            scene.environment = environment.texture;
            room.dispose();
            pmrem.dispose();

            scene.add(new T.HemisphereLight("#fbffe9", "#637747", 2));
            const sun = new T.DirectionalLight("#fffce7", 4);
            sun.position.set(-3, 7, 6);
            sun.castShadow = true;
            sun.shadow.mapSize.set(1024, 1024);
            Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 0.5, far: 30 });
            sun.shadow.normalBias = 0.035;
            sun.shadow.bias = -0.0001;
            scene.add(sun);
            const rim = new T.DirectionalLight("#dbf5d7", 2.4);
            rim.position.set(6, 2, -4);
            scene.add(rim);
            const fill = new T.DirectionalLight("#fff4de", 1.1);
            fill.position.set(-6, 0, 2);
            scene.add(fill);

            // ロゴのSVGを押し出して立体にする（葉と茎のグラデーションは頂点カラーで付ける）
            logo = new T.Group();
            scene.add(logo);
            const face = new T.MeshPhysicalMaterial({ vertexColors: true, metalness: 0.4, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.18, envMapIntensity: 1.1 });
            const side = new T.MeshPhysicalMaterial({ color: "#619331", metalness: 0.7, roughness: 0.25, clearcoat: 1 });
            const svg = logoSource.replace(/fill:\s*url\([^)]*\)/g, "fill: #80b444");
            new SVGLoader().parse(svg).paths.forEach((path, i) => {
                const part = new T.Group();
                part.userData.isLeaf = i === 0;
                SVGLoader.createShapes(path).forEach((shape) => {
                    const geometry = new T.ExtrudeGeometry(shape, { depth: 15, bevelEnabled: true, bevelThickness: 1.6, bevelSize: 1.1, bevelSegments: 5, steps: 1, curveSegments: 28 });
                    geometry.translate(-107.865, -103.93, -7.5);
                    geometry.rotateX(Math.PI);
                    geometry.scale(0.026, 0.026, 0.026);
                    const positions = geometry.attributes.position;
                    const colors = new Float32Array(positions.count * 3);
                    const lo = new T.Color("#b5d748"), hi = new T.Color("#3b985a"), c = new T.Color();
                    for (let n = 0; n < positions.count; n++) {
                        c.copy(lo).lerp(hi, clamp((positions.getY(n) + 2.75) / 5.5, 0, 1));
                        colors.set([c.r, c.g, c.b], n * 3);
                    }
                    geometry.setAttribute("color", new T.BufferAttribute(colors, 3));
                    const mesh = new T.Mesh(geometry, [face, side]);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    part.add(mesh);
                });
                logo.add(part);
                parts.push(part);
            });

            const floor = new T.Mesh(new T.PlaneGeometry(100, 100), new T.ShadowMaterial({ color: "#365239", opacity: 0.14 }));
            floor.rotation.x = -Math.PI / 2;
            floor.position.y = -3.25;
            floor.receiveShadow = true;
            scene.add(floor);
            ring = new T.Mesh(new T.TorusGeometry(3.55, 0.009, 8, 100), new T.MeshBasicMaterial({ color: "#839b6c", transparent: true, opacity: 0.22 }));
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = -3.2;
            scene.add(ring);
            ["web", "system", "app"].forEach((type) => devices.push(device(type)));
            [[5, 2, -2, 0.12], [-0.2, 2.8, -2, 0.08], [4, -1, 1, 0.06]].forEach(([x, y, z, s], i) => {
                const seed = new T.Mesh(new T.SphereGeometry(s, 16, 12), new T.MeshStandardMaterial({ color: ["#c5d986", "#a5c0a4", "#dec9a4"][i], metalness: 0.45, roughness: 0.2 }));
                seed.position.set(x, y, z);
                seed.userData.base = y;
                scene.add(seed);
                seeds.push(seed);
            });

            slots.forEach((slot) => {
                on(slot, "pointermove", (e) => {
                    if (paused || e.pointerType !== "mouse") return;
                    const r = slot.getBoundingClientRect();
                    pointer.x = (e.clientX - r.left) / r.width - 0.5;
                    pointer.y = (e.clientY - r.top) / r.height - 0.5;
                    if (dragStart !== undefined) drag = (e.clientX - dragStart) / 180;
                });
                on(slot, "pointerdown", (e) => {
                    if (e.pointerType === "mouse" && !paused) {
                        dragStart = e.clientX - drag * 180;
                        slot.setPointerCapture(e.pointerId);
                    }
                });
                on(slot, "pointerup", () => (dragStart = undefined));
                on(slot, "pointercancel", () => (dragStart = undefined));
                on(slot, "pointerleave", () => {
                    pointer.x = 0;
                    pointer.y = 0;
                });
            });
            on(renderer.domElement, "webglcontextlost", (e) => {
                e.preventDefault();
                cancelAnimationFrame(frame);
                frame = 0;
                renderer = null;
                slots.forEach((s) => s.classList.remove("ready"));
                setup();
            });
            resizeObserver = new ResizeObserver(resize);
            slots.forEach((s) => resizeObserver.observe(s));
            chooseScene();
        } catch (e) {
            console.warn("3D unavailable; displaying the supplied logo.", e);
            renderer?.dispose();
            renderer = null;
            slots.forEach((s) => s.classList.remove("ready"));
        }
    }

    on(document, "visibilitychange", () => {
        last = performance.now();
        requestRender();
    });
    on(window, "scroll", chooseScene, { passive: true });
    on(window, "resize", resize, { passive: true });
    setup();
    // 画像・Webフォントの読み込みで高さが変わるので、読み込み後に位置を計算し直す
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    on(window, "load", () => ScrollTrigger.refresh());

    return function unmountHome() {
        events.abort();
        resizeObserver?.disconnect();
        context?.revert();
        cancelAnimationFrame(frame);
        frame = 0;
        root.classList.remove("no-motion");
        if (scene) {
            scene.traverse((object) => {
                object.geometry?.dispose();
                [object.material].flat().filter(Boolean).forEach((material) => {
                    material.map?.dispose();
                    material.dispose();
                });
            });
        }
        environment?.dispose();
        if (renderer) {
            renderer.domElement.remove();
            renderer.dispose();
            renderer.forceContextLoss();
            renderer = null;
        }
        slots.forEach((s) => s.classList.remove("ready"));
    };
}
