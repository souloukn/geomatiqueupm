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
        });
    });
    
    // Developer code validation
    document.getElementById('developer-code-btn').addEventListener('click', handleDeveloperCodeValidation);
    
    // Teacher account creation
    document.getElementById('create-teacher-account-btn').addEventListener('click', handleTeacherAccountCreation);
    
    // Teacher account login
    document.getElementById('teacher-account-login-btn').addEventListener('click', handleTeacherAccountLogin);
    
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

// Toggle language function
function toggleLanguage() {
    AppState.language = AppState.language === 'fr' ? 'en' : 'fr';
    localStorage.setItem('language', AppState.language);
    applyLanguage();
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
        return;
    }
    
    const results = window.examResults[examId] || [];
    const tbody = document.querySelector('#results-table tbody');
    tbody.innerHTML = '';
    
    if (results.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4" class="no-results">Aucun résultat disponible pour cette épreuve</td>`;
        tbody.appendChild(row);
    } else {
        results.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.studentId}</td>
                <td>${result.score} / ${result.totalPoints}</td>
                <td>${Math.round(result.timeUsed)} min</td>
                <td>Terminé</td>
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
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    position: relative;
                    background-image: url('Logo.png');
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: 30%;
                    background-opacity: 0.1;
                }
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    opacity: 0.1;
                    z-index: -1;
                    width: 50%;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .logo-section {
                    text-align: center;
                    margin-bottom: 15px;
                }
                .logo { max-height: 60px; width: auto; }
                .university-info {
                    text-align: center;
                }
                .university-name {
                    font-size: 18pt;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                .faculty-info {
                    font-size: 14pt;
                    margin-bottom: 4px;
                }
                .exam-title-section {
                    text-align: center;
                    margin: 20px 0;
                    clear: both;
                }
                @media print { 
                    .no-print { display: none; }
                    body { 
                        background-image: url('Logo.png');
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: 30%;
                        background-opacity: 0.1;
                        -webkit-print-color-adjust: exact;
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

            <div class="no-print" style="margin-top: 30px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px;">Imprimer</button>
                <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; margin-left: 10px;">Fermer</button>
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
    let csvContent = 'data:text/csv;charset=utf-8,';

    // Add header information
    csvContent += `"NOTE DE CONTROLE CONTINU"\n`;
    csvContent += `"${exam.title}"\n\n`;
    csvContent += `"Université: ${exam.university || 'Université XYZ'}"\n`;
    csvContent += `"Faculté: ${exam.faculty || 'Faculté ABC'}"\n`;
    csvContent += `"Département: ${exam.department || 'Département DEF'}"\n`;
    csvContent += `"Matière: ${exam.subject || exam.title}"\n`;
    csvContent += `"Classe: ${exam.class || 'Classe GHI'}"\n`;
    csvContent += `"Enseignant: ${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}"\n`;
    csvContent += `"Date d'exportation: ${new Date().toLocaleDateString('fr-FR')}"\n\n`;

    // Add teacher info
    csvContent += `"Enseignant: ${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}"\n`;
    csvContent += `"Matricule: ${teacherInfo.id || ''}"\n`;
    if (teacherInfo.email) csvContent += `"Email: ${teacherInfo.email}"\n`;
    if (teacherInfo.department) csvContent += `"Département: ${teacherInfo.department}"\n`;
    csvContent += '\n';

    // Add table headers with required columns
    csvContent += '"Nom","Prénom","Matricule","Genre","Note de CC ou examen","Note de participation","Note finale","Pourcentage","Mention","Date"\n';

    // Add actual student results
    if (results && results.length > 0) {
        results.forEach(result => {
            const score = (result.score / exam.questions.length) * 20;
            const percentage = Math.round((result.score / exam.questions.length) * 100);
            let mention = 'Échec';
            if (percentage >= 90) mention = 'Excellent';
            else if (percentage >= 80) mention = 'Très Bien';
            else if (percentage >= 70) mention = 'Bien';
            else if (percentage >= 60) mention = 'Assez Bien';
            else if (percentage >= 50) mention = 'Passable';

            // For demonstration, generate participation grade (in real app, this would come from data)
            const participationGrade = (Math.random() * 5).toFixed(2);
            const finalGrade = (parseFloat(score.toFixed(2)) + parseFloat(participationGrade)).toFixed(2);

            csvContent += `"${result.studentLastname}","${result.studentFirstname}","${result.studentId}","${result.studentGender || 'N/A'}","${result.studentEmail || ''}","${result.studentPhone || ''}","${score.toFixed(2)}/20","${participationGrade}/5","${finalGrade}/25","${percentage}%","${mention}","${new Date(result.completedAt).toLocaleDateString('fr-FR')}"\n`;
        });
    } else {
        // If no results, add sample data
        generateSampleStudentData().forEach(student => {
            const examGrade = (Math.random() * 20).toFixed(2);
            const participationGrade = (Math.random() * 5).toFixed(2);
            const finalGrade = (parseFloat(examGrade) + parseFloat(participationGrade)).toFixed(2);

            csvContent += `"${student.lastname}","${student.firstname}","${student.id}","${student.gender}","${examGrade}/20","${participationGrade}/5","${finalGrade}/25","N/A","N/A","N/A"\n`;
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
            <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom><w:DoNotPromoteQF/><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
            <style>
                body {
                    font-family: 'Times New Roman', Times, serif;
                    margin: 1in;
                    font-size: 12pt;
                    position: relative;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .logo-section {
                    text-align: center;
                    margin-bottom: 15px;
                }
                .logo {
                    height: 80px;
                    width: auto;
                }
                .university-info {
                    text-align: center;
                }
                .university-name {
                    font-size: 18pt;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                .faculty-info {
                    font-size: 14pt;
                    margin-bottom: 4px;
                }
                .exam-title-section {
                    text-align: center;
                    margin: 20px 0;
                    clear: both;
                }
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    opacity: 0.1;
                    z-index: -1;
                    width: 50%;
                }
            </style>
        </head>
        <body>
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
        </body>
        </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `note_controle_continu_${exam.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            <link rel="stylesheet" href="styles.css">
            <style>
                @media print {
                    body { print-color-adjust: exact; }
                    .no-print { display: none !important; }
                }
                body {
                    font-family: 'Times New Roman', serif;
                    font-size: 12pt;
                    line-height: 1.4;
                    margin: 0;
                    padding: 20px;
                    position: relative;
                    background-image: url('Logo.png');
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: 30%;
                    background-opacity: 0.1;
                }
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    opacity: 0.1;
                    z-index: -1;
                    width: 50%;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .logo-section {
                    text-align: center;
                    margin-bottom: 15px;
                }
                .logo {
                    height: 80px;
                    width: auto;
                }
                .university-info {
                    text-align: center;
                }
                .university-name {
                    font-size: 18pt;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                .faculty-info {
                    font-size: 14pt;
                    margin-bottom: 4px;
                }
                .exam-title {
                    font-size: 16pt;
                    font-weight: bold;
                    text-align: center;
                    margin: 20px 0;
                    text-decoration: underline;
                }
                .exam-details {
                    margin: 20px 0;
                    padding: 10px;
                    border: 1px solid #000;
                }
                .results-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 11pt;
                }
                .results-table th,
                .results-table td {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: left;
                }
                .results-table th {
                    background-color: #f0f0f0;
                    font-weight: bold;
                }
                .signature-section {
                    margin-top: 50px;
                    display: flex;
                    justify-content: space-between;
                }
                .signature-box {
                    width: 200px;
                    text-align: center;
                    border-top: 1px solid #000;
                    padding-top: 10px;
                }
                .date-section {
                    text-align: right;
                    margin-top: 20px;
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
            <div class="exam-title">NOTE DE CONTROLE CONTINU</div>

            <div class="exam-details">
                <p><strong>Matière:</strong> ${exam.subject || exam.title}</p>
                <p><strong>Classe:</strong> ${exam.class || 'Classe GHI'}</p>
                <p><strong>Enseignant:</strong> ${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}</p>
                <p><strong>Date d'exportation:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            <table class="results-table">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Nom et Prénom</th>
                        <th>Matricule</th>
                        <th>Note/20</th>
                        <th>Pourcentage</th>
                        <th>Mention</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map((result, index) => {
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
                                <td>${result.studentLastname} ${result.studentFirstname}</td>
                                <td>${result.studentId}</td>
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
                    <p>Le Chef de Département</p>
                </div>
                <div class="signature-box">
                    <p>L'Enseignant</p>
                    <p>${teacherInfo.firstname || ''} ${teacherInfo.lastname || ''}</p>
                </div>
            </div>

            <div class="date-section">
                <p>Fait à ${exam.university?.split(' ')[0] || 'Lieu'}, le ${new Date().toLocaleDateString('fr-FR')}</p>
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

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${exam.title} - Examen</title>
            <link rel="stylesheet" href="styles.css">
            <style>
                @media print {
                    body { print-color-adjust: exact; }
                    .exam-timer { display: none !important; }
                    .exam-actions { display: none !important; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <header style="background: white; border: 2px solid #000; border-radius: 0; box-shadow: none; margin-bottom: 20px; padding: 15px;">
                    <div class="logo-container">
                        <img src="Logo.png" alt="Logo" class="app-logo" style="height: 50px;">
                    </div>
                    <h1 style="color: black; text-shadow: none; font-size: 24px;">${exam.title}</h1>
                </header>

                <div class="exam-content" style="background: white; border: 1px solid #000; border-radius: 0; box-shadow: none; padding: 20px;">
                    <div style="margin-bottom: 20px;">
                        <p><strong>Université:</strong> ${exam.university || ''}</p>
                        <p><strong>Faculté:</strong> ${exam.faculty || ''}</p>
                        <p><strong>Département:</strong> ${exam.department || ''}</p>
                        <p><strong>Matière:</strong> ${exam.subject || ''}</p>
                        <p><strong>Classe:</strong> ${exam.class || ''}</p>
                        <p><strong>Durée:</strong> ${exam.duration} minutes</p>
                        <p><strong>Nom de l'étudiant:</strong> ___________________________</p>
                        <p><strong>Matricule:</strong> ___________________________</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
                    </div>

                    ${exam.questions.map((question, index) => `
                        <div class="question-item" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #ccc; page-break-inside: avoid;">
                            <div class="question-text" style="font-size: 14px; font-weight: bold; margin-bottom: 15px; color: black; background: #f9f9f9; padding: 15px; border-radius: 0;">
                                ${index + 1}. ${question.text}
                            </div>

                            <div class="options-container" style="margin-left: 20px;">
                                ${question.options.map((option, optionIndex) => `
                                    <div style="margin-bottom: 10px; padding: 10px; background: white; border: 1px solid #ddd; border-radius: 0;">
                                        <label style="display: block; cursor: default; font-size: 13px; color: black;">
                                            <input type="radio" name="question-${index}" value="${optionIndex}" style="margin-right: 10px;">
                                            <span>${String.fromCharCode(65 + optionIndex)}. ${option}</span>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #000; text-align: center;">
                        <p><strong>Fin de l'examen</strong></p>
                        <p style="margin-top: 20px;">Signature de l'étudiant: ___________________________</p>
                    </div>
                </div>
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
