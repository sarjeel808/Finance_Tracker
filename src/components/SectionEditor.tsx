
import React from 'react';
import { AssignmentSection } from '@/types/assignment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SectionEditorProps {
  sections: AssignmentSection[];
  onSectionUpdate: (sections: AssignmentSection[]) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ 
  sections, 
  onSectionUpdate 
}) => {
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
      {sections.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No sections yet. Add a section to get started.</p>
          </CardContent>
        </Card>
      ) : (
        sections.map((section, index) => (
          <Card key={section.id} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-700">
                    {index + 1}
                  </div>
                  <Badge variant="outline">{section.points || 0} points</Badge>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => deleteSection(section.id)}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete section</span>
                </Button>
              </div>
              
              <div className="grid gap-4">
                <div className="space-y-1">
                  <Label htmlFor={`title-${section.id}`}>Section Title</Label>
                  <Input
                    id={`title-${section.id}`}
                    value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    placeholder={`Section ${index + 1}`}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`content-${section.id}`}>Content</Label>
                  <Textarea
                    id={`content-${section.id}`}
                    value={section.content}
                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                    placeholder="Instructions, questions, or assignment content"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`points-${section.id}`}>Points</Label>
                  <Input
                    id={`points-${section.id}`}
                    type="number"
                    min="0"
                    value={section.points}
                    onChange={(e) => updateSection(section.id, 'points', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="max-w-[150px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
