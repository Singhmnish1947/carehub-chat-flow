
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, X, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Email } from "@/types/email";

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (email: Email) => void;
  replyToEmail: Email | null;
  isLoading?: boolean;
}

const emailSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  to: z.string().min(1, "Recipient is required").email("Invalid email format"),
  body: z.string().min(1, "Message is required"),
});

type EmailFormData = z.infer<typeof emailSchema>;

const ComposeDialog: React.FC<ComposeDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSend, 
  replyToEmail,
  isLoading = false
}) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    setValue,
    watch
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: "",
      to: "",
      body: ""
    }
  });

  useEffect(() => {
    if (replyToEmail) {
      setValue("to", replyToEmail.from.email);
      setValue("subject", `RE: ${replyToEmail.subject}`);
      setValue("body", `\n\n-------- Original Message --------\nFrom: ${replyToEmail.from.name}\nDate: ${new Date(replyToEmail.date).toLocaleString()}\nSubject: ${replyToEmail.subject}\n\n${replyToEmail.body}`);
    } else {
      reset();
    }
  }, [replyToEmail, setValue, reset]);

  const onSubmit = (data: EmailFormData) => {
    const emailAttachments = attachments.map(file => ({
      name: file.name,
      size: `${Math.round(file.size / 1024)}KB`,
      type: file.name.split('.').pop() || 'file'
    }));

    const newEmail: Email = {
      id: `temp-${Date.now()}`,
      subject: data.subject,
      from: {
        name: "John Doe", // Current user
        email: "john.doe@havenmed.com",
        avatar: "/placeholder.svg"
      },
      to: [{ name: data.to.split('@')[0], email: data.to }],
      body: data.body,
      date: new Date().toISOString(),
      read: true,
      folder: "sent",
      attachments: emailAttachments.length > 0 ? emailAttachments : undefined
    };
    
    onSend(newEmail);
    setAttachments([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments([...attachments, ...fileArray]);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{replyToEmail ? "Reply to Email" : "Compose New Email"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                placeholder="recipient@example.com"
                {...register("to")}
              />
              {errors.to && (
                <p className="text-sm text-red-500">{errors.to.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                placeholder="Write your message here..."
                rows={10}
                className="resize-none"
                {...register("body")}
              />
              {errors.body && (
                <p className="text-sm text-red-500">{errors.body.message}</p>
              )}
            </div>
            
            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-gray-100 rounded px-3 py-1"
                    >
                      <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeAttachment(index)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between">
            <div className="flex items-center">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                />
                <div className="flex items-center text-sm text-gray-600 hover:text-care-primary">
                  <Paperclip className="h-4 w-4 mr-1" />
                  Attach Files
                </div>
              </Label>
            </div>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-care-primary hover:bg-care-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Email"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeDialog;
