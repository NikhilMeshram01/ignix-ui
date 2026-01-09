// ─────────────────────────────────────────────────────────────────────────────
// Form Content Component
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertCircle,
    Mail,
    Lock,
    Shield,
    LogIn,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react";
import { cn } from "../../../../../../utils/cn";
import { Button } from "../../../../../components/button";
import { AnimatedInput } from "../../../../../components/input";
import { SocialButtons } from "./SocialButtons";
import { cardVariants, getInputClasses } from "../variants";
import { getButtonStyles } from "../utils";
import { type FormContentProps, type SignInFormData, type SocialProvider } from "../types";

/**
 * Form content component containing the sign-in form fields and controls
 * @example
 * ```tsx
 * <FormContent
 *   variant="dark"
 *   type="split"
 *   formData={formData}
 *   errors={errors}
 *   onInputChange={handleInputChange}
 * />
 * ```
 */
export const FormContent: React.FC<FormContentProps> = ({
    variant,
    type,
    logo,
    loading = false,
    error = "",
    showSocialLogin = true,
    showForgotPassword = true,
    showSignUpLink = true,
    buttonStyle,
    onGoogleSignIn,
    onGitHubSignIn,
    onMicrosoftSignIn,
    formData,
    errors,
    showPassword,
    socialLoading,
    onInputChange,
    onBlur, // Add this
    onTogglePassword,
    onSocialSignIn,
    handleSignUpClick,
    handleSubmit,
}) => {
    const isDarkVariant = variant === "dark";
    const buttonStyles = getButtonStyles(buttonStyle);

    const handleSocialClick = async (provider: SocialProvider, callback?: () => void) => {
        await onSocialSignIn(provider, callback);
    };

    // Handle field blur
    const handleFieldBlur = (field: keyof SignInFormData) => {
        if (onBlur) {
            onBlur(field);
        }
    };

    // Handle input change with blur
    const handleInputChangeWithBlur = (field: keyof SignInFormData, value: string | boolean) => {
        onInputChange(field, value);
    };

    return (
        <motion.div
            className={cn(cardVariants({ variant: variant as "dark" | "default" | "modern" | "glass" | null | undefined, type }))}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logo */}
            <div className="flex justify-center mb-8">
                <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center",
                    "shadow-lg",
                    isDarkVariant
                        ? "bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/20"
                        : "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
                )}>
                    {logo || (
                        <Shield className={cn(
                            "w-8 h-8",
                            isDarkVariant ? "text-blue-400" : "text-blue-600"
                        )} />
                    )}
                </div>
            </div>

            {/* Title */}
            <div className="text-center mb-10">
                <h1 className={cn(
                    "text-2xl md:text-3xl font-bold mb-3",
                    isDarkVariant ? "text-white" : "text-gray-900"
                )}>
                    Sign In to Your Account
                </h1>
                <p className={cn(
                    "text-sm md:text-base",
                    isDarkVariant ? "text-gray-400" : "text-gray-600"
                )}>
                    Welcome back! Please enter your details to continue
                </p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={cn(
                            "mb-6 p-4 rounded-lg border flex items-start",
                            isDarkVariant
                                ? "bg-red-900/20 border-red-800"
                                : "bg-red-50 border-red-200"
                        )}
                    >
                        <AlertCircle className={cn(
                            "w-5 h-5 mr-2 mt-0.5 flex-shrink-0",
                            isDarkVariant ? "text-red-400" : "text-red-600"
                        )} />
                        <span className={cn(
                            "text-sm font-medium",
                            isDarkVariant ? "text-red-300" : "text-red-700"
                        )}>
                            {error}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                    <label htmlFor="email" className={cn(
                        "block text-sm font-semibold",
                        isDarkVariant ? "text-gray-300" : "text-gray-700"
                    )}>
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Mail className={cn(
                                "w-5 h-5",
                                isDarkVariant ? "text-gray-500" : "text-gray-400"
                            )} />
                        </div>
                        <AnimatedInput
                            variant="clean"
                            type="text"
                            value={formData.email}
                            onChange={(value: string) => handleInputChangeWithBlur('email', value)}
                            onBlur={() => handleFieldBlur('email')}
                            placeholder="you@example.com"
                            inputClassName={cn(getInputClasses(variant, !!errors.email), "pl-10")}
                            aria-label="Email address"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                        />
                    </div>
                    {errors.email && (
                        <motion.p
                            id="email-error"
                            className="mt-1 text-xs font-medium text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {errors.email}
                        </motion.p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className={cn(
                            "block text-sm font-semibold",
                            isDarkVariant ? "text-gray-300" : "text-gray-700"
                        )}>
                            Password
                        </label>
                        {showForgotPassword && (
                            <button
                                type="button"
                                className={cn(
                                    "text-sm font-semibold transition-colors cursor-pointer",
                                    isDarkVariant
                                        ? "text-blue-400 hover:text-blue-300"
                                        : "text-blue-600 hover:text-blue-700"
                                )}
                                aria-label="Reset your password"
                            >
                                Forgot Password?
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Lock className={cn(
                                "w-5 h-5",
                                isDarkVariant ? "text-gray-500" : "text-gray-400"
                            )} />
                        </div>
                        <AnimatedInput
                            variant="clean"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(value: string) => handleInputChangeWithBlur('password', value)}
                            onBlur={() => handleFieldBlur('password')}
                            placeholder="Enter your password"
                            inputClassName={cn(getInputClasses(variant, !!errors.password), "pl-10 pr-10")}
                            aria-label="Password"
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        <button
                            type="button"
                            onClick={onTogglePassword}
                            className={cn(
                                "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded p-1",
                                isDarkVariant
                                    ? "text-gray-400 hover:text-gray-200"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-controls="password"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <motion.p
                            id="password-error"
                            className="mt-1 text-xs font-medium text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {errors.password}
                        </motion.p>
                    )}
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={formData.rememberMe}
                            onChange={(e) => onInputChange('rememberMe', e.target.checked)}
                            className={cn(
                                "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300",
                                isDarkVariant && "border-gray-600 bg-gray-700 focus:ring-blue-400"
                            )}
                            aria-label="Remember me for 30 days"
                        />
                        <span className={cn(
                            "ml-2 text-sm font-medium",
                            isDarkVariant
                                ? "text-gray-400 group-hover:text-gray-200"
                                : "text-gray-600 group-hover:text-gray-900"
                        )}>
                            Remember me
                        </span>
                    </label>
                </div>

                {/* Sign In Button */}
                <Button
                    type="submit"
                    className={cn(
                        "w-full py-3.5 font-semibold rounded-lg transform hover:scale-[1.02] active:scale-[0.98]",
                        "transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer",
                        "shadow-lg",
                        buttonStyles.gradient,
                        buttonStyles.hoverGradient,
                        buttonStyles.shadow,
                        buttonStyles.hoverShadow,
                        buttonStyles.textColor,
                        buttonStyles.className
                    )}
                    disabled={loading}
                    aria-label="Sign in to your account"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin h-5 w-5" />
                            <span className="font-semibold">Signing in...</span>
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <LogIn className="w-5 h-5" />
                            <span className="font-semibold">Sign In</span>
                        </span>
                    )}
                </Button>

                {/* Social Login Section */}
                {showSocialLogin && (
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className={cn(
                                    "w-full border-t",
                                    isDarkVariant ? "border-gray-700" : "border-gray-300"
                                )}></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className={cn(
                                    "px-3 text-xs font-semibold uppercase tracking-wider",
                                    isDarkVariant
                                        ? "bg-gray-800 text-gray-400"
                                        : "bg-white text-gray-500"
                                )}>
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <SocialButtons
                            onGoogleSignIn={() => handleSocialClick('google', onGoogleSignIn)}
                            onGitHubSignIn={() => handleSocialClick('github', onGitHubSignIn)}
                            onMicrosoftSignIn={() => handleSocialClick('microsoft', onMicrosoftSignIn)}
                            loading={socialLoading}
                            isDarkVariant={isDarkVariant}
                        />
                    </div>
                )}

                {/* Sign Up Link */}
                {showSignUpLink && (
                    <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className={cn(
                            "text-sm",
                            isDarkVariant ? "text-gray-400" : "text-gray-600"
                        )}>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={handleSignUpClick}
                                className={cn(
                                    "font-semibold transition-colors cursor-pointer",
                                    isDarkVariant
                                        ? "text-blue-400 hover:text-blue-300"
                                        : "text-blue-600 hover:text-blue-700"
                                )}
                                aria-label="Create a new account"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                )}
            </form>
        </motion.div>
    );
};

FormContent.displayName = "FormContent";