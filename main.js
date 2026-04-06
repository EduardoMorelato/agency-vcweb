
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

gsap.to(".slice", {
    scrollTrigger: {
        trigger: ".sec1",
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
    },
    yPercent: 100,
    stagger: 0.1, 
    ease: "none"
});

// ======================================================
// SCROLLYTELLING SEC2: TEXTO REVELADO COM O SCROLL
// ======================================================

// 1. Fatiamos o texto em letras usando o SplitText
const split = new SplitText(".linha-manual", { 
    type: "chars", 
});

// 2. Criamos a animação atrelada ao scroll
// O texto não tem movimento (y: 0), ele apenas "acende"
gsap.to(split.chars, {
    scrollTrigger: {
        trigger: ".sec2",
        start: "top top",
        end: "+=250%",
        pin: true,
        scrub: 1,
    },
    color: "#f8f8f8",     // Acende para branco
    stagger: 0.1,
    ease: "none"
});


/* ========================================= */
/* FAQ ACORDION (ABRE AO PASSAR O RATO)      */
/* ========================================= */

const faqItems = document.querySelectorAll('.js-faq-item');

if (faqItems.length > 0) {
    const animConfig = {
        duration: 0.5,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        overwrite: "auto"
    };

    faqItems.forEach(item => {
        const question = item.querySelector('.js-faq-question');
        const answer = item.querySelector('.js-faq-answer');

        // Configuração inicial
        gsap.set(answer, { height: item.classList.contains('is-open') ? "auto" : 0 });

        // A MÁGICA: Adicionamos tanto o 'mouseenter' (para PC) quanto o 'click' (para Telemóveis)
        ['mouseenter', 'click'].forEach(evento => {
            item.addEventListener(evento, () => {
                const isOpen = item.classList.contains('is-open');

                // Se passar o rato e já estiver aberto, não faz nada
                if (isOpen) return;

                // 1. Fecha todos os outros que estiverem abertos
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('is-open')) {
                        otherItem.classList.remove('is-open');
                        otherItem.querySelector('.js-faq-question').setAttribute('aria-expanded', 'false');

                        gsap.to(otherItem.querySelector('.js-faq-answer'), { height: 0, ...animConfig });
                    }
                });

                // 2. Abre o item atual onde o rato está por cima
                item.classList.add('is-open');
                question.setAttribute('aria-expanded', 'true');
                gsap.to(answer, { height: "auto", ...animConfig });
            });
        });
    });
}


// 
// SEPARANDO LETRA POR LETRA SEC2
// function animarTitulo(){
//     const split = SplitText.create(".filosofia h2", {
//     type: "chars",
//     mask: "chars"
// });

// gsap.from(split.chars, {
//     y: "100",
//     opacity: 0,
//     duration: 0.2,
//     stagger: .06,
//     delay: .5,
// })}

// // console.log(split)
