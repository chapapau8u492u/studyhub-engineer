
-- Function to increment note downloads
CREATE OR REPLACE FUNCTION increment_note_downloads(note_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE notes
  SET downloads = downloads + 1
  WHERE id = note_id;
END;
$$;
