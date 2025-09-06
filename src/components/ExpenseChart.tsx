import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { expenseApi } from "@/services/api";
import { useMemo, useState } from "react";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { Button } from "@/components/ui/button";

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
  const [timeRange, setTimeRange] = useState<3 | 6 | 12>(6);

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

    // Get data for selected time range
    for (let i = timeRange - 1; i >= 0; i--) {
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
  }, [expenses, timeRange]);

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

  // Calculate total expenses for the period
  const totalExpenses = useMemo(() => {
    return chartData.reduce((total, month) => {
      const monthTotal = Object.keys(month)
        .filter(key => key !== 'name')
        .reduce((sum, category) => sum + (month[category] || 0), 0);
      return total + monthTotal;
    }, 0);
  }, [chartData]);

  // Calculate average monthly expenses
  const averageMonthly = useMemo(() => {
    return chartData.length > 0 ? totalExpenses / chartData.length : 0;
  }, [totalExpenses, chartData.length]);

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
    <div className="w-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Total ({timeRange} months)</div>
          <div className="text-2xl font-bold text-black">${totalExpenses.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Monthly Average</div>
          <div className="text-2xl font-bold text-black">${averageMonthly.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Categories</div>
          <div className="text-2xl font-bold text-black">{categories.length}</div>
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant={timeRange === 3 ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange(3)}
          className={timeRange === 3 ? "bg-black text-white" : "border-gray-300 text-gray-700"}
        >
          3 Months
        </Button>
        <Button
          variant={timeRange === 6 ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange(6)}
          className={timeRange === 6 ? "bg-black text-white" : "border-gray-300 text-gray-700"}
        >
          6 Months
        </Button>
        <Button
          variant={timeRange === 12 ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange(12)}
          className={timeRange === 12 ? "bg-black text-white" : "border-gray-300 text-gray-700"}
        >
          12 Months
        </Button>
      </div>
      
      <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            opacity={0.7} 
          />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            className="text-gray-600"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '14px'
            }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />
          {categories.map((category, index) => (
            <Bar 
              key={category}
              dataKey={category} 
              stackId="a" 
              fill={colors[category as keyof typeof colors] || colors.Other}
              radius={[0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;