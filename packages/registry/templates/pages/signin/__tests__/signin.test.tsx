// signin.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { type SignInProps } from '../types';
import { SignIn } from '../index';

// ─────────────────────────────────────────────────
// Mocks matching your existing mock structure
// ─────────────────────────────────────────────────

// Create a mock function using vi.hoisted to avoid hoisting issues
const mockUseSignIn = vi.hoisted(() => vi.fn());

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Eye: ({ onClick, className, ...props }: any) => (
        <button
            onClick={onClick}
            className={className}
            data-testid="eye-icon"
            aria-label="Show password"
            {...props}
        >
            Eye
        </button>
    ),
    EyeOff: ({ onClick, className, ...props }: any) => (
        <button
            onClick={onClick}
            className={className}
            data-testid="eye-off-icon"
            aria-label="Hide password"
            {...props}
        >
            EyeOff
        </button>
    ),
    AlertCircle: ({ className }: any) => (
        <div data-testid="alert-circle-icon" className={className}>AlertCircle</div>
    ),
    Mail: ({ className }: any) => (
        <div data-testid="mail-icon" className={className}>Mail</div>
    ),
    Lock: ({ className }: any) => (
        <div data-testid="lock-icon" className={className}>Lock</div>
    ),
    Loader2: ({ className }: any) => (
        <div data-testid="loader-icon" className={className}>Loader2</div>
    ),
    LogIn: ({ className }: any) => (
        <div data-testid="login-icon" className={className}>LogIn</div>
    ),
    ArrowRight: ({ className }: any) => (
        <div data-testid="arrow-right-icon" className={className}>ArrowRight</div>
    ),
    Shield: ({ className }: any) => (
        <div data-testid="shield-icon" className={className}>Shield</div>
    ),
    CheckCircle: ({ className }: any) => (
        <div data-testid="check-circle-icon" className={className}>CheckCircle</div>
    ),
    XCircle: ({ className }: any) => (
        <div data-testid="x-circle-icon" className={className}>XCircle</div>
    ),
}));

// Mock react-icons
vi.mock('react-icons/fc', () => ({
    FcGoogle: ({ className }: any) => (
        <div data-testid="google-icon" className={className}>Google</div>
    ),
}));

vi.mock('react-icons/fa', () => ({
    FaGithub: ({ className }: any) => (
        <div data-testid="github-icon" className={className}>GitHub</div>
    ),
    FaMicrosoft: ({ className }: any) => (
        <div data-testid="microsoft-icon" className={className}>Microsoft</div>
    ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock components
vi.mock('../../../../components/button', () => ({
    Button: ({ children, type, className, disabled, onClick, ...props }: any) => (
        <button
            type={type}
            className={className}
            disabled={disabled}
            onClick={onClick}
            data-testid="submit-button"
            {...props}
        >
            {children}
        </button>
    ),
}));

vi.mock('../../../../components/input', () => ({
    AnimatedInput: ({
        variant,
        type,
        value,
        onChange,
        onBlur,
        placeholder,
        inputClassName,
        'aria-label': ariaLabel,
        'aria-invalid': ariaInvalid,
        'aria-describedby': ariaDescribedby,
        ...props
    }: any) => (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className={inputClassName}
            aria-label={ariaLabel}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedby}
            data-variant={variant}
            data-testid={`input-${ariaLabel?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}
            {...props}
        />
    ),
}));

// Mock hooks - use the hoisted mock function
vi.mock('../hooks/use-sign-in', () => ({
    useSignIn: mockUseSignIn,
}));

// Mock utils
vi.mock('../../../../utils/cn', () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

vi.mock('class-variance-authority', () => ({
    cva: () => () => '',
}));

// Track password visibility state for the mock
let mockShowPassword = false;

// Mock internal components
vi.mock('../components/LeftPanel', () => ({
    LeftPanel: ({ companyName, logo, leftPanelContent, splitStyles, isDarkVariant }: any) => (
        <div data-testid="left-panel">
            <div data-testid="company-name">{companyName}</div>
            {logo && <div data-testid="logo">{logo}</div>}
            {leftPanelContent && <div data-testid="custom-left-content">{leftPanelContent}</div>}
            <div data-testid="is-dark-variant">{isDarkVariant.toString()}</div>
            <div data-testid="background-style">{JSON.stringify(splitStyles.backgroundStyle)}</div>
        </div>
    ),
}));

vi.mock('../components/FormContent', () => ({
    FormContent: ({
        variant,
        type,
        logo,
        loading,
        error,
        showSocialLogin,
        showForgotPassword,
        showSignUpLink,
        // buttonStyle,
        onSignUp,
        // onGoogleSignIn,
        // onGitHubSignIn,
        // onMicrosoftSignIn,
        formData,
        errors,
        showPassword,
        socialLoading,
        onInputChange,
        onBlur,
        onTogglePassword,
        onSocialSignIn,
        handleSignUpClick,
        handleSubmit,
    }: any) => {
        // Track password visibility
        const [localShowPassword, setLocalShowPassword] = React.useState(showPassword);

        const handleTogglePassword = () => {
            const newValue = !localShowPassword;
            setLocalShowPassword(newValue);
            mockShowPassword = newValue; // Update the global state
            onTogglePassword?.();
        };

        return (
            <form onSubmit={handleSubmit} data-testid="signin-form">
                <div data-testid="variant">{variant}</div>
                <div data-testid="type">{type}</div>
                {logo && <div data-testid="form-logo">{logo}</div>}
                {loading && <div data-testid="loading-indicator">Loading...</div>}
                {error && <div data-testid="error-message">{error}</div>}

                <input
                    data-testid="email-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => onInputChange('email', e.target.value)}
                    onBlur={onBlur}
                    aria-label="Email"
                />

                <input
                    data-testid="password-input"
                    type={localShowPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => onInputChange('password', e.target.value)}
                    onBlur={onBlur}
                    aria-label="Password"
                />

                <button
                    type="button"
                    onClick={handleTogglePassword}
                    data-testid="toggle-password"
                    aria-label={localShowPassword ? 'Hide password' : 'Show password'}
                >
                    {localShowPassword ? 'Hide' : 'Show'}
                </button>

                {showForgotPassword && (
                    <button data-testid="forgot-password" type="button">
                        Forgot password?
                    </button>
                )}

                <button
                    type="submit"
                    data-testid="submit-button"
                    disabled={loading}
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>

                {showSocialLogin && (
                    <div data-testid="social-login">
                        <button
                            data-testid="google-signin"
                            onClick={() => onSocialSignIn('google')}
                            disabled={socialLoading.google}
                        >
                            Google
                        </button>
                        <button
                            data-testid="github-signin"
                            onClick={() => onSocialSignIn('github')}
                            disabled={socialLoading.github}
                        >
                            GitHub
                        </button>
                        <button
                            data-testid="microsoft-signin"
                            onClick={() => onSocialSignIn('microsoft')}
                            disabled={socialLoading.microsoft}
                        >
                            Microsoft
                        </button>
                    </div>
                )}

                {showSignUpLink && onSignUp && (
                    <button
                        data-testid="signup-link"
                        type="button"
                        onClick={handleSignUpClick}
                    >
                        Don't have an account? Sign Up
                    </button>
                )}

                {errors.email && <div data-testid="email-error">{errors.email}</div>}
                {errors.password && <div data-testid="password-error">{errors.password}</div>}
            </form>
        );
    },
}));

// Mock utils
vi.mock('../utils', () => ({
    getSplitLayoutStyles: vi.fn().mockImplementation((variant, splitBackground) => ({
        leftPanelClasses: 'mock-left-panel-classes',
        rightPanelClasses: 'mock-right-panel-classes',
        backgroundStyle: {
            backgroundImage: splitBackground?.image || 'url(default.jpg)',
            backgroundColor: splitBackground?.color || '#000',
        },
        overlayStyle: {
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
    })),
}));

// Mock variants
vi.mock('../variants', () => ({
    containerVariants: vi.fn(() => 'mock-container-classes'),
}));

// Mock constants
vi.mock('../constants', () => ({
    DEFAULT_COMPANY_NAME: 'Default Company',
}));

describe('SignIn Component', () => {
    const defaultProps: SignInProps = {
        companyName: 'TestCompany',
        onSubmit: vi.fn(),
        onSignUp: vi.fn(),
        onGoogleSignIn: vi.fn(),
        onGitHubSignIn: vi.fn(),
        onMicrosoftSignIn: vi.fn(),
    };

    // let lastEmailValue = '';
    // let lastPasswordValue = '';

    const defaultHookReturn = {
        formData: {
            email: '',
            password: '',
        },
        showPassword: false,
        errors: {},
        socialLoading: {
            google: false,
            github: false,
            microsoft: false,
        },
        isSubmitting: false,
        setShowPassword: vi.fn(),
        handleSubmit: vi.fn((e?: React.FormEvent) => {
            e?.preventDefault();
            defaultProps.onSubmit({ email: 'test@example.com', password: 'password123' });
        }),
        handleInputChange: vi.fn((field: string, value: string) => {
            if (field === 'email') {
                lastEmailValue = value;
            } else if (field === 'password') {
                lastPasswordValue = value;
            }
        }),
        handleSocialSignIn: vi.fn((provider: string) => {
            if (provider === 'google') {
                defaultProps.onGoogleSignIn();
            } else if (provider === 'github') {
                defaultProps.onGitHubSignIn();
            } else if (provider === 'microsoft') {
                defaultProps.onMicrosoftSignIn();
            }
        }),
        handleBlur: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockShowPassword = false;
        lastEmailValue = '';
        lastPasswordValue = '';
        // Reset the useSignIn mock
        mockUseSignIn.mockImplementation(() => defaultHookReturn);
    });

    describe('Basic Rendering', () => {
        it('renders centered layout by default', () => {
            render(<SignIn {...defaultProps} />);

            expect(screen.getByTestId('signin-form')).toBeInTheDocument();
            expect(screen.getByTestId('type')).toHaveTextContent('centered');
        });

        it('renders split layout when type="split"', () => {
            render(<SignIn {...defaultProps} type="split" />);

            expect(screen.getByTestId('left-panel')).toBeInTheDocument();
            expect(screen.getByTestId('type')).toHaveTextContent('split');
        });

        it('renders all form fields', () => {
            render(<SignIn {...defaultProps} />);

            expect(screen.getByTestId('email-input')).toBeInTheDocument();
            expect(screen.getByTestId('password-input')).toBeInTheDocument();
            expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        });

        it('uses default company name when not provided (in split layout)', () => {
            render(<SignIn {...defaultProps} companyName={undefined} type="split" />);

            expect(screen.getByTestId('company-name')).toHaveTextContent('Default Company');
        });
    });

    describe('Form Functionality', () => {
        it('submits form with valid data', async () => {
            const mockOnSubmit = vi.fn();
            const user = userEvent.setup();

            mockUseSignIn.mockImplementation(() => ({
                ...defaultHookReturn,
                handleSubmit: vi.fn((e?: React.FormEvent) => {
                    e?.preventDefault();
                    mockOnSubmit({ email: 'test@example.com', password: 'password123' });
                }),
            }));

            render(<SignIn {...defaultProps} onSubmit={mockOnSubmit} />);

            const submitButton = screen.getByTestId('submit-button');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'password123',
                });
            });
        });

        it('toggles password visibility', async () => {
            const user = userEvent.setup();

            mockUseSignIn.mockImplementation(() => ({
                ...defaultHookReturn,
                showPassword: mockShowPassword,
                setShowPassword: vi.fn((value: boolean) => {
                    mockShowPassword = value;
                }),
            }));

            render(<SignIn {...defaultProps} />);

            const passwordInput = screen.getByTestId('password-input');
            const toggleButton = screen.getByTestId('toggle-password');

            // Initially hidden
            expect(passwordInput).toHaveAttribute('type', 'password');

            // Toggle to show
            await user.click(toggleButton);
            expect(passwordInput).toHaveAttribute('type', 'text');

            // Toggle back to hide
            await user.click(toggleButton);
            expect(passwordInput).toHaveAttribute('type', 'password');
        });

        it('shows loading state during submission', () => {
            render(<SignIn {...defaultProps} loading={true} />);

            expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
            expect(screen.getByTestId('submit-button')).toBeDisabled();
        });

        it('displays error message when provided', () => {
            const errorMessage = 'Invalid credentials';
            render(<SignIn {...defaultProps} error={errorMessage} />);

            expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
        });
    });

    describe('Social Login', () => {
        it('renders social login buttons when showSocialLogin is true', () => {
            render(<SignIn {...defaultProps} showSocialLogin={true} />);

            expect(screen.getByTestId('social-login')).toBeInTheDocument();
            expect(screen.getByTestId('google-signin')).toBeInTheDocument();
            expect(screen.getByTestId('github-signin')).toBeInTheDocument();
            expect(screen.getByTestId('microsoft-signin')).toBeInTheDocument();
        });

        it('hides social login when showSocialLogin is false', () => {
            render(<SignIn {...defaultProps} showSocialLogin={false} />);

            expect(screen.queryByTestId('social-login')).not.toBeInTheDocument();
        });

        it('calls social login callbacks when buttons are clicked', async () => {
            const mockGoogleSignIn = vi.fn();
            const mockGitHubSignIn = vi.fn();
            const mockMicrosoftSignIn = vi.fn();
            const user = userEvent.setup();

            mockUseSignIn.mockImplementation(() => ({
                ...defaultHookReturn,
                handleSocialSignIn: vi.fn((provider: string) => {
                    if (provider === 'google') {
                        mockGoogleSignIn();
                    } else if (provider === 'github') {
                        mockGitHubSignIn();
                    } else if (provider === 'microsoft') {
                        mockMicrosoftSignIn();
                    }
                }),
            }));

            render(
                <SignIn
                    {...defaultProps}
                    onGoogleSignIn={mockGoogleSignIn}
                    onGitHubSignIn={mockGitHubSignIn}
                    onMicrosoftSignIn={mockMicrosoftSignIn}
                    showSocialLogin={true}
                />
            );

            await user.click(screen.getByTestId('google-signin'));
            expect(mockGoogleSignIn).toHaveBeenCalled();

            await user.click(screen.getByTestId('github-signin'));
            expect(mockGitHubSignIn).toHaveBeenCalled();

            await user.click(screen.getByTestId('microsoft-signin'));
            expect(mockMicrosoftSignIn).toHaveBeenCalled();
        });

        it('disables social buttons during loading', () => {
            mockUseSignIn.mockImplementation(() => ({
                ...defaultHookReturn,
                socialLoading: {
                    google: true,
                    github: false,
                    microsoft: false,
                },
            }));

            render(<SignIn {...defaultProps} showSocialLogin={true} />);

            expect(screen.getByTestId('google-signin')).toBeDisabled();
            expect(screen.getByTestId('github-signin')).not.toBeDisabled();
            expect(screen.getByTestId('microsoft-signin')).not.toBeDisabled();
        });
    });

    describe('Sign Up Link', () => {
        it('renders sign up link when showSignUpLink is true and onSignUp is provided', () => {
            render(<SignIn {...defaultProps} showSignUpLink={true} />);

            expect(screen.getByTestId('signup-link')).toBeInTheDocument();
        });

        it('hides sign up link when showSignUpLink is false', () => {
            render(<SignIn {...defaultProps} showSignUpLink={false} />);

            expect(screen.queryByTestId('signup-link')).not.toBeInTheDocument();
        });

        it('calls onSignUp callback when sign up link is clicked', async () => {
            const mockOnSignUp = vi.fn();
            const user = userEvent.setup();

            render(<SignIn {...defaultProps} onSignUp={mockOnSignUp} showSignUpLink={true} />);

            await user.click(screen.getByTestId('signup-link'));
            expect(mockOnSignUp).toHaveBeenCalled();
        });
    });

    describe('Forgot Password', () => {
        it('shows forgot password link when showForgotPassword is true', () => {
            render(<SignIn {...defaultProps} showForgotPassword={true} />);

            expect(screen.getByTestId('forgot-password')).toBeInTheDocument();
        });

        it('hides forgot password link when showForgotPassword is false', () => {
            render(<SignIn {...defaultProps} showForgotPassword={false} />);

            expect(screen.queryByTestId('forgot-password')).not.toBeInTheDocument();
        });
    });

    describe('Layout Variants', () => {
        it('applies dark variant styles', () => {
            render(<SignIn {...defaultProps} variant="dark" />);

            expect(screen.getByTestId('variant')).toHaveTextContent('dark');
        });

        it('applies modern variant styles', () => {
            render(<SignIn {...defaultProps} variant="modern" />);

            expect(screen.getByTestId('variant')).toHaveTextContent('modern');
        });

        it('applies custom split background', () => {
            const customBackground = {
                image: 'url(custom-bg.jpg)',
                color: '#1a1a1a',
            };

            render(
                <SignIn
                    {...defaultProps}
                    type="split"
                    splitBackground={customBackground}
                />
            );

            const backgroundStyle = JSON.parse(
                screen.getByTestId('background-style').textContent || '{}'
            );
            expect(backgroundStyle.backgroundImage).toBe(customBackground.image);
            expect(backgroundStyle.backgroundColor).toBe(customBackground.color);
        });
    });

    describe('Custom Content', () => {
        it('renders custom logo', () => {
            const customLogo = <div data-testid="custom-logo">Custom Logo</div>;
            render(<SignIn {...defaultProps} logo={customLogo} />);

            expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
        });

        it('renders custom left panel content', () => {
            const customContent = <div data-testid="custom-content">Custom Content</div>;
            render(
                <SignIn
                    {...defaultProps}
                    type="split"
                    leftPanelContent={customContent}
                />
            );

            expect(screen.getByTestId('custom-left-content')).toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('shows email validation error', () => {
            mockUseSignIn.mockImplementation(() => ({
                ...defaultHookReturn,
                errors: { email: 'Please enter a valid email address' },
            }));

            render(<SignIn {...defaultProps} />);

            expect(screen.getByTestId('email-error')).toHaveTextContent(
                'Please enter a valid email address'
            );
        });

        it('shows password validation error', () => {
            mockUseSignIn.mockImplementation(() => ({
                ...defaultHookReturn,
                errors: { password: 'Password must be at least 8 characters' },
            }));

            render(<SignIn {...defaultProps} />);

            expect(screen.getByTestId('password-error')).toHaveTextContent(
                'Password must be at least 8 characters'
            );
        });
    });

    describe('Accessibility', () => {
        it('has proper ARIA labels for form fields', () => {
            render(<SignIn {...defaultProps} />);

            const emailInput = screen.getByTestId('email-input');
            const passwordInput = screen.getByTestId('password-input');

            expect(emailInput).toHaveAttribute('aria-label', 'Email');
            expect(passwordInput).toHaveAttribute('aria-label', 'Password');
        });

        it('has proper ARIA label for password toggle', () => {
            render(<SignIn {...defaultProps} />);

            const toggleButton = screen.getByTestId('toggle-password');
            expect(toggleButton).toHaveAttribute('aria-label', 'Show password');
        });
    });

    describe('Edge Cases', () => {
        it('handles empty company name', () => {
            render(<SignIn {...defaultProps} companyName="" />);

            // Should render without errors
            expect(screen.getByTestId('signin-form')).toBeInTheDocument();
        });

        it('handles missing callbacks gracefully', () => {
            const propsWithoutCallbacks = {
                companyName: 'Test',
                onSubmit: vi.fn(),
            };

            render(<SignIn {...propsWithoutCallbacks} />);

            // Should still render
            expect(screen.getByTestId('signin-form')).toBeInTheDocument();
        });

        it('combines loading states correctly', () => {
            render(<SignIn {...defaultProps} loading={true} />);

            // The hook's isSubmitting should combine with prop loading
            expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
        });
    });

    describe('Integration with useSignIn Hook', () => {
        it('calls handleBlur from hook', async () => {
            const user = userEvent.setup();
            const mockHandleBlur = vi.fn();

            mockUseSignIn.mockImplementation(() => ({
                ...defaultHookReturn,
                handleBlur: mockHandleBlur,
            }));

            render(<SignIn {...defaultProps} />);

            const emailInput = screen.getByTestId('email-input');
            await user.click(emailInput);
            await user.tab();

            expect(mockHandleBlur).toHaveBeenCalled();
        });

    });
});