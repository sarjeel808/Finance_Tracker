
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionBuilder from './SectionBuilder';
import AssignmentPreview from './AssignmentPreview';
import { Assignment, AssignmentSection } from '@/types/assignment';
import { useToast } from "@/components/ui/use-toast";
import { ClipboardCopy, FileCheck, FileText } from 'lucide-react';

const AssignmentForm: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('edit');
  const [assignment, setAssignment] = useState<Assignment>({
    title: '',
    description: '',
    dueDate: '',
    totalPoints: 0,
    sections: []
  });

  const updateAssignment = (field: keyof Assignment, value: any) => {
    setAssignment(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionUpdate = (sections: AssignmentSection[]) => {
    setAssignment(prev => ({ ...prev, sections }));
  };

  const calculateTotalPoints = () => {
    return assignment.sections.reduce((sum, section) => sum + (section.points || 0), 0);
  };

  const handleSaveAssignment = () => {
    // In a real app, this would save to a database or file
    // For now, we'll just show a toast message
    toast({
      title: "Assignment Saved",
      description: `"${assignment.title}" has been saved successfully.`,
    });
  };

  const handleCopyToClipboard = () => {
    // Create a formatted text version of the assignment
    const formattedDate = assignment.dueDate ? 
      new Date(assignment.dueDate).toLocaleDateString() : 
      'No due date';
    
    let assignmentText = `${assignment.title}\n`;
    assignmentText += `Due: ${formattedDate}\n`;
    assignmentText += `Points: ${assignment.totalPoints || calculateTotalPoints()}\n\n`;
    
    if (assignment.description) {
      assignmentText += `${assignment.description}\n\n`;
    }
    
    assignment.sections.forEach((section, index) => {
      assignmentText += `--- ${section.title || `Section ${index + 1}`} `;
      if (section.points) assignmentText += `(${section.points} points)`;
      assignmentText += ` ---\n${section.content}\n\n`;
    });
    
    navigator.clipboard.writeText(assignmentText).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Assignment has been copied to your clipboard.",
      });
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCopyToClipboard} 
              className="flex items-center gap-2"
            >
              <ClipboardCopy className="h-4 w-4" />
              Copy
            </Button>
            <Button onClick={handleSaveAssignment}>Save Assignment</Button>
          </div>
        </div>
        
        <TabsContent value="edit">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    value={assignment.title}
                    onChange={(e) => updateAssignment('title', e.target.value)}
                    placeholder="Assignment title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={assignment.description}
                    onChange={(e) => updateAssignment('description', e.target.value)}
                    placeholder="Assignment overview and general instructions"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input 
                      id="dueDate"
                      type="date"
                      value={assignment.dueDate}
                      onChange={(e) => updateAssignment('dueDate', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="totalPoints">Total Points</Label>
                    <Input 
                      id="totalPoints"
                      type="number"
                      min="0"
                      value={assignment.totalPoints || calculateTotalPoints()}
                      onChange={(e) => updateAssignment('totalPoints', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <SectionBuilder sections={assignment.sections} onSectionUpdate={handleSectionUpdate} />
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <AssignmentPreview assignment={assignment} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssignmentForm;
