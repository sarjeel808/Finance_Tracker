
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AssignmentSection } from '@/types/assignment';
import { Pencil, Trash } from 'lucide-react';

interface SectionBuilderProps {
  sections: AssignmentSection[];
  onSectionUpdate: (sections: AssignmentSection[]) => void;
}

const SectionBuilder: React.FC<SectionBuilderProps> = ({ sections, onSectionUpdate }) => {
  const addNewSection = () => {
    const newSection: AssignmentSection = {
      id: `section-${Date.now()}`,
      title: '',
      content: '',
      points: 0
    };
    onSectionUpdate([...sections, newSection]);
  };

  const updateSection = (id: string, field: keyof AssignmentSection, value: string | number) => {
    const updatedSections = sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    );
    onSectionUpdate(updatedSections);
  };

  const deleteSection = (id: string) => {
    const updatedSections = sections.filter(section => section.id !== id);
    onSectionUpdate(updatedSections);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Assignment Sections</h3>
        <Button 
          onClick={addNewSection} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Add Section
        </Button>
      </div>
      
      {sections.length === 0 && (
        <div className="text-center p-6 border-2 border-dashed rounded-md bg-gray-50">
          <p className="text-gray-500">No sections yet. Add a section to get started.</p>
        </div>
      )}
      
      {sections.map((section, index) => (
        <Card key={section.id} className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Section {index + 1}</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => deleteSection(section.id)}
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor={`title-${section.id}`}>Title</Label>
              <Input
                id={`title-${section.id}`}
                value={section.title}
                onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                placeholder="Section title"
              />
            </div>
            
            <div>
              <Label htmlFor={`content-${section.id}`}>Content</Label>
              <Textarea
                id={`content-${section.id}`}
                value={section.content}
                onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                placeholder="Section instructions, questions, or content"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor={`points-${section.id}`}>Points (optional)</Label>
              <Input
                id={`points-${section.id}`}
                type="number"
                min="0"
                value={section.points}
                onChange={(e) => updateSection(section.id, 'points', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SectionBuilder;
