/*
  # Encrypt submissions + tighten RLS

  - Adds encrypted storage columns for message content
  - Makes plaintext columns nullable (so we can stop storing raw content)
  - Adds triage metadata fields (category/risk/flags)
  - Tightens RLS to prevent public reads/updates/deletes
*/

-- 1) Add encrypted columns + triage metadata
ALTER TABLE IF EXISTS contact_submissions
  ADD COLUMN IF NOT EXISTS encrypted_message text,
  ADD COLUMN IF NOT EXISTS encryption_iv text,
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS risk_level text DEFAULT 'low',
  ADD COLUMN IF NOT EXISTS flags jsonb DEFAULT '[]'::jsonb;

ALTER TABLE IF EXISTS prayer_requests
  ADD COLUMN IF NOT EXISTS encrypted_message text,
  ADD COLUMN IF NOT EXISTS encryption_iv text,
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'prayer',
  ADD COLUMN IF NOT EXISTS risk_level text DEFAULT 'low',
  ADD COLUMN IF NOT EXISTS flags jsonb DEFAULT '[]'::jsonb;

-- 2) Make name/email optional (anonymous by default) and stop requiring plaintext content
ALTER TABLE IF EXISTS contact_submissions
  ALTER COLUMN name DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN message DROP NOT NULL;

ALTER TABLE IF EXISTS prayer_requests
  ALTER COLUMN prayer_request DROP NOT NULL;

-- 3) Tighten RLS: public (anon) can INSERT only.
DO $$
BEGIN
  -- Contact submissions policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_submissions' AND policyname = 'Allow public select on contact_submissions') THEN
    EXECUTE 'DROP POLICY "Allow public select on contact_submissions" ON contact_submissions';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_submissions' AND policyname = 'Allow public update on contact_submissions') THEN
    EXECUTE 'DROP POLICY "Allow public update on contact_submissions" ON contact_submissions';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_submissions' AND policyname = 'Allow public delete on contact_submissions') THEN
    EXECUTE 'DROP POLICY "Allow public delete on contact_submissions" ON contact_submissions';
  END IF;

  -- Prayer requests policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'prayer_requests' AND policyname = 'Allow public select on prayer_requests') THEN
    EXECUTE 'DROP POLICY "Allow public select on prayer_requests" ON prayer_requests';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'prayer_requests' AND policyname = 'Allow public update on prayer_requests') THEN
    EXECUTE 'DROP POLICY "Allow public update on prayer_requests" ON prayer_requests';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'prayer_requests' AND policyname = 'Allow public delete on prayer_requests') THEN
    EXECUTE 'DROP POLICY "Allow public delete on prayer_requests" ON prayer_requests';
  END IF;
END $$;

-- Ensure insert policies exist (idempotent-ish; will error if duplicated in some setups)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='contact_submissions' AND policyname='Anyone can submit contact forms')
     AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='contact_submissions' AND policyname='Allow public insert on contact_submissions') THEN
    EXECUTE 'CREATE POLICY "Anyone can submit contact forms" ON contact_submissions FOR INSERT TO anon WITH CHECK (true)';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='prayer_requests' AND policyname='Anyone can submit prayer requests')
     AND NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='prayer_requests' AND policyname='Allow public insert on prayer_requests') THEN
    EXECUTE 'CREATE POLICY "Anyone can submit prayer requests" ON prayer_requests FOR INSERT TO anon WITH CHECK (true)';
  END IF;
END $$;

-- Authenticated users (ministry admins) can read/update/delete
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='contact_submissions' AND policyname='Authenticated users can view contact submissions') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can view contact submissions" ON contact_submissions FOR SELECT TO authenticated USING (true)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='contact_submissions' AND policyname='Authenticated users can update contact submissions') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can update contact submissions" ON contact_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='contact_submissions' AND policyname='Authenticated users can delete contact submissions') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can delete contact submissions" ON contact_submissions FOR DELETE TO authenticated USING (true)';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='prayer_requests' AND policyname='Authenticated users can view prayer requests') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can view prayer requests" ON prayer_requests FOR SELECT TO authenticated USING (true)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='prayer_requests' AND policyname='Authenticated users can update prayer requests') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can update prayer requests" ON prayer_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='prayer_requests' AND policyname='Authenticated users can delete prayer requests') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can delete prayer requests" ON prayer_requests FOR DELETE TO authenticated USING (true)';
  END IF;
END $$;
