import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusCircle, Target } from "lucide-react";
import GoalCards from "@/components/GoalCards";
import { savingsApi } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const GoalsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addGoalMutation = useMutation({
    mutationFn: (goalData: any) => {
      return savingsApi.add(goalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast({
        title: "Success",
        description: "Savings goal created successfully",
      });
      setNewGoal({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      console.error("Failed to add savings goal:", error);
      toast({
        title: "Error",
        description: "Failed to create savings goal",
        variant: "destructive"
      });
    }
  });

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const goalData = {
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      deadline: newGoal.deadline,
    };

    addGoalMutation.mutate(goalData);
  };

  return (
    <div className="space-y-6 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Savings Goals</h1>
          <p className="text-gray-600">Track your financial targets</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800">
                <Target className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-black">Create Savings Goal</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Set a financial target and deadline
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="goal-name" className="text-gray-700 font-medium">Goal Name</Label>
                  <Input 
                    id="goal-name" 
                    placeholder="e.g., Emergency Fund"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="target-amount" className="text-gray-700 font-medium">Target Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <Input 
                        id="target-amount" 
                        placeholder="5000.00" 
                        type="number" 
                        step="0.01"
                        className="pl-8 border-gray-300 focus:border-black focus:ring-black"
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="current-amount" className="text-gray-700 font-medium">Current Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <Input 
                        id="current-amount" 
                        placeholder="0.00" 
                        type="number" 
                        step="0.01"
                        className="pl-8 border-gray-300 focus:border-black focus:ring-black"
                        value={newGoal.currentAmount}
                        onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="target-date" className="text-gray-700 font-medium">Target Date</Label>
                  <Input
                    id="target-date"
                    type="date"
                    value={newGoal.deadline}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  onClick={handleAddGoal}
                  disabled={addGoalMutation.isPending}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {addGoalMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-gray-200 bg-white">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-black">Your Goals</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <GoalCards />
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsPage;