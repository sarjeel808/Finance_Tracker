import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Budget } from "@/types/finance";
import { budgetApi } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const BudgetEditor = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
    period: "Monthly" as Budget["period"],
  });

  // Fetch budgets from API
  const { data: budgets = [], isLoading, error } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await budgetApi.getAll();
      return response.data;
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
      setNewBudget({
        category: "",
        amount: "",
        period: "Monthly",
      });
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

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const budgetData = {
      category: newBudget.category,
      amount: parseFloat(newBudget.amount),
      period: newBudget.period,
    };

    addBudgetMutation.mutate(budgetData);
  };

  const handleUpdateBudget = (budget: Budget, field: string, value: string | number) => {
    const updatedBudget = {
      ...budget,
      [field]: field === "amount" ? parseFloat(value as string) : value,
    };
    updateBudgetMutation.mutate(updatedBudget);
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudgetMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-600">Loading budgets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-600">Error loading budgets. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Budget Form */}
      <div className="grid md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div>
          <Label htmlFor="new-category" className="text-gray-700 font-medium">Category</Label>
          <Input
            id="new-category"
            placeholder="e.g., Housing"
            value={newBudget.category}
            onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
            className="mt-1 border-gray-300 focus:border-black focus:ring-black"
          />
        </div>
        <div>
          <Label htmlFor="new-amount" className="text-gray-700 font-medium">Amount</Label>
          <div className="relative mt-1">
            <span className="absolute left-2 top-2.5 text-gray-500">$</span>
            <Input
              id="new-amount"
              type="number"
              placeholder="0.00"
              className="pl-6 border-gray-300 focus:border-black focus:ring-black"
              value={newBudget.amount}
              onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="new-period" className="text-gray-700 font-medium">Period</Label>
          <Select
            value={newBudget.period}
            onValueChange={(value) => setNewBudget({ 
              ...newBudget, 
              period: value as "Weekly" | "Monthly" | "Quarterly" | "Yearly"
            })}
          >
            <SelectTrigger id="new-period" className="mt-1 border-gray-300 focus:border-black focus:ring-black">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Quarterly">Quarterly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleAddBudget}
          disabled={addBudgetMutation.isPending}
          className="bg-black text-white hover:bg-gray-800 border-black"
        >
          {addBudgetMutation.isPending ? "Adding..." : "Add Budget Category"}
        </Button>
      </div>
      
      {/* Current Budget Categories */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-medium mb-4 text-gray-900">Current Budget Categories</h3>
        
        <div className="space-y-4">
          {budgets.length === 0 ? (
            <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg bg-gray-50">
              No budgets created yet. Add your first budget above.
            </div>
          ) : (
            budgets.map((budget) => (
              <div key={budget._id || budget.id} className="grid md:grid-cols-4 gap-4 items-center p-4 border border-gray-200 rounded-lg bg-white">
                <div>
                  <Input
                    value={budget.category}
                    onChange={(e) => handleUpdateBudget(budget, "category", e.target.value)}
                    disabled={updateBudgetMutation.isPending}
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-2 top-2.5 text-gray-500">$</span>
                  <Input
                    type="number"
                    className="pl-6 border-gray-300 focus:border-black focus:ring-black"
                    value={budget.amount}
                    onChange={(e) => handleUpdateBudget(budget, "amount", e.target.value)}
                    disabled={updateBudgetMutation.isPending}
                  />
                </div>
                <Select
                  value={budget.period}
                  onValueChange={(value) => handleUpdateBudget(
                    budget, 
                    "period", 
                    value as "Weekly" | "Monthly" | "Quarterly" | "Yearly"
                  )}
                  disabled={updateBudgetMutation.isPending}
                >
                  <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDeleteBudget(budget._id || budget.id || '')}
                    disabled={deleteBudgetMutation.isPending}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black"
                  >
                    {deleteBudgetMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetEditor;