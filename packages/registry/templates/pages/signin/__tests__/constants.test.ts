import { describe, it, expect } from 'vitest';
import {
  DEFAULT_FEATURES,
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_BUTTON_STYLES,
  DEFAULT_COMPANY_NAME,
} from '../constants';

describe('Constants', () => {
  describe('DEFAULT_FEATURES', () => {
    it('should contain 4 feature items', () => {
      expect(DEFAULT_FEATURES).toHaveLength(4);
    });

    it('should have enterprise-grade security feature', () => {
      const securityFeature = DEFAULT_FEATURES[0];
      expect(securityFeature.text).toBe('Enterprise-grade security & encryption');
      expect(securityFeature.icon).toBeDefined();
      expect(securityFeature.iconColor).toBe('text-blue-400');
      expect(securityFeature.textClassName).toBe('font-semibold text-white/95');
    });

    it('should have performance feature', () => {
      const performanceFeature = DEFAULT_FEATURES[1];
      expect(performanceFeature.text).toBe('Lightning-fast performance');
      expect(performanceFeature.icon).toBeDefined();
      expect(performanceFeature.iconColor).toBe('text-yellow-400');
      expect(performanceFeature.textClassName).toBe('font-semibold text-white/95');
    });

    it('should have collaboration feature', () => {
      const collaborationFeature = DEFAULT_FEATURES[2];
      expect(collaborationFeature.text).toBe('Seamless team collaboration');
      expect(collaborationFeature.icon).toBeDefined();
      expect(collaborationFeature.iconColor).toBe('text-green-400');
      expect(collaborationFeature.textClassName).toBe('font-semibold text-white/95');
    });

    it('should have availability feature', () => {
      const availabilityFeature = DEFAULT_FEATURES[3];
      expect(availabilityFeature.text).toBe('Global availability');
      expect(availabilityFeature.icon).toBeDefined();
      expect(availabilityFeature.iconColor).toBe('text-purple-400');
      expect(availabilityFeature.textClassName).toBe('font-semibold text-white/95');
    });
  });

  describe('DEFAULT_ANIMATION_CONFIG', () => {
    it('should have correct animation delays', () => {
      expect(DEFAULT_ANIMATION_CONFIG).toEqual({
        titleDelay: 0.2,
        descriptionDelay: 0.3,
        featuresDelay: 0.4,
        staggerChildren: 0.1,
      });
    });

    it('should have numeric delay values', () => {
      expect(typeof DEFAULT_ANIMATION_CONFIG.titleDelay).toBe('number');
      expect(typeof DEFAULT_ANIMATION_CONFIG.descriptionDelay).toBe('number');
      expect(typeof DEFAULT_ANIMATION_CONFIG.featuresDelay).toBe('number');
      expect(typeof DEFAULT_ANIMATION_CONFIG.staggerChildren).toBe('number');
    });

    it('should have positive delay values', () => {
      expect(DEFAULT_ANIMATION_CONFIG.titleDelay).toBeGreaterThan(0);
      expect(DEFAULT_ANIMATION_CONFIG.descriptionDelay).toBeGreaterThan(0);
      expect(DEFAULT_ANIMATION_CONFIG.featuresDelay).toBeGreaterThan(0);
      expect(DEFAULT_ANIMATION_CONFIG.staggerChildren).toBeGreaterThan(0);
    });
  });

  describe('DEFAULT_BUTTON_STYLES', () => {
    it('should have correct gradient styles', () => {
      expect(DEFAULT_BUTTON_STYLES).toEqual({
        gradient: 'bg-gradient-to-r from-blue-600 to-blue-700',
        hoverGradient: 'hover:from-blue-700 hover:to-blue-800',
        textColor: 'text-white',
        shadow: 'shadow-lg',
        hoverShadow: 'hover:shadow-xl',
        className: '',
      });
    });

    it('should have valid gradient class names', () => {
      expect(DEFAULT_BUTTON_STYLES.gradient).toContain('bg-gradient-to-r');
      expect(DEFAULT_BUTTON_STYLES.hoverGradient).toContain('hover:from');
      expect(DEFAULT_BUTTON_STYLES.hoverGradient).toContain('hover:to');
    });

    it('should have proper text color class', () => {
      expect(DEFAULT_BUTTON_STYLES.textColor).toBe('text-white');
    });

    it('should have shadow classes', () => {
      expect(DEFAULT_BUTTON_STYLES.shadow).toBe('shadow-lg');
      expect(DEFAULT_BUTTON_STYLES.hoverShadow).toBe('hover:shadow-xl');
    });

    it('should have empty className by default', () => {
      expect(DEFAULT_BUTTON_STYLES.className).toBe('');
    });
  });

  describe('DEFAULT_COMPANY_NAME', () => {
    it('should be "YourBrand"', () => {
      expect(DEFAULT_COMPANY_NAME).toBe('YourBrand');
    });

    it('should be a string', () => {
      expect(typeof DEFAULT_COMPANY_NAME).toBe('string');
    });

    it('should not be empty', () => {
      expect(DEFAULT_COMPANY_NAME.length).toBeGreaterThan(0);
    });
  });
});