// DOM Elements
const form = document.getElementById('signup-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const chatIdInput = document.getElementById('ChatId');
const error_message = document.getElementById('error-message');
const usernameFeedback = document.getElementById('username-feedback');
const emailFeedback = document.getElementById('email-feedback');
const chatIdFeedback = document.getElementById('chatid-feedback');
const infoButton = document.getElementById('info-button');
const closeInfoButton = document.getElementById('close-info');
const telegramInfo = document.getElementById('telegram-info');
const termsCheck = document.getElementById('terms-check');
const submitBtn = document.getElementById('submit-btn');
const spinner = document.getElementById('spinner');

// Initialize tooltips
document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Show/hide Telegram info box
infoButton.addEventListener('click', () => {
    telegramInfo.style.display = 'block';
    telegramInfo.classList.remove('animate__fadeOut');
    telegramInfo.classList.add('animate__fadeIn');
});

closeInfoButton.addEventListener('click', () => {
    telegramInfo.classList.remove('animate__fadeIn');
    telegramInfo.classList.add('animate__fadeOut');
    setTimeout(() => {
        telegramInfo.style.display = 'none';
    }, 500);
});

// Real-time validation
usernameInput.addEventListener('input', validateUsername);
emailInput.addEventListener('input', validateEmail);
chatIdInput.addEventListener('input', validateChatId);

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const chatId = chatIdInput.value.trim();
    
    // Validate all fields
    const usernameValid = validateUsername();
    const emailValid = validateEmail();
    const chatIdValid = validateChatId();
    const termsValid = termsCheck.checked;
    
    // Check if all validations pass
    if (usernameValid && emailValid && chatIdValid && termsValid) {
        // Show loading spinner
        submitBtn.disabled = true;
        spinner.classList.remove('d-none');
        error_message.style.display = 'none';
        
        // Submit form data
        fetch('/register', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, email: email, chatid: chatId }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Show success message before redirecting
                Swal.fire({
                    title: 'Account Created!',
                    text: 'Redirecting to login page...',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = '/';
                });
            } else {
                // Show error message
                error_message.textContent = data.message || "Error: Something went wrong or Email is already registered";
                error_message.style.display = 'block';
                submitBtn.disabled = false;
                spinner.classList.add('d-none');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            error_message.textContent = "Network error. Please try again.";
            error_message.style.display = 'block';
            submitBtn.disabled = false;
            spinner.classList.add('d-none');
        });
    } else {
        // Show general error message if form is invalid
        if (!termsValid) {
            error_message.textContent = "Please agree to the Terms of Service and Privacy Policy";
            error_message.style.display = 'block';
        } else {
            error_message.textContent = "Please fix the errors in the form before submitting";
            error_message.style.display = 'block';
        }
    }
});


// Validation functions with visual feedback
function validateUsername() {
    const username = usernameInput.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Reset styles
    usernameInput.classList.remove('is-invalid', 'is-valid');
    
    // Validation logic
    if (!username) {
        errorMessage = 'Username is required';
        isValid = false;
    } else if (username.length < 3 || username.length > 20) {
        errorMessage = 'Username must be between 3 and 20 characters';
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errorMessage = 'Username can only contain letters, numbers, and underscores';
        isValid = false;
    } else if (/(admin|root|test)/i.test(username)) {
        errorMessage = 'Username contains a reserved word';
        isValid = false;
    }
    
    // Update UI
    if (isValid) {
        usernameInput.classList.add('is-valid');
    } else {
        usernameInput.classList.add('is-invalid');
        usernameFeedback.textContent = errorMessage;
    }
    
    return isValid;
}

function validateEmail() {
    const email = emailInput.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Reset styles
    emailInput.classList.remove('is-invalid', 'is-valid');
    
    // Validation logic
    if (!email) {
        errorMessage = 'Email is required';
        isValid = false;
    } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errorMessage = 'Enter a valid email address';
            isValid = false;
        } else if (email.endsWith('@example.com')) {
            errorMessage = 'Temporary emails are not allowed';
            isValid = false;
        }
    }
    
    // Update UI
    if (isValid) {
        emailInput.classList.add('is-valid');
    } else {
        emailInput.classList.add('is-invalid');
        emailFeedback.textContent = errorMessage;
    }
    
    return isValid;
}

function validateChatId() {
    const chatId = chatIdInput.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Reset styles
    chatIdInput.classList.remove('is-invalid', 'is-valid');
    
    // Validation logic
    if (!chatId) {
        errorMessage = 'ChatID is required';
        isValid = false;
    } else if (!/^\d+$/.test(chatId)) {
        errorMessage = 'ChatID must contain only digits';
        isValid = false;
    } else if (chatId.length < 9 || chatId.length > 10) {
        errorMessage = 'ChatID must be 9-10 digits';
        isValid = false;
    }
    
    // Update UI
    if (isValid) {
        chatIdInput.classList.add('is-valid');
    } else {
        chatIdInput.classList.add('is-invalid');
        chatIdFeedback.textContent = errorMessage;
    }
    
    return isValid;
}

