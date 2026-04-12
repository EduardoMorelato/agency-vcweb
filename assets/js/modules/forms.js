// assets/js/modules/forms.js

export function initForms() {
    const supabaseUrl = 'https://avrugsiyyokqatgbfzdj.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cnVnc2l5eW9rcWF0Z2JmemRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTc3OTgsImV4cCI6MjA5MTMzMzc5OH0.4pactJMgREvurMkQAiGNOC9M4ybWkA76D-kuW0TNIb8';
    const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

    const form = document.querySelector('.analysis-form');
    if (!form) return;

    const checks = document.querySelectorAll('.check-laser path');
    checks.forEach(path => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const website = document.querySelector('#websiteUrl').value;
        const email = document.querySelector('#userEmail').value;
        const btn = form.querySelector('button');
        const inputs = form.querySelectorAll('input');

        gsap.to(btn, { scale: 0.9, opacity: 0.7, duration: 0.2 });
        btn.disabled = true;

        const { error } = await _supabase
            .from('leads')
            .insert([{ website_url: website, email: email }]);

        if (error) {
            console.error('Erro:', error);
            alert('Error sending request.');
            gsap.to(btn, { scale: 1, opacity: 1, duration: 0.2 });
            btn.disabled = false;
        } else {
            inputs.forEach(input => {
                input.value = '';
                input.disabled = true;
            });

            gsap.to(btn, { opacity: 0, scale: 0.5, duration: 0.4, onComplete: () => btn.style.display = 'none' });

            setTimeout(() => {
                document.querySelector('#websiteUrl').placeholder = "[ Data Encrypted ]";
                document.querySelector('#userEmail').placeholder = "[ System Secured ]";
                gsap.fromTo(inputs, { color: "rgb(38, 203, 186)" }, { color: "#ffffff", duration: 1, stagger: 0.2 });
            }, 300);

            const title = document.querySelector('#form-title');
            gsap.to(title, {
                opacity: 0, duration: 0.3, delay: 0.5,
                onComplete: () => {
                    title.innerHTML = "Analysis <em>Engineered.</em><br/>We'll talk soon.";
                    gsap.fromTo(title, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8 });
                }
            });
        }
    });
}