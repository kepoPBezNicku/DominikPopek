// NAPRAWIONY JavaScript z działającymi tooltipami

// DOM elements
let navLinks, pages, heroCards, hamburger, navMenu, softSkills, tooltip, contactButton;
let levelSelect, hoursInput, nightModeCheckbox, travelInput, totalCostSpan;

// Current active page
let currentPage = 'home';

// Initialize application when DOM is ready
function initializeApp() {
    console.log('Initializing CV app...');

    // Get DOM elements
    navLinks = document.querySelectorAll('.nav-link');
    pages = document.querySelectorAll('.page');
    heroCards = document.querySelectorAll('.hero-card');
    hamburger = document.querySelector('.hamburger');
    navMenu = document.querySelector('.nav-menu');
    contactButton = document.querySelector('[data-section="contact"]');

    // Create tooltip element first
    createTooltipElement();

    console.log('Found elements:', {
        navLinks: navLinks.length,
        pages: pages.length,
        heroCards: heroCards.length,
        hamburger: !!hamburger,
        navMenu: !!navMenu,
        tooltip: !!tooltip
    });

    // Initialize all functionality
    initializeNavigation();
    initializeHeroCards();
    initializeMobileMenu();
    initializeScrollAnimations();

    // POPRAWKA: Inicjalizacja tooltipów dla umiejętności miękkich
    setTimeout(() => {
        initializeSoftSkillsTooltips();
    }, 100);

    // Set initial active nav link and ensure home page is visible
    updateActiveNavLink('home');
    showPage('home');

    // Initialize calculator if we're on tutoring page
    setTimeout(initializeCalculator, 100);

    console.log('App initialized successfully');
}

// Create tooltip element
function createTooltipElement() {
    // Remove existing tooltip if any
    const existingTooltip = document.getElementById('tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    // Create new tooltip
    tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.className = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '9999';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s ease';
    document.body.appendChild(tooltip);
    console.log('Tooltip element created and added to DOM');
}

// POPRAWKA: Całkowicie przepisana funkcja tooltipów
function initializeSoftSkillsTooltips() {
    console.log('=== INITIALIZING SOFT SKILLS TOOLTIPS ===');

    // Znajdź wszystkie elementy umiejętności miękkich
    softSkills = document.querySelectorAll('.skill-item.soft');
    console.log('Found soft skills:', softSkills.length);

    if (softSkills.length === 0) {
        console.warn('No soft skills found!');
        return;
    }

    // Sprawdź czy tooltip istnieje
    if (!tooltip) {
        console.error('Tooltip element not found, creating...');
        createTooltipElement();
    }

    // Dodaj event listenery do każdej umiejętności
    softSkills.forEach((skill, index) => {
        const description = skill.getAttribute('data-description');
        const skillName = skill.textContent.trim();

        console.log(`Setting up skill ${index}: "${skillName}"`);
        console.log(`Description: ${description ? 'YES' : 'NO'} (${description ? description.length : 0} chars)`);

        if (!description) {
            console.warn(`Missing description for: ${skillName}`);
            return;
        }

        // Usuń stare event listenery
        skill.onmouseenter = null;
        skill.onmouseleave = null;
        skill.onmousemove = null;

        // Dodaj nowe event listenery
        skill.addEventListener('mouseenter', function(e) {
            console.log(`Tooltip showing for: ${skillName}`);
            showTooltip(e, description);
        });

        skill.addEventListener('mouseleave', function(e) {
            console.log(`Tooltip hiding for: ${skillName}`);
            hideTooltip();
        });

        skill.addEventListener('mousemove', function(e) {
            if (tooltip && tooltip.style.opacity === '1') {
                updateTooltipPosition(e);
            }
        });

        console.log(`Events attached for: ${skillName}`);
    });

    console.log('=== TOOLTIPS INITIALIZATION COMPLETE ===');
}

// Show tooltip - improved version
function showTooltip(e, text) {
    if (!tooltip || !text) {
        console.error('Cannot show tooltip: missing element or text');
        return;
    }

    console.log('Showing tooltip with text:', text.substring(0, 50) + '...');

    // Set content
    tooltip.textContent = text;

    // Show tooltip
    tooltip.style.opacity = '1';
    tooltip.classList.add('show');

    // Position tooltip
    updateTooltipPosition(e);
}

// Hide tooltip
function hideTooltip() {
    if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.classList.remove('show');
        console.log('Tooltip hidden');
    }
}

// Update tooltip position
function updateTooltipPosition(e) {
    if (!tooltip) return;

    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    const offset = 15;
    let x = clientX + offset;
    let y = clientY - 100; // Pokaż nad kursorem

    // Sprawdź granice okna
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position
    if (x + 350 > viewportWidth - 10) {
        x = clientX - 350 - offset; // Show to the left
    }
    if (x < 10) {
        x = 10;
    }

    // Adjust vertical position
    if (y < 10) {
        y = clientY + offset; // Show below cursor
    }

    // Apply position
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

// Navigation functionality
function initializeNavigation() {
    console.log('Setting up navigation...');

    navLinks.forEach((link, index) => {
        const targetSection = link.getAttribute('data-section');
        console.log(`Nav link ${index}: ${targetSection}`);

        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const section = this.getAttribute('data-section');
            console.log('Navigation clicked:', section);
            showPage(section);
            updateActiveNavLink(section);
            closeMobileMenu();
        });
    });

    // Contact button in summary section
    if (contactButton) {
        contactButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Contact button clicked');
            showPage('contact');
            updateActiveNavLink('contact');
        });
    }
}

// Show specific page
function showPage(pageId) {
    console.log('Switching to page:', pageId);

    // Hide tooltip when changing pages
    hideTooltip();

    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Re-initialize tooltips for the current page
        setTimeout(() => {
            initializeSoftSkillsTooltips();
        }, 100);

        // Initialize calculator if switching to tutoring page
        if (pageId === 'tutoring') {
            setTimeout(initializeCalculator, 200);
        }

        console.log('Page switched successfully to:', pageId);
    } else {
        console.error('Page not found:', pageId);
    }
}

// Update active navigation link
function updateActiveNavLink(activeSection) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === activeSection) {
            link.classList.add('active');
        }
    });
}

// Hero cards navigation
function initializeHeroCards() {
    console.log('Setting up hero cards...');

    heroCards.forEach((card, index) => {
        const targetSection = card.getAttribute('data-section');
        console.log(`Hero card ${index}: ${targetSection}`);

        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const section = this.getAttribute('data-section');
            console.log('Hero card clicked:', section);
            showPage(section);
            updateActiveNavLink(section);
        });
    });
}

// Price calculator
function initializeCalculator() {
    console.log('Initializing calculator...');

    // Get calculator elements
    levelSelect = document.getElementById('level');
    hoursInput = document.getElementById('hours');
    nightModeCheckbox = document.getElementById('nightMode');
    travelInput = document.getElementById('travel');
    totalCostSpan = document.getElementById('totalCost');

    if (!levelSelect || !hoursInput || !nightModeCheckbox || !travelInput || !totalCostSpan) {
        console.log('Calculator elements not found on current page');
        return;
    }

    console.log('Calculator elements found, setting up...');

    // Add event listeners
    levelSelect.addEventListener('change', calculatePrice);
    hoursInput.addEventListener('input', calculatePrice);
    nightModeCheckbox.addEventListener('change', calculatePrice);
    travelInput.addEventListener('input', calculatePrice);

    // Initial calculation
    calculatePrice();

    console.log('Calculator initialized successfully');
}

// Calculate tutoring price
function calculatePrice() {
    if (!levelSelect || !hoursInput || !nightModeCheckbox || !travelInput || !totalCostSpan) {
        return;
    }

    try {
        const basePrice = parseInt(levelSelect.value) || 50;
        const hours = parseInt(hoursInput.value) || 1;
        const isNightMode = nightModeCheckbox.checked;
        const travelMinutes = parseInt(travelInput.value) || 0;

        let totalPrice = basePrice * hours;

        // Add night mode surcharge
        if (isNightMode) {
            totalPrice += 100 * hours;
        }

        // Add travel cost (10 zł per 20 minutes, rounded up)
        if (travelMinutes > 0) {
            const travelCost = Math.ceil(travelMinutes / 20) * 10;
            totalPrice += travelCost;
        }

        // Update display
        totalCostSpan.textContent = totalPrice;

        console.log('Price calculated:', totalPrice);
    } catch (error) {
        console.error('Error calculating price:', error);
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    if (!hamburger || !navMenu) {
        console.log('Mobile menu elements not found');
        return;
    }

    console.log('Setting up mobile menu...');

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (!navMenu || !hamburger) return;

    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');

    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (spans.length >= 3) {
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
}

// Close mobile menu
function closeMobileMenu() {
    if (!navMenu || !hamburger) return;

    navMenu.classList.remove('active');
    hamburger.classList.remove('active');

    // Reset hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (spans.length >= 3) {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll('.timeline-item, .skill-item, .interest-item, .review-card, .activity-card, .contact-card');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

// Test function for tooltips
function testTooltips() {
    console.log('=== TESTING TOOLTIPS ===');
    const skills = document.querySelectorAll('.skill-item.soft');
    console.log('Found skills:', skills.length);

    skills.forEach((skill, i) => {
        const desc = skill.getAttribute('data-description');
        console.log(`${i+1}. ${skill.textContent.trim()}: ${desc ? 'HAS DESC' : 'NO DESC'}`);
    });
}

// Make test function globally available
window.testTooltips = testTooltips;

console.log('CV App script loaded successfully');
