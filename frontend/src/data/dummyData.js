export const services = [
  { id: 1, name: "Plumbing", icon: "🔧", description: "Pipe repairs, leaks, installations", price: 50, category: "Home Repair" },
  { id: 2, name: "Electrical", icon: "⚡", description: "Wiring, outlets, panel upgrades", price: 75, category: "Home Repair" },
  { id: 3, name: "Cleaning", icon: "🧹", description: "Deep cleaning, regular maintenance", price: 40, category: "Cleaning" },
  { id: 4, name: "Painting", icon: "🖌️", description: "Interior and exterior painting", price: 60, category: "Home Repair" },
  { id: 5, name: "AC Repair", icon: "❄️", description: "Installation, servicing, repairs", price: 80, category: "HVAC" },
  { id: 6, name: "Carpentry", icon: "🪚", description: "Furniture, cabinets, woodwork", price: 65, category: "Home Repair" },
];

export const workers = [
  { id: 1, name: "James Carter", service: "Plumbing", rating: 4.8, jobs: 142, status: "available", avatar: "JC", phone: "+1 555-0101" },
  { id: 2, name: "Maria Lopez", service: "Electrical", rating: 4.9, jobs: 210, status: "busy", avatar: "ML", phone: "+1 555-0102" },
  { id: 3, name: "David Kim", service: "Cleaning", rating: 4.7, jobs: 98, status: "available", avatar: "DK", phone: "+1 555-0103" },
  { id: 4, name: "Sarah Ahmed", service: "Painting", rating: 4.6, jobs: 75, status: "available", avatar: "SA", phone: "+1 555-0104" },
  { id: 5, name: "Robert Chen", service: "AC Repair", rating: 4.9, jobs: 185, status: "offline", avatar: "RC", phone: "+1 555-0105" },
  { id: 6, name: "Emily Brown", service: "Carpentry", rating: 4.8, jobs: 120, status: "available", avatar: "EB", phone: "+1 555-0106" },
];

export const requests = [
  {
    id: "REQ-001",
    client: "Alice Johnson",
    service: "Plumbing",
    worker: "James Carter",
    date: "2026-06-02",
    time: "10:00 AM",
    status: "confirmed",
    address: "123 Oak Street, NY",
    notes: "Kitchen sink leaking badly",
    price: 50,
  },
  {
    id: "REQ-002",
    client: "Bob Smith",
    service: "Electrical",
    worker: "Maria Lopez",
    date: "2026-06-03",
    time: "2:00 PM",
    status: "pending",
    address: "456 Pine Ave, NY",
    notes: "Install new outlets in living room",
    price: 75,
  },
  {
    id: "REQ-003",
    client: "Carol Davis",
    service: "Cleaning",
    worker: "David Kim",
    date: "2026-06-01",
    time: "9:00 AM",
    status: "completed",
    address: "789 Maple Rd, NY",
    notes: "Full house deep clean",
    price: 40,
  },
  {
    id: "REQ-004",
    client: "Dan Wilson",
    service: "Painting",
    worker: null,
    date: "2026-06-05",
    time: "11:00 AM",
    status: "pending",
    address: "321 Elm Blvd, NY",
    notes: "Bedroom painting, 2 rooms",
    price: 120,
  },
  {
    id: "REQ-005",
    client: "Eva Martinez",
    service: "AC Repair",
    worker: "Robert Chen",
    date: "2026-05-30",
    time: "3:00 PM",
    status: "cancelled",
    address: "654 Birch Lane, NY",
    notes: "AC not cooling properly",
    price: 80,
  },
];

export const stats = {
  admin: {
    totalRequests: 128,
    pendingRequests: 24,
    activeWorkers: 18,
    totalClients: 95,
    revenue: 7840,
    completedJobs: 104,
  },
  client: {
    totalBookings: 8,
    activeBookings: 2,
    completedBookings: 5,
    cancelledBookings: 1,
  },
  worker: {
    assignedJobs: 5,
    completedJobs: 3,
    pendingJobs: 2,
    rating: 4.8,
    earnings: 420,
  },
};

export const notifications = [
  { id: 1, message: "Your plumbing request has been confirmed.", time: "2 hours ago", read: false },
  { id: 2, message: "Worker James Carter is on the way.", time: "1 day ago", read: false },
  { id: 3, message: "Service completed. Rate your experience!", time: "3 days ago", read: true },
];
