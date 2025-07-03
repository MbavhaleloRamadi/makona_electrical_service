/**
 * MAKONA ELECTRICAL SERVICE - MAIN JAVASCRIPT
 * Professional website functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contact-form');
    const preloader = document.getElementById('preloader');

    // Hide preloader once content is loaded
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
    });

    // Initialize all functionalities
    initializeNavigation(navbar, navToggle, navMenu, navLinks);
    initializeScrollEffects(navbar);
    initializeAnimations();
    if (contactForm) {
        initializeContactForm(contactForm);
    }
    
    // NEW: Create the dynamic hero background
    createHeroBackgroundIcons();

    // Show home page by default
    showPage('home');
});

/**
 * NEW: Creates the moving icon wallpaper in the hero section
 */
function createHeroBackgroundIcons() {
    const container = document.getElementById('hero-background');
    if (!container) return;

    const icons = [
        'ph-lightning', 'ph-wrench', 'ph-snowflake', 'ph-wind', 'ph-fire', 
        'ph-drop', 'ph-washing-machine', 'ph-gear', 'ph-hammer', 'ph-plug'
    ];
    const iconCount = 30; // Number of icons to generate

    for (let i = 0; i < iconCount; i++) {
        const iconEl = document.createElement('div');
        iconEl.classList.add('bg-icon');

        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        iconEl.innerHTML = `<i class="ph ${randomIcon}"></i>`;

        const size = Math.random() * 60 + 20; // Random size between 20px and 80px
        iconEl.style.fontSize = `${size}px`;
        iconEl.style.top = `${Math.random() * 100}%`;
        iconEl.style.left = `${Math.random() * 100}%`;
        
        // Set random properties for the animation
        iconEl.style.setProperty('--tx-start', `${(Math.random() - 0.5) * 20}vw`);
        iconEl.style.setProperty('--ty-start', `${(Math.random() - 0.5) * 20}vh`);
        iconEl.style.setProperty('--tx-end', `${(Math.random() - 0.5) * 20}vw`);
        iconEl.style.setProperty('--ty-end', `${(Math.random() - 0.5) * 20}vh`);
        iconEl.style.setProperty('--r-start', `${Math.random() * 360}deg`);
        iconEl.style.setProperty('--r-end', `${Math.random() * 360}deg`);
        iconEl.style.animationDuration = `${Math.random() * 20 + 15}s`; // Duration between 15s and 35s
        iconEl.style.animationDelay = `-${Math.random() * 10}s`; // Start at a random point in the animation

        container.appendChild(iconEl);
    }
}


/**
 * Navigation functionality
 */
function initializeNavigation(navbar, navToggle, navMenu, navLinks) {
    navToggle.addEventListener('click', () => toggleMobileMenu(navMenu, navToggle));
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            if (page) {
                showPage(page);
                updateActiveNavLink(e.currentTarget, navLinks);
                closeMobileMenu(navMenu, navToggle);
            }
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu(navMenu, navToggle);
        }
    });
}

function toggleMobileMenu(navMenu, navToggle) {
    navMenu.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    icon.className = navMenu.classList.contains('active') ? 'ph ph-x' : 'ph ph-list';
}

function closeMobileMenu(navMenu, navToggle) {
    navMenu.classList.remove('active');
    const icon = navToggle.querySelector('i');
    icon.className = 'ph ph-list';
}

function updateActiveNavLink(activeLink, navLinks) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

/**
 * Page navigation
 */
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (navLink) {
            updateActiveNavLink(navLink, document.querySelectorAll('.nav-link'));
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        triggerPageAnimations(pageId);
    }
}

/**
 * Scroll effects
 */
function initializeScrollEffects(navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

/**
 * Scroll to services section
 */
function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const offsetTop = servicesSection.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

/**
 * Animation system
 */
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

function triggerPageAnimations(pageId) {
    const pageElements = document.querySelectorAll(`#${pageId} [data-aos]`);
    pageElements.forEach(el => {
        el.classList.remove('aos-animate');
        // Re-observe to trigger animation again if needed
        const observer = new IntersectionObserver(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });
        observer.observe(el);
    });
}

/**
 * Contact form functionality
 */
function initializeContactForm(contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');
    
    if (!validateForm(name, phone, message)) {
        return;
    }
    
    const whatsappMessage = createWhatsAppMessage(name, phone, service, message);
    sendWhatsAppMessage(whatsappMessage, e.target);
}

function validateForm(name, phone, message) {
    if (!name.trim()) {
        showFormAlert('Please enter your full name', 'error');
        return false;
    }
    const cleanPhone = phone.replace(/\s+/g, '');
    const phoneRegex = /^(?:\+27|0)[6-8][0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
        showFormAlert('Please enter a valid South African phone number', 'error');
        return false;
    }
    if (!message.trim()) {
        showFormAlert('Please describe your service requirement', 'error');
        return false;
    }
    return true;
}

function formatPhoneNumber(e) {
    let input = e.target.value.replace(/\D/g, '');
    if (input.startsWith('27') && input.length > 2) {
        input = `+${input.substring(0,2)} ${input.substring(2)}`;
    } else if (input.startsWith('0') && input.length > 0) {
        // Standard formatting can be applied here if desired
    }
    e.target.value = input;
}

function createWhatsAppMessage(name, phone, service, message) {
    const serviceText = service ? `\n*Service:* ${getServiceName(service)}` : '';
    return encodeURIComponent(
        `*Potential Client From Website*\n\n` +
        `*New Service Request*\n\n` +
        `*Name:* ${name}\n` +
        `*Phone:* ${phone}${serviceText}\n\n` +
        `*Message:*\n${message}\n\n` +
        `_Sent from the Makona Electrical Service website._`
    );
}

function getServiceName(serviceValue) {
    const services = {
        'stoves': 'Stoves & Ovens', 'fridges': 'Refrigeration',
        'geysers': 'Geyser Systems', 'washing': 'Washing Machines',
        'aircon': 'Air Conditioning', 'wiring': 'Electrical Wiring',
        'emergency': 'Emergency Repair', 'other': 'Other Service'
    };
    return services[serviceValue] || serviceValue;
}

function sendWhatsAppMessage(message, form) {
    const primaryPhone = '27792525627';
    const whatsappUrl = `https://wa.me/${primaryPhone}?text=${message}`;
    
    showFormAlert('Redirecting to WhatsApp...', 'success');
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
        form.reset();
    }, 1000);
}

function showFormAlert(message, type) {
    removeFormAlerts();
    const alert = document.createElement('div');
    alert.className = `form-alert ${type}`;
    const iconClass = type === 'success' ? 'ph-check-circle' : 'ph-warning-circle';
    alert.innerHTML = `<i class="ph ${iconClass}"></i><span>${message}</span>`;
    
    const formContainer = document.querySelector('.contact-form-container');
    formContainer.insertBefore(alert, formContainer.firstChild);
    
    setTimeout(removeFormAlerts, 5000);
}

function removeFormAlerts() {
    const alerts = document.querySelectorAll('.form-alert');
    alerts.forEach(alert => alert.remove());
}

// Global functions (called from HTML)
window.showPage = showPage;
window.scrollToServices = scrollToServices;