import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Target, Shield, Trophy, Users, CheckCircle, ArrowUpRight, LayoutDashboard } from 'lucide-react';
import { ParallaxSection, ParallaxImage } from '@/components/ui/parallax';

export default function Home() {
    return (
        <Layout>
            {/* Hero Section with Parallax */}
            <section className="relative min-h-[90vh] overflow-hidden">
                <ParallaxSection offset={100} className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background/50 to-background" />
                </ParallaxSection>

                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500 leading-tight">
                                Transform Your Goals into 
                                <br />
                                Achievable Milestones
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Set goals, stake tokens, and get rewarded for your achievements. 
                                Use blockchain technology to stay accountable and track your progress.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/create">
                                <Button size="lg" className="gap-2 text-base">
                                    Start Your Journey
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="secondary" size="lg" className="text-base gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    View Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section with Parallax Cards */}
            <section className="py-24 px-4">
                <div className="container mx-auto">
                    <ParallaxSection offset={30}>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Features that Empower You</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Everything you need to achieve your goals and stay accountable
                            </p>
                        </div>
                    </ParallaxSection>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <ParallaxSection key={index} offset={20 * (index + 1)}>
                                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </Card>
                            </ParallaxSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why GoalForge Section with Parallax */}
            <section className="py-24 bg-secondary/20 overflow-hidden">
                <div className="container mx-auto px-4">
                    <ParallaxSection offset={40}>
                        <div className="max-w-3xl mx-auto text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Why Choose GoalForge?</h2>
                            <p className="text-muted-foreground">
                                We combine blockchain technology with proven goal-setting methodologies
                            </p>
                        </div>
                    </ParallaxSection>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            {benefits.map((benefit, index) => (
                                <ParallaxSection key={index} offset={15 * (index + 1)}>
                                    <div className="flex gap-4">
                                        <div className="h-6 w-6 text-primary mt-1">
                                            <CheckCircle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">{benefit.title}</h3>
                                            <p className="text-muted-foreground">{benefit.description}</p>
                                        </div>
                                    </div>
                                </ParallaxSection>
                            ))}
                        </div>
                        <ParallaxSection offset={60}>
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 p-8">
                                {/* Add illustration or image here */}
                            </div>
                        </ParallaxSection>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="p-6 bg-card/50 backdrop-blur border-border/50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/20" />
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground">{testimonial.quote}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
                <div className="container mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-primary">GoalForge</h3>
                            <p className="text-muted-foreground">
                                Transforming goals into achievements through blockchain technology.
                            </p>
                        </div>
                        {footerLinks.map((section, index) => (
                            <div key={index} className="space-y-4">
                                <h4 className="font-semibold">{section.title}</h4>
                                <ul className="space-y-2">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link 
                                                href={link.href} 
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-border/40 mt-12 pt-8 text-center text-muted-foreground">
                        <p>© 2024 GoalForge. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </Layout>
    );
}

const features = [
    {
        icon: <Target className="h-6 w-6 text-primary" />,
        title: "Smart Goal Setting",
        description: "Create structured goals with clear milestones and deadlines using blockchain technology."
    },
    {
        icon: <Shield className="h-6 w-6 text-primary" />,
        title: "Stake Mechanism",
        description: "Put your tokens at stake to strengthen your commitment to achieving goals."
    },
    {
        icon: <Trophy className="h-6 w-6 text-primary" />,
        title: "Reward System",
        description: "Earn rewards and recognition upon successful completion of your goals."
    },
    {
        icon: <Users className="h-6 w-6 text-primary" />,
        title: "Community Verification",
        description: "Get your achievements verified by trusted community members."
    }
];

const benefits = [
    {
        title: "Transparent & Secure",
        description: "All goals and achievements are recorded on the blockchain, ensuring complete transparency and security."
    },
    {
        title: "Real Stakes, Real Commitment",
        description: "Put your tokens at stake to create a tangible commitment to your goals."
    },
    {
        title: "Community Driven",
        description: "Join a community of goal-setters and get support from like-minded individuals."
    },
    {
        title: "Earn While You Achieve",
        description: "Get rewarded with tokens for completing your goals successfully."
    }
];

const testimonials = [
    {
        name: "Alex Thompson",
        title: "Fitness Enthusiast",
        quote: "GoalForge helped me stay committed to my fitness goals. The staking mechanism really kept me accountable!"
    },
    {
        name: "Sarah Chen",
        title: "Entrepreneur",
        quote: "The transparency and community support make GoalForge unique. It's not just about setting goals, it's about achieving them."
    },
    {
        name: "Michael Roberts",
        title: "Developer",
        quote: "As someone who loves blockchain technology, GoalForge is the perfect blend of utility and innovation."
    }
];

const footerLinks = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#" },
            { label: "How it Works", href: "#" },
            { label: "Pricing", href: "#" },
            { label: "FAQ", href: "#" }
        ]
    },
    {
        title: "Resources",
        links: [
            { label: "Documentation", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Community", href: "#" },
            { label: "Support", href: "#" }
        ]
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Contact", href: "#" },
            { label: "Privacy Policy", href: "#" }
        ]
    }
];
