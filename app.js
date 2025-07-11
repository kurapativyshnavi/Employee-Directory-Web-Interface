// app.js

// Sample data
let employees = [
    {id: 1, firstName: "Alice", lastName: "Smith", email: "alice@example.com", department: "HR", role: "Manager"},
    {id: 2, firstName: "Bob", lastName: "Johnson", email: "bob@example.com", department: "IT", role: "Developer"},
    {id: 3, firstName: "Charlie", lastName: "Lee", email: "charlie@example.com", department: "Finance", role: "Analyst"}
  ];
  
  let editingId = null;
  
  // DOM elements
  const employeeList = document.getElementById('employeeList');
  const employeeForm = document.getElementById('employeeForm');
  const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
  const employeeModalLabel = document.getElementById('employeeModalLabel');
  const saveEmployeeBtn = document.getElementById('saveEmployeeBtn');
  const addEmployeeBtn = document.getElementById('addEmployeeBtn');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const departmentFilter = document.getElementById('departmentFilter');
  const roleFilter = document.getElementById('roleFilter');
  
  // Render employee cards
  function renderEmployees(list = employees) {
    employeeList.innerHTML = '';
    if (list.length === 0) {
      employeeList.innerHTML = '<div class="col-12 text-center text-muted">No employees found.</div>';
      return;
    }
    list.forEach(emp => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';
      col.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${emp.firstName} ${emp.lastName}</h5>
            <p class="card-text mb-1"><strong>Email:</strong> ${emp.email}</p>
            <p class="card-text mb-1"><strong>Department:</strong> ${emp.department}</p>
            <p class="card-text mb-2"><strong>Role:</strong> ${emp.role}</p>
            <button class="btn btn-sm btn-primary me-2" onclick="editEmployee(${emp.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${emp.id})">Delete</button>
          </div>
        </div>
      `;
      employeeList.appendChild(col);
    });
  }
  
  // Populate filter dropdowns
  function populateFilters() {
    const departments = [...new Set(employees.map(e => e.department))];
    const roles = [...new Set(employees.map(e => e.role))];
  
    departmentFilter.innerHTML = '<option value="">All Departments</option>' +
      departments.map(dep => `<option>${dep}</option>`).join('');
    roleFilter.innerHTML = '<option value="">All Roles</option>' +
      roles.map(role => `<option>${role}</option>`).join('');
  }
  
  // Add or Edit employee
  employeeForm.onsubmit = function(e) {
    e.preventDefault();
    const id = editingId || Date.now();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const department = document.getElementById('department').value;
    const role = document.getElementById('role').value;
  
    if (!firstName || !lastName || !email || !department || !role) {
      alert("Please fill in all fields.");
      return;
    }
  
    if (editingId) {
      // Edit
      const idx = employees.findIndex(e => e.id === editingId);
      employees[idx] = {id: editingId, firstName, lastName, email, department, role};
    } else {
      // Add
      employees.push({id, firstName, lastName, email, department, role});
    }
    editingId = null;
    employeeForm.reset();
    saveEmployeeBtn.textContent = "Add";
    employeeModalLabel.textContent = "Add Employee";
    employeeModal.hide();
    populateFilters();
    renderEmployees();
  };
  
  // Open modal for adding
  addEmployeeBtn.onclick = function() {
    editingId = null;
    employeeForm.reset();
    saveEmployeeBtn.textContent = "Add";
    employeeModalLabel.textContent = "Add Employee";
  };
  
  // Edit employee
  window.editEmployee = function(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    editingId = id;
    document.getElementById('firstName').value = emp.firstName;
    document.getElementById('lastName').value = emp.lastName;
    document.getElementById('email').value = emp.email;
    document.getElementById('department').value = emp.department;
    document.getElementById('role').value = emp.role;
    saveEmployeeBtn.textContent = "Save";
    employeeModalLabel.textContent = "Edit Employee";
    employeeModal.show();
  };
  
  // Delete employee
  window.deleteEmployee = function(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
      employees = employees.filter(e => e.id !== id);
      populateFilters();
      renderEmployees();
    }
  };
  
  // Search/filter employees
  searchForm.onsubmit = function(e) {
    e.preventDefault();
    applyFilters();
  };
  departmentFilter.onchange = roleFilter.onchange = applyFilters;
  
  function applyFilters() {
    const search = searchInput.value.trim().toLowerCase();
    const dep = departmentFilter.value;
    const role = roleFilter.value;
    let filtered = employees.filter(e =>
      (!search || `${e.firstName} ${e.lastName} ${e.email}`.toLowerCase().includes(search)) &&
      (!dep || e.department === dep) &&
      (!role || e.role === role)
    );
    renderEmployees(filtered);
  }
  
  // Initial render
  populateFilters();
  renderEmployees();