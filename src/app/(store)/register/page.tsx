"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { getHomepageConfig } from "@/features/marketing/homepage-actions";
import { registerUserAccount } from "@/features/account/actions";
import { type HomepageFullConfig, DEFAULT_HOMEPAGE_CONFIG } from "@/features/marketing/homepage-types";
import { trackCompleteRegistration } from "@/lib/analytics/datalayer";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [config, setConfig] = useState<HomepageFullConfig>(DEFAULT_HOMEPAGE_CONFIG);

  useEffect(() => {
    getHomepageConfig().then((data) => {
      if (data) setConfig(data);
    });
  }, []);

  const logoImg = config.headerConfig?.logoImageUrl;
  const brandName = config.headerConfig?.logoText || "Blush & Budget";

  const updateField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg(null);
    setNeedsVerification(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create account via robust server action (bypasses public SMTP email rate limit & syncs profile)
      const res = await registerUserAccount({
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
      });

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      trackCompleteRegistration("email", "success");

      // 2. Establish active client session immediately
      const supabase = createClient();
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (signInError) {
        // In case immediate sign-in needs manual step
        setSuccessMsg("Account created successfully! Please sign in with your credentials.");
        setNeedsVerification(true);
        setLoading(false);
        return;
      }

      if (signInData?.session) {
        setSuccessMsg("Account created and logged in! Redirecting to your account...");
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 1000);
        return;
      }

      setSuccessMsg("Account created successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 bg-gray-50/50">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-gray-200 bg-white p-7 sm:p-9 shadow-xl">
        {/* Logo & Heading */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center justify-center">
            {logoImg ? (
                <img
                src={logoImg}
                alt={brandName}
                className="h-9 sm:h-10 max-h-10 w-auto max-w-45 object-contain"
              />
            ) : (
              <span className="text-2xl font-black text-gray-900 tracking-[0.15em] uppercase font-sans">
                {brandName}
              </span>
            )}
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900">Create an Account</h1>
            <p className="text-xs text-gray-500 mt-1">
              Join thousands of authentic skincare and beauty enthusiasts.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 space-y-2 animate-in fade-in-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            {needsVerification && (
              <div className="pt-2 border-t border-emerald-200/60 flex justify-end">
                <Link
                  href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                  className="inline-flex items-center gap-1 font-black text-sg-pink hover:underline"
                >
                  Proceed to Sign In &rarr;
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Register Form */}
        {!needsVerification && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name" className="text-xs font-bold text-gray-800">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="Rahim Ahmed"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  required
                  disabled={loading || !!successMsg}
                  className="pl-10 h-11 rounded-xl text-sm border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-xs font-bold text-gray-800">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="rahim@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                  disabled={loading || !!successMsg}
                  className="pl-10 h-11 rounded-xl text-sm border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-phone" className="text-xs font-bold text-gray-800">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="01700-000000"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  disabled={loading || !!successMsg}
                  className="pl-10 h-11 rounded-xl text-sm border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-password" className="text-xs font-bold text-gray-800">
                Password (min. 8 characters)
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                  minLength={8}
                  disabled={loading || !!successMsg}
                  className="pl-10 pr-10 h-11 rounded-xl text-sm border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-confirm" className="text-xs font-bold text-gray-800">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  required
                  disabled={loading || !!successMsg}
                  className="pl-10 h-11 rounded-xl text-sm border-gray-200"
                />
              </div>
            </div>

            <Button
              id="register-submit-btn"
              type="submit"
              disabled={loading || !!successMsg}
              className="w-full h-11 rounded-xl bg-sg-pink hover:bg-sg-pink-hover text-white font-extrabold text-sm shadow-md transition-all active:scale-95 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Your Account...
                </>
              ) : successMsg ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Success!
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* Footer / Switch */}
        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          <span>Already have an account? </span>
          <Link
            href={redirectTo !== "/account" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
            className="font-bold text-[#e91e63] hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

