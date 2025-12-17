# Student Evaluation Tool

A web-based educational assessment application built with HTML, CSS, and vanilla JavaScript using browser local storage.

## Features

### Teacher Interface
- Authentication with teacher code (pre-generated: TEACHER123)
- Create and manage exams
- Automatic exam code generation
- Create multiple-choice questions
- View student results
- Publish results
- Export results (Excel, Word, PDF - simulated)

### Student Interface
- Access exams via exam code and student ID
- Security: one attempt per student per exam
- Integrated timer
- Question navigation
- Auto-submission when time expires

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- localStorage (client-side data storage)

## Installation and Usage

### Local Development
1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Start using the application

### Deployment to GitHub Pages
1. Fork this repository
2. Go to repository Settings
3. Scroll to "Pages" section
4. Select "Deploy from a branch"
5. Choose branch (usually main) and /root folder
6. Click Save

### Teacher Login
- Click "Teacher"
- Enter teacher code: `TEACHER123`
- Access exam management interface

### Student Login
- Click "Student"
- Enter exam code provided by teacher
- Enter your student ID

## Project Structure

```
.
├── index.html          # Main page
├── styles.css          # Stylesheet
├── app.js              # Application logic
├── teacher-login.html  # Alternative teacher login page
├── Logo.png            # Application logo
└── docs/
    └── README.md       # This file
```

## Data Storage

All data is stored in the browser's `localStorage`:
- Exam information
- Student results
- Teacher code

## Security

- Strictly separated interfaces
- Access code verification
- Blocking multiple attempts per student ID
- Protection against direct access to results

## Possible Enhancements

- Multiple choice questions
- Random question mode
- Responsive interface (mobile/tablet)
- Exam history
- Advanced statistics

## Important Notes

- This application runs entirely client-side
- Data is stored locally in the browser
- For production use, additional security measures would be necessary