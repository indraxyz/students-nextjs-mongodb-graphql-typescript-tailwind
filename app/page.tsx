"use client";

import Link from "next/link";
import { useStudentManagement } from "./src/features/students/hooks/useStudentManagement";
import { StudentCard } from "./src/features/students/components/student-management/StudentCard";

function StatsCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function HomePageContent() {
  const { students, isLoading: loading, error } = useStudentManagement();

  // Statistik dari data real
  const totalStudents = students.length;
  const averageAge =
    students.length > 0
      ? Math.round(
          students.reduce((sum, student) => sum + student.age, 0) /
            students.length
        )
      : 0;

  // Siswa terbaru (3 terakhir berdasarkan createdAt)
  const recentStudents = [...students]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5"></div>
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">
              Students
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                GraphQL
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Manage Students data with Next.js, GraphQL and MongoDB with ease
              and efficiency using the latest technology.
            </p>
            <Link
              href="/src"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Managing Students
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Real-time Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real-time Statistics
            </h2>
            <p className="text-lg text-gray-600">
              Data displayed directly from MongoDB using GraphQL
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <svg
                  className="w-12 h-12 text-red-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <p className="text-red-700 font-medium">Failed to load data</p>
                <p className="text-red-600 text-sm mt-2">
                  Make sure the GraphQL server is running
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="relative -mx-4 md:mx-0">
                <div className="flex md:grid md:grid-cols-3 gap-6 mb-12 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible py-4 pb-6 md:pb-4 scroll-smooth px-4 md:px-0">
                  <div className="min-w-[50vw] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink relative z-10">
                    <StatsCard
                      title="Total Students"
                      value={totalStudents}
                      color="bg-gradient-to-r from-blue-500 to-blue-600"
                      icon={
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                      }
                    />
                  </div>
                  <div className="min-w-[50vw] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink relative z-10">
                    <StatsCard
                      title="Average Age"
                      value={averageAge > 0 ? `${averageAge}` : "0"}
                      color="bg-gradient-to-r from-green-500 to-green-600"
                      icon={
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      }
                    />
                  </div>
                  <div className="min-w-[50vw] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink relative z-10">
                    <StatsCard
                      title="Active Students"
                      value={totalStudents}
                      color="bg-gradient-to-r from-purple-500 to-purple-600"
                      icon={
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Recent Students Preview */}
              {recentStudents.length > 0 && (
                <div className="relative">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      New Students
                    </h3>
                    <p className="text-gray-600">
                      {recentStudents.length} students who have joined recently
                    </p>
                  </div>
                  <div className="relative -mx-4 md:mx-0">
                    <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible py-4 pb-6 md:pb-4 scroll-smooth px-4 md:px-0">
                      {recentStudents.map((student) => (
                        <div
                          key={student.id}
                          className="min-w-[65vw] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink relative z-10"
                        >
                          <StudentCard student={student} showActions={false} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This application is equipped with various advanced features to
              manage student data
            </p>
          </div>

          <div className="relative -mx-4 md:mx-0">
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible py-4 pb-6 md:pb-4 scroll-smooth px-4 md:px-0">
              {/* Feature 1 */}
              <div className="max-w-[70vw]  snap-start flex-shrink-0 md:flex-shrink bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Real-time Search
                </h3>
                <p className="text-gray-600">
                  Search students by name, email, or class with results
                  appearing instantly using GraphQL.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="max-w-[70vw] snap-start flex-shrink-0 md:flex-shrink bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  CRUD Operations
                </h3>
                <p className="text-gray-600">
                  Add, edit, delete, and view student details with an intuitive
                  and responsive interface.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="max-w-[70vw]  snap-start flex-shrink-0 md:flex-shrink bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Async Data Fetching
                </h3>
                <p className="text-gray-600">
                  Efficient data fetching with a smooth and user-friendly
                  asynchronous.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="max-w-[70vw] snap-start flex-shrink-0 md:flex-shrink bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Form Validation
                </h3>
                <p className="text-gray-600">
                  Comprehensive form validation to ensure that the data entered
                  is always valid and consistent.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="max-w-[70vw] snap-start flex-shrink-0 md:flex-shrink bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  High Performance
                </h3>
                <p className="text-gray-600">
                  Optimized queries with GraphQL and caching for extremely fast
                  application performance.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="max-w-[70vw] snap-start flex-shrink-0 md:flex-shrink bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Responsive Design
                </h3>
                <p className="text-gray-600">
                  Responsive and mobile-friendly interface, can be accessed
                  perfectly on all devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technologies Used
            </h2>
            <p className="text-lg text-gray-600">
              Built with modern and reliable technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">Next</span>
              </div>
              <h3 className="font-semibold text-gray-900">Next.js</h3>
              <p className="text-sm text-gray-600">React Framework</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h3 className="font-semibold text-gray-900">MongoDB</h3>
              <p className="text-sm text-gray-600">NoSQL Database</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">GQL</span>
              </div>
              <h3 className="font-semibold text-gray-900">GraphQL</h3>
              <p className="text-sm text-gray-600">Query Language</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">TS</span>
              </div>
              <h3 className="font-semibold text-gray-900">TypeScript</h3>
              <p className="text-sm text-gray-600">Type Safety</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Try?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Explore and experience all student management features.
          </p>
          <Link
            href="/src"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Start Now
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Students Data with GraphQL. Built with ❤️ using Next.js,
            MongoDB and GraphQL.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return <HomePageContent />;
}
