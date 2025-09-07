import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RecentTransactions from "@/components/RecentTransactions";
import SummaryCards from "@/components/SummaryCards";
import ExpenseBreakdown from "@/components/ExpenseBreakdown";
import BudgetProgress from "@/components/BudgetProgress";
import AddExpenseDialog from "@/components/AddExpenseDialog";

const Dashboard = () => {

  return (
    <div className="space-y-4 sm:space-y-6 bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Track your personal finances</p>
        </div>
        <div className="flex gap-3 self-start sm:self-auto">
          <AddExpenseDialog />
        </div>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
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