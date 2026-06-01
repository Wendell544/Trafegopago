(function() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
    });

    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('active')));

    // Animated counters
    const counters = document.querySelectorAll('.result-value[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = +el.dataset.target;
                const suffix = el.dataset.sufix || '';
                let start = 0;
                const duration = 1800;
                const step = (timestamp) => {
                    if (!start) start = timestamp;
                    const progress = Math.min((timestamp - start) / duration, 1);
                    el.textContent = '+' + Math.floor(progress * target) + suffix;
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));

    // Carousel
    const track = document.getElementById('track');
    const dotsContainer = document.getElementById('dots');
    const slides = track.children;
    let current = 0;

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.children;

    function goTo(i) {
        current = i;
        track.style.transform = `translateX(-${current * 100}%)`;
        Array.from(dots).forEach((d, idx) => d.classList.toggle('active', idx === current));
    }

    setInterval(() => goTo((current + 1) % slides.length), 4500);

    // FAQ accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // --------------------------------------------------------------
    // FORMULÁRIO DE LEAD: DISPARA EVENTO DO FACEBOOK PIXEL (Lead) 
    // E DEPOIS ABRE O WHATSAPP
    // --------------------------------------------------------------
    // 🔧 ATENÇÃO: Substitua o número abaixo pelo seu número com DDD (sem espaços ou caracteres especiais)
    const whatsappNumber = '5531999999999'; // <-- ALTERE AQUI PARA SEU NÚMERO REAL

    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Captura os dados do formulário
        const nome = document.getElementById('nome').value.trim();
        const tel = document.getElementById('telefone').value.trim();
        const empresa = document.getElementById('empresa').value.trim();
        const segmento = document.getElementById('segmento').value;
        const mensagem = document.getElementById('mensagem').value.trim();

        // 1º - DISPARA O EVENTO LEAD DO FACEBOOK PIXEL
        if (typeof fbq === 'function') {
            fbq('track', 'Lead', {
                content_name: 'Formulário de Contato - Tráfego Pago',
                content_category: 'Lead',
                user_nome: nome,
                user_telefone: tel,
                empresa: empresa,
                segmento: segmento
            });
            console.log('Evento Lead enviado para o Facebook Pixel');
        } else {
            console.warn('Facebook Pixel não carregado');
        }

        // 2º - ABRE O WHATSAPP COM A MENSAGEM
        const text = `Olá, visitei sua página e gostaria de saber mais sobre seus serviços de gestão de tráfego pago.%0A%0A*Nome:* ${nome}%0A*WhatsApp:* ${tel}%0A*Empresa:* ${empresa}%0A*Segmento:* ${segmento}%0A*Mensagem:* ${mensagem || 'Nenhuma'}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
        
        // Limpa o formulário
        this.reset();
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();