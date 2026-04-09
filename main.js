
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
        // pin: true,
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


// ======================================================
// SMART HEADER: SOME AO DESCER, APARECE AO SUBIR
// ======================================================

const header = document.querySelector("header");

const headerAnim = gsap.from(header, { 
  yPercent: -100,
  paused: true,
  duration: 0.3
}).progress(1);

ScrollTrigger.create({
  start: "top top",
  end: "max",
  onUpdate: (self) => {
    // 1. Lógica de Esconder/Mostrar (Sobe ou Desce)
    if (self.direction === -1) {
      headerAnim.play(); // Mostra ao subir
    } else {
      headerAnim.reverse(); // Esconde ao descer
    }
    
    // 2. Lógica do Contraste (Fundo Preto)
    // Se a página rolou mais de 50px para baixo, injeta a classe escura
    if (window.scrollY > 10) {
        header.classList.add("header-dark");
    } else {
        header.classList.remove("header-dark"); // Volta a ser transparente no topo
    }
  }
});

    onUpdate: (self) => {
        // self.getVelocity() lê a agressividade do seu scroll
        // Dividimos por 300 para o multiplicador ficar suave e não distorcer a tela
        let velocidadeScroll = self.getVelocity() / 100; 
        
        // Multiplicador da velocidade: 1 é o normal. 
        // Se rolar para baixo, aumenta (ex: 2.5x mais rápido). 
        // Se rolar para cima, fica negativo e a animação RODA PARA TRÁS!
        let multiplicador = 1.5 + velocidadeScroll; 
        
        gsap.to([loopCol1, loopCol2], { 
            timeScale: multiplicador, 
            overwrite: true,
            duration: 0.2 // Tempo de resposta do arranque
        });

        clearTimeout(tempoScroll);
        tempoScroll = setTimeout(() => {
            gsap.to([loopCol1, loopCol2], { timeScale: 1, duration: 0.8 });
        }, 150);
    }

// ======================================================
// SEC4: INFINITE VELOCITY MARQUEE (AUTO-PLAY + SCROLL)
// ======================================================

// 1. O MOTOR AUTOPLAY (Rola infinitamente sozinho)
// Move até exatamente a metade (-50%) onde a cópia começa, e repete sem ninguém notar!
const loopCol1 = gsap.to(".col-1", {
    yPercent: -50, 
    repeat: -1, 
    duration: 45, // Quão rápido rola sozinho (aumente para ficar mais lento)
    ease: "none"
});

const loopCol2 = gsap.fromTo(".col-2", 
    { yPercent: -50 }, 
    { yPercent: 0, 
        repeat: -1, 
        duration: 45, 
        ease: "none" }
);

// 2. O ACELERADOR DO SCROLL (Lê o seu rato)
let tempoScroll;

ScrollTrigger.create({
    trigger: ".sec4",
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
        // self.getVelocity() lê a agressividade do seu scroll
        // Dividimos por 300 para o multiplicador ficar suave e não distorcer a tela
        let velocidadeScroll = self.getVelocity() / 100; 
        
        // Multiplicador da velocidade: 1 é o normal. 
        // Se rolar para baixo, aumenta (ex: 2.5x mais rápido). 
        // Se rolar para cima, fica negativo e a animação RODA PARA TRÁS!
        let multiplicador = 1.5 + velocidadeScroll; 
        
        gsap.to([loopCol1, loopCol2], { 
            timeScale: multiplicador, 
            overwrite: true,
            duration: 0.2 // Tempo de resposta do arranque
        });

        clearTimeout(tempoScroll);
        tempoScroll = setTimeout(() => {
            gsap.to([loopCol1, loopCol2], { timeScale: 1, duration: 0.8 });
        }, 150);
    }
});


// ======================================================
// HERO WORD FLIPPER: TROCA DE PALAVRAS NA SEC1 (PREMIUM)
// ======================================================

// 1. A sua lista de palavras estratégicas em Inglês
const words = [ "websites", "logos", "banners", "ads", "products", "moments", "creatives", "systems", "experiences"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const wordElement = document.querySelector(".word-rotator");

if (wordElement) {
    // Começa com a caixa vazia para o efeito ser 100% autêntico
    wordElement.innerText = ""; 

    function typeWriter() {
        const currentWord = words[wordIndex];

        // Lógica de escrever ou apagar letras
        if (isDeleting) {
            wordElement.innerText = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            wordElement.innerText = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        // VELOCIDADES DA DIGITAÇÃO (Pode ajustar estes números)
        let typeSpeed = isDeleting ? 40 : 100; // 40ms a apagar, 100ms a escrever

        // Se acabou de ESCREVER a palavra inteira
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Espera 2 segundos para o utilizador ler
            isDeleting = true;
        } 
        // Se acabou de APAGAR a palavra inteira
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; // Passa para a próxima palavra
            typeSpeed = 500; // Faz uma pausa de meio segundo antes de começar a escrever a nova
        }

        setTimeout(typeWriter, typeSpeed);
    }

    // Inicia o loop
    typeWriter();
}

// ======================================================
// OTIMIZAÇÃO DE VÍDEOS (LAZY PLAY & PERFORMANCE)
// ======================================================

// Espera o HTML básico estar pronto
document.addEventListener("DOMContentLoaded", () => {
    const heroVideo = document.querySelector(".sec1 video"); 
    
    if (heroVideo) {
        // O navegador processa o site, espera 800 milissegundos e dá o play
        // Isso impede que o vídeo "roube" processamento das animações de entrada
        setTimeout(() => {
            heroVideo.play().catch(e => console.log("Play bloqueado pelo navegador"));
        }, 800); 
    }

    // 2. VÍDEO DO CTA (Sec7) - O SEGREDO DA BATERIA
    // Selecione a classe correta do seu vídeo da sec7 aqui
    const ctaVideo = document.querySelector(".sec7 video");
    
    if (ctaVideo) {
        ScrollTrigger.create({
            trigger: ".sec7",
            start: "top bottom", 
            onEnter: () => ctaVideo.play(), 
            onLeave: () => ctaVideo.pause(), 
            onEnterBack: () => ctaVideo.play(), 
            onLeaveBack: () => ctaVideo.pause() 
        });
    }
});