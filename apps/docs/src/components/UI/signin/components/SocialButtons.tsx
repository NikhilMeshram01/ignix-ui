// ─────────────────────────────────────────────────────────────────────────────
// Social Login Buttons Component
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { cn } from "../../../../utils/cn";
import { type SocialButtonsProps, type SocialProvider } from "../types";


/**
 * Social login buttons component with loading states
 * @example
 * ```tsx
 * <SocialButtons
 *   onGoogleSignIn={() => handleGoogleSignIn()}
 *   onGitHubSignIn={() => handleGitHubSignIn()}
 *   loading={loadingProvider}
 * />
 * ```
 */
export const SocialButtons: React.FC<SocialButtonsProps> = ({
    onGoogleSignIn,
    onGitHubSignIn,
    onMicrosoftSignIn,
    loading,
    // isDarkVariant = false,
    className,
}) => {
    const socialButtons = [
        {
            id: 'google',
            provider: 'google' as SocialProvider,
            icon: <FcGoogle className="w-5 h-5" />,
            label: 'Google',
            onClick: onGoogleSignIn,
            loading: loading === 'google',
        },
        {
            id: 'github',
            provider: 'github' as SocialProvider,
            icon: <FaGithub className="w-5 h-5" />,
            label: 'GitHub',
            onClick: onGitHubSignIn,
            loading: loading === 'github',
        },
        {
            id: 'microsoft',
            provider: 'microsoft' as SocialProvider,
            icon: <FaMicrosoft className="w-5 h-5 text-[#00A4EF]" />,
            label: 'Microsoft',
            onClick: onMicrosoftSignIn,
            loading: loading === 'microsoft',
        },
    ];

    return (
        <div className={cn("grid grid-cols-3 gap-3", className)}>
            {socialButtons.map((social) => (
                <button
                    key={social.id}
                    type="button"
                    className={cn(
                        "w-full inline-flex justify-center items-center py-2.5 px-4 border rounded-lg text-sm font-medium transition-all duration-300",
                        "hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
                        "bg-white border-gray-300 hover:bg-gray-50 cursor-pointer",
                        social.loading && "opacity-50 cursor-wait"
                    )}
                    onClick={social.onClick}
                    disabled={social.loading}
                    aria-label={`Sign in with ${social.label}`}
                >
                    {social.loading ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                        social.icon
                    )}
                </button>
            ))}
        </div>
    );
};

SocialButtons.displayName = "SocialButtons";