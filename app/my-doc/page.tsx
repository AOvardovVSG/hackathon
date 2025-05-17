import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/utils/supabase/server';
import MyDocTable from '@/app/components/MyDocTable';

export default async function MyDocPage() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const supabase = await createClient();

  console.log('Current user email:', userEmail);

  if (!userEmail) {
    return (
      <div className="p-4">
        <p>Please sign in to view your assessments.</p>
      </div>
    );
  }

  // Get user's data from Clerk
  const { data: userData } = await supabase
    .from('employees')
    .select('id')
    .eq('email', userEmail)
    .single();

  console.log('Employee data:', userData);

  if (!userData) {
    return (
      <div className="p-4">
        <p>No employee record found for your account.</p>
      </div>
    );
  }

  // Fetch assessments with joined data
  const { data: assessments, error: assessmentsError } = await supabase
    .from('assessments')
    .select(`
      *,
      form:forms(*)
    `)
    .contains('employee_ids', [userData.id])
    .order('created_at', { ascending: false });

  console.log('Assessments with forms:', assessments);

  if (assessmentsError) {
    console.error('Error fetching assessments:', assessmentsError);
    return (
      <div className="p-4">
        <p>Error loading assessments. Please try again later.</p>
      </div>
    );
  }

  // Then, fetch questions for each form
  const assessmentsWithQuestions = await Promise.all(
    (assessments || []).map(async (assessment) => {
      if (!assessment.form?.questions) return assessment;

      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .in('id', assessment.form.questions);

      return {
        ...assessment,
        form: {
          ...assessment.form,
          questions: questions || []
        }
      };
    })
  );

  console.log('Final assessments with questions:', assessmentsWithQuestions);

  return (
    <div className="pt-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">My Documents</h2>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your assessment documents and forms.
          </p>
        </div>
      </div>
      <MyDocTable assessments={assessmentsWithQuestions} employeeId={userData.id} />
    </div>
  );
} 