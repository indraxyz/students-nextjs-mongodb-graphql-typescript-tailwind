"use client";

import Link from "next/link";
import { useStudentManagement } from "./src/features/students/hooks/useStudentManagement";
import { StudentCard } from "./src/features/students/components/student-management/StudentCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Users,
  BarChart3,
  UserCheck,
  Search,
  Settings2,
  Zap,
  CheckCircle2,
  Smartphone,
  ArrowRight,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HomePageContent() {
  const { students, isLoading: loading, error } = useStudentManagement();

  const totalStudents = students.length;
  const averageAge =
    students.length > 0
      ? Math.round(
          students.reduce((sum, student) => sum + student.age, 0) /
            students.length
        )
      : 0;

  const recentStudents = [...students]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10" />
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-6">
              Students
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Manage Students data with Next.js, GraphQL and MongoDB with ease
              and efficiency using the latest technology.
            </p>
            <Button size="lg" asChild>
              <Link href="/src" className="gap-2">
                Start Managing Students
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Real-time Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Statistics
            </h2>
            <p className="text-lg text-muted-foreground">
              Data displayed directly from MongoDB using GraphQL
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 text-primary">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              {(() => {
                const errorMessage = error?.message || "";
                const isMongoError =
                  errorMessage.includes("Cannot connect to MongoDB") ||
                  errorMessage.includes("MongoDB Atlas") ||
                  errorMessage.includes("MONGODB_CONNECTION_ERROR");

                return (
                  <Card
                    className={`max-w-md mx-auto ${
                      isMongoError
                        ? "border-yellow-500/50 bg-yellow-500/10"
                        : "border-destructive/50 bg-destructive/10"
                    }`}
                  >
                    <CardContent className="p-6">
                      {isMongoError ? (
                        <Clock className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                      )}
                      <p
                        className={`font-medium ${
                          isMongoError
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-destructive"
                        }`}
                      >
                        {isMongoError
                          ? "Cannot Connect to MongoDB"
                          : "Failed to load data"}
                      </p>
                      <p
                        className={`text-sm mt-2 ${
                          isMongoError
                            ? "text-yellow-600/80 dark:text-yellow-400/80"
                            : "text-destructive/80"
                        }`}
                      >
                        {isMongoError
                          ? "If you're using MongoDB Atlas M0 (free tier), the cluster may be paused after 30 days of inactivity. Please wait 10-30 seconds for it to wake up, then refresh the page."
                          : "Make sure the GraphQL server is running"}
                      </p>
                      {isMongoError && (
                        <div className="mt-4 rounded-lg bg-yellow-500/20 border border-yellow-500/30 p-3 text-left">
                          <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                            MongoDB Atlas M0 clusters pause after 30 days of
                            inactivity
                          </p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            The system is automatically waiting for the cluster
                            to wake up. This usually takes 10-30 seconds.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          ) : (
            <>
              <div className="relative -mx-4 md:mx-0">
                <div className="flex md:grid md:grid-cols-3 gap-6 mb-12 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible py-4 pb-6 md:pb-4 scroll-smooth px-4 md:px-0">
                  <div className="min-w-[50vw] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink relative z-10">
                    <StatsCard
                      title="Total Students"
                      value={totalStudents}
                      icon={<Users className="w-6 h-6" />}
                    />
                  </div>
                  <div className="min-w-[50vw] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink relative z-10">
                    <StatsCard
                      title="Average Age"
                      value={averageAge > 0 ? `${averageAge}` : "0"}
                      icon={<BarChart3 className="w-6 h-6" />}
                    />
                  </div>
                  <div className="min-w-[50vw] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink relative z-10">
                    <StatsCard
                      title="Active Students"
                      value={totalStudents}
                      icon={<UserCheck className="w-6 h-6" />}
                    />
                  </div>
                </div>
              </div>

              {/* Recent Students Preview */}
              {recentStudents.length > 0 && (
                <div className="relative">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      New Students
                    </h3>
                    <p className="text-muted-foreground">
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
      <section className="py-16 bg-muted/50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Featured Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This application is equipped with various advanced features to
              manage student data
            </p>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 pb-6 scroll-smooth px-4 md:px-[max(1rem,calc((100vw-1280px)/2+1rem))]">
          {/* Feature 1 */}
          <Card className="min-w-[280px] max-w-[320px] snap-start flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6 text-primary-foreground">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Real-time Search
              </h3>
              <p className="text-muted-foreground">
                Search students by name, email, or class with results appearing
                instantly using GraphQL.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="min-w-[280px] max-w-[320px] snap-start flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6 text-primary-foreground">
                <Settings2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                CRUD Operations
              </h3>
              <p className="text-muted-foreground">
                Add, edit, delete, and view student details with an intuitive
                and responsive interface.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="min-w-[280px] max-w-[320px] snap-start flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6 text-primary-foreground">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Async Data Fetching
              </h3>
              <p className="text-muted-foreground">
                Efficient data fetching with a smooth and user-friendly
                asynchronous.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="min-w-[280px] max-w-[320px] snap-start flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6 text-primary-foreground">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Form Validation
              </h3>
              <p className="text-muted-foreground">
                Comprehensive form validation to ensure that the data entered is
                always valid and consistent.
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="min-w-[280px] max-w-[320px] snap-start flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6 text-primary-foreground">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                High Performance
              </h3>
              <p className="text-muted-foreground">
                Optimized queries with GraphQL and caching for extremely fast
                application performance.
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="min-w-[280px] max-w-[320px] snap-start flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6 text-primary-foreground">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Responsive Design
              </h3>
              <p className="text-muted-foreground">
                Responsive and mobile-friendly interface, can be accessed
                perfectly on all devices.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Technologies Used
            </h2>
            <p className="text-lg text-muted-foreground">
              Built with modern and reliable technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-foreground rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-background font-bold text-xl">Next</span>
              </div>
              <h3 className="font-semibold text-foreground">Next.js</h3>
              <p className="text-sm text-muted-foreground">React Framework</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h3 className="font-semibold text-foreground">MongoDB</h3>
              <p className="text-sm text-muted-foreground">NoSQL Database</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">GQL</span>
              </div>
              <h3 className="font-semibold text-foreground">GraphQL</h3>
              <p className="text-sm text-muted-foreground">Query Language</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">TS</span>
              </div>
              <h3 className="font-semibold text-foreground">TypeScript</h3>
              <p className="text-sm text-muted-foreground">Type Safety</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Try?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Explore and experience all student management features.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="shadow-lg hover:shadow-xl"
          >
            <Link href="/src" className="gap-2">
              Start Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 Students Data with GraphQL. Built with Next.js, MongoDB and
            GraphQL.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return <HomePageContent />;
}
