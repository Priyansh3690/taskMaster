// DOM Elements
const formGetOtp = document.getElementById('getOtp');
const formCheckOtp = document.getElementById('putOtp');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const errorMessage = document.getElementById('error-message');
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = darkModeToggle.querySelector('i');
const otpSpinner = document.getElementById('otpSpinner');
const loginSpinner = document.getElementById('loginSpinner');

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Dark mode functionality
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
  document.body.classList.add('dark-mode');
  darkModeIcon.classList.remove('bi-moon-stars');
  darkModeIcon.classList.add('bi-sun');
}

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  
  if (isDark) {
    darkModeIcon.classList.remove('bi-moon-stars');
    darkModeIcon.classList.add('bi-sun');
  } else {
    darkModeIcon.classList.remove('bi-sun');
    darkModeIcon.classList.add('bi-moon-stars');
  }
});

let userEmail = null; // Store email for OTP verification

// ✅ Utility: Show error in consistent way
function showError(message) {
    errorMessage.innerText = message;
}

// ✅ Utility: Show success popup
function showPopup(title, icon = "success") {
    return Swal.fire({ title, icon, draggable: true });
}

// ✅ Email validation
function validateEmail(email) {
    const errors = [];
    if (!email) {
        errors.push("Email is required");
    } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) errors.push("Enter a valid email address");
        if (email.endsWith("@example.com")) errors.push("Temporary emails are not allowed");
    }
    return errors;
}

// ✅ OTP validation
function validateOtp(otp) {
    const errors = [];
    if (!otp) {
        errors.push("OTP is required");
    } else if (!/^\d{6}$/.test(otp)) {
        errors.push("OTP must be exactly 6 digits");
    }
    return errors;
}

// Real-time validation for email input
emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    const errors = validateEmail(email);
    
    if (errors.length > 0) {
        emailInput.classList.add('is-invalid');
        emailInput.classList.remove('is-valid');
        emailInput.nextElementSibling.textContent = errors[0];
    } else if (email) {
        emailInput.classList.add('is-valid');
        emailInput.classList.remove('is-invalid');
    } else {
        emailInput.classList.remove('is-valid', 'is-invalid');
    }
});

// Real-time validation for OTP input
otpInput.addEventListener('input', () => {
    const otp = otpInput.value.trim();
    const errors = validateOtp(otp);
    
    if (errors.length > 0) {
        otpInput.classList.add('is-invalid');
        otpInput.classList.remove('is-valid');
        otpInput.nextElementSibling.textContent = errors[0];
    } else if (otp) {
        otpInput.classList.add('is-valid');
        otpInput.classList.remove('is-invalid');
    } else {
        otpInput.classList.remove('is-valid', 'is-invalid');
    }
});

// ✅ Handle GET OTP form
formGetOtp.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const errors = validateEmail(email);

    if (errors.length > 0) {
        emailInput.classList.add('is-invalid');
        emailInput.nextElementSibling.textContent = errors[0];
        errorMessage.textContent = errors[0];
        errorMessage.classList.add('animate__animated', 'animate__headShake');
        setTimeout(() => {
            errorMessage.classList.remove('animate__animated', 'animate__headShake');
        }, 1000);
        return;
    }

    // Show loading state
    const submitBtn = formGetOtp.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    otpSpinner.style.display = 'inline-block';
    errorMessage.textContent = '';

    try {
        const res = await fetch("/sendOTP", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (data.success) {
            userEmail = email; // save email for OTP validation
            formGetOtp.classList.add('animate__animated', 'animate__fadeOutLeft');
            
            setTimeout(() => {
                formGetOtp.style.display = 'none';
                formCheckOtp.style.display = 'block';
                formCheckOtp.classList.add('animate__animated', 'animate__fadeInRight');
                otpInput.focus();
            }, 500);
            
            showPopup("OTP sent successfully!");
        } else {
            showError("Error: Unable to send OTP. Try again later.");
        }
    } catch (err) {
        showError("Network error. Please try again.");
    } finally {
        // Reset loading state
        submitBtn.disabled = false;
        otpSpinner.style.display = 'none';
    }
});

// ✅ Handle CHECK OTP form
formCheckOtp.addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = otpInput.value.trim();
    const errors = validateOtp(otp);

    if (errors.length > 0) {
        otpInput.classList.add('is-invalid');
        otpInput.nextElementSibling.textContent = errors[0];
        errorMessage.textContent = errors[0];
        errorMessage.classList.add('animate__animated', 'animate__headShake');
        setTimeout(() => {
            errorMessage.classList.remove('animate__animated', 'animate__headShake');
        }, 1000);
        return;
    }
    
    if (!userEmail) {
        showError("Please request OTP first.");
        return;
    }

    // Show loading state
    const submitBtn = formCheckOtp.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    loginSpinner.style.display = 'inline-block';
    errorMessage.textContent = '';

    try {
        const res = await fetch("/checkOTP", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail, otp: otp })
        });
        const data = await res.json();

        if (data.success) {
            localStorage.setItem("token", JSON.stringify(data.token));
            
            // Show success animation before redirect
            Swal.fire({
                title: 'Login Successful!',
                text: 'Redirecting to dashboard...',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "/d/home";
            });
        } else {
            showError("Invalid OTP. Please try again.");
            otpInput.classList.add('is-invalid');
            otpInput.value = '';
            otpInput.focus();
        }
    } catch (err) {
        showError("Network error. Please try again.");
    } finally {
        // Reset loading state
        submitBtn.disabled = false;
        loginSpinner.style.display = 'none';
    }
});
