import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";

const ResourcesPage = () => {
  return (
    <div className="space-y-6 bg-white min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">Financial Resources</h1>
        <p className="text-gray-600">
          Educational content to improve your financial knowledge
        </p>
      </div>
      
      <Tabs defaultValue="articles">
        <TabsList className="bg-gray-100 border-gray-200">
          <TabsTrigger 
            value="articles"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600"
          >
            Articles
          </TabsTrigger>
          <TabsTrigger 
            value="videos"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600"
          >
            Videos
          </TabsTrigger>
          <TabsTrigger 
            value="tools"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-600"
          >
            Tools
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ResourceCard 
              title="Understanding Emergency Funds"
              description="Learn why you need an emergency fund and how to build one effectively."
              category="Saving"
              time="5 min read"
              image="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop&crop=faces"
            />
            <ResourceCard 
              title="Beginner's Guide to Investing"
              description="Start your investment journey with this simple guide to the basics."
              category="Investing"
              time="8 min read"
              image="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop&crop=faces"
            />
            <ResourceCard 
              title="How to Create a Budget That Works"
              description="Practical tips for creating and sticking to a budget that fits your lifestyle."
              category="Budgeting"
              time="6 min read"
              image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=faces"
            />
            <ResourceCard 
              title="Paying Off Debt: Strategies That Work"
              description="Effective methods to tackle and eliminate debt faster."
              category="Debt Management"
              time="7 min read"
              image="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=300&fit=crop&crop=faces"
            />
            <ResourceCard 
              title="Smart Spending Habits"
              description="Develop healthy spending habits that align with your financial goals."
              category="Money Management"
              time="4 min read"
              image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=faces"
            />
            <ResourceCard 
              title="Building Wealth in Your 20s"
              description="Start building wealth early with these actionable strategies."
              category="Wealth Building"
              time="9 min read"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=faces"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ResourceCard 
              title="5 Financial Habits of Successful People"
              description="Learn the key habits that can transform your financial future."
              category="Financial Planning"
              time="12 min video"
              image="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop&crop=faces"
            />
            <ResourceCard 
              title="Investing 101: Getting Started"
              description="A complete beginner's guide to start investing with any amount."
              category="Investing"
              time="15 min video"
              image="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=300&fit=crop&crop=faces"
            />
            <ResourceCard 
              title="Retirement Planning Made Simple"
              description="Everything you need to know about planning for retirement."
              category="Retirement"
              time="18 min video"
              image="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop&crop=faces"
            />
            <ResourceCard 
              title="Understanding Credit Scores"
              description="How credit scores work and how to improve yours."
              category="Credit"
              time="10 min video"
              image="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop&crop=faces"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="tools" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ResourceCard 
              title="Compound Interest Calculator"
              description="See how your investments can grow over time with the power of compound interest."
              category="Calculator"
              time="Interactive Tool"
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=faces"
            />
            <ResourceCard 
              title="Debt Payoff Planner"
              description="Create a customized plan to eliminate your debt using different strategies."
              category="Planning Tool"
              time="Interactive Tool"
              image="https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400&h=300&fit=crop&crop=faces"
            />
            <ResourceCard 
              title="Budget Tracker Template"
              description="Download our free spreadsheet template to track your monthly budget."
              category="Template"
              time="Download"
              image="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=faces"
            />
            <ResourceCard 
              title="Savings Goal Calculator"
              description="Calculate how much you need to save monthly to reach your financial goals."
              category="Calculator"
              time="Interactive Tool"
              image="https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=400&h=300&fit=crop&crop=faces"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourcesPage;