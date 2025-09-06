import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { expenseApi } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Expense } from "@/types/finance";

interface EditExpenseDialogProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditExpenseDialog = ({ expense, open, onOpenChange }: EditExpenseDialogProps) => {
  const [editExpense, setEditExpense] = useState({
    description: "",
    amount: "",
    category: "",
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update local state when expense prop changes
  useEffect(() => {
    if (expense) {
      setEditExpense({
        description: expense.description,
        amount: expense.amount.toString(),
        category: expense.category,
        date: format(new Date(expense.date), 'yyyy-MM-dd'),
      });
    }
  }, [expense]);

  const updateExpenseMutation = useMutation({
    mutationFn: (expenseData: any) => {
      if (!expense?._id && !expense?.id) {
        throw new Error("No expense ID found");
      }
      return expenseApi.update(expense._id || expense.id || "", expenseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Failed to update expense:", error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive"
      });
    }
  });

  const handleUpdateExpense = () => {
    if (!editExpense.description || !editExpense.amount || !editExpense.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const expenseData = {
      description: editExpense.description,
      amount: parseFloat(editExpense.amount),
      category: editExpense.category,
      date: editExpense.date,
    };

    updateExpenseMutation.mutate(expenseData);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form when closing
    if (expense) {
      setEditExpense({
        description: expense.description,
        amount: expense.amount.toString(),
        category: expense.category,
        date: format(new Date(expense.date), 'yyyy-MM-dd'),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-black">Edit Expense</DialogTitle>
          <DialogDescription className="text-gray-600">
            Update the expense details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-description" className="text-gray-700 font-medium">Description</Label>
            <Input 
              id="edit-description" 
              placeholder="e.g., Grocery shopping"
              value={editExpense.description}
              onChange={(e) => setEditExpense({ ...editExpense, description: e.target.value })}
              className="border-gray-300 focus:border-black focus:ring-black"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-amount" className="text-gray-700 font-medium">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input 
                  id="edit-amount" 
                  placeholder="0.00" 
                  type="number" 
                  step="0.01"
                  className="pl-8 border-gray-300 focus:border-black focus:ring-black"
                  value={editExpense.amount}
                  onChange={(e) => setEditExpense({ ...editExpense, amount: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category" className="text-gray-700 font-medium">Category</Label>
              <Select 
                value={editExpense.category} 
                onValueChange={(value) => setEditExpense({ ...editExpense, category: value })}
              >
                <SelectTrigger id="edit-category" className="border-gray-300 focus:border-black focus:ring-black">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-date" className="text-gray-700 font-medium">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={editExpense.date}
              onChange={(e) => setEditExpense({ ...editExpense, date: e.target.value })}
              className="border-gray-300 focus:border-black focus:ring-black"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleUpdateExpense}
            disabled={updateExpenseMutation.isPending}
            className="bg-black text-white hover:bg-gray-800"
          >
            {updateExpenseMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseDialog;
