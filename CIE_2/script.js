const studentForm = document.getElementById('studentForm');
const studentTable = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const studentIdInput = document.getElementById('studentId');
const searchInput = document.getElementById('searchInput');
const filterCourse = document.getElementById('filterCourse');
const filterYear = document.getElementById('filterYear');
const filterStatus = document.getElementById('filterStatus');
const exportBtn = document.getElementById('exportBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const themeToggle = document.getElementById('themeToggle');
const viewModal = document.getElementById('viewModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.close');
const pageSizeSelect = document.getElementById('pageSize');
const formTitle = document.getElementById('formTitle');

let currentPage = 1;
let pageSize = 10;
let filteredStudents = [];
let sortColumn = '';
let sortDirection = 'asc';

function getStudents() {
    return JSON.parse(localStorage.getItem('students') || '[]');
}

function saveStudents(students) {
    localStorage.setItem('students', JSON.stringify(students));
}

function initializeSampleData() {
    const students = getStudents();
    if (students.length === 0) {
        const sampleStudents = [
            {
                name: 'John Doe',
                roll: '2021001',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                course: 'Computer Science',
                year: '3',
                gpa: '8.5',
                status: 'Active'
            },
            {
                name: 'Jane Smith',
                roll: '2021002',
                email: 'jane.smith@example.com',
                phone: '+1 (555) 234-5678',
                course: 'Information Technology',
                year: '2',
                gpa: '9.2',
                status: 'Active'
            },
            {
                name: 'Mike Johnson',
                roll: '2020015',
                email: 'mike.j@example.com',
                phone: '+1 (555) 345-6789',
                course: 'Electronics',
                year: '4',
                gpa: '7.8',
                status: 'Graduated'
            }
        ];
        saveStudents(sampleStudents);
    }
}

function updateStatistics() {
    const students = getStudents();
    const totalStudents = students.length;
    const courses = [...new Set(students.map(s => s.course))].length;
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const avgGPA = students.length > 0 
        ? (students.reduce((sum, s) => sum + (parseFloat(s.gpa) || 0), 0) / students.length).toFixed(2)
        : '0.00';

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('totalCourses').textContent = courses;
    document.getElementById('activeStudents').textContent = activeStudents;
    document.getElementById('avgGPA').textContent = avgGPA;
}

// Populate Course Filter
function populateCourseFilter() {
    const students = getStudents();
    const courses = [...new Set(students.map(s => s.course))].filter(c => c);
    filterCourse.innerHTML = '<option value="">All Courses</option>';
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        filterCourse.appendChild(option);
    });
}

// Filter and Search Students
function filterStudents() {
    const students = getStudents();
    const searchTerm = searchInput.value.toLowerCase();
    const courseFilter = filterCourse.value;
    const yearFilter = filterYear.value;
    const statusFilter = filterStatus.value;

    filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.name.toLowerCase().includes(searchTerm) ||
            student.roll.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            (student.phone && student.phone.toLowerCase().includes(searchTerm));
        
        const matchesCourse = !courseFilter || student.course === courseFilter;
        const matchesYear = !yearFilter || student.year === yearFilter;
        const matchesStatus = !statusFilter || student.status === statusFilter;

        return matchesSearch && matchesCourse && matchesYear && matchesStatus;
    });

    currentPage = 1;
    renderTable();
    renderPagination();
}

// Sort Students
function sortStudents(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    filteredStudents.sort((a, b) => {
        let aVal = a[column] || '';
        let bVal = b[column] || '';

        // Handle numeric sorting for GPA and year
        if (column === 'gpa' || column === 'year') {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        } else {
            aVal = aVal.toString().toLowerCase();
            bVal = bVal.toString().toLowerCase();
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    renderTable();
    updateSortIcons();
}

// Update Sort Icons
function updateSortIcons() {
    document.querySelectorAll('th.sortable i').forEach(icon => {
        icon.className = 'fas fa-sort';
    });

    const activeHeader = document.querySelector(`th[data-sort="${sortColumn}"]`);
    if (activeHeader) {
        const icon = activeHeader.querySelector('i');
        icon.className = sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
}

// Render Table
function renderTable() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedStudents = filteredStudents.slice(start, end);

    studentTable.innerHTML = '';

    if (paginatedStudents.length === 0) {
        const row = studentTable.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 9;
        cell.style.textAlign = 'center';
        cell.style.padding = '2rem';
        cell.innerHTML = '<i class="fas fa-inbox" style="font-size: 3rem; color: #ccc;"></i><p>No students found</p>';
        return;
    }

    paginatedStudents.forEach((student, idx) => {
        const actualIndex = getStudents().indexOf(student);
        const row = studentTable.insertRow();
        
        row.insertCell(0).textContent = student.name;
        row.insertCell(1).textContent = student.roll;
        row.insertCell(2).textContent = student.email;
        row.insertCell(3).textContent = student.phone || '-';
        row.insertCell(4).textContent = student.course;
        row.insertCell(5).textContent = student.year ? `Year ${student.year}` : '-';
        row.insertCell(6).textContent = student.gpa || '-';
        
        const statusCell = row.insertCell(7);
        statusCell.innerHTML = `<span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span>`;
        
        const actionsCell = row.insertCell(8);
        actionsCell.className = 'action-buttons';
        actionsCell.innerHTML = `
            <button class="action-btn view-btn" onclick="viewStudent(${actualIndex})" title="View Details">
                <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit-btn" onclick="editStudent(${actualIndex})" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" onclick="deleteStudent(${actualIndex})" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        `;
    });

    updatePaginationInfo();
}

// Render Pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredStudents.length / pageSize);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    pagination.appendChild(prevBtn);

    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'page-btn';
        firstBtn.textContent = '1';
        firstBtn.onclick = () => changePage(1);
        pagination.appendChild(firstBtn);

        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 0.5rem';
            pagination.appendChild(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changePage(i);
        pagination.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 0.5rem';
            pagination.appendChild(dots);
        }

        const lastBtn = document.createElement('button');
        lastBtn.className = 'page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.onclick = () => changePage(totalPages);
        pagination.appendChild(lastBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1);
    pagination.appendChild(nextBtn);
}

// Change Page
function changePage(page) {
    currentPage = page;
    renderTable();
    renderPagination();
}

// Update Pagination Info
function updatePaginationInfo() {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, filteredStudents.length);
    const total = filteredStudents.length;

    document.getElementById('showingStart').textContent = total === 0 ? 0 : start;
    document.getElementById('showingEnd').textContent = end;
    document.getElementById('totalRecords').textContent = total;
}

// View Student Details
window.viewStudent = function(idx) {
    const students = getStudents();
    const student = students[idx];
    
    modalBody.innerHTML = `
        <div class="detail-row">
            <div class="detail-label"><i class="fas fa-user"></i> Name:</div>
            <div class="detail-value">${student.name}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label"><i class="fas fa-id-badge"></i> Roll Number:</div>
            <div class="detail-value">${student.roll}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label"><i class="fas fa-envelope"></i> Email:</div>
            <div class="detail-value">${student.email}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label"><i class="fas fa-phone"></i> Phone:</div>
            <div class="detail-value">${student.phone || 'N/A'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label"><i class="fas fa-book-open"></i> Course:</div>
            <div class="detail-value">${student.course}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label"><i class="fas fa-calendar"></i> Year:</div>
            <div class="detail-value">${student.year ? `Year ${student.year}` : 'N/A'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label"><i class="fas fa-star"></i> GPA:</div>
            <div class="detail-value">${student.gpa || 'N/A'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label"><i class="fas fa-toggle-on"></i> Status:</div>
            <div class="detail-value"><span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span></div>
        </div>
    `;
    
    viewModal.style.display = 'block';
};

// Edit Student
window.editStudent = function(idx) {
    const students = getStudents();
    const student = students[idx];
    
    document.getElementById('name').value = student.name;
    document.getElementById('roll').value = student.roll;
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone || '';
    document.getElementById('course').value = student.course;
    document.getElementById('year').value = student.year || '';
    document.getElementById('gpa').value = student.gpa || '';
    document.getElementById('status').value = student.status;
    
    studentIdInput.value = idx;
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Student';
    formTitle.textContent = 'Edit Student';
    
    // Scroll to form
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
};

// Delete Student
window.deleteStudent = function(idx) {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        const students = getStudents();
        students.splice(idx, 1);
        saveStudents(students);
        updateAll();
        showNotification('Student deleted successfully!', 'success');
    }
};

// Reset Form
function resetForm() {
    studentForm.reset();
    studentIdInput.value = '';
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Student';
    formTitle.textContent = 'Add New Student';
}

// Form Submit
studentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const roll = document.getElementById('roll').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const course = document.getElementById('course').value;
    const year = document.getElementById('year').value;
    const gpa = document.getElementById('gpa').value.trim();
    const status = document.getElementById('status').value;
    const id = studentIdInput.value;
    
    let students = getStudents();
    
    // Validate unique roll number
    const isDuplicate = students.some((student, idx) => 
        student.roll === roll && idx !== parseInt(id)
    );
    
    if (isDuplicate) {
        showNotification('Roll number already exists!', 'error');
        return;
    }
    
    const studentData = { name, roll, email, phone, course, year, gpa, status };
    
    if (id !== '') {
        // Update existing student
        students[id] = studentData;
        showNotification('Student updated successfully!', 'success');
    } else {
        // Add new student
        students.push(studentData);
        showNotification('Student added successfully!', 'success');
    }
    
    saveStudents(students);
    updateAll();
    resetForm();
});

// Reset Button
resetBtn.addEventListener('click', resetForm);

// Search and Filter
searchInput.addEventListener('input', filterStudents);
filterCourse.addEventListener('change', filterStudents);
filterYear.addEventListener('change', filterStudents);
filterStatus.addEventListener('change', filterStudents);

// Page Size Change
pageSizeSelect.addEventListener('change', function() {
    pageSize = parseInt(this.value);
    currentPage = 1;
    renderTable();
    renderPagination();
});

// Sort Table
document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', function() {
        const column = this.dataset.sort;
        sortStudents(column);
    });
});

// Export to CSV
exportBtn.addEventListener('click', function() {
    const students = getStudents();
    
    if (students.length === 0) {
        showNotification('No data to export!', 'error');
        return;
    }
    
    const headers = ['Name', 'Roll No', 'Email', 'Phone', 'Course', 'Year', 'GPA', 'Status'];
    const rows = students.map(s => [
        s.name,
        s.roll,
        s.email,
        s.phone || '',
        s.course,
        s.year || '',
        s.gpa || '',
        s.status
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(field => `"${field}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
});

// Clear All Data
clearAllBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete ALL student records? This action cannot be undone!')) {
        if (confirm('This will permanently delete all data. Are you absolutely sure?')) {
            localStorage.removeItem('students');
            updateAll();
            showNotification('All data cleared!', 'success');
        }
    }
});

// Theme Toggle
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    this.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load Theme
function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
}

// Modal Close
closeModal.addEventListener('click', function() {
    viewModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === viewModal) {
        viewModal.style.display = 'none';
    }
});

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update All
function updateAll() {
    filterStudents();
    updateStatistics();
    populateCourseFilter();
}

// Initialize
function init() {
    initializeSampleData();
    loadTheme();
    filteredStudents = getStudents();
    updateAll();
}

// Run on load
init();
