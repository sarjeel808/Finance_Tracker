
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { SavingsGoal } from '@/types/finance';
import { format } from 'date-fns';
import { savingsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SavingsGoals: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newGoal, setNewGoal] = useState<Omit<SavingsGoal, 'id'>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') // 90 days from now
  });

  const [contribution, setContribution] = useState<{id: string, amount: number}>({id: '', amount: 0});

  // Fetch savings goals
  const { data: goals = [], isLoading, error } = useQuery({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      const response = await savingsApi.getAll();
      return response.data;
    }
  });

  // Add savings goal mutation
  const addGoalMutation = useMutation({
    mutationFn: (goalData: Omit<SavingsGoal, 'id'>) => {
      return savingsApi.add(goalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast({
        title: "Success",
        description: "Savings goal created successfully",
      });
      setNewGoal({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        deadline: format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      });
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
      setContribution({id: '', amount: 0});
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

  const handleAddGoal = () => {
    if (!newGoal.name || newGoal.targetAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addGoalMutation.mutate(newGoal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (['targetAmount', 'currentAmount'].includes(name)) {
      setNewGoal({
        ...newGoal,
        [name]: parseFloat(value) || 0
      });
    } else {
      setNewGoal({
        ...newGoal,
        [name]: value
      });
    }
  };

  const handleContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContribution({
      ...contribution,
      amount: parseFloat(e.target.value) || 0
    });
  };

  const handleSelectGoal = (id: string) => {
    setContribution({
      id,
      amount: 0
    });
  };

  const handleContribute = () => {
    if (!contribution.id || contribution.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please select a goal and enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    contributeMutation.mutate(contribution);
  };

  const calculatePercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const calculateTimeRemaining = (deadline: string) => {
    const today = new Date();
    const targetDate = new Date(deadline);
    const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) return 'Deadline passed';
    if (daysRemaining === 0) return 'Due today';
    if (daysRemaining === 1) return '1 day remaining';
    return `${daysRemaining} days remaining`;
  };

  // Show error if query fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load savings goals. Using sample data instead.",
        variant: "destructive"
      });
      console.error("Error loading savings goals:", error);
    }
  }, [error, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Savings Goal</CardTitle>
          <CardDescription>Set financial targets to work towards</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g. Vacation, Emergency Fund" 
                value={newGoal.name} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount ($)</Label>
              <Input 
                id="targetAmount" 
                name="targetAmount" 
                type="number" 
                placeholder="0.00" 
                step="0.01"
                value={newGoal.targetAmount || ''} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentAmount">Starting Amount ($)</Label>
              <Input 
                id="currentAmount" 
                name="currentAmount" 
                type="number" 
                placeholder="0.00" 
                step="0.01"
                value={newGoal.currentAmount || ''} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Target Date</Label>
              <Input 
                id="deadline" 
                name="deadline" 
                type="date" 
                value={newGoal.deadline} 
                onChange={handleInputChange} 
              />
            </div>
            
            <Button 
              type="button" 
              className="w-full"
              onClick={handleAddGoal}
              disabled={!newGoal.name || newGoal.targetAmount <= 0 || addGoalMutation.isPending}
            >
              {addGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Add Contribution</CardTitle>
          <CardDescription>Track progress towards your savings goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goalSelect">Select Goal</Label>
              <Select value={contribution.id} onValueChange={handleSelectGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a goal" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map(goal => (
                    <SelectItem key={goal.id} value={goal.id}>{goal.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contributionAmount">Amount ($)</Label>
              <Input 
                id="contributionAmount" 
                name="amount" 
                type="number" 
                placeholder="0.00" 
                step="0.01"
                value={contribution.amount || ''} 
                onChange={handleContributionChange} 
                disabled={!contribution.id}
              />
            </div>
            
            <Button 
              type="button" 
              className="w-full"
              onClick={handleContribute}
              disabled={!contribution.id || contribution.amount <= 0 || contributeMutation.isPending}
            >
              {contributeMutation.isPending ? 'Adding...' : 'Add Contribution'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Savings Goals Progress</CardTitle>
          <CardDescription>Track your progress toward financial goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading savings goals...</div>
            ) : goals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No savings goals set up yet. Create a goal to start saving!
              </div>
            ) : (
              goals.map((goal) => {
                const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{goal.name}</p>
                        <p className="text-sm text-muted-foreground">{calculateTimeRemaining(goal.deadline)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {percentage}% complete
                        </p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsGoals;
