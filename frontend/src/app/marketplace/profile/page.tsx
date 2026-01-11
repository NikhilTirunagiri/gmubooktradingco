"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import MPNavbar from "@/components/mp-navbar";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <MPNavbar isDarkBackground={false} variant="fixed-top" />
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--color-primary-violet)] mb-6">
            My Profile
          </h1>
          <p className="text-gray-600">Profile page content coming soon...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
