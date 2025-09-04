import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { savingsApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const GoalCards = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [contribution, setContribution] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState("");

  // Fetch savings goals from API
  const { data: goals = [], isLoading, error } = useQuery({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      const response = await savingsApi.getAll();
      return response.data;
    }
  });

  // Contribute to savings goal mutation
  const contributeMutation = useMutation({
    mutationFn: ({ id, amount }: {id: string, amount: number}) => {
      return savingsApi.contribute(id, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast({
        title: "Success",
        description: "Contribution added successfully",
      });
      setContribution("");
      setSelectedGoalId("");
    },
    onError: (error) => {
      console.error("Failed to add contribution:", error);
      toast({
        title: "Error",
        description: "Failed to add contribution",
        variant: "destructive"
      });
    }
  });

  const handleContribute = () => {
    const amount = parseFloat(contribution);
    if (!selectedGoalId || isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid contribution amount",
        variant: "destructive"
      });
      return;
    }

    contributeMutation.mutate({ id: selectedGoalId, amount });
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading savings goals...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error loading savings goals. Please try again.</div>;
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 border border-gray-200 rounded-lg bg-gray-50">
        No savings goals created yet. Create your first goal to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => {
        const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
        const deadlineDate = new Date(goal.deadline);
        const formattedDeadline = format(deadlineDate, 'MMMM yyyy');
        
        return (
          <Card key={goal._id || goal.id} className="p-4 border-gray-200 bg-white">
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-black">{goal.name}</h3>
                <span className="text-sm text-gray-600">{formattedDeadline}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">${goal.currentAmount.toLocaleString()}</span>
                  <span className="text-gray-900">${goal.targetAmount.toLocaleString()}</span>
                </div>
                <Progress value={percentage} className="h-3 bg-gray-200" />
                <p className="text-center text-sm text-gray-700">
                  {Math.round(percentage)}% Complete
                </p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black"
                    onClick={() => setSelectedGoalId(goal._id || goal.id || '')}
                  >
                    Add Contribution
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white border-gray-200">
                  <DialogHeader>
                    <DialogTitle className="text-black">Add Contribution</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Add money to your "{goal.name}" savings goal.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="contribution" className="text-right text-gray-700 font-medium">
                        Amount
                      </Label>
                      <div className="col-span-3 relative">
                        <span className="absolute left-2 top-2.5 text-gray-500">$</span>
                        <Input
                          id="contribution"
                          type="number"
                          placeholder="0.00"
                          className="pl-6 border-gray-300 focus:border-black focus:ring-black"
                          value={contribution}
                          onChange={(e) => setContribution(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline"
                      onClick={() => setContribution("")}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      onClick={handleContribute}
                      disabled={contributeMutation.isPending}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      {contributeMutation.isPending ? "Adding..." : "Add Contribution"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GoalCards;