"use client";

import { useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Target, Shield, Trophy, Users, CheckCircle, LayoutDashboard, Zap, Sparkles, TrendingUp, Lock } from 'lucide-react';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { contractAddress } from '@/config/contractAddress';
import abi from '@/config/abi.json';
import { motion } from 'framer-motion';

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function Home() {
    const { address } = useAccount();
    const [showOnboarding, setShowOnboarding] = useState(false);

    const { data: hasOnboarded } = useContractRead({
        address: contractAddress,
        abi,
        functionName: 'hasUserOnboarded',
        args: [address],
        enabled: Boolean(address),
    });

    const handleStartJourney = () => {
        if (!address) {
            return;
        }

        if (!hasOnboarded) {
            setShowOnboarding(true);
        }
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_70%)]" />
                </div>

                <div className="container mx-auto px-4">
                    <motion.div 
                        className="flex flex-col items-center justify-center min-h-[85vh] text-center"
                        initial="initial"
                        animate="animate"
                        variants={stagger}
                    >
                        {/* Badge */}
                        <motion.div 
                            variants={fadeIn}
                            className="mb-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-muted-foreground">
                                    Web3-Powered Goal Achievement
                                </span>
                            </div>
                        </motion.div>

                        {/* Main heading */}
                        <motion.div variants={fadeIn} className="space-y-6 max-w-4xl">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                                <span className="text-foreground">Make Goals</span>
                                <br />
                                <span className="text-gradient">Actually Stick</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                Put your money where your mouth is. Stake tokens on your goals, 
                                stay accountable, and earn rewards when you achieve them.
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div 
                            variants={fadeIn}
                            className="flex flex-wrap gap-4 justify-center mt-10"
                        >
                            {!address ? (
                                <Button 
                                    size="lg" 
                                    className="gap-2 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12"
                                >
                                    Connect Wallet
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : !hasOnboarded ? (
                                <Button 
                                    size="lg" 
                                    className="gap-2 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12"
                                    onClick={handleStartJourney}
                                >
                                    Start Your Journey
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <>
                                    <Link href="/create">
                                        <Button 
                                            size="lg" 
                                            className="gap-2 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12"
                                        >
                                            Create Goal
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard">
                                        <Button 
                                            variant="secondary" 
                                            size="lg" 
                                            className="text-base gap-2 px-8 h-12 glass hover:bg-secondary/80"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </motion.div>

                        {/* Stats */}
                        <motion.div 
                            variants={fadeIn}
                            className="grid grid-cols-3 gap-8 md:gap-16 mt-16 pt-8 border-t border-border/30"
                        >
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 px-4 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
                <div className="container mx-auto relative">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary font-medium text-sm tracking-wider uppercase">How It Works</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-3">Three Steps to Success</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                            >
                                <Card className="relative p-8 glass glass-hover h-full group">
                                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                                    </div>
                                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4">
                <div className="container mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary font-medium text-sm tracking-wider uppercase">Features</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-3">Built for Achievers</h2>
                        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                            Everything you need to set, track, and crush your goals with blockchain-powered accountability
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-6 glass glass-hover card-interactive h-full">
                                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why STICKIT Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
                <div className="container mx-auto px-4 relative">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-primary font-medium text-sm tracking-wider uppercase">Why STICKIT?</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6">
                                Put Real Stakes Behind Your Goals
                            </h2>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Research shows that financial commitment increases goal completion rates by up to 3x. 
                                STICKIT combines this insight with blockchain technology to create unbreakable accountability.
                            </p>
                            
                            <div className="space-y-5">
                                {benefits.map((benefit, index) => (
                                    <motion.div 
                                        key={index} 
                                        className="flex gap-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="h-6 w-6 text-primary flex-shrink-0 mt-0.5">
                                            <CheckCircle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1">{benefit.title}</h4>
                                            <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="aspect-square rounded-3xl glass p-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                                <div className="absolute top-8 right-8 w-24 h-24 bg-primary/30 rounded-full blur-2xl" />
                                <div className="absolute bottom-8 left-8 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
                                
                                <div className="relative h-full flex flex-col justify-center items-center text-center">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 animate-pulse-glow">
                                        <Zap className="h-10 w-10 text-background" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Ready to Commit?</h3>
                                    <p className="text-muted-foreground mb-6">Join thousands achieving their goals</p>
                                    <Link href="/create">
                                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                                            Get Started Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-4">
                <div className="container mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary font-medium text-sm tracking-wider uppercase">Testimonials</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-3">What Users Say</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-6 glass glass-hover h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-lg">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <div className="container mx-auto">
                    <motion.div 
                        className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 md:p-16 relative overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
                        
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Goals?</h2>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                                Join the community of achievers using STICKIT to turn aspirations into accomplishments.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/create">
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8">
                                        Start for Free
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/community">
                                    <Button size="lg" variant="secondary" className="px-8 glass hover:bg-secondary/80">
                                        Explore Community
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-card/30 backdrop-blur">
                <div className="container mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <Zap className="h-4 w-4 text-background" />
                                </div>
                                <span className="text-xl font-bold">
                                    <span className="text-gradient">STICK</span>
                                    <span className="text-foreground">IT</span>
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Web3-powered accountability platform helping you achieve your goals through financial commitment.
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
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                        <p>© 2024 STICKIT. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Onboarding Modal */}
            <OnboardingModal 
                isOpen={showOnboarding} 
                onClose={() => setShowOnboarding(false)} 
            />
        </Layout>
    );
}

const stats = [
    { value: "10K+", label: "Goals Created" },
    { value: "85%", label: "Success Rate" },
    { value: "$2M+", label: "Rewards Earned" }
];

const steps = [
    {
        icon: <Target className="h-7 w-7 text-primary" />,
        title: "Set Your Goal",
        description: "Define what you want to achieve with clear milestones and a realistic deadline."
    },
    {
        icon: <Lock className="h-7 w-7 text-primary" />,
        title: "Stake Tokens",
        description: "Put tokens at stake to create real accountability. Your commitment drives your success."
    },
    {
        icon: <Trophy className="h-7 w-7 text-primary" />,
        title: "Achieve & Earn",
        description: "Complete your goal, get verified, and earn back your stake plus bonus rewards."
    }
];

const features = [
    {
        icon: <Target className="h-6 w-6 text-primary" />,
        title: "Smart Goals",
        description: "Create structured goals with clear milestones and blockchain verification."
    },
    {
        icon: <Shield className="h-6 w-6 text-primary" />,
        title: "Secure Stakes",
        description: "Your staked tokens are held securely in smart contracts until goal completion."
    },
    {
        icon: <Trophy className="h-6 w-6 text-primary" />,
        title: "Earn Rewards",
        description: "Complete goals to earn back your stake plus bonus tokens and achievement NFTs."
    },
    {
        icon: <Users className="h-6 w-6 text-primary" />,
        title: "Community",
        description: "Get verified by trusted community members and support others on their journey."
    }
];

const benefits = [
    {
        title: "Transparent & Immutable",
        description: "All goals and achievements are recorded on-chain, creating a verifiable track record."
    },
    {
        title: "Real Financial Stakes",
        description: "Token staking creates genuine commitment that traditional apps can't match."
    },
    {
        title: "Community Verification",
        description: "Trusted validators ensure fair and honest goal completion verification."
    },
    {
        title: "Earn While You Achieve",
        description: "Successful goal completion rewards you with tokens and exclusive achievement NFTs."
    }
];

const testimonials = [
    {
        name: "Alex Thompson",
        title: "Fitness Enthusiast",
        avatar: "🏋️",
        quote: "STICKIT changed everything. Having real money on the line kept me accountable when motivation faded."
    },
    {
        name: "Sarah Chen",
        title: "Entrepreneur",
        avatar: "🚀",
        quote: "The community aspect is incredible. Knowing others are cheering you on makes all the difference."
    },
    {
        name: "Michael Roberts",
        title: "Developer",
        avatar: "💻",
        quote: "Finally, a goal app that actually works. The blockchain verification adds a layer of trust I've never seen before."
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
            { label: "Community", href: "/community" },
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
