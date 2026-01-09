
import * as React from "react";
import { cn } from "../../../../../utils/cn";
import { useSignIn } from "./hooks/use-sign-in";
import { containerVariants } from "./variants";
import { getSplitLayoutStyles } from "./utils";
import { LeftPanel } from "./components/LeftPanel";
import { FormContent } from "./components/FormContent";
import { type SignInProps } from "./types";
import { DEFAULT_COMPANY_NAME } from "./constants";

/**
 * A highly customizable sign-in component with multiple layouts, themes,
 * social login options, and extensive content customization capabilities.
 * 
 * @example
 * ```tsx
 * <SignIn 
 *   type="split"
 *   variant="modern"
 *   companyName="MyApp"
 *   onSubmit={handleSubmit}
 *   showSocialLogin={true}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Centered layout with dark theme
 * <SignIn
 *   type="centered"
 *   variant="dark"
 *   companyName="SecureApp"
 *   onSubmit={handleLogin}
 *   loading={isLoading}
 *   error={loginError}
 * />
 * ```
 */
const SignIn: React.FC<SignInProps> = ({
    type = "centered",
    variant = "default",
    companyName = DEFAULT_COMPANY_NAME,
    logo,
    onSubmit,
    onSignUp,
    onGoogleSignIn,
    onGitHubSignIn,
    onMicrosoftSignIn,
    loading = false,
    error = "",
    showSocialLogin = true,
    showForgotPassword = true,
    showSignUpLink = true,
    className,
    splitBackground,
    buttonStyle,
    leftPanelContent,
}) => {
    const {
        formData,
        showPassword,
        errors,
        socialLoading,
        isSubmitting,
        setShowPassword,
        handleSubmit,
        handleInputChange,
        handleSocialSignIn,
        handleBlur, // Add this
    } = useSignIn(onSubmit);

    const handleSignUpClick = () => {
        if (onSignUp) {
            onSignUp();
        }
    };

    const isDarkVariant = variant === "dark";

    // For split layout, we need to handle the info panel
    if (type === "split") {
        const splitStyles = getSplitLayoutStyles(variant as string, splitBackground);

        return (
            <div className={cn(containerVariants({ variant, type }), className)}>
                {/* Left Panel - Info */}
                <div
                    className={splitStyles.leftPanelClasses}
                    style={splitStyles.backgroundStyle}
                >
                    {/* Overlay for background image */}
                    {splitStyles.backgroundStyle.backgroundImage && (
                        <div
                            className="absolute inset-0"
                            style={splitStyles.overlayStyle}
                        />
                    )}

                    <LeftPanel
                        companyName={companyName}
                        logo={logo}
                        leftPanelContent={leftPanelContent}
                        splitStyles={splitStyles}
                        isDarkVariant={isDarkVariant}
                    />
                </div>

                {/* Right Panel - Form */}
                <div className={splitStyles.rightPanelClasses}>
                    <FormContent
                        variant={variant as string}
                        type={type}
                        logo={logo}
                        loading={loading || isSubmitting} // Combine loading states
                        error={error}
                        showSocialLogin={showSocialLogin}
                        showForgotPassword={showForgotPassword}
                        showSignUpLink={showSignUpLink}
                        buttonStyle={buttonStyle}
                        onSignUp={onSignUp}
                        onGoogleSignIn={onGoogleSignIn}
                        onGitHubSignIn={onGitHubSignIn}
                        onMicrosoftSignIn={onMicrosoftSignIn}
                        formData={formData}
                        errors={errors}
                        showPassword={showPassword}
                        socialLoading={socialLoading}
                        onInputChange={handleInputChange}
                        onBlur={handleBlur} // Add this
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        onSocialSignIn={handleSocialSignIn}
                        handleSignUpClick={handleSignUpClick}
                        handleSubmit={handleSubmit}
                    />
                </div>
            </div>
        );
    }

    // Centered layout
    return (
        <div className={cn(containerVariants({ variant, type }), className)}>
            <FormContent
                variant={variant as string}
                type={type}
                logo={logo}
                loading={loading || isSubmitting} // Combine loading states
                error={error}
                showSocialLogin={showSocialLogin}
                showForgotPassword={showForgotPassword}
                showSignUpLink={showSignUpLink}
                buttonStyle={buttonStyle}
                onSignUp={onSignUp}
                onGoogleSignIn={onGoogleSignIn}
                onGitHubSignIn={onGitHubSignIn}
                onMicrosoftSignIn={onMicrosoftSignIn}
                formData={formData}
                errors={errors}
                showPassword={showPassword}
                socialLoading={socialLoading}
                onInputChange={handleInputChange}
                onBlur={handleBlur} // Add this
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSocialSignIn={handleSocialSignIn}
                handleSignUpClick={handleSignUpClick}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

SignIn.displayName = "SignIn";

export { SignIn };