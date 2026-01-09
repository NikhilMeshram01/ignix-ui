import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { SocialButtons } from '../../components/SocialButtons';
import type { SocialButtonsProps, SocialProvider } from '../../types';

// Mock dependencies
vi.mock('react-icons/fc', () => ({
    FcGoogle: ({ className }: any) => <div data-testid="google-icon" className={className}>GoogleIcon</div>,
}));

vi.mock('react-icons/fa', () => ({
    FaGithub: ({ className }: any) => <div data-testid="github-icon" className={className}>GitHubIcon</div>,
    FaMicrosoft: ({ className }: any) => <div data-testid="microsoft-icon" className={className}>MicrosoftIcon</div>,
}));

vi.mock('lucide-react', () => ({
    Loader2: ({ className }: any) => <div data-testid="loader-icon" className={className}>LoaderIcon</div>,
}));

vi.mock('../../../../utils/cn', () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('SocialButtons Component', () => {
    const defaultProps: SocialButtonsProps = {
        onGoogleSignIn: vi.fn(),
        onGitHubSignIn: vi.fn(),
        onMicrosoftSignIn: vi.fn(),
        loading: null,
        isDarkVariant: false,
        className: '',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        it('renders all three social buttons', () => {
            render(<SocialButtons {...defaultProps} />);

            expect(screen.getByTestId('social-buttons')).toBeInTheDocument();
            expect(screen.getByTestId('google-button')).toBeInTheDocument();
            expect(screen.getByTestId('github-button')).toBeInTheDocument();
            expect(screen.getByTestId('microsoft-button')).toBeInTheDocument();
        });

        it('renders social icons', () => {
            render(<SocialButtons {...defaultProps} />);

            expect(screen.getByTestId('google-icon')).toBeInTheDocument();
            expect(screen.getByTestId('github-icon')).toBeInTheDocument();
            expect(screen.getByTestId('microsoft-icon')).toBeInTheDocument();
        });

        it('applies default classes to buttons', () => {
            render(<SocialButtons {...defaultProps} />);

            const googleButton = screen.getByTestId('google-button');
            expect(googleButton).toHaveClass('w-full');
            expect(googleButton).toHaveClass('inline-flex');
            expect(googleButton).toHaveClass('justify-center');
            expect(googleButton).toHaveClass('items-center');
            expect(googleButton).toHaveClass('py-2.5');
            expect(googleButton).toHaveClass('px-4');
            expect(googleButton).toHaveClass('border');
            expect(googleButton).toHaveClass('rounded-lg');
            expect(googleButton).toHaveClass('text-sm');
            expect(googleButton).toHaveClass('font-medium');
            expect(googleButton).toHaveClass('transition-all');
            expect(googleButton).toHaveClass('duration-300');
        });
    });

    describe('Button Interactions', () => {
        it('calls onGoogleSignIn when Google button is clicked', async () => {
            const mockOnGoogleSignIn = vi.fn();
            const user = userEvent.setup();

            render(<SocialButtons {...defaultProps} onGoogleSignIn={mockOnGoogleSignIn} />);

            await user.click(screen.getByTestId('google-button'));
            expect(mockOnGoogleSignIn).toHaveBeenCalledTimes(1);
        });

        it('calls onGitHubSignIn when GitHub button is clicked', async () => {
            const mockOnGitHubSignIn = vi.fn();
            const user = userEvent.setup();

            render(<SocialButtons {...defaultProps} onGitHubSignIn={mockOnGitHubSignIn} />);

            await user.click(screen.getByTestId('github-button'));
            expect(mockOnGitHubSignIn).toHaveBeenCalledTimes(1);
        });

        it('calls onMicrosoftSignIn when Microsoft button is clicked', async () => {
            const mockOnMicrosoftSignIn = vi.fn();
            const user = userEvent.setup();

            render(<SocialButtons {...defaultProps} onMicrosoftSignIn={mockOnMicrosoftSignIn} />);

            await user.click(screen.getByTestId('microsoft-button'));
            expect(mockOnMicrosoftSignIn).toHaveBeenCalledTimes(1);
        });

        it('has proper ARIA labels for buttons', () => {
            render(<SocialButtons {...defaultProps} />);

            expect(screen.getByTestId('google-button')).toHaveAttribute('aria-label', 'Sign in with Google');
            expect(screen.getByTestId('github-button')).toHaveAttribute('aria-label', 'Sign in with GitHub');
            expect(screen.getByTestId('microsoft-button')).toHaveAttribute('aria-label', 'Sign in with Microsoft');
        });

        it('buttons have correct types', () => {
            render(<SocialButtons {...defaultProps} />);

            expect(screen.getByTestId('google-button')).toHaveAttribute('type', 'button');
            expect(screen.getByTestId('github-button')).toHaveAttribute('type', 'button');
            expect(screen.getByTestId('microsoft-button')).toHaveAttribute('type', 'button');
        });
    });

    describe('Loading States', () => {
        it('shows loader and disables Google button when loading is "google"', () => {
            render(<SocialButtons {...defaultProps} loading="google" />);

            const googleButton = screen.getByTestId('google-button');
            expect(googleButton).toBeDisabled();
            expect(googleButton).toHaveClass('opacity-50');
            expect(googleButton).toHaveClass('cursor-wait');
            expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

            // Other buttons should not be disabled
            expect(screen.getByTestId('github-button')).not.toBeDisabled();
            expect(screen.getByTestId('microsoft-button')).not.toBeDisabled();
        });

        it('shows loader and disables GitHub button when loading is "github"', () => {
            render(<SocialButtons {...defaultProps} loading="github" />);

            const githubButton = screen.getByTestId('github-button');
            expect(githubButton).toBeDisabled();
            expect(githubButton).toHaveClass('opacity-50');
            expect(githubButton).toHaveClass('cursor-wait');
            expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

            // Other buttons should not be disabled
            expect(screen.getByTestId('google-button')).not.toBeDisabled();
            expect(screen.getByTestId('microsoft-button')).not.toBeDisabled();
        });

        it('shows loader and disables Microsoft button when loading is "microsoft"', () => {
            render(<SocialButtons {...defaultProps} loading="microsoft" />);

            const microsoftButton = screen.getByTestId('microsoft-button');
            expect(microsoftButton).toBeDisabled();
            expect(microsoftButton).toHaveClass('opacity-50');
            expect(microsoftButton).toHaveClass('cursor-wait');
            expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

            // Other buttons should not be disabled
            expect(screen.getByTestId('google-button')).not.toBeDisabled();
            expect(screen.getByTestId('github-button')).not.toBeDisabled();
        });

        it('shows icons when not loading', () => {
            render(<SocialButtons {...defaultProps} loading={null} />);

            expect(screen.getByTestId('google-icon')).toBeInTheDocument();
            expect(screen.getByTestId('github-icon')).toBeInTheDocument();
            expect(screen.getByTestId('microsoft-icon')).toBeInTheDocument();
            expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
        });
    });

    describe('Styling', () => {
        it('applies grid layout classes', () => {
            render(<SocialButtons {...defaultProps} />);

            const container = screen.getByTestId('social-buttons');
            expect(container).toHaveClass('grid');
            expect(container).toHaveClass('grid-cols-3');
            expect(container).toHaveClass('gap-3');
        });

        it('applies custom className to container', () => {
            const customClassName = 'custom-social-buttons';
            render(<SocialButtons {...defaultProps} className={customClassName} />);

            const container = screen.getByTestId('social-buttons');
            expect(container).toHaveClass(customClassName);
        });

        it('buttons have hover and active states', () => {
            render(<SocialButtons {...defaultProps} />);

            const googleButton = screen.getByTestId('google-button');
            expect(googleButton).toHaveClass('hover:shadow-md');
            expect(googleButton).toHaveClass('active:scale-95');
            expect(googleButton).toHaveClass('hover:bg-gray-50');
        });

        it('buttons have focus styles', () => {
            render(<SocialButtons {...defaultProps} />);

            const googleButton = screen.getByTestId('google-button');
            expect(googleButton).toHaveClass('focus:outline-none');
            expect(googleButton).toHaveClass('focus:ring-2');
            expect(googleButton).toHaveClass('focus:ring-blue-500');
            expect(googleButton).toHaveClass('focus:ring-opacity-50');
        });

        it('buttons have default background and border', () => {
            render(<SocialButtons {...defaultProps} />);

            const googleButton = screen.getByTestId('google-button');
            expect(googleButton).toHaveClass('bg-white');
            expect(googleButton).toHaveClass('border-gray-300');
        });

        it('Microsoft icon has specific color class', () => {
            render(<SocialButtons {...defaultProps} />);

            const microsoftIcon = screen.getByTestId('microsoft-icon');
            expect(microsoftIcon).toHaveClass('text-[#00A4EF]');
        });
    });

    describe('Accessibility', () => {
        it('buttons are keyboard accessible', async () => {
            const mockOnGoogleSignIn = vi.fn();
            const user = userEvent.setup();

            render(<SocialButtons {...defaultProps} onGoogleSignIn={mockOnGoogleSignIn} />);

            const googleButton = screen.getByTestId('google-button');
            await user.tab();

            expect(googleButton).toHaveFocus();

            await user.keyboard('[Enter]');
            expect(mockOnGoogleSignIn).toHaveBeenCalled();
        });

        it('has proper disabled states for screen readers', () => {
            render(<SocialButtons {...defaultProps} loading="google" />);

            const googleButton = screen.getByTestId('google-button');
            expect(googleButton).toHaveAttribute('disabled');
            expect(googleButton).toHaveAttribute('aria-label', 'Sign in with Google');
        });
    });

    describe('Edge Cases', () => {
        it('handles undefined callback functions', () => {
            const propsWithoutCallbacks = {
                loading: null as SocialProvider | null,
                isDarkVariant: false,
                className: '',
            };

            render(<SocialButtons {...propsWithoutCallbacks} />);

            // Should render without errors
            expect(screen.getByTestId('social-buttons')).toBeInTheDocument();
            expect(screen.getByTestId('google-button')).toBeInTheDocument();

            // Click should not throw error
            expect(() => {
                fireEvent.click(screen.getByTestId('google-button'));
            }).not.toThrow();
        });

        it('handles partial callback functions', () => {
            const partialProps = {
                onGoogleSignIn: vi.fn(),
                loading: null as SocialProvider | null,
                isDarkVariant: false,
                className: '',
            };

            render(<SocialButtons {...partialProps} />);

            expect(screen.getByTestId('social-buttons')).toBeInTheDocument();

            // Google button should work
            fireEvent.click(screen.getByTestId('google-button'));
            expect(partialProps.onGoogleSignIn).toHaveBeenCalled();

            // Other buttons should not throw errors when clicked
            expect(() => {
                fireEvent.click(screen.getByTestId('github-button'));
                fireEvent.click(screen.getByTestId('microsoft-button'));
            }).not.toThrow();
        });

        it('renders without isDarkVariant prop', () => {
            const propsWithoutDarkVariant = {
                onGoogleSignIn: vi.fn(),
                loading: null as SocialProvider | null,
                className: '',
            };

            render(<SocialButtons {...propsWithoutDarkVariant} />);

            expect(screen.getByTestId('social-buttons')).toBeInTheDocument();
            expect(screen.getByTestId('google-button')).toBeInTheDocument();
        });

        it('renders without className prop', () => {
            const propsWithoutClassName = {
                onGoogleSignIn: vi.fn(),
                loading: null as SocialProvider | null,
                isDarkVariant: false,
            };

            render(<SocialButtons {...propsWithoutClassName} />);

            expect(screen.getByTestId('social-buttons')).toBeInTheDocument();
            // Should have default grid classes
            expect(screen.getByTestId('social-buttons')).toHaveClass('grid', 'grid-cols-3', 'gap-3');
        });
    });

    describe('Responsive Design', () => {
        it('has responsive padding on buttons', () => {
            render(<SocialButtons {...defaultProps} />);

            const googleButton = screen.getByTestId('google-button');
            expect(googleButton).toHaveClass('py-2.5');
            expect(googleButton).toHaveClass('px-4');
        });
    });
});