// Application State
const AppState = {
    currentUser: null,
    currentExam: null,
    examTimer: null,
    examEndTime: null,
    theme: localStorage.getItem('theme') || 'dark',
    language: localStorage.getItem('language') || 'fr'
};

// Translations
const translations = {
    fr: {
        appTitle: "Outil d'évaluation des étudiants",
        studentFormTitle: "Informations de l'étudiant",
        examCode: "Code d'épreuve",
        lastName: "Nom",
        firstName: "Prénom",
        studentId: "Matricule étudiant",
        gender: "Sélectionner le genre",
        male: "Masculin",
        female: "Féminin",
        accessExam: "Accéder à l'épreuve",
        back: "Retour",
        teacher: "Enseignant",
        student: "Étudiant",
        invalidExamCode: "Code d'épreuve invalide!",
        alreadyTaken: "Vous avez déjà passé cette épreuve avec ce matricule.",
        fillRequired: "Veuillez remplir tous les champs obligatoires.",
        exportPDF: "Exporter PDF",
        exportExcel: "Exporter Excel",
        exportWord: "Exporter Word",
        print: "Imprimer"
    },
    en: {
        appTitle: "Student Evaluation Tool",
        studentFormTitle: "Student Information",
        examCode: "Exam Code",
        lastName: "Last Name",
        firstName: "First Name",
        studentId: "Student ID",
        gender: "Select Gender",
        male: "Male",
        female: "Female",
        accessExam: "Access Exam",
        back: "Back",
        teacher: "Teacher",
        student: "Student",
        invalidExamCode: "Invalid exam code!",
        alreadyTaken: "You have already taken this exam with this ID.",
        fillRequired: "Please fill in all required fields.",
        exportPDF: "Export PDF",
        exportExcel: "Export Excel",
        exportWord: "Export Word",
        print: "Print"
    }
};

// DOM Elements
const DOM = {
    loginSection: document.getElementById('login-section'),
    teacherDashboard: document.getElementById('teacher-dashboard'),
    examFormSection: document.getElementById('exam-form-section'),
    studentExamSection: document.getElementById('student-exam-section'),
    examResultsSection: document.getElementById('exam-results-section')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load data from localStorage
    loadFromLocalStorage();

    // Apply theme and language
    applyTheme();
    applyLanguage();

    // Setup event listeners
    setupEventListeners();

    // Show login section by default
    showSection('login');
    
    // Update static text after initial load
    setTimeout(updateStaticText, 100);
}

// Load data from localStorage
function loadFromLocalStorage() {
    // Load exams
    const examsData = localStorage.getItem('exams');
    if (examsData) {
        window.exams = JSON.parse(examsData);
    } else {
        window.exams = [];
    }
    
    // Load exam results
    const examResultsData = localStorage.getItem('examResults');
    if (examResultsData) {
        window.examResults = JSON.parse(examResultsData);
    } else {
        window.examResults = {};
    }
    
    // Load teacher code (in a real app, this would be more secure)
    const teacherCodeData = localStorage.getItem('teacherCode');
    if (teacherCodeData) {
        window.teacherCode = teacherCodeData;
    } else {
        // Pre-generated teacher code
        window.teacherCode = 'TEACHER123';
        localStorage.setItem('teacherCode', window.teacherCode);
    }
    
    // Load developer code
    const developerCodeData = localStorage.getItem('developerCode');
    if (developerCodeData) {
        window.developerCode = developerCodeData;
    } else {
        // Pre-generated developer code
        window.developerCode = 'DEV789';
        localStorage.setItem('developerCode', window.developerCode);
    }
    
    // Load teacher accounts
    const teacherAccountsData = localStorage.getItem('teacherAccounts');
    if (teacherAccountsData) {
        window.teacherAccounts = JSON.parse(teacherAccountsData);
    } else {
        window.teacherAccounts = [];
    }
    
    // Load teacher information
    const teacherInfoData = localStorage.getItem('teacherInfo');
    if (teacherInfoData) {
        window.teacherInfo = JSON.parse(teacherInfoData);
    } else {
        window.teacherInfo = {};
    }
    
    // Set logo path
    const logoImg = document.querySelector('.app-logo');
    if (logoImg) {
        logoImg.src = 'Logo.png';
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('exams', JSON.stringify(window.exams));
    localStorage.setItem('examResults', JSON.stringify(window.examResults));
    localStorage.setItem('teacherCode', window.teacherCode);
    localStorage.setItem('developerCode', window.developerCode);
    localStorage.setItem('teacherAccounts', JSON.stringify(window.teacherAccounts));
    localStorage.setItem('teacherInfo', JSON.stringify(window.teacherInfo));
    localStorage.setItem('language', AppState.language);
    localStorage.setItem('theme', AppState.theme);
}

// Setup event listeners
function setupEventListeners() {
    // Login section events
    document.getElementById('teacher-login-btn').addEventListener('click', () => {
        document.querySelector('.role-selection').classList.add('hidden');
        // Show the developer code form first
        document.getElementById('developer-code-form').classList.remove('hidden');
    });
    
    document.getElementById('student-login-btn').addEventListener('click', () => {
        document.querySelector('.role-selection').classList.add('hidden');
        document.getElementById('student-login-form').classList.remove('hidden');
    });
    
    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.role-selection').classList.remove('hidden');
            document.getElementById('teacher-login-form').classList.add('hidden');
            document.getElementById('developer-code-form').classList.add('hidden');
            document.getElementById('teacher-account-form').classList.add('hidden');
            document.getElementById('teacher-account-login-form').classList.add('hidden');
            document.getElementById('student-login-form').classList.add('hidden');
            document.getElementById('forgot-password-form').classList.add('hidden');
            document.getElementById('reset-password-form').classList.add('hidden');
        });
    });
    
    // Developer code validation
    document.getElementById('developer-code-btn').addEventListener('click', handleDeveloperCodeValidation);
    
    // Teacher account creation
    document.getElementById('create-teacher-account-btn').addEventListener('click', handleTeacherAccountCreation);
    
    // Teacher account login
    document.getElementById('teacher-account-login-btn').addEventListener('click', handleTeacherAccountLogin);
    
    // Forgot password
    document.getElementById('forgot-password-btn').addEventListener('click', showForgotPasswordForm);
    document.getElementById('send-reset-link-btn').addEventListener('click', handleSendResetLink);
    document.getElementById('reset-password-btn').addEventListener('click', handleResetPassword);
    
    // Create account from login form
    document.getElementById('create-account-from-login-btn').addEventListener('click', showCreateAccountForm);
    
    document.getElementById('teacher-submit-btn').addEventListener('click', handleTeacherLogin);
    document.getElementById('student-submit-btn').addEventListener('click', handleStudentLogin);
    
    // Teacher dashboard events
    document.getElementById('teacher-logout-btn').addEventListener('click', logout);
    
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
            const tabId = tabBtn.getAttribute('data-tab');
            switchTab(tabId);
            // Load results when switching to results tab
            if (tabId === 'results') {
                loadExamSelector();
            }
            // Load teacher info when switching to settings tab
            if (tabId === 'settings') {
                loadTeacherInfo();
            }
        });
    });
    
    // Create exam button
    document.getElementById('create-exam-btn').addEventListener('click', () => {
        showExamForm();
    });
    
    // Cancel exam form
    document.getElementById('cancel-exam-form').addEventListener('click', () => {
        showSection('teacher-dashboard');
    });
    
    // Add question button
    document.getElementById('add-question-btn').addEventListener('click', addQuestionField);
    
    // Exam form submission
    document.getElementById('exam-form').addEventListener('submit', handleExamFormSubmit);
    
    // Submit exam button
    document.getElementById('submit-exam-btn').addEventListener('click', submitExam);
    document.getElementById('print-exam-btn').addEventListener('click', printExam);
    
    // Back to login button
    document.getElementById('back-to-login').addEventListener('click', () => {
        showSection('login');
    });
    
    // Exam selector for results
    document.getElementById('exam-selector').addEventListener('change', displayExamResults);
    
    // Publish results toggle
    document.getElementById('publish-results-toggle').addEventListener('change', togglePublishResults);
    
    // Export buttons
    document.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const format = e.target.getAttribute('data-format');
            if (format) {
                exportResults(format);
            } else if (e.target.id === 'print-results-btn') {
                printResults();
            }
        });
    });
    
    // Teacher info form submission
    document.getElementById('teacher-info-form').addEventListener('submit', handleTeacherInfoSubmit);
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Language toggle
    document.getElementById('language-toggle').addEventListener('click', toggleLanguage);
}

// Show a specific section
function showSection(sectionId) {
    // Hide all sections
    Object.values(DOM).forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the requested section
    switch(sectionId) {
        case 'login':
            DOM.loginSection.classList.remove('hidden');
            break;
        case 'teacher-dashboard':
            DOM.teacherDashboard.classList.remove('hidden');
            loadExamsTable();
            loadExamSelector();
            break;
        case 'exam-form':
            DOM.examFormSection.classList.remove('hidden');
            break;
        case 'student-exam':
            DOM.studentExamSection.classList.remove('hidden');
            break;
        case 'exam-results':
            DOM.examResultsSection.classList.remove('hidden');
            break;
    }
}

// Switch tabs in teacher dashboard
function switchTab(tabId) {
    // Update active tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    
    // Show the selected tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`${tabId}-tab`).classList.remove('hidden');
}

// Handle developer code validation
function handleDeveloperCodeValidation() {
    const code = document.getElementById('developer-code').value;
    
    if (code === window.developerCode) {
        // Valid developer code, show account creation or login options
        document.getElementById('developer-code-form').classList.add('hidden');
        
        // Check if any teacher accounts exist
        if (window.teacherAccounts.length > 0) {
            // Show login form
            document.getElementById('teacher-account-login-form').classList.remove('hidden');
        } else {
            // Show account creation form
            document.getElementById('teacher-account-form').classList.remove('hidden');
        }
    } else {
        alert('Code développeur invalide!');
    }
}

// Show create account form
function showCreateAccountForm() {
    document.getElementById('teacher-account-login-form').classList.add('hidden');
    document.getElementById('teacher-account-form').classList.remove('hidden');
}

// Handle teacher account creation
function handleTeacherAccountCreation() {
    const name = document.getElementById('new-teacher-name').value.trim();
    const email = document.getElementById('new-teacher-email').value.trim();
    const password = document.getElementById('new-teacher-password').value;
    const confirmPassword = document.getElementById('confirm-teacher-password').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }
    
    // Check if email already exists
    if (window.teacherAccounts.some(account => account.email === email)) {
        alert('Un compte avec cet email existe déjà.');
        return;
    }
    
    // Create new account
    const newAccount = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password, // In a real app, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    window.teacherAccounts.push(newAccount);
    saveToLocalStorage();
    
    // Clear form
    document.getElementById('new-teacher-name').value = '';
    document.getElementById('new-teacher-email').value = '';
    document.getElementById('new-teacher-password').value = '';
    document.getElementById('confirm-teacher-password').value = '';
    
    alert('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
    
    // Show login form
    document.getElementById('teacher-account-form').classList.add('hidden');
    document.getElementById('teacher-account-login-form').classList.remove('hidden');
}

// Handle teacher account login
function handleTeacherAccountLogin() {
    const email = document.getElementById('teacher-account-email').value.trim();
    const password = document.getElementById('teacher-account-password').value;
    
    // Validation
    if (!email || !password) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    // Find account
    const account = window.teacherAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
        AppState.currentUser = { 
            role: 'teacher',
            accountId: account.id,
            name: account.name,
            email: account.email
        };
        
        // Clear form
        document.getElementById('teacher-account-email').value = '';
        document.getElementById('teacher-account-password').value = '';
        
        showSection('teacher-dashboard');
    } else {
        alert('Email ou mot de passe incorrect.');
    }
}

// Show forgot password form
function showForgotPasswordForm() {
    document.getElementById('teacher-account-login-form').classList.add('hidden');
    document.getElementById('forgot-password-form').classList.remove('hidden');
}

// Handle send reset link
function handleSendResetLink() {
    const email = document.getElementById('reset-email').value.trim();
    
    if (!email) {
        alert('Veuillez entrer votre email.');
        return;
    }
    
    // Check if email exists in teacher accounts
    const account = window.teacherAccounts.find(acc => acc.email === email);
    
    if (account) {
        // In a real application, you would send an email with a reset link
        // For this demo, we'll simulate the reset link by showing the reset form
        alert(`Un lien de réinitialisation a été envoyé à ${email}.`);
        
        // Store the email for reset process
        sessionStorage.setItem('resetEmail', email);
        
        // Show reset password form
        document.getElementById('forgot-password-form').classList.add('hidden');
        document.getElementById('reset-password-form').classList.remove('hidden');
    } else {
        alert('Aucun compte trouvé avec cet email.');
    }
}

// Handle reset password
function handleResetPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    const email = sessionStorage.getItem('resetEmail');
    
    if (!email) {
        alert('Session expirée. Veuillez recommencer le processus.');
        showSection('login');
        return;
    }
    
    if (!newPassword || !confirmNewPassword) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }
    
    // Find the account and update the password
    const accountIndex = window.teacherAccounts.findIndex(acc => acc.email === email);
    
    if (accountIndex !== -1) {
        window.teacherAccounts[accountIndex].password = newPassword;
        saveToLocalStorage();
        
        // Clear session storage
        sessionStorage.removeItem('resetEmail');
        
        alert('Votre mot de passe a été réinitialisé avec succès!');
        
        // Show login form
        document.getElementById('reset-password-form').classList.add('hidden');
        document.getElementById('teacher-account-login-form').classList.remove('hidden');
        
        // Clear form fields
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-new-password').value = '';
    } else {
        alert('Erreur lors de la réinitialisation du mot de passe.');
    }
}

// Handle teacher login (original method)
function handleTeacherLogin() {
    const code = document.getElementById('teacher-code').value;
    
    if (code === window.teacherCode) {
        AppState.currentUser = { role: 'teacher' };
        showSection('teacher-dashboard');
        document.getElementById('teacher-code').value = '';
    } else {
        alert('Code enseignant invalide!');
    }
}

// Handle student login
function handleStudentLogin() {
    const examCode = document.getElementById('exam-code').value.trim();
    const studentLastname = document.getElementById('student-lastname').value.trim();
    const studentFirstname = document.getElementById('student-firstname').value.trim();
    const studentId = document.getElementById('student-id').value.trim();
    const studentGender = document.getElementById('student-gender').value;

    // Validation des champs requis
    if (!examCode || !studentLastname || !studentFirstname || !studentId || !studentGender) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Find the exam with the given code
    const exam = window.exams.find(e => e.code === examCode);

    if (!exam) {
        alert('Code d\'épreuve invalide!');
        return;
    }

    // Check if student has already taken this exam
    if (window.examResults[exam.id]) {
        const studentResult = window.examResults[exam.id].find(r => r.studentId === studentId);
        if (studentResult) {
            alert('Vous avez déjà passé cette épreuve avec ce matricule.');
            return;
        }
    }

    // Set current exam and student with complete information
    AppState.currentExam = exam;
    AppState.currentUser = {
        role: 'student',
        id: studentId,
        lastname: studentLastname,
        firstname: studentFirstname,
        gender: studentGender
    };

    // Display the exam
    displayExam(exam);
    showSection('student-exam');

    // Clear form fields
    document.getElementById('exam-code').value = '';
    document.getElementById('student-lastname').value = '';
    document.getElementById('student-firstname').value = '';
    document.getElementById('student-id').value = '';
    document.getElementById('student-gender').value = '';
}

// Logout function
function logout() {
    AppState.currentUser = null;
    AppState.currentExam = null;
    showSection('login');
}

// Toggle theme function
function toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', AppState.theme);
    applyTheme();
}

// Apply theme function
function applyTheme() {
    document.body.className = AppState.theme + '-theme';
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.innerHTML = AppState.theme === 'dark' ? '☀️' : '🌙';
    themeBtn.title = AppState.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

// Apply language function
function applyLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[AppState.language] && translations[AppState.language][key]) {
            element.textContent = translations[AppState.language][key];
        }
    });
    
    const langBtn = document.getElementById('language-toggle');
    langBtn.innerHTML = AppState.language === 'fr' ? 'EN' : 'FR';
    langBtn.title = AppState.language === 'fr' ? 'Switch to English' : 'Passer en français';
    
    // Update the animated title specifically
    const titleElement = document.getElementById('app-title');
    if (titleElement) {
        titleElement.textContent = translations[AppState.language].appTitle;
    }
    
    // Update static text elements
    updateStaticText();
}

// Update static text elements based on language
function updateStaticText() {
    // Update student form title
    const studentFormTitle = document.getElementById('student-form-title');
    if (studentFormTitle) {
        studentFormTitle.textContent = AppState.language === 'fr' ? 'Informations de l\'étudiant' : 'Student Information';
    }
    
    // Update gender options
    const genderSelect = document.getElementById('student-gender');
    if (genderSelect) {
        const currentValue = genderSelect.value;
        genderSelect.innerHTML = `
            <option value="">${AppState.language === 'fr' ? 'Sélectionner le genre' : 'Select Gender'}</option>
            <option value="M">${AppState.language === 'fr' ? 'Masculin' : 'Male'}</option>
            <option value="F">${AppState.language === 'fr' ? 'Féminin' : 'Female'}</option>
        `;
        genderSelect.value = currentValue;
    }
    
    // Update other static text elements as needed
}

// Toggle language function
function toggleLanguage() {
    AppState.language = AppState.language === 'fr' ? 'en' : 'fr';
    localStorage.setItem('language', AppState.language);
    applyLanguage();
}

// Setup event listeners
function setupEventListeners() {
    // Login section events
    document.getElementById('teacher-login-btn').addEventListener('click', () => {
        document.querySelector('.role-selection').classList.add('hidden');
        // Show the developer code form first
        document.getElementById('developer-code-form').classList.remove('hidden');
    });
    
    document.getElementById('student-login-btn').addEventListener('click', () => {
        document.querySelector('.role-selection').classList.add('hidden');
        document.getElementById('student-login-form').classList.remove('hidden');
    });
    
    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.role-selection').classList.remove('hidden');
            document.getElementById('teacher-login-form').classList.add('hidden');
            document.getElementById('developer-code-form').classList.add('hidden');
            document.getElementById('teacher-account-form').classList.add('hidden');
            document.getElementById('teacher-account-login-form').classList.add('hidden');
            document.getElementById('student-login-form').classList.add('hidden');
            document.getElementById('forgot-password-form').classList.add('hidden');
            document.getElementById('reset-password-form').classList.add('hidden');
        });
    });
    
    // Developer code validation
    document.getElementById('developer-code-btn').addEventListener('click', handleDeveloperCodeValidation);
    
    // Teacher account creation
    document.getElementById('create-teacher-account-btn').addEventListener('click', handleTeacherAccountCreation);
    
    // Teacher account login
    document.getElementById('teacher-account-login-btn').addEventListener('click', handleTeacherAccountLogin);
    
    // Forgot password
    document.getElementById('forgot-password-btn').addEventListener('click', showForgotPasswordForm);
    document.getElementById('send-reset-link-btn').addEventListener('click', handleSendResetLink);
    document.getElementById('reset-password-btn').addEventListener('click', handleResetPassword);
    
    // Create account from login form
    document.getElementById('create-account-from-login-btn').addEventListener('click', showCreateAccountForm);
    
    document.getElementById('teacher-submit-btn').addEventListener('click', handleTeacherLogin);
    document.getElementById('student-submit-btn').addEventListener('click', handleStudentLogin);
    
    // Teacher dashboard events
    document.getElementById('teacher-logout-btn').addEventListener('click', logout);
    
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
            const tabId = tabBtn.getAttribute('data-tab');
            switchTab(tabId);
            // Load results when switching to results tab
            if (tabId === 'results') {
                loadExamSelector();
            }
            // Load teacher info when switching to settings tab
            if (tabId === 'settings') {
                loadTeacherInfo();
            }
        });
    });
    
    // Create exam button
    document.getElementById('create-exam-btn').addEventListener('click', () => {
        showExamForm();
    });
    
    // Cancel exam form
    document.getElementById('cancel-exam-form').addEventListener('click', () => {
        showSection('teacher-dashboard');
    });
    
    // Add question button
    document.getElementById('add-question-btn').addEventListener('click', addQuestionField);
    
    // Exam form submission
    document.getElementById('exam-form').addEventListener('submit', handleExamFormSubmit);
    
    // Submit exam button
    document.getElementById('submit-exam-btn').addEventListener('click', submitExam);
    document.getElementById('print-exam-btn').addEventListener('click', printExam);
    
    // Back to login button
    document.getElementById('back-to-login').addEventListener('click', () => {
        showSection('login');
    });
    
    // Exam selector for results
    document.getElementById('exam-selector').addEventListener('change', displayExamResults);
    
    // Publish results toggle
    document.getElementById('publish-results-toggle').addEventListener('change', togglePublishResults);
    
    // Export buttons
    document.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const format = e.target.getAttribute('data-format');
            if (format) {
                exportResults(format);
            } else if (e.target.id === 'print-results-btn') {
                printResults();
            }
        });
    });
    
    // Teacher info form submission
    document.getElementById('teacher-info-form').addEventListener('submit', handleTeacherInfoSubmit);
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Language toggle
    document.getElementById('language-toggle').addEventListener('click', toggleLanguage);
}

// Show a specific section
function showSection(sectionId) {
    // Hide all sections
    Object.values(DOM).forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the requested section
    switch(sectionId) {
        case 'login':
            DOM.loginSection.classList.remove('hidden');
            break;
        case 'teacher-dashboard':
            DOM.teacherDashboard.classList.remove('hidden');
            loadExamsTable();
            loadExamSelector();
            break;
        case 'exam-form':
            DOM.examFormSection.classList.remove('hidden');
            break;
        case 'student-exam':
            DOM.studentExamSection.classList.remove('hidden');
            break;
        case 'exam-results':
            DOM.examResultsSection.classList.remove('hidden');
            break;
    }
}

// Switch tabs in teacher dashboard
function switchTab(tabId) {
    // Update active tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    
    // Show the selected tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`${tabId}-tab`).classList.remove('hidden');
}

// Handle developer code validation
function handleDeveloperCodeValidation() {
    const code = document.getElementById('developer-code').value;
    
    if (code === window.developerCode) {
        // Valid developer code, show account creation or login options
        document.getElementById('developer-code-form').classList.add('hidden');
        
        // Check if any teacher accounts exist
        if (window.teacherAccounts.length > 0) {
            // Show login form
            document.getElementById('teacher-account-login-form').classList.remove('hidden');
        } else {
            // Show account creation form
            document.getElementById('teacher-account-form').classList.remove('hidden');
        }
    } else {
        alert('Code développeur invalide!');
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('exams', JSON.stringify(window.exams));
    localStorage.setItem('examResults', JSON.stringify(window.examResults));
    localStorage.setItem('teacherCode', window.teacherCode);
    localStorage.setItem('developerCode', window.developerCode);
    localStorage.setItem('teacherAccounts', JSON.stringify(window.teacherAccounts));
    localStorage.setItem('teacherInfo', JSON.stringify(window.teacherInfo));
    localStorage.setItem('language', AppState.language);
    localStorage.setItem('theme', AppState.theme);
}

// Load data from localStorage
function loadFromLocalStorage() {
    // Load exams
    const examsData = localStorage.getItem('exams');
    if (examsData) {
        window.exams = JSON.parse(examsData);
    } else {
        window.exams = [];
    }
    
    // Load exam results
    const examResultsData = localStorage.getItem('examResults');
    if (examResultsData) {
        window.examResults = JSON.parse(examResultsData);
    } else {
        window.examResults = {};
    }
    
    // Load teacher code (in a real app, this would be more secure)
    const teacherCodeData = localStorage.getItem('teacherCode');
    if (teacherCodeData) {
        window.teacherCode = teacherCodeData;
    } else {
        // Pre-generated teacher code
        window.teacherCode = 'TEACHER123';
        localStorage.setItem('teacherCode', window.teacherCode);
    }
    
    // Load developer code
    const developerCodeData = localStorage.getItem('developerCode');
    if (developerCodeData) {
        window.developerCode = developerCodeData;
    } else {
        // Pre-generated developer code
        window.developerCode = 'DEV789';
        localStorage.setItem('developerCode', window.developerCode);
    }
    
    // Load teacher accounts
    const teacherAccountsData = localStorage.getItem('teacherAccounts');
    if (teacherAccountsData) {
        window.teacherAccounts = JSON.parse(teacherAccountsData);
    } else {
        window.teacherAccounts = [];
    }
    
    // Load teacher information
    const teacherInfoData = localStorage.getItem('teacherInfo');
    if (teacherInfoData) {
        window.teacherInfo = JSON.parse(teacherInfoData);
    } else {
        window.teacherInfo = {};
    }
    
    // Set logo path
    const logoImg = document.querySelector('.app-logo');
    if (logoImg) {
        logoImg.src = 'Logo.png';
    }
}

// Show create account form
function showCreateAccountForm() {
    document.getElementById('teacher-account-login-form').classList.add('hidden');
    document.getElementById('teacher-account-form').classList.remove('hidden');
}

// Handle teacher account creation
function handleTeacherAccountCreation() {
    const name = document.getElementById('new-teacher-name').value.trim();
    const email = document.getElementById('new-teacher-email').value.trim();
    const password = document.getElementById('new-teacher-password').value;
    const confirmPassword = document.getElementById('confirm-teacher-password').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }
    
    // Check if email already exists
    if (window.teacherAccounts.some(account => account.email === email)) {
        alert('Un compte avec cet email existe déjà.');
        return;
    }
    
    // Create new account
    const newAccount = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password, // In a real app, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    window.teacherAccounts.push(newAccount);
    saveToLocalStorage();
    
    // Clear form
    document.getElementById('new-teacher-name').value = '';
    document.getElementById('new-teacher-email').value = '';
    document.getElementById('new-teacher-password').value = '';
    document.getElementById('confirm-teacher-password').value = '';
    
    alert('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
    
    // Show login form
    document.getElementById('teacher-account-form').classList.add('hidden');
    document.getElementById('teacher-account-login-form').classList.remove('hidden');
}

// Handle teacher account login
function handleTeacherAccountLogin() {
    const email = document.getElementById('teacher-account-email').value.trim();
    const password = document.getElementById('teacher-account-password').value;
    
    // Validation
    if (!email || !password) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    // Find account
    const account = window.teacherAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
        AppState.currentUser = { 
            role: 'teacher',
            accountId: account.id,
            name: account.name,
            email: account.email
        };
        
        // Clear form
        document.getElementById('teacher-account-email').value = '';
        document.getElementById('teacher-account-password').value = '';
        
        showSection('teacher-dashboard');
    } else {
        alert('Email ou mot de passe incorrect.');
    }
}

// Show forgot password form
function showForgotPasswordForm() {
    document.getElementById('teacher-account-login-form').classList.add('hidden');
    document.getElementById('forgot-password-form').classList.remove('hidden');
}

// Handle send reset link
function handleSendResetLink() {
    const email = document.getElementById('reset-email').value.trim();
    
    if (!email) {
        alert('Veuillez entrer votre email.');
        return;
    }
    
    // Check if email exists in teacher accounts
    const account = window.teacherAccounts.find(acc => acc.email === email);
    
    if (account) {
        // In a real application, you would send an email with a reset link
        // For this demo, we'll simulate the reset link by showing the reset form
        alert(`Un lien de réinitialisation a été envoyé à ${email}.`);
        
        // Store the email for reset process
        sessionStorage.setItem('resetEmail', email);
        
        // Show reset password form
        document.getElementById('forgot-password-form').classList.add('hidden');
        document.getElementById('reset-password-form').classList.remove('hidden');
    } else {
        alert('Aucun compte trouvé avec cet email.');
    }
}

// Handle reset password
function handleResetPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    const email = sessionStorage.getItem('resetEmail');
    
    if (!email) {
        alert('Session expirée. Veuillez recommencer le processus.');
        showSection('login');
        return;
    }
    
    if (!newPassword || !confirmNewPassword) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }
    
    // Find the account and update the password
    const accountIndex = window.teacherAccounts.findIndex(acc => acc.email === email);
    
    if (accountIndex !== -1) {
        window.teacherAccounts[accountIndex].password = newPassword;
        saveToLocalStorage();
        
        // Clear session storage
        sessionStorage.removeItem('resetEmail');
        
        alert('Votre mot de passe a été réinitialisé avec succès!');
        
        // Show login form
        document.getElementById('reset-password-form').classList.add('hidden');
        document.getElementById('teacher-account-login-form').classList.remove('hidden');
        
        // Clear form fields
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-new-password').value = '';
    } else {
        alert('Erreur lors de la réinitialisation du mot de passe.');
    }
}

// Handle teacher login (original method)
function handleTeacherLogin() {
    const code = document.getElementById('teacher-code').value;
    
    if (code === window.teacherCode) {
        AppState.currentUser = { role: 'teacher' };
        showSection('teacher-dashboard');
        document.getElementById('teacher-code').value = '';
    } else {
        alert('Code enseignant invalide!');
    }
}

// Handle student login
function handleStudentLogin() {
    const email = document.getElementById('student-email').value;
    const password = document.getElementById('student-password').value;
    
    // Validation
    if (!email || !password) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    // Check if student account exists
    if (window.studentAccounts.some(student => student.email === email && student.password === password)) {
        AppState.currentUser = { role: 'student' };
        showSection('student-dashboard');
        document.getElementById('student-email').value = '';
        document.getElementById('student-password').value = '';
    } else {
        alert('Email ou mot de passe incorrect.');
    }
}

// Handle reset password
function handleResetPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    const email = sessionStorage.getItem('resetEmail');
    
    if (!email) {
        alert('Session expirée. Veuillez recommencer le processus.');
        showSection('login');
        return;
    }
    
    if (!newPassword || !confirmNewPassword) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }
    
    // Find the account and update the password
    const accountIndex = window.teacherAccounts.findIndex(acc => acc.email === email);
    
    if (accountIndex !== -1) {
        window.teacherAccounts[accountIndex].password = newPassword;
        saveToLocalStorage();
        
        // Clear session storage
        sessionStorage.removeItem('resetEmail');
        
        alert('Votre mot de passe a été réinitialisé avec succès!');
        
        // Show login form
        document.getElementById('reset-password-form').classList.add('hidden');
        document.getElementById('teacher-account-login-form').classList.remove('hidden');
        
        // Clear form fields
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-new-password').value = '';
    } else {
        alert('Erreur lors de la réinitialisation du mot de passe.');
    }
}

// Handle teacher login (original method)
function handleTeacherLogin() {
    const code = document.getElementById('teacher-code').value;
    
    if (code === window.teacherCode) {
        AppState.currentUser = { role: 'teacher' };
        showSection('teacher-dashboard');
        document.getElementById('teacher-code').value = '';
    } else {
        alert('Code enseignant invalide!');
    }
}

// Handle student login
function handleStudentLogin() {
    const examCode = document.getElementById('exam-code').value.trim();
    const studentLastname = document.getElementById('student-lastname').value.trim();
    const studentFirstname = document.getElementById('student-firstname').value.trim();
    const studentId = document.getElementById('student-id').value.trim();
    const studentGender = document.getElementById('student-gender').value;

    // Validation des champs requis
    if (!examCode || !studentLastname || !studentFirstname || !studentId || !studentGender) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Find the exam with the given code
    const exam = window.exams.find(e => e.code === examCode);

    if (!exam) {
        alert('Code d\'épreuve invalide!');
        return;
    }

    // Check if student has already taken this exam
    if (window.examResults[exam.id]) {
        const studentResult = window.examResults[exam.id].find(r => r.studentId === studentId);
        if (studentResult) {
            alert('Vous avez déjà passé cette épreuve avec ce matricule.');
            return;
        }
    }

    // Set current exam and student with complete information
    AppState.currentExam = exam;
    AppState.currentUser = {
        role: 'student',
        id: studentId,
        lastname: studentLastname,
        firstname: studentFirstname,
        gender: studentGender
    };

    // Display the exam
    displayExam(exam);
    showSection('student-exam');

    // Clear form fields
    document.getElementById('exam-code').value = '';
    document.getElementById('student-lastname').value = '';
    document.getElementById('student-firstname').value = '';
    document.getElementById('student-id').value = '';
    document.getElementById('student-gender').value = '';
}

// Logout function
function logout() {
    AppState.currentUser = null;
    AppState.currentExam = null;
    showSection('login');
}

// Toggle theme function
function toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', AppState.theme);
    applyTheme();
}

// Apply theme function
function applyTheme() {
    document.body.className = AppState.theme + '-theme';
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.innerHTML = AppState.theme === 'dark' ? '☀️' : '🌙';
    themeBtn.title = AppState.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

// Apply language function
function applyLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[AppState.language] && translations[AppState.language][key]) {
            element.textContent = translations[AppState.language][key];
        }
    });
    
    const langBtn = document.getElementById('language-toggle');
    langBtn.innerHTML = AppState.language === 'fr' ? 'EN' : 'FR';
    langBtn.title = AppState.language === 'fr' ? 'Switch to English' : 'Passer en français';
    
    // Update static text elements
    updateStaticText();
}

// Update static text elements based on language
function updateStaticText() {
    // Update student form title
    const studentFormTitle = document.getElementById('student-form-title');
    if (studentFormTitle) {
        studentFormTitle.textContent = AppState.language === 'fr' ? 'Informations de l\'étudiant' : 'Student Information';
    }
    
    // Update gender options
    const genderSelect = document.getElementById('student-gender');
    if (genderSelect) {
        const currentValue = genderSelect.value;
        genderSelect.innerHTML = `
            <option value="">${AppState.language === 'fr' ? 'Sélectionner le genre' : 'Select Gender'}</option>
            <option value="M">${AppState.language === 'fr' ? 'Masculin' : 'Male'}</option>
            <option value="F">${AppState.language === 'fr' ? 'Féminin' : 'Female'}</option>
        `;
        genderSelect.value = currentValue;
    }
    
    // Update other static text elements as needed
}

// Toggle language function
function toggleLanguage() {
    AppState.language = AppState.language === 'fr' ? 'en' : 'fr';
    localStorage.setItem('language', AppState.language);
    applyLanguage();
}

// Load exams table in teacher dashboard
function loadExamsTable() {
    const tbody = document.querySelector('#exams-table tbody');
    tbody.innerHTML = '';
    
    window.exams.forEach(exam => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${exam.title}</td>
            <td>${exam.university || ''}</td>
            <td>${exam.faculty || ''}</td>
            <td>${exam.department || ''}</td>
            <td>${exam.subject || ''}</td>
            <td>${exam.class || ''}</td>
            <td>${exam.code}</td>
            <td>${exam.duration} min</td>
            <td>${exam.maxAttempts}</td>
            <td>
                <button class="action-btn" onclick="editExam('${exam.id}')">Modifier</button>
                <button class="action-btn" onclick="deleteExam('${exam.id}')">Supprimer</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Load exam selector for results
function loadExamSelector() {
    const selector = document.getElementById('exam-selector');
    
    // Keep the first option (placeholder)
    selector.innerHTML = '<option value="">Sélectionnez une épreuve</option>';
    
    window.exams.forEach(exam => {
        const option = document.createElement('option');
        option.value = exam.id;
        option.textContent = exam.title;
        selector.appendChild(option);
    });

    // If there's only one exam, auto-select it and display its results
    if (window.exams.length === 1) {
        selector.value = window.exams[0].id;
        displayExamResults();
    }
}

// Show exam form for creating/editing
function showExamForm(examId = null) {
    const formTitle = document.getElementById('form-title');
    const examForm = document.getElementById('exam-form');
    
    if (examId) {
        // Editing existing exam
        const exam = window.exams.find(e => e.id === examId);
        if (exam) {
            formTitle.textContent = 'Modifier l\'épreuve';
            document.getElementById('exam-title').value = exam.title;
            document.getElementById('exam-description').value = exam.description || '';
            document.getElementById('exam-university').value = exam.university || '';
            document.getElementById('exam-faculty').value = exam.faculty || '';
            document.getElementById('exam-department').value = exam.department || '';
            document.getElementById('exam-subject').value = exam.subject || '';
            document.getElementById('exam-class').value = exam.class || '';
            document.getElementById('exam-duration').value = exam.duration;
            document.getElementById('exam-attempts').value = exam.maxAttempts;
            document.getElementById('exam-start-date').value = exam.startDate || '';
            
            // Load questions
            const questionsContainer = document.getElementById('questions-container');
            questionsContainer.innerHTML = '';
            
            exam.questions.forEach((question, index) => {
                addQuestionField(question, index);
            });
            
            // Store exam ID in form for update
            examForm.dataset.editingId = examId;
        }
    } else {
        // Creating new exam
        formTitle.textContent = 'Créer une nouvelle épreuve';
        examForm.reset();
        document.getElementById('questions-container').innerHTML = '';
        delete examForm.dataset.editingId;
        
        // Add one question by default
        addQuestionField();
    }
    
    showSection('exam-form');
}

// Add a question field to the form
function addQuestionField(questionData = null, index = null) {
    const questionsContainer = document.getElementById('questions-container');
    const questionCount = questionsContainer.children.length + 1;
    
    const questionCard = document.createElement('div');
    questionCard.className = 'question-card';
    questionCard.innerHTML = `
        <h4>
            Question ${questionCount}
            <button type="button" class="remove-question-btn" onclick="removeQuestion(this)">×</button>
        </h4>
        <div class="form-group">
            <label>Type de question</label>
            <select class="question-type" onchange="updateQuestionType(this)">
                <option value="mcq-single">QCM (choix unique)</option>
            </select>
        </div>
        <div class="form-group">
            <label>Intitulé de la question *</label>
            <textarea class="question-text" required>${questionData ? questionData.text : ''}</textarea>
        </div>
        <div class="form-group">
            <label>Note attribuée *</label>
            <input type="number" class="question-points" min="1" value="${questionData ? questionData.points : 1}" required>
        </div>
        <div class="form-group">
            <label>Options de réponse</label>
            <div class="options-container">
                <!-- Options will be added here -->
            </div>
            <button type="button" class="action-btn" onclick="addOption(this)">Ajouter une option</button>
        </div>
    `;
    
    questionsContainer.appendChild(questionCard);
    
    // Add existing options if editing
    if (questionData && questionData.options) {
        const optionsContainer = questionCard.querySelector('.options-container');
        questionData.options.forEach(option => {
            addOptionToContainer(optionsContainer, option);
        });
    } else {
        // Add two options by default for new questions
        const optionsContainer = questionCard.querySelector('.options-container');
        addOptionToContainer(optionsContainer);
        addOptionToContainer(optionsContainer);
    }
}

// Remove a question
function removeQuestion(button) {
    const questionCard = button.closest('.question-card');
    questionCard.remove();
    
    // Renumber questions
    renumberQuestions();
}

// Renumber questions
function renumberQuestions() {
    const questions = document.querySelectorAll('.question-card');
    questions.forEach((question, index) => {
        const heading = question.querySelector('h4');
        heading.firstChild.textContent = `Question ${index + 1}`;
    });
}

// Update question type (currently only one type supported)
function updateQuestionType(select) {
    // In a more complex app, this would change the UI based on question type
    // For now, we only support single-choice MCQ
}

// Add an option to a question
function addOption(button) {
    const optionsContainer = button.previousElementSibling;
    addOptionToContainer(optionsContainer);
}

// Add an option to a specific container
function addOptionToContainer(container, optionData = null) {
    const optionIndex = container.children.length + 1;
    
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option-input';
    optionDiv.innerHTML = `
        <label class="option-label">
            <input type="checkbox" class="correct-answer-checkbox" ${optionData && optionData.isCorrect ? 'checked' : ''}>
            Correct
        </label>
        <input type="text" class="option-text" placeholder="Option ${optionIndex}" value="${optionData ? optionData.text : ''}" required>
        <button type="button" class="remove-option-btn" onclick="removeOption(this)">Supprimer</button>
    `;
    
    container.appendChild(optionDiv);
}

// Remove an option
function removeOption(button) {
    const optionDiv = button.closest('.option-input');
    optionDiv.remove();
}

// Handle exam form submission
function handleExamFormSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(e.target);
    const examData = {
        title: document.getElementById('exam-title').value,
        description: document.getElementById('exam-description').value,
        university: document.getElementById('exam-university').value,
        faculty: document.getElementById('exam-faculty').value,
        department: document.getElementById('exam-department').value,
        subject: document.getElementById('exam-subject').value,
        class: document.getElementById('exam-class').value,
        duration: parseInt(document.getElementById('exam-duration').value),
        maxAttempts: parseInt(document.getElementById('exam-attempts').value),
        startDate: document.getElementById('exam-start-date').value
    };
    
    // Validate required fields
    if (!examData.title || !examData.university || !examData.faculty || !examData.department || !examData.subject || !examData.class || !examData.duration || !examData.maxAttempts) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Collect questions
    const questionCards = document.querySelectorAll('.question-card');
    const questions = [];
    
    for (let i = 0; i < questionCards.length; i++) {
        const card = questionCards[i];
        const questionText = card.querySelector('.question-text').value;
        const questionPoints = parseInt(card.querySelector('.question-points').value);
        
        if (!questionText || !questionPoints) {
            alert(`Veuillez remplir tous les champs de la question ${i + 1}.`);
            return;
        }
        
        // Collect options
        const optionInputs = card.querySelectorAll('.option-input');
        const options = [];
        let hasCorrectAnswer = false;
        
        for (let j = 0; j < optionInputs.length; j++) {
            const optionDiv = optionInputs[j];
            const optionText = optionDiv.querySelector('.option-text').value;
            const isCorrect = optionDiv.querySelector('.correct-answer-checkbox').checked;
            
            if (!optionText) {
                alert(`Veuillez remplir l'option ${j + 1} de la question ${i + 1}.`);
                return;
            }
            
            if (isCorrect) hasCorrectAnswer = true;
            
            options.push({
                text: optionText,
                isCorrect: isCorrect
            });
        }
        
        if (!hasCorrectAnswer) {
            alert(`Veuillez sélectionner au moins une bonne réponse pour la question ${i + 1}.`);
            return;
        }
        
        questions.push({
            id: Date.now() + i, // Simple ID generation
            text: questionText,
            points: questionPoints,
            options: options
        });
    }
    
    if (questions.length === 0) {
        alert('Veuillez ajouter au moins une question.');
        return;
    }
    
    // Check if we're editing or creating
    const editingId = e.target.dataset.editingId;
    
    if (editingId) {
        // Update existing exam
        const examIndex = window.exams.findIndex(e => e.id === editingId);
        if (examIndex !== -1) {
            examData.id = editingId;
            examData.code = window.exams[examIndex].code; // Keep the same code
            examData.questions = questions;
            window.exams[examIndex] = examData;
        }
    } else {
        // Create new exam
        const newExam = {
            id: Date.now().toString(),
            code: generateExamCode(),
            ...examData,
            questions: questions
        };
        
        window.exams.push(newExam);
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Return to dashboard
    showSection('teacher-dashboard');
    loadExamsTable();
}

// Generate a unique exam code
function generateExamCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Edit an exam
function editExam(examId) {
    showExamForm(examId);
}

// Delete an exam
function deleteExam(examId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette épreuve ?')) {
        window.exams = window.exams.filter(e => e.id !== examId);
        
        // Also remove results for this exam
        delete window.examResults[examId];
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Refresh the table
        loadExamsTable();
    }
}

// Display exam for student
function displayExam(exam) {
    document.getElementById('exam-title-display').textContent = exam.title;
    
    // Add exam details below the title
    const examHeader = document.querySelector('.exam-header');
    let detailsDiv = examHeader.querySelector('.exam-details');
    if (!detailsDiv) {
        detailsDiv = document.createElement('div');
        detailsDiv.className = 'exam-details';
        examHeader.insertBefore(detailsDiv, examHeader.querySelector('.exam-timer'));
    }
    
    detailsDiv.innerHTML = `
        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 5px;">
            <strong>${exam.university || ''}</strong> - ${exam.faculty || ''} - ${exam.department || ''}<br>
            <strong>Matière:</strong> ${exam.subject || ''} | <strong>Classe:</strong> ${exam.class || ''} | <strong>Durée:</strong> ${exam.duration} minutes
        </div>
    `;
    
    const questionsContainer = document.getElementById('questions-display');
    questionsContainer.innerHTML = '';
    
    exam.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <div class="question-text">${index + 1}. ${question.text} (${question.points} point${question.points > 1 ? 's' : ''})</div>
            <div class="options-container">
                ${question.options.map((option, optIndex) => `
                    <label class="option-label">
                        <input type="radio" name="question-${index}" value="${optIndex}" class="option-input-hidden">
                        ${option.text}
                    </label>
                `).join('')}
            </div>
        `;
        
        questionsContainer.appendChild(questionDiv);
    });
    
    // Start timer
    startExamTimer(exam.duration);
}

// Start exam timer
function startExamTimer(minutes) {
    const totalTime = minutes * 60; // Convert to seconds
    let remainingTime = totalTime;
    
    // Update timer display immediately
    updateTimerDisplay(remainingTime);
    
    // Clear any existing timer
    if (AppState.examTimer) {
        clearInterval(AppState.examTimer);
    }
    
    // Set end time for auto-submit
    AppState.examEndTime = Date.now() + (totalTime * 1000);
    
    // Start timer
    AppState.examTimer = setInterval(() => {
        remainingTime--;
        updateTimerDisplay(remainingTime);
        
        if (remainingTime <= 0) {
            clearInterval(AppState.examTimer);
            submitExam(true); // Auto-submit
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Submit exam
function submitExam(autoSubmit = false) {
    if (!autoSubmit && !confirm('Êtes-vous sûr de vouloir soumettre votre épreuve ?')) {
        return;
    }
    
    // Stop timer
    if (AppState.examTimer) {
        clearInterval(AppState.examTimer);
        AppState.examTimer = null;
    }
    
    // Collect answers
    const answers = [];
    const questionItems = document.querySelectorAll('.question-item');
    
    questionItems.forEach((item, index) => {
        const selectedOption = item.querySelector('input[name="question-' + index + '"]:checked');
        answers.push({
            questionId: AppState.currentExam.questions[index].id,
            selectedOption: selectedOption ? parseInt(selectedOption.value) : null
        });
    });
    
    // Calculate score
    let score = 0;
    const totalPoints = AppState.currentExam.questions.reduce((sum, q) => sum + q.points, 0);
    
    answers.forEach((answer, index) => {
        const question = AppState.currentExam.questions[index];
        if (answer.selectedOption !== null) {
            const selectedOption = question.options[answer.selectedOption];
            if (selectedOption && selectedOption.isCorrect) {
                score += question.points;
            }
        }
    });
    
    // Record result
    const result = {
        studentId: AppState.currentUser.id,
        studentLastname: AppState.currentUser.lastname,
        studentFirstname: AppState.currentUser.firstname,
        studentGender: AppState.currentUser.gender,
        score: score,
        totalPoints: totalPoints,
        timeUsed: AppState.currentExam.duration - (AppState.examEndTime - Date.now()) / 1000 / 60, // Approximate
        submittedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        answers: answers,
        published: false
    };
    
    // Save result
    if (!window.examResults[AppState.currentExam.id]) {
        window.examResults[AppState.currentExam.id] = [];
    }
    window.examResults[AppState.currentExam.id].push(result);
    saveToLocalStorage();
    
    // Display results
    displayStudentResults(result);
    showSection('exam-results');
}

// Display student results
function displayStudentResults(result) {
    const resultsContainer = document.getElementById('results-display');
    
    if (result.published) {
        resultsContainer.innerHTML = `
            <div class="result-item">
                <h3>Votre résultat</h3>
                <p>Matricule: ${result.studentId}</p>
                <p>Score: ${result.score} / ${result.totalPoints}</p>
                <p>Pourcentage: ${Math.round((result.score / result.totalPoints) * 100)}%</p>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = `
            <div class="result-item">
                <h3>Votre épreuve a été soumise</h3>
                <p>Vos résultats seront disponibles une fois que l'enseignant les aura publiés.</p>
            </div>
        `;
    }
}

// Display exam results for teacher
function displayExamResults() {
    const examId = document.getElementById('exam-selector').value;
    
    if (!examId) {
        document.querySelector('#results-table tbody').innerHTML = '';
        // Reset publish toggle
        document.getElementById('publish-results-toggle').checked = false;
        document.getElementById('results-container').style.display = 'none';
        return;
    }
    
    const results = window.examResults[examId] || [];
    const tbody = document.querySelector('#results-table tbody');
    tbody.innerHTML = '';
    
    if (results.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" class="no-results">Aucun résultat disponible pour cette épreuve</td>`;
        tbody.appendChild(row);
    } else {
        results.forEach((result, index) => {
            const row = document.createElement('tr');
            const percentage = Math.round((result.score / result.totalPoints) * 100);
            const passStatus = percentage >= 50 ? 'Admis' : 'Ajourné';
            const statusClass = percentage >= 50 ? 'status-pass' : 'status-fail';
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${result.studentId}</td>
                <td>${result.studentLastname || 'N/A'} ${result.studentFirstname || ''}</td>
                <td>${result.score} / ${result.totalPoints} (${percentage}%)</td>
                <td>${Math.round(result.timeUsed) || 0} min</td>
                <td><span class="status-badge ${statusClass}">${passStatus}</span></td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // Update publish toggle
    const exam = window.exams.find(e => e.id === examId);
    if (exam && results.length > 0) {
        document.getElementById('publish-results-toggle').checked = results[0].published;
    } else {
        document.getElementById('publish-results-toggle').checked = false;
    }
    
    // Make sure the results container is visible
    document.getElementById('results-container').style.display = 'block';
    
    // Log for debugging
    console.log(`Displaying results for exam ${examId}:`, results);
}

// Toggle publish results
function togglePublishResults() {
    const examId = document.getElementById('exam-selector').value;
    const isChecked = document.getElementById('publish-results-toggle').checked;
    
    if (!examId || !window.examResults[examId]) return;
    
    // Update all results for this exam
    window.examResults[examId].forEach(result => {
        result.published = isChecked;
    });
    
    saveToLocalStorage();
    
    // If we're viewing results as a student, update the display
    if (AppState.currentUser && AppState.currentUser.role === 'student' && 
        AppState.currentExam && AppState.currentExam.id === examId) {
        // Reload results display
        const studentResult = window.examResults[examId].find(r => r.studentId === AppState.currentUser.id);
        if (studentResult) {
            displayStudentResults(studentResult);
        }
    }
}

// Load teacher information into form
function loadTeacherInfo() {
    if (window.teacherInfo) {
        document.getElementById('teacher-lastname').value = window.teacherInfo.lastname || '';
        document.getElementById('teacher-firstname').value = window.teacherInfo.firstname || '';
        document.getElementById('teacher-id').value = window.teacherInfo.id || '';
        document.getElementById('teacher-department').value = window.teacherInfo.department || '';
    }
}

// Handle teacher info form submission
function handleTeacherInfoSubmit(e) {
    e.preventDefault();
    
    // Collect form data
    const teacherInfo = {
        lastname: document.getElementById('teacher-lastname').value,
        firstname: document.getElementById('teacher-firstname').value,
        id: document.getElementById('teacher-id').value,
        department: document.getElementById('teacher-department').value
    };
    
    // Validate required fields
    if (!teacherInfo.lastname || !teacherInfo.firstname || !teacherInfo.id) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Save to global variable and localStorage
    window.teacherInfo = teacherInfo;
    saveToLocalStorage();
    
    alert('Informations enregistrées avec succès!');
}

// Export results in the specified format
function exportResults(format) {
    const examId = document.getElementById('exam-selector').value;

    if (!examId) {
        alert('Veuillez sélectionner une épreuve.');
        return;
    }

    const exam = window.exams.find(e => e.id === examId);
    const results = window.examResults[examId] || [];

    if (results.length === 0) {
        alert('Aucun résultat disponible pour cette épreuve.');
        return;
    }

    // Show loading message
    const exportBtn = document.querySelector(`[data-format="${format}"]`);
    const originalText = exportBtn.textContent;
    exportBtn.textContent = 'Exportation...';
    exportBtn.disabled = true;

    try {
        switch(format) {
            case 'pdf':
                exportToPDF(exam, results);
                break;
            case 'excel':
                exportToExcel(exam, results);
                break;
            case 'word':
                exportToWord(exam, results);
                break;
            default:
                alert('Format non supporté.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'exportation:', error);
        alert('Une erreur s\'est produite lors de l\'exportation. Veuillez réessayer.');
    } finally {
        // Reset button
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
    }
}

// Export functions
function exportToPDF(exam, results) {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const teacherInfo = window.teacherInfo || {};

    // Generate HTML content for PDF with watermark
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Résultats - ${exam.title}</title>
            <style>
                @page {
                    margin: 1.5cm;
                }
                body { 
                    font-family: 'Times New Roman', Times, serif; 
                    margin: 0;
                    padding: 20px;
                    position: relative;
                    font-size: 11pt;
                    line-height: 1.6;
                }
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    opacity: 0.08;
                    z-index: -1;
                    width: 60%;
                    pointer-events: none;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px double #000;
                    padding-bottom: 15px;
                    margin-bottom: 25px;
                }
                .logo-section {
                    text-align: center;
                    margin-bottom: 12px;
                }
                .logo { 
                    max-height: 70px; 
                    width: auto;
                }
                .university-info {
                    text-align: center;
                    line-height: 1.4;
                }
                .university-name {
                    font-size: 16pt;
                    font-weight: bold;
                    margin: 5px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .faculty-info {
                    font-size: 12pt;
                    margin: 3px 0;
                    font-weight: 500;
                }
                .exam-title-section {
                    text-align: center;
                    margin: 25px 0;
                    clear: both;
                }
                .exam-title-section h1 {
                    font-size: 14pt;
                    font-weight: bold;
                    margin: 10px 0;
                    text-decoration: underline;
                    text-transform: uppercase;
                }
                .exam-title-section h2 {
                    font-size: 13pt;
                    font-weight: bold;
                    margin: 8px 0;
                }
                .exam-info {
                    margin: 20px 0;
                    padding: 15px;
                    background: #f9f9f9;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .exam-info p {
                    margin: 5px 0;
                    font-size: 11pt;
                }
                .results-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 10pt;
                }
                .results-table th,
                .results-table td {
                    border: 1px solid #333;
                    padding: 10px 8px;
                    text-align: center;
                }
                .results-table th {
                    background-color: #e8e8e8;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 9pt;
                }
                .results-table tbody tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .teacher-info {
                    margin-top: 40px;
                    padding: 15px;
                    border-top: 2px solid #000;
                }
                .teacher-info p {
                    margin: 5px 0;
                    font-size: 10pt;
                }
                .signature-section {
                    margin-top: 50px;
                    display: flex;
                    justify-content: space-between;
                    page-break-inside: avoid;
                }
                .signature-box {
                    width: 45%;
                    text-align: center;
                }
                .signature-box p {
                    margin: 5px 0;
                    font-size: 11pt;
                }
                .signature-line {
                    border-top: 1px solid #000;
                    margin-top: 60px;
                    padding-top: 5px;
                }
                @media print { 
                    .no-print { display: none !important; }
                    body { 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .results-table th {
                        background-color: #e8e8e8 !important;
                    }
                    .results-table tbody tr:nth-child(even) {
                        background-color: #f9f9f9 !important;
                    }
                }
            </style>
        </head>
        <body>
            <img src="Logo.png" class="watermark" onerror="this.style.display='none'">
            <div class="header">
                <div class="logo-section">
                    <img src="Logo.png" alt="Logo" class="logo" onerror="this.style.display='none'">
                </div>
                <div class="university-info">
                    <div class="university-name">${exam.university || 'Université XYZ'}</div>
                    <div class="faculty-info">${exam.faculty || 'Faculté ABC'}</div>
                    <div class="faculty-info">${exam.department || 'Département DEF'}</div>
                </div>
            </div>
            <div class="exam-title-section">
                <h1>NOTE DE CONTROLE CONTINU</h1>
                <h2>${exam.title}</h2>
            </div>

            <div class="exam-info">
                <p><strong>Université:</strong> ${exam.university || 'Université XYZ'}</p>
                <p><strong>Faculté:</strong> ${exam.faculty || 'Faculté ABC'}</p>
                <p><strong>Département:</strong> ${exam.department || 'Département DEF'}</p>
                <p><strong>Matière:</strong> ${exam.subject || exam.title}</p>
                <p><strong>Classe:</strong> ${exam.class || 'Classe GHI'}</p>
                <p><strong>Enseignant:</strong> ${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}</p>
                <p><strong>Date d'exportation:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            <table class="results-table">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Matricule</th>
                        <th>Note/20</th>
                        <th>Pourcentage</th>
                        <th>Mention</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${results && results.length > 0 ? results.map((result, index) => {
                        const score = (result.score / exam.questions.length) * 20;
                        const percentage = Math.round((result.score / exam.questions.length) * 100);
                        let mention = 'Échec';
                        if (percentage >= 90) mention = 'Excellent';
                        else if (percentage >= 80) mention = 'Très Bien';
                        else if (percentage >= 70) mention = 'Bien';
                        else if (percentage >= 60) mention = 'Assez Bien';
                        else if (percentage >= 50) mention = 'Passable';
                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${result.studentLastname}</td>
                                <td>${result.studentFirstname}</td>
                                <td>${result.studentId}</td>
                                <td>${score.toFixed(2)}</td>
                                <td>${percentage}%</td>
                                <td>${mention}</td>
                                <td>${new Date(result.completedAt).toLocaleDateString('fr-FR')}</td>
                            </tr>
                        `;
                    }).join('') : generateSampleStudentData().map((student, index) => {
                        // Generate sample grades for demonstration when no results
                        const examGrade = (Math.random() * 20).toFixed(2);
                        const percentage = Math.round((parseFloat(examGrade) / 20) * 100);
                        let mention = 'Échec';
                        if (percentage >= 90) mention = 'Excellent';
                        else if (percentage >= 80) mention = 'Très Bien';
                        else if (percentage >= 70) mention = 'Bien';
                        else if (percentage >= 60) mention = 'Assez Bien';
                        else if (percentage >= 50) mention = 'Passable';
                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${student.lastname}</td>
                                <td>${student.firstname}</td>
                                <td>${student.id}</td>
                                <td>${examGrade}</td>
                                <td>${percentage}%</td>
                                <td>${mention}</td>
                                <td>N/A</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <div class="teacher-info">
                <p><strong>Enseignant:</strong> ${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}</p>
                <p><strong>Matricule:</strong> ${teacherInfo.id || ''}</p>
                ${teacherInfo.email ? `<p><strong>Email:</strong> ${teacherInfo.email}</p>` : ''}
                ${teacherInfo.department ? `<p><strong>Département:</strong> ${teacherInfo.department}</p>` : ''}
            </div>

            <div class="signature-section">
                <div class="signature-box">
                    <p><strong>Le Chef de Département</strong></p>
                    <div class="signature-line"></div>
                </div>
                <div class="signature-box">
                    <p><strong>L'Enseignant</strong></p>
                    <div class="signature-line">
                        <p style="margin-top: 5px;">${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}</p>
                    </div>
                </div>
            </div>

            <div style="text-align: right; margin-top: 30px; font-size: 10pt; font-style: italic;">
                <p>Fait à l'Université, le 19 décembre 2025</p>
            </div>

            <div class="no-print" style="margin-top: 30px; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 5px;">
                <button onclick="window.print()" style="padding: 12px 25px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">📄 Imprimer</button>
                <button onclick="window.close()" style="padding: 12px 25px; font-size: 16px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">✖ Fermer</button>
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };
}

function exportToExcel(exam, results) {
    // Create CSV content for Excel with proper format
    const teacherInfo = window.teacherInfo || {};
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF'; // Add BOM for UTF-8

    // Add header information
    csvContent += `"NOTE DE CONTROLE CONTINU"\n`;
    csvContent += `"${exam.title}"\n\n`;
    csvContent += `"Université:","${exam.university || 'Université XYZ'}"\n`;
    csvContent += `"Faculté:","${exam.faculty || 'Faculté ABC'}"\n`;
    csvContent += `"Département:","${exam.department || 'Département DEF'}"\n`;
    csvContent += `"Matière:","${exam.subject || exam.title}"\n`;
    csvContent += `"Classe:","${exam.class || 'Classe GHI'}"\n`;
    csvContent += `"Enseignant:","${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}"\n`;
    csvContent += `"Date d'exportation:","${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}"\n\n`;

    // Add teacher info section
    csvContent += `"INFORMATIONS ENSEIGNANT"\n`;
    csvContent += `"Nom complet:","${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}"\n`;
    csvContent += `"Matricule:","${teacherInfo.id || 'N/A'}"\n`;
    if (teacherInfo.email) csvContent += `"Email:","${teacherInfo.email}"\n`;
    if (teacherInfo.department) csvContent += `"Département:","${teacherInfo.department}"\n`;
    csvContent += '\n';

    // Add table headers with all required columns
    csvContent += '"N°","Nom","Prénom","Matricule","Genre","Email","Téléphone","Note CC/Examen (/20)","Note Participation (/5)","Note Finale (/25)","Pourcentage","Mention","Date"\n';

    // Add student results
    if (results && results.length > 0) {
        results.forEach((result, index) => {
            const examScore = (result.score / result.totalPoints) * 20;
            const percentage = Math.round((result.score / result.totalPoints) * 100);
            
            // Calculate mention
            let mention = 'Échec';
            if (percentage >= 90) mention = 'Excellent';
            else if (percentage >= 80) mention = 'Très Bien';
            else if (percentage >= 70) mention = 'Bien';
            else if (percentage >= 60) mention = 'Assez Bien';
            else if (percentage >= 50) mention = 'Passable';

            // Generate participation grade (placeholder - in real app would come from data)
            const participationGrade = (Math.random() * 5).toFixed(2);
            const finalGrade = (parseFloat(examScore.toFixed(2)) + parseFloat(participationGrade)).toFixed(2);

            csvContent += `"${index + 1}","${result.studentLastname || ''}","${result.studentFirstname || ''}","${result.studentId || ''}","${result.studentGender || 'N/A'}","${result.studentEmail || 'N/A'}","${result.studentPhone || 'N/A'}","${examScore.toFixed(2)}","${participationGrade}","${finalGrade}","${percentage}%","${mention}","${new Date(result.completedAt).toLocaleDateString('fr-FR')}"\n`;
        });
    } else {
        // Add sample data if no results
        generateSampleStudentData().forEach((student, index) => {
            const examGrade = (Math.random() * 20).toFixed(2);
            const participationGrade = (Math.random() * 5).toFixed(2);
            const finalGrade = (parseFloat(examGrade) + parseFloat(participationGrade)).toFixed(2);
            const percentage = Math.round((parseFloat(examGrade) / 20) * 100);
            
            let mention = 'Échec';
            if (percentage >= 90) mention = 'Excellent';
            else if (percentage >= 80) mention = 'Très Bien';
            else if (percentage >= 70) mention = 'Bien';
            else if (percentage >= 60) mention = 'Assez Bien';
            else if (percentage >= 50) mention = 'Passable';

            csvContent += `"${index + 1}","${student.lastname}","${student.firstname}","${student.id}","${student.gender}","N/A","N/A","${examGrade}","${participationGrade}","${finalGrade}","${percentage}%","${mention}","N/A"\n`;
        });
    }

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `note_controle_continu_${exam.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToWord(exam, results) {
    // Create HTML content that can be opened in Word with watermark
    const teacherInfo = window.teacherInfo || {};

    const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <title>NOTE DE CONTROLE CONTINU - ${exam.title}</title>
            <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotPromoteQF/><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
            <style>
                @page {
                    margin: 2.5cm;
                    mso-header-margin: 1.5cm;
                    mso-footer-margin: 1.5cm;
                }
                body {
                    font-family: 'Times New Roman', Times, serif;
                    margin: 0;
                    font-size: 11pt;
                    line-height: 1.5;
                    position: relative;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px double #000;
                    padding-bottom: 15px;
                    margin-bottom: 25px;
                }
                .logo-section {
                    text-align: center;
                    margin-bottom: 12px;
                }
                .logo {
                    height: 70px;
                    width: auto;
                }
                .university-info {
                    text-align: center;
                }
                .university-name {
                    font-size: 16pt;
                    font-weight: bold;
                    margin: 5px 0;
                    text-transform: uppercase;
                }
                .faculty-info {
                    font-size: 12pt;
                    margin: 3px 0;
                    font-weight: 500;
                }
                .exam-title-section {
                    text-align: center;
                    margin: 25px 0;
                    clear: both;
                }
                .exam-title-section h1 {
                    font-size: 14pt;
                    font-weight: bold;
                    margin: 10px 0;
                    text-decoration: underline;
                }
                .exam-title-section h2 {
                    font-size: 13pt;
                    font-weight: bold;
                    margin: 8px 0;
                }
                .exam-info {
                    margin: 20px 0;
                    padding: 15px;
                    background: #f9f9f9;
                    border: 1px solid #ddd;
                }
                .exam-info p {
                    margin: 5px 0;
                }
                .results-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 10pt;
                }
                .results-table th,
                .results-table td {
                    border: 1px solid #333;
                    padding: 8px;
                    text-align: center;
                }
                .results-table th {
                    background-color: #e8e8e8;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 9pt;
                }
                .results-table tbody tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .teacher-info {
                    margin-top: 30px;
                    padding: 15px;
                    border-top: 2px solid #000;
                }
                .signature-section {
                    margin-top: 50px;
                    display: flex;
                    justify-content: space-between;
                }
                .signature-box {
                    width: 45%;
                    text-align: center;
                }
                .signature-line {
                    border-top: 1px solid #000;
                    margin-top: 60px;
                    padding-top: 5px;
                }
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    opacity: 0.08;
                    z-index: -1;
                    width: 60%;
                }
            </style>
        </head>
        <body>
            <img src="Logo.png" class="watermark" onerror="this.style.display='none'">
            <div class="header">
                <div class="logo-section">
                    <img src="Logo.png" alt="Logo" class="logo" onerror="this.style.display='none'">
                </div>
                <div class="university-info">
                    <div class="university-name">${exam.university || 'UNIVERSITÉ XYZ'}</div>
                    <div class="faculty-info">${exam.faculty || 'Faculté ABC'}</div>
                    <div class="faculty-info">${exam.department || 'Département DEF'}</div>
                </div>
            </div>
            <div class="exam-title-section">
                <h1>NOTE DE CONTROLE CONTINU</h1>
                <h2>${exam.title}</h2>
            </div>

            <div class="exam-info">
                <p><strong>Matière:</strong> ${exam.subject || exam.title}</p>
                <p><strong>Classe:</strong> ${exam.class || 'Classe GHI'}</p>
                <p><strong>Enseignant:</strong> ${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}</p>
                <p><strong>Date d'exportation:</strong> ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <table class="results-table">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Matricule</th>
                        <th>Note/20</th>
                        <th>Pourcentage</th>
                        <th>Mention</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${results && results.length > 0 ? results.map((result, index) => {
                        const score = (result.score / result.totalPoints) * 20;
                        const percentage = Math.round((result.score / result.totalPoints) * 100);
                        let mention = 'Échec';
                        if (percentage >= 90) mention = 'Excellent';
                        else if (percentage >= 80) mention = 'Très Bien';
                        else if (percentage >= 70) mention = 'Bien';
                        else if (percentage >= 60) mention = 'Assez Bien';
                        else if (percentage >= 50) mention = 'Passable';
                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${result.studentLastname}</td>
                                <td>${result.studentFirstname}</td>
                                <td>${result.studentId}</td>
                                <td>${score.toFixed(2)}</td>
                                <td>${percentage}%</td>
                                <td>${mention}</td>
                                <td>${new Date(result.completedAt).toLocaleDateString('fr-FR')}</td>
                            </tr>
                        `;
                    }).join('') : generateSampleStudentData().map((student, index) => {
                        const examGrade = (Math.random() * 20).toFixed(2);
                        const percentage = Math.round((parseFloat(examGrade) / 20) * 100);
                        let mention = 'Échec';
                        if (percentage >= 90) mention = 'Excellent';
                        else if (percentage >= 80) mention = 'Très Bien';
                        else if (percentage >= 70) mention = 'Bien';
                        else if (percentage >= 60) mention = 'Assez Bien';
                        else if (percentage >= 50) mention = 'Passable';
                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${student.lastname}</td>
                                <td>${student.firstname}</td>
                                <td>${student.id}</td>
                                <td>${examGrade}</td>
                                <td>${percentage}%</td>
                                <td>${mention}</td>
                                <td>N/A</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <div class="teacher-info">
                <p><strong>Enseignant:</strong> ${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}</p>
                <p><strong>Matricule:</strong> ${teacherInfo.id || ''}</p>
                ${teacherInfo.email ? `<p><strong>Email:</strong> ${teacherInfo.email}</p>` : ''}
                ${teacherInfo.department ? `<p><strong>Département:</strong> ${teacherInfo.department}</p>` : ''}
            </div>

            <div class="signature-section">
                <div class="signature-box">
                    <p><strong>Le Chef de Département</strong></p>
                    <div class="signature-line"></div>
                </div>
                <div class="signature-box">
                    <p><strong>L'Enseignant</strong></p>
                    <div class="signature-line">
                        <p style="margin-top: 5px;">${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}</p>
                    </div>
                </div>
            </div>

            <div style="text-align: right; margin-top: 30px; font-style: italic;">
                <p>Fait à ${exam.university ? exam.university.split(' ')[0] : ''}, le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
        </body>
        </html>
    `;

    // Create blob and download
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `note_controle_continu_${exam.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportToPDF(exam, results) {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const teacherInfo = window.teacherInfo || {};

    // Generate HTML content for PDF matching the university format
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>NOTE DE CONTRÔLE CONTINU - ${exam.title}</title>
            <style>
                @page {
                    margin: 1.5cm;
                }
                body { 
                    font-family: 'Times New Roman', Times, serif; 
                    margin: 0;
                    padding: 20px;
                    font-size: 11pt;
                    line-height: 1.4;
                }
                .header-container {
                    display: table;
                    width: 100%;
                    margin-bottom: 10px;
                }
                .header-left {
                    display: table-cell;
                    width: 33%;
                    vertical-align: top;
                    text-align: left;
                }
                .header-center {
                    display: table-cell;
                    width: 34%;
                    vertical-align: top;
                    text-align: center;
                }
                .header-right {
                    display: table-cell;
                    width: 33%;
                    vertical-align: top;
                    text-align: right;
                }
                .header-left p, .header-right p {
                    margin: 2px 0;
                    font-size: 10pt;
                    font-weight: bold;
                }
                .logo { 
                    max-height: 70px; 
                    width: auto;
                }
                .dotted-line {
                    border-top: 2px dotted #000;
                    margin: 15px 0;
                }
                .title-section {
                    text-align: center;
                    margin: 20px 0;
                }
                .title-section h1 {
                    font-size: 14pt;
                    font-weight: bold;
                    margin: 10px 0;
                    text-decoration: underline;
                }
                .title-section h2 {
                    font-size: 12pt;
                    font-weight: normal;
                    margin: 5px 0;
                }
                .results-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 10pt;
                }
                .results-table th,
                .results-table td {
                    border: 1px solid #000;
                    padding: 8px 6px;
                    text-align: center;
                }
                .results-table th {
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 9pt;
                }
                .results-table th.green-header {
                    background-color: #90c050;
                    color: #000;
                }
                .results-table td:first-child {
                    text-align: left;
                    padding-left: 10px;
                }
                .signature-section {
                    margin-top: 50px;
                    display: flex;
                    justify-content: space-between;
                }
                .signature-box {
                    width: 45%;
                    text-align: center;
                }
                .signature-line {
                    border-top: 1px solid #000;
                    margin-top: 60px;
                    padding-top: 5px;
                }
                @media print { 
                    .no-print { display: none !important; }
                    body { 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .results-table th.green-header {
                        background-color: #90c050 !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header-container">
                <div class="header-left">
                    <p>${exam.university || 'Université Polytechnique de Mongo'}</p>
                    <p>${exam.faculty || 'Faculté des Mines et Géologie'}</p>
                    <p>${exam.department || 'Département de Géomatique'}</p>
                </div>
                <div class="header-center">
                    <img src="Logo.png" alt="Logo" class="logo" onerror="this.style.display='none'">
                </div>
                <div class="header-right">
                    <p>Année académique 2025-2026</p>
                </div>
            </div>
            
            <div class="dotted-line"></div>
            
            <div class="title-section">
                <h1>NOTE DE CONTRÔLE CONTINU</h1>
                <h2>${exam.subject || exam.title}</h2>
            </div>

            <table class="results-table">
                <thead>
                    <tr>
                        <th class="green-header">NOM ET PRÉNOMS</th>
                        <th>MATRICULE</th>
                        <th>CC</th>
                        <th>Participation</th>
                        <th>Note finale</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map((result, index) => {
                        const examScore = (result.score / result.totalPoints) * 20;
                        const participation = (Math.random() * 5).toFixed(1);
                        const finalNote = (parseFloat(examScore.toFixed(1)) + parseFloat(participation)).toFixed(1);
                        return `
                            <tr>
                                <td>${result.studentLastname} ${result.studentFirstname}</td>
                                <td>${result.studentId}</td>
                                <td>${examScore.toFixed(1)}</td>
                                <td>${participation}</td>
                                <td>${finalNote}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <div class="signature-section">
                <div class="signature-box">
                    <p><strong>Le Chef de Département</strong></p>
                    <div class="signature-line"></div>
                </div>
                <div class="signature-box">
                    <p><strong>L'Enseignant</strong></p>
                    <div class="signature-line">
                        <p style="margin-top: 5px;">${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}</p>
                    </div>
                </div>
            </div>

            <div style="text-align: right; margin-top: 30px; font-size: 10pt; font-style: italic;">
                <p>Fait à l'Université, le 19 décembre 2025</p>
            </div>

            <div class="no-print" style="margin-top: 30px; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 5px;">
                <button onclick="window.print()" style="padding: 12px 25px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">📄 Imprimer</button>
                <button onclick="window.close()" style="padding: 12px 25px; font-size: 16px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">✖ Fermer</button>
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };
}

// Print results directly
function printResults() {
    const examId = document.getElementById('exam-selector').value;

    if (!examId) {
        alert('Veuillez sélectionner une épreuve.');
        return;
    }

    const exam = window.exams.find(e => e.id === examId);
    const results = window.examResults[examId] || [];

    if (results.length === 0) {
        alert('Aucun résultat disponible pour cette épreuve.');
        return;
    }

    // Create a print-friendly version with watermark
    const printWindow = window.open('', '_blank');
    const teacherInfo = window.teacherInfo || {};

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>NOTE DE CONTROLE CONTINU - ${exam.title}</title>
            <style>
                @page {
                    margin: 2cm;
                    size: A4;
                }
                @media print {
                    body { 
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    .no-print { display: none !important; }
                    .results-table th {
                        background-color: #e8e8e8 !important;
                    }
                    .results-table tbody tr:nth-child(even) {
                        background-color: #f9f9f9 !important;
                    }
                }
                body {
                    font-family: 'Times New Roman', serif;
                    font-size: 11pt;
                    line-height: 1.5;
                    margin: 0;
                    padding: 20px;
                    position: relative;
                    color: #000;
                }
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    opacity: 0.08;
                    z-index: -1;
                    width: 60%;
                    pointer-events: none;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px double #000;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .logo-section {
                    text-align: center;
                    margin-bottom: 10px;
                }
                .logo {
                    height: 70px;
                    width: auto;
                }
                .university-info {
                    text-align: center;
                    line-height: 1.4;
                }
                .university-name {
                    font-size: 16pt;
                    font-weight: bold;
                    margin: 5px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .faculty-info {
                    font-size: 12pt;
                    margin: 3px 0;
                    font-weight: 500;
                }
                .exam-title {
                    font-size: 14pt;
                    font-weight: bold;
                    text-align: center;
                    margin: 20px 0;
                    text-decoration: underline;
                    text-transform: uppercase;
                }
                .exam-details {
                    margin: 20px 0;
                    padding: 15px;
                    background: #f9f9f9;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .exam-details p {
                    margin: 5px 0;
                    font-size: 11pt;
                }
                .results-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 10pt;
                }
                .results-table th,
                .results-table td {
                    border: 1px solid #333;
                    padding: 10px 6px;
                    text-align: center;
                }
                .results-table th {
                    background-color: #e8e8e8;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 9pt;
                }
                .results-table tbody tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .signature-section {
                    margin-top: 50px;
                    display: flex;
                    justify-content: space-between;
                    page-break-inside: avoid;
                }
                .signature-box {
                    width: 45%;
                    text-align: center;
                }
                .signature-box p {
                    margin: 5px 0;
                    font-size: 11pt;
                }
                .signature-line {
                    border-top: 1px solid #000;
                    margin-top: 60px;
                    padding-top: 5px;
                }
                .date-section {
                    text-align: right;
                    margin-top: 20px;
                    font-style: italic;
                    font-size: 10pt;
                }
                .statistics {
                    margin-top: 30px;
                    padding: 15px;
                    background: #f0f0f0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                .statistics h3 {
                    margin-top: 0;
                    font-size: 12pt;
                    text-decoration: underline;
                }
                .statistics p {
                    margin: 5px 0;
                    font-size: 10pt;
                }
            </style>
        </head>
        <body>
            <img src="Logo.png" class="watermark" onerror="this.style.display='none'">
            <div class="header">
                <div class="logo-section">
                    <img src="Logo.png" alt="Logo" class="logo" onerror="this.style.display='none'">
                </div>
                <div class="university-info">
                    <div class="university-name">${exam.university || 'UNIVERSITÉ XYZ'}</div>
                    <div class="faculty-info">${exam.faculty || 'Faculté ABC'}</div>
                    <div class="faculty-info">${exam.department || 'Département DEF'}</div>
                </div>
            </div>
            <div class="exam-title">NOTE DE CONTROLE CONTINU</div>

            <div class="exam-details">
                <p><strong>Matière:</strong> ${exam.subject || exam.title}</p>
                <p><strong>Classe:</strong> ${exam.class || 'Classe GHI'}</p>
                <p><strong>Enseignant:</strong> ${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}</p>
                <p><strong>Date d'exportation:</strong> ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <table class="results-table">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Nom et Prénom</th>
                        <th>Matricule</th>
                        <th>Genre</th>
                        <th>Note/20</th>
                        <th>Pourcentage</th>
                        <th>Mention</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map((result, index) => {
                        const score = (result.score / result.totalPoints) * 20;
                        const percentage = Math.round((result.score / result.totalPoints) * 100);
                        let mention = 'Échec';
                        if (percentage >= 90) mention = 'Excellent';
                        else if (percentage >= 80) mention = 'Très Bien';
                        else if (percentage >= 70) mention = 'Bien';
                        else if (percentage >= 60) mention = 'Assez Bien';
                        else if (percentage >= 50) mention = 'Passable';
                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${result.studentLastname} ${result.studentFirstname}</td>
                                <td>${result.studentId}</td>
                                <td>${result.studentGender || 'N/A'}</td>
                                <td>${score.toFixed(2)}</td>
                                <td>${percentage}%</td>
                                <td>${mention}</td>
                                <td>${new Date(result.completedAt).toLocaleDateString('fr-FR')}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <div class="signature-section">
                <div class="signature-box">
                    <p><strong>Le Chef de Département</strong></p>
                    <div class="signature-line"></div>
                </div>
                <div class="signature-box">
                    <p><strong>L'Enseignant</strong></p>
                    <div class="signature-line">
                        <p style="margin-top: 5px;">${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}</p>
                    </div>
                </div>
            </div>

            <div class="date-section">
                <p>Fait à l'Université, le 19 décembre 2025</p>
            </div>

            <div class="no-print" style="margin-top: 30px; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 5px;">
                <button onclick="window.print()" style="padding: 12px 25px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">📄 Imprimer</button>
                <button onclick="window.close()" style="padding: 12px 25px; font-size: 16px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">✖ Fermer</button>
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };
}

// Print current exam
function printExam() {
    const exam = AppState.currentExam;
    if (!exam) {
        alert('Aucun examen en cours.');
        return;
    }

    const printWindow = window.open('', '_blank');
    const student = AppState.currentUser;

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${exam.title} - Examen</title>
            <style>
                @page {
                    margin: 2cm;
                    size: A4;
                }
                @media print {
                    body { 
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    .exam-timer { display: none !important; }
                    .exam-actions { display: none !important; }
                    .no-print { display: none !important; }
                }
                body {
                    font-family: 'Times New Roman', serif;
                    font-size: 11pt;
                    line-height: 1.5;
                    margin: 0;
                    padding: 15px;
                    color: #000;
                }
                .header {
                    background: white;
                    border: 3px double #000;
                    margin-bottom: 20px;
                    padding: 15px;
                    text-align: center;
                }
                .logo-container {
                    text-align: center;
                    margin-bottom: 10px;
                }
                .app-logo {
                    height: 60px;
                }
                h1 {
                    color: black;
                    font-size: 18pt;
                    margin: 10px 0;
                    text-transform: uppercase;
                    font-weight: bold;
                }
                .exam-header-info {
                    margin: 15px 0;
                    padding: 15px;
                    background: #f9f9f9;
                    border: 1px solid #ddd;
                    text-align: left;
                }
                .exam-header-info p {
                    margin: 5px 0;
                    font-size: 10pt;
                }
                .student-info {
                    margin: 20px 0;
                    padding: 15px;
                    border: 2px solid #000;
                    background: #fff;
                }
                .student-info p {
                    margin: 8px 0;
                    font-size: 11pt;
                }
                .student-info .fill-line {
                    display: inline-block;
                    min-width: 300px;
                    border-bottom: 1px solid #000;
                    margin-left: 10px;
                }
                .exam-content {
                    background: white;
                    border: 1px solid #000;
                    padding: 20px;
                    margin-top: 20px;
                }
                .question-item {
                    margin-bottom: 25px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #ccc;
                    page-break-inside: avoid;
                }
                .question-item:last-child {
                    border-bottom: none;
                }
                .question-text {
                    font-size: 11pt;
                    font-weight: bold;
                    margin-bottom: 15px;
                    color: black;
                    background: #f5f5f5;
                    padding: 12px;
                    border-left: 4px solid #333;
                }
                .question-points {
                    color: #555;
                    font-style: italic;
                    font-size: 10pt;
                }
                .options-container {
                    margin-left: 20px;
                }
                .option-item {
                    margin-bottom: 12px;
                    padding: 10px;
                    background: white;
                    border: 1px solid #ddd;
                }
                .option-item label {
                    display: block;
                    cursor: default;
                    font-size: 11pt;
                    color: black;
                }
                .option-item input[type="radio"] {
                    margin-right: 10px;
                    width: 16px;
                    height: 16px;
                }
                .exam-footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #000;
                    text-align: center;
                }
                .signature-section {
                    margin-top: 30px;
                    display: flex;
                    justify-content: space-between;
                }
                .signature-box {
                    width: 45%;
                    text-align: center;
                }
                .signature-line {
                    border-top: 1px solid #000;
                    margin-top: 50px;
                    padding-top: 5px;
                }
                .instructions {
                    margin: 20px 0;
                    padding: 15px;
                    background: #ffffcc;
                    border: 2px solid #ffcc00;
                    border-radius: 5px;
                }
                .instructions h3 {
                    margin-top: 0;
                    font-size: 12pt;
                }
                .instructions ul {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                .instructions li {
                    margin: 5px 0;
                    font-size: 10pt;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo-container">
                    <img src="Logo.png" alt="Logo" class="app-logo" onerror="this.style.display='none'">
                </div>
                <h1>${exam.title}</h1>
                <div class="exam-header-info">
                    <p><strong>Université:</strong> ${exam.university || 'N/A'}</p>
                    <p><strong>Faculté:</strong> ${exam.faculty || 'N/A'}</p>
                    <p><strong>Département:</strong> ${exam.department || 'N/A'}</p>
                    <p><strong>Matière:</strong> ${exam.subject || 'N/A'}</p>
                    <p><strong>Classe:</strong> ${exam.class || 'N/A'}</p>
                    <p><strong>Durée:</strong> ${exam.duration} minutes</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
            </div>

            <div class="instructions">
                <h3>📝 INSTRUCTIONS</h3>
                <ul>
                    <li>Lisez attentivement chaque question avant de répondre</li>
                    <li>Cochez une seule réponse par question</li>
                    <li>Vérifiez vos réponses avant de soumettre</li>
                    <li>Aucune correction ne sera acceptée après la soumission</li>
                    <li>Durée totale de l'examen: ${exam.duration} minutes</li>
                </ul>
            </div>

            <div class="student-info">
                <p><strong>Nom de l'étudiant:</strong> <span class="fill-line">${student ? student.lastname + ' ' + student.firstname : ''}</span></p>
                <p><strong>Matricule:</strong> <span class="fill-line">${student ? student.id : ''}</span></p>
                <p><strong>Genre:</strong> <span class="fill-line">${student && student.gender ? (student.gender === 'M' ? 'Masculin' : 'Féminin') : ''}</span></p>
            </div>

            <div class="exam-content">
                ${exam.questions.map((question, index) => `
                    <div class="question-item">
                        <div class="question-text">
                            <strong>Question ${index + 1}.</strong> ${question.text}
                            <div class="question-points">(${question.points} point${question.points > 1 ? 's' : ''})</div>
                        </div>

                        <div class="options-container">
                            ${question.options.map((option, optionIndex) => `
                                <div class="option-item">
                                    <label>
                                        <input type="radio" name="question-${index}" value="${optionIndex}">
                                        <strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${option.text}
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="exam-footer">
                <p><strong>FIN DE L'EXAMEN</strong></p>
                <div class="signature-section">
                    <div class="signature-box">
                        <p><strong>Signature de l'étudiant</strong></p>
                        <div class="signature-line"></div>
                    </div>
                    <div class="signature-box">
                        <p><strong>Signature du surveillant</strong></p>
                        <div class="signature-line"></div>
                    </div>
                </div>
            </div>

            <div class="no-print" style="margin-top: 30px; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 5px;">
                <button onclick="window.print()" style="padding: 12px 25px; font-size: 16px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">📄 Imprimer</button>
                <button onclick="window.close()" style="padding: 12px 25px; font-size: 16px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">✖ Fermer</button>
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };
}

// Generate Excel file (demo)
function generateExcelFile(exam, results) {
    // In a real implementation, you would use a library like SheetJS
    // This is just a placeholder for the functionality
    console.log('Generating Excel file with:', { exam, results, teacherInfo: window.teacherInfo });
    
    // Sample structure:
    // - Header with teacher info
    // - Exam details
    // - Student results table with columns: Nom, Prénom, Matricule, Genre, Note CC/Examen, Note Participation, Note Finale
    // - Logo watermark
}

// Generate Word file (demo)
function generateWordFile(exam, results) {
    // In a real implementation, you would use a library like Docxtemplater
    // This is just a placeholder for the functionality
    console.log('Generating Word file with:', { exam, results, teacherInfo: window.teacherInfo });
    
    // Sample structure:
    // - Header with teacher info
    // - Exam details
    // - Student results table with columns: Nom, Prénom, Matricule, Genre, Note CC/Examen, Note Participation, Note Finale
    // - Logo watermark
}

// Generate PDF file (demo)
function generatePdfFile(exam, results) {
    // In a real implementation, you would use a library like jsPDF
    // This is just a placeholder for the functionality
    console.log('Generating PDF file with:', { exam, results, teacherInfo: window.teacherInfo });
    
    // Sample structure:
    // - Header with teacher info
    // - Exam details
    // - Student results table with columns: Nom, Prénom, Matricule, Genre, Note CC/Examen, Note Participation, Note Finale
    // - Logo watermark
}

// Generate sample student data for demonstration
function generateSampleStudentData() {
    return [
        { lastname: 'Dupont', firstname: 'Jean', id: '2024001', gender: 'M' },
        { lastname: 'Martin', firstname: 'Marie', id: '2024002', gender: 'F' },
        { lastname: 'Dubois', firstname: 'Pierre', id: '2024003', gender: 'M' },
        { lastname: 'Garcia', firstname: 'Sophie', id: '2024004', gender: 'F' },
        { lastname: 'Lefebvre', firstname: 'Antoine', id: '2024005', gender: 'M' },
        { lastname: 'Moreau', firstname: 'Camille', id: '2024006', gender: 'F' },
        { lastname: 'Roux', firstname: 'Lucas', id: '2024007', gender: 'M' },
        { lastname: 'Fournier', firstname: 'Emma', id: '2024008', gender: 'F' },
        { lastname: 'Girard', firstname: 'Thomas', id: '2024009', gender: 'M' },
        { lastname: 'Andre', firstname: 'Julie', id: '2024010', gender: 'F' }
    ];
}
