// Global variables
let selectedDomain = null;
let isLoggedIn = false;
let currentUser = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize all components
    initNavbar();
    initSmoothScrolling();
    initAnimations();
    initDomainSelection();
    initUploadFunctionality();
    initMobileMenu();
    initAuthSystem();
    initMLProcessing();
    checkAuthStatus();
}

// Navbar scroll effect
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to section function (used by buttons)
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Animation on Scroll (AOS) implementation
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Upload functionality
function initUploadFunctionality() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadStatus = document.getElementById('uploadStatus');
    const fileName = document.getElementById('fileName');

    // Click to upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            handleFileUpload(file);
        }
    });

    function handleFileUpload(file) {
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            showNotification('Please upload a PDF, DOC, or DOCX file.', 'error');
            return;
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            showNotification('File size must be less than 10MB.', 'error');
            return;
        }

        // Simulate file upload
        simulateUpload(file);
    }

    function simulateUpload(file) {
        // Check if user is logged in
        if (!isLoggedIn) {
            showNotification('Please login to upload your resume', 'error');
            openLoginModal();
            return;
        }

        // Check if domain is selected
        if (!selectedDomain) {
            showNotification('Please select a domain first', 'error');
            return;
        }

        // Hide upload area and show loading
        uploadArea.style.display = 'none';
        
        // Create loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'upload-loading';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Uploading your resume...</p>
        `;
        uploadArea.parentNode.insertBefore(loadingDiv, uploadArea.nextSibling);

        // Add loading styles
        if (!document.querySelector('#upload-loading-styles')) {
            const style = document.createElement('style');
            style.id = 'upload-loading-styles';
            style.textContent = `
                .upload-loading {
                    text-align: center;
                    padding: 40px;
                    background: rgba(102, 126, 234, 0.05);
                    border-radius: 15px;
                    margin-top: 20px;
                }
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f4f6;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .upload-loading p {
                    color: #667eea;
                    font-weight: 500;
                }
            `;
            document.head.appendChild(style);
        }

        // Simulate upload delay
        setTimeout(() => {
            // Remove loading
            loadingDiv.remove();
            
            // Show success status
            fileName.textContent = file.name;
            uploadStatus.style.display = 'block';
            
            // Show upload success notification
            showNotification('Resume uploaded successfully! 🎉', 'success');
            
            // Start ML processing
            setTimeout(() => {
                startMLProcessing(file, selectedDomain);
            }, 1000);
        }, 2000);
    }

    function showAIResults(file) {
        // Create results modal or section
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'ai-results';
        resultsDiv.innerHTML = `
            <div class="results-header">
                <h3>🤖 AI Analysis Results</h3>
                <button class="close-results" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="results-content">
                <div class="result-item">
                    <span class="result-label">Overall Score:</span>
                    <span class="result-value score-high">87/100</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Top Skills Detected:</span>
                    <span class="result-value">JavaScript, Python, React, Node.js</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Recommended Positions:</span>
                    <span class="result-value">Frontend Developer, Full Stack Developer</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Improvement Areas:</span>
                    <span class="result-value">Add more quantified achievements</span>
                </div>
            </div>
            <div class="results-actions">
                <button class="btn btn-primary btn-sm">View Full Report</button>
                <button class="btn btn-secondary btn-sm">Find Jobs</button>
            </div>
        `;

        // Add results styles
        const resultStyle = document.createElement('style');
        resultStyle.textContent = `
            .ai-results {
                background: white;
                border-radius: 15px;
                padding: 30px;
                margin-top: 30px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                border: 2px solid #667eea;
                animation: slideInUp 0.5s ease;
            }
            .results-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f3f4f6;
            }
            .results-header h3 {
                margin: 0;
                color: #1a1a1a;
                font-size: 22px;
            }
            .close-results {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6b7280;
                padding: 5px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .close-results:hover {
                background: #f3f4f6;
                color: #1a1a1a;
            }
            .result-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #f3f4f6;
            }
            .result-item:last-child {
                border-bottom: none;
            }
            .result-label {
                font-weight: 600;
                color: #374151;
            }
            .result-value {
                color: #6b7280;
                text-align: right;
                max-width: 60%;
            }
            .score-high {
                color: #10b981;
                font-weight: 700;
                font-size: 18px;
            }
            .results-actions {
                display: flex;
                gap: 15px;
                margin-top: 25px;
                justify-content: center;
            }
            .btn-sm {
                padding: 10px 20px;
                font-size: 14px;
            }
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(resultStyle);

        uploadStatus.appendChild(resultsDiv);
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                border-left: 4px solid #667eea;
                min-width: 300px;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            .notification-success {
                border-left-color: #10b981;
            }
            .notification-error {
                border-left-color: #ef4444;
            }
            .notification-content {
                display: flex;
                align-items: center;
                padding: 15px 20px;
                gap: 12px;
            }
            .notification-icon {
                font-size: 20px;
                flex-shrink: 0;
            }
            .notification-message {
                flex: 1;
                font-size: 14px;
                color: #374151;
                line-height: 1.4;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #6b7280;
                padding: 5px;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .notification-close:hover {
                background: #f3f4f6;
                color: #1a1a1a;
            }
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return '✓';
        case 'error':
            return '⚠️';
        case 'info':
        default:
            return 'ℹ️';
    }
}

// Add scroll reveal for hero elements
function revealHeroElements() {
    const heroElements = document.querySelectorAll('.animate-text, .hero-subtitle, .hero-buttons');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Parallax effect for hero background
function initParallax() {
    const blobs = document.querySelectorAll('.gradient-blob');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        blobs.forEach((blob, index) => {
            const multiplier = index === 0 ? 0.3 : 0.6;
            blob.style.transform = `translateY(${rate * multiplier}px)`;
        });
    });
}

// Initialize parallax on load
document.addEventListener('DOMContentLoaded', function() {
    initParallax();
});

// Add typing effect to hero title
function initTypingEffect() {
    const titleElements = document.querySelectorAll('.animate-text');
    
    titleElements.forEach((element, index) => {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        setTimeout(() => {
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                element.textContent += text[charIndex];
                charIndex++;
                
                if (charIndex >= text.length) {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, index * 1000);
    });
}

// Enhanced mobile menu styles
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            right: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 50px;
            transition: right 0.3s ease;
            gap: 30px;
        }
        
        .nav-menu.active {
            right: 0;
        }
        
        .nav-link {
            font-size: 18px;
            padding: 15px 30px;
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        
        .nav-link:hover {
            background: rgba(102, 126, 234, 0.1);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;

// Add mobile menu styles
const mobileStyle = document.createElement('style');
mobileStyle.textContent = mobileMenuStyles;
document.head.appendChild(mobileStyle);

// Smooth scroll performance optimization
let ticking = false;

function updateScrollEffects() {
    // Update navbar
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

// Replace the scroll event listener with optimized version
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
});

// Add intersection observer for better performance
const createObserver = (callback, options = {}) => {
    const defaultOptions = {
        rootMargin: '0px',
        threshold: 0.1
    };
    
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Domain Selection Functionality
function initDomainSelection() {
    const domainCards = document.querySelectorAll('.domain-card');
    const proceedBtn = document.getElementById('proceedBtn');

    domainCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            domainCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Store selected domain
            selectedDomain = this.dataset.domain;
            
            // Enable proceed button
            proceedBtn.disabled = false;
            proceedBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            proceedBtn.style.cursor = 'pointer';
            
            // Show selection confirmation
            showNotification(`${this.querySelector('h4').textContent} domain selected!`, 'success');
        });
    });
}

function proceedToUpload() {
    if (!selectedDomain) {
        showNotification('Please select a domain first!', 'error');
        return;
    }

    // Check if user is logged in
    if (!isLoggedIn) {
        showNotification('Please login to continue', 'info');
        openLoginModal();
        return;
    }

    // Hide domain selection and show upload area
    document.getElementById('domainSelection').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
    
    // Show selected domain in upload area
    const selectedDomainDiv = document.getElementById('selectedDomain');
    const domainName = document.querySelector(`[data-domain="${selectedDomain}"] h4`).textContent;
    const domainIcon = document.querySelector(`[data-domain="${selectedDomain}"] .domain-icon`).textContent;
    
    selectedDomainDiv.innerHTML = `
        <div class="selected-domain-info">
            <span class="selected-domain-icon">${domainIcon}</span>
            <span class="selected-domain-text">Target Domain: ${domainName}</span>
            <button class="change-domain-btn" onclick="changeDomain()">Change</button>
        </div>
    `;
    selectedDomainDiv.classList.add('show');
    
    // Add styles for selected domain display
    if (!document.querySelector('#domain-display-styles')) {
        const style = document.createElement('style');
        style.id = 'domain-display-styles';
        style.textContent = `
            .selected-domain-info {
                display: flex;
                align-items: center;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }
            .selected-domain-icon {
                font-size: 20px;
            }
            .selected-domain-text {
                color: #667eea;
                font-weight: 600;
                font-size: 16px;
            }
            .change-domain-btn {
                background: none;
                border: 1px solid #667eea;
                color: #667eea;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .change-domain-btn:hover {
                background: #667eea;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }
}

function changeDomain() {
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('domainSelection').style.display = 'block';
    selectedDomain = null;
    document.getElementById('proceedBtn').disabled = true;
    document.querySelectorAll('.domain-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// Authentication System
function initAuthSystem() {
    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Signup form submission
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // Password strength checker
    document.getElementById('signupPassword').addEventListener('input', checkPasswordStrength);
    
    // Password confirmation checker
    document.getElementById('confirmPassword').addEventListener('input', checkPasswordMatch);
}

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    closeModal('loginModal');
    openSignupModal();
}

function switchToLogin() {
    closeModal('signupModal');
    openLoginModal();
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    // Update icon
    const toggle = input.parentNode.querySelector('.password-toggle');
    toggle.textContent = type === 'password' ? '👁️' : '🙈';
}

function checkPasswordStrength(event) {
    const password = event.target.value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    strengthIndicator.className = 'password-strength';
    if (strength >= 3) {
        strengthIndicator.classList.add('strong');
    } else if (strength >= 2) {
        strengthIndicator.classList.add('medium');
    } else if (strength >= 1) {
        strengthIndicator.classList.add('weak');
    }
}

function checkPasswordMatch() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmInput = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmInput.style.borderColor = '#ef4444';
        confirmInput.style.background = 'rgba(239, 68, 68, 0.1)';
    } else {
        confirmInput.style.borderColor = '#10b981';
        confirmInput.style.background = 'rgba(16, 185, 129, 0.1)';
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        remember: document.getElementById('rememberMe').checked
    };
    
    try {
        // Simulate API call
        showNotification('Logging in...', 'info');
        
        // Simulate login process
        await simulateLogin(loginData);
        
        // Success
        isLoggedIn = true;
        currentUser = {
            email: loginData.email,
            name: loginData.email.split('@')[0],
            id: Math.random().toString(36).substring(7)
        };
        
        localStorage.setItem('upnext_user', JSON.stringify(currentUser));
        localStorage.setItem('upnext_logged_in', 'true');
        
        closeModal('loginModal');
        updateUIForLoggedInUser();
        showNotification('Welcome back! 🎉', 'success');
        
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const signupData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    };
    
    // Validation
    if (signupData.password !== signupData.confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (!document.getElementById('agreeTerms').checked) {
        showNotification('Please agree to the terms and conditions', 'error');
        return;
    }
    
    try {
        // Simulate API call
        showNotification('Creating your account...', 'info');
        
        // Simulate signup process
        await simulateSignup(signupData);
        
        // Success
        isLoggedIn = true;
        currentUser = {
            email: signupData.email,
            name: signupData.name,
            id: Math.random().toString(36).substring(7)
        };
        
        localStorage.setItem('upnext_user', JSON.stringify(currentUser));
        localStorage.setItem('upnext_logged_in', 'true');
        
        closeModal('signupModal');
        updateUIForLoggedInUser();
        showNotification('Account created successfully! 🚀', 'success');
        
    } catch (error) {
        showNotification('Signup failed. Please try again.', 'error');
    }
}

async function simulateLogin(loginData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate storing in SQL database (localStorage for demo)
    const users = JSON.parse(localStorage.getItem('upnext_users') || '[]');
    const user = users.find(u => u.email === loginData.email);
    
    if (!user) {
        throw new Error('User not found');
    }
    
    // In real implementation, you would hash and compare passwords
    if (user.password !== loginData.password) {
        throw new Error('Invalid password');
    }
    
    return user;
}

async function simulateSignup(signupData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate storing in SQL database (localStorage for demo)
    const users = JSON.parse(localStorage.getItem('upnext_users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === signupData.email)) {
        throw new Error('User already exists');
    }
    
    // Add new user
    const newUser = {
        id: Math.random().toString(36).substring(7),
        name: signupData.name,
        email: signupData.email,
        password: signupData.password, // In real implementation, hash this
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('upnext_users', JSON.stringify(users));
    
    return newUser;
}

function checkAuthStatus() {
    const storedUser = localStorage.getItem('upnext_user');
    const loggedInStatus = localStorage.getItem('upnext_logged_in');
    
    if (storedUser && loggedInStatus === 'true') {
        currentUser = JSON.parse(storedUser);
        isLoggedIn = true;
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    // Hide login/signup buttons and show user menu
    const navMenu = document.querySelector('.nav-menu');
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    
    // Add user menu if not exists
    if (!document.querySelector('.user-menu')) {
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <div class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
            <div class="user-dropdown">
                <div class="user-info">
                    <span class="user-name">${currentUser.name}</span>
                    <span class="user-email">${currentUser.email}</span>
                </div>
                <div class="user-actions">
                    <a href="#" onclick="viewProfile()">Profile</a>
                    <a href="#" onclick="viewHistory()">History</a>
                    <a href="#" onclick="logout()">Logout</a>
                </div>
            </div>
        `;
        navMenu.appendChild(userMenu);
        
        // Add user menu styles
        if (!document.querySelector('#user-menu-styles')) {
            const style = document.createElement('style');
            style.id = 'user-menu-styles';
            style.textContent = `
                .user-menu {
                    position: relative;
                    margin-left: 20px;
                }
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .user-avatar:hover {
                    transform: scale(1.1);
                }
                .user-dropdown {
                    position: absolute;
                    top: 120%;
                    right: 0;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    min-width: 200px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                    z-index: 1000;
                }
                .user-menu:hover .user-dropdown {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                .user-info {
                    padding: 20px;
                    border-bottom: 1px solid #f3f4f6;
                }
                .user-name {
                    display: block;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 5px;
                }
                .user-email {
                    display: block;
                    font-size: 12px;
                    color: #6b7280;
                }
                .user-actions {
                    padding: 10px 0;
                }
                .user-actions a {
                    display: block;
                    padding: 10px 20px;
                    color: #6b7280;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }
                .user-actions a:hover {
                    background: #f9fafb;
                    color: #667eea;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

function logout() {
    localStorage.removeItem('upnext_user');
    localStorage.removeItem('upnext_logged_in');
    currentUser = null;
    isLoggedIn = false;
    
    // Reload page to reset UI
    location.reload();
}

function viewProfile() {
    showNotification('Profile feature coming soon!', 'info');
}

function viewHistory() {
    showNotification('History feature coming soon!', 'info');
}

// ML/NLP Processing System
function initMLProcessing() {
    // This will be called when resume is uploaded
}

function startMLProcessing(file, domain) {
    // Show processing modal
    document.getElementById('mlProcessingModal').style.display = 'block';
    
    // Start the ML pipeline simulation
    simulateMLPipeline(file, domain);
}

async function simulateMLPipeline(file, domain) {
    const steps = [
        { id: 'step1', name: 'Document Parsing', duration: 2000 },
        { id: 'step2', name: 'NLP Analysis', duration: 3000 },
        { id: 'step3', name: 'Job Matching', duration: 2500 },
        { id: 'step4', name: 'Score Generation', duration: 1500 }
    ];
    
    let currentProgress = 0;
    const totalSteps = steps.length;
    
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const stepElement = document.getElementById(step.id);
        const progressBar = document.getElementById('processingProgress');
        const progressText = document.getElementById('processingText');
        
        // Update current step
        stepElement.classList.add('active');
        stepElement.querySelector('.step-status').innerHTML = '⟳';
        stepElement.querySelector('.step-status').classList.add('loading');
        
        // Update progress text
        progressText.textContent = `${step.name}... Using advanced ${getMLTechnique(i)} algorithms`;
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, step.duration));
        
        // Mark step as completed
        stepElement.classList.remove('active');
        stepElement.classList.add('completed');
        stepElement.querySelector('.step-status').innerHTML = '✓';
        stepElement.querySelector('.step-status').classList.remove('loading');
        
        // Update progress bar
        currentProgress = ((i + 1) / totalSteps) * 100;
        progressBar.style.width = `${currentProgress}%`;
        
        // Move to next step
        if (i < steps.length - 1) {
            const nextStep = document.getElementById(steps[i + 1].id);
            nextStep.classList.add('active');
        }
    }
    
    // Processing complete
    progressText.textContent = 'AI analysis complete! Generating your personalized report...';
    
    setTimeout(() => {
        closeModal('mlProcessingModal');
        showAdvancedResults(file, domain);
    }, 1000);
}

function getMLTechnique(stepIndex) {
    const techniques = [
        'OCR and Document Structure Recognition',
        'BERT-based Named Entity Recognition and Skill Extraction',
        'Semantic Similarity and Vector Space Matching',
        'Multi-criteria Decision Analysis and Fuzzy Logic'
    ];
    return techniques[stepIndex];
}

function showAdvancedResults(file, domain) {
    // Generate realistic AI results based on domain
    const results = generateAIResults(domain);
    
    // Create advanced results modal
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'ai-results advanced-results';
    resultsDiv.innerHTML = `
        <div class="results-header">
            <h3>🎯 AI Career Intelligence Report</h3>
            <button class="close-results" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="results-dashboard">
            <div class="score-card">
                <div class="score-circle">
                    <div class="score-value">${results.overallScore}</div>
                    <div class="score-label">Overall Score</div>
                </div>
                <div class="score-breakdown">
                    <div class="skill-bar">
                        <span>Technical Skills</span>
                        <div class="bar"><div class="fill" style="width: ${results.technicalScore}%"></div></div>
                        <span>${results.technicalScore}%</span>
                    </div>
                    <div class="skill-bar">
                        <span>Experience Level</span>
                        <div class="bar"><div class="fill" style="width: ${results.experienceScore}%"></div></div>
                        <span>${results.experienceScore}%</span>
                    </div>
                    <div class="skill-bar">
                        <span>Domain Relevance</span>
                        <div class="bar"><div class="fill" style="width: ${results.domainScore}%"></div></div>
                        <span>${results.domainScore}%</span>
                    </div>
                </div>
            </div>
            
            <div class="insights-grid">
                <div class="insight-card">
                    <h4>🔍 Key Skills Detected</h4>
                    <div class="skills-tags">
                        ${results.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                
                <div class="insight-card">
                    <h4>💼 Top Job Matches</h4>
                    <div class="job-matches">
                        ${results.jobMatches.map(job => `
                            <div class="job-match">
                                <span class="job-title">${job.title}</span>
                                <span class="match-score">${job.match}% match</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="insight-card">
                    <h4>📈 Career Growth Path</h4>
                    <div class="career-path">
                        ${results.careerPath.map((role, index) => `
                            <div class="career-step ${index === 0 ? 'current' : ''}">
                                <span class="step-number">${index + 1}</span>
                                <span class="step-role">${role}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="insight-card">
                    <h4>💡 AI Recommendations</h4>
                    <ul class="recommendations">
                        ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
        <div class="results-actions">
            <button class="btn btn-primary" onclick="downloadReport()">📄 Download Full Report</button>
            <button class="btn btn-secondary" onclick="findJobs()">🔍 Find Jobs</button>
            <button class="btn btn-secondary" onclick="improveResume()">✨ Improve Resume</button>
        </div>
    `;
    
    // Add advanced results styles
    if (!document.querySelector('#advanced-results-styles')) {
        const style = document.createElement('style');
        style.id = 'advanced-results-styles';
        style.textContent = `
            .advanced-results {
                max-width: 900px;
                margin: 20px auto;
            }
            .results-dashboard {
                padding: 30px;
            }
            .score-card {
                display: grid;
                grid-template-columns: 200px 1fr;
                gap: 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 15px;
                margin-bottom: 30px;
            }
            .score-circle {
                text-align: center;
            }
            .score-value {
                font-size: 48px;
                font-weight: 700;
                margin-bottom: 5px;
            }
            .score-label {
                font-size: 14px;
                opacity: 0.9;
            }
            .skill-bar {
                display: grid;
                grid-template-columns: 1fr 2fr auto;
                gap: 15px;
                align-items: center;
                margin-bottom: 15px;
            }
            .skill-bar span {
                font-size: 14px;
            }
            .bar {
                height: 8px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                overflow: hidden;
            }
            .bar .fill {
                height: 100%;
                background: white;
                border-radius: 4px;
                transition: width 1s ease;
            }
            .insights-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 25px;
            }
            .insight-card {
                background: #f9fafb;
                padding: 25px;
                border-radius: 15px;
                border: 1px solid #e5e7eb;
            }
            .insight-card h4 {
                margin: 0 0 20px 0;
                color: #1a1a1a;
                font-size: 18px;
            }
            .skills-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .skill-tag {
                background: #667eea;
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }
            .job-match {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #e5e7eb;
            }
            .job-match:last-child {
                border-bottom: none;
            }
            .job-title {
                font-weight: 600;
                color: #1a1a1a;
            }
            .match-score {
                color: #10b981;
                font-weight: 600;
                font-size: 14px;
            }
            .career-path {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .career-step {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 10px;
                border-radius: 10px;
                transition: all 0.3s ease;
            }
            .career-step.current {
                background: rgba(102, 126, 234, 0.1);
                border: 1px solid #667eea;
            }
            .step-number {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: #667eea;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 14px;
            }
            .step-role {
                font-weight: 500;
                color: #1a1a1a;
            }
            .recommendations {
                margin: 0;
                padding: 0;
                list-style: none;
            }
            .recommendations li {
                padding: 8px 0;
                color: #6b7280;
                position: relative;
                padding-left: 20px;
            }
            .recommendations li::before {
                content: '•';
                color: #667eea;
                font-weight: bold;
                position: absolute;
                left: 0;
            }
            @media (max-width: 768px) {
                .score-card {
                    grid-template-columns: 1fr;
                    text-align: center;
                }
                .insights-grid {
                    grid-template-columns: 1fr;
                }
                .skill-bar {
                    grid-template-columns: 1fr;
                    gap: 8px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.getElementById('uploadStatus').appendChild(resultsDiv);
}

function generateAIResults(domain) {
    const domainData = {
        technology: {
            skills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Git', 'SQL'],
            jobMatches: [
                { title: 'Senior Frontend Developer', match: 92 },
                { title: 'Full Stack Engineer', match: 88 },
                { title: 'Software Architect', match: 85 }
            ],
            careerPath: ['Senior Developer', 'Tech Lead', 'Engineering Manager', 'VP Engineering'],
            recommendations: [
                'Add more cloud computing certifications',
                'Include quantified achievements in project descriptions',
                'Consider learning TypeScript for better job matches'
            ]
        },
        healthcare: {
            skills: ['Clinical Research', 'Data Analysis', 'Regulatory Affairs', 'Medical Writing'],
            jobMatches: [
                { title: 'Clinical Data Manager', match: 89 },
                { title: 'Regulatory Affairs Specialist', match: 84 },
                { title: 'Medical Writer', match: 81 }
            ],
            careerPath: ['Senior Specialist', 'Team Lead', 'Department Manager', 'Director'],
            recommendations: [
                'Highlight experience with FDA regulations',
                'Add more statistical analysis skills',
                'Consider GCP certification'
            ]
        },
        finance: {
            skills: ['Financial Analysis', 'Risk Management', 'Excel', 'Bloomberg', 'Python'],
            jobMatches: [
                { title: 'Senior Financial Analyst', match: 91 },
                { title: 'Portfolio Manager', match: 87 },
                { title: 'Risk Manager', match: 83 }
            ],
            careerPath: ['Senior Analyst', 'Vice President', 'Director', 'Managing Director'],
            recommendations: [
                'Add CFA or FRM certifications',
                'Include more quantitative analysis examples',
                'Highlight client relationship management'
            ]
        }
    };
    
    const data = domainData[domain] || domainData.technology;
    
    return {
        overallScore: Math.floor(Math.random() * 15) + 80, // 80-95
        technicalScore: Math.floor(Math.random() * 20) + 75, // 75-95
        experienceScore: Math.floor(Math.random() * 25) + 70, // 70-95
        domainScore: Math.floor(Math.random() * 20) + 80, // 80-100
        ...data
    };
}

function downloadReport() {
    showNotification('Generating detailed PDF report...', 'info');
    // Simulate report generation
    setTimeout(() => {
        showNotification('Report downloaded successfully! 📄', 'success');
    }, 2000);
}

function findJobs() {
    showNotification('Redirecting to job search with your profile...', 'info');
    // In real implementation, this would redirect to job search page
}

function improveResume() {
    showNotification('Opening resume improvement suggestions...', 'info');
    // In real implementation, this would show detailed improvement suggestions
}

// Career Growth Predictor
(function initCareerGrowthPredictor(){
  const levelChips = document.querySelectorAll('#growth .chip');
  const yearsInput = document.getElementById('yearsInput');
  const yearsValue = document.getElementById('yearsValue');
  const domainSelect = document.getElementById('domainSelect');
  const predictBtn = document.getElementById('predictBtn');
  const growthVisual = document.getElementById('growthVisual');
  const growthInsights = document.getElementById('growthInsights');
  let currentLevel = 'mid';
  if(!yearsInput || !predictBtn) return; // section may not be rendered yet

  levelChips.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      levelChips.forEach(c=>c.classList.remove('chip-active'));
      chip.classList.add('chip-active');
      currentLevel = chip.dataset.level;
    });
  });

  yearsInput.addEventListener('input', ()=>{
    yearsValue.textContent = yearsInput.value;
  });

  predictBtn.addEventListener('click', ()=>{
    const years = parseInt(yearsInput.value,10);
    const domain = domainSelect.value;
    const plan = computeGrowthPlan({ level: currentLevel, years, domain, skills: getDetectedSkills() });
    renderGrowthTimeline(plan, growthVisual);
    renderGrowthInsights(plan, growthInsights);
    showNotification('Career growth path predicted! 📈', 'success');
  });
})();

function getDetectedSkills(){
  // Use last AI analysis if present, else fallback generic
  try {
    const last = document.querySelector('.advanced-results .skills-tags');
    if(last){
      return Array.from(last.querySelectorAll('.skill-tag')).map(s=>s.textContent.trim());
    }
  } catch(_){}
  return ['JavaScript','Python','SQL','Git'];
}

function computeGrowthPlan({ level, years, domain, skills }){
  const ladderByDomain = {
    technology: ['Intern','Junior Developer','Developer','Senior Developer','Tech Lead','Engineering Manager','Director of Engineering'],
    finance: ['Analyst','Senior Analyst','Associate','Vice President','Director','Executive Director'],
    healthcare: ['Associate','Senior Associate','Team Lead','Manager','Director']
  };
  const ladder = ladderByDomain[domain] || ladderByDomain.technology;

  const levelIndexMap = { student:0, junior:1, mid:2, senior:3, lead:4 };
  const startIdx = Math.min(levelIndexMap[level] ?? 2, ladder.length-2);

  const hasLeadership = skills.some(s=>/lead|manage|owner|architect/i.test(s));
  const techDepth = skills.filter(s=>/(react|node|aws|docker|ml|nlp|data|python|typescript)/i.test(s)).length;

  const steps = [];
  let etaMonths = Math.max(6, 24 - years);
  for(let i = startIdx; i < Math.min(startIdx+3, ladder.length); i++){
    const role = ladder[i+1] || ladder[i];
    const gaps = suggestGaps(role, domain, skills);
    const eta = Math.max(3, Math.round(etaMonths + (gaps.length*2) - (hasLeadership?3:0) - Math.min(3, techDepth)));
    steps.push({ role, etaMonths: eta, gaps });
    etaMonths += 6;
  }

  const probability = Math.min(95, 70 + techDepth*3 + (hasLeadership?10:0) - (steps[0]?.gaps.length||0));
  return { domain, currentLevel: level, years, steps, probability: Math.max(60, probability) };
}

function suggestGaps(role, domain, skills){
  const mustHaveByRole = {
    'Senior Developer': ['System Design','Performance Tuning','TypeScript','Testing Strategy'],
    'Tech Lead': ['Architecture','Mentorship','Cloud (AWS/GCP)','CI/CD'],
    'Engineering Manager': ['People Management','Project Planning','Hiring','OKRs'],
    'Analyst': ['Excel Modeling','SQL','Statistics'],
    'Senior Analyst': ['Financial Modeling','Python','Dashboards'],
    'Vice President': ['Stakeholder Mgt','Risk Strategy','Regulatory'],
    'Associate': ['Clinical Protocols','Data Quality','Regulatory Basics'],
    'Team Lead': ['Team Coordination','Compliance','Reporting'],
    'Manager': ['Budgeting','Hiring','Process Design']
  };
  const wanted = mustHaveByRole[role] || ['Communication','Problem Solving'];
  const owned = new Set(skills.map(s=>s.toLowerCase()));
  return wanted.filter(w=>!Array.from(owned).some(s=>s.includes(w.toLowerCase())));
}

function renderGrowthTimeline(plan, container){
  container.innerHTML = `
    <div class="timeline-growth">
      ${plan.steps.map(s=>`
        <div class="growth-node">
          <div class="node-header">
            <div class="node-title">${s.role}</div>
            <div class="node-eta">ETA ~ ${s.etaMonths} months</div>
          </div>
          <div class="node-gaps">
            ${s.gaps.map(g=>`<span class="gap-tag">${g}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderGrowthInsights(plan, container){
  container.innerHTML = `
    <div class="insight-tile">
      <h4>Transition Probability</h4>
      <div class="value">${plan.probability}%</div>
    </div>
    <div class="insight-tile">
      <h4>Steps to Next Role</h4>
      <div class="value">${plan.steps.length}</div>
    </div>
    <div class="insight-tile">
      <h4>Average ETA</h4>
      <div class="value">${Math.round(plan.steps.reduce((a,s)=>a+s.etaMonths,0)/plan.steps.length)} mo</div>
    </div>
  `;
}

// Theme toggle (dark/light mode)
(function initThemeToggle(){
  const toggleBtn = document.getElementById('themeToggle');
  if(!toggleBtn) return;
  const stored = localStorage.getItem('upnext_theme');
  if(stored === 'dark') document.body.classList.add('dark');
  updateIcon();
  toggleBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('dark');
    const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('upnext_theme', mode);
    updateIcon();
  });
  function updateIcon(){
    toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  }
})();

// AI Chat Widget
(function initChatWidget(){
  const fab = document.getElementById('chatFab');
  const widget = document.getElementById('chatWidget');
  const closeBtn = document.getElementById('chatClose');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const messagesEl = document.getElementById('chatMessages');
  if(!fab || !widget) return;

  fab.addEventListener('click', ()=>{
    widget.classList.add('active');
    input?.focus();
    if(messagesEl.childElementCount === 0){
      appendSystemMsg('Hi! I am your AI career assistant. Ask me about roles, skills, or resume tips.');
    }
  });
  closeBtn?.addEventListener('click', ()=>{
    widget.classList.remove('active');
  });
  sendBtn?.addEventListener('click', sendMessage);
  input?.addEventListener('keydown', e=>{ if(e.key==='Enter'){ sendMessage(); }});

  function sendMessage(){
    const text = input.value.trim();
    if(!text) return;
    appendUserMsg(text);
    input.value='';
    simulateAIResponse(text);
  }

  function appendUserMsg(t){ appendMsg(t,'user'); }
  function appendSystemMsg(t){ appendMsg(t,'system'); }
  function appendAIMsg(t){ appendMsg(t,'ai'); }
  function appendMsg(content,type){
    const div = document.createElement('div');
    div.className = 'msg '+type;
    div.textContent = content;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function simulateAIResponse(userText){
    // Very simple heuristic placeholder
    const lower = userText.toLowerCase();
    let reply;
    if(/resume|cv/.test(lower)) reply = 'Consider quantifying achievements (e.g., Reduced processing time by 30%). Want a quick template?';
    else if(/skill|learn|improve/.test(lower)) reply = 'Focus on 2-3 in-demand skills: Cloud (AWS), TypeScript, and System Design. Practice via small projects.';
    else if(/job|role|position/.test(lower)) reply = 'Based on a mid-level profile, roles like Senior Developer or Full Stack Engineer have strong match.';
    else if(/hello|hi|hey/.test(lower)) reply = 'Hello! How can I help with your career today?';
    else reply = 'I am processing your query. For deeper insights, integrate the backend API later.';
    setTimeout(()=> appendAIMsg(reply), 600);
  }
})();

// Export functions for global access
window.scrollToSection = scrollToSection;
window.showNotification = showNotification;
window.proceedToUpload = proceedToUpload;
window.changeDomain = changeDomain;
window.openLoginModal = openLoginModal;
window.openSignupModal = openSignupModal;
window.closeModal = closeModal;
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.togglePassword = togglePassword;
window.logout = logout;
window.viewProfile = viewProfile;
window.viewHistory = viewHistory;
window.downloadReport = downloadReport;
window.findJobs = findJobs;
window.improveResume = improveResume;
