-- Create QuestionAnswers table
CREATE TABLE question_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Add unique constraint to prevent duplicate answers for the same question in an assessment
    UNIQUE(employee_id, assessment_id, question_id)
);

-- Create trigger for updated_at
CREATE TRIGGER update_question_answers_updated_at
    BEFORE UPDATE ON question_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
