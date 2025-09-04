import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { expenseApi } from "@/services/api";
import { format, isToday, isYesterday } from "date-fns";

const RecentTransactions = () => {
  // Fetch expenses from API
  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await expenseApi.getAll();
      return response.data;
    }
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM dd");
  };

  // Get the 5 most recent expenses
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (isLoading) {
    return <div className="text-center py-4 text-muted-foreground">Loading recent transactions...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error loading transactions</div>;
  }

  if (recentExpenses.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        No transactions yet. Add your first expense to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentExpenses.map(expense => (
        <div 
          key={expense._id || expense.id}
          className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-700 last:border-0"
        >
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback 
                className="bg-red-100 text-red-600 font-medium"
              >
                -
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{expense.description}</p>
              <p className="text-xs text-zinc-500">{formatDate(expense.date)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              -${expense.amount.toFixed(2)}
            </p>
            <Badge 
              variant="outline" 
              className="mt-1 text-xs font-normal"
            >
              {expense.category}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactions;