import { createClient } from '@/utils/supabase/server';
import EmployeeManagement from '../components/EmployeeManagement';

export default async function OrgPage() {
  const supabase = await createClient();

  console.log('Fetching employees...');
  const { data: employees, error } = await supabase
    .from('employees')
    .select('*')
    .order('first_name', { ascending: true });

  console.log('Employees data:', employees);
  console.log('Error if any:', error);

  return <EmployeeManagement initialEmployees={employees || []} />;
} 