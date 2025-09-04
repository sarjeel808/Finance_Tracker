import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { expenseApi } from "@/services/api";
import { useMemo } from "react";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

const colors = {
  Housing: '#8b5cf6',
  Food: '#10b981',
  Transportation: '#f59e0b',
  Entertainment: '#ef4444',
  Utilities: '#3b82f6',
  Healthcare: '#ec4899',
  Shopping: '#06b6d4',
  Other: '#6b7280',
};

const ExpenseChart = () => {
  // Fetch expenses from API
  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await expenseApi.getAll();
      return response.data;
    }
  });

  // Process data for chart
  const chartData = useMemo(() => {
    if (!expenses.length) return [];

    const currentDate = new Date();
    const monthsData = [];

    // Get last 6 months of data
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });
      
      // Group expenses by category for this month
      const categorizedExpenses = monthExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);
      
      monthsData.push({
        name: format(monthDate, 'MMM'),
        ...categorizedExpenses
      });
    }

    return monthsData;
  }, [expenses]);

  // Get all unique categories for the bars
  const categories = useMemo(() => {
    const allCategories = new Set<string>();
    chartData.forEach(month => {
      Object.keys(month).forEach(key => {
        if (key !== 'name') {
          allCategories.add(key);
        }
      });
    });
    return Array.from(allCategories);
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="text-zinc-500">Loading expense trends...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="text-red-500">Error loading expense data</div>
      </div>
    );
  }

  if (chartData.length === 0 || categories.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="text-zinc-500 text-center">
          <p>No expense data available</p>
          <p className="text-sm mt-1">Add expenses to see monthly trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value?.toLocaleString() || 0}`, undefined]} />
          <Legend />
          {categories.map((category, index) => (
            <Bar 
              key={category}
              dataKey={category} 
              stackId="a" 
              fill={colors[category as keyof typeof colors] || colors.Other} 
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;