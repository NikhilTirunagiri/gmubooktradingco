"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"checking" | "verified" | "error" | "expired">("checking");
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    const checkVerification = async () => {
      try {
        // Get email from URL hash or query params
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get("email");

        // Parse hash fragments for error codes (Supabase redirects with errors in hash)
        const hashParams = hash ? new URLSearchParams(hash.substring(1)) : null;
        const errorFromHash = hashParams?.get("error");
        const errorCodeFromHash = hashParams?.get("error_code");

        // Try to extract email from hash fragments (Supabase format)
        let userEmail = emailParam;
        
        // If no email in URL, try to get from localStorage (from signup)
        if (!userEmail) {
          userEmail = localStorage.getItem("signup_email");
        }

        if (!userEmail) {
          setStatus("error");
          setMessage("Email not found. Please sign up again or contact support.");
          return;
        }

        setEmail(userEmail);

        // IMPORTANT: Always check verification status first, even if URL shows an error
        // The link might have expired, but the user could already be verified
        try {
          const result = await apiClient.checkVerification(userEmail);

          if (result.email_verified) {
            // User is verified! Show success even if link was expired
            setStatus("verified");
            setMessage("Your email has been verified successfully! You can now log in.");
            // Clear stored email
            localStorage.removeItem("signup_email");
            // Redirect to marketplace after 3 seconds (user can login via modal)
            setTimeout(() => {
              router.push("/marketplace");
            }, 3000);
            return;
          }
        } catch (verifyError) {
          // If verification check fails, continue to show error message
          console.error("Verification check error:", verifyError);
        }

        // If we get here, user is not verified
        // Check if there's an error in the URL (like otp_expired)
        const error = searchParams.get("error") || errorFromHash;
        const errorCode = searchParams.get("error_code") || errorCodeFromHash;

        if (errorCode === "otp_expired" || error === "access_denied") {
          setStatus("expired");
          setMessage("The verification link has expired. However, please check if your email was already verified. If not, you can request a new verification email below.");
        } else {
          setStatus("error");
          setMessage("Email not yet verified. Please check your email for the verification link.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "An error occurred while checking verification status."
        );
      }
    };

    checkVerification();
  }, [router, searchParams]);

  const handleResendVerification = async () => {
    if (!email) return;

    try {
      await apiClient.resendVerification(email);
      setMessage("Verification email sent! Please check your inbox and spam folder.");
      setStatus("checking");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to resend verification email. Please try again."
      );
    }
  };

  return (
    <>
      <Navbar isDarkBackground={true} variant="fixed-top" />

      <div
        className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden"
        style={{ fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif' }}
      >
        <div
          className="@[480px]:p-4 flex flex-col mb-[0px] text-left"
          style={{
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "0",
            paddingRight: "0",
            backgroundClip: "unset",
            WebkitBackgroundClip: "unset",
            color: "rgba(247, 247, 250, 1)",
            verticalAlign: "bottom",
          }}
        >
          <div className="@container">
            <div
              className="mathco-hero-bg flex flex-col gap-6 sm:gap-8 items-center justify-center p-4 sm:p-8 lg:p-16 @[480px]:gap-12 relative overflow-hidden"
              style={{
                paddingTop: "129px",
                paddingBottom: "129px",
                marginTop: "0px",
                marginBottom: "0px",
                minHeight: "100vh",
              }}
            >
              <div
                className="flex flex-col gap-6 relative z-10 w-full max-w-md"
                style={{ marginTop: "8px", marginBottom: "8px" }}
              >
                <div className="p-8">
                  <div className="flex flex-col gap-3 mb-8">
                    <h1 className="text-[var(--color-primary-white)] text-3xl sm:text-4xl font-medium leading-tight">
                      Email Verification
                    </h1>
                    <p className="text-[var(--color-primary-white)]/70 text-sm sm:text-base">
                      {status === "checking" && "Checking verification status..."}
                      {status === "verified" && "Verification successful!"}
                      {status === "expired" && "Verification link expired"}
                      {status === "error" && "Verification issue"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {status === "checking" && (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p className="mt-4 text-white/70">Please wait...</p>
                      </div>
                    )}

                    {status === "verified" && (
                      <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200">
                        <p className="mb-4">{message}</p>
                        <p className="text-sm text-green-200/70">
                          Redirecting to login page...
                        </p>
                      </div>
                    )}

                    {(status === "error" || status === "expired") && (
                      <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
                        <p className="mb-4">{message}</p>
                        {email && (
                          <button
                            onClick={handleResendVerification}
                            className="w-full px-6 py-3 rounded-lg bg-gradient-primary text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mt-2"
                          >
                            Resend Verification Email
                          </button>
                        )}
                      </div>
                    )}

                    <div className="text-center mt-6">
                      <button
                        onClick={openAuthModal}
                        className="text-[var(--color-primary-blue)] font-medium hover:underline transition-all"
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="relative flex size-full min-h-screen flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
