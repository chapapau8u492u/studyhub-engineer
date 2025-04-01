
-- Function to increment a value
CREATE OR REPLACE FUNCTION increment(value integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN value + 1;
END;
$$;
