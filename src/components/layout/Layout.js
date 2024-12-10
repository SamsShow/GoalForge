"use client";

import Navbar from './Navbar';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-6 py-8">
                <div className="grid gap-6">
                    {children}
                </div>
            </main>
        </div>
    );
} 