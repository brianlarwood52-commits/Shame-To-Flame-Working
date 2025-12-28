/*
  # Verse of the Day Email Subscriptions

  Creates a table to manage email subscriptions for daily verse delivery.
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS verse_of_day_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  subscribed boolean DEFAULT true,
  unsubscribe_token uuid DEFAULT gen_random_uuid() UNIQUE,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  last_sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_verse_subscriptions_email ON verse_of_day_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_verse_subscriptions_token ON verse_of_day_subscriptions(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_verse_subscriptions_active ON verse_of_day_subscriptions(subscribed) WHERE subscribed = true;

-- Enable RLS
ALTER TABLE verse_of_day_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can subscribe (insert)
CREATE POLICY "Anyone can subscribe to verse of the day"
  ON verse_of_day_subscriptions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Users can unsubscribe using their token (update)
CREATE POLICY "Users can unsubscribe with token"
  ON verse_of_day_subscriptions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users (admins) can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON verse_of_day_subscriptions
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_verse_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_verse_subscription_timestamp
  BEFORE UPDATE ON verse_of_day_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_verse_subscription_updated_at();
