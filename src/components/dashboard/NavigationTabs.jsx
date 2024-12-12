import { motion } from 'framer-motion';

const tabs = [
    { id: 'active', label: 'Active', icon: '⚡' },
    { id: 'completed', label: 'Completed', icon: '✅' },
    { id: 'nfts', label: 'NFTs', icon: '🏆' },
    { id: 'browse', label: 'Browse', icon: '🔍' },
];

export function NavigationTabs({ activeTab, setActiveTab }) {
    return (
        <div className="flex items-center gap-6 mb-8">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                
                return (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-2 text-sm font-medium transition-colors ${
                            isActive 
                                ? 'text-primary' 
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                    >
                        <span className="text-base">{tab.icon}</span>
                        <span>{tab.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
} 