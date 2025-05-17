import { createClient } from '@/utils/supabase/server';
import { currentUser } from '@clerk/nextjs/server';
import UserGoalsTable from '../components/UserGoalsTable';

export default async function GoalsPage() {
  const user = await currentUser();
  const supabase = await createClient();

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return <div className="p-4">User not found</div>;
  }

  // Get employee by email
  const { data: employee } = await supabase
    .from('employees')
    .select('id')
    .eq('email', user.emailAddresses[0].emailAddress)
    .single();

  if (!employee) {
    return <div className="p-4">Employee not found</div>;
  }

  // Fetch goals with tasks and employee data
  const { data: goals } = await supabase
    .from('goals')
    .select(`
      *,
      tasks:tasks (*),
      employee:employees!inner (
        display_name
      )
    `)
    .eq('employee_id', employee.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Goals</h1>
      <UserGoalsTable goals={goals || []} />
    </div>
  );
} 