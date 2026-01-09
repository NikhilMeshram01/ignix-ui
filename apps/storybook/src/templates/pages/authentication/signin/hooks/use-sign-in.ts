
// ─────────────────────────────────────────────────────────────────────────────
// Custom Hook for SignIn Form Logic
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { type SignInFormData, type SocialProvider } from "../types";
import { validateForm, validateField } from "../utils";

/**
 * Custom hook for managing sign-in form state and logic
 * @param onSubmit - Optional callback function for form submission
 * @returns Object containing form state and handlers
 */
export const useSignIn = (onSubmit?: (data: SignInFormData) => void) => {
    const [formData, setFormData] = useState<SignInFormData>({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        
        // Mark all fields as touched to show errors
        setTouched({
            email: true,
            password: true,
            rememberMe: true,
        });

        const newErrors = validateForm(formData);
        setErrors(newErrors);

        // Only submit if there are no errors
        if (Object.keys(newErrors).length === 0 && onSubmit) {
            setIsSubmitting(true);
            try {
                onSubmit(formData);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [formData, onSubmit]);

    const handleInputChange = useCallback((field: keyof SignInFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error when user starts typing (if field has been touched)
        if (touched[field] && errors[field]) {
            const error = validateField(field, value);
            if (error) {
                setErrors(prev => ({ ...prev, [field]: error }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        }
    }, [touched, errors]);

    const handleBlur = useCallback((field: keyof SignInFormData) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        
        // Validate field on blur
        const error = validateField(field, formData[field]);
        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
        } else if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [formData, errors]);

    const handleSocialSignIn = async (
        provider: SocialProvider,
        callback?: () => void
    ) => {
        setSocialLoading(provider);

        try {
            if (callback) {
                await callback();
            }
        } finally {
            setTimeout(() => setSocialLoading(null), 500);
        }
    };

    return {
        formData,
        showPassword,
        errors,
        socialLoading,
        isSubmitting,
        touched,
        setShowPassword,
        handleSubmit,
        handleInputChange,
        handleSocialSignIn,
        handleBlur,
    };
};