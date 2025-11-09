const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const error_message = document.getElementById('error-message');

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const inputs = [firstname_input, email_input, password_input, repeat_password_input].filter(Boolean);
inputs.forEach(input => {
    input.addEventListener('input', () => {
        clearErrorStyles();
    });
});

if (form) {
    form.addEventListener('submit', (e) => {
        let errors = getSignupFormErrors(
            firstname_input.value, 
            email_input.value, 
            password_input.value, 
            repeat_password_input.value
        );

        if(errors.length > 0){
            e.preventDefault();
            if (error_message) {
                error_message.innerText = errors.join(". ");
            }
        } else {
            if (error_message) {
                error_message.innerText = "";
            }
            clearErrorStyles();
        }
    });
}

function getSignupFormErrors(firstname, email, password, repeatPassword) {
    let errors = [];
    clearErrorStyles();

    if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse) {
        const recaptchaResponse = grecaptcha.getResponse();
        if(!recaptchaResponse || recaptchaResponse.length === 0) {
            errors.push('Please complete the reCAPTCHA');
        }
    }

    const trimmedFirstname = firstname ? firstname.trim() : '';
    if (!trimmedFirstname) {
        errors.push('Firstname is required');
        setFieldError(firstname_input);
    } else if (trimmedFirstname.length < 2) {
        errors.push('Firstname must be at least 2 characters long');
        setFieldError(firstname_input);
    } else {
        clearFieldError(firstname_input);
    }
    
    const trimmedEmail = email ? email.trim().toLowerCase() : '';
    if (!trimmedEmail) {
        errors.push('Email is required');
        setFieldError(email_input);
    } else if (!isValidEmail(trimmedEmail)) {
        errors.push('Please enter a valid email address');
        setFieldError(email_input);
    } else {
        clearFieldError(email_input);
    }
    
    if (!password) {
        errors.push('Password is required');
        setFieldError(password_input);
    } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
        setFieldError(password_input);
    } else {
        clearFieldError(password_input);
    }
    
    if (!repeatPassword) {
        errors.push('Repeat Password is required');
        setFieldError(repeat_password_input);
    } else if (password !== repeatPassword) {
        errors.push('Passwords do not match');
        setFieldError(repeat_password_input);
    } else {
        clearFieldError(repeat_password_input);
    }

    return errors;
}

function setFieldError(inputElement) {
    if (inputElement && inputElement.parentElement) {
        inputElement.parentElement.classList.add('incorrect');
        if (inputElement.previousElementSibling) {
            inputElement.previousElementSibling.classList.add('incorrect-label');
        }
    }
}

function clearFieldError(inputElement) {
    if (inputElement && inputElement.parentElement) {
        inputElement.parentElement.classList.remove('incorrect');
        if (inputElement.previousElementSibling) {
            inputElement.previousElementSibling.classList.remove('incorrect-label');
        }
    }
}

function clearErrorStyles() {
    const formElements = document.querySelectorAll('form > div');
    formElements.forEach(element => {
        element.classList.remove('incorrect');
        const label = element.querySelector('label');
        if (label) {
            label.classList.remove('incorrect-label');
        }
    });
}

if (password_input) {
    password_input.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        updateStrengthMeter(strength);
    });
}

function checkPasswordStrength(password) {
    if (!password) return 0;
    
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return Math.min(strength, 4);
}

function updateStrengthMeter(strength) {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthFill || !strengthText) return;
    
    strengthFill.setAttribute('data-strength', strength);
    
    const texts = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    strengthText.textContent = `${texts[strength]}`;
}
