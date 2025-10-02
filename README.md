# Medical Equipment Rental Tracker

A comprehensive web-based application for tracking medical equipment rentals including Oxygen Concentrators, BiPAP, and CPAP units.

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

## Security Note

This application stores data locally in your browser. For production use in a business environment, consider implementing:

- Server-side data storage
- User authentication
- Data backup systems
- Multi-user access controls

## Future Enhancements

Potential improvements for production use:

- Database integration
- User authentication system
- Email notifications for due dates
- PDF report generation
- Inventory management
- Multi-location support
- Payment gateway integration

## Support

For technical support or feature requests, please refer to the application documentation or contact your system administrator.

## License

This software is provided as-is for medical equipment rental management purposes.
