// ── Shared mock data for all Playwright test specs ──────────────────────

export const mockUser = {
  id: "user-1",
  fullName: "Test Student",
  email: "student@test.com",
  role: "student",
  profileImage: null,
  createdAt: "2025-01-01T00:00:00Z",
};

export const mockTutor = {
  id: "user-2",
  fullName: "Test Tutor",
  email: "tutor@test.com",
  role: "tutor",
  profileImage: null,
  createdAt: "2025-01-01T00:00:00Z",
};

export const mockAdmin = {
  id: "user-3",
  fullName: "Test Admin",
  email: "admin@test.com",
  role: "admin",
  profileImage: null,
  createdAt: "2025-01-01T00:00:00Z",
  isVerifiedAdmin: true,
};

export const mockTutorsList = [
  {
    id: "t1",
    name: "Anish Shrestha",
    email: "anish@test.com",
    subjects: ["Physics", "Mathematics"],
    rating: 5.0,
    reviews: 24,
    price: 800,
    location: "Kathmandu",
    level: "+2 Science",
    bio: "SLC Topper with expertise in Physics and Mathematics.",
    tags: ["SLC Topper", "IOE Scholar"],
    initials: "AS",
    avatarColor: "#0B4085",
    profileImage: null,
    verified: true,
  },
  {
    id: "t2",
    name: "Priya Sharma",
    email: "priya@test.com",
    subjects: ["Biology", "Chemistry"],
    rating: 4.9,
    reviews: 18,
    price: 750,
    location: "Lalitpur",
    level: "+2 Science",
    bio: "Medical student specialising in Biology and Chemistry.",
    tags: ["Medical Student", "IOM Ranker"],
    initials: "PS",
    avatarColor: "#0ea5e9",
    profileImage: null,
    verified: true,
  },
];

export const mockCourses = [
  {
    id: "c1",
    title: "Advanced Physics",
    description: "Complete +2 physics curriculum",
    price: 2000,
    tutor: { fullName: "Anish Shrestha" },
    enrolled: 45,
    createdAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "c2",
    title: "Biology Mastery",
    description: "Comprehensive biology for SEE and +2",
    price: 1800,
    tutor: { fullName: "Priya Sharma" },
    enrolled: 32,
    createdAt: "2025-03-01T00:00:00Z",
  },
];

export const mockAdminStats = {
  totalUsers: 320,
  totalStudents: 250,
  totalTutors: 60,
  totalAdmins: 10,
  newUsersThisMonth: 28,
  recentUsers: [
    {
      id: "u1",
      fullName: "Alice Nepal",
      email: "alice@test.com",
      role: "student",
      createdAt: "2026-07-20T00:00:00Z",
    },
    {
      id: "u2",
      fullName: "Bob Gurung",
      email: "bob@test.com",
      role: "tutor",
      createdAt: "2026-07-21T00:00:00Z",
    },
    {
      id: "u3",
      fullName: "Carol Rai",
      email: "carol@test.com",
      role: "admin",
      createdAt: "2026-07-22T00:00:00Z",
    },
  ],
};

export const mockAdminUsersList = {
  users: [
    {
      id: "u1",
      fullName: "Alice Nepal",
      email: "alice@test.com",
      role: "student",
      createdAt: "2026-07-20T00:00:00Z",
    },
    {
      id: "u2",
      fullName: "Bob Gurung",
      email: "bob@test.com",
      role: "tutor",
      createdAt: "2026-07-21T00:00:00Z",
    },
    {
      id: "u3",
      fullName: "Carol Rai",
      email: "carol@test.com",
      role: "admin",
      createdAt: "2026-07-22T00:00:00Z",
    },
    {
      id: "u4",
      fullName: "David Thapa",
      email: "david@test.com",
      role: "student",
      createdAt: "2026-07-23T00:00:00Z",
    },
    {
      id: "u5",
      fullName: "Eva Magar",
      email: "eva@test.com",
      role: "tutor",
      createdAt: "2026-07-24T00:00:00Z",
    },
  ],
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 5,
    totalPages: 1,
  },
};

export const mockBookings = [
  {
    id: "b1",
    tutor: { fullName: "Anish Shrestha" },
    student: { fullName: "Test Student" },
    subject: "Physics",
    scheduledAt: "2026-08-05T10:00:00Z",
    status: "confirmed",
    price: 800,
  },
];

export const mockNotifications = [
  {
    id: "n1",
    message: "Your session with Anish Shrestha has been confirmed.",
    read: false,
    createdAt: "2026-07-28T09:00:00Z",
  },
  {
    id: "n2",
    message: "New tutor available in your subject area.",
    read: true,
    createdAt: "2026-07-27T09:00:00Z",
  },
];
