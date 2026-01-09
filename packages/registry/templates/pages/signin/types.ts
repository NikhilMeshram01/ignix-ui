// ─────────────────────────────────────────────────────────────────────────────
// Types and Interfaces
// ─────────────────────────────────────────────────────────────────────────────

import { type VariantProps } from "class-variance-authority";
import type { containerVariants } from "./variants";

export interface SignInFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export type SocialProvider = 'google' | 'github' | 'microsoft';

export interface SocialButtonConfig {
    id: string;
    provider: SocialProvider;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    loading: boolean;
}

export interface SplitLayoutStyles {
    leftPanelClasses: string;
    textColor: string;
    companyNameColor: string;
    descriptionColor: string;
    backgroundStyle: React.CSSProperties;
    overlayStyle: React.CSSProperties;
    rightPanelClasses: string;
}

export interface FeatureItem {
    text: string;
    icon?: React.ReactNode;
    iconColor?: string;
    textClassName?: string;
}

export interface TestimonialItem {
    quote: string;
    author: string;
    role?: string;
}

export interface StatisticItem {
    value: string;
    label: string;
    subtext?: string;
}

export interface LeftPanelContentConfig {
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
    features?: FeatureItem[];
    testimonials?: TestimonialItem[];
    statistics?: StatisticItem[];
    customContent?: React.ReactNode;
    footerText?: string | React.ReactNode;
    hideBranding?: boolean;
    contentClassName?: string;
    layout?: {
        align?: "left" | "center" | "right";
        maxWidth?: string;
        animate?: boolean;
    };
    animationConfig?: {
        titleDelay?: number;
        descriptionDelay?: number;
        featuresDelay?: number;
        staggerChildren?: number;
    };
}

export interface ButtonStyles {
    gradient?: string;
    hoverGradient?: string;
    textColor?: string;
    shadow?: string;
    hoverShadow?: string;
    className?: string;
}

export interface SplitBackground {
    gradient?: string;
    textColor?: string;
    companyNameColor?: string;
    descriptionColor?: string;
    leftPanelClassName?: string;
    backgroundImage?: string;
    overlayColor?: string;
    rightPanelClassName?: string;
}

export interface SignInProps {
    type?: "centered" | "split";
    variant?: VariantProps<typeof containerVariants>["variant"];
    companyName?: string;
    logo?: React.ReactNode;
    onSubmit?: (data: SignInFormData) => void;
    onSignUp?: () => void;
    onGoogleSignIn?: () => void;
    onGitHubSignIn?: () => void;
    onMicrosoftSignIn?: () => void;
    signUpText?: string;
    loading?: boolean;
    error?: string;
    showSocialLogin?: boolean;
    showForgotPassword?: boolean;
    showSignUpLink?: boolean;
    className?: string;
    splitBackground?: SplitBackground;
    buttonStyle?: ButtonStyles;
    leftPanelContent?: LeftPanelContentConfig;
}

export interface LeftPanelProps {
    companyName?: string;
    logo?: React.ReactNode;
    leftPanelContent?: LeftPanelContentConfig;
    splitStyles: SplitLayoutStyles;
    isDarkVariant?: boolean;
}

export interface FormContentProps {
    variant: string;
    type: "centered" | "split";
    logo?: React.ReactNode;
    loading?: boolean;
    error?: string;
    showSocialLogin?: boolean;
    showForgotPassword?: boolean;
    showSignUpLink?: boolean;
    buttonStyle?: ButtonStyles;
    onSignUp?: () => void;
    onSubmit?: (data: SignInFormData) => void;
    onGoogleSignIn?: () => void;
    onGitHubSignIn?: () => void;
    onMicrosoftSignIn?: () => void;
    formData: SignInFormData;
    errors: Record<string, string>;
    showPassword: boolean;
    socialLoading: SocialProvider | null;
    onInputChange: (field: keyof SignInFormData, value: string | boolean) => void;
    onTogglePassword: () => void;
    onSocialSignIn: (provider: SocialProvider, callback?: () => void) => Promise<void>;
    handleSignUpClick: () => void;
    handleSubmit: (e: React.FormEvent) => void; // Add this
        onBlur?: (field: keyof SignInFormData) => void; // Add this
}


export interface SocialButtonsProps {
    onGoogleSignIn?: () => void;
    onGitHubSignIn?: () => void;
    onMicrosoftSignIn?: () => void;
    loading?: SocialProvider | null;
    isDarkVariant?: boolean;
    className?: string;
}