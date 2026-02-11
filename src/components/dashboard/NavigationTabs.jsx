import { motion } from 'framer-motion';
import { Activity, Calendar, CheckCircle2, Compass, Trophy, Zap } from 'lucide-react';

const tabs = [
    { id: 'active', label: 'Active', icon: Zap },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'nfts', label: 'NFTs', icon: Trophy },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'browse', label: 'Browse', icon: Compass },
];

export function NavigationTabs({ activeTab, setActiveTab }) {
    return (
        <div className="flex items-center gap-6 mb-8">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const TabIcon = tab.icon;

                return (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors ${isActive
                                ? 'text-primary'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                    >
                        <TabIcon className="h-4 w-4" />
                        <span>{tab.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
} 