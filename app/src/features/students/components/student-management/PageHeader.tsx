import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Plus, GraduationCap } from "lucide-react";

export interface PageHeaderProps {
  onCreate: () => void;
  disabled?: boolean;
}

export function PageHeader({ onCreate, disabled }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          Student Management
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button onClick={onCreate} disabled={disabled}>
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>
    </div>
  );
}
