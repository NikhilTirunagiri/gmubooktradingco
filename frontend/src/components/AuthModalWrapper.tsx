"use client";

import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";

export default function AuthModalWrapper() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  return <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />;
}
