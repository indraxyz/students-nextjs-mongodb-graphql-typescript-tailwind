"use client";

import type { FormEvent } from "react";
import { StudentFormData, StudentFormErrors } from "../../types/student";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Upload,
  X,
  User,
  Mail,
  Calendar,
  MapPin,
  Camera,
  ImagePlus,
  Loader2,
  UserPlus,
  UserPen,
} from "lucide-react";

export interface StudentFormModalProps {
  isEditing: boolean;
  formData: StudentFormData;
  errors: StudentFormErrors;
  isSubmitting: boolean;
  onInputChange: (field: keyof StudentFormData, value: string | number) => void;
  onPhotoChange?: (file: File | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  formError: string | null;
  photoPreview?: string | null;
}

function FormField({
  label,
  required,
  error,
  children,
  htmlFor,
  icon: Icon,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  htmlFor: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={htmlFor}
        className={cn(
          "flex items-center gap-2 text-sm font-medium",
          error && "text-destructive"
        )}
      >
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive animate-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export function StudentFormModal({
  isEditing,
  formData,
  errors,
  isSubmitting,
  onInputChange,
  onPhotoChange,
  onSubmit,
  onClose,
  formError,
  photoPreview,
}: StudentFormModalProps) {
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg overflow-hidden p-0">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  isEditing
                    ? "bg-primary/20 text-primary"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {isEditing ? (
                  <UserPen className="h-5 w-5" />
                ) : (
                  <UserPlus className="h-5 w-5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {isEditing ? "Edit Student" : "Add New Student"}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {isEditing
                    ? "Update the student information below"
                    : "Fill in the details to add a new student"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Error Banner */}
        {formError && (
          <div className="mx-6 mt-4 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="flex-1">{formError}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-destructive/20"
              onClick={() => {}}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <form onSubmit={onSubmit} className="px-6 py-4 space-y-5">
          {/* Photo Upload Section */}
          <div className="flex items-start gap-4">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg ring-2 ring-border">
                <AvatarImage src={photoPreview || undefined} alt="Preview" />
                <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                  {formData.name ? (
                    getInitials(formData.name)
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </AvatarFallback>
              </Avatar>
              {photoPreview && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -right-1 -top-1 h-6 w-6 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onPhotoChange?.(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Camera className="h-4 w-4 text-muted-foreground" />
                Profile Photo
              </Label>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="photo"
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg",
                    "border-2 border-dashed border-muted-foreground/25",
                    "px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    "hover:border-primary/50 hover:bg-primary/5",
                    "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
                  )}
                >
                  <ImagePlus className="h-4 w-4 text-primary" />
                  {photoPreview ? "Change Photo" : "Upload Photo"}
                </Label>
                <input
                  id="photo"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onPhotoChange?.(file);
                  }}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, JPEG, or PNG. Max 1MB.
              </p>
              {errors.photo && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.photo}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Full Name"
              required
              error={errors.name}
              htmlFor="name"
              icon={User}
            >
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                placeholder="John Doe"
                aria-invalid={!!errors.name}
                className={cn(
                  "h-10 transition-all duration-200",
                  errors.name && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
            </FormField>

            <FormField
              label="Age"
              required
              error={errors.age}
              htmlFor="age"
              icon={Calendar}
            >
              <Input
                id="age"
                type="number"
                min={1}
                max={120}
                value={formData.age}
                onChange={(e) => onInputChange("age", e.target.value)}
                placeholder="18"
                aria-invalid={!!errors.age}
                className={cn(
                  "h-10 transition-all duration-200",
                  errors.age && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
            </FormField>
          </div>

          <FormField
            label="Email Address"
            required
            error={errors.email}
            htmlFor="email"
            icon={Mail}
          >
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              placeholder="john.doe@example.com"
              aria-invalid={!!errors.email}
              className={cn(
                "h-10 transition-all duration-200",
                errors.email && "border-destructive focus-visible:ring-destructive/30"
              )}
            />
          </FormField>

          <FormField
            label="Address"
            required
            error={errors.address}
            htmlFor="address"
            icon={MapPin}
          >
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => onInputChange("address", e.target.value)}
              placeholder="123 Main Street, City, Country"
              rows={3}
              className={cn(
                "resize-none transition-all duration-200",
                errors.address && "border-destructive focus-visible:ring-destructive/30"
              )}
              aria-invalid={!!errors.address}
            />
          </FormField>

          <Separator />

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <UserPen className="h-4 w-4" />
                  Update Student
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Add Student
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
