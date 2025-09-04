
import React from 'react';
import { Assignment } from '@/types/assignment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Separator } from "@/components/ui/separator";
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock } from 'lucide-react';

interface AssignmentPreviewModalProps {
  assignment: Assignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssignmentPreviewModal: React.FC<AssignmentPreviewModalProps> = ({
  assignment,
  open,
  onOpenChange
}) => {
  const calculateTotalPoints = () => {
    return assignment.sections.reduce((sum, section) => sum + (section.points || 0), 0);
  };

  const getFormattedDate = () => {
    try {
      return assignment.dueDate ? format(new Date(assignment.dueDate), 'MMMM d, yyyy') : 'No due date';
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Assignment Preview</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{assignment.title || 'Untitled Assignment'}</h2>
            
            <div className="flex flex-wrap gap-4 items-center mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Due: {getFormattedDate()}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Total: {assignment.totalPoints || calculateTotalPoints()} points</span>
              </div>
            </div>
          </div>
          
          {assignment.description && (
            <div className="mb-6">
              <p className="whitespace-pre-line">{assignment.description}</p>
            </div>
          )}
          
          {assignment.sections.length > 0 ? (
            <div className="space-y-6">
              {assignment.sections.map((section, index) => (
                <div key={section.id} className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">
                      {section.title || `Section ${index + 1}`}
                    </h3>
                    {section.points > 0 && (
                      <Badge variant="outline" className="ml-2">
                        {section.points} points
                      </Badge>
                    )}
                  </div>
                  <Separator className="my-2" />
                  <p className="whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-muted-foreground italic">
              No sections added yet.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close Preview</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
