import { Card, CardContent } from "./ui/card";
import { DollarSign, TrendingDown, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { expenseApi, budgetApi, savingsApi } from "@/services/api";
import { useMemo } from "react";
import { startOfMonth, endOfMonth } from "date-fns";

const SummaryCards = () => {
  // Fetch all data
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await expenseApi.getAll();
      return response.data;
    }
  });

  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await budgetApi.getAll();
      return response.data;
    }
  });

  const { data: savingsGoals = [] } = useQuery({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      const response = await savingsApi.getAll();
      return response.data;
    }
  });

  // Calculate summary data
  const summaryData = useMemo(() => {
    const currentDate = new Date();
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);

    // Current month expenses
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
    });

    const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Budget totals
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);

    // Savings totals
    const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

    return {
      monthlyExpenses: currentMonthTotal,
      totalBudget,
      totalSavings,
      activeGoals: savingsGoals.length
    };
  }, [expenses, budgets, savingsGoals]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
            <h3 className="text-2xl font-bold text-black mt-1">${summaryData.monthlyExpenses.toLocaleString()}</h3>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <TrendingDown className="w-5 h-5 text-black" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Budget</p>
            <h3 className="text-2xl font-bold text-black mt-1">${summaryData.totalBudget.toLocaleString()}</h3>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <DollarSign className="w-5 h-5 text-black" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Savings</p>
            <h3 className="text-2xl font-bold text-black mt-1">${summaryData.totalSavings.toLocaleString()}</h3>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <Target className="w-5 h-5 text-black" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;