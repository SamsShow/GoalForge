import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/layout/Layout";

export default function Loading() {
    return (
        <Layout>
            <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-[120px] w-full" />
                    ))}
                </div>
                <Skeleton className="h-[500px] w-full" />
            </div>
        </Layout>
    );
} 