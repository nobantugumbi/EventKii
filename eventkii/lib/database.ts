import { supabase, Event, Ticket, Attendee } from './supabase'

// Event Functions
export const eventService = {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get events by creator
  async getEventsByCreator(creatorWallet: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('creator_wallet', creatorWallet)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get single event
  async getEvent(eventId: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (error) throw error
    return data
  },

  // Create new event
  async createEvent(eventData: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update event
  async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', eventId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete event (soft delete)
  async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .update({ is_active: false })
      .eq('id', eventId)

    if (error) throw error
  }
}

// Ticket Functions
export const ticketService = {
  // Get user's tickets
  async getUserTickets(walletAddress: string): Promise<(Ticket & { event: Event })[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        event:events(*)
      `)
      .eq('owner_wallet', walletAddress)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get tickets for an event
  async getEventTickets(eventId: string): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create new ticket
  async createTicket(ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket> {
    // Generate QR code data
    const qrData = JSON.stringify({
      ticketId: 'temp', // Will be replaced with actual ID
      eventId: ticketData.event_id,
      owner: ticketData.owner_wallet,
      timestamp: new Date().toISOString()
    })

    const { data, error } = await supabase
      .from('tickets')
      .insert([{ ...ticketData, qr_code: qrData }])
      .select()
      .single()

    if (error) throw error

    // Update QR code with actual ticket ID
    const updatedQrData = JSON.stringify({
      ticketId: data.id,
      eventId: ticketData.event_id,
      owner: ticketData.owner_wallet,
      timestamp: new Date().toISOString()
    })

    const { data: updatedTicket, error: updateError } = await supabase
      .from('tickets')
      .update({ qr_code: updatedQrData })
      .eq('id', data.id)
      .select()
      .single()

    if (updateError) throw updateError
    return updatedTicket
  },

  // Transfer ticket
  async transferTicket(
    ticketId: string, 
    fromWallet: string, 
    toWallet: string, 
    transactionHash?: string,
    transferPrice?: number
  ): Promise<void> {
    // Update ticket owner
    const { error: ticketError } = await supabase
      .from('tickets')
      .update({ 
        owner_wallet: toWallet,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .eq('owner_wallet', fromWallet) // Ensure current owner is transferring

    if (ticketError) throw ticketError

    // Record transfer
    const { error: transferError } = await supabase
      .from('ticket_transfers')
      .insert([{
        ticket_id: ticketId,
        from_wallet: fromWallet,
        to_wallet: toWallet,
        transaction_hash: transactionHash,
        transfer_price: transferPrice
      }])

    if (transferError) throw transferError
  },

  // Mark ticket as used
  async useTicket(ticketId: string): Promise<void> {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        is_used: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)

    if (error) throw error
  },

  // Get ticket transfer history
  async getTicketTransfers(ticketId: string) {
    const { data, error } = await supabase
      .from('ticket_transfers')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

// Attendee Functions
export const attendeeService = {
  // Get attendee profile
  async getAttendee(walletAddress: string): Promise<Attendee | null> {
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data
  },

  // Create attendee profile
  async createAttendee(attendeeData: Omit<Attendee, 'id' | 'created_at' | 'updated_at'>): Promise<Attendee> {
    const { data, error } = await supabase
      .from('attendees')
      .insert([attendeeData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update attendee profile
  async updateAttendee(walletAddress: string, updates: Partial<Attendee>): Promise<Attendee> {
    const { data, error } = await supabase
      .from('attendees')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('wallet_address', walletAddress)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get or create attendee (upsert)
  async getOrCreateAttendee(walletAddress: string, initialData?: Partial<Attendee>): Promise<Attendee> {
    let attendee = await this.getAttendee(walletAddress)
    
    if (!attendee) {
      attendee = await this.createAttendee({
        wallet_address: walletAddress,
        email: initialData?.email || null,
        name: initialData?.name || null,
        avatar_url: initialData?.avatar_url || null,
        bio: initialData?.bio || null,
        social_links: initialData?.social_links || null
      })
    }
    
    return attendee
  }
}

// Analytics Functions
export const analyticsService = {
  // Get event statistics
  async getEventStats(eventId: string) {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('event_id', eventId)

    if (error) throw error

    const totalTickets = tickets?.length || 0
    const usedTickets = tickets?.filter(t => t.is_used).length || 0
    const totalRevenue = tickets?.reduce((sum, t) => sum + (t.purchase_price || 0), 0) || 0

    return {
      totalTickets,
      usedTickets,
      unusedTickets: totalTickets - usedTickets,
      totalRevenue,
      attendanceRate: totalTickets > 0 ? (usedTickets / totalTickets) * 100 : 0
    }
  },

  // Get user statistics
  async getUserStats(walletAddress: string) {
    const [tickets, events] = await Promise.all([
      ticketService.getUserTickets(walletAddress),
      eventService.getEventsByCreator(walletAddress)
    ])

    const totalTicketsOwned = tickets.length
    const totalEventsCreated = events.length
    const totalSpent = tickets.reduce((sum, t) => sum + (t.purchase_price || 0), 0)

    return {
      totalTicketsOwned,
      totalEventsCreated,
      totalSpent,
      upcomingEvents: tickets.filter(t => new Date(t.event.date) > new Date()).length
    }
  }
}

// Utility Functions
export const dbUtils = {
  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('count')
        .limit(1)

      return !error
    } catch {
      return false
    }
  },

  // Get database health
  async getHealth() {
    try {
      const [eventsCount, ticketsCount, attendeesCount] = await Promise.all([
        supabase.from('events').select('count').single(),
        supabase.from('tickets').select('count').single(),
        supabase.from('attendees').select('count').single()
      ])

      return {
        status: 'healthy',
        events: eventsCount.data?.count || 0,
        tickets: ticketsCount.data?.count || 0,
        attendees: attendeesCount.data?.count || 0
      }
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}