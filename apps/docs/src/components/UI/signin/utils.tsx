// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

import { type SignInFormData, type ButtonStyles, type SplitLayoutStyles, type SplitBackground, type LeftPanelContentConfig } from "./types";
import { DEFAULT_BUTTON_STYLES, DEFAULT_ANIMATION_CONFIG, DEFAULT_FEATURES } from "./constants";

/**
 * Validate sign-in form data
 * @param formData - Form data to validate
 * @returns Object containing validation errors (empty if valid)
 */

export const validateForm = (formData: SignInFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
        errors.email = 'Please enter your email address';
    }
    // else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //     errors.email = 'Please enter a valid email address';
    // }

    if (!formData.password) {
        errors.password = 'Please enter your password';
    }
    // else if (formData.password.length < 6) {
    //     errors.password = 'Password must be at least 6 characters long';
    // }

    return errors;
};

/**
 * Validate individual form field
 * @param field - Field name to validate
 * @param value - Field value to validate
 * @returns Error message or empty string
 */
export const validateField = (field: keyof SignInFormData, value: string | boolean): string => {
    if (field === 'email') {
        const email = value as string;
        if (!email.trim()) {
            return 'Please enter your email address';
        }
    }

    if (field === 'password') {
        const password = value as string;
        if (!password) {
            return 'Please enter your password';
        }
    }

    return '';
};


/**
 * Get merged button styles with defaults
 * @param buttonStyle - Optional custom button styles
 * @returns Complete button styles object
 */
export const getButtonStyles = (buttonStyle?: ButtonStyles): ButtonStyles => ({
    gradient: buttonStyle?.gradient || DEFAULT_BUTTON_STYLES.gradient,
    hoverGradient: buttonStyle?.hoverGradient || DEFAULT_BUTTON_STYLES.hoverGradient,
    textColor: buttonStyle?.textColor || DEFAULT_BUTTON_STYLES.textColor,
    shadow: buttonStyle?.shadow || DEFAULT_BUTTON_STYLES.shadow,
    hoverShadow: buttonStyle?.hoverShadow || DEFAULT_BUTTON_STYLES.hoverShadow,
    className: buttonStyle?.className || DEFAULT_BUTTON_STYLES.className
});

/**
 * Get split layout styling configuration
 * @param variant - Component variant
 * @param splitBackground - Optional custom split background configuration
 * @returns Complete split layout styles object
 */
export const getSplitLayoutStyles = (
    variant: string,
    splitBackground?: SplitBackground
): SplitLayoutStyles => {
    const defaultGradient = variant === "dark"
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        : "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800";

    const defaultTextColor = "text-white";
    const defaultCompanyNameColor = "text-white";
    const defaultDescriptionColor = "text-white/90";

    // Custom gradient or background image
    const backgroundStyle = splitBackground?.backgroundImage
        ? {
            backgroundImage: `url(${splitBackground.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        : {};

    // Overlay for background image
    const overlayStyle = splitBackground?.backgroundImage && splitBackground?.overlayColor
        ? {
            backgroundColor: splitBackground.overlayColor,
        }
        : {};

    return {
        leftPanelClasses: `flex-1 flex flex-col p-8 md:p-12 lg:p-16 hidden lg:flex relative ${splitBackground?.gradient || defaultGradient
            } ${splitBackground?.leftPanelClassName || ''}`,
        textColor: splitBackground?.textColor || defaultTextColor,
        companyNameColor: splitBackground?.companyNameColor || defaultCompanyNameColor,
        descriptionColor: splitBackground?.descriptionColor || defaultDescriptionColor,
        backgroundStyle,
        overlayStyle,
        rightPanelClasses: `flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12 ${splitBackground?.rightPanelClassName || ''
            }`,
    };
};

/**
 * Get processed left panel content configuration
 * @param leftPanelContent - Optional custom left panel content configuration
 * @param companyName - Company name to use in default content
 * @returns Processed left panel content configuration
 */
export const getLeftPanelContent = (
    leftPanelContent?: LeftPanelContentConfig,
    companyName?: string
) => {
    const {
        title,
        description,
        subtitle,
        features,
        testimonials,
        statistics,
        customContent,
        footerText,
        hideBranding = false,
        contentClassName,
        layout = {
            align: "center",
            maxWidth: "max-w-2xl",
            animate: true
        },
        animationConfig = DEFAULT_ANIMATION_CONFIG
    } = leftPanelContent || {};

    // Merge provided animation config with defaults
    const mergedAnimationConfig = {
        ...DEFAULT_ANIMATION_CONFIG,
        ...animationConfig
    };

    const alignClass = {
        left: "items-start text-left",
        center: "items-center text-center",
        right: "items-end text-right"
    }[layout.align || "center"];

    // Use provided content or defaults
    const panelTitle = title || (
        <div className="space-y-4">
            <div className="text-5xl font-bold leading-tight tracking-tight">
                Welcome Back
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                to {companyName}
            </div>
        </div>
    );

    const panelDescription = description || (
        <p className="text-lg leading-relaxed">
            Sign in to access your personalized dashboard and continue where you left off.
            Your work is waiting for you.
        </p>
    );

    const panelFeatures = features || DEFAULT_FEATURES;

    return {
        panelTitle,
        panelDescription,
        subtitle,
        panelFeatures,
        testimonials,
        statistics,
        customContent,
        footerText,
        hideBranding,
        contentClassName,
        mergedAnimationConfig,
        layout,
        alignClass,
        maxWidth: layout.maxWidth || "max-w-2xl",
        shouldAnimate: layout.animate !== false,
    };
};
