import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function StatCard({ title, value, icon, trend }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative p-6 bg-[#1c1c1c] border-[#2a2a2a] hover:border-[#3a3a3a] transition-all duration-300">
                <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-400">{title}</span>
                            <motion.div 
                                className="text-2xl font-semibold text-white"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {value}
                            </motion.div>
                        </div>
                        <div className="p-2 rounded-lg bg-[#252525]">
                            <div className="text-[#6c6c6c]">
                                {icon}
                            </div>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-2">
                        {/* Progress bar */}
                        <div className="h-1 bg-[#252525] rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-[#7F56D9]"
                                initial={{ width: 0 }}
                                animate={{ width: "60%" }}
                                transition={{ duration: 1 }}
                            />
                        </div>

                        {/* Trend */}
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[#6c6c6c]">
                                Compared to last month
                            </span>
                            <span className="text-[#22c55e]">
                                {trend}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
} 