
export interface AssignmentSection {
  id: string;
  title: string;
  content: string;
  points?: number;
}

export interface Assignment {
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  sections: AssignmentSection[];
}
