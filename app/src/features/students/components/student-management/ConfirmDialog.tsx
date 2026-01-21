"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Loader2, Trash2, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  studentName?: string;
  count?: number;
  isBulk?: boolean;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  studentName,
  count,
  isBulk = false,
  isProcessing,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="sm:max-w-md overflow-hidden p-0">
        {/* Warning Header */}
        <div className="bg-destructive/10 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <AlertDialogHeader className="space-y-1 text-left">
              <AlertDialogTitle className="text-lg text-destructive">
                {isBulk
                  ? `Delete ${count} Student${count !== 1 ? "s" : ""}?`
                  : "Delete Student?"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Content */}
          <div className="rounded-lg border bg-muted/30 p-4">
            {isBulk ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {count} student{count !== 1 ? "s" : ""} selected
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All selected records will be permanently removed
                  </p>
                </div>
                <Badge variant="destructive" className="ml-auto">
                  Bulk Delete
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {studentName || "Unknown Student"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This record will be permanently removed
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Warning Message */}
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500 mt-0.5" />
            <p>
              {isBulk
                ? `You are about to delete ${count} student record${count !== 1 ? "s" : ""}. This will remove all associated data including photos and cannot be recovered.`
                : `You are about to delete the student record for "${studentName}". This will remove all associated data including photos and cannot be recovered.`}
            </p>
          </div>
        </div>

        <Separator />

        <AlertDialogFooter className="px-6 py-4 gap-2 sm:gap-2">
          <AlertDialogCancel
            disabled={isProcessing}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isProcessing}
            className={cn(
              "flex-1 sm:flex-none min-w-[140px]",
              "bg-destructive text-destructive-foreground",
              "hover:bg-destructive/90",
              "focus-visible:ring-destructive/30"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                {isBulk ? `Delete ${count} Student${count !== 1 ? "s" : ""}` : "Delete Student"}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
