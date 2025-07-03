/**
 * MAKONA ELECTRICAL SERVICE - MAIN JAVASCRIPT
 * Professional website functionality
 */

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    
    // Show home page by default
    showPage('home');
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    
    // Change hamburger icon
    const icon = navToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.className = 'ph ph-x';
    } else {
        icon.className = 'ph ph-list';
    }
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    const icon = navToggle.querySelector('i');
    icon.className = 'ph ph-list';
}

function handleNavClick(e) {
    e.preventDefault();
    const page = e.currentTarget.dataset.page;
    
    if (page) {
        showPage(page);
        updateActiveNavLink(e.currentTarget);
        closeMobileMenu();
    }
}

function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

/**
 * Page navigation
 */
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show requested page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update navigation
        const navLink = document.querySelector(`[data-page="${pageId}"]`);
        if (navLink) {
            updateActiveNavLink(navLink);
        }
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Trigger animations for the new page
        triggerPageAnimations(pageId);
    }
}

/**
 * Scroll effects
 */
function initializeScrollEffects() {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar scroll effect
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero && scrollY < window.innerHeight) {
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
    }
    
    ticking = false;
}

/**
 * Scroll to services section
 */
function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        const offsetTop = servicesSection.offsetTop - 100; // Account for fixed navbar
        
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
    // Initialize intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize floating icons animation
    initializeFloatingIcons();
}

function initializeFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Add random delay to make animation more natural
        const randomDelay = Math.random() * 2;
        icon.style.animationDelay = `${randomDelay}s`;
        
        // Add slight rotation animation on hover
        icon.addEventListener('mouseenter', function() {
            this.style.transform += ' rotate(15deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' rotate(15deg)', '');
        });
    });
}

function triggerPageAnimations(pageId) {
    // Reset all animations
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.remove('aos-animate');
    });
    
    // Trigger animations with delay for the active page
    setTimeout(() => {
        const pageElements = document.querySelectorAll(`#${pageId} [data-aos]`);
        pageElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('aos-animate');
            }, index * 100);
        });
    }, 100);
}

/**
 * Contact form functionality
 */
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Auto-format phone number
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneNumber);
        }
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Validate form
    if (!validateForm(name, phone, message)) {
        return;
    }
    
    // Create WhatsApp message
    const whatsappMessage = createWhatsAppMessage(name, phone, service, message);
    
    // Send via WhatsApp
    sendWhatsAppMessage(whatsappMessage);
}

function validateForm(name, phone, message) {
    if (!name.trim()) {
        showFormError('Please enter your full name');
        return false;
    }
    
    if (!phone.trim()) {
        showFormError('Please enter your phone number');
        return false;
    }
    
    if (!message.trim()) {
        showFormError('Please describe your service requirement');
        return false;
    }
    
    // Validate phone number format (South African)
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    const cleanPhone = phone.replace(/\s+/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
        showFormError('Please enter a valid South African phone number');
        return false;
    }
    
    return true;
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format as South African number
    if (value.length >= 10) {
        if (value.startsWith('27')) {
            value = '+' + value.substring(0, 2) + ' ' + value.substring(2, 5) + ' ' + value.substring(5, 8) + ' ' + value.substring(8, 12);
        } else if (value.startsWith('0')) {
            value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 10);
        }
    }
    
    e.target.value = value;
}

function createWhatsAppMessage(name, phone, service, message) {
    const serviceText = service ? `\n*Service:* ${getServiceName(service)}` : '';
    
    return encodeURIComponent(
        `*New Service Request*\n\n` +
        `*Name:* ${name}\n` +
        `*Phone:* ${phone}${serviceText}\n\n` +
        `*Message:*\n${message}\n\n` +
        `_Sent from Makona Electrical Service website_`
    );
}

function getServiceName(serviceValue) {
    const services = {
        'stoves': 'Stoves & Ovens',
        'fridges': 'Refrigeration',
        'geysers': 'Geyser Systems',
        'washing': 'Washing Machines',
        'aircon': 'Air Conditioning',
        'wiring': 'Electrical Wiring',
        'emergency': 'Emergency Repair',
        'other': 'Other Service'
    };
    
    return services[serviceValue] || serviceValue;
}

function sendWhatsAppMessage(message) {
    // Primary WhatsApp number
    const primaryPhone = '27792525627';
    const whatsappUrl = `https://wa.me/${primaryPhone}?text=${message}`;
    
    // Show success message
    showFormSuccess();
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form after short delay
    setTimeout(() => {
        contactForm.reset();
    }, 1000);
}

function showFormError(message) {
    // Remove existing alerts
    removeFormAlerts();
    
    // Create error alert
    const alert = document.createElement('div');
    alert.className = 'form-alert error';
    alert.innerHTML = `
        <i class="ph ph-warning-circle"></i>
        <span>${message}</span>
    `;
    
    // Insert before form
    contactForm.parentNode.insertBefore(alert, contactForm);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function showFormSuccess() {
    // Remove existing alerts
    removeFormAlerts();
    
    // Create success alert
    const alert = document.createElement('div');
    alert.className = 'form-alert success';
    alert.innerHTML = `
        <i class="ph ph-check-circle"></i>
        <span>Message sent! Redirecting to WhatsApp...</span>
    `;
    
    // Insert before form
    contactForm.parentNode.insertBefore(alert, contactForm);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function removeFormAlerts() {
    const alerts = document.querySelectorAll('.form-alert');
    alerts.forEach(alert => alert.remove());
}

/**
 * Utility functions
 */
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Global functions (called from HTML)
window.showPage = showPage;
window.scrollToServices = scrollToServices;

/**
 * Performance optimizations
 */
// Lazy load images when they come into view
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLazyLoading);
} else {
    initializeLazyLoading();
}