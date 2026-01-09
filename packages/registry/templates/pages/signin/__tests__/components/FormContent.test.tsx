import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { FormContent } from '../../components/FormContent';
import type { FormContentProps, SignInFormData } from '../../types';

// Mock dependencies
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react with all required icons
vi.mock('lucide-react', () => ({
    AlertCircle: ({ className }: any) => <div data-testid="alert-circle" className={className}>AlertCircle</div>,
    Mail: ({ className }: any) => <div data-testid="mail-icon" className={className}>Mail</div>,
    Lock: ({ className }: any) => <div data-testid="lock-icon" className={className}>Lock</div>,
    Shield: ({ className }: any) => <div data-testid="shield-icon" className={className}>Shield</div>,
    ShieldCheck: ({ className }: any) => <div data-testid="shield-check-icon" className={className}>ShieldCheck</div>,
    Zap: ({ className }: any) => <div data-testid="zap-icon" className={className}>Zap</div>,
    Users: ({ className }: any) => <div data-testid="users-icon" className={className}>Users</div>,
    Globe: ({ className }: any) => <div data-testid="globe-icon" className={className}>Globe</div>,
    LogIn: ({ className }: any) => <div data-testid="login-icon" className={className}>LogIn</div>,
    Loader2: ({ className }: any) => <div data-testid="loader-icon" className={className}>Loader2</div>,
    Eye: ({ className }: any) => <div data-testid="eye-icon" className={className}>Eye</div>,
    EyeOff: ({ className }: any) => <div data-testid="eye-off-icon" className={className}>EyeOff</div>,
}));

vi.mock('../../../../../utils/cn', () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

vi.mock('@ignix-ui/button', () => ({
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

vi.mock('@ignix-ui/input', () => ({
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

// Mock SocialButtons component
vi.mock('../../components/SocialButtons', () => ({
    SocialButtons: ({
        onGoogleSignIn,
        onGitHubSignIn,
        onMicrosoftSignIn,
        loading,
        // isDarkVariant,
        className
    }: any) => (
        <div data-testid="social-buttons" className={className}>
            <button
                data-testid="google-button"
                onClick={onGoogleSignIn}
                disabled={loading === 'google'}
            >
                Google
            </button>
            <button
                data-testid="github-button"
                onClick={onGitHubSignIn}
                disabled={loading === 'github'}
            >
                GitHub
            </button>
            <button
                data-testid="microsoft-button"
                onClick={onMicrosoftSignIn}
                disabled={loading === 'microsoft'}
            >
                Microsoft
            </button>
        </div>
    ),
}));

// Mock variants
vi.mock('../../variants', () => ({
    cardVariants: vi.fn(() => 'card-classes'),
    getInputClasses: vi.fn(() => 'input-classes'),
}));

// Mock utils
vi.mock('../../utils', () => ({
    getButtonStyles: vi.fn(() => ({
        gradient: 'test-gradient',
        hoverGradient: 'test-hover-gradient',
        textColor: 'test-text-color',
        shadow: 'test-shadow',
        hoverShadow: 'test-hover-shadow',
        className: '',
    })),
}));

describe('FormContent Component', () => {
    const defaultFormData: SignInFormData = {
        email: '',
        password: '',
        rememberMe: false,
    };

    const defaultProps: FormContentProps = {
        variant: 'default',
        type: 'centered',
        formData: defaultFormData,
        errors: {},
        showPassword: false,
        socialLoading: null,
        onInputChange: vi.fn(),
        onBlur: vi.fn(),
        onTogglePassword: vi.fn(),
        onSocialSignIn: vi.fn(),
        handleSignUpClick: vi.fn(),
        handleSubmit: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic Rendering', () => {

        it('renders default logo when no logo prop provided', () => {
            render(<FormContent {...defaultProps} />);
            expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
        });

        it('renders custom logo when provided', () => {
            const customLogo = <div data-testid="custom-logo">Custom Logo</div>;
            render(<FormContent {...defaultProps} logo={customLogo} />);
            expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
        });

        it('applies dark variant styles', () => {
            render(<FormContent {...defaultProps} variant="dark" />);
            // Check that dark variant classes are applied by checking text color
            const title = screen.getByText('Sign In to Your Account');
            expect(title).toHaveClass('text-white');
        });
    });

    describe('Form Fields', () => {
        it('renders email field with correct attributes', () => {
            render(<FormContent {...defaultProps} />);

            const emailInput = screen.getByTestId('input-email-address');
            expect(emailInput).toBeInTheDocument();
            expect(emailInput).toHaveAttribute('placeholder', 'you@example.com');
            expect(emailInput).toHaveAttribute('aria-label', 'Email address');
            expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
        });

        it('renders password field with correct attributes', () => {
            render(<FormContent {...defaultProps} />);

            const passwordInput = screen.getByTestId('input-password');
            expect(passwordInput).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');
            expect(passwordInput).toHaveAttribute('type', 'password');
            expect(passwordInput).toHaveAttribute('aria-label', 'Password');
            expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
        });

        it('shows password when showPassword is true', () => {
            render(<FormContent {...defaultProps} showPassword={true} />);

            const passwordInput = screen.getByTestId('input-password');
            expect(passwordInput).toHaveAttribute('type', 'text');
        });

        it('hides password when showPassword is false', () => {
            render(<FormContent {...defaultProps} showPassword={false} />);

            const passwordInput = screen.getByTestId('input-password');
            expect(passwordInput).toHaveAttribute('type', 'password');
        });

        it('renders remember me checkbox', () => {
            render(<FormContent {...defaultProps} />);

            const rememberMeCheckbox = screen.getByLabelText('Remember me');
            expect(rememberMeCheckbox).toBeInTheDocument();
            expect(rememberMeCheckbox).toHaveAttribute('type', 'checkbox');
        });
    });

    describe('Form Interaction', () => {

        it('calls onInputChange when remember me is toggled', async () => {
            const mockOnInputChange = vi.fn();
            const user = userEvent.setup();

            render(<FormContent {...defaultProps} onInputChange={mockOnInputChange} />);

            const rememberMeCheckbox = screen.getByLabelText('Remember me');
            await user.click(rememberMeCheckbox);

            expect(mockOnInputChange).toHaveBeenCalledWith('rememberMe', true);
        });

        it('calls onTogglePassword when password toggle is clicked', async () => {
            const mockOnTogglePassword = vi.fn();
            const user = userEvent.setup();

            render(<FormContent {...defaultProps} onTogglePassword={mockOnTogglePassword} />);

            const passwordToggle = screen.getByRole('button', { name: /show password|hide password/i });
            await user.click(passwordToggle);

            expect(mockOnTogglePassword).toHaveBeenCalled();
        });

        it('calls onBlur when email field loses focus', async () => {
            const mockOnBlur = vi.fn();
            const user = userEvent.setup();

            render(<FormContent {...defaultProps} onBlur={mockOnBlur} />);

            const emailInput = screen.getByTestId('input-email-address');
            await user.click(emailInput);
            await user.tab();

            expect(mockOnBlur).toHaveBeenCalledWith('email');
        });

        it('calls onBlur when password field loses focus', async () => {
            const mockOnBlur = vi.fn();
            const user = userEvent.setup();

            render(<FormContent {...defaultProps} onBlur={mockOnBlur} />);

            const passwordInput = screen.getByTestId('input-password');
            await user.click(passwordInput);
            await user.tab();

            expect(mockOnBlur).toHaveBeenCalledWith('password');
        });
    });

    describe('Error Handling', () => {
        it('displays email error when present', () => {
            const errors = { email: 'Please enter a valid email address' };
            render(<FormContent {...defaultProps} errors={errors} />);

            expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        });

        it('displays password error when present', () => {
            const errors = { password: 'Password must be at least 8 characters' };
            render(<FormContent {...defaultProps} errors={errors} />);

            expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
        });

        it('displays both email and password errors', () => {
            const errors = {
                email: 'Invalid email',
                password: 'Invalid password',
            };
            render(<FormContent {...defaultProps} errors={errors} />);

            expect(screen.getByText('Invalid email')).toBeInTheDocument();
            expect(screen.getByText('Invalid password')).toBeInTheDocument();
        });

        it('displays general error message', () => {
            const error = 'Invalid credentials';
            render(<FormContent {...defaultProps} error={error} />);

            expect(screen.getByText(error)).toBeInTheDocument();
            expect(screen.getByTestId('alert-circle')).toBeInTheDocument();
        });

        it('does not display error message when error is empty', () => {
            render(<FormContent {...defaultProps} error="" />);

            expect(screen.queryByTestId('alert-circle')).not.toBeInTheDocument();
        });

        it('applies aria-invalid attribute for email field with error', () => {
            const errors = { email: 'Invalid email' };
            render(<FormContent {...defaultProps} errors={errors} />);

            const emailInput = screen.getByTestId('input-email-address');
            expect(emailInput).toHaveAttribute('aria-invalid', 'true');
        });

        it('applies aria-invalid attribute for password field with error', () => {
            const errors = { password: 'Invalid password' };
            render(<FormContent {...defaultProps} errors={errors} />);

            const passwordInput = screen.getByTestId('input-password');
            expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
        });
    });

    describe('Loading States', () => {
        it('shows loading indicator and disables button when loading is true', () => {
            render(<FormContent {...defaultProps} loading={true} />);

            expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
            expect(screen.getByText('Signing in...')).toBeInTheDocument();
            expect(screen.getByTestId('submit-button')).toBeDisabled();
        });

        it('shows normal button when loading is false', () => {
            render(<FormContent {...defaultProps} loading={false} />);

            expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
            expect(screen.getByText('Sign In')).toBeInTheDocument();
            expect(screen.getByTestId('submit-button')).not.toBeDisabled();
        });
    });

    describe('Social Login', () => {
        it('renders social login section when showSocialLogin is true', () => {
            render(<FormContent {...defaultProps} showSocialLogin={true} />);

            expect(screen.getByTestId('social-buttons')).toBeInTheDocument();
            expect(screen.getByText('Or continue with')).toBeInTheDocument();
        });

        it('hides social login section when showSocialLogin is false', () => {
            render(<FormContent {...defaultProps} showSocialLogin={false} />);

            expect(screen.queryByTestId('social-buttons')).not.toBeInTheDocument();
            expect(screen.queryByText('Or continue with')).not.toBeInTheDocument();
        });

        it('calls onSocialSignIn when social buttons are clicked', async () => {
            const mockOnSocialSignIn = vi.fn();
            const user = userEvent.setup();

            render(
                <FormContent
                    {...defaultProps}
                    showSocialLogin={true}
                    onSocialSignIn={mockOnSocialSignIn}
                />
            );

            await user.click(screen.getByTestId('google-button'));
            expect(mockOnSocialSignIn).toHaveBeenCalledWith('google', undefined);

            await user.click(screen.getByTestId('github-button'));
            expect(mockOnSocialSignIn).toHaveBeenCalledWith('github', undefined);

            await user.click(screen.getByTestId('microsoft-button'));
            expect(mockOnSocialSignIn).toHaveBeenCalledWith('microsoft', undefined);
        });

        it('passes social loading state to SocialButtons', () => {
            render(
                <FormContent
                    {...defaultProps}
                    showSocialLogin={true}
                    socialLoading="google"
                />
            );

            expect(screen.getByTestId('google-button')).toBeDisabled();
        });
    });

    describe('Sign Up Link', () => {
        it('renders sign up link when showSignUpLink is true and onSignUp is provided', () => {
            render(
                <FormContent
                    {...defaultProps}
                    showSignUpLink={true}
                    onSignUp={vi.fn()}
                />
            );

            expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
            expect(screen.getByText('Sign Up')).toBeInTheDocument();
        });

        it('hides sign up link when showSignUpLink is false', () => {
            render(<FormContent {...defaultProps} showSignUpLink={false} />);

            expect(screen.queryByText("Don't have an account?")).not.toBeInTheDocument();
        });

        it('calls handleSignUpClick when sign up link is clicked', async () => {
            const mockHandleSignUpClick = vi.fn();
            const user = userEvent.setup();

            render(
                <FormContent
                    {...defaultProps}
                    showSignUpLink={true}
                    onSignUp={vi.fn()}
                    handleSignUpClick={mockHandleSignUpClick}
                />
            );

            await user.click(screen.getByText('Sign Up'));
            expect(mockHandleSignUpClick).toHaveBeenCalled();
        });
    });

    describe('Forgot Password', () => {
        it('renders forgot password link when showForgotPassword is true', () => {
            render(<FormContent {...defaultProps} showForgotPassword={true} />);

            expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
        });

        it('hides forgot password link when showForgotPassword is false', () => {
            render(<FormContent {...defaultProps} showForgotPassword={false} />);

            expect(screen.queryByText('Forgot Password?')).not.toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has proper ARIA labels for form fields', () => {
            render(<FormContent {...defaultProps} />);

            expect(screen.getByTestId('input-email-address')).toHaveAttribute('aria-label', 'Email address');
            expect(screen.getByTestId('input-password')).toHaveAttribute('aria-label', 'Password');
        });

        it('has proper ARIA labels for password toggle', () => {
            render(<FormContent {...defaultProps} showPassword={false} />);

            const toggleButton = screen.getByRole('button', { name: /show password|hide password/i });
            expect(toggleButton).toHaveAttribute('aria-label', 'Show password');
        });

        it('has proper ARIA label for remember me checkbox', () => {
            render(<FormContent {...defaultProps} />);

            const rememberMeCheckbox = screen.getByLabelText('Remember me');
            expect(rememberMeCheckbox).toHaveAttribute('aria-label', 'Remember me for 30 days');
        });
    });

    describe('Form Data Binding', () => {
        it('displays current email value from formData', () => {
            const formData = { ...defaultFormData, email: 'test@example.com' };
            render(<FormContent {...defaultProps} formData={formData} />);

            const emailInput = screen.getByTestId('input-email-address');
            expect(emailInput).toHaveValue('test@example.com');
        });

        it('displays current password value from formData', () => {
            const formData = { ...defaultFormData, password: 'password123' };
            render(<FormContent {...defaultProps} formData={formData} />);

            const passwordInput = screen.getByTestId('input-password');
            expect(passwordInput).toHaveValue('password123');
        });

        it('displays current rememberMe value from formData', () => {
            const formData = { ...defaultFormData, rememberMe: true };
            render(<FormContent {...defaultProps} formData={formData} />);

            const rememberMeCheckbox = screen.getByLabelText('Remember me');
            expect(rememberMeCheckbox).toBeChecked();
        });
    });
});