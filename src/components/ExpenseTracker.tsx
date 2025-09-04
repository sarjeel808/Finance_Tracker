
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Expense } from '@/types/finance';
import { format } from 'date-fns';
import { expenseApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Edit } from 'lucide-react';

const ExpenseTracker: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    category: '',
    amount: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    description: ''
  });

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch expenses
  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await expenseApi.getAll();
      return response.data;
    }
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: (expenseData: Omit<Expense, 'id'>) => {
      return expenseApi.add(expenseData);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
      // Reset form
      resetForm();
    },
    onError: (error) => {
      console.error("Failed to add expense:", error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive"
      });
    }
  });

  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: (expense: Expense) => {
      return expenseApi.update(expense._id || expense.id || '', expense);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
      resetForm();
      setIsEditing(false);
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

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
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

  const resetForm = () => {
    setNewExpense({
      category: '',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      description: ''
    });
    setEditingExpense(null);
  };

  const handleAddExpense = () => {
    if (!newExpense.category || newExpense.amount <= 0 || !newExpense.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addExpenseMutation.mutate(newExpense);
  };

  const handleUpdateExpense = () => {
    if (!editingExpense || !editingExpense.category || editingExpense.amount <= 0 || !editingExpense.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    updateExpenseMutation.mutate(editingExpense);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpenseMutation.mutate(id);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense({
      ...expense,
      date: format(new Date(expense.date), 'yyyy-MM-dd')
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isEditForm = false) => {
    const { name, value } = e.target;
    
    if (isEditForm && editingExpense) {
      setEditingExpense({
        ...editingExpense,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value
      });
    } else {
      setNewExpense({
        ...newExpense,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value
      });
    }
  };

  const handleCategoryChange = (value: string, isEditForm = false) => {
    if (isEditForm && editingExpense) {
      setEditingExpense({
        ...editingExpense,
        category: value
      });
    } else {
      setNewExpense({
        ...newExpense,
        category: value
      });
    }
  };

  // Show error if query fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load expenses. Check that the server is running.",
        variant: "destructive"
      });
      console.error("Error loading expenses:", error);
    }
  }, [error, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>{isEditing ? 'Update Expense' : 'Track New Expense'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Edit your expense record' : 'Log your spending to track your finances'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expenseCategory">Category</Label>
              <Select 
                value={isEditing && editingExpense ? editingExpense.category : newExpense.category}
                onValueChange={(value) => handleCategoryChange(value, isEditing)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Groceries">Groceries</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Dining">Dining</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                placeholder="0.00" 
                step="0.01"
                value={isEditing && editingExpense ? editingExpense.amount || '' : newExpense.amount || ''} 
                onChange={(e) => handleInputChange(e, isEditing)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                value={isEditing && editingExpense ? editingExpense.date : newExpense.date} 
                onChange={(e) => handleInputChange(e, isEditing)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                name="description" 
                placeholder="What was this expense for?" 
                value={isEditing && editingExpense ? editingExpense.description : newExpense.description} 
                onChange={(e) => handleInputChange(e, isEditing)} 
              />
            </div>
            
            {isEditing ? (
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  className="flex-1"
                  onClick={handleUpdateExpense}
                  disabled={!editingExpense || !editingExpense.category || editingExpense.amount <= 0 || !editingExpense.description || updateExpenseMutation.isPending}
                >
                  {updateExpenseMutation.isPending ? 'Updating...' : 'Update Expense'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                type="button" 
                className="w-full"
                onClick={handleAddExpense}
                disabled={!newExpense.category || newExpense.amount <= 0 || !newExpense.description || addExpenseMutation.isPending}
              >
                {addExpenseMutation.isPending ? 'Adding...' : 'Add Expense'}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest spending entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading expenses...</div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No expenses recorded yet. Start tracking your spending!
              </div>
            ) : (
              expenses.map((expense) => (
                <div key={expense._id || expense.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{expense.category}</p>
                      <p className="text-sm text-muted-foreground">{expense.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">${parseFloat(expense.amount.toString()).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(expense.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditExpense(expense)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteExpense(expense._id || expense.id || '')}
                          disabled={deleteExpenseMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
