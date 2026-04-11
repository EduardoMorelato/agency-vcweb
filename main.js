gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

// ======================================================
// CONFIGURAÇÃO SUPABASE (ADICIONADO)
// ======================================================
const supabaseUrl = 'https://avrugsiyyokqatgbfzdj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cnVnc2l5eW9rcWF0Z2JmemRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTc3OTgsImV4cCI6MjA5MTMzMzc5OH0.4pactJMgREvurMkQAiGNOC9M4ybWkA76D-kuW0TNIb8';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ======================================================
// SUAS ANIMAÇÕES ORIGINAIS (MANTIDAS)
// ======================================================

let alvo = window.innerWidth < 768 ? ".slice:nth-child(-n+4)" : ".slice";

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

const split = new SplitText(".linha-manual", { 
    type: "chars", 
});

gsap.to(split.chars, {
    scrollTrigger: {
        trigger: ".sec2",
        start: "top top",
        end: "+=150%",
        scrub: 1,
    },
    keyframes: [
        { 
            color: "rgb(255, 255, 255)", 
            scale: 1.1,                 
            duration: 1                 
        }, 
        { 
            color: "#f8f8f8d5",           
            scale: 1.1,                   
            duration: .8,
        }
    ],
    textShadow: "0px 0px 14px rgba(255, 255, 255, 0.1)", 
    transformOrigin: "bottom", 
    stagger: 0.1,
    ease: "power1.inOut"
});

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

        gsap.set(answer, { height: item.classList.contains('is-open') ? "auto" : 0 });

        ['mouseenter', 'click'].forEach(evento => {
            item.addEventListener(evento, () => {
                const isOpen = item.classList.contains('is-open');
                if (isOpen) return;

                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('is-open')) {
                        otherItem.classList.remove('is-open');
                        otherItem.querySelector('.js-faq-question').setAttribute('aria-expanded', 'false');
                        gsap.to(otherItem.querySelector('.js-faq-answer'), { height: 0, ...animConfig });
                    }
                });

                item.classList.add('is-open');
                question.setAttribute('aria-expanded', 'true');
                gsap.to(answer, { height: "auto", ...animConfig });
            });
        });
    });
}

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
    if (self.direction === -1) {
      headerAnim.play(); 
    } else {
      headerAnim.reverse(); 
    }
    
    if (window.scrollY > 10) {
        header.classList.add("header-dark");
    } else {
        header.classList.remove("header-dark"); 
    }
  }
});

// ======================================================
// SEC4: INFINITE VELOCITY MARQUEE
// ======================================================

const loopCol1 = gsap.to(".col-1", {
    yPercent: -50, 
    repeat: -1, 
    duration: 45, 
    ease: "none"
});

const loopCol2 = gsap.fromTo(".col-2", 
    { yPercent: -50 }, 
    { yPercent: 0, 
        repeat: -1, 
        duration: 45, 
        ease: "none" }
);

let tempoScroll;

ScrollTrigger.create({
    trigger: ".sec4",
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
        let velocidadeScroll = self.getVelocity() / 100; 
        let multiplicador = 1.5 + velocidadeScroll; 
        
        gsap.to([loopCol1, loopCol2], { 
            timeScale: multiplicador, 
            overwrite: true,
            duration: 0.2 
        });

        clearTimeout(tempoScroll);
        tempoScroll = setTimeout(() => {
            gsap.to([loopCol1, loopCol2], { timeScale: 1, duration: 0.8 });
        }, 150);
    }
});

// ======================================================
// ENVIO DE FORMULÁRIO (EFEITO LASER SCAN AWWWARDS)
// ======================================================
const form = document.querySelector('.analysis-form');

if (form) {
    // 1. Preparar os SVGs de checkmark para o efeito de "desenhar à mão"
    const checks = document.querySelectorAll('.check-laser path');
    checks.forEach(path => {
        const length = path.getTotalLength();
        // Esconde a linha puxando-a para fora do percurso
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const website = document.querySelector('#websiteUrl').value;
        const email = document.querySelector('#userEmail').value;
        const btn = form.querySelector('button');
        const inputs = form.querySelectorAll('input');

        // Efeito de "Pressão" no botão ao clicar
        gsap.to(btn, { scale: 0.9, opacity: 0.7, duration: 0.2 });
        btn.disabled = true;

        const { error } = await _supabase
            .from('leads')
            .insert([{ website_url: website, email: email }]);

        if (error) {
            console.error('Erro:', error);
            alert('Error sending request. Please try again.');
            gsap.to(btn, { scale: 1, opacity: 1, duration: 0.2 });
            btn.disabled = false;
        } else {
            // A MÁGICA "HACKER" (TERMINAL EFFECT)
            
            // 1. Esvazia os campos e bloqueia a escrita
            inputs.forEach(input => {
                input.value = '';
                input.disabled = true;
                input.style.cursor = 'default';
            });

            // 2. O botão "evapora"
            gsap.to(btn, { 
                opacity: 0, 
                scale: 0.5, 
                duration: 0.4, 
                ease: "back.in(1.7)",
                onComplete: () => btn.style.display = 'none' 
            });

            // 3. Os placeholders mudam como um terminal seguro
            setTimeout(() => {
                document.querySelector('#websiteUrl').placeholder = "[ Data Encrypted ]";
                document.querySelector('#userEmail').placeholder = "[ System Secured ]";
                
                // Um leve piscar de verde neon nos inputs para dar o efeito de terminal
                gsap.fromTo(inputs, 
                    { color: "rgb(38, 203, 186)" }, 
                    { color: "#ffffff", duration: 1, stagger: 0.2 }
                );
            }, 300);

            // 4. O título reescreve-se sozinho
            const title = document.querySelector('#form-title');
            gsap.to(title, {
                opacity: 0,
                duration: 0.3,
                delay: 0.5,
                onComplete: () => {
                    // Novo texto de sucesso com a sua classe de itálico
                    title.innerHTML = "Analysis <em>Engineered.</em><br/>We'll talk soon.";
                    
                    // Entra da esquerda para a direita simulando código a aparecer
                    gsap.fromTo(title, 
                        { opacity: 0, x: -30 }, 
                        { opacity: 1, x: 0, duration: 0.8, ease: "power4.out" }
                    );
                }
            });
        }
    });
}

// ======================================================
// HERO WORD FLIPPER
// ======================================================

const words = [ "websites", "logos", "banners", "ads", "products", "moments", "creatives", "systems", "experiences"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const wordElement = document.querySelector(".word-rotator");

if (wordElement) {
    wordElement.innerText = ""; 

    function typeWriter() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            wordElement.innerText = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            wordElement.innerText = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; 
            isDeleting = true;
        } 
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; 
            typeSpeed = 500; 
        }

        setTimeout(typeWriter, typeSpeed);
    }
    typeWriter();
}

// ======================================================
// OTIMIZAÇÃO DE VÍDEOS
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    const heroVideo = document.querySelector(".sec1 video"); 
    
    if (heroVideo) {
        setTimeout(() => {
            heroVideo.play().catch(e => console.log("Play bloqueado pelo navegador"));
        }, 800); 
    }

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