import { createClient } from '@/utils/supabase/server';
import { currentUser } from '@clerk/nextjs/server';
import GoalsTable from '../components/GoalsTable';

export default async function GoalsPage() {
  const user = await currentUser();
  const supabase = await createClient();

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return <div className="p-4">User not found</div>;
  }

  const { data: goals } = await supabase
    .from('goals')
    .select(`
      id,
      title,
      due_date,
      type,
      tasks:tasks (
        id,
        complete,
        updated_at
      ),
      employee:employees!inner (
        email
      )
    `)
    .eq('employee.email', user.emailAddresses[0].emailAddress);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Goals</h1>
      <GoalsTable goals={goals || []} />
    </div>
  );
} 