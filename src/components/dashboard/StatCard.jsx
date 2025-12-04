import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function StatCard({ title, value, icon, trend }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative p-6 glass glass-hover overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground font-medium">{title}</span>
                            <motion.div 
                                className="text-2xl font-bold"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {value}
                            </motion.div>
                        </div>
                        <div className="p-2.5 rounded-xl glass border-primary/10">
                            <div className="text-primary">
                                {icon}
                            </div>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-2">
                        {/* Progress bar */}
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: "65%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>

                        {/* Trend */}
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">
                                vs last month
                            </span>
                            <span className="text-[hsl(var(--success))] font-medium">
                                {trend}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
