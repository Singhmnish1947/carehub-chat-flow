
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Email } from "@/types/email";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Star, Trash2, Archive, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailListProps {
  emails: Email[];
  selectedEmailId?: string;
  onSelectEmail: (email: Email) => void;
  onDeleteEmail: (id: string) => void;
  onArchiveEmail: (id: string) => void;
  onStarEmail: (id: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({ 
  emails, 
  selectedEmailId, 
  onSelectEmail,
  onDeleteEmail,
  onArchiveEmail,
  onStarEmail
}) => {
  if (emails.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No emails found
      </div>
    );
  }

  return (
    <div className="overflow-auto h-[calc(100vh-12rem)]">
      {emails.map((email) => {
        const isSelected = email.id === selectedEmailId;
        
        return (
          <div
            key={email.id}
            className={cn(
              "border-b p-4 cursor-pointer hover:bg-gray-50",
              isSelected && "bg-gray-100 hover:bg-gray-100",
              !email.read && "bg-gray-50"
            )}
            onClick={() => onSelectEmail(email)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1 min-w-0">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onStarEmail(email.id);
                  }}
                  className="mr-3 mt-1"
                >
                  <Star 
                    className={cn(
                      "h-4 w-4",
                      email.starred ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    )} 
                  />
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={cn(
                      "font-medium truncate text-gray-900",
                      !email.read && "font-semibold"
                    )}>
                      {email.from.name}
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <h3 className={cn(
                    "text-sm truncate mb-1 text-gray-800",
                    !email.read && "font-medium"
                  )}>
                    {email.subject}
                  </h3>
                  
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {email.body}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                    <span className="sr-only">More options</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onArchiveEmail(email.id);
                  }}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEmail(email.id);
                  }} className="text-red-600 focus:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmailList;
