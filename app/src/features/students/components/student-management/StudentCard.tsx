"use client";

import { Student } from "../../types/student";
import { formatDateTime } from "@/app/src/shared/utils";
import {
  Mail,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  User,
  MoreVertical,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface StudentCardProps {
  student: Student;
  onEdit?: (student: Student) => void;
  onDeleteRequest?: (id: string, name?: string | null) => void;
  disabled?: boolean;
  showActions?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  showCheckbox?: boolean;
}

export function StudentCard({
  student,
  onEdit,
  onDeleteRequest,
  disabled = false,
  showActions = true,
  isSelected = false,
  onSelect,
  showCheckbox = false,
}: StudentCardProps) {
  const handleSelect = () => {
    if (onSelect && !disabled) {
      onSelect(student.id, !isSelected);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      onClick={showCheckbox ? handleSelect : undefined}
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
        "border-border/50 hover:border-primary/20",
        isSelected && "ring-2 ring-primary border-primary/30 bg-primary/5",
        showCheckbox && "cursor-pointer",
        disabled && "opacity-60 pointer-events-none"
      )}
    >
      {/* Selection Checkbox */}
      {showCheckbox && (
        <div
          className={cn(
            "absolute left-3 top-3 z-20 transition-all duration-300",
            isSelected
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
          )}
        >
          <div
            className={cn(
              "rounded-lg p-1.5 shadow-lg transition-all duration-200",
              isSelected
                ? "bg-primary text-primary-foreground shadow-primary/25"
                : "bg-background/95 backdrop-blur-sm hover:bg-background"
            )}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => {
                if (onSelect && !disabled) {
                  onSelect(student.id, checked as boolean);
                }
              }}
              disabled={disabled}
              onClick={(e) => e.stopPropagation()}
              aria-label={isSelected ? "Deselect student" : "Select student"}
              className={cn(
                "h-5 w-5 transition-all duration-200",
                isSelected
                  ? "border-primary-foreground data-[state=checked]:bg-transparent data-[state=checked]:text-primary-foreground"
                  : "border-muted-foreground/50 hover:border-primary"
              )}
            />
          </div>
        </div>
      )}

      {/* Actions Dropdown */}
      {showActions && onEdit && onDeleteRequest && (
        <div className="absolute right-3 top-3 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full shadow-md transition-all duration-200",
                  "bg-background/90 backdrop-blur-sm hover:bg-background",
                  "opacity-0 group-hover:opacity-100"
                )}
                disabled={disabled}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(student);
                }}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRequest(student.id, student.name);
                }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Photo Section with Gradient Overlay */}
      <div className="relative h-44 w-full overflow-hidden">
        {student.photo ? (
          <>
            <img
              src={student.photo}
              alt={student.name || "Student photo"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/30">
            <div className="rounded-full bg-muted-foreground/10 p-6">
              <User className="h-12 w-12 text-muted-foreground/40" />
            </div>
          </div>
        )}

        {/* Age Badge */}
        <Badge
          className={cn(
            "absolute left-3 bottom-3 shadow-lg",
            "bg-primary/90 hover:bg-primary text-primary-foreground",
            "backdrop-blur-sm border-0"
          )}
        >
          {student.age || 0} years old
        </Badge>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Name and Avatar */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-md ring-2 ring-background">
            <AvatarImage
              src={student.photo || undefined}
              alt={student.name || "Student"}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-base font-semibold text-foreground line-clamp-1 leading-tight">
              {student.name || "Unknown Student"}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
              <span className="truncate">{student.email || "-"}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        {student.address && (
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-2.5">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary/60" />
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {student.address}
            </p>
          </div>
        )}

        <Separator className="bg-border/50" />

        {/* Timestamps */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated {formatDateTime(student.updatedAt)}</span>
          </div>
        </div>

        {/* Action Buttons - Alternative Style */}
        {showActions && onEdit && onDeleteRequest && (
          <div className="flex gap-2 pt-1">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(student);
              }}
              disabled={disabled}
              variant="default"
              className="flex-1 h-9"
              size="sm"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(student.id, student.name);
              }}
              disabled={disabled}
              variant="outline"
              className="flex-1 h-9 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              size="sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
