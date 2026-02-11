"use client";

import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
    Users, 
    GraduationCap, 
    Calendar, 
    Code2, 
    Database, 
    Globe, 
    Layers, 
    Shield, 
    BookOpen,
    ExternalLink,
    Github
} from 'lucide-react';

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

export default function AboutPage() {
    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-16 py-8">
                {/* Header */}
                <motion.div 
                    className="text-center space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 mb-4">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                            About the Project
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        <span className="text-gradient">STICK</span>
                        <span className="text-foreground">IT</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A Web3-powered accountability platform for goal achievement — built as a Final Year Project
                    </p>
                    <p className="text-sm text-muted-foreground">
                        B.Tech Computer Science — Final Year Project
                    </p>
                </motion.div>

                {/* Project Overview */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-8 glass">
                        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            STICKIT addresses the persistent failure of traditional goal-tracking applications 
                            by introducing blockchain-based financial commitment. Users stake ERC-20 tokens on 
                            habit-based goals, and the smart contract either returns the stake with a 10% bonus 
                            upon verified completion, or burns it upon failure. A multi-step verification pipeline 
                            using GitHub API, Google Fit API, and GPT-4o-mini ensures proof integrity. Achievement 
                            NFTs provide permanent, on-chain records of accomplishment.
                        </p>
                    </Card>
                </motion.section>

                {/* Team Members */}
                <motion.section
                    initial="initial"
                    animate="animate"
                    variants={stagger}
                    className="space-y-6"
                >
                    <motion.div variants={fadeIn} className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Team Members</h2>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {teamMembers.map((member, index) => (
                            <motion.div key={index} variants={fadeIn}>
                                <Card className="p-6 glass glass-hover h-full">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-lg font-bold">
                                            {member.initials}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{member.name}</h3>
                                            <p className="text-sm text-primary">{member.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{member.description}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Institution & Supervisors */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Institution</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="p-6 glass">
                            <h3 className="font-semibold mb-2">University</h3>
                            <p className="text-muted-foreground">Your University Name</p>
                            <p className="text-sm text-muted-foreground mt-1">Department of Computer Science & Engineering</p>
                        </Card>
                        <Card className="p-6 glass">
                            <h3 className="font-semibold mb-2">Project Supervisor</h3>
                            <p className="text-muted-foreground">Prof. Supervisor Name</p>
                            <p className="text-sm text-muted-foreground mt-1">Department of Computer Science & Engineering</p>
                        </Card>
                    </div>
                </motion.section>

                {/* Project Duration */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Project Duration</h2>
                    </div>
                    
                    <Card className="p-6 glass">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {projectTimeline.map((item, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-2xl font-bold text-primary">{item.value}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.section>

                {/* Technologies Used */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <Layers className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Technologies Used</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {techCategories.map((category, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-6 glass glass-hover h-full">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center">
                                            {category.icon}
                                        </div>
                                        <h3 className="font-semibold">{category.title}</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {category.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Documentation Links */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Documentation</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {docLinks.map((doc, index) => (
                            <Link key={index} href={doc.href} target="_blank">
                                <Card className="p-5 glass glass-hover cursor-pointer group">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">{doc.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.div 
                    className="text-center glass rounded-2xl p-10 relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
                    <div className="relative space-y-4">
                        <h2 className="text-2xl font-bold">Ready to Try STICKIT?</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Connect your wallet, stake tokens on a goal, and experience blockchain-powered accountability.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link href="/create">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                                    Create a Goal
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="secondary" className="glass hover:bg-secondary/80">
                                    View Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}

// ── Data ──────────────────────────────────────────────

const teamMembers = [
    {
        name: "Your Name",
        initials: "YN",
        role: "Full-Stack Developer",
        description: "Smart contract development, frontend architecture, API integration, and system design."
    },
    {
        name: "Team Member 2",
        initials: "TM",
        role: "Frontend Developer",
        description: "UI/UX design, React components, animations, and responsive layout implementation."
    }
];

const projectTimeline = [
    { value: "Aug 2025", label: "Start Date" },
    { value: "Feb 2026", label: "End Date" },
    { value: "6 Months", label: "Duration" },
    { value: "2025–26", label: "Academic Year" }
];

const techCategories = [
    {
        title: "Frontend",
        icon: <Globe className="h-5 w-5 text-primary" />,
        items: ["Next.js 15", "React 19", "Tailwind CSS", "Framer Motion", "RainbowKit"]
    },
    {
        title: "Blockchain",
        icon: <Shield className="h-5 w-5 text-primary" />,
        items: ["Solidity ^0.8.0", "OpenZeppelin", "Base Sepolia", "wagmi", "viem"]
    },
    {
        title: "Verification",
        icon: <Code2 className="h-5 w-5 text-primary" />,
        items: ["GitHub Events API", "Google Fit API", "OpenRouter (GPT-4o-mini)"]
    },
    {
        title: "Testing",
        icon: <Database className="h-5 w-5 text-primary" />,
        items: ["Hardhat", "Chai", "Ethers.js v6"]
    },
    {
        title: "Deployment",
        icon: <Layers className="h-5 w-5 text-primary" />,
        items: ["Vercel", "Hardhat Deploy", "Base Sepolia Testnet"]
    },
    {
        title: "Tools",
        icon: <Code2 className="h-5 w-5 text-primary" />,
        items: ["VS Code", "Git & GitHub", "npm"]
    }
];

const docLinks = [
    {
        title: "System Architecture",
        description: "Frontend, backend, smart contracts, and verification flow.",
        href: "https://github.com/SamsShow/GoalForge/blob/main/docs/ARCHITECTURE.md"
    },
    {
        title: "Software Requirements Specification",
        description: "Functional and non-functional requirements.",
        href: "https://github.com/SamsShow/GoalForge/blob/main/docs/SRS.md"
    },
    {
        title: "API Reference",
        description: "REST endpoints and smart contract interfaces.",
        href: "https://github.com/SamsShow/GoalForge/blob/main/docs/API.md"
    },
    {
        title: "Data Model & ER Diagram",
        description: "On-chain and off-chain data structures.",
        href: "https://github.com/SamsShow/GoalForge/blob/main/docs/ER_DIAGRAM.md"
    }
];
