
// Types for the finance application

export interface Expense {
  _id?: string;
  id?: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  _id?: string;
  id?: string;
  category: string;
  amount: number;
  spent: number;
  period: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavingsGoal {
  _id?: string;
  id?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialSummary {
  totalExpenses: number;
  totalSavings: number;
  budgetUsage: number;
  monthlyComparison: number;
  upcomingBills: ExpenseForecast[];
}

export interface ExpenseForecast {
  name: string;
  amount: number;
  dueDate: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface FinancialTip {
  id: string;
  title: string;
  content: string;
  category: string;
}
