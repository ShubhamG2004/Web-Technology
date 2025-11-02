// Employee Management System - JavaScript

class EmployeeManagementSystem {
    constructor() {
        this.employees = this.loadFromLocalStorage();
        this.editingEmployeeId = null;
        this.deleteEmployeeId = null;
        this.init();
    }

    init() {
        this.renderEmployees();
        this.updateStatistics();
        this.attachEventListeners();
        this.setMaxDate();
    }

    // Local Storage Methods
    loadFromLocalStorage() {
        const data = localStorage.getItem('employees');
        if (data) {
            return JSON.parse(data);
        }
        // Sample data for demonstration
        return [
            {
                id: Date.now() + 1,
                name: "John Smith",
                email: "john.smith@company.com",
                phone: "+1 234 567 8901",
                department: "HR",
                position: "Hiring Manager",
                salary: 85000,
                joinDate: "2022-01-15",
                photo: ""
            },
            {
                id: Date.now() + 2,
                name: "Shubham Gavade",
                email: "shubham.gavade@company.com",
                phone: "+91 94 567 8902",
                department: "IT",
                position: "Senior Developer",
                salary: 90000,
                joinDate: "2021-06-20",
                photo: ""
            },
            {
                id: Date.now() + 3,
                name: "Avishkar Kale",
                email: "avishkar.kale@company.com",
                phone: "+91 94 567 8903",
                department: "Finance",
                position: "Financial Analyst",
                salary: 65000,
                joinDate: "2023-03-10",
                photo: ""
            }
        ];
    }

    saveToLocalStorage() {
        localStorage.setItem('employees', JSON.stringify(this.employees));
    }

    // Set max date for join date input
    setMaxDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('empJoinDate').setAttribute('max', today);
    }

    // Event Listeners
    attachEventListeners() {
        // Add Employee Button
        document.getElementById('addEmployeeBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Close Modal Buttons
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form Submit
        document.getElementById('employeeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmployee();
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchEmployees(e.target.value);
        });

        // Filters
        document.getElementById('departmentFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('sortBy').addEventListener('change', () => {
            this.applyFilters();
        });

        // Delete Modal
        document.getElementById('closeDeleteModal').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });

        // View Modal
        document.getElementById('closeViewModal').addEventListener('click', () => {
            this.closeViewModal();
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
                this.closeDeleteModal();
                this.closeViewModal();
            }
        });
    }

    // Modal Methods
    openModal(employee = null) {
        const modal = document.getElementById('employeeModal');
        const form = document.getElementById('employeeForm');
        const modalTitle = document.getElementById('modalTitle');

        form.reset();
        this.editingEmployeeId = null;

        if (employee) {
            modalTitle.textContent = 'Edit Employee';
            this.editingEmployeeId = employee.id;
            
            document.getElementById('empName').value = employee.name;
            document.getElementById('empEmail').value = employee.email;
            document.getElementById('empPhone').value = employee.phone;
            document.getElementById('empDepartment').value = employee.department;
            document.getElementById('empPosition').value = employee.position;
            document.getElementById('empSalary').value = employee.salary;
            document.getElementById('empJoinDate').value = employee.joinDate;
            document.getElementById('empPhoto').value = employee.photo || '';
        } else {
            modalTitle.textContent = 'Add New Employee';
        }

        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('employeeModal').classList.remove('active');
    }

    openDeleteModal(id) {
        this.deleteEmployeeId = id;
        document.getElementById('deleteModal').classList.add('active');
    }

    closeDeleteModal() {
        document.getElementById('deleteModal').classList.remove('active');
        this.deleteEmployeeId = null;
    }

    openViewModal(employee) {
        const modal = document.getElementById('viewModal');
        const detailsContainer = document.getElementById('employeeDetails');

        const photoHtml = employee.photo 
            ? `<img src="${employee.photo}" alt="${employee.name}" class="detail-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="detail-photo-placeholder" style="display: none;">${this.getInitials(employee.name)}</div>`
            : `<div class="detail-photo-placeholder">${this.getInitials(employee.name)}</div>`;

        detailsContainer.innerHTML = `
            <div class="detail-card">
                ${photoHtml}
                <div class="detail-info">
                    <h2>${employee.name}</h2>
                    <p class="position">${employee.position}</p>
                    <span class="department-badge ${employee.department}">${employee.department}</span>
                </div>
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <label><i class="fas fa-envelope"></i> Email</label>
                    <div class="value">${employee.email}</div>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-phone"></i> Phone</label>
                    <div class="value">${employee.phone}</div>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-dollar-sign"></i> Salary</label>
                    <div class="value">$${this.formatSalary(employee.salary)}</div>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-calendar"></i> Join Date</label>
                    <div class="value">${this.formatDate(employee.joinDate)}</div>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-clock"></i> Tenure</label>
                    <div class="value">${this.calculateTenure(employee.joinDate)}</div>
                </div>
                <div class="detail-item">
                    <label><i class="fas fa-id-badge"></i> Employee ID</label>
                    <div class="value">#${employee.id}</div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    closeViewModal() {
        document.getElementById('viewModal').classList.remove('active');
    }

    // CRUD Operations
    saveEmployee() {
        const employee = {
            name: document.getElementById('empName').value.trim(),
            email: document.getElementById('empEmail').value.trim(),
            phone: document.getElementById('empPhone').value.trim(),
            department: document.getElementById('empDepartment').value,
            position: document.getElementById('empPosition').value.trim(),
            salary: parseFloat(document.getElementById('empSalary').value),
            joinDate: document.getElementById('empJoinDate').value,
            photo: document.getElementById('empPhoto').value.trim()
        };

        if (this.editingEmployeeId) {
            // Update existing employee
            const index = this.employees.findIndex(emp => emp.id === this.editingEmployeeId);
            if (index !== -1) {
                this.employees[index] = { ...this.employees[index], ...employee };
                this.showNotification('Employee updated successfully!', 'success');
            }
        } else {
            // Add new employee
            employee.id = Date.now();
            this.employees.push(employee);
            this.showNotification('Employee added successfully!', 'success');
        }

        this.saveToLocalStorage();
        this.renderEmployees();
        this.updateStatistics();
        this.closeModal();
    }

    confirmDelete() {
        if (this.deleteEmployeeId) {
            this.employees = this.employees.filter(emp => emp.id !== this.deleteEmployeeId);
            this.saveToLocalStorage();
            this.renderEmployees();
            this.updateStatistics();
            this.closeDeleteModal();
            this.showNotification('Employee deleted successfully!', 'success');
        }
    }

    // Render Methods
    renderEmployees(employeesToRender = this.employees) {
        const tbody = document.getElementById('employeeTableBody');
        const noData = document.getElementById('noData');

        if (employeesToRender.length === 0) {
            tbody.innerHTML = '';
            noData.style.display = 'block';
            return;
        }

        noData.style.display = 'none';
        
        tbody.innerHTML = employeesToRender.map(emp => `
            <tr>
                <td>
                    ${emp.photo 
                        ? `<img src="${emp.photo}" alt="${emp.name}" class="employee-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                           <div class="employee-photo-placeholder" style="display: none;">${this.getInitials(emp.name)}</div>`
                        : `<div class="employee-photo-placeholder">${this.getInitials(emp.name)}</div>`
                    }
                </td>
                <td><strong>${emp.name}</strong></td>
                <td>${emp.email}</td>
                <td><span class="department-badge ${emp.department}">${emp.department}</span></td>
                <td>${emp.position}</td>
                <td><strong>$${this.formatSalary(emp.salary)}</strong></td>
                <td>${this.formatDate(emp.joinDate)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn view" onclick="ems.openViewModal(${JSON.stringify(emp).replace(/"/g, '&quot;')})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="icon-btn edit" onclick="ems.openModal(${JSON.stringify(emp).replace(/"/g, '&quot;')})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn delete" onclick="ems.openDeleteModal(${emp.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateStatistics() {
        const total = this.employees.length;
        const developers = this.employees.filter(emp => 
            emp.position.toLowerCase().includes('developer') || 
            emp.position.toLowerCase().includes('engineer')
        ).length;
        const managers = this.employees.filter(emp => 
            emp.position.toLowerCase().includes('manager')
        ).length;
        const avgSalary = total > 0 
            ? Math.round(this.employees.reduce((sum, emp) => sum + emp.salary, 0) / total)
            : 0;

        document.getElementById('totalEmployees').textContent = total;
        document.getElementById('developersCount').textContent = developers;
        document.getElementById('managersCount').textContent = managers;
        document.getElementById('avgSalary').textContent = '$' + this.formatSalary(avgSalary);
    }

    // Filter and Search Methods
    searchEmployees(query) {
        query = query.toLowerCase();
        const filtered = this.employees.filter(emp => 
            emp.name.toLowerCase().includes(query) ||
            emp.email.toLowerCase().includes(query) ||
            emp.department.toLowerCase().includes(query) ||
            emp.position.toLowerCase().includes(query)
        );
        this.renderEmployees(filtered);
    }

    applyFilters() {
        const department = document.getElementById('departmentFilter').value;
        const sortBy = document.getElementById('sortBy').value;
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();

        let filtered = [...this.employees];

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(emp => 
                emp.name.toLowerCase().includes(searchQuery) ||
                emp.email.toLowerCase().includes(searchQuery) ||
                emp.department.toLowerCase().includes(searchQuery) ||
                emp.position.toLowerCase().includes(searchQuery)
            );
        }

        // Filter by department
        if (department) {
            filtered = filtered.filter(emp => emp.department === department);
        }

        // Sort
        switch (sortBy) {
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'salary':
                filtered.sort((a, b) => b.salary - a.salary);
                break;
            case 'date':
                filtered.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
                break;
        }

        this.renderEmployees(filtered);
    }

    // Utility Methods
    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    formatSalary(salary) {
        return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    calculateTenure(joinDate) {
        const start = new Date(joinDate);
        const now = new Date();
        const years = now.getFullYear() - start.getFullYear();
        const months = now.getMonth() - start.getMonth();
        
        if (years === 0) {
            return `${months} month${months !== 1 ? 's' : ''}`;
        } else if (months < 0) {
            return `${years - 1} year${years - 1 !== 1 ? 's' : ''}, ${12 + months} month${12 + months !== 1 ? 's' : ''}`;
        } else {
            return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
        }
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#43e97b' : '#f5576c'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 600;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the system
const ems = new EmployeeManagementSystem();
