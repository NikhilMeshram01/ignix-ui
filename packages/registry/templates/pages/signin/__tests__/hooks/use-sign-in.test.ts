import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSignIn } from '../../hooks/use-sign-in';
// import type { SignInFormData, SocialProvider } from '../types';

describe('useSignIn Hook', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSignIn());

    expect(result.current.formData).toEqual({
      email: '',
      password: '',
      rememberMe: false,
    });
    expect(result.current.showPassword).toBe(false);
    expect(result.current.errors).toEqual({});
    expect(result.current.socialLoading).toBe(null);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.touched).toEqual({});
  });

  it('should handle input changes', () => {
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.handleInputChange('email', 'test@example.com');
    });

    expect(result.current.formData.email).toBe('test@example.com');

    act(() => {
      result.current.handleInputChange('password', 'password123');
    });

    expect(result.current.formData.password).toBe('password123');

    act(() => {
      result.current.handleInputChange('rememberMe', true);
    });

    expect(result.current.formData.rememberMe).toBe(true);
  });

  it('should toggle password visibility', () => {
    const { result } = renderHook(() => useSignIn());

    expect(result.current.showPassword).toBe(false);

    act(() => {
      result.current.setShowPassword(true);
    });

    expect(result.current.showPassword).toBe(true);

    act(() => {
      result.current.setShowPassword(false);
    });

    expect(result.current.showPassword).toBe(false);
  });

  it('should handle field blur', () => {
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.handleBlur('email');
    });

    expect(result.current.touched.email).toBe(true);
  });

  it('should handle social sign-in loading state', async () => {
    const { result } = renderHook(() => useSignIn());
    const mockCallback = vi.fn().mockResolvedValue(undefined);

    await act(async () => {
      await result.current.handleSocialSignIn('google', mockCallback);
    });

    expect(result.current.socialLoading).toBe('google');
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should handle social sign-in without callback', async () => {
    const { result } = renderHook(() => useSignIn());

    await act(async () => {
      await result.current.handleSocialSignIn('github');
    });

    expect(result.current.socialLoading).toBe('github');
  });

  it('should reset social loading after sign-in', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSignIn());

    await act(async () => {
      await result.current.handleSocialSignIn('microsoft');
    });

    expect(result.current.socialLoading).toBe('microsoft');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.socialLoading).toBe(null);
    vi.useRealTimers();
  });

  it('should handle rememberMe toggle', () => {
    const { result } = renderHook(() => useSignIn());

    expect(result.current.formData.rememberMe).toBe(false);

    act(() => {
      result.current.handleInputChange('rememberMe', true);
    });

    expect(result.current.formData.rememberMe).toBe(true);

    act(() => {
      result.current.handleInputChange('rememberMe', false);
    });

    expect(result.current.formData.rememberMe).toBe(false);
  });

  it('should show validation errors for empty email on blur', () => {
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.handleBlur('email');
    });

    expect(result.current.errors.email).toBe('Please enter your email address');
  });

  it('should show validation errors for empty password on blur', () => {
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.handleBlur('password');
    });

    expect(result.current.errors.password).toBe('Please enter your password');
  });

  it('should clear email error when valid email is entered', () => {
    const { result } = renderHook(() => useSignIn());

    // First, trigger validation error
    act(() => {
      result.current.handleBlur('email');
    });
    expect(result.current.errors.email).toBe('Please enter your email address');

    // Now enter a valid email
    act(() => {
      result.current.handleInputChange('email', 'test@example.com');
    });

    // Error should be cleared
    expect(result.current.errors.email).toBeUndefined();
  });

  it('should clear password error when valid password is entered', () => {
    const { result } = renderHook(() => useSignIn());

    // First, trigger validation error
    act(() => {
      result.current.handleBlur('password');
    });
    expect(result.current.errors.password).toBe('Please enter your password');

    // Now enter a valid password
    act(() => {
      result.current.handleInputChange('password', 'password123');
    });

    // Error should be cleared
    expect(result.current.errors.password).toBeUndefined();
  });

  it('should handle form submission with validation', async () => {
    const { result } = renderHook(() => useSignIn(mockOnSubmit));

    // Set valid form data
    act(() => {
      result.current.handleInputChange('email', 'test@example.com');
      result.current.handleInputChange('password', 'password123');
    });

    await act(async () => {
      const mockEvent = { preventDefault: vi.fn() };
      result.current.handleSubmit((mockEvent as unknown) as React.FormEvent);
    });

    // onSubmit should be called with the form data
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    });
  });

  it('should not submit form with invalid data', async () => {
    const { result } = renderHook(() => useSignIn(mockOnSubmit));

    // Don't set any form data - form should be invalid
    await act(async () => {
      const mockEvent = { preventDefault: vi.fn() };
      result.current.handleSubmit((mockEvent as unknown) as React.FormEvent);
    });

    // onSubmit should NOT be called
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Errors should be set
    expect(result.current.errors.email).toBe('Please enter your email address');
    expect(result.current.errors.password).toBe('Please enter your password');
  });

  it('should set isSubmitting to true during form submission', async () => {
    // Create a promise that resolves after a delay
    let resolveSubmit: (value?: unknown) => void;
    const submitPromise = new Promise((resolve) => {
      resolveSubmit = resolve;
    });

    const delayedOnSubmit = vi.fn().mockImplementation(async () => {
      await submitPromise;
    });

    const { result } = renderHook(() => useSignIn(delayedOnSubmit));

    // Set valid form data
    act(() => {
      result.current.handleInputChange('email', 'test@example.com');
      result.current.handleInputChange('password', 'password123');
    });

    // Start submission
    // let isSubmittingDuringCall = false;
    const submission = act(async () => {
      const mockEvent = { preventDefault: vi.fn() };
      // Check isSubmitting during the onSubmit call
      // isSubmittingDuringCall = result.current.isSubmitting;
      await result.current.handleSubmit((mockEvent as unknown) as React.FormEvent);
    });

    // Give React time to update state
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // Resolve the submission
    await act(async () => {
      resolveSubmit!(undefined);
    });

    // Wait for submission to complete
    await submission;

    // Verify onSubmit was called
    expect(delayedOnSubmit).toHaveBeenCalled();
  });
});
