import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const userId = session?.userId;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      {/* Hero Section */}
      <section className="min-h-[40vh] flex items-center justify-center relative overflow-hidden pb-4">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              HR Management Made Simple
            </h1>
            <p className="text-lg text-gray-600 mb-3">
              Streamline your HR processes with our comprehensive platform for goal management, performance assessments, and employee development.
            </p>
            {!userId && (
              <div className="flex gap-4 justify-center">
                <Link
                  href="/sign-up"
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
                <Link
                  href="/sign-in"
                  className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Everything You Need to Manage Your Workforce
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools to help you build and maintain a high-performing team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 max-w-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Goal Management
              </h3>
              <p className="text-sm text-gray-600">
                Set clear objectives, track progress, and align team goals with organizational strategy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 max-w-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Performance Assessments
              </h3>
              <p className="text-sm text-gray-600">
                Create customized assessment templates and provide meaningful feedback to drive growth.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 max-w-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Employee Development
              </h3>
              <p className="text-sm text-gray-600">
                Track skills, manage career paths, and support professional growth with development plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Ready to Transform Your HR Processes?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join organizations that are already using our platform to build better teams and drive success.
            </p>
            {!userId && (
              <Link
                href="/sign-up"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl inline-block"
              >
                Start Free Trial
              </Link>
            )}
            {userId && (
              <Link
                href="/my-doc"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl inline-block"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
