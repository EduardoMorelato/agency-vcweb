
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

