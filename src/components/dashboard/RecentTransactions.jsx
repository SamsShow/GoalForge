"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight, ArrowDownLeft, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { getHabitIcon, fadeInUp } from '@/lib/utils';

const BASE_EXPLORER = 'https://sepolia.basescan.org/tx/';

function getTransactionType(habit) {
    if (habit.completed && habit.verified) return 'completed';
    if (!habit.completed && habit.verified) return 'failed';
    if (Number(habit.progress) > 0) return 'checkin';
    return 'created';
}

function getTransactionIcon(type) {
    switch (type) {
        case 'completed': return <CheckCircle2 className="w-4 h-4 text-[hsl(var(--success))]" />;
        case 'failed': return <XCircle className="w-4 h-4 text-[hsl(var(--error))]" />;
        case 'checkin': return <ArrowUpRight className="w-4 h-4 text-primary" />;
        case 'created': return <Sparkles className="w-4 h-4 text-accent" />;
        default: return <ArrowDownLeft className="w-4 h-4 text-muted-foreground" />;
    }
}

function getTransactionLabel(type) {
    switch (type) {
        case 'completed': return 'Goal Completed';
        case 'failed': return 'Goal Failed';
        case 'checkin': return 'Check-In';
        case 'created': return 'Goal Created';
        default: return 'Transaction';
    }
}

function getTransactionColor(type) {
    switch (type) {
        case 'completed': return 'text-[hsl(var(--success))]';
        case 'failed': return 'text-[hsl(var(--error))]';
        case 'checkin': return 'text-primary';
        case 'created': return 'text-accent';
        default: return 'text-muted-foreground';
    }
}

export function RecentTransactions({ habits = [] }) {
    const transactions = useMemo(() => {
        if (!habits || habits.length === 0) return [];

        return habits.map((habit, index) => {
            const type = getTransactionType(habit);
            const stake = Number(habit.stake) / 1e18; // Convert from wei
            const startDate = new Date(Number(habit.startDate) * 1000);

            return {
                id: index,
                type,
                title: habit.title,
                habitType: Number(habit.habitType),
                stake,
                date: startDate,
                progress: Number(habit.progress),
                totalDays: Number(habit.totalDays),
            };
        }).sort((a, b) => b.date - a.date); // Most recent first
    }, [habits]);

    if (transactions.length === 0) {
        return (
            <motion.div {...fadeInUp}>
                <Card className="p-8 glass text-center">
                    <p className="text-muted-foreground text-sm">No transactions yet. Create a goal to get started!</p>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div {...fadeInUp}>
            <Card className="glass overflow-hidden">
                <div className="p-4 border-b border-border/50">
                    <h3 className="text-sm font-semibold">Recent Activity</h3>
                </div>

                <div className="divide-y divide-border/30">
                    {transactions.map((tx, i) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="px-4 py-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors"
                        >
                            {/* Icon */}
                            <div className="p-2 rounded-lg bg-secondary/50 shrink-0">
                                {getTransactionIcon(tx.type)}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium truncate">{tx.title}</span>
                                    <span className="text-base shrink-0">{getHabitIcon(tx.habitType)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className={getTransactionColor(tx.type)}>
                                        {getTransactionLabel(tx.type)}
                                    </span>
                                    <span>•</span>
                                    <span>{tx.date.toLocaleDateString()}</span>
                                    {tx.type === 'checkin' && (
                                        <>
                                            <span>•</span>
                                            <span>{tx.progress}/{tx.totalDays} days</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Stake Amount */}
                            <div className="text-right shrink-0">
                                <p className={`text-sm font-medium ${tx.type === 'completed' ? 'text-[hsl(var(--success))]' :
                                    tx.type === 'failed' ? 'text-[hsl(var(--error))]' :
                                        'text-foreground'
                                    }`}>
                                    {tx.type === 'completed' ? '+' : tx.type === 'failed' ? '-' : ''}{tx.stake.toFixed(1)} GOAL
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
}