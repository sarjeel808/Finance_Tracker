
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Budget } from '@/types/finance';
import { budgetApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Edit } from 'lucide-react';

const BudgetManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newBudget, setNewBudget] = useState<Omit<Budget, 'id' | 'spent'>>({
    category: '',
    amount: 0,
    period: 'Monthly'
  });

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch budgets
  const { data: budgets = [], isLoading, error } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await budgetApi.getAll();
      return response.data;
    }
  });

  // Calculate budget spent amounts
  const calculateBudgetsMutation = useMutation({
    mutationFn: () => {
      return budgetApi.calculateSpent();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Budget calculations updated",
      });
    }
  });

  // Add budget mutation
  const addBudgetMutation = useMutation({
    mutationFn: (budgetData: Omit<Budget, 'id' | 'spent'>) => {
      return budgetApi.add({ ...budgetData, spent: 0 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Budget created successfully",
      });
      resetForm();
    },
    onError: (error) => {
      console.error("Failed to add budget:", error);
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive"
      });
    }
  });

  // Update budget mutation
  const updateBudgetMutation = useMutation({
    mutationFn: (budget: Budget) => {
      return budgetApi.update(budget._id || budget.id || '', budget);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
      resetForm();
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Failed to update budget:", error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive"
      });
    }
  });

  // Delete budget mutation
  const deleteBudgetMutation = useMutation({
    mutationFn: (id: string) => {
      return budgetApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Failed to delete budget:", error);
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive"
      });
    }
  });

  // Auto-calculate budget spent values when component mounts
  useEffect(() => {
    if (budgets.length > 0) {
      calculateBudgetsMutation.mutate();
    }
  }, [budgets.length]);

  const resetForm = () => {
    setNewBudget({
      category: '',
      amount: 0,
      period: 'Monthly'
    });
    setEditingBudget(null);
  };

  const handleAddBudget = () => {
    if (!newBudget.category || newBudget.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addBudgetMutation.mutate(newBudget);
  };

  const handleUpdateBudget = () => {
    if (!editingBudget || !editingBudget.category || editingBudget.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    updateBudgetMutation.mutate(editingBudget);
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudgetMutation.mutate(id);
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget({
      ...budget
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isEditForm = false) => {
    const { name, value } = e.target;
    
    if (isEditForm && editingBudget) {
      setEditingBudget({
        ...editingBudget,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value
      });
    } else {
      setNewBudget({
        ...newBudget,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value
      });
    }
  };

  const handleCategoryChange = (value: string, isEditForm = false) => {
    if (isEditForm && editingBudget) {
      setEditingBudget({
        ...editingBudget,
        category: value
      });
    } else {
      setNewBudget({
        ...newBudget,
        category: value
      });
    }
  };

  const handlePeriodChange = (value: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly', isEditForm = false) => {
    if (isEditForm && editingBudget) {
      setEditingBudget({
        ...editingBudget,
        period: value
      });
    } else {
      setNewBudget({
        ...newBudget,
        period: value
      });
    }
  };

  const calculatePercentage = (spent: number, total: number) => {
    return Math.min(Math.round((spent / total) * 100), 100);
  };

  // Show error if query fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load budgets. Check that the server is running.",
        variant: "destructive"
      });
      console.error("Error loading budgets:", error);
    }
  }, [error, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>{isEditing ? 'Update Budget' : 'Create Budget'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Edit your existing budget' : 'Set spending limits for different categories'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budgetCategory">Category</Label>
              <Select 
                value={isEditing && editingBudget ? editingBudget.category : newBudget.category}
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
              <Label htmlFor="amount">Budget Amount ($)</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                placeholder="0.00" 
                step="0.01"
                value={isEditing && editingBudget ? editingBudget.amount || '' : newBudget.amount || ''} 
                onChange={(e) => handleInputChange(e, isEditing)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select 
                value={isEditing && editingBudget ? editingBudget.period : newBudget.period} 
                onValueChange={(value) => handlePeriodChange(value as 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly', isEditing)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isEditing ? (
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  className="flex-1"
                  onClick={handleUpdateBudget}
                  disabled={!editingBudget || !editingBudget.category || editingBudget.amount <= 0 || updateBudgetMutation.isPending}
                >
                  {updateBudgetMutation.isPending ? 'Updating...' : 'Update Budget'}
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
                onClick={handleAddBudget}
                disabled={!newBudget.category || newBudget.amount <= 0 || addBudgetMutation.isPending}
              >
                {addBudgetMutation.isPending ? 'Creating...' : 'Create Budget'}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Current Budgets</CardTitle>
          <CardDescription>Track your spending against your budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading budgets...</div>
            ) : budgets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No budgets set up yet. Create a budget to start managing your finances!
              </div>
            ) : (
              budgets.map((budget) => {
                const percentage = calculatePercentage(budget.spent, budget.amount);
                return (
                  <div key={budget._id || budget.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{budget.category}</p>
                        <p className="text-sm text-muted-foreground">{budget.period}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-semibold">${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {percentage >= 90 ? 'Budget limit approaching!' : `${100 - percentage}% remaining`}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditBudget(budget)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteBudget(budget._id || budget.id || '')}
                            disabled={deleteBudgetMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${percentage >= 90 ? 'bg-red-100' : ''}`}
                    />
                  </div>
                )
              })
            )}
          </div>
          {budgets.length > 0 && (
            <div className="mt-6">
              <Button 
                onClick={() => calculateBudgetsMutation.mutate()} 
                variant="outline"
                disabled={calculateBudgetsMutation.isPending}
              >
                {calculateBudgetsMutation.isPending ? 'Updating...' : 'Update Budget Calculations'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetManager;
