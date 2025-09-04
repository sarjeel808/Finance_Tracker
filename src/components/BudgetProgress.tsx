
import { Progress } from "./ui/progress";
import { Budget } from "@/types/finance";
import { useQuery } from "@tanstack/react-query";
import { budgetApi } from "@/services/api";

const BudgetProgress = () => {
  // Fetch budget data from the API
  const { data: budgets = [], isLoading, error } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await budgetApi.getAll();
      return response.data;
    }
  });

  // Helper function to calculate the percentage spent
  const calculatePercentage = (budget: Budget) => {
    return Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
  };

  if (isLoading) {
    return <div className="text-center py-4 text-muted-foreground">Loading budget data...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Failed to load budget data</div>;
  }

  if (budgets.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No budgets found. Create budgets to track your spending.</div>;
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const percentage = calculatePercentage(budget);
        return (
          <div key={budget._id || budget.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{budget.category}</span>
              <span className="text-sm text-zinc-500">
                ${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
              </span>
            </div>
            <Progress 
              value={percentage} 
              className={`h-2 ${
                percentage > 90 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : percentage > 75 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30'
                    : 'bg-green-100 dark:bg-green-900/30'
              }`} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default BudgetProgress;
