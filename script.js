// Medical Equipment Rental Tracker JavaScript

// Authentication Configuration
// Note: This is a simple hash-based approach for demonstration purposes only
// For production use, implement proper server-side authentication
const CREDENTIAL_HASH = "982d9e3eb996f559e633f4d194def3761d909f5a3b647d1a851fead67c32c9d1"; // SHA-256 of "Sajeev:1971"

// Authentication state
let isAuthenticated = false;

// Simple SHA-256 implementation (for demonstration only - use proper crypto in production)
async function simpleHash(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Equipment subcategories configuration
const EQUIPMENT_SUBTYPES = {
  oxygen: [
    "Portable 5L",
    "Stationary 5L",
    "Portable 10L",
    "Stationary 10L",
    "High Flow 15L",
  ],
  bipap: [
    "Standard BiPAP",
    "Auto BiPAP",
    "BiPAP with Humidifier",
    "Travel BiPAP",
    "BiPAP ST Mode",
  ],
  cpap: [
    "Standard CPAP",
    "Auto CPAP",
    "CPAP with Humidifier",
    "Travel CPAP",
    "BiLevel CPAP",
  ],
};

// Global variables
let rentals = [];
let currentEditingId = null;
let currentPaymentId = null;

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  checkAuthenticationStatus();
  setupAuthEventListeners();
});

function checkAuthenticationStatus() {
  // Check if user has valid session
  const authSession = localStorage.getItem("authSession");
  const sessionExpiry = localStorage.getItem("sessionExpiry");
  
  if (authSession && sessionExpiry && Date.now() < parseInt(sessionExpiry)) {
    isAuthenticated = true;
    showMainApp();
  } else {
    // Clear expired session
    localStorage.removeItem("authSession");
    localStorage.removeItem("sessionExpiry");
    isAuthenticated = false;
    showLoginPage();
  }
}

function setupAuthEventListeners() {
  // Login form submission
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Logout button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("login-error");
  
  try {
    // Create credential hash
    const credentialString = `${username}:${password}`;
    const inputHash = await simpleHash(credentialString);
    
    if (inputHash === CREDENTIAL_HASH) {
      // Successful login
      const sessionToken = await simpleHash(`${Date.now()}_${Math.random()}`);
      localStorage.setItem("authSession", sessionToken);
      localStorage.setItem("sessionExpiry", Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
      isAuthenticated = true;
      showMainApp();
      
      // Clear form
      document.getElementById("login-form").reset();
      errorDiv.style.display = "none";
    } else {
      // Failed login
      showLoginError(errorDiv);
    }
  } catch (error) {
    console.error("Login error:", error);
    showLoginError(errorDiv);
  }
}

function showLoginError(errorDiv) {
  errorDiv.style.display = "block";
    
    // Clear password field
    document.getElementById("password").value = "";
    
    // Focus back on username
    document.getElementById("username").focus();
  }
}

function handleLogout() {
  // Clear all session data
  localStorage.removeItem("authSession");
  localStorage.removeItem("sessionExpiry");
  isAuthenticated = false;
  showLoginPage();
}

function showLoginPage() {
  document.getElementById("login-container").style.display = "flex";
  document.getElementById("main-app").style.display = "none";
  
  // Focus on username field
  setTimeout(() => {
    document.getElementById("username").focus();
  }, 100);
}

function showMainApp() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("main-app").style.display = "block";
  
  // Initialize the main application
  initializeApp();
}

function initializeApp() {
  loadDataFromStorage();
  setupEventListeners();
  updateDashboard();
  showSection("dashboard");
  populateRecentActivity();

  // Set default dates
  const today = new Date().toISOString().split("T")[0];
  const startDateInput = document.getElementById("start-date");
  const paymentDateInput = document.getElementById("payment-date");
  
  if (startDateInput) startDateInput.value = today;
  if (paymentDateInput) paymentDateInput.value = today;
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const section = e.currentTarget.dataset.section;
      showSection(section);
    });
  });

  // Equipment type change
  document
    .getElementById("equipment-type")
    .addEventListener("change", updateSubtypes);

  // Form submissions
  document
    .getElementById("rental-form")
    .addEventListener("submit", handleRentalSubmit);
  document
    .getElementById("edit-rental-form")
    .addEventListener("submit", handleEditSubmit);
  document
    .getElementById("payment-form")
    .addEventListener("submit", handlePaymentSubmit);

  // Filters
  document
    .getElementById("filter-equipment")
    .addEventListener("change", filterRentals);
  document
    .getElementById("filter-status")
    .addEventListener("change", filterRentals);
  document
    .getElementById("search-rentals")
    .addEventListener("input", filterRentals);

  // Modal controls
  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", closeModal);
  });

  document.querySelectorAll(".close-modal").forEach((closeBtn) => {
    closeBtn.addEventListener("click", closeModal);
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal();
    }
  });
}

function showSection(sectionId) {
  // Update navigation
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document
    .querySelector(`[data-section="${sectionId}"]`)
    .classList.add("active");

  // Show section
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");

  // Update content based on section
  if (sectionId === "manage-rentals") {
    displayRentals();
  } else if (sectionId === "dashboard") {
    updateDashboard();
  } else if (sectionId === "reports") {
    updateReports();
  }
}

function updateSubtypes() {
  const equipmentType = document.getElementById("equipment-type").value;
  const subtypeSelect = document.getElementById("equipment-subtype");

  subtypeSelect.innerHTML = '<option value="">Select Subtype</option>';

  if (equipmentType && EQUIPMENT_SUBTYPES[equipmentType]) {
    EQUIPMENT_SUBTYPES[equipmentType].forEach((subtype) => {
      const option = document.createElement("option");
      option.value = subtype;
      option.textContent = subtype;
      subtypeSelect.appendChild(option);
    });
  }
}

function handleRentalSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const rental = {
    id: Date.now().toString(),
    customerName: document.getElementById("customer-name").value,
    customerPhone: document.getElementById("customer-phone").value,
    customerAddress: document.getElementById("customer-address").value,
    equipmentType: document.getElementById("equipment-type").value,
    equipmentSubtype: document.getElementById("equipment-subtype").value,
    startDate: document.getElementById("start-date").value,
    endDate: document.getElementById("end-date").value,
    rentAmount: parseFloat(document.getElementById("rent-amount").value),
    collectedAmount:
      parseFloat(document.getElementById("collected-amount").value) || 0,
    dueDate: document.getElementById("due-date").value,
    notes: document.getElementById("notes").value,
    createdAt: new Date().toISOString(),
    status: "active",
  };

  // Calculate pending amount
  rental.pendingAmount = rental.rentAmount - rental.collectedAmount;

  rentals.push(rental);
  saveDataToStorage();

  // Reset form
  e.target.reset();
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("start-date").value = today;

  // Show success message
  alert("Rental added successfully!");

  // Update dashboard
  updateDashboard();
}

function displayRentals(filteredRentals = null) {
  const rentalsToShow = filteredRentals || rentals;
  const tbody = document.getElementById("rentals-tbody");

  tbody.innerHTML = "";

  rentalsToShow.forEach((rental) => {
    const row = document.createElement("tr");

    // Calculate status
    const status = calculateRentalStatus(rental);

    row.innerHTML = `
            <td>
                <div><strong>${rental.customerName}</strong></div>
                <div style="font-size: 0.8rem; color: #666;">${
                  rental.customerPhone
                }</div>
            </td>
            <td>${getEquipmentDisplayName(rental.equipmentType)}</td>
            <td>${rental.equipmentSubtype}</td>
            <td>${formatDate(rental.startDate)}</td>
            <td>${rental.endDate ? formatDate(rental.endDate) : "N/A"}</td>
            <td>$${rental.rentAmount.toFixed(2)}</td>
            <td>$${rental.collectedAmount.toFixed(2)}</td>
            <td>$${rental.pendingAmount.toFixed(2)}</td>
            <td>${rental.dueDate ? formatDate(rental.dueDate) : "N/A"}</td>
            <td><span class="status-badge status-${status}">${status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-edit" onclick="editRental('${
                      rental.id
                    }')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-payment" onclick="collectPayment('${
                      rental.id
                    }')">
                        <i class="fas fa-dollar-sign"></i>
                    </button>
                    <button class="btn-small btn-delete" onclick="deleteRental('${
                      rental.id
                    }')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

    tbody.appendChild(row);
  });
}

function calculateRentalStatus(rental) {
  const today = new Date();
  const dueDate = rental.dueDate ? new Date(rental.dueDate) : null;

  if (rental.pendingAmount <= 0) {
    return "completed";
  } else if (dueDate && today > dueDate) {
    return "overdue";
  } else {
    return "active";
  }
}

function getEquipmentDisplayName(type) {
  const names = {
    oxygen: "Oxygen Concentrator",
    bipap: "BiPAP",
    cpap: "CPAP",
  };
  return names[type] || type;
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function filterRentals() {
  const equipmentFilter = document.getElementById("filter-equipment").value;
  const statusFilter = document.getElementById("filter-status").value;
  const searchTerm = document
    .getElementById("search-rentals")
    .value.toLowerCase();

  let filtered = rentals;

  // Filter by equipment type
  if (equipmentFilter) {
    filtered = filtered.filter(
      (rental) => rental.equipmentType === equipmentFilter
    );
  }

  // Filter by status
  if (statusFilter) {
    filtered = filtered.filter(
      (rental) => calculateRentalStatus(rental) === statusFilter
    );
  }

  // Search by customer name
  if (searchTerm) {
    filtered = filtered.filter(
      (rental) =>
        rental.customerName.toLowerCase().includes(searchTerm) ||
        rental.customerPhone.includes(searchTerm)
    );
  }

  displayRentals(filtered);
}

function editRental(id) {
  const rental = rentals.find((r) => r.id === id);
  if (!rental) return;

  currentEditingId = id;

  // Populate edit form
  const form = document.getElementById("edit-rental-form");
  form.innerHTML = `
        <div class="form-group">
            <label for="edit-customer-name">Customer Name *</label>
            <input type="text" id="edit-customer-name" value="${
              rental.customerName
            }" required>
        </div>
        <div class="form-group">
            <label for="edit-customer-phone">Phone Number *</label>
            <input type="tel" id="edit-customer-phone" value="${
              rental.customerPhone
            }" required>
        </div>
        <div class="form-group">
            <label for="edit-customer-address">Address</label>
            <textarea id="edit-customer-address" rows="3">${
              rental.customerAddress
            }</textarea>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="edit-equipment-type">Equipment Type *</label>
                <select id="edit-equipment-type" required>
                    <option value="oxygen" ${
                      rental.equipmentType === "oxygen" ? "selected" : ""
                    }>Oxygen Concentrator</option>
                    <option value="bipap" ${
                      rental.equipmentType === "bipap" ? "selected" : ""
                    }>BiPAP</option>
                    <option value="cpap" ${
                      rental.equipmentType === "cpap" ? "selected" : ""
                    }>CPAP</option>
                </select>
            </div>
            <div class="form-group">
                <label for="edit-equipment-subtype">Subtype *</label>
                <select id="edit-equipment-subtype" required></select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="edit-start-date">Start Date *</label>
                <input type="date" id="edit-start-date" value="${
                  rental.startDate
                }" required>
            </div>
            <div class="form-group">
                <label for="edit-end-date">End Date</label>
                <input type="date" id="edit-end-date" value="${
                  rental.endDate || ""
                }">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="edit-rent-amount">Rent Amount ($) *</label>
                <input type="number" id="edit-rent-amount" step="0.01" value="${
                  rental.rentAmount
                }" required>
            </div>
            <div class="form-group">
                <label for="edit-collected-amount">Collected Amount ($)</label>
                <input type="number" id="edit-collected-amount" step="0.01" value="${
                  rental.collectedAmount
                }">
            </div>
        </div>
        <div class="form-group">
            <label for="edit-due-date">Due Date</label>
            <input type="date" id="edit-due-date" value="${
              rental.dueDate || ""
            }">
        </div>
        <div class="form-group">
            <label for="edit-notes">Notes</label>
            <textarea id="edit-notes" rows="3">${rental.notes}</textarea>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn-primary">
                <i class="fas fa-save"></i> Update Rental
            </button>
            <button type="button" class="btn-secondary close-modal">Cancel</button>
        </div>
    `;

  // Setup equipment type change for edit form
  document
    .getElementById("edit-equipment-type")
    .addEventListener("change", function () {
      updateEditSubtypes(this.value, rental.equipmentSubtype);
    });

  // Initialize subtypes
  updateEditSubtypes(rental.equipmentType, rental.equipmentSubtype);

  // Show modal
  document.getElementById("edit-modal").style.display = "block";
}

function updateEditSubtypes(equipmentType, selectedSubtype = "") {
  const subtypeSelect = document.getElementById("edit-equipment-subtype");
  subtypeSelect.innerHTML = '<option value="">Select Subtype</option>';

  if (equipmentType && EQUIPMENT_SUBTYPES[equipmentType]) {
    EQUIPMENT_SUBTYPES[equipmentType].forEach((subtype) => {
      const option = document.createElement("option");
      option.value = subtype;
      option.textContent = subtype;
      option.selected = subtype === selectedSubtype;
      subtypeSelect.appendChild(option);
    });
  }
}

function handleEditSubmit(e) {
  e.preventDefault();

  const rental = rentals.find((r) => r.id === currentEditingId);
  if (!rental) return;

  // Update rental data
  rental.customerName = document.getElementById("edit-customer-name").value;
  rental.customerPhone = document.getElementById("edit-customer-phone").value;
  rental.customerAddress = document.getElementById(
    "edit-customer-address"
  ).value;
  rental.equipmentType = document.getElementById("edit-equipment-type").value;
  rental.equipmentSubtype = document.getElementById(
    "edit-equipment-subtype"
  ).value;
  rental.startDate = document.getElementById("edit-start-date").value;
  rental.endDate = document.getElementById("edit-end-date").value;
  rental.rentAmount = parseFloat(
    document.getElementById("edit-rent-amount").value
  );
  rental.collectedAmount =
    parseFloat(document.getElementById("edit-collected-amount").value) || 0;
  rental.dueDate = document.getElementById("edit-due-date").value;
  rental.notes = document.getElementById("edit-notes").value;

  // Recalculate pending amount
  rental.pendingAmount = rental.rentAmount - rental.collectedAmount;

  saveDataToStorage();
  closeModal();
  displayRentals();
  updateDashboard();

  alert("Rental updated successfully!");
}

function collectPayment(id) {
  const rental = rentals.find((r) => r.id === id);
  if (!rental) return;

  currentPaymentId = id;

  // Set max payment amount to pending amount
  document.getElementById("payment-amount").max = rental.pendingAmount;
  document.getElementById("payment-amount").value = rental.pendingAmount;

  // Show modal
  document.getElementById("payment-modal").style.display = "block";
}

function handlePaymentSubmit(e) {
  e.preventDefault();

  const rental = rentals.find((r) => r.id === currentPaymentId);
  if (!rental) return;

  const paymentAmount = parseFloat(
    document.getElementById("payment-amount").value
  );

  if (paymentAmount > rental.pendingAmount) {
    alert("Payment amount cannot exceed pending amount!");
    return;
  }

  // Update rental
  rental.collectedAmount += paymentAmount;
  rental.pendingAmount = rental.rentAmount - rental.collectedAmount;

  // Record payment in rental notes
  const paymentDate = document.getElementById("payment-date").value;
  const paymentMethod = document.getElementById("payment-method").value;
  const paymentNote = `Payment: $${paymentAmount.toFixed(2)} on ${formatDate(
    paymentDate
  )} via ${paymentMethod}`;

  if (rental.notes) {
    rental.notes += "\n" + paymentNote;
  } else {
    rental.notes = paymentNote;
  }

  saveDataToStorage();
  closeModal();
  displayRentals();
  updateDashboard();

  alert("Payment recorded successfully!");

  // Reset form
  document.getElementById("payment-form").reset();
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("payment-date").value = today;
}

function deleteRental(id) {
  if (
    confirm(
      "Are you sure you want to delete this rental? This action cannot be undone."
    )
  ) {
    rentals = rentals.filter((r) => r.id !== id);
    saveDataToStorage();
    displayRentals();
    updateDashboard();
    alert("Rental deleted successfully!");
  }
}

function closeModal() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none";
  });
  currentEditingId = null;
  currentPaymentId = null;
}

function updateDashboard() {
  const stats = calculateStats();

  // Update equipment stats
  document.getElementById("oxygen-total").textContent = stats.oxygen.total;
  document.getElementById("oxygen-rented").textContent = stats.oxygen.rented;
  document.getElementById("oxygen-free").textContent = stats.oxygen.free;

  document.getElementById("bipap-total").textContent = stats.bipap.total;
  document.getElementById("bipap-rented").textContent = stats.bipap.rented;
  document.getElementById("bipap-free").textContent = stats.bipap.free;

  document.getElementById("cpap-total").textContent = stats.cpap.total;
  document.getElementById("cpap-rented").textContent = stats.cpap.rented;
  document.getElementById("cpap-free").textContent = stats.cpap.free;

  // Update financial stats
  document.getElementById("total-collected").textContent =
    stats.totalCollected.toFixed(2);
  document.getElementById("total-pending").textContent =
    stats.totalPending.toFixed(2);
  document.getElementById("total-overdue").textContent =
    stats.totalOverdue.toFixed(2);
}

function calculateStats() {
  const stats = {
    oxygen: { total: 0, rented: 0, free: 0 },
    bipap: { total: 0, rented: 0, free: 0 },
    cpap: { total: 0, rented: 0, free: 0 },
    totalCollected: 0,
    totalPending: 0,
    totalOverdue: 0,
  };

  // For this demo, we'll assume each subtype represents available units
  // In a real application, you'd have inventory management
  Object.keys(EQUIPMENT_SUBTYPES).forEach((type) => {
    stats[type].total = EQUIPMENT_SUBTYPES[type].length * 10; // Assume 10 units per subtype
    stats[type].free = stats[type].total;
  });

  rentals.forEach((rental) => {
    const status = calculateRentalStatus(rental);

    if (status === "active" || status === "overdue") {
      stats[rental.equipmentType].rented++;
      stats[rental.equipmentType].free--;
    }

    stats.totalCollected += rental.collectedAmount;
    stats.totalPending += rental.pendingAmount;

    if (status === "overdue") {
      stats.totalOverdue += rental.pendingAmount;
    }
  });

  return stats;
}

function populateRecentActivity() {
  const recentList = document.getElementById("recent-list");

  // Get recent rentals (last 5)
  const recentRentals = rentals
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (recentRentals.length === 0) {
    recentList.innerHTML =
      '<div class="activity-item">No recent activity</div>';
    return;
  }

  recentList.innerHTML = recentRentals
    .map(
      (rental) => `
        <div class="activity-item">
            <div>
                <strong>${
                  rental.customerName
                }</strong> rented ${getEquipmentDisplayName(
        rental.equipmentType
      )}
                <div style="font-size: 0.8rem; color: #666;">${formatDate(
                  rental.startDate
                )}</div>
            </div>
            <div class="text-success">$${rental.rentAmount.toFixed(2)}</div>
        </div>
    `
    )
    .join("");
}

function updateReports() {
  updateMonthlyStats();
  updateOverdueList();
  // Note: Chart functionality would require Chart.js library
  // For now, we'll just show placeholders
}

function updateMonthlyStats() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthRevenue = rentals
    .filter((rental) => {
      const rentalDate = new Date(rental.startDate);
      return (
        rentalDate.getMonth() === currentMonth &&
        rentalDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, rental) => sum + rental.collectedAmount, 0);

  const lastMonthRevenue = rentals
    .filter((rental) => {
      const rentalDate = new Date(rental.startDate);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return (
        rentalDate.getMonth() === lastMonth &&
        rentalDate.getFullYear() === lastMonthYear
      );
    })
    .reduce((sum, rental) => sum + rental.collectedAmount, 0);

  const activeRentalsCount = rentals.filter(
    (rental) => calculateRentalStatus(rental) === "active"
  ).length;

  document.getElementById("current-month-revenue").textContent =
    currentMonthRevenue.toFixed(2);
  document.getElementById("last-month-revenue").textContent =
    lastMonthRevenue.toFixed(2);
  document.getElementById("active-rentals-count").textContent =
    activeRentalsCount;
}

function updateOverdueList() {
  const overdueRentals = rentals.filter(
    (rental) => calculateRentalStatus(rental) === "overdue"
  );
  const overdueList = document.getElementById("overdue-list");

  if (overdueRentals.length === 0) {
    overdueList.innerHTML =
      '<div class="overdue-item">No overdue payments</div>';
    return;
  }

  overdueList.innerHTML = overdueRentals
    .map(
      (rental) => `
        <div class="overdue-item">
            <div style="display: flex; justify-content: space-between;">
                <span><strong>${rental.customerName}</strong></span>
                <span class="text-danger">$${rental.pendingAmount.toFixed(
                  2
                )}</span>
            </div>
            <div style="font-size: 0.8rem; color: #666;">
                Due: ${formatDate(rental.dueDate)} | ${rental.customerPhone}
            </div>
        </div>
    `
    )
    .join("");
}

// Data persistence functions
function saveDataToStorage() {
  localStorage.setItem("medicalRentals", JSON.stringify(rentals));
}

function loadDataFromStorage() {
  const stored = localStorage.getItem("medicalRentals");
  if (stored) {
    rentals = JSON.parse(stored);
  }
}

// Export/Import functionality (bonus feature)
function exportData() {
  const dataStr = JSON.stringify(rentals, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `medical-rentals-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (Array.isArray(importedData)) {
        rentals = importedData;
        saveDataToStorage();
        updateDashboard();
        displayRentals();
        alert("Data imported successfully!");
      } else {
        alert("Invalid file format!");
      }
    } catch (error) {
      alert("Error reading file!");
    }
  };
  reader.readAsText(file);
}

// Print functionality
function printRentals() {
  const printWindow = window.open("", "_blank");
  const printContent = `
        <html>
        <head>
            <title>Medical Equipment Rentals Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                h1 { color: #333; }
                .header { text-align: center; margin-bottom: 30px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Medical Equipment Rentals Report</h1>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Equipment</th>
                        <th>Subtype</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Rent Amount</th>
                        <th>Collected</th>
                        <th>Pending</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${rentals
                      .map(
                        (rental) => `
                        <tr>
                            <td>${rental.customerName}</td>
                            <td>${getEquipmentDisplayName(
                              rental.equipmentType
                            )}</td>
                            <td>${rental.equipmentSubtype}</td>
                            <td>${formatDate(rental.startDate)}</td>
                            <td>${
                              rental.endDate
                                ? formatDate(rental.endDate)
                                : "N/A"
                            }</td>
                            <td>$${rental.rentAmount.toFixed(2)}</td>
                            <td>$${rental.collectedAmount.toFixed(2)}</td>
                            <td>$${rental.pendingAmount.toFixed(2)}</td>
                            <td>${calculateRentalStatus(rental)}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        </body>
        </html>
    `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
}

// Add keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + N for new rental
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    showSection("add-rental");
  }

  // Escape to close modals
  if (e.key === "Escape") {
    closeModal();
  }
});

// Auto-save feature (save every 30 seconds)
setInterval(saveDataToStorage, 30000);
