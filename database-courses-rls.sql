-- Enable RLS on courses table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all courses
CREATE POLICY "Allow authenticated users to read courses"
ON courses
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow admins to insert courses
CREATE POLICY "Allow admins to insert courses"
ON courses
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Allow admins to update courses
CREATE POLICY "Allow admins to update courses"
ON courses
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Policy: Allow admins to delete courses
CREATE POLICY "Allow admins to delete courses"
ON courses
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
