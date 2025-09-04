# 💰 FinanceTrack - Personal Finance Management App

A modern, full-stack personal finance tracking application built with React, TypeScript, Node.js, and MongoDB.

## ✨ Features

- **📊 Dashboard**: Overview of your financial health with charts and summaries
- **💸 Expense Tracking**: Add, edit, and categorize expenses
- **💰 Budget Management**: Set monthly budgets and track spending
- **🎯 Savings Goals**: Create and manage savings targets with progress tracking
- **📚 Resources**: Educational content with financial tips and tools

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- Tailwind CSS for styling
- Shadcn/ui components
- Recharts for data visualization

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- RESTful API design
- CORS enabled for frontend communication

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd financeTrack
   ```

2. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/smartspend
   PORT=5000
   ```

4. **Seed the database with dummy data:**
   ```bash
   cd server
   npm run seed
   ```

5. **Start the development servers:**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

6. **Open the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📊 Dummy Data

The application comes with pre-populated dummy data including:

- **15 Expenses**: Recent transactions across different categories
- **7 Budget Categories**: Monthly budgets with realistic spending
- **8 Savings Goals**: Various financial targets with progress

### Sample Data Overview:
- **Total Monthly Expenses**: $2,321.08
- **Total Monthly Budget**: $2,850.00
- **Total Savings**: $41,200.00

## 🏗️ Project Structure

```
financeTrack/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   └── hooks/             # Custom React hooks
├── server/                # Backend source code
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── seed-data.js       # Database seeding script
│   └── server.js          # Express server
└── public/                # Static assets
```

## 🎨 UI Design

- **Clean Black & White Theme**: Consistent, professional design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Minimal Interface**: Focus on essential features without clutter
- **Accessible Components**: Built with Shadcn/ui for accessibility

## 📱 Pages & Features

### Dashboard
- Financial summary cards
- Expense breakdown chart
- Recent transactions list
- Quick action buttons

### Expenses
- Add new expenses with categories
- View all transactions in a table
- Edit and delete existing expenses

### Budgets
- Create monthly budgets by category
- View budget vs actual spending
- Visual progress indicators
- Over-budget warnings

### Savings Goals
- Set target amounts and deadlines
- Track progress with visual indicators
- Add contributions to goals
- Multiple active goals management

### Resources
- Educational articles about finance
- Video content for learning
- Interactive financial tools
- Professional images from Unsplash

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Populate database with dummy data

## 🗃️ Database Schema

### Expenses
- category, amount, date, description, userId
- Timestamps for creation and updates

### Budgets
- category, amount, spent, period, userId
- Automatic spent calculation from expenses

### Savings Goals
- name, targetAmount, currentAmount, deadline, userId
- Progress tracking and contribution history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the component library
- [Unsplash](https://unsplash.com/) for high-quality images
- [Recharts](https://recharts.org/) for data visualization
- [TanStack Query](https://tanstack.com/query/) for data fetching

---

**Happy budgeting! 💰✨**
