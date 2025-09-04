
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { FinancialTip } from '@/types/finance';

const FinancialResources: React.FC = () => {
  const [tips] = useState<FinancialTip[]>([
    {
      id: '1',
      title: 'Emergency Fund Basics',
      content: 'An emergency fund should cover 3-6 months of essential expenses. Start small by setting aside $25-$50 per week and gradually increase as your budget allows.',
      category: 'saving'
    },
    {
      id: '2',
      title: '50/30/20 Budgeting Rule',
      content: 'Allocate 50% of your income to necessities, 30% to wants, and 20% to savings and debt repayment. This simple framework can help balance your spending and saving priorities.',
      category: 'budgeting'
    },
    {
      id: '3',
      title: 'Understanding Credit Scores',
      content: 'Your credit score is influenced by payment history (35%), amounts owed (30%), length of credit history (15%), new credit (10%), and credit mix (10%). Regularly check your credit report for errors.',
      category: 'credit'
    },
    {
      id: '4',
      title: 'Debt Snowball Method',
      content: 'Pay minimum payments on all debts, then focus extra money on the smallest debt. Once paid off, move to the next smallest. This approach provides psychological wins that keep you motivated.',
      category: 'debt'
    },
    {
      id: '5',
      title: 'Automating Your Savings',
      content: 'Set up automatic transfers to your savings account on payday. What you don\'t see in your checking account, you won\'t miss spending.',
      category: 'saving'
    },
    {
      id: '6',
      title: 'Zero-Based Budgeting',
      content: 'Give every dollar a job by allocating your entire income to expenses, savings, and debt payments until you reach zero. This ensures intentional use of all your money.',
      category: 'budgeting'
    }
  ]);

  const [articles] = useState([
    {
      id: '1',
      title: 'Investing for Beginners',
      excerpt: 'Learn the basics of investing, including stocks, bonds, mutual funds, and ETFs.',
      readTime: '8 min read',
      category: 'investing'
    },
    {
      id: '2',
      title: 'How to Build Credit from Scratch',
      excerpt: 'Steps to establish and build credit when you\'re just starting out.',
      readTime: '6 min read',
      category: 'credit'
    },
    {
      id: '3',
      title: 'Tackling Student Loan Debt',
      excerpt: 'Strategies for managing and paying down student loan debt efficiently.',
      readTime: '10 min read',
      category: 'debt'
    },
    {
      id: '4',
      title: 'Retirement Planning in Your 20s and 30s',
      excerpt: 'Why starting retirement planning early matters and how to begin.',
      readTime: '9 min read',
      category: 'retirement'
    },
    {
      id: '5',
      title: 'Smart Ways to Reduce Monthly Expenses',
      excerpt: 'Practical tips to lower your bills and increase your savings rate.',
      readTime: '7 min read',
      category: 'budgeting'
    },
    {
      id: '6',
      title: 'Understanding Tax-Advantaged Accounts',
      excerpt: 'A guide to 401(k)s, IRAs, HSAs, and other tax-advantaged savings options.',
      readTime: '12 min read',
      category: 'taxes'
    }
  ]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="tips">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tips">Financial Tips</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tips" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <Card key={tip.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                  <CardDescription>
                    {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{tip.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="articles" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)} · {article.readTime}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{article.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Read Article
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Financial Health Quiz</CardTitle>
          <CardDescription>
            Test your financial knowledge and get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Answer 10 questions about your current financial habits and knowledge to receive a personalized financial health score and tailored recommendations for improvement.
          </p>
          <Button>Start Quiz</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialResources;
