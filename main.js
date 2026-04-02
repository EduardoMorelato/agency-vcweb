
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