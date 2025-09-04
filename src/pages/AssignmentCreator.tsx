
import React, { useState } from 'react';
import { Assignment, AssignmentSection } from '@/types/assignment';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { CalendarIcon, Plus, Eye, Save, Trash, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssignmentPreviewModal } from '@/components/AssignmentPreviewModal';
import { SectionEditor } from '@/components/SectionEditor';

const AssignmentCreator: React.FC = () => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [assignment, setAssignment] = useState<Assignment>({
    title: '',
    description: '',
    dueDate: '',
    totalPoints: 0,
    sections: []
  });
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssignment(prev => ({
      ...prev,
      [name]: name === 'totalPoints' ? Number(value) : value
    }));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setAssignment(prev => ({
        ...prev,
        dueDate: selectedDate.toISOString().split('T')[0]
      }));
    }
  };

  const handleSectionUpdate = (sections: AssignmentSection[]) => {
    setAssignment(prev => ({ ...prev, sections }));
  };

  const calculateTotalPoints = () => {
    return assignment.sections.reduce((sum, section) => sum + (section.points || 0), 0);
  };

  const handleSaveAssignment = () => {
    // In a real app, this would save to a database
    toast({
      title: "Assignment Saved",
      description: `Assignment "${assignment.title}" has been saved successfully.`,
    });
  };

  const handleCopyToClipboard = () => {
    // Format assignment text
    let assignmentText = `${assignment.title}\n`;
    assignmentText += `Due: ${assignment.dueDate ? format(new Date(assignment.dueDate), 'PP') : 'No due date'}\n`;
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
        title: "Copied to Clipboard",
        description: "The assignment has been copied to your clipboard.",
      });
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Assignment Creator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl font-medium">Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1">
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={assignment.title}
                  onChange={handleInputChange}
                  placeholder="Enter assignment title"
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={assignment.description}
                  onChange={handleInputChange}
                  placeholder="Enter assignment description, instructions, or overview"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "PPP") : <span>Select due date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="totalPoints">Total Points</Label>
                  <Input
                    id="totalPoints"
                    name="totalPoints"
                    type="number"
                    value={assignment.totalPoints || calculateTotalPoints()}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sections</h2>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                const newSection: AssignmentSection = {
                  id: `section-${Date.now()}`,
                  title: '',
                  content: '',
                  points: 0
                };
                handleSectionUpdate([...assignment.sections, newSection]);
              }}>
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </div>
            
            <SectionEditor 
              sections={assignment.sections}
              onSectionUpdate={handleSectionUpdate}
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-6">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-xl font-medium">Assignment Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button 
                  variant="default" 
                  className="w-full flex items-center gap-2" 
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-4 w-4" />
                  Preview Assignment
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={handleCopyToClipboard}
                >
                  <Pencil className="h-4 w-4" />
                  Copy to Clipboard
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full flex items-center gap-2"
                  onClick={handleSaveAssignment}
                >
                  <Save className="h-4 w-4" />
                  Save Assignment
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t">
              <div className="text-sm text-muted-foreground">
                <p>Created: {format(new Date(), 'PP')}</p>
                <p>Last modified: {format(new Date(), 'PP')}</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <AssignmentPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        assignment={assignment}
      />
    </div>
  );
};

export default AssignmentCreator;
