const http = require('http');

const MOCK_DATA = {
  adminStats: {
    totalUsers: 320,
    totalStudents: 250,
    totalTutors: 60,
    totalAdmins: 10,
    newUsersThisMonth: 28,
    recentUsers: [
      { id: "u1", fullName: "Alice Nepal", email: "alice@test.com", role: "student", createdAt: "2025-01-10T00:00:00Z" }
    ]
  },
  adminUsers: {
    users: [
      { id: "u1", fullName: "Alice Nepal", email: "alice@test.com", role: "student", createdAt: "2025-01-10T00:00:00Z" },
      { id: "u2", fullName: "Bob Sharma", email: "bob@test.com", role: "tutor", createdAt: "2025-01-11T00:00:00Z" },
      { id: "u3", fullName: "Charlie Admin", email: "admin2@test.com", role: "admin", createdAt: "2025-01-12T00:00:00Z" }
    ],
    meta: { currentPage: 1, itemsPerPage: 10, totalItems: 3, totalPages: 1 }
  },
  studentDashboard: {
    upcoming: [],
    inProgress: []
  },
  tutorDashboard: {
    upcoming: [],
    stats: { totalEarnings: 0, hoursTaught: 0, activeStudents: 0 }
  },
  tutorsList: [
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
    }
  ]
};

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url.includes('/admin/users') && !req.url.includes('/stats')) {
    res.end(JSON.stringify({ 
      success: true, 
      message: "Success", 
      data: MOCK_DATA.adminUsers.users, 
      meta: MOCK_DATA.adminUsers.meta 
    }));
  } else if (req.url.includes('/admin/dashboard') || req.url.includes('/admin/users/stats')) {
    res.end(JSON.stringify({ success: true, message: "Success", data: MOCK_DATA.adminStats }));
  } else if (req.url.includes('/student/dashboard') || req.url.includes('/students/dashboard')) {
    res.end(JSON.stringify({ success: true, message: "Success", data: MOCK_DATA.studentDashboard }));
  } else if (req.url.includes('/tutor/dashboard') || req.url.includes('/tutors/dashboard')) {
    res.end(JSON.stringify({ success: true, message: "Success", data: MOCK_DATA.tutorDashboard }));
  } else if (req.url.includes('/tutors')) {
    res.end(JSON.stringify({ success: true, message: "Success", data: MOCK_DATA.tutorsList }));
  } else if (req.url.includes('/users/me') || req.url.includes('/users/whoami')) {
    const token = req.headers.authorization || '';
    if (token.includes('admin')) {
      res.end(JSON.stringify({ success: true, message: "Success", data: { id: "user-3", fullName: "Test Admin", email: "admin@test.com", role: "admin", isVerifiedAdmin: true } }));
    } else if (token.includes('tutor')) {
      res.end(JSON.stringify({ success: true, message: "Success", data: { id: "user-2", fullName: "Test Tutor", email: "tutor@test.com", role: "tutor" } }));
    } else {
      res.end(JSON.stringify({ success: true, message: "Success", data: { id: "user-1", fullName: "Test Student", email: "student@test.com", role: "student" } }));
    }
  } else {
    res.end(JSON.stringify({ success: true, message: "Mocked response", data: {} }));
  }
});

const PORT = 5000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mock backend server listening on http://127.0.0.1:${PORT}`);
});
