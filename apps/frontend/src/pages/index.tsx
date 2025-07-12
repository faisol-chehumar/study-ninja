import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
        <h1 className="text-4xl font-bold text-center">Welcome to Study Ninja</h1>
        <p className="text-lg text-muted-foreground text-center max-w-md">
          A practice exam platform for children preparing to enter elementary school
        </p>
        <div className="flex space-x-4">
          <Button size="lg">Start Practice Exam</Button>
          <Button variant="outline" size="lg">View Progress</Button>
        </div>
      </div>
    </Layout>
  );
}
