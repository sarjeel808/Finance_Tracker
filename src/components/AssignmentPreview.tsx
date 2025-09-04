
import React from 'react';
import { Assignment } from '@/types/assignment';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { Separator } from "@/components/ui/separator";

interface AssignmentPreviewProps {
  assignment: Assignment;
}

const AssignmentPreview: React.FC<AssignmentPreviewProps> = ({ assignment }) => {
  const formattedDate = assignment.dueDate ? 
    format(new Date(assignment.dueDate), 'MMMM d, yyyy') : 
    'No due date';
  
  const calculateTotalPoints = () => {
    let sectionPoints = 0;
    assignment.sections.forEach(section => {
      if (section.points) sectionPoints += section.points;
    });
    return sectionPoints;
  };

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">
              {assignment.title || 'Untitled Assignment'}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Due: {formattedDate}
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {assignment.totalPoints || calculateTotalPoints()} points
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {assignment.description && (
          <div className="mb-4">
            <p className="text-gray-700 whitespace-pre-line">{assignment.description}</p>
          </div>
        )}
        
        {assignment.sections.length > 0 && (
          <div className="space-y-4 mt-4">
            {assignment.sections.map((section, index) => (
              <div key={section.id}>
                {index > 0 && <Separator className="my-4" />}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">
                      {section.title || `Section ${index + 1}`}
                    </h3>
                    {section.points !== undefined && section.points > 0 && (
                      <span className="text-sm text-gray-500">
                        {section.points} points
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {assignment.sections.length === 0 && !assignment.description && (
          <div className="text-center p-6 text-gray-500 italic">
            Preview will appear here as you build your assignment.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentPreview;
