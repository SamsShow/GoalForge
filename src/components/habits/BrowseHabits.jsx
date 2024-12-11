"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HabitModal } from '@/components/habits/HabitModal';

const HABIT_TYPES = [
    {
        id: 0,
        title: "Level Up Your Coding Skills!",
        description: "Make one GitHub contribution daily",
        icon: "💻"
    },
    {
        id: 1,
        title: "Master DSA Skills",
        description: "Solve one LeetCode problem daily",
        icon: "🧮"
    },
    {
        id: 2,
        title: "Gym Training Goal",
        description: "Complete daily workout sessions",
        icon: "💪"
    },
    {
        id: 3,
        title: "Daily Yoga Practice",
        description: "Complete one yoga session daily",
        icon: "🧘"
    },
    {
        id: 4,
        title: "Running Challenge",
        description: "Achieve your daily running goals",
        icon: "🏃"
    }
];

export function BrowseHabits() {
    const [selectedHabit, setSelectedHabit] = useState(null);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {HABIT_TYPES.map((habit) => (
                    <Card 
                        key={habit.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setSelectedHabit(habit.id)}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>{habit.icon}</span>
                                {habit.title}
                            </CardTitle>
                            <CardDescription>{habit.description}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>

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