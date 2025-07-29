// Registration form validation and functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input, select');
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    function validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous styling
        field.classList.remove('error', 'success');
        
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    errorMessage = `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`;
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = `${fieldName === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
                    isValid = false;
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    errorMessage = 'Name can only contain letters and spaces';
                    isValid = false;
                }
                break;
                
            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'phone':
                if (!value) {
                    errorMessage = 'Phone number is required';
                    isValid = false;
                } else if (!isValidPhone(value)) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
                break;
                
            case 'password':
                if (!value) {
                    errorMessage = 'Password is required';
                    isValid = false;
                } else if (!isValidPassword(value)) {
                    errorMessage = 'Password must meet all requirements';
                    isValid = false;
                }
                // Also validate confirm password if it has a value
                const confirmPassword = document.getElementById('confirmPassword');
                if (confirmPassword.value) {
                    validateField(confirmPassword);
                }
                break;
                
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (!value) {
                    errorMessage = 'Please confirm your password';
                    isValid = false;
                } else if (value !== password) {
                    errorMessage = 'Passwords do not match';
                    isValid = false;
                }
                break;
                
            case 'dateOfBirth':
                if (!value) {
                    errorMessage = 'Date of birth is required';
                    isValid = false;
                } else if (!isValidAge(value)) {
                    errorMessage = 'You must be at least 13 years old';
                    isValid = false;
                }
                break;
                
            case 'gender':
                if (!value) {
                    errorMessage = 'Please select your gender';
                    isValid = false;
                }
                break;
                
            case 'terms':
                if (!field.checked) {
                    errorMessage = 'You must agree to the terms and conditions';
                    isValid = false;
                }
                break;
        }
        
        // Update UI
        const errorElement = document.getElementById(fieldName + 'Error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        
        if (isValid) {
            field.classList.add('success');
        } else {
            field.classList.add('error');
        }
        
        return isValid;
    }
    
    function clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        // Remove all non-digits
        const cleanPhone = phone.replace(/\D/g, '');
        // Check if it's 10 digits (basic validation)
        return cleanPhone.length >= 10;
    }
    
    function isValidPassword(password) {
        // Password must be at least 8 characters, contain uppercase, lowercase, number, and special character
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
    }
    
    function isValidAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 13;
        }
        
        return age >= 13;
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        let isFormValid = true;
        
        // Validate all fields
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Show success message
                showSuccessMessage();
                
                // Reset form
                form.reset();
                inputs.forEach(input => {
                    input.classList.remove('success', 'error');
                    const errorElement = document.getElementById(input.name + 'Error');
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                });
            }, 2000);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    }
    
    function showSuccessMessage() {
        // Create success message if it doesn't exist
        let successMessage = document.querySelector('.success-message');
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            form.insertBefore(successMessage, form.firstChild);
        }
        
        successMessage.innerHTML = `
            <strong>Success!</strong> Your account has been created successfully. 
            You will receive a confirmation email shortly.
        `;
        successMessage.style.display = 'block';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
        
        // Scroll to top
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Add password strength indicator
    const passwordField = document.getElementById('password');
    passwordField.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
    
    function updatePasswordStrength(password) {
        const requirements = document.querySelector('.password-requirements small');
        if (!password) {
            requirements.style.color = '#666';
            return;
        }
        
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const score = [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
        
        if (score <= 2) {
            requirements.style.color = '#e74c3c';
        } else if (score <= 4) {
            requirements.style.color = '#f39c12';
        } else {
            requirements.style.color = '#27ae60';
        }
    }
});