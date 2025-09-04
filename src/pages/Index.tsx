
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseTracker from '@/components/ExpenseTracker';
import BudgetManager from '@/components/BudgetManager';
import FinancialResources from '@/components/FinancialResources';
import SavingsGoals from '@/components/SavingsGoals';
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Personal Finance Dashboard</h1>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link to="/assignment">Assignment Builder</Link>
            </Button>
            <Button variant="default" asChild>
              <Link to="/assignment-creator">New Assignment Creator</Link>
            </Button>
          </div>
        </div>
        
        <Dashboard />
        
        <Tabs defaultValue="expenses" className="mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="savings">Savings Goals</TabsTrigger>
            <TabsTrigger value="resources">Financial Resources</TabsTrigger>
          </TabsList>
          <TabsContent value="expenses">
            <ExpenseTracker />
          </TabsContent>
          <TabsContent value="budgets">
            <BudgetManager />
          </TabsContent>
          <TabsContent value="savings">
            <SavingsGoals />
          </TabsContent>
          <TabsContent value="resources">
            <FinancialResources />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
