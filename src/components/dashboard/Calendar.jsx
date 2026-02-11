"use client";

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { fadeInUp } from '@/lib/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar({ habits = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Build a map of check-in dates from habits data
    const checkInMap = useMemo(() => {
        const map = {};
        if (!habits || habits.length === 0) return map;

        habits.forEach((habit) => {
            const startDate = Number(habit.startDate) * 1000;
            const progress = Number(habit.progress);
            const totalDays = Number(habit.totalDays);

            // Mark days from start through progress count as checked-in
            for (let i = 0; i < progress && i < totalDays; i++) {
                const date = new Date(startDate + i * 86400000);
                const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                map[key] = true;
            }
        });
        return map;
    }, [habits]);

    // Calculate best streak from habits
    const bestStreak = useMemo(() => {
        if (!habits || habits.length === 0) return 0;
        return Math.max(...habits.map(h => Number(h.currentStreak)), 0);
    }, [habits]);

    const totalCheckIns = useMemo(() => {
        if (!habits || habits.length === 0) return 0;
        return habits.reduce((sum, h) => sum + Number(h.progress), 0);
    }, [habits]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const goToPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getDayStatus = (day) => {
        const key = `${year}-${month}-${day}`;
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const isFuture = date > today;
        const isCheckedIn = checkInMap[key];

        return { isToday, isFuture, isCheckedIn };
    };

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <motion.div {...fadeInUp} className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 glass text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Flame className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-muted-foreground">Current Streak</span>
                    </div>
                    <p className="text-xl font-bold text-amber-500">{bestStreak} days</p>
                </Card>
                <Card className="p-4 glass text-center">
                    <div className="text-xs text-muted-foreground mb-1">Total Check-Ins</div>
                    <p className="text-xl font-bold text-primary">{totalCheckIns}</p>
                </Card>
                <Card className="p-4 glass text-center">
                    <div className="text-xs text-muted-foreground mb-1">Active Goals</div>
                    <p className="text-xl font-bold text-accent">
                        {habits.filter(h => !h.completed && !h.verified).length}
                    </p>
                </Card>
            </div>

            {/* Calendar */}
            <Card className="p-5 glass">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-5">
                    <button
                        onClick={goToPrevMonth}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <h3 className="text-sm font-semibold">{monthName}</h3>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAYS.map(day => (
                        <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before the 1st */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Day cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const { isToday, isFuture, isCheckedIn } = getDayStatus(day);

                        return (
                            <motion.div
                                key={day}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.01 }}
                                className={`
                                    aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                                    transition-all duration-200 cursor-default relative
                                    ${isCheckedIn
                                        ? 'bg-primary/30 text-primary border border-primary/40 shadow-[0_0_8px_hsl(172_66%_50%/0.2)]'
                                        : isToday
                                            ? 'bg-accent/20 text-accent border border-accent/40'
                                            : isFuture
                                                ? 'text-muted-foreground/30'
                                                : 'text-muted-foreground hover:bg-secondary/50'
                                    }
                                `}
                            >
                                {day}
                                {isCheckedIn && (
                                    <Check className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 text-primary" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded bg-primary/30 border border-primary/40" />
                        <span>Checked In</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded bg-accent/20 border border-accent/40" />
                        <span>Today</span>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}