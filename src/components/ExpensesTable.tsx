
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseApi } from "@/services/api";
import { Expense } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import EditExpenseDialog from "@/components/EditExpenseDialog";

interface ExpensesTableProps {
  recent?: boolean;
  recurring?: boolean;
}

const ExpensesTable = ({ recent, recurring }: ExpensesTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch expenses
  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await expenseApi.getAll();
      return response.data;
    }
  });

  // Delete expense mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return expenseApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Failed to delete expense:", error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive"
      });
    }
  });

  // Transform API data to add isRecurring field based on description (in a real app this would be a field in the model)
  const expensesWithMeta = expenses.map((expense: Expense) => ({
    ...expense,
    isRecurring: expense.description.toLowerCase().includes('subscription') || 
                 expense.description.toLowerCase().includes('bill') || 
                 expense.description.toLowerCase().includes('monthly')
  }));

  // Filter expenses based on props
  const filteredExpenses = expensesWithMeta
    .filter((expense: any) => {
      if (recurring && !expense.isRecurring) return false;
      if (recent) {
        // Show only expenses from the last 48 hours
        const expenseDate = new Date(expense.date);
        const now = new Date();
        const hoursDiff = Math.abs(now.getTime() - expenseDate.getTime()) / 36e5;
        return hoursDiff <= 48;
      }
      return true;
    })
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditingExpense(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading expenses...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load expenses. Check that the server is running.
      </div>
    );
  }

  return (
    <>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead className="whitespace-nowrap">Description</TableHead>
            <TableHead className="whitespace-nowrap">Category</TableHead>
            <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
            <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
          </TableRow>
        </TableHeader>
      <TableBody>
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense: any) => (
            <TableRow key={expense._id || expense.id}>
              <TableCell>{formatDate(expense.date)}</TableCell>
              <TableCell>
                {expense.description}
                {expense.isRecurring && (
                  <Badge variant="outline" className="ml-2">Recurring</Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{expense.category}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                ${parseFloat(expense.amount.toString()).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(expense)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(expense._id || expense.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              {recurring ? "No recurring expenses found" : 
               recent ? "No recent expenses found" : 
               "No expenses found"}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      </Table>
    </div>
    
    <EditExpenseDialog 
      expense={editingExpense}
      open={isEditDialogOpen}
      onOpenChange={handleEditDialogClose}
    />
  </>
  );
};

export default ExpensesTable;
