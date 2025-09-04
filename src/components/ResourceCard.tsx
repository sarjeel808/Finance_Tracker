import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  category: string;
  time: string;
  image: string;
}

const ResourceCard = ({ title, description, category, time, image }: ResourceCardProps) => {
  return (
    <Card className="overflow-hidden border-gray-200 bg-white hover:shadow-md transition-shadow">
      <div className="aspect-video relative">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        <Badge className="absolute top-2 left-2 bg-black text-white">{category}</Badge>
      </div>
      <CardHeader className="p-4">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 mt-2">{time}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-black text-white hover:bg-gray-800" 
          variant="default"
        >
          Read More <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;