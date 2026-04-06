
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

gsap.to(split.chars, {
    scrollTrigger: {
        trigger: ".sec2",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1,
    },
    
    // A MÁGICA DA ONDA (O "Roteiro" da Letra):
    keyframes: [
        // Passo 1: A "ponta" da fila (A luz bate na letra)
        { 
            color: "rgb(255, 255, 255)", // Acende no Ciano
            scale: 1.1,                 // Dá aquele zoom de destaque
            duration: 1                 // Proporção de tempo
        }, 
        
        // Passo 2: O "rastro" da fila (A luz passou)
        { 
            color: "#f8f8f8d5",           // Esfria e fica Branco
            scale: 1.1,                  
            duration: .8,
        }
    ],
    
    // color: "#f8f8f8",     
    // A LUZ NEON POR TRÁS DA LETRA:
    textShadow: "0px 0px 14px rgba(255, 255, 255, 0.1)", 
    // scale: 1.1,          
    transformOrigin: "bottom", 
    stagger: 0.1,
    ease: "power1.inOut"
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
