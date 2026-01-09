import { describe, it, expect } from 'vitest';
import {
  validateForm,
  validateField,
  getButtonStyles,
  getSplitLayoutStyles,
  getLeftPanelContent,
} from '../utils';
import type {
  SignInFormData,
  ButtonStyles,
  SplitBackground,
  LeftPanelContentConfig,
} from '../types';
import { DEFAULT_BUTTON_STYLES, DEFAULT_ANIMATION_CONFIG } from '../constants';

describe('Utils Functions', () => {
  describe('validateForm', () => {
    it('returns empty errors object for valid form data', () => {
      const validFormData: SignInFormData = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      };

      const result = validateForm(validFormData);
      expect(result).toEqual({});
    });

    it('returns email error for empty email', () => {
      const formData: SignInFormData = {
        email: '',
        password: 'password123',
        rememberMe: false,
      };

      const result = validateForm(formData);
      expect(result.email).toBe('Please enter your email address');
      expect(result.password).toBeUndefined();
    });

    it('returns password error for empty password', () => {
      const formData: SignInFormData = {
        email: 'test@example.com',
        password: '',
        rememberMe: false,
      };

      const result = validateForm(formData);
      expect(result.password).toBe('Please enter your password');
      expect(result.email).toBeUndefined();
    });

    it('returns both email and password errors for empty form', () => {
      const formData: SignInFormData = {
        email: '',
        password: '',
        rememberMe: false,
      };

      const result = validateForm(formData);
      expect(result.email).toBe('Please enter your email address');
      expect(result.password).toBe('Please enter your password');
    });

    it('accepts email with leading/trailing spaces', () => {
      const formData: SignInFormData = {
        email: '  test@example.com  ',
        password: 'password123',
        rememberMe: false,
      };

      const result = validateForm(formData);
      expect(result).toEqual({});
    });
  });

  describe('validateField', () => {
    it('returns empty string for valid email', () => {
      const result = validateField('email', 'test@example.com');
      expect(result).toBe('');
    });

    it('returns error message for empty email', () => {
      const result = validateField('email', '');
      expect(result).toBe('Please enter your email address');
    });

    it('returns error message for email with only spaces', () => {
      const result = validateField('email', '   ');
      expect(result).toBe('Please enter your email address');
    });

    it('returns empty string for valid password', () => {
      const result = validateField('password', 'password123');
      expect(result).toBe('');
    });

    it('returns error message for empty password', () => {
      const result = validateField('password', '');
      expect(result).toBe('Please enter your password');
    });

    it('returns empty string for rememberMe field (no validation)', () => {
      const result = validateField('rememberMe', true);
      expect(result).toBe('');
    });
  });

  describe('getButtonStyles', () => {
    it('returns default button styles when no custom styles provided', () => {
      const result = getButtonStyles();
      expect(result).toEqual(DEFAULT_BUTTON_STYLES);
    });

    it('merges custom styles with defaults', () => {
      const customStyles: ButtonStyles = {
        gradient: 'custom-gradient',
        textColor: 'custom-text',
        className: 'custom-class',
      };

      const result = getButtonStyles(customStyles);
      expect(result).toEqual({
        gradient: 'custom-gradient',
        hoverGradient: DEFAULT_BUTTON_STYLES.hoverGradient,
        textColor: 'custom-text',
        shadow: DEFAULT_BUTTON_STYLES.shadow,
        hoverShadow: DEFAULT_BUTTON_STYLES.hoverShadow,
        className: 'custom-class',
      });
    });

    it('handles partial custom styles', () => {
      const customStyles: ButtonStyles = {
        gradient: 'partial-gradient',
      };

      const result = getButtonStyles(customStyles);
      expect(result.gradient).toBe('partial-gradient');
      expect(result.hoverGradient).toBe(DEFAULT_BUTTON_STYLES.hoverGradient);
      expect(result.textColor).toBe(DEFAULT_BUTTON_STYLES.textColor);
    });

    it('handles undefined buttonStyle parameter', () => {
      const result = getButtonStyles(undefined);
      expect(result).toEqual(DEFAULT_BUTTON_STYLES);
    });

    it('overrides all default styles when provided', () => {
      const customStyles: ButtonStyles = {
        gradient: 'full-gradient',
        hoverGradient: 'full-hover-gradient',
        textColor: 'full-text',
        shadow: 'full-shadow',
        hoverShadow: 'full-hover-shadow',
        className: 'full-class',
      };

      const result = getButtonStyles(customStyles);
      expect(result).toEqual(customStyles);
    });
  });

  describe('getSplitLayoutStyles', () => {
    it('returns default styles for dark variant without custom background', () => {
      const result = getSplitLayoutStyles('dark');

      expect(result.leftPanelClasses).toContain(
        'flex-1 flex flex-col p-8 md:p-12 lg:p-16 hidden lg:flex relative'
      );
      expect(result.leftPanelClasses).toContain(
        'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      );
      expect(result.textColor).toBe('text-white');
      expect(result.companyNameColor).toBe('text-white');
      expect(result.descriptionColor).toBe('text-white/90');
      expect(result.backgroundStyle).toEqual({});
      expect(result.overlayStyle).toEqual({});
      expect(result.rightPanelClasses).toContain(
        'flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12'
      );
    });

    it('returns default styles for default variant without custom background', () => {
      const result = getSplitLayoutStyles('default');

      expect(result.leftPanelClasses).toContain(
        'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800'
      );
      expect(result.textColor).toBe('text-white');
    });

    it('applies custom gradient when provided', () => {
      const customBackground: SplitBackground = {
        gradient: 'custom-gradient',
      };

      const result = getSplitLayoutStyles('default', customBackground);
      expect(result.leftPanelClasses).toContain('custom-gradient');
    });

    it('applies custom text colors when provided', () => {
      const customBackground: SplitBackground = {
        textColor: 'custom-text',
        companyNameColor: 'custom-company',
        descriptionColor: 'custom-desc',
      };

      const result = getSplitLayoutStyles('default', customBackground);
      expect(result.textColor).toBe('custom-text');
      expect(result.companyNameColor).toBe('custom-company');
      expect(result.descriptionColor).toBe('custom-desc');
    });

    it('applies custom class names when provided', () => {
      const customBackground: SplitBackground = {
        leftPanelClassName: 'custom-left-class',
        rightPanelClassName: 'custom-right-class',
      };

      const result = getSplitLayoutStyles('default', customBackground);
      expect(result.leftPanelClasses).toContain('custom-left-class');
      expect(result.rightPanelClasses).toContain('custom-right-class');
    });

    it('creates overlay style when image and overlay color provided', () => {
      const customBackground: SplitBackground = {
        backgroundImage: 'url(custom-bg.jpg)',
        overlayColor: 'rgba(0,0,0,0.7)',
      };

      const result = getSplitLayoutStyles('default', customBackground);
      expect(result.overlayStyle).toEqual({
        backgroundColor: 'rgba(0,0,0,0.7)',
      });
    });

    it('returns empty overlay style when only image is provided', () => {
      const customBackground: SplitBackground = {
        backgroundImage: 'url(custom-bg.jpg)',
      };

      const result = getSplitLayoutStyles('default', customBackground);
      expect(result.overlayStyle).toEqual({});
    });

    it('handles empty splitBackground parameter', () => {
      const result = getSplitLayoutStyles('dark', undefined);
      expect(result.leftPanelClasses).toBeDefined();
      expect(result.rightPanelClasses).toBeDefined();
    });
  });

  describe('getLeftPanelContent', () => {
    const companyName = 'Test Company';

    it('uses custom title when provided', () => {
      const customContent: LeftPanelContentConfig = {
        title: 'Custom Title',
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.panelTitle).toBe('Custom Title');
    });

    it('uses custom description when provided', () => {
      const customContent: LeftPanelContentConfig = {
        description: 'Custom Description',
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.panelDescription).toBe('Custom Description');
    });

    it('uses custom features when provided', () => {
      const customFeatures = [{ text: 'Feature 1' }, { text: 'Feature 2' }];

      const customContent: LeftPanelContentConfig = {
        features: customFeatures,
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.panelFeatures).toEqual(customFeatures);
    });

    it('applies custom layout alignment', () => {
      const customContent: LeftPanelContentConfig = {
        layout: { align: 'left' },
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.alignClass).toBe('items-start text-left');
    });

    it('applies custom layout alignment for right', () => {
      const customContent: LeftPanelContentConfig = {
        layout: { align: 'right' },
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.alignClass).toBe('items-end text-right');
    });

    it('applies custom max width', () => {
      const customContent: LeftPanelContentConfig = {
        layout: { maxWidth: 'max-w-3xl' },
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.maxWidth).toBe('max-w-3xl');
    });

    it('disables animation when animate is false', () => {
      const customContent: LeftPanelContentConfig = {
        layout: { animate: false },
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.shouldAnimate).toBe(false);
    });

    it('enables animation when animate is true', () => {
      const customContent: LeftPanelContentConfig = {
        layout: { animate: true },
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.shouldAnimate).toBe(true);
    });

    it('merges custom animation config with defaults', () => {
      const customContent: LeftPanelContentConfig = {
        animationConfig: {
          titleDelay: 0.5,
          staggerChildren: 0.2,
        },
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.mergedAnimationConfig.titleDelay).toBe(0.5);
      expect(result.mergedAnimationConfig.staggerChildren).toBe(0.2);
      expect(result.mergedAnimationConfig.descriptionDelay).toBe(
        DEFAULT_ANIMATION_CONFIG.descriptionDelay
      );
    });

    it('handles hideBranding flag', () => {
      const customContent: LeftPanelContentConfig = {
        hideBranding: true,
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.hideBranding).toBe(true);
    });

    it('handles custom content className', () => {
      const customContent: LeftPanelContentConfig = {
        contentClassName: 'custom-class',
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.contentClassName).toBe('custom-class');
    });

    it('handles empty company name', () => {
      const result = getLeftPanelContent(undefined, undefined);
      expect(result.panelTitle).toBeDefined();
    });

    it('includes testimonials when provided', () => {
      const testimonials = [{ quote: 'Great product!', author: 'John Doe' }];

      const customContent: LeftPanelContentConfig = {
        testimonials,
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.testimonials).toEqual(testimonials);
    });

    it('includes statistics when provided', () => {
      const statistics = [{ value: '100+', label: 'Users' }];

      const customContent: LeftPanelContentConfig = {
        statistics,
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.statistics).toEqual(statistics);
    });

    it('includes customContent when provided', () => {
      const customContent: LeftPanelContentConfig = {
        customContent: 'Custom Content String' as any, // Using string instead of JSX for test
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.customContent).toBe('Custom Content String');
    });

    it('includes footerText when provided', () => {
      const customContent: LeftPanelContentConfig = {
        footerText: 'Custom Footer',
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.footerText).toBe('Custom Footer');
    });

    it('includes subtitle when provided', () => {
      const customContent: LeftPanelContentConfig = {
        subtitle: 'Custom Subtitle',
      };

      const result = getLeftPanelContent(customContent, companyName);
      expect(result.subtitle).toBe('Custom Subtitle');
    });
  });
});
