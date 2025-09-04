import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetApi } from "@/services/api";
import { Budget } from "@/types/finance";
import { useEffect } from "react";

const BudgetOverview = () => {
  const queryClient = useQueryClient();

  // Query budgets from the API
  const { data: budgets = [], isLoading, error } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await budgetApi.getAll();
      return response.data;
    }
  });

  // Calculate budget spent values mutation
  const calculateBudgetsMutation = useMutation({
    mutationFn: () => {
      return budgetApi.calculateSpent();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    }
  });

  // Calculate totals
  const totalBudget = budgets.reduce((sum: number, budget: Budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum: number, budget: Budget) => sum + (budget.spent || 0), 0);
  const totalPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Fetch budget calculations when component mounts
  useEffect(() => {
    if (budgets.length > 0) {
      calculateBudgetsMutation.mutate();
    }
  }, [budgets.length]);

  if (isLoading) {
    return (
      <div className="text-center py-4 text-gray-600">Loading budget data...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">Failed to load budget data</div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 border border-gray-200 rounded-lg bg-gray-50">
        No budgets found. Create budgets in the "Manage Budgets" tab to get started.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Budget Overview */}
      <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-gray-900">Total Budget Utilization</span>
          <span className="font-medium text-gray-700">
            ${totalSpent.toFixed(2)} of ${totalBudget.toFixed(2)}
          </span>
        </div>
        <Progress 
          value={totalPercentage} 
          className="h-3 bg-gray-200"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{totalPercentage}% used</span>
          <span>${(totalBudget - totalSpent).toFixed(2)} remaining</span>
        </div>
      </div>

      {/* Budget Warning Alert */}
      {totalPercentage > 90 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You're close to exceeding your total budget. Consider reducing expenses.
          </AlertDescription>
        </Alert>
      )}

      {/* Individual Budget Categories */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold mb-4 text-gray-900">Budget by Category</h3>
        <div className="space-y-4">
          {budgets.map((budget: Budget) => {
            const spent = budget.spent || 0;
            const percentage = Math.min(Math.round((spent / budget.amount) * 100), 100);
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage > 90;
            const isWarning = percentage > 75;
            
            return (
              <div key={budget._id || budget.id} className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{budget.category}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    isOverBudget ? "text-red-600" : 
                    isNearLimit ? "text-orange-600" : 
                    "text-gray-700"
                  )}>
                    ${spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={cn(
                    "h-2",
                    isOverBudget ? "bg-red-100" :
                    isNearLimit ? "bg-orange-100" :
                    isWarning ? "bg-yellow-100" :
                    "bg-gray-200"
                  )}
                />
                <div className="flex justify-between text-xs">
                  <span className={cn(
                    isOverBudget ? "text-red-600" :
                    isNearLimit ? "text-orange-600" :
                    "text-gray-600"
                  )}>
                    {percentage}% used
                  </span>
                  <span className="text-gray-600">
                    ${Math.max(budget.amount - spent, 0).toFixed(2)} remaining
                  </span>
                </div>
                {isOverBudget && (
                  <div className="text-xs text-red-600 font-medium">
                    Over budget by ${(spent - budget.amount).toFixed(2)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;