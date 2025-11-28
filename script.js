document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile nav when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // --- 2. Active Page Link Highlighting ---
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-links li');

    navItems.forEach(item => {
        const link = item.querySelector('a');
        const linkPage = link.getAttribute('href').split('/').pop();

        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            item.classList.add('active');
        }
    });

    // --- 3. Dark Mode Toggle ---
    const themeSwitch = document.getElementById('theme-switch');

    // Check for saved theme in localStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeSwitch.checked = true;
        }
    }

    // Toggle theme on switch change
    themeSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- 4. On-Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 5. Portfolio Filtering ---
    const filterButtonsContainer = document.querySelector('.filter-buttons');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    if (filterButtonsContainer) {
        filterButtonsContainer.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;

            // Update active button state
            const buttons = filterButtonsContainer.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.classList.add('secondary');
                btn.classList.remove('active'); // 'active' class not used, just ensure primary/secondary
            });
            e.target.classList.remove('secondary');

            const filter = e.target.getAttribute('data-filter');

            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                    card.classList.add('reveal'); // Re-add reveal if it was hidden
                } else {
                    card.style.display = 'none';
                    card.classList.remove('reveal');
                }
            });
        });
    }

});
// Real Email Integration for Contact Form - Linked to kingsleyobosu074@gmail.com
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (contactForm) {
        // Form submission with real email integration
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Show loading state
                submitBtn.classList.add('loading');
                
                // METHOD 1: Direct mailto to kingsleyobosu074@gmail.com (Works Immediately)
                submitFormWithMailto();
                
                // METHOD 2: Using Formspree (Uncomment when ready)
                // submitFormWithFormspree();
            }
        });
    }
    
    // METHOD 1: Direct Mailto to YOUR Email (Working Now!)
    function submitFormWithMailto() {
        const name = encodeURIComponent(contactForm.name.value);
        const email = encodeURIComponent(contactForm.email.value);
        const subject = encodeURIComponent(contactForm.subject.value);
        const budget = encodeURIComponent(contactForm.querySelector('input[name="budget"]:checked')?.value || 'Not specified');
        const message = encodeURIComponent(contactForm.message.value);
        
        const emailBody = `New Project Inquiry from Portfolio Website%0A%0A` +
                         `Name: ${name}%0A` +
                         `Email: ${email}%0A` +
                         `Project Type: ${subject}%0A` +
                         `Budget: ${budget}%0A%0A` +
                         `Message:%0A${message}%0A%0A` +
                         `---%0AThis message was sent from your portfolio contact form`;
        
        const mailtoLink = `mailto:kingsleyobosu074@gmail.com?subject=Portfolio Inquiry: ${subject}&body=${emailBody}`;
        
        // Open email client
        window.open(mailtoLink, '_blank');
        
        showMessage('📧 Your email client is opening! Please send the pre-filled email to complete your message. Thank you!', 'success');
        contactForm.reset();
        submitBtn.classList.remove('loading');
    }
    
    // METHOD 2: Formspree Integration (Setup Required)
    async function submitFormWithFormspree() {
        const formData = new FormData(contactForm);
        
        try {
            // Replace with your actual Formspree form ID
            const response = await fetch('https://formspree.io/f/xjvnoqev', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showMessage('🎉 Thank you! Your message has been sent to kingsleyobosu074@gmail.com. I\'ll get back to you within 2-4 hours.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('⚠️ Failed to send message automatically. Please try the direct email option.', 'error');
            // Fallback to mailto
            setTimeout(() => submitFormWithMailto(), 2000);
        } finally {
            submitBtn.classList.remove('loading');
        }
    }
    
    // Form Validation Functions
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        
        field.classList.remove('valid', 'invalid');
        
        if (!value) {
            field.classList.add('invalid');
            return false;
        }
        
        if (fieldName === 'email' && !isValidEmail(value)) {
            field.classList.add('invalid');
            return false;
        }
        
        field.classList.add('valid');
        return true;
    }
    
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Check if at least one budget option is selected
        const budgetSelected = contactForm.querySelector('input[name="budget"]:checked');
        if (!budgetSelected) {
            showMessage('💰 Please select a budget range for your project.', 'info');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Auto-hide info messages after 5 seconds
        if (type === 'info') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
            hideMessage(); // Hide message when user starts typing
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Budget option selection styling
    const budgetOptions = contactForm.querySelectorAll('.budget-option');
    budgetOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radioInput = this.querySelector('input[type="radio"]');
            radioInput.checked = true;
            
            budgetOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            hideMessage(); // Hide budget message when selected
        });
    });
    
    function hideMessage() {
        formMessage.style.display = 'none';
    }
    
    // Make all email links point to your email
    document.querySelectorAll('a[href*="mailto:"]').forEach(link => {
        link.href = 'mailto:kingsleyobosu074@gmail.com';
    });
});

// Add CSS for selected budget option
const style = document.createElement('style');
style.textContent = `
    .budget-option.selected {
        border-color: var(--contact-accent) !important;
        background: rgba(79, 70, 229, 0.05) !important;
        transform: translateY(-2px);
    }
    
    .budget-option.selected span {
        color: var(--contact-accent) !important;
        font-weight: 600 !important;
    }
    
    input.valid, select.valid, textarea.valid {
        border-color: var(--contact-success) !important;
    }
    
    input.invalid, select.invalid, textarea.invalid {
        border-color: var(--contact-error) !important;
    }
`;
document.head.appendChild(style);