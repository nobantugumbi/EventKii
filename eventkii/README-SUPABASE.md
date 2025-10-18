# 🗄️ EventKii Supabase Integration Guide

## 📋 Overview

This guide will help you set up Supabase as the database backend for your EventKii application. Supabase provides a PostgreSQL database with real-time capabilities, perfect for Web3 event management.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project:
   - **Name**: EventKii
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users

### 2. Get Your Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xyzcompany.supabase.co`)
   - **Project API Key** (anon/public key)

### 3. Configure Environment Variables

Update your `.env.local` file:

```env
# Replace with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/schema.sql`
3. Paste and run the SQL to create all tables and functions

## 📊 Database Structure

### Tables Created

- **`events`** - Store event information
- **`tickets`** - NFT ticket records
- **`attendees`** - User profiles
- **`ticket_transfers`** - Transfer history
- **`event_categories`** - Event categorization

### Key Features

- ✅ **Row Level Security (RLS)** enabled
- ✅ **UUID primary keys** for all tables
- ✅ **Indexes** for optimal performance
- ✅ **Foreign key constraints** for data integrity
- ✅ **Timestamps** with timezone support
- ✅ **Soft deletes** for events

## 🔧 Usage Examples

### Import Services

```typescript
import { eventService, ticketService, attendeeService } from '@/lib/database'
```

### Create an Event

```typescript
const newEvent = await eventService.createEvent({
  title: "Tech Conference 2024",
  description: "Annual technology conference",
  date: "2024-06-15T10:00:00Z",
  venue: "Convention Center",
  creator_wallet: "0x1234...",
  ticket_price: 0.1,
  max_tickets: 500
})
```

### Get User's Tickets

```typescript
const userTickets = await ticketService.getUserTickets("0x1234...")
console.log(userTickets) // Array of tickets with event details
```

### Create a Ticket

```typescript
const ticket = await ticketService.createTicket({
  event_id: "event-uuid",
  owner_wallet: "0x1234...",
  seat_number: "A-15",
  purchase_price: 0.1,
  transaction_hash: "0xabc..."
})
```

## 🔐 Security Features

### Row Level Security Policies

- **Events**: Anyone can view, creators can update their own
- **Tickets**: Users can only see their own tickets
- **Attendees**: Users can only access their own profile
- **Transfers**: Users can see transfers involving their tickets

### Authentication Integration

The database is designed to work with wallet-based authentication. When implementing auth:

```typescript
// Example: Set user context for RLS
await supabase.auth.setSession({
  access_token: 'jwt-token-with-wallet-address',
  refresh_token: 'refresh-token'
})
```

## 📈 Analytics & Insights

### Event Statistics

```typescript
const stats = await analyticsService.getEventStats("event-id")
console.log(stats)
// {
//   totalTickets: 150,
//   usedTickets: 120,
//   unusedTickets: 30,
//   totalRevenue: 15.0,
//   attendanceRate: 80
// }
```

### User Statistics

```typescript
const userStats = await analyticsService.getUserStats("0x1234...")
console.log(userStats)
// {
//   totalTicketsOwned: 5,
//   totalEventsCreated: 2,
//   totalSpent: 0.5,
//   upcomingEvents: 3
// }
```

## 🔄 Real-time Features

Supabase provides real-time subscriptions for live updates:

```typescript
// Listen for new tickets
const subscription = supabase
  .channel('tickets')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'tickets' },
    (payload) => {
      console.log('New ticket created:', payload.new)
    }
  )
  .subscribe()
```

## 🛠️ Development Tips

### Testing Connection

```typescript
import { dbUtils } from '@/lib/database'

const isConnected = await dbUtils.testConnection()
console.log('Database connected:', isConnected)
```

### Database Health Check

```typescript
const health = await dbUtils.getHealth()
console.log('Database health:', health)
```

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` is in the root directory
   - Restart your development server
   - Check variable names match exactly

2. **RLS Policies Blocking Queries**
   - Ensure JWT token contains wallet_address claim
   - Check policy conditions match your auth setup

3. **Connection Errors**
   - Verify Supabase project is active
   - Check network connectivity
   - Validate credentials in dashboard

### Debug Mode

Enable debug logging:

```typescript
// Add to your supabase client config
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true
  }
})
```

## 📚 Next Steps

1. **Set up Authentication**: Integrate wallet-based auth
2. **Add Real-time Features**: Implement live event updates
3. **Optimize Queries**: Add database indexes as needed
4. **Backup Strategy**: Set up automated backups
5. **Monitoring**: Enable database monitoring and alerts

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Functions](https://supabase.com/docs/guides/database/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

---

**🎉 Your EventKii database is now ready for Web3 event management!**