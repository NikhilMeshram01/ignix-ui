// ─────────────────────────────────────────────────────────────────────────────
// Left Panel Component for Split Layout
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { motion } from "framer-motion";
import { Shield, Star, Check } from "lucide-react";
import { cn } from "../../../../utils/cn";
import { getLeftPanelContent } from "../utils";
import { type LeftPanelProps, } from "../types";


/**
 * Left panel component for split layout sign-in
 * Displays branding, features, testimonials, and other promotional content
 * @example
 * ```tsx
 * <LeftPanel
 *   companyName="MyApp"
 *   splitStyles={splitStyles}
 *   leftPanelContent={{
 *     title: "Welcome Back",
 *     features: [...],
 *   }}
 * />
 * ```
 */
export const LeftPanel: React.FC<LeftPanelProps> = ({
    companyName,
    logo,
    leftPanelContent,
    splitStyles,
    isDarkVariant = false,
}) => {
    const {
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
        maxWidth,
        shouldAnimate,
    } = getLeftPanelContent(leftPanelContent, companyName);

    const defaultLogo = (
        <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg",
            isDarkVariant
                ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30"
                : "bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200"
        )}>
            <Shield className={cn(
                "w-8 h-8",
                isDarkVariant
                    ? "text-blue-400 drop-shadow"
                    : "text-blue-600"
            )} />
        </div>
    );

    const MotionDiv = shouldAnimate ? motion.div : "div";

    if (customContent) {
        return customContent;
    }

    return (
        <div className={cn("w-full h-full flex items-center justify-center relative z-10", contentClassName)}>
            <div className={cn(
                "relative z-10 flex flex-col w-full",
                alignClass,
                maxWidth
            )}>
                {/* Branding Section */}
                {!hideBranding && (
                    <MotionDiv
                        {...(shouldAnimate ? {
                            initial: { x: -50, opacity: 0 },
                            animate: { x: 0, opacity: 1 },
                            transition: { duration: 0.6 }
                        } : {})}
                        className={cn(
                            "flex items-center gap-4 mb-12",
                            layout.align === "left" ? "justify-start" :
                                layout.align === "right" ? "justify-end" : "justify-center"
                        )}
                    >
                        {logo || defaultLogo}
                        <span className={cn(
                            "text-2xl md:text-3xl font-bold tracking-tight",
                            splitStyles.companyNameColor
                        )}>
                            {companyName}
                        </span>
                    </MotionDiv>
                )}

                {/* Main Content */}
                <div className="space-y-10">
                    {/* Title Section */}
                    <MotionDiv
                        {...(shouldAnimate ? {
                            initial: { y: 30, opacity: 0 },
                            animate: { y: 0, opacity: 1 },
                            transition: { delay: mergedAnimationConfig.titleDelay, duration: 0.6 }
                        } : {})}
                        className="space-y-6"
                    >
                        <div className={cn("space-y-4", splitStyles.textColor)}>
                            {panelTitle}
                        </div>

                        {/* Subtitle */}
                        {subtitle && (
                            <div className={cn(
                                "text-xl md:text-2xl font-semibold leading-relaxed",
                                splitStyles.descriptionColor
                            )}>
                                {subtitle}
                            </div>
                        )}

                        {/* Description */}
                        <div className={cn(
                            "text-base md:text-lg leading-relaxed",
                            splitStyles.descriptionColor
                        )}>
                            {panelDescription}
                        </div>
                    </MotionDiv>

                    {/* Features List */}
                    {panelFeatures.length > 0 && (
                        <MotionDiv
                            {...(shouldAnimate ? {
                                initial: { opacity: 0, y: 20 },
                                animate: { opacity: 1, y: 0 },
                                transition: { delay: mergedAnimationConfig.featuresDelay, duration: 0.5 }
                            } : {})}
                            className={cn(
                                "space-y-4",
                                layout.align === "center" && "mx-auto",
                                panelFeatures.length > 4 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""
                            )}
                        >
                            {panelFeatures.map((feature, index) => (
                                <MotionDiv
                                    key={index}
                                    {...(shouldAnimate ? {
                                        initial: { x: -20, opacity: 0 },
                                        animate: { x: 0, opacity: 1 },
                                        transition: {
                                            delay: mergedAnimationConfig.featuresDelay + (index * mergedAnimationConfig.staggerChildren),
                                            duration: 0.4
                                        }
                                    } : {})}
                                    className="flex items-start gap-3 group"
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                                        "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                                        "shadow-md",
                                        feature.iconColor || "bg-white/20"
                                    )}>
                                        {feature.icon || <Check className="w-5 h-5 text-white" />}
                                    </div>
                                    <span className={cn(
                                        "text-base leading-tight pt-1",
                                        feature.textClassName || "font-semibold text-white/95"
                                    )}>
                                        {feature.text}
                                    </span>
                                </MotionDiv>
                            ))}
                        </MotionDiv>
                    )}

                    {/* Statistics */}
                    {statistics && statistics.length > 0 && (
                        <MotionDiv
                            {...(shouldAnimate ? {
                                initial: { opacity: 0, y: 20 },
                                animate: { opacity: 1, y: 0 },
                                transition: { delay: mergedAnimationConfig.featuresDelay + 0.2, duration: 0.5 }
                            } : {})}
                            className={cn(
                                "grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-white/10",
                                layout.align === "center" && "mx-auto"
                            )}
                        >
                            {statistics.map((stat, index) => (
                                <MotionDiv
                                    key={index}
                                    {...(shouldAnimate ? {
                                        initial: { scale: 0.8, opacity: 0 },
                                        animate: { scale: 1, opacity: 1 },
                                        transition: {
                                            delay: mergedAnimationConfig.featuresDelay + 0.3 + (index * 0.1),
                                            duration: 0.4
                                        }
                                    } : {})}
                                    className="text-center space-y-1"
                                >
                                    <div className={cn(
                                        "text-3xl md:text-4xl font-bold tracking-tight",
                                        splitStyles.companyNameColor
                                    )}>
                                        {stat.value}
                                    </div>
                                    <div className={cn(
                                        "text-sm font-semibold uppercase tracking-wider",
                                        splitStyles.descriptionColor
                                    )}>
                                        {stat.label}
                                    </div>
                                    {stat.subtext && (
                                        <div className={cn(
                                            "text-xs opacity-80",
                                            splitStyles.descriptionColor
                                        )}>
                                            {stat.subtext}
                                        </div>
                                    )}
                                </MotionDiv>
                            ))}
                        </MotionDiv>
                    )}

                    {/* Testimonials */}
                    {testimonials && testimonials.length > 0 && (
                        <MotionDiv
                            {...(shouldAnimate ? {
                                initial: { opacity: 0, y: 20 },
                                animate: { opacity: 1, y: 0 },
                                transition: { delay: mergedAnimationConfig.featuresDelay + 0.4, duration: 0.5 }
                            } : {})}
                            className={cn(
                                "pt-8",
                                layout.align === "center" && "mx-auto"
                            )}
                        >
                            <div className="space-y-6">
                                <div className={cn(
                                    "text-sm font-semibold uppercase tracking-wider mb-4",
                                    splitStyles.descriptionColor
                                )}>
                                    Trusted by Industry Leaders
                                </div>
                                {testimonials.map((testimonial, index) => (
                                    <MotionDiv
                                        key={index}
                                        {...(shouldAnimate ? {
                                            initial: { opacity: 0, x: -20 },
                                            animate: { opacity: 1, x: 0 },
                                            transition: {
                                                delay: mergedAnimationConfig.featuresDelay + 0.5 + (index * 0.1),
                                                duration: 0.4
                                            }
                                        } : {})}
                                        className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                            </div>
                                            <div>
                                                <p className={cn(
                                                    "text-sm md:text-base leading-relaxed italic",
                                                    splitStyles.descriptionColor
                                                )}>
                                                    "{testimonial.quote}"
                                                </p>
                                                <div className={cn(
                                                    "text-sm mt-4 flex flex-col sm:flex-row sm:items-center gap-1",
                                                    splitStyles.descriptionColor
                                                )}>
                                                    <span className="font-semibold">{testimonial.author}</span>
                                                    {testimonial.role && (
                                                        <>
                                                            <span className="hidden sm:inline mx-2 opacity-50">•</span>
                                                            <span className="opacity-75">{testimonial.role}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </MotionDiv>
                                ))}
                            </div>
                        </MotionDiv>
                    )}
                </div>

                {/* Footer */}
                {footerText !== null && (
                    <MotionDiv
                        {...(shouldAnimate ? {
                            initial: { y: 20, opacity: 0 },
                            animate: { y: 0, opacity: 1 },
                            transition: { delay: mergedAnimationConfig.featuresDelay + 0.6, duration: 0.5 }
                        } : {})}
                        className={cn(
                            "mt-12 pt-8 border-t border-white/10",
                            splitStyles.descriptionColor
                        )}
                    >
                        {footerText || (
                            <div className="text-sm">
                                <span className="font-semibold">© 2024 {companyName}</span>
                                <span className="opacity-70 ml-2">• All rights reserved</span>
                            </div>
                        )}
                    </MotionDiv>
                )}
            </div>
        </div>
    );
};

LeftPanel.displayName = "LeftPanel";