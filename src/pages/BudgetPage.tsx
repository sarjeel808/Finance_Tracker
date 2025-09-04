import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3 } from "lucide-react";
import BudgetOverview from "@/components/BudgetOverview";
import BudgetEditor from "@/components/BudgetEditor";

const BudgetPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Budgets</h1>
          <p className="text-gray-600">Manage your spending limits</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={() => setActiveTab("manage")}
            className="bg-black text-white hover:bg-gray-800"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Budget
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 border-gray-200">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black text-gray-600"
          >
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="manage" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-black text-gray-600"
          >
            <PlusCircle className="h-4 w-4" />
            Manage
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <Card className="border-gray-200 bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">Budget Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <BudgetOverview />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage" className="mt-6">
          <Card className="border-gray-200 bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-black">Manage Budgets</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <BudgetEditor />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetPage;