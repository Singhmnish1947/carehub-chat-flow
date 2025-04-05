
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Email } from "@/types/email";
import { 
  Reply, 
  Star, 
  Trash2, 
  Archive, 
  ArrowLeft,
  Paperclip,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailViewProps {
  email: Email;
  onReply: (email: Email) => void;
  onDelete: () => void;
  onArchive: () => void;
  onStar: () => void;
  onBack: () => void;
}

const EmailView: React.FC<EmailViewProps> = ({ 
  email, 
  onReply, 
  onDelete, 
  onArchive, 
  onStar,
  onBack
}) => {
  return (
    <div className="h-full flex flex-col overflow-auto">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        
        <div className="flex space-x-2 ml-auto">
          <Button variant="ghost" size="icon" onClick={onStar}>
            <Star 
              className={cn(
                "h-4 w-4",
                email.starred ? "fill-amber-400 text-amber-400" : "text-gray-500"
              )} 
            />
            <span className="sr-only">Star</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onArchive}>
            <Archive className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Archive</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold mb-6">{email.subject}</h1>
          
          <div className="flex items-start mb-6">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src={email.from.avatar} alt={email.from.name} />
              <AvatarFallback className="bg-care-primary text-white">
                {email.from.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-baseline">
                <h3 className="font-medium">{email.from.name}</h3>
                <span className="text-sm text-gray-500">
                  {format(new Date(email.date), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                To: {email.to.map(recipient => recipient.name).join(", ")}
              </p>
            </div>
          </div>
          
          <div className="prose prose-blue max-w-none mb-6 whitespace-pre-wrap">
            {email.body}
          </div>
          
          {email.attachments && email.attachments.length > 0 && (
            <div className="border-t pt-4 mt-6">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Paperclip className="h-4 w-4 mr-2" />
                Attachments ({email.attachments.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {email.attachments.map((attachment, i) => (
                  <div key={i} className="flex items-center p-3 bg-gray-50 rounded border">
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">.{attachment.type}</span>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{attachment.size}</p>
                    </div>
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Replies */}
          {email.replies && email.replies.length > 0 && (
            <div className="border-t mt-8 pt-8">
              <h3 className="text-sm font-medium mb-4">Previous Messages ({email.replies.length})</h3>
              <div className="space-y-6">
                {email.replies.map((reply, i) => (
                  <div key={i} className="border-l-4 border-gray-200 pl-4">
                    <div className="flex items-start mb-2">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={reply.from.avatar} alt={reply.from.name} />
                        <AvatarFallback className="bg-care-primary text-white text-xs">
                          {reply.from.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-baseline">
                          <h4 className="font-medium text-sm">{reply.from.name}</h4>
                          <span className="text-xs text-gray-500">
                            {format(new Date(reply.date), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          To: {reply.to.map(recipient => recipient.name).join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none mt-2 text-gray-700 whitespace-pre-wrap">
                      {reply.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-white p-4 border-t">
        <div className="max-w-3xl mx-auto">
          <Button 
            onClick={() => onReply(email)}
            className="bg-care-primary hover:bg-care-dark"
          >
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailView;
