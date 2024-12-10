import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
                <h1 className="text-5xl font-bold mb-6">
                    Forge Your Goals with Blockchain
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                    Set goals, stake tokens, and get rewarded for your achievements. 
                    Use blockchain technology to stay accountable and track your progress.
                </p>
                <div className="flex gap-4">
                    <Link href="/create">
                        <Button size="lg">Create Goal</Button>
                    </Link>
                    <Link href="/goals">
                        <Button variant="outline" size="lg">View Goals</Button>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
