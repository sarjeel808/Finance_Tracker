import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpensesTable from "@/components/ExpensesTable";
import AddExpenseDialog from "@/components/AddExpenseDialog";
import ExpenseChart from "@/components/ExpenseChart";

const ExpensePage = () => {

  return (
    <div className="space-y-4 sm:space-y-6 bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">Expenses</h1>
          <p className="text-gray-600 text-sm sm:text-base">Track your spending</p>
        </div>
        <div className="self-start sm:self-auto">
          <AddExpenseDialog />
        </div>
      </div>

      {/* Monthly Expense Trends Chart */}
      <Card className="border-gray-200 bg-white">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-black">Monthly Expense Trends</CardTitle>
          <CardDescription className="text-gray-600">
            Track your spending patterns across the last 6 months by category
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ExpenseChart />
        </CardContent>
      </Card>

      {/* All Expenses Table */}
      <Card className="border-gray-200 bg-white">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-black">All Expenses</CardTitle>
          <CardDescription className="text-gray-600">
            View and manage all your recorded expenses
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ExpensesTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensePage;