-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Blood group enum
CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Donor level enum
CREATE TYPE donor_level AS ENUM ('new', 'bronze', 'silver', 'gold', 'hero');

-- Urgency enum
CREATE TYPE urgency_level AS ENUM ('critical', 'urgent', 'normal');

-- Request status enum
CREATE TYPE request_status AS ENUM ('open', 'fulfilled', 'expired');

-- Campaign status enum
CREATE TYPE campaign_status AS ENUM ('active', 'fulfilled', 'cancelled');

-- Match status enum
CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'declined', 'completed');

-- Volunteer status enum
CREATE TYPE volunteer_status AS ENUM ('pending', 'confirmed', 'attended');

-- Notification type enum
CREATE TYPE notification_type AS ENUM (
  'cooldown_expired', 'new_request_match', 'campaign_nearby',
  'thank_you', 'volunteer_confirmed', 'badge_awarded', 'request_fulfilled'
);

-- Badge type enum
CREATE TYPE badge_type AS ENUM (
  'first_drop', 'bronze_heart', 'silver_vein', 'gold_pulse', 'hero_status'
);

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  blood_group blood_group NOT NULL,
  nid_number TEXT,
  nid_verified BOOLEAN DEFAULT false,
  profile_photo_url TEXT,
  is_available BOOLEAN DEFAULT true,
  privacy_mode BOOLEAN DEFAULT false,
  donor_level donor_level DEFAULT 'new',
  total_donations INTEGER DEFAULT 0,
  district TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DONATIONS TABLE
-- ============================================================
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  donated_at TIMESTAMPTZ NOT NULL,
  hospital_name TEXT NOT NULL,
  location_text TEXT NOT NULL,
  district TEXT NOT NULL,
  notes TEXT,
  cooldown_ends_at TIMESTAMPTZ NOT NULL,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX donations_donor_id_idx ON donations(donor_id);
CREATE INDEX donations_donated_at_idx ON donations(donated_at DESC);

-- ============================================================
-- BLOOD REQUESTS TABLE
-- ============================================================
CREATE TABLE blood_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  blood_group_needed blood_group NOT NULL,
  units_needed INTEGER NOT NULL DEFAULT 1,
  hospital_name TEXT NOT NULL,
  district TEXT NOT NULL,
  location_text TEXT NOT NULL,
  urgency urgency_level NOT NULL DEFAULT 'normal',
  status request_status NOT NULL DEFAULT 'open',
  contact_phone TEXT NOT NULL,
  message TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX blood_requests_status_idx ON blood_requests(status);
CREATE INDEX blood_requests_blood_group_idx ON blood_requests(blood_group_needed);
CREATE INDEX blood_requests_district_idx ON blood_requests(district);

-- ============================================================
-- CAMPAIGNS TABLE
-- ============================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  blood_groups_needed blood_group[] NOT NULL DEFAULT '{}',
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  district TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  status campaign_status NOT NULL DEFAULT 'active',
  volunteers_needed INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX campaigns_status_idx ON campaigns(status);
CREATE INDEX campaigns_district_idx ON campaigns(district);
CREATE INDEX campaigns_event_date_idx ON campaigns(event_date);

-- ============================================================
-- CAMPAIGN VOLUNTEERS TABLE
-- ============================================================
CREATE TABLE campaign_volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status volunteer_status DEFAULT 'pending',
  UNIQUE(campaign_id, donor_id)
);

CREATE INDEX campaign_volunteers_campaign_idx ON campaign_volunteers(campaign_id);
CREATE INDEX campaign_volunteers_donor_idx ON campaign_volunteers(donor_id);

-- ============================================================
-- REQUEST MATCHES TABLE
-- ============================================================
CREATE TABLE request_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status match_status NOT NULL DEFAULT 'pending',
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  thank_you_message TEXT,
  UNIQUE(request_id, donor_id)
);

CREATE INDEX request_matches_request_idx ON request_matches(request_id);
CREATE INDEX request_matches_donor_idx ON request_matches(donor_id);

-- ============================================================
-- HOSPITALS TABLE
-- ============================================================
CREATE TABLE hospitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  phone TEXT NOT NULL,
  emergency_phone TEXT,
  has_blood_bank BOOLEAN DEFAULT false,
  is_24hr BOOLEAN DEFAULT false,
  ambulance_numbers TEXT[] DEFAULT '{}'
);

CREATE INDEX hospitals_district_idx ON hospitals(district);
CREATE INDEX hospitals_blood_bank_idx ON hospitals(has_blood_bank);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX notifications_user_idx ON notifications(user_id);
CREATE INDEX notifications_read_idx ON notifications(user_id, is_read);

-- ============================================================
-- DONOR BADGES TABLE
-- ============================================================
CREATE TABLE donor_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type badge_type NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(donor_id, badge_type)
);

CREATE INDEX donor_badges_donor_idx ON donor_badges(donor_id);

-- ============================================================
-- PUSH SUBSCRIPTIONS TABLE
-- ============================================================
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subscription)
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "Profiles are publicly viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Donations: donor can see own, others see count only
CREATE POLICY "Donations publicly viewable" ON donations FOR SELECT USING (true);
CREATE POLICY "Donors can insert own donations" ON donations FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Donors can update own donations" ON donations FOR UPDATE USING (auth.uid() = donor_id);

-- Blood requests: public read
CREATE POLICY "Blood requests publicly viewable" ON blood_requests FOR SELECT USING (true);
CREATE POLICY "Verified users can create requests" ON blood_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Requesters can update own requests" ON blood_requests FOR UPDATE USING (auth.uid() = requester_id);

-- Campaigns: public read
CREATE POLICY "Campaigns publicly viewable" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Verified users can create campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own campaigns" ON campaigns FOR UPDATE USING (auth.uid() = organizer_id);

-- Campaign volunteers
CREATE POLICY "Volunteers publicly viewable" ON campaign_volunteers FOR SELECT USING (true);
CREATE POLICY "Users can join campaigns" ON campaign_volunteers FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Users can update own volunteer status" ON campaign_volunteers FOR UPDATE USING (auth.uid() = donor_id);

-- Request matches
CREATE POLICY "Matches viewable by involved parties" ON request_matches FOR SELECT USING (
  auth.uid() = donor_id OR
  auth.uid() = (SELECT requester_id FROM blood_requests WHERE id = request_id)
);
CREATE POLICY "Donors can create matches" ON request_matches FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Involved parties can update matches" ON request_matches FOR UPDATE USING (
  auth.uid() = donor_id OR
  auth.uid() = (SELECT requester_id FROM blood_requests WHERE id = request_id)
);

-- Hospitals: public read
CREATE POLICY "Hospitals publicly viewable" ON hospitals FOR SELECT USING (true);

-- Notifications: own only
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Donor badges: public read
CREATE POLICY "Badges publicly viewable" ON donor_badges FOR SELECT USING (true);
CREATE POLICY "System can award badges" ON donor_badges FOR INSERT WITH CHECK (auth.uid() = donor_id);

-- Push subscriptions: own only
CREATE POLICY "Users manage own subscriptions" ON push_subscriptions FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update donor level and check badges on donation insert
CREATE OR REPLACE FUNCTION update_donor_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_total INTEGER;
  v_level donor_level;
BEGIN
  -- Update total donations
  UPDATE profiles
  SET total_donations = total_donations + 1,
      is_available = false
  WHERE id = NEW.donor_id
  RETURNING total_donations INTO v_total;

  -- Determine level
  IF v_total >= 50 THEN v_level := 'hero';
  ELSIF v_total >= 25 THEN v_level := 'gold';
  ELSIF v_total >= 10 THEN v_level := 'silver';
  ELSIF v_total >= 3 THEN v_level := 'bronze';
  ELSE v_level := 'new';
  END IF;

  UPDATE profiles SET donor_level = v_level WHERE id = NEW.donor_id;

  -- Award badges
  IF v_total >= 1 THEN
    INSERT INTO donor_badges (donor_id, badge_type) VALUES (NEW.donor_id, 'first_drop') ON CONFLICT DO NOTHING;
  END IF;
  IF v_total >= 3 THEN
    INSERT INTO donor_badges (donor_id, badge_type) VALUES (NEW.donor_id, 'bronze_heart') ON CONFLICT DO NOTHING;
  END IF;
  IF v_total >= 10 THEN
    INSERT INTO donor_badges (donor_id, badge_type) VALUES (NEW.donor_id, 'silver_vein') ON CONFLICT DO NOTHING;
  END IF;
  IF v_total >= 25 THEN
    INSERT INTO donor_badges (donor_id, badge_type) VALUES (NEW.donor_id, 'gold_pulse') ON CONFLICT DO NOTHING;
  END IF;
  IF v_total >= 50 THEN
    INSERT INTO donor_badges (donor_id, badge_type) VALUES (NEW.donor_id, 'hero_status') ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_donation_insert
  AFTER INSERT ON donations
  FOR EACH ROW EXECUTE FUNCTION update_donor_stats();

-- Auto-restore availability after cooldown
CREATE OR REPLACE FUNCTION restore_donor_availability()
RETURNS void AS $$
BEGIN
  UPDATE profiles p
  SET is_available = true
  FROM (
    SELECT DISTINCT donor_id
    FROM donations
    WHERE cooldown_ends_at <= NOW()
  ) d
  WHERE p.id = d.donor_id
    AND p.is_available = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-expire old requests
CREATE OR REPLACE FUNCTION expire_old_requests()
RETURNS void AS $$
BEGIN
  UPDATE blood_requests
  SET status = 'expired'
  WHERE expires_at < NOW() AND status = 'open';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(p_district TEXT DEFAULT NULL, p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  donor_id UUID,
  full_name TEXT,
  blood_group blood_group,
  district TEXT,
  total_donations INTEGER,
  donor_level donor_level,
  profile_photo_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.blood_group,
    p.district,
    p.total_donations,
    p.donor_level,
    p.profile_photo_url
  FROM profiles p
  WHERE (p_district IS NULL OR p.district = p_district)
    AND p.total_donations > 0
    AND p.nid_verified = true
  ORDER BY p.total_donations DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  v_total_donors INTEGER;
  v_total_donations INTEGER;
  v_active_requests INTEGER;
  v_active_campaigns INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_total_donors FROM profiles WHERE nid_verified = true;
  SELECT COUNT(*) INTO v_total_donations FROM donations;
  SELECT COUNT(*) INTO v_active_requests FROM blood_requests WHERE status = 'open';
  SELECT COUNT(*) INTO v_active_campaigns FROM campaigns WHERE status = 'active';

  RETURN json_build_object(
    'total_donors', v_total_donors,
    'total_donations', v_total_donations,
    'active_requests', v_active_requests,
    'active_campaigns', v_active_campaigns,
    'lives_impacted', v_total_donations * 3
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
