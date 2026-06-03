-- Add source tracking and verification to donations table
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS source TEXT CHECK (source IN ('self', 'campaign', 'hospital_auto')) DEFAULT 'self',
  ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES campaigns(id);

-- Fast cooldown lookup index
CREATE INDEX IF NOT EXISTS donations_cooldown_idx ON donations(donor_id, cooldown_ends_at DESC);

-- RLS policy: donors can read all for public profile display (already set), no change needed.
-- Existing policy "Donations publicly viewable" covers SELECT.
-- Existing policy "Donors can insert own donations" covers INSERT.
-- Existing policy "Donors can update own donations" covers UPDATE for certificate upload.
