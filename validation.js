const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const error_message = document.getElementById('error-message');

// Clear error styles when user starts typing
[firstname_input, email_input, password_input, repeat_password_input].forEach(input => {
    if (input) {
        input.addEventListener('input', () => {
            clearErrorStyles();
        });
    }
});


form.addEventListener('submit', (e) => {
    // If we have first name as input then we are in SignUp page
    let errors = [];
    if(firstname_input){
        errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, repeat_password_input.value);
    } else { // If we don't have first name as input then it's login page
        errors = getLoginFormErrors(email_input.value, password_input.value);
    }

    if(errors.length > 0){
        // If there are any errors
        e.preventDefault();
        error_message.innerText = errors.join(". ");
    } else {
        // Form is valid, allow submission
        error_message.innerText = "";
        clearErrorStyles();
        alert('Form submitted successfully!');
        
    }
});

function getSignupFormErrors(firstname, email, password, repeatPassword){
    let errors = [];
    
    // Clear previous error styles
    clearErrorStyles();

    // Test reCAPTCHA validation 
    if(typeof grecaptcha !== 'undefined') {
        const recaptchaResponse = grecaptcha.getResponse();
        if(recaptchaResponse.length === 0) {
            errors.push('Please complete the reCAPTCHA');
        }
    }

    // Validate firstname
    if (firstname === '' || firstname === null){
        errors.push('Firstname is required');
        firstname_input.parentElement.classList.add('incorrect');
        firstname_input.previousElementSibling.classList.add('incorrect-label');
    } else if (firstname.length < 2) {
        errors.push('Firstname must be at least 2 characters long');
        firstname_input.parentElement.classList.add('incorrect');
        firstname_input.previousElementSibling.classList.add('incorrect-label');
    }
    
    // Validate email
    if (email === '' || email === null){
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
        email_input.previousElementSibling.classList.add('incorrect-label');
    } else if (!isValidEmail(email)) {
        errors.push('Please enter a valid email address');
        email_input.parentElement.classList.add('incorrect');
        email_input.previousElementSibling.classList.add('incorrect-label');
    }
    
    // Validate password
    if (password === '' || password === null){
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
        password_input.previousElementSibling.classList.add('incorrect-label');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
        password_input.parentElement.classList.add('incorrect');
        password_input.previousElementSibling.classList.add('incorrect-label');
    }
    
    // Validate repeat password
    if (repeatPassword === '' || repeatPassword === null){
        errors.push('Repeat Password is required');
        repeat_password_input.parentElement.classList.add('incorrect');
        repeat_password_input.previousElementSibling.classList.add('incorrect-label');
    } else if (password !== repeatPassword) {
        errors.push('Passwords do not match');
        repeat_password_input.parentElement.classList.add('incorrect');
        repeat_password_input.previousElementSibling.classList.add('incorrect-label');
    }

    return errors;
}

function getLoginFormErrors(email, password){
    let errors = [];
    
    // Clear previous error styles
    clearErrorStyles();
    
    // Validate email
    if (email === '' || email === null){
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
        email_input.previousElementSibling.classList.add('incorrect-label');
    }
    // Validate password
    if (password === '' || password === null){
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
        password_input.previousElementSibling.classList.add('incorrect-label');
    }

    return errors;
}

function clearErrorStyles() {
    // Remove error styles from all form elements
    const formElements = document.querySelectorAll('form > div');
    formElements.forEach(element => {
        element.classList.remove('incorrect');
        const label = element.querySelector('label');
        if (label) {
            label.classList.remove('incorrect-label');
        }
    });
}

// Password strength meter
password_input.addEventListener('input', function() {
    const strength = checkPasswordStrength(this.value);
    updateStrengthMeter(strength);
});

function checkPasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return Math.min(strength, 4);
}

function updateStrengthMeter(strength) {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    strengthFill.setAttribute('data-strength', strength);
    
    const texts = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    strengthText.textContent = `${texts[strength]}`;
}