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
// ENVIO DE FORMULÁRIO COM ANIMAÇÃO PREMIUM
// ======================================================
const form = document.querySelector('.analysis-form');
const successMsg = document.querySelector('.success-message');

if (form && successMsg) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const website = document.querySelector('#websiteUrl').value;
        const email = document.querySelector('#userEmail').value;
        const btn = form.querySelector('button');

        // Feedback visual de carregamento
        gsap.to(btn, { opacity: 0.5, scale: 0.9, duration: 0.2 });
        btn.disabled = true;

        const { error } = await _supabase
            .from('leads')
            .insert([{ website_url: website, email: email }]);

        if (error) {
            console.error('Erro:', error);
            alert('Error sending request. Please try again.');
            gsap.to(btn, { opacity: 1, scale: 1, duration: 0.2 });
            btn.disabled = false;
        } else {
            // A MÁGICA DA ANIMAÇÃO:
            // 1. Esconde o formulário
            gsap.to(form, { 
                opacity: 0, 
                y: -20, 
                duration: 0.5, 
                onComplete: () => {
                    form.style.display = 'none';
                    
                    // 2. Mostra a mensagem de sucesso
                    successMsg.style.display = 'block';
                    gsap.fromTo(successMsg, 
                        { opacity: 0, y: 30, scale: 0.9 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
                    );

                    // 3. Anima o ícone de check separadamente
                    gsap.from(".success-icon", {
                        rotate: -45,
                        scale: 0,
                        duration: 1,
                        delay: 0.3,
                        ease: "elastic.out(1, 0.5)"
                    });
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