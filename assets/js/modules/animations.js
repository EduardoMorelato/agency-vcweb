// assets/js/modules/animations.js

export function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(SplitText);

    // 2. SPLIT TEXT
    const split = new SplitText(".linha-manual", { type: "words, chars" });
    gsap.to(split.chars, {
        scrollTrigger: { trigger: ".sec2", start: "top top", end: "+=150%", scrub: 1 },
        keyframes: [{ color: "white", scale: 1.1, duration: 1 }, { color: "#f8f8f8d5", scale: 1.1, duration: .8 }],
        stagger: 0.1, ease: "power1.inOut"
    });

    // 3. FAQ
    const faqItems = document.querySelectorAll('.js-faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.js-faq-question');
        const answer = item.querySelector('.js-faq-answer');
        gsap.set(answer, { height: item.classList.contains('is-open') ? "auto" : 0 });
        item.addEventListener('click', () => {
            if (item.classList.contains('is-open')) return;
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('is-open')) {
                    other.classList.remove('is-open');
                    gsap.to(other.querySelector('.js-faq-answer'), { height: 0, duration: 0.5 });
                }
            });
            item.classList.add('is-open');
            gsap.to(answer, { height: "auto", duration: 0.5 });
        });
    });

    // 4. MARQUEE
    const loopCol1 = gsap.to(".col-1", { yPercent: -50, repeat: -1, duration: 45, ease: "none" });
    const loopCol2 = gsap.fromTo(".col-2", { yPercent: -50 }, { yPercent: 0, repeat: -1, duration: 45, ease: "none" });
    
    ScrollTrigger.create({
        trigger: ".sec4", start: "top bottom", end: "bottom top",
        onUpdate: (self) => {
            let mult = 1.5 + (self.getVelocity() / 100);
            gsap.to([loopCol1, loopCol2], { timeScale: mult, overwrite: true, duration: 0.2 });
            setTimeout(() => gsap.to([loopCol1, loopCol2], { timeScale: 1, duration: 0.8 }), 150);
        }
    });

    // 5. WORD ROTATOR
    const words = ["websites", "logos", "banners", "ads", "products", "moments", "creatives", "systems", "experiences"];
    const el = document.querySelector(".word-rotator");
    let index = 0;
    if (el) {
        setInterval(() => {
            el.classList.add("slide-out");
            setTimeout(() => {
                index = (index + 1) % words.length;
                el.innerText = words[index];
                el.classList.remove("slide-out");
                el.classList.add("prepare-in");
                void el.offsetWidth;
                el.classList.remove("prepare-in");
            }, 300);
        }, 2500);
    }
}