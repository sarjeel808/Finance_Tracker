import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, FileText, Video, PenTool } from "lucide-react";
import { useState } from "react";

interface ResourceCardProps {
  title: string;
  description: string;
  category: string;
  time: string;
  image: string;
  url: string;
  type?: 'article' | 'video' | 'tool';
}

const ResourceCard = ({ title, description, category, time, image, url, type = 'article' }: ResourceCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getButtonText = () => {
    switch (type) {
      case 'video':
        return 'Watch Video';
      case 'tool':
        return 'Use Tool';
      default:
        return 'Read Article';
    }
  };

  const getPlaceholderIcon = () => {
    switch (type) {
      case 'video':
        return <Video className="w-16 h-16 text-gray-400" />;
      case 'tool':
        return <PenTool className="w-16 h-16 text-gray-400" />;
      default:
        return <FileText className="w-16 h-16 text-gray-400" />;
    }
  };

  return (
    <Card 
      className="overflow-hidden border-gray-200 bg-white hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="aspect-video relative overflow-hidden">
        {!imageError ? (
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
            {getPlaceholderIcon()}
          </div>
        )}
        <Badge className="absolute top-2 left-2 bg-black text-white">{category}</Badge>
      </div>
      <CardHeader className="p-4">
        <h3 className="text-lg font-semibold text-black group-hover:text-gray-700 transition-colors">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500 mt-2">{time}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-black text-white hover:bg-gray-800 group-hover:bg-gray-700" 
          variant="default"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {getButtonText()} <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;