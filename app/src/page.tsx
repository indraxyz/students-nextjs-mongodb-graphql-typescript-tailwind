import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StudentManagement from "./features/students/components/StudentManagement";

export default function StudyGraphQLPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student Management with GraphQL
        </h1>
        <p className="text-gray-600">
          Manage students with Next.js, GraphQL and MongoDB with ease and
          efficiency using the latest technology.
        </p>
      </div>
      <StudentManagement />
    </div>
  );
}
