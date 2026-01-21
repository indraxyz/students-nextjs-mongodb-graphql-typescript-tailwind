import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StudentManagement from "./features/students/components/StudentManagement";
import { Button } from "@/components/ui/button";

export default function StudyGraphQLPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 -ml-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Student Management with GraphQL
        </h1>
        <p className="text-muted-foreground">
          Manage students with Next.js, GraphQL and MongoDB with ease and
          efficiency using the latest technology.
        </p>
      </div>
      <StudentManagement />
    </div>
  );
}
