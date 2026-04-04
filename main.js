
gsap.registerPlugin(ScrollTrigger);

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

// REVELANDO A FILOSOFIA DEPOIS DA TELA PRETA
gsap.from(".sec2 .filosofia", {
    scrollTrigger: {
        trigger: ".sec2",
        start: "top 70%", 
    },
    y: 50, 
    opacity: 0, 
    duration: 1.2,
    ease: "power3.out"
}); 

ScrollTrigger.create({
    trigger: ".sec2",
    start: "top top", // Ativa exatamente quando o topo da Sec2 bate no topo da janela
    pin: true,        // Congela a Sec2 no lugar (faz o efeito de Sticky Top)
    pinSpacing: false, // A ENGENHARIA DE ELITE: Isto diz ao navegador para NÃO empurrar a Sec3 para baixo. Assim, a Sec3 sobe por cima da Sec2!
    anticipatePin: 1
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

gsap.registerPlugin(ScrollTrigger);

// Cria o "Palco Fixo"
const tlMaster = gsap.timeline({
    scrollTrigger: {
        trigger: ".pin-master",
        start: "top top",
        end: "+=2000", // Distância de scroll (aumente se quiser que demore mais)
        pin: true,     // Prende a tela
        scrub: 1,      // Sincroniza com a rodinha do rato
    }
});

// PASSO 1: A cortina desce e tampa a visão do utilizador
tlMaster.to(".slice", {
    yPercent: 100, 
    stagger: 0.1,  
    ease: "none"
})

// PASSO 2: A Mágica de Bastidores! (Atrás da cortina)
// Apaga a Sec1 e acende a Sec2 simultaneamente (o sinal "<" faz acontecer ao mesmo tempo)
.to(".sec1", { opacity: 0, duration: 0.1 }, ">") 
.to(".sec2", { opacity: 1, duration: 0.1 }, "<") 

// PASSO 3: A cortina sobe de volta revelando a Sec2 já acesa
.to(".slice", {
    yPercent: -100, // Volta para o teto
    stagger: 0.1,
    ease: "none"
});