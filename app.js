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
    
    // IMPORTANT: Initialize tooltips immediately after DOM elements are found
    initializeSoftSkillsTooltips();
    
    // Set initial active nav link and ensure home page is visible
    updateActiveNavLink('home');
    showPage('home');
    
    // Initialize calculator
    initializeCalculator();
    
    console.log('App initialized successfully');
}

// Create tooltip element
function createTooltipElement() {
    // Remove existing tooltip if any
    const existingTooltip = document.querySelector('.tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    // Create new tooltip
    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '9999';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
    tooltip.style.transition = 'opacity 0.2s ease, visibility 0.2s ease';
    document.body.appendChild(tooltip);
    console.log('Tooltip element created and added to DOM');
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
            
            // Hide tooltip when navigating
            hideTooltip();
            
            // Show the target page
            showPage(section);
            updateActiveNavLink(section);
            closeMobileMenu();
        });
    });
    
    // Contact button in summary section
    // if (contactButton) {
    //     contactButton.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         console.log('Contact button clicked');
    //         hideTooltip();
    //         showPage('contact');
    //         updateActiveNavLink('contact');
    //     });
    // }
}

// Show specific page - FIXED VERSION
function showPage(pageId) {
    console.log('Switching to page:', pageId);
    
    // Hide tooltip when changing pages
    hideTooltip();
    
    // Hide all pages by removing active class
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none'; // Force hide
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block'; // Force show
        targetPage.classList.add('active');
        currentPage = pageId;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Re-initialize page-specific functionality
        setTimeout(() => {
            if (pageId === 'home') {
                initializeSoftSkillsTooltips();
            }
            if (pageId === 'tutoring') {
                initializeCalculator();
            }
        }, 100);
        
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
            hideTooltip();
            showPage(section);
            updateActiveNavLink(section);
        });
    });
}

// COMPLETELY REWRITTEN Soft skills tooltips functionality
function initializeSoftSkillsTooltips() {
    console.log('=== Initializing Soft Skills Tooltips ===');
    
    // Make sure we have the tooltip element
    if (!tooltip) {
        console.error('No tooltip element found, creating one...');
        createTooltipElement();
    }
    
    // Find all soft skill elements
    const skillElements = document.querySelectorAll('.skill-item.soft');
    console.log('Found soft skills elements:', skillElements.length);
    
    if (skillElements.length === 0) {
        console.warn('No soft skills elements found!');
        return;
    }
    
    // Set up tooltips for each skill
    skillElements.forEach((skill, index) => {
        const description = skill.getAttribute('data-description');
        const skillText = skill.textContent.trim();
        
        console.log(`Setting up skill ${index}: "${skillText}"`);
        
        if (!description) {
            console.warn(`Skill "${skillText}" missing data-description attribute`);
            return;
        }
        
        // Remove existing event listeners by cloning
        const newSkill = skill.cloneNode(true);
        skill.parentNode.replaceChild(newSkill, skill);
        
        // Add mouseenter event
        newSkill.addEventListener('mouseenter', function(e) {
            console.log(`Showing tooltip for: ${skillText}`);
            showTooltip(e, description);
        });
        
        // Add mouseleave event
        newSkill.addEventListener('mouseleave', function(e) {
            console.log(`Hiding tooltip for: ${skillText}`);
            hideTooltip();
        });
        
        // Add mousemove for positioning
        newSkill.addEventListener('mousemove', function(e) {
            if (tooltip && tooltip.style.opacity === '1') {
                updateTooltipPosition(e);
            }
        });
        
        // Touch support
        newSkill.addEventListener('touchstart', function(e) {
            e.preventDefault();
            console.log(`Touch tooltip for: ${skillText}`);
            showTooltip(e.touches[0], description);
            
            // Auto-hide after 3 seconds
            setTimeout(() => hideTooltip(), 3000);
        });
        
        // Make sure the skill is visible and interactive
        newSkill.style.cursor = 'pointer';
        
        console.log(`Tooltip events set up for: ${skillText}`);
    });
    
    console.log('=== Tooltips initialization complete ===');
}

// FIXED Show tooltip function
function showTooltip(e, text) {
    if (!tooltip || !text) {
        console.error('Cannot show tooltip: missing element or text');
        return;
    }
    
    console.log('Showing tooltip with text:', text.substring(0, 50) + '...');
    
    // Set content
    tooltip.innerHTML = text; // Use innerHTML in case there are quotes
    
    // Position tooltip first
    updateTooltipPosition(e);
    
    // Show tooltip
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
    tooltip.classList.add('show');
}

// FIXED Hide tooltip function
function hideTooltip() {
    if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.classList.remove('show');
        console.log('Tooltip hidden');
    }
}

// IMPROVED Update tooltip position
function updateTooltipPosition(e) {
    if (!tooltip) return;
    
    // Get coordinates
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    
    // Force tooltip to be visible temporarily to get its dimensions
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '0';
    
    const rect = tooltip.getBoundingClientRect();
    const tooltipWidth = rect.width || 350;
    const tooltipHeight = rect.height || 100;
    
    // Calculate position
    const offset = 15;
    let x = clientX + offset;
    let y = clientY - tooltipHeight - offset;
    
    // Viewport boundaries
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position
    if (x + tooltipWidth > viewportWidth - 20) {
        x = clientX - tooltipWidth - offset;
    }
    if (x < 20) {
        x = 20;
    }
    
    // Adjust vertical position  
    if (y < 20) {
        y = clientY + offset;
    }
    if (y + tooltipHeight > viewportHeight - 20) {
        y = viewportHeight - tooltipHeight - 20;
    }
    
    // Apply position
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

// FIXED Price calculator
function initializeCalculator() {
    console.log('Initializing calculator...');
    
    // Only initialize if we're on the tutoring page
    if (currentPage !== 'tutoring') {
        console.log('Not on tutoring page, skipping calculator initialization');
        return;
    }
    
    // Wait a bit for page to be fully rendered
    setTimeout(() => {
        levelSelect = document.getElementById('level');
        hoursInput = document.getElementById('hours');
        nightModeCheckbox = document.getElementById('nightMode');
        travelInput = document.getElementById('travel');
        totalCostSpan = document.getElementById('totalCost');
        
        if (!levelSelect || !hoursInput || !nightModeCheckbox || !travelInput || !totalCostSpan) {
            console.log('Calculator elements not found, trying again...');
            return;
        }
        
        console.log('Calculator elements found, setting up...');
        
        // Remove existing listeners to avoid duplicates
        levelSelect.removeEventListener('change', calculatePrice);
        hoursInput.removeEventListener('input', calculatePrice);
        nightModeCheckbox.removeEventListener('change', calculatePrice);
        travelInput.removeEventListener('input', calculatePrice);
        
        // Add event listeners
        levelSelect.addEventListener('change', calculatePrice);
        hoursInput.addEventListener('input', calculatePrice);
        nightModeCheckbox.addEventListener('change', calculatePrice);
        travelInput.addEventListener('input', calculatePrice);
        
        // Initial calculation
        calculatePrice();
        
        console.log('Calculator initialized successfully');
    }, 200);
}

// Calculate tutoring price
function calculatePrice() {
    if (!levelSelect || !hoursInput || !nightModeCheckbox || !travelInput || !totalCostSpan) {
        console.log('Calculator elements not available');
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
            totalPrice += 100;
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

// FIXED Mobile menu functionality
function initializeMobileMenu() {
    if (!hamburger || !navMenu) {
        console.log('Mobile menu elements not found');
        return;
    }
    
    console.log('Setting up mobile menu...');
    
    // Remove existing event listeners
    hamburger.removeEventListener('click', toggleMobileMenu);
    
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger clicked');
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
    
    console.log('Mobile menu initialized');
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (!navMenu || !hamburger) return;
    
    console.log('Toggling mobile menu');
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
    
    console.log('Closing mobile menu');
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
        if (el.style.animationPlayState !== 'running') {
            el.style.animationPlayState = 'paused';
        }
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
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu and tooltips
    if (e.key === 'Escape') {
        closeMobileMenu();
        hideTooltip();
    }
});

// Global click handler to hide tooltips
document.addEventListener('click', function(e) {
    if (!e.target.closest('.skill-item.soft')) {
        hideTooltip();
    }
});

// Debug function for tooltips
function debugTooltips() {
    console.log('=== TOOLTIP DEBUG ===');
    console.log('Tooltip element exists:', !!tooltip);
    console.log('Tooltip in DOM:', document.body.contains(tooltip));
    
    const skills = document.querySelectorAll('.skill-item.soft');
    console.log('Soft skills found:', skills.length);
    
    skills.forEach((skill, index) => {
        const description = skill.getAttribute('data-description');
        console.log(`Skill ${index}:`, {
            text: skill.textContent.trim(),
            hasDescription: !!description,
            descriptionLength: description ? description.length : 0
        });
    });
    console.log('==================');
}

// Test tooltip function
function testTooltip() {
    if (tooltip) {
        tooltip.innerHTML = 'Test tooltip - działa!';
        tooltip.style.left = '100px';
        tooltip.style.top = '100px';
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        tooltip.classList.add('show');
        
        setTimeout(() => {
            hideTooltip();
        }, 3000);
        
        console.log('Test tooltip displayed');
    } else {
        console.error('Tooltip element not found for test');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
    
    // Debug after initialization
    setTimeout(() => {
        debugTooltips();
        console.log('Debug functions available: CVApp.debugTooltips(), CVApp.testTooltip()');
    }, 1000);
});

// Make functions available globally for debugging
window.CVApp = {
    showPage,
    updateActiveNavLink,
    calculatePrice,
    toggleMobileMenu,
    initializeCalculator,
    debugTooltips,
    testTooltip,
    showTooltip,
    hideTooltip,
    initializeSoftSkillsTooltips,
    currentPage: () => currentPage
};

console.log('CV App script loaded successfully');