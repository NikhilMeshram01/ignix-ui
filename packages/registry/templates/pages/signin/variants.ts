// ─────────────────────────────────────────────────────────────────────────────
// CVA Variants for styling
// ─────────────────────────────────────────────────────────────────────────────

import { cva } from "class-variance-authority";

// Container Variants
export const containerVariants = cva("", {
    variants: {
        variant: {
            default: "",
            modern: "",
            glass: "",
            dark: "",
        },
        type: {
            centered: "min-h-screen flex items-center justify-center p-4",
            split: "min-h-screen flex",
        },
    },
    compoundVariants: [
        {
            type: "centered",
            variant: "default",
            className: "bg-gradient-to-br from-blue-50 to-cyan-50",
        },
        {
            type: "centered",
            variant: "modern",
            className: "bg-gradient-to-br from-slate-50 to-slate-100",
        },
        {
            type: "centered",
            variant: "glass",
            className: "bg-gradient-to-br from-primary/10 to-secondary/10",
        },
        {
            type: "centered",
            variant: "dark",
            className: "bg-gradient-to-br from-gray-900 to-gray-800",
        },
        {
            type: "split",
            variant: "default",
            className: "bg-background",
        },
        {
            type: "split",
            variant: "modern",
            className: "bg-slate-50 dark:bg-slate-900",
        },
        {
            type: "split",
            variant: "glass",
            className: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800",
        },
        {
            type: "split",
            variant: "dark",
            className: "bg-gray-900",
        },
    ],
    defaultVariants: {
        type: "centered",
        variant: "default",
    },
});

// Card Variants
export const cardVariants = cva("rounded-2xl shadow-2xl p-8 transition-all duration-300", {
    variants: {
        variant: {
            default: "bg-white",
            modern: "bg-white/95 backdrop-blur-sm border border-slate-200",
            glass: "bg-white/10 backdrop-blur-lg border border-white/20",
            dark: "bg-gray-800",
        },
        type: {
            centered: "w-full max-w-md",
            split: "w-full max-w-md bg-card rounded-xl",
        },
    },
    compoundVariants: [
        {
            type: "split",
            variant: "default",
            className: "bg-white",
        },
        {
            type: "split",
            variant: "modern",
            className: "bg-white/95 backdrop-blur-sm dark:bg-slate-900/95",
        },
        {
            type: "split",
            variant: "dark",
            className: "bg-gray-900",
        },
    ],
    defaultVariants: {
        type: "centered",
        variant: "default",
    },
});


/**
 * Get input classes based on variant and error state
 * @param variant - Component variant (default, modern, glass, dark)
 * @param hasError - Whether the input has an error
 * @returns Combined CSS classes for the input
 */
export const getInputClasses = (variant: string, hasError: boolean) => {
    const baseStyles = "w-full px-4 py-3 rounded-lg border transition-all duration-300 placeholder-gray-400 focus:ring-2 focus:border-transparent";

    const variantStyles = {
        default: `bg-white text-gray-900 border-gray-300 focus:ring-blue-500 ${hasError && "border-red-500"}`,
        modern: `bg-white/80 backdrop-blur-sm text-gray-900 border-slate-200 focus:ring-blue-500 ${hasError && "border-red-500"}`,
        glass: `bg-white/5 backdrop-blur-md text-white border-white/10 focus:ring-blue-400 ${hasError && "border-red-400"}`,
        dark: `bg-gray-700 text-white border-gray-600 focus:ring-blue-500 ${hasError && "border-red-500"}`
    };

    return `${baseStyles} ${variantStyles[variant as keyof typeof variantStyles] || variantStyles.default}`;
};