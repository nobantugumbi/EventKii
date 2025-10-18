-- EventKii Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue VARCHAR(255),
    creator_wallet VARCHAR(42) NOT NULL,
    ticket_price DECIMAL(18,8),
    max_tickets INTEGER,
    contract_address VARCHAR(42),
    image_url TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets Table (NFT Records)
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    owner_wallet VARCHAR(42) NOT NULL,
    token_id INTEGER,
    seat_number VARCHAR(50),
    purchase_price DECIMAL(18,8),
    transaction_hash VARCHAR(66),
    is_used BOOLEAN DEFAULT FALSE,
    qr_code TEXT, -- Base64 encoded QR code
    metadata JSONB, -- Additional ticket metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendees Table
CREATE TABLE IF NOT EXISTS attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    social_links JSONB, -- Store social media links
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket Transfers Table (Track ownership history)
CREATE TABLE IF NOT EXISTS ticket_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    from_wallet VARCHAR(42),
    to_wallet VARCHAR(42) NOT NULL,
    transaction_hash VARCHAR(66),
    transfer_price DECIMAL(18,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Categories Table (Optional)
CREATE TABLE IF NOT EXISTS event_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_creator_wallet ON events(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_tickets_owner_wallet ON tickets(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_token_id ON tickets(token_id);
CREATE INDEX IF NOT EXISTS idx_attendees_wallet ON attendees(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ticket_transfers_ticket_id ON ticket_transfers(ticket_id);

-- Row Level Security (RLS) Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_transfers ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Tickets policies
CREATE POLICY "Users can view their own tickets" ON tickets FOR SELECT USING (owner_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Users can create tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own tickets" ON tickets FOR UPDATE USING (owner_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Attendees policies
CREATE POLICY "Users can view their own profile" ON attendees FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Users can create their own profile" ON attendees FOR INSERT WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');
CREATE POLICY "Users can update their own profile" ON attendees FOR UPDATE USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Ticket transfers policies
CREATE POLICY "Users can view transfers for their tickets" ON ticket_transfers FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM tickets 
        WHERE tickets.id = ticket_transfers.ticket_id 
        AND (tickets.owner_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address'
             OR from_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address'
             OR to_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address')
    )
);

-- Insert default event categories
INSERT INTO event_categories (name, description, icon) VALUES
('Conference', 'Professional conferences and seminars', '🎯'),
('Concert', 'Music concerts and performances', '🎵'),
('Festival', 'Cultural and music festivals', '🎪'),
('Sports', 'Sporting events and competitions', '⚽'),
('Workshop', 'Educational workshops and training', '🛠️'),
('Networking', 'Professional networking events', '🤝'),
('Art', 'Art exhibitions and galleries', '🎨'),
('Food', 'Food festivals and culinary events', '🍽️'),
('Technology', 'Tech meetups and hackathons', '💻'),
('Other', 'Other types of events', '📅')
ON CONFLICT (name) DO NOTHING;

-- Functions for common operations
CREATE OR REPLACE FUNCTION get_user_tickets(user_wallet TEXT)
RETURNS TABLE (
    ticket_id UUID,
    event_title VARCHAR,
    event_date TIMESTAMP WITH TIME ZONE,
    event_venue VARCHAR,
    seat_number VARCHAR,
    qr_code TEXT,
    is_used BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        e.title,
        e.date,
        e.venue,
        t.seat_number,
        t.qr_code,
        t.is_used
    FROM tickets t
    JOIN events e ON t.event_id = e.id
    WHERE t.owner_wallet = user_wallet
    ORDER BY e.date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a new ticket
CREATE OR REPLACE FUNCTION create_ticket(
    p_event_id UUID,
    p_owner_wallet VARCHAR,
    p_token_id INTEGER DEFAULT NULL,
    p_seat_number VARCHAR DEFAULT NULL,
    p_purchase_price DECIMAL DEFAULT NULL,
    p_transaction_hash VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_ticket_id UUID;
BEGIN
    INSERT INTO tickets (
        event_id,
        owner_wallet,
        token_id,
        seat_number,
        purchase_price,
        transaction_hash
    ) VALUES (
        p_event_id,
        p_owner_wallet,
        p_token_id,
        p_seat_number,
        p_purchase_price,
        p_transaction_hash
    ) RETURNING id INTO new_ticket_id;
    
    RETURN new_ticket_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;