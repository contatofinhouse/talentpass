-- Add level column to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS level TEXT CHECK (level IN ('iniciante', 'intermediário', 'avançado'));

-- Update existing courses with default level (you can customize these based on your courses)
UPDATE courses SET level = 'iniciante' WHERE level IS NULL;

-- Make level NOT NULL after setting defaults
ALTER TABLE courses ALTER COLUMN level SET NOT NULL;

-- Add comment to column
COMMENT ON COLUMN courses.level IS 'Nível do curso: iniciante, intermediário ou avançado';
