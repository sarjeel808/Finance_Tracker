import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { savingsApi } from "@/services/api";
import { format } from "date-fns";

const SavingsGoalsList = () => {
  // Fetch savings goals from API
  const { data: savingsGoals = [], isLoading, error } = useQuery({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      const response = await savingsApi.getAll();
      return response.data;
    }
  });

  if (isLoading) {
    return <div>Loading savings goals...</div>;
  }

  if (error) {
    return <div>Error loading savings goals. Please try again.</div>;
  }

  if (savingsGoals.length === 0) {
    return (
      <div className="text-center text-zinc-500 py-8">
        No savings goals created yet. Create your first goal to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {savingsGoals.map((goal) => {
        const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
        const deadlineDate = new Date(goal.deadline);
        const formattedDeadline = format(deadlineDate, 'MMM yyyy');
        
        return (
          <div key={goal._id || goal.id} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{goal.name}</span>
              <span className="text-sm text-zinc-500">{formattedDeadline}</span>
            </div>
            <Progress value={percentage} />
            <div className="flex justify-between text-xs">
              <span>${goal.currentAmount.toLocaleString()}</span>
              <span className={cn(
                percentage >= 50 ? "text-green-600" : "text-zinc-500"
              )}>
                {Math.round(percentage)}%
              </span>
              <span>${goal.targetAmount.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavingsGoalsList;