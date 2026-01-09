import { describe, it, expect } from 'vitest';
import { containerVariants, cardVariants, getInputClasses } from '../variants';

describe('Variants Utilities', () => {
  describe('containerVariants', () => {
    it('returns correct classes for centered default variant', () => {
      const result = containerVariants({ type: 'centered', variant: 'default' });
      expect(result).toContain('min-h-screen flex items-center justify-center p-4');
      expect(result).toContain('bg-gradient-to-br from-blue-50 to-cyan-50');
    });

    it('returns correct classes for centered modern variant', () => {
      const result = containerVariants({ type: 'centered', variant: 'modern' });
      expect(result).toContain('min-h-screen flex items-center justify-center p-4');
      expect(result).toContain('bg-gradient-to-br from-slate-50 to-slate-100');
    });

    it('returns correct classes for centered glass variant', () => {
      const result = containerVariants({ type: 'centered', variant: 'glass' });
      expect(result).toContain('min-h-screen flex items-center justify-center p-4');
      expect(result).toContain('bg-gradient-to-br from-primary/10 to-secondary/10');
    });

    it('returns correct classes for centered dark variant', () => {
      const result = containerVariants({ type: 'centered', variant: 'dark' });
      expect(result).toContain('min-h-screen flex items-center justify-center p-4');
      expect(result).toContain('bg-gradient-to-br from-gray-900 to-gray-800');
    });

    it('returns correct classes for split default variant', () => {
      const result = containerVariants({ type: 'split', variant: 'default' });
      expect(result).toContain('min-h-screen flex');
      expect(result).toContain('bg-background');
    });

    it('returns correct classes for split modern variant', () => {
      const result = containerVariants({ type: 'split', variant: 'modern' });
      expect(result).toContain('min-h-screen flex');
      expect(result).toContain('bg-slate-50 dark:bg-slate-900');
    });

    it('returns correct classes for split glass variant', () => {
      const result = containerVariants({ type: 'split', variant: 'glass' });
      expect(result).toContain('min-h-screen flex');
      expect(result).toContain('bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800');
    });

    it('returns correct classes for split dark variant', () => {
      const result = containerVariants({ type: 'split', variant: 'dark' });
      expect(result).toContain('min-h-screen flex');
      expect(result).toContain('bg-gray-900');
    });

    it('uses default variants when none provided', () => {
      const result = containerVariants({});
      expect(result).toContain('min-h-screen flex items-center justify-center p-4');
    });
  });

  describe('cardVariants', () => {
    it('returns correct classes for centered default variant', () => {
      const result = cardVariants({ type: 'centered', variant: 'default' });
      expect(result).toContain('rounded-2xl shadow-2xl p-8 transition-all duration-300');
      expect(result).toContain('bg-white');
      expect(result).toContain('w-full max-w-md');
    });

    it('returns correct classes for centered modern variant', () => {
      const result = cardVariants({ type: 'centered', variant: 'modern' });
      expect(result).toContain('rounded-2xl shadow-2xl p-8 transition-all duration-300');
      expect(result).toContain('bg-white/95 backdrop-blur-sm border border-slate-200');
      expect(result).toContain('w-full max-w-md');
    });

    it('returns correct classes for centered glass variant', () => {
      const result = cardVariants({ type: 'centered', variant: 'glass' });
      expect(result).toContain('rounded-2xl shadow-2xl p-8 transition-all duration-300');
      expect(result).toContain('bg-white/10 backdrop-blur-lg border border-white/20');
      expect(result).toContain('w-full max-w-md');
    });

    it('returns correct classes for centered dark variant', () => {
      const result = cardVariants({ type: 'centered', variant: 'dark' });
      expect(result).toContain('rounded-2xl shadow-2xl p-8 transition-all duration-300');
      expect(result).toContain('bg-gray-800');
      expect(result).toContain('w-full max-w-md');
    });

    it('returns correct classes for split default variant', () => {
      const result = cardVariants({ type: 'split', variant: 'default' });
      expect(result).toContain('rounded-2xl shadow-2xl p-8 transition-all duration-300');
      expect(result).toContain('bg-white');
      expect(result).toContain('w-full max-w-md bg-card rounded-xl');
    });

    it('returns correct classes for split modern variant', () => {
      const result = cardVariants({ type: 'split', variant: 'modern' });
      expect(result).toContain('rounded-2xl shadow-2xl p-8 transition-all duration-300');
      expect(result).toContain('bg-white/95 backdrop-blur-sm dark:bg-slate-900/95');
      expect(result).toContain('w-full max-w-md bg-card rounded-xl');
    });

    it('returns correct classes for split dark variant', () => {
      const result = cardVariants({ type: 'split', variant: 'dark' });
      expect(result).toContain('rounded-2xl shadow-2xl p-8 transition-all duration-300');
      expect(result).toContain('bg-gray-900');
      expect(result).toContain('w-full max-w-md bg-card rounded-xl');
    });
  });

  describe('getInputClasses', () => {
    it('returns correct classes for default variant without error', () => {
      const result = getInputClasses('default', false);
      expect(result).toContain('w-full px-4 py-3 rounded-lg border transition-all duration-300');
      expect(result).toContain('bg-white text-gray-900 border-gray-300 focus:ring-blue-500');
      expect(result).not.toContain('border-red-500');
    });

    it('returns correct classes for default variant with error', () => {
      const result = getInputClasses('default', true);
      expect(result).toContain('border-red-500');
    });

    it('returns correct classes for modern variant without error', () => {
      const result = getInputClasses('modern', false);
      expect(result).toContain('bg-white/80 backdrop-blur-sm text-gray-900 border-slate-200');
      expect(result).not.toContain('border-red-500');
    });

    it('returns correct classes for modern variant with error', () => {
      const result = getInputClasses('modern', true);
      expect(result).toContain('border-red-500');
    });

    it('returns correct classes for glass variant without error', () => {
      const result = getInputClasses('glass', false);
      expect(result).toContain('bg-white/5 backdrop-blur-md text-white border-white/10');
      expect(result).not.toContain('border-red-400');
    });

    it('returns correct classes for glass variant with error', () => {
      const result = getInputClasses('glass', true);
      expect(result).toContain('border-red-400');
    });

    it('returns correct classes for dark variant without error', () => {
      const result = getInputClasses('dark', false);
      expect(result).toContain('bg-gray-700 text-white border-gray-600 focus:ring-blue-500');
      expect(result).not.toContain('border-red-500');
    });

    it('returns correct classes for dark variant with error', () => {
      const result = getInputClasses('dark', true);
      expect(result).toContain('border-red-500');
    });

    it('returns default variant classes for unknown variant', () => {
      const result = getInputClasses('unknown', false);
      expect(result).toContain('bg-white text-gray-900 border-gray-300');
    });

    it('includes base styles in all variants', () => {
      const variants = ['default', 'modern', 'glass', 'dark'];
      variants.forEach(variant => {
        const result = getInputClasses(variant, false);
        expect(result).toContain('w-full px-4 py-3 rounded-lg border transition-all duration-300');
        expect(result).toContain('placeholder-gray-400 focus:ring-2 focus:border-transparent');
      });
    });
  });
});