"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { HabitModal } from '@/components/habits/HabitModal';
import { motion } from 'framer-motion';

const HABIT_TYPES = [
    {
        id: 0,
        title: "Level Up Your Coding Skills!",
        description: "Make one GitHub contribution daily",
        icon: "</>",
        gradient: "from-[#0d1117] to-[#161b22]"
    },
    {
        id: 1,
        title: "Master DSA Skills",
        description: "Solve one LeetCode problem daily",
        icon: "{}",
        gradient: "from-[#1a1625] to-[#231c31]"
    },
    {
        id: 2,
        title: "Gym Training Goal",
        description: "Complete daily workout sessions",
        icon: "▲",
        gradient: "from-[#1a1516] to-[#231c1d]"
    },
    {
        id: 3,
        title: "Daily Yoga Practice",
        description: "Complete one yoga session daily",
        icon: "◉",
        gradient: "from-[#151a16] to-[#1c231d]"
    },
    {
        id: 4,
        title: "Running Challenge",
        description: "Achieve your daily running goals",
        icon: "»",
        gradient: "from-[#1a1915] to-[#23211c]"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function BrowseHabits() {
    const [selectedHabit, setSelectedHabit] = useState(null);

    return (
        <>
            <motion.div 
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {HABIT_TYPES.map((habit) => (
                    <motion.div
                        key={habit.id}
                        variants={item}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card 
                            className={`cursor-pointer glass glass-hover overflow-hidden`}
                            onClick={() => setSelectedHabit(habit.id)}
                        >
                            <div className={`p-6 space-y-4 bg-gradient-to-br ${habit.gradient}`}>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl glass border-primary/10">
                                        <span className="text-3xl">{habit.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-1">
                                            {habit.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {habit.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Click to start</span>
                                    <span className="text-primary">→</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {selectedHabit !== null && (
                <HabitModal
                    isOpen={true}
                    onClose={() => setSelectedHabit(null)}
                    habitType={selectedHabit}
                    {...HABIT_TYPES[selectedHabit]}
                />
            )}
        </>
    );
}
