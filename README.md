# Medical Equipment Rental Tracker

⚠️ **DEMO APPLICATION - NOT FOR PRODUCTION USE**

A comprehensive web-based demonstration application for tracking medical equipment rentals including Oxygen Concentrators, BiPAP, and CPAP units.

## 🚨 Important Security Notice

**This is a demonstration application with client-side only authentication. It is NOT secure for production use with real data.**

- All authentication is handled in the browser (not secure)
- Credentials can be viewed in source code
- No server-side validation
- Not HIPAA compliant
- Use only with sample/demo data

For security details, see [SECURITY.md](SECURITY.md)

## Features

### Equipment Categories

- **Oxygen Concentrators**: 5 subcategories (Portable 5L, Stationary 5L, Portable 10L, Stationary 10L, High Flow 15L)
- **BiPAP Units**: 5 subcategories (Standard BiPAP, Auto BiPAP, BiPAP with Humidifier, Travel BiPAP, BiPAP ST Mode)
- **CPAP Units**: 5 subcategories (Standard CPAP, Auto CPAP, CPAP with Humidifier, Travel CPAP, BiLevel CPAP)

### Tracking Information

- Starting date and end date
- Rent amount and collected amount
- Pending amount calculation
- Due date management
- Number of free units tracking
- Customer information (name, phone, address)
- Equipment notes and status

### Dashboard Features

- Real-time statistics for each equipment type
- Financial summary (collected, pending, overdue amounts)
- Recent activity tracking
- Equipment utilization overview

### Management Tools

- Add new rentals with comprehensive form
- Edit existing rental information
- Collect payments with detailed tracking
- Filter and search functionality
- Status-based categorization (Active, Overdue, Completed)

### Reports

- Monthly performance statistics
- Revenue overview
- Overdue payments tracking
- Equipment utilization reports

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Local Storage for data persistence
- **Icons**: Font Awesome 6.0
- **Responsive Design**: Mobile-friendly interface

## Installation

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. Start managing your medical equipment rentals

## File Structure

```
medical-equipment-rental-tracker/
├── index.html          # Main application file
├── styles.css          # Styling and responsive design
├── script.js           # Application logic and functionality
├── README.md           # Project documentation
└── .github/
    └── copilot-instructions.md
```

## Usage

### Adding a New Rental

1. Navigate to the "Add Rental" section
2. Fill in customer information
3. Select equipment type and subtype
4. Set rental dates and amounts
5. Click "Add Rental" to save

### Managing Existing Rentals

1. Go to "Manage Rentals" section
2. Use filters to find specific rentals
3. Edit, collect payments, or delete rentals as needed
4. Track payment status and due dates

### Dashboard Overview

- View real-time statistics for all equipment
- Monitor financial performance
- Check recent activity
- Identify overdue payments

### Reports

- Access monthly performance data
- View revenue trends
- Monitor equipment utilization
- Track overdue payments

## Data Persistence

The application uses browser Local Storage to save data. Your rental information is automatically saved and will persist between sessions.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

## Features in Detail

### Equipment Subcategories

**Oxygen Concentrators:**

- Portable 5L
- Stationary 5L
- Portable 10L
- Stationary 10L
- High Flow 15L

**BiPAP Units:**

- Standard BiPAP
- Auto BiPAP
- BiPAP with Humidifier
- Travel BiPAP
- BiPAP ST Mode

**CPAP Units:**

- Standard CPAP
- Auto CPAP
- CPAP with Humidifier
- Travel CPAP
- BiLevel CPAP

### Status Tracking

- **Active**: Rental is ongoing with no overdue payments
- **Overdue**: Payment is past due date
- **Completed**: All payments collected

### Financial Management

- Automatic calculation of pending amounts
- Payment collection tracking
- Overdue payment alerts
- Revenue reporting

## 🚀 Deployment

### GitHub Pages Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select source: "Deploy from a branch"
   - Choose branch: `main`
   - Choose folder: `/ (root)`
   - Save

3. **Access Application**:
   - Your app will be available at: `https://yourusername.github.io/repository-name`

### Demo Credentials
- **Username**: `Sajeev`
- **Password**: `1971`

### Local Development

1. **Clone Repository**:
   ```bash
   git clone https://github.com/yourusername/repository-name.git
   cd repository-name
   ```

2. **Open in Browser**:
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

## 🔒 Security Considerations

**CRITICAL**: This application has significant security limitations:

1. **Client-Side Authentication Only**: Easily bypassable
2. **Visible Credentials**: Source code contains authentication logic
3. **No Data Encryption**: All data stored in plain text locally
4. **No Audit Trail**: No logging of access or modifications
5. **Not HIPAA Compliant**: Cannot be used with real patient data

### Recommended for Production:
- Implement server-side authentication
- Use HTTPS everywhere
- Add proper session management
- Implement data encryption
- Add audit logging
- Use secure credential storage

## 📊 Data Storage

- All data stored in browser's localStorage
- No external data transmission
- Data persists until browser cache is cleared
- Export/import functionality for data backup

## 🛠️ Future Enhancements

For production deployment consider:

- Database integration (PostgreSQL, MongoDB)
- Server-side authentication (JWT, OAuth)
- Email notifications for due dates
- PDF report generation
- Inventory management
- Multi-location support
- Payment gateway integration

## Support

For technical support or feature requests, please refer to the application documentation or contact your system administrator.

## License

This software is provided as-is for medical equipment rental management purposes.
