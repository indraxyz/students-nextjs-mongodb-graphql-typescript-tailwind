import StudentManagement from "./features/students/components/StudentManagement";

export default function StudyGraphQLPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
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
