
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
// SCROLLYTELLING SEC2: TEXTO REVELADO NO CENTRO DA TELA
// ======================================================

const split = new SplitText(".filosofia h2", {
    type: "chars",
    mask: "chars"
});

// MOTOR 1: O PINO (Segura a tela no lugar quando bater no topo)
ScrollTrigger.create({
    trigger: ".sec2",
    start: "top top", 
    end: "+=150%",
    pin: true,
    pinSpacing: true
});

// MOTOR 2: A ANIMAÇÃO (Gatilho no centro da tela)
gsap.from(split.chars, {
    scrollTrigger: {
        trigger: ".filosofia h2", // A MÁGICA 1: O gatilho agora é o próprio texto
        start: "center center",   // A MÁGICA 2: Começa exatamente quando o texto bate no meio do ecrã!
        end: "+=150%",            // Termina a animação junto com o pino da tela
        scrub: 1
    },
    y: 80,            // Reduzi um pouco o 'y' (de 100 para 80) para o movimento ser mais elegante
    opacity: 0,
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
