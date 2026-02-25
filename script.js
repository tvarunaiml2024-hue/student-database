// Sample student data
let students = [
    { id: 'S001', name: 'John Anderson', email: 'john.anderson@school.com', grade: 12, gpa: 3.8 },
    { id: 'S002', name: 'Sarah Mitchell', email: 'sarah.mitchell@school.com', grade: 11, gpa: 3.9 },
    { id: 'S003', name: 'Michael Chen', email: 'michael.chen@school.com', grade: 10, gpa: 3.6 },
    { id: 'S004', name: 'Emma Wilson', email: 'emma.wilson@school.com', grade: 12, gpa: 3.7 },
    { id: 'S005', name: 'James Rodriguez', email: 'james.rodriguez@school.com', grade: 11, gpa: 3.5 },
    { id: 'S006', name: 'Olivia Brown', email: 'olivia.brown@school.com', grade: 10, gpa: 3.4 },
    { id: 'S007', name: 'David Martinez', email: 'david.martinez@school.com', grade: 12, gpa: 3.9 },
    { id: 'S008', name: 'Sophia Johnson', email: 'sophia.johnson@school.com', grade: 11, gpa: 3.8 },
    { id: 'S009', name: 'Lucas Taylor', email: 'lucas.taylor@school.com', grade: 10, gpa: 3.3 },
    { id: 'S010', name: 'Ava Garcia', email: 'ava.garcia@school.com', grade: 12, gpa: 3.6 }
];

let sortConfig = { key: 'id', direction: 'asc' };

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    updateStats();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('keyup', filterAndRender);
    document.getElementById('gradeFilter').addEventListener('change', filterAndRender);
    document.getElementById('addStudentForm').addEventListener('submit', addNewStudent);
}

// Render the table
function renderTable(dataToShow = students) {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';

    if (dataToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-message">No students found</td></tr>';
        return;
    }

    dataToShow.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(student.id)}</td>
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.email)}</td>
            <td>Grade ${student.grade}</td>
            <td>${student.gpa.toFixed(2)}</td>
            <td><button class="btn btn-delete" onclick="deleteStudent('${escapeHtml(student.id)}')">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

// Filter and render
function filterAndRender() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const gradeFilter = document.getElementById('gradeFilter').value;

    let filtered = students.filter(student => {
        const matchesSearch = student.id.toLowerCase().includes(searchTerm) || 
                             student.name.toLowerCase().includes(searchTerm) ||
                             student.email.toLowerCase().includes(searchTerm);
        const matchesGrade = gradeFilter === '' || student.grade == gradeFilter;
        return matchesSearch && matchesGrade;
    });

    // Sort the filtered data
    filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (sortConfig.direction === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    renderTable(filtered);
}

// Sort table
function sortTable(key) {
    if (sortConfig.key === key) {
        sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortConfig.key = key;
        sortConfig.direction = 'asc';
    }
    filterAndRender();
}

// Delete student
function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== studentId);
        filterAndRender();
        updateStats();
    }
}

// Toggle add form
function toggleAddForm() {
    const form = document.getElementById('addFormContainer');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Add new student
function addNewStudent(e) {
    e.preventDefault();

    const newStudent = {
        id: document.getElementById('newStudentId').value,
        name: document.getElementById('newStudentName').value,
        email: document.getElementById('newStudentEmail').value,
        grade: parseInt(document.getElementById('newStudentGrade').value),
        gpa: parseFloat(document.getElementById('newStudentGPA').value)
    };

    // Validate
    if (!newStudent.id || !newStudent.name || !newStudent.email || !newStudent.grade || !newStudent.gpa) {
        alert('Please fill in all fields');
        return;
    }

    // Check for duplicate ID
    if (students.some(s => s.id === newStudent.id)) {
        alert('Student ID already exists');
        return;
    }

    // Validate GPA
    if (newStudent.gpa < 0 || newStudent.gpa > 4) {
        alert('GPA must be between 0 and 4');
        return;
    }

    students.push(newStudent);
    document.getElementById('addStudentForm').reset();
    toggleAddForm();
    filterAndRender();
    updateStats();
}

// Update statistics
function updateStats() {
    const totalStudents = students.length;
    const averageGPA = students.length > 0 
        ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
        : 0;
    const totalGrades = new Set(students.map(s => s.grade)).size;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('averageGPA').textContent = averageGPA;
    document.getElementById('totalGrades').textContent = totalGrades;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
