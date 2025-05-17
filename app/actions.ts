'use server';

import { createClient } from '@/utils/supabase/server';

interface CreateEmployeeData {
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName?: string;
  email: string;
  positionId: string;
  address: string;
  siteId: string;
  managerId?: string;
  employmentType: 'fullTime' | 'partTime';
  startDate: string;
  endDate?: string;
  departmentId: string;
}

interface UpdateEmployeeData extends CreateEmployeeData {
  id: string;
}

interface LookupData {
  name?: string;
  city?: string;
}

interface FormData {
  name: string;
  questions: string[];
}

interface QuestionData {
  name: string;
  type: 'Text' | 'YesNoQuestion';
}

interface CreateGoalData {
  title: string;
  employee_id: string;
  timeframe: string;
  due_date: string;
  type: 'Personal' | 'Department' | 'Company';
  tasks: {
    title: string;
    complete: boolean;
  }[];
}

// Task interface is defined in UserGoalsTable component

export async function createEmployee(data: CreateEmployeeData) {
  const supabase = await createClient();

  try {
    const { data: newEmployee, error } = await supabase
      .from('employees')
      .insert([
        {
          first_name: data.firstName,
          middle_name: data.middleName || null,
          last_name: data.lastName,
          display_name: data.displayName || `${data.firstName} ${data.lastName}`,
          email: data.email,
          position_id: data.positionId,
          address: data.address,
          site_id: data.siteId,
          manager_id: data.managerId || null,
          employment_type: data.employmentType,
          start_date: data.startDate,
          end_date: data.endDate || null,
          department_id: data.departmentId,
          picture_url: null // TODO: Implement image upload
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: newEmployee };
  } catch (error) {
    console.error('Error creating employee:', error);
    return { success: false, error: 'Failed to create employee' };
  }
}

export async function updateEmployee(data: UpdateEmployeeData) {
  const supabase = await createClient();

  try {
    const { data: updatedEmployee, error } = await supabase
      .from('employees')
      .update({
        first_name: data.firstName,
        middle_name: data.middleName || null,
        last_name: data.lastName,
        display_name: data.displayName || `${data.firstName} ${data.lastName}`,
        email: data.email,
        position_id: data.positionId,
        address: data.address,
        site_id: data.siteId,
        manager_id: data.managerId || null,
        employment_type: data.employmentType,
        start_date: data.startDate,
        end_date: data.endDate || null,
        department_id: data.departmentId
      })
      .eq('id', data.id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: updatedEmployee };
  } catch (error) {
    console.error('Error updating employee:', error);
    return { success: false, error: 'Failed to update employee' };
  }
}

export async function deleteEmployee(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return { success: false, error: 'Failed to delete employee' };
  }
}

export async function createLookup(type: 'position' | 'department' | 'site', data: LookupData) {
  const supabase = await createClient();

  try {
    const { data: newItem, error } = await supabase
      .from(`${type}s`)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: newItem };
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    return { success: false, error: `Failed to create ${type}` };
  }
}

export async function updateLookup(type: 'position' | 'department' | 'site', id: string, data: LookupData) {
  const supabase = await createClient();

  try {
    const { data: updatedItem, error } = await supabase
      .from(`${type}s`)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    return { success: false, error: `Failed to update ${type}` };
  }
}

export async function deleteLookup(type: 'position' | 'department' | 'site', id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from(`${type}s`)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    return { success: false, error: `Failed to delete ${type}` };
  }
}

export async function createForm(data: FormData) {
  const supabase = await createClient();

  try {
    const { data: newForm, error } = await supabase
      .from('forms')
      .insert([{
        name: data.name,
        questions: data.questions
      }])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: newForm };
  } catch (error) {
    console.error('Error creating form:', error);
    return { success: false, error: 'Failed to create form' };
  }
}

export async function updateForm(id: string, data: FormData) {
  const supabase = await createClient();

  try {
    const { data: updatedForm, error } = await supabase
      .from('forms')
      .update({
        name: data.name,
        questions: data.questions
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: updatedForm };
  } catch (error) {
    console.error('Error updating form:', error);
    return { success: false, error: 'Failed to update form' };
  }
}

export async function createQuestion(data: QuestionData) {
  const supabase = await createClient();

  try {
    const { data: newQuestion, error } = await supabase
      .from('questions')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: newQuestion };
  } catch (error) {
    console.error('Error creating question:', error);
    return { success: false, error: 'Failed to create question' };
  }
}

export async function createAssessment(data: {
  form_id: string;
  employee_ids: string[];
}) {
  const supabase = await createClient();

  try {
    const { data: newAssessment, error } = await supabase
      .from('assessments')
      .insert([{
        form_id: data.form_id,
        employee_ids: data.employee_ids,
        completed_employee_ids: []
      }])
      .select('*, form:forms(*)')
      .single();

    if (error) throw error;

    return {
      success: true,
      data: newAssessment
    };
  } catch (error) {
    console.error('Error creating assessment:', error);
    return {
      success: false,
      error: 'Failed to create assessment'
    };
  }
}

export async function updateAssessmentCompletion(assessmentId: string, employeeId: string, completedEmployeeIds: string[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('assessments')
    .update({
      completed_employee_ids: [...completedEmployeeIds, employeeId],
    })
    .eq('id', assessmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveQuestionAnswers(
  employeeId: string,
  assessmentId: string,
  answers: { questionId: string; answer: string }[]
) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('question_answers')
      .insert(
        answers.map(({ questionId, answer }) => ({
          employee_id: employeeId,
          assessment_id: assessmentId,
          question_id: questionId,
          answer,
        }))
      )
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function submitAssessment(
  assessmentId: string,
  employeeId: string,
  completedEmployeeIds: string[],
  answers: { questionId: string; answer: string }[]
) {
  try {
    // Update assessment completion status
    const updatedAssessment = await updateAssessmentCompletion(assessmentId, employeeId, completedEmployeeIds);
    
    // Save all answers
    const savedAnswers = await saveQuestionAnswers(employeeId, assessmentId, answers);

    return { success: true, data: { assessment: updatedAssessment, answers: savedAnswers } };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getAssessmentAnswers(assessmentId: string, employeeId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('question_answers')
      .select('*')
      .eq('assessment_id', assessmentId)
      .eq('employee_id', employeeId);

    if (error) throw error;

    // Convert answers array to record
    const answersRecord: Record<string, string> = {};
    data?.forEach((answer: { question_id: string; answer: string }) => {
      answersRecord[answer.question_id] = answer.answer;
    });

    return { success: true, data: answersRecord };
  } catch {
    return { success: false, error: 'Failed to load answers' };
  }
}

export async function createGoal(data: CreateGoalData) {
  try {
    const supabase = await createClient();

    // Start a transaction
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .insert({
        title: data.title,
        employee_id: data.employee_id,
        timeframe: data.timeframe,
        due_date: data.due_date,
        type: data.type
      })
      .select(`
        *,
        employee:employees (
          id,
          display_name
        )
      `)
      .single();

    if (goalError) throw goalError;

    // Create tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .insert(
        data.tasks.map(task => ({
          title: task.title,
          complete: task.complete
        }))
      )
      .select();

    if (tasksError) throw tasksError;

    // Create goal-task relationships
    const { error: relationshipError } = await supabase
      .from('goal_tasks')
      .insert(
        tasks.map(task => ({
          goal_id: goal.id,
          task_id: task.id
        }))
      );

    if (relationshipError) throw relationshipError;

    return {
      success: true,
      data: {
        ...goal,
        tasks
      }
    };
  } catch (error) {
    return {
      success: false,
      error
    };
  }
}

export async function updateTask(taskId: string, complete: boolean) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tasks')
    .update({ complete, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
} 