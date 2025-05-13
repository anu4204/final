
document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
        forms.forEach(form => {
            initFormValidation(form);
        });
    }
    
    initLanguageSelector();
});

function initMobileNav() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

function initFormValidation(form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const requiredInputs = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            const existingError = input.parentElement.querySelector('.form-error');
            if (existingError) {
                existingError.remove();
            }
            
            if (!input.value.trim()) {
                isValid = false;
                showError(input, 'This field is required');
            } 
            else if (input.type === 'email' && !validateEmail(input.value)) {
                isValid = false;
                showError(input, 'Please enter a valid email address');
            }
            else if (input.type === 'tel' && !validatePhone(input.value)) {
                isValid = false;
                showError(input, 'Please enter a valid phone number');
            }
        });
        
        if (isValid) {
            const successMsg = document.createElement('div');
            successMsg.classList.add('form-success');
            successMsg.textContent = 'Form submitted successfully! We will contact you shortly.';
            
            const existingSuccess = form.querySelector('.form-success');
            if (existingSuccess) {
                existingSuccess.remove();
            }
            
            form.appendChild(successMsg);
            form.reset();

        }
    });
}

function showError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('form-error');
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);
    
    input.classList.add('error');
    
    input.addEventListener('input', function() {
        const error = input.parentElement.querySelector('.form-error');
        if (error) {
            error.remove();
            input.classList.remove('error');
        }
    }, { once: true });
}


function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


function initLanguageSelector() {
    const languageSelector = document.querySelector('.language-selector');
    
    if (languageSelector) {
        const languageOptions = languageSelector.querySelectorAll('span');
        
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                languageOptions.forEach(opt => opt.classList.remove('active'));
                
                this.classList.add('active');
                
                localStorage.setItem('preferredLanguage', this.textContent.trim());
                
                alert('Language switched to ' + this.textContent.trim() + ' (This is a simulation)');
            });
        });
    }
}


function sendFormData(form) {
    const formData = new FormData(form);
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'submit-form.php', true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            const successMsg = document.createElement('div');
            successMsg.classList.add('form-success');
            successMsg.textContent = 'Form submitted successfully! We will contact you shortly.';
            
            const existingSuccess = form.querySelector('.form-success');
            if (existingSuccess) {
                existingSuccess.remove();
            }
            
            form.appendChild(successMsg);
            form.reset();
        } else {
            const errorMsg = document.createElement('div');
            errorMsg.classList.add('form-error');
            errorMsg.textContent = 'An error occurred. Please try again later.';
            form.appendChild(errorMsg);
        }
    };
    
    xhr.send(formData);
}