"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import MPNavbar from "@/components/mp-navbar";

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MPNavbar isDarkBackground={false} variant="fixed-top" />
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--color-primary-violet)] mb-6">
            Messages
          </h1>
          <p className="text-gray-600">Your messages will appear here...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
