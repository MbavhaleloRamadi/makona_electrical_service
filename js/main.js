/**
 * MOKONE ELECTRICAL SERVICE - MAIN JAVASCRIPT
 * Professional website functionality with improved SPA navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- Global State & Elements ---
    const elements = {
        navbar: document.getElementById('navbar'),
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        contactForm: document.getElementById('contact-form'),
        preloader: document.getElementById('preloader'),
        pages: document.querySelectorAll('.page')
    };

    const state = {
        isHeroInitialized: false,
        aosObserver: null
    };

    // --- Initializations ---
    
    // Hide preloader once the window and all its assets are fully loaded
    window.addEventListener('load', () => {
        elements.preloader.classList.add('hidden');
    });

    // Set up all core functionalities
    initializeNavigation();
    initializeScrollEffects();
    initializeAos();
    initializeContactForm();
    
    // Show the default page (home) and run its initial setup
    showPage('home', true);

    // --- Function Definitions ---

    /**
     * Sets up navigation bar listeners for page switching and mobile menu.
     */
    function initializeNavigation() {
        elements.navToggle.addEventListener('click', () => toggleMobileMenu());
        
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.currentTarget.dataset.page;
                if (pageId) {
                    showPage(pageId);
                    updateActiveNavLink(e.currentTarget);
                    closeMobileMenu();
                }
            });
        });
        
        // Close mobile menu if clicked outside
        document.addEventListener('click', (e) => {
            if (!elements.navbar.contains(e.target) && elements.navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    /**
     * Toggles the mobile navigation menu visibility.
     */
    function toggleMobileMenu() {
        elements.navMenu.classList.toggle('active');
        const icon = elements.navToggle.querySelector('i');
        icon.className = elements.navMenu.classList.contains('active') ? 'ph ph-x' : 'ph ph-list';
    }

    /**
     * Closes the mobile navigation menu.
     */
    function closeMobileMenu() {
        elements.navMenu.classList.remove('active');
        const icon = elements.navToggle.querySelector('i');
        icon.className = 'ph ph-list';
    }

    /**
     * Updates the active state of navigation links.
     * @param {HTMLElement} activeLink - The link element to be marked as active.
     */
    function updateActiveNavLink(activeLink) {
        elements.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    /**
     * The core function for showing a page and handling content initialization.
     * @param {string} pageId - The ID of the page to display.
     * @param {boolean} [isInitialLoad=false] - Flag to check if it's the first page load.
     */
    function showPage(pageId, isInitialLoad = false) {
        elements.pages.forEach(page => page.classList.remove('active'));
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
            if (navLink) {
                updateActiveNavLink(navLink);
            }
            
            // Only scroll to top if it's not the initial page load
            if (!isInitialLoad) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // --- FLEXIBILITY FIX: Conditional content initialization ---
            // 1. Initialize hero background only for the home page and only once.
            if (pageId === 'home' && !state.isHeroInitialized) {
                createHeroBackgroundIcons();
                state.isHeroInitialized = true;
            }

            // 2. Re-trigger animations for the currently active page.
            triggerPageAnimations(pageId);
        }
    }

    /**
     * Creates the moving icon wallpaper in the hero section.
     */
    function createHeroBackgroundIcons() {
        const container = document.getElementById('hero-background');
        if (!container) return;

        const icons = [
            'ph-lightning', 'ph-wrench', 'ph-snowflake', 'ph-wind', 'ph-fire', 
            'ph-drop', 'ph-washing-machine', 'ph-gear', 'ph-hammer', 'ph-plug'
        ];
        const iconCount = 30;

        for (let i = 0; i < iconCount; i++) {
            const iconEl = document.createElement('div');
            iconEl.classList.add('bg-icon');
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            iconEl.innerHTML = `<i class="ph ${randomIcon}"></i>`;

            const size = Math.random() * 60 + 20;
            iconEl.style.fontSize = `${size}px`;
            iconEl.style.top = `${Math.random() * 100}%`;
            iconEl.style.left = `${Math.random() * 100}%`;
            
            iconEl.style.setProperty('--tx-start', `${(Math.random() - 0.5) * 20}vw`);
            iconEl.style.setProperty('--ty-start', `${(Math.random() - 0.5) * 20}vh`);
            iconEl.style.setProperty('--tx-end', `${(Math.random() - 0.5) * 20}vw`);
            iconEl.style.setProperty('--ty-end', `${(Math.random() - 0.5) * 20}vh`);
            iconEl.style.setProperty('--r-start', `${Math.random() * 360}deg`);
            iconEl.style.setProperty('--r-end', `${Math.random() * 360}deg`);
            iconEl.style.animationDuration = `${Math.random() * 20 + 15}s`;
            iconEl.style.animationDelay = `-${Math.random() * 10}s`;

            container.appendChild(iconEl);
        }
    }

    /**
     * Adds a scroll listener to the window to apply styles to the navbar.
     */
    function initializeScrollEffects() {
        window.addEventListener('scroll', () => {
            elements.navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    /**
     * Scrolls the page smoothly to the services section.
     */
    function scrollToServices() {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const navbarHeight = elements.navbar.offsetHeight;
            const offsetTop = servicesSection.offsetTop - navbarHeight;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    }

    /**
     * Initializes the Intersection Observer for scroll animations (AOS).
     */
    function initializeAos() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        state.aosObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    state.aosObserver.unobserve(entry.target); 
                }
            });
        }, observerOptions);
    }

    /**
     * Resets and re-triggers animations for elements on a specific page.
     * @param {string} pageId - The ID of the page whose animations should be triggered.
     */
    function triggerPageAnimations(pageId) {
        if (!state.aosObserver) return;

        const pageElements = document.querySelectorAll(`#${pageId} [data-aos]`);
        pageElements.forEach(el => {
            // Reset animation state
            el.classList.remove('aos-animate');
            // Re-observe the element to trigger the animation when it comes into view
            state.aosObserver.observe(el);
        });
    }

    /**
     * Sets up the contact form submission handler and input formatting.
     */
    function initializeContactForm() {
        if (!elements.contactForm) return;
        elements.contactForm.addEventListener('submit', handleFormSubmit);
    }

    /**
     * Handles the contact form submission event.
     * @param {Event} e - The form submission event.
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const service = formData.get('service');
        const message = formData.get('message');
        
        if (!validateForm(name, phone, message)) return;
        
        const whatsappMessage = createWhatsAppMessage(name, phone, service, message);
        sendWhatsAppMessage(whatsappMessage, e.target);
    }

    /**
     * Validates the contact form fields.
     * @returns {boolean} - True if the form is valid, false otherwise.
     */
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

    /**
     * Creates a pre-formatted WhatsApp message string.
     * @returns {string} - The URL-encoded WhatsApp message.
     */
    function createWhatsAppMessage(name, phone, service, message) {
        const serviceText = service ? `\n*Service:* ${getServiceName(service)}` : '';
        return encodeURIComponent(
            `*New Service Request from Website*\n\n` +
            `*Name:* ${name}\n` +
            `*Phone:* ${phone}${serviceText}\n\n` +
            `*Message:*\n${message}\n\n` +
            `_Sent from the Mokone Electrical Service website._`
        );
    }

    /**
     * Converts a service value to its display name.
     * @param {string} serviceValue - The value from the select dropdown.
     * @returns {string} - The full service name.
     */
    function getServiceName(serviceValue) {
        const services = {
            'stoves': 'Stoves & Ovens', 'fridges': 'Refrigeration',
            'geysers': 'Geyser Systems', 'washing': 'Washing Machines',
            'aircon': 'Air Conditioning', 'wiring': 'Electrical Wiring',
            'emergency': 'Emergency Repair', 'other': 'Other Service'
        };
        return services[serviceValue] || serviceValue;
    }

    /**
     * Opens the WhatsApp link and resets the form.
     * @param {string} message - The encoded message to send.
     * @param {HTMLFormElement} form - The form to reset.
     */
    function sendWhatsAppMessage(message, form) {
        const primaryPhone = '27792525627';
        const whatsappUrl = `https://wa.me/${primaryPhone}?text=${message}`;
        
        showFormAlert('Redirecting to WhatsApp...', 'success');
        window.open(whatsappUrl, '_blank');
        
        setTimeout(() => {
            form.reset();
        }, 1000);
    }

    /**
     * Displays a temporary alert message above the contact form.
     * @param {string} message - The message to display.
     * @param {'success'|'error'} type - The type of alert.
     */
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

    /**
     * Removes any existing form alerts.
     */
    function removeFormAlerts() {
        document.querySelectorAll('.form-alert').forEach(alert => alert.remove());
    }

    // --- Expose functions to global scope for inline HTML calls ---
    window.showPage = showPage;
    window.scrollToServices = scrollToServices;
});
