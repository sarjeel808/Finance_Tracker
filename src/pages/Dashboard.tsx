import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import RecentTransactions from "@/components/RecentTransactions";
import SummaryCards from "@/components/SummaryCards";
import ExpenseBreakdown from "@/components/ExpenseBreakdown";
import BudgetProgress from "@/components/BudgetProgress";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard</h1>
          <p className="text-gray-600">Track your personal finances</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button 
            onClick={() => navigate('/expenses')}
            className="bg-black text-white hover:bg-gray-800"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200 bg-white">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-black">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ExpenseBreakdown />
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 bg-white">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-black">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;