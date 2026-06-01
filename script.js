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

    // Animated counters (resultados)
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

    // Carousel de depoimentos
    const track = document.getElementById('track');
    const dotsContainer = document.getElementById('dots');
    const slides = track.children;
    let current = 0;

    // Cria os dots
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

    // Auto slide a cada 4.5 segundos
    setInterval(() => goTo((current + 1) % slides.length), 4500);

    // FAQ accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ========== FUNÇÃO PARA DISPARAR EVENTO DE LEAD ==========
    function trackLead(formData) {
        // 1. Google Analytics (gtag) se existir
        if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', {
                'event_category': 'formulario',
                'event_label': 'contato',
                'value': 1,
                'currency': 'BRL',
                'send_to': 'G-XXXXXXXXXX' // opcional: substitua pelo seu ID
            });
            console.log('[GTAG] Lead enviado');
        }

        // 2. Meta Pixel (fbq) se existir
        if (typeof fbq === 'function') {
            fbq('track', 'Lead', {
                content_name: 'Formulário de Contato',
                content_category: 'Lead',
                user_data: {
                    phone: formData.telefone,
                    email: undefined // não temos email no form
                }
            });
            console.log('[META PIXEL] Lead enviado');
        }

        // 3. Google Tag Manager (dataLayer) – útil para GTM
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                'event': 'lead_form_submit',
                'form_nome': formData.nome,
                'form_empresa': formData.empresa,
                'form_segmento': formData.segmento
            });
            console.log('[GTM] Evento lead_form_submit enviado');
        }

        // 4. Evento customizado via JavaScript (para analytics próprios)
        const customEvent = new CustomEvent('site_lead', {
            detail: formData
        });
        document.dispatchEvent(customEvent);
        console.log('[Custom Event] site_lead disparado');
    }
    // ========================================================

    // Formulário de contato
    const whatsappNumber = '5531999999999'; // <-- ALTERE AQUI PARA SEU NÚMERO

    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const empresa = document.getElementById('empresa').value.trim();
        const segmento = document.getElementById('segmento').value;
        const mensagem = document.getElementById('mensagem').value.trim();

        // Preparar dados do lead
        const leadData = {
            nome: nome,
            telefone: telefone,
            empresa: empresa,
            segmento: segmento,
            mensagem: mensagem,
            url_atual: window.location.href,
            data_hora: new Date().toISOString()
        };

        // Disparar evento de lead (para todos os pixels/gtags configurados)
        trackLead(leadData);

        // Construir mensagem para WhatsApp
        const text = `Olá, visitei sua página e gostaria de saber mais sobre seus serviços de gestão de tráfego pago.%0A%0A*Nome:* ${nome}%0A*WhatsApp:* ${telefone}%0A*Empresa:* ${empresa}%0A*Segmento:* ${segmento}%0A*Mensagem:* ${mensagem || 'Nenhuma'}`;

        // Abrir WhatsApp
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');

        // Resetar formulário
        this.reset();
    });

    // Smooth scroll para links internos (âncoras)
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