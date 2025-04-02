// DOM elements
const userTypeOptions = document.querySelectorAll('.user-type-option');
const studentFields = document.querySelector('.student-fields');
const organizerFields = document.querySelector('.organizer-fields');
const form = document.getElementById('registration-form');
const statusMessage = document.getElementById('status-message');
const pinInput = document.getElementById('pin');
const confirmPinInput = document.getElementById('confirm-pin');

// Default user type
let currentUserType = 'student';
studentFields.style.display = 'block';
organizerFields.style.display = 'none';

// User type switching
userTypeOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        userTypeOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        option.classList.add('active');
        
        // Update current user type
        currentUserType = option.getAttribute('data-type');
        
        // Show/hide relevant fields
        if (currentUserType === 'student') {
            studentFields.style.display = 'block';
            organizerFields.style.display = 'none';
        } else {
            studentFields.style.display = 'none';
            organizerFields.style.display = 'block';
        }
    });
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get common form values
    const email = document.getElementById('email').value;
    const pin = pinInput.value;
    const confirmPin = confirmPinInput.value;
    
    // Common validation
    if (!email || !validateEmail(email)) {
        showStatus("Please enter a valid email address.", 'error');
        return;
    }
    
    // Validate PIN match
    if (pin !== confirmPin) {
        showStatus("PINs do not match. Please try again.", 'error');
        return;
    }
    
    // Validate PIN format (4-6 digits)
    if (!/^\d{4,6}$/.test(pin)) {
        showStatus("PIN must be 4-6 digits.", 'error');
        return;
    }
    
    try {
        // Perform type-specific validation before proceeding
        if (currentUserType === 'student') {
            // Validate student-specific fields
            const studentName = document.getElementById('student-name').value;
            const parentName = document.getElementById('parent-name').value;
            const parentPhone = document.getElementById('parent-phone').value;
            
            if (!studentName || !parentName || !parentPhone) {
                showStatus("Please fill in all required student fields.", 'error');
                return;
            }
            
            // Validate phone format
            if (!validatePhone(parentPhone)) {
                showStatus("Please enter a valid parent phone number.", 'error');
                return;
            }
            
        } else if (currentUserType === 'organizer') {
            // Validate organizer-specific fields
            const organizerName = document.getElementById('organizer-name').value;
            const organization = document.getElementById('organization').value;
            const organizerPhone = document.getElementById('organizer-phone').value;
            
            if (!organizerName || !organization || !organizerPhone) {
                showStatus("Please fill in all required organizer fields.", 'error');
                return;
            }
            
            // Validate phone format
            if (!validatePhone(organizerPhone)) {
                showStatus("Please enter a valid phone number.", 'error');
                return;
            }
        }
        
        // Create user with email and password (PIN)
        const userCredential = await auth.createUserWithEmailAndPassword(email, pin);
        const user = userCredential.user;
        
        if (currentUserType === 'student') {
            // Handle student registration
            registerStudent(user);
        } else if (currentUserType === 'organizer') {
            // Handle organizer registration
            registerOrganizer(user);
        }
        
    } catch (error) {
        console.error('Error during registration:', error);
        showStatus(`Registration failed: ${error.message}`, 'error');
    }
});

// Function to register a student
async function registerStudent(user) {
    // Get student-specific data
    const studentData = {
        uid: user.uid,
        email: user.email,
        userType: 'student',
        studentName: document.getElementById('student-name').value,
        parentName: document.getElementById('parent-name').value,
        parentPhone: document.getElementById('parent-phone').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        // Save to students collection only
        await db.collection('students').doc(user.uid).set(studentData);
        
        // Save minimal user type info in users collection for future reference
        await db.collection('users').doc(user.uid).set({
            userType: 'student',
            email: user.email
        });
        
        // Display success message
        showStatus('Student registration successful! Redirecting...', 'success');
        
        // Redirect or other actions
        handleSuccessfulRegistration();
    } catch (error) {
        throw error;
    }
}

// Function to register an organizer
async function registerOrganizer(user) {
    // Get organizer-specific data
    const organizerData = {
        uid: user.uid,
        email: user.email,
        userType: 'organizer',
        organizerName: document.getElementById('organizer-name').value,
        organization: document.getElementById('organization').value,
        phone: document.getElementById('organizer-phone').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        // Save to organizers collection only
        await db.collection('organizers').doc(user.uid).set(organizerData);
        
        // Save minimal user type info in users collection for future reference
        await db.collection('users').doc(user.uid).set({
            userType: 'organizer',
            email: user.email
        });
        
        // Display success message
        showStatus('Organizer registration successful! Redirecting...', 'success');
        
        // Redirect or other actions
        handleSuccessfulRegistration();
    } catch (error) {
        throw error;
    }
}

// Helper function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Helper function to validate phone format
function validatePhone(phone) {
    // Basic validation - adjust based on your phone format requirements
    const re = /^\d{10,15}$/;
    return re.test(phone.replace(/[^\d]/g, ''));
}

// Helper function to show status messages
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type;
    statusMessage.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }
}

// Handle successful registration
function handleSuccessfulRegistration() {
    setTimeout(() => {
        // Redirect to appropriate dashboard based on user type
        if (currentUserType === 'student') {
            // Redirect to student dashboard
            // window.location.href = 'student-dashboard.html';
        } else {
            // Redirect to organizer dashboard
            // window.location.href = 'organizer-dashboard.html';
        }
        form.reset();
    }, 2000);
}
