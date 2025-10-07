"use client";

import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEditor } from "@/contexts/editor-context";

interface SendEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendEmailDialog({ open, onOpenChange }: SendEmailDialogProps) {
  const { blocks } = useEditor();
  const [to, setTo] = useState("hello@mattwood.co");
  const [subject, setSubject] = useState("Test Email from Email Builder");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSend = async () => {
    if (!to || !subject) {
      setStatus({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    if (blocks.length === 0) {
      setStatus({
        type: "error",
        message: "Cannot send an empty email",
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject,
          blocks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setStatus({
        type: "success",
        message: `Email sent successfully! ID: ${data.id}`,
      });

      // Close dialog after 2 seconds on success
      setTimeout(() => {
        onOpenChange(false);
        setStatus({ type: null, message: "" });
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to send email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      setStatus({ type: null, message: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
          <DialogDescription>
            Send a test email with your current design
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="to" className="text-sm font-medium">
              To
            </label>
            <Input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              type="text"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <div>Blocks to send: {blocks.length}</div>
            <div className="text-xs mt-1">From: mail.mattwood.co</div>
          </div>

          {status.type && (
            <div
              className={`text-sm p-3 rounded-md ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {status.message}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isLoading || blocks.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="size-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
