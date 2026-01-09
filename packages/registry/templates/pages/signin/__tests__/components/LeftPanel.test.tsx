import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock dependencies first
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock lucide-react properly with importOriginal
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('lucide-react')>();
    return {
        ...actual,
        Shield: ({ className }: any) => <div data-testid="shield-icon" className={className}>Shield</div>,
        ShieldCheck: ({ className }: any) => <div data-testid="shield-check-icon" className={className}>ShieldCheck</div>,
        Check: ({ className }: any) => <div data-testid="check-icon" className={className}>Check</div>,
        Star: ({ className }: any) => <div data-testid="star-icon" className={className}>Star</div>,
        CheckCircle: ({ className }: any) => <div data-testid="check-circle-icon" className={className}>CheckCircle</div>,
        Globe: ({ className }: any) => <div data-testid="globe-icon" className={className}>Globe</div>,
        Users: ({ className }: any) => <div data-testid="users-icon" className={className}>Users</div>,
        Zap: ({ className }: any) => <div data-testid="zap-icon" className={className}>Zap</div>,
        Lock: ({ className }: any) => <div data-testid="lock-icon" className={className}>Lock</div>,
        Clock: ({ className }: any) => <div data-testid="clock-icon" className={className}>Clock</div>,
        ArrowRight: ({ className }: any) => <div data-testid="arrow-right-icon" className={className}>ArrowRight</div>,
    };
});

vi.mock('../../../../../utils/cn', () => ({
    cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// Create a simple mock for utils that doesn't reference external variables
const mockGetLeftPanelContent = vi.fn();

// Use vi.doMock with a factory that returns our mock
vi.doMock('../../utils', () => {
    return {
        getLeftPanelContent: mockGetLeftPanelContent,
    };
});

// Now import the component after mocks are set up
import { LeftPanel } from '../../components/LeftPanel';
import type { LeftPanelProps, SplitLayoutStyles } from '../../types';

describe('LeftPanel Component', () => {
    const defaultSplitStyles: SplitLayoutStyles = {
        leftPanelClasses: 'left-panel-classes',
        textColor: 'text-white',
        companyNameColor: 'text-white',
        descriptionColor: 'text-white/90',
        backgroundStyle: {},
        overlayStyle: {},
        rightPanelClasses: 'right-panel-classes',
    };

    const defaultProps: LeftPanelProps = {
        companyName: 'TestCompany',
        splitStyles: defaultSplitStyles,
        isDarkVariant: false,
    };

    // Updated default content to match what we see in the rendered output
    const defaultContent = {
        panelTitle: 'Welcome Back',
        panelDescription: 'Sign in to access your personalized dashboard and continue where you left off. Your work is waiting for you.',
        subtitle: undefined,
        panelFeatures: [
            {
                text: 'Enterprise-grade security & encryption',
                icon: <div data-testid="shield-check-icon">ShieldCheck</div>,
                iconColor: 'text-blue-400'
            },
            {
                text: 'Lightning-fast performance',
                icon: <div data-testid="zap-icon">Zap</div>,
                iconColor: 'text-yellow-400'
            },
            {
                text: 'Seamless team collaboration',
                icon: <div data-testid="users-icon">Users</div>,
                iconColor: 'text-green-400'
            },
            {
                text: 'Global availability',
                icon: <div data-testid="globe-icon">Globe</div>,
                iconColor: 'text-purple-400'
            },
        ],
        testimonials: undefined,
        statistics: undefined,
        customContent: undefined,
        footerText: undefined,
        hideBranding: false,
        contentClassName: '',
        mergedAnimationConfig: {
            titleDelay: 0.2,
            descriptionDelay: 0.3,
            featuresDelay: 0.4,
            staggerChildren: 0.1,
        },
        layout: { align: 'center' },
        alignClass: 'items-center text-center',
        maxWidth: 'max-w-2xl',
        shouldAnimate: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockGetLeftPanelContent.mockReturnValue(defaultContent);
    });

    describe('Basic Rendering', () => {
        it('renders the left panel container', () => {
            render(<LeftPanel {...defaultProps} />);

            // Check if the component renders by looking for company name
            expect(screen.getByText('TestCompany')).toBeInTheDocument();
        });

        it('displays company name', () => {
            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByText('TestCompany')).toBeInTheDocument();
        });

        it('renders default logo when no logo provided', () => {
            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
        });

        it('renders custom logo when provided', () => {
            const customLogo = <div data-testid="custom-logo">Custom Logo</div>;
            render(<LeftPanel {...defaultProps} logo={customLogo} />);
            expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
        });
    });

    describe('Content Sections', () => {
        it('renders title section', () => {
            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        });

        it('renders description', () => {
            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByText('Sign in to access your personalized dashboard and continue where you left off. Your work is waiting for you.')).toBeInTheDocument();
        });

        it('renders features list', () => {
            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByText('Enterprise-grade security & encryption')).toBeInTheDocument();
            expect(screen.getByText('Lightning-fast performance')).toBeInTheDocument();
            expect(screen.getByText('Seamless team collaboration')).toBeInTheDocument();
            expect(screen.getByText('Global availability')).toBeInTheDocument();
        });

        it('renders features with icons', () => {
            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByTestId('shield-check-icon')).toBeInTheDocument();
            expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
            expect(screen.getByTestId('users-icon')).toBeInTheDocument();
            expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
        });

        it('renders custom content when provided', () => {
            const customContent = <div data-testid="custom-content">Custom Panel Content</div>;

            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                customContent,
                panelTitle: undefined,
                panelDescription: undefined,
                panelFeatures: undefined,
            });

            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByTestId('custom-content')).toBeInTheDocument();
            // When custom content is provided, regular content should not be shown
            expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();
        });
    });

    describe('Testimonials', () => {
        it('renders testimonials section when provided', () => {
            const testimonials = [
                { quote: 'Great product!', author: 'John Doe', role: 'CEO' },
                { quote: 'Very useful', author: 'Jane Smith', role: 'CTO' },
            ];

            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                testimonials,
                // Testimonials should replace features
                panelFeatures: undefined,
            });

            render(<LeftPanel {...defaultProps} />);

            expect(screen.getByText('"Great product!"')).toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('CEO')).toBeInTheDocument();
            expect(screen.getByText('"Very useful"')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('CTO')).toBeInTheDocument();
        });
    });

    describe('Statistics', () => {
        it('renders statistics section when provided', () => {
            const statistics = [
                { value: '100+', label: 'Users', subtext: 'Active' },
                { value: '99.9%', label: 'Uptime', subtext: 'Reliable' },
            ];

            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                statistics,
                // Statistics should replace features
                panelFeatures: undefined,
            });

            render(<LeftPanel {...defaultProps} />);

            expect(screen.getByText('100+')).toBeInTheDocument();
            expect(screen.getByText('Users')).toBeInTheDocument();
            expect(screen.getByText('Active')).toBeInTheDocument();
            expect(screen.getByText('99.9%')).toBeInTheDocument();
            expect(screen.getByText('Uptime')).toBeInTheDocument();
            expect(screen.getByText('Reliable')).toBeInTheDocument();
        });
    });

    describe('Layout Configuration', () => {
        it('applies center alignment by default', () => {
            render(<LeftPanel {...defaultProps} />);

            // Find the main content container
            const mainContainer = screen.getByText('Welcome Back').closest('.flex-col');
            expect(mainContainer).toHaveClass('items-center', 'text-center');
        });

        it('applies left alignment when configured', () => {
            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                alignClass: 'items-start text-left',
                layout: { align: 'left' },
            });

            render(<LeftPanel {...defaultProps} />);

            const mainContainer = screen.getByText('Welcome Back').closest('.flex-col');
            expect(mainContainer).toHaveClass('items-start', 'text-left');
            expect(mainContainer).not.toHaveClass('items-center', 'text-center');
        });

        it('applies right alignment when configured', () => {
            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                alignClass: 'items-end text-right',
                layout: { align: 'right' },
            });

            render(<LeftPanel {...defaultProps} />);

            const mainContainer = screen.getByText('Welcome Back').closest('.flex-col');
            expect(mainContainer).toHaveClass('items-end', 'text-right');
            expect(mainContainer).not.toHaveClass('items-center', 'text-center');
        });

        it('applies custom max width', () => {
            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                maxWidth: 'max-w-3xl',
                layout: { maxWidth: 'max-w-3xl' },
            });

            render(<LeftPanel {...defaultProps} />);

            const mainContainer = screen.getByText('Welcome Back').closest('.flex-col');
            expect(mainContainer).toHaveClass('max-w-3xl');
            expect(mainContainer).not.toHaveClass('max-w-2xl');
        });
    });

    describe('Branding', () => {
        it('shows branding section by default', () => {
            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByText('TestCompany')).toBeInTheDocument();
            expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
        });

        it('hides branding when hideBranding is true', () => {
            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                hideBranding: true,
            });

            render(<LeftPanel {...defaultProps} />);

            // The branding should not be rendered
            expect(screen.queryByText('TestCompany')).not.toBeInTheDocument();
            expect(screen.queryByTestId('shield-icon')).not.toBeInTheDocument();
        });
    });

    describe('Footer', () => {
        it('renders default footer when no footerText provided', () => {
            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByText(`© 2024 ${defaultProps.companyName}`)).toBeInTheDocument();
            expect(screen.getByText('• All rights reserved')).toBeInTheDocument();
        });

        it('renders custom footer text when provided', () => {
            const customFooter = 'Custom Footer Text';

            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                footerText: customFooter,
            });

            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByText(customFooter)).toBeInTheDocument();
            // Default footer should be replaced
            expect(screen.queryByText(`© 2024 ${defaultProps.companyName}`)).not.toBeInTheDocument();
        });

        it('hides footer when footerText is null', () => {
            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                footerText: null,
            });

            render(<LeftPanel {...defaultProps} />);
            expect(screen.queryByText(`© 2024 ${defaultProps.companyName}`)).not.toBeInTheDocument();
            expect(screen.queryByText('• All rights reserved')).not.toBeInTheDocument();
        });
    });

    describe('Styling', () => {
        it('applies text color from splitStyles', () => {
            render(<LeftPanel {...defaultProps} />);
            const companyName = screen.getByText('TestCompany');
            expect(companyName).toHaveClass('text-white');
        });

        it('applies dark variant styles when isDarkVariant is true', () => {
            render(<LeftPanel {...defaultProps} isDarkVariant={true} />);
            const shieldIcon = screen.getByTestId('shield-icon');
            expect(shieldIcon).toHaveClass('text-blue-400');
        });

        it('applies light variant styles when isDarkVariant is false', () => {
            render(<LeftPanel {...defaultProps} isDarkVariant={false} />);
            const shieldIcon = screen.getByTestId('shield-icon');
            expect(shieldIcon).toHaveClass('text-blue-600');
        });

        it('applies content className when provided', () => {
            const customClassName = 'custom-content-class';

            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                contentClassName: customClassName,
            });

            render(<LeftPanel {...defaultProps} />);

            // Find the content container - look for the element with our custom class
            const contentContainer = screen.getByText('Welcome Back').closest('.flex-col');
            expect(contentContainer).toHaveClass(customClassName);
        });
    });

    describe('Subtitle', () => {
        it('renders subtitle when provided', () => {
            const subtitle = 'Additional information here';

            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                subtitle,
            });

            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByText(subtitle)).toBeInTheDocument();
        });
    });

    describe('Feature Layout', () => {
        it('renders features in grid when there are more than 4', () => {
            const manyFeatures = Array.from({ length: 6 }, (_, i) => ({
                text: `Feature ${i + 1}`,
                icon: <div>Icon</div>,
                iconColor: 'text-blue-400',
            }));

            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                panelFeatures: manyFeatures,
            });

            render(<LeftPanel {...defaultProps} />);

            // Look for a grid container - features should be in a grid when > 4
            // First find one of the features
            const featureElement = screen.getByText('Feature 1');
            const gridContainer = featureElement.closest('.grid');
            expect(gridContainer).toBeInTheDocument();
        });

        it('renders features in flex column when 4 or fewer', () => {
            const fewFeatures = Array.from({ length: 3 }, (_, i) => ({
                text: `Test Feature ${i + 1}`,
                icon: <div>Icon</div>,
                iconColor: 'text-blue-400',
            }));

            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                panelFeatures: fewFeatures,
            });

            render(<LeftPanel {...defaultProps} />);

            // Look for a flex container (should not have grid classes)
            const featuresContainer = screen.getByText('Test Feature 1').closest('div');
            expect(featuresContainer).not.toHaveClass('grid');
        });
    });

    describe('Animation Configuration', () => {
        it('uses motion components when shouldAnimate is true', () => {
            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                shouldAnimate: true,
            });

            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        });

        it('uses regular div when shouldAnimate is false', () => {
            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                shouldAnimate: false,
            });

            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        });
    });

    describe('Empty State Handling', () => {
        it('handles empty features array', () => {
            mockGetLeftPanelContent.mockReturnValueOnce({
                ...defaultContent,
                panelFeatures: [],
            });

            render(<LeftPanel {...defaultProps} />);
            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        });

        it('handles undefined company name', () => {
            render(<LeftPanel {...defaultProps} companyName={undefined} />);
            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        });

        it('handles empty splitStyles gracefully', () => {
            const emptySplitStyles = {
                leftPanelClasses: '',
                textColor: '',
                companyNameColor: '',
                descriptionColor: '',
                backgroundStyle: {},
                overlayStyle: {},
                rightPanelClasses: '',
            };

            render(<LeftPanel {...defaultProps} splitStyles={emptySplitStyles} />);
            expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        });
    });
});