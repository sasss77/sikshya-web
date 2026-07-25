export const ENDPOINTS = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  GOOGLE_LOGIN: "/users/google-login",
  SET_ROLE: "/users/set-role",
  WHOAMI: "/users/whoami",
  UPDATE_PROFILE: "/users/update-profile",
  ADMIN_USERS: "/v1/admin/users",
  ADMIN_STATS: "/v1/admin/users/stats",
  ADMIN_COURSES: "/v1/admin/users/courses",
  ADMIN_COURSE_BY_ID: "/v1/admin/users/courses/:id",
  ADMIN_SEND_NOTIFICATION: "/v1/admin/users/notifications/send",
  ADMIN_REQUESTS: "/v1/admin/users/requests",
  ADMIN_VERIFY: "/v1/admin/users/:id/verify-admin",
  VERIFY_STUDENT: "/students/verify",
  STUDENT_PROFILE: "/students/profile",
  STUDENT_DASHBOARD: "/students/dashboard",

  // Tutors
  TUTORS: "/tutors",
  TUTOR_MY_PROFILE: "/tutors/my-profile",
  TUTOR_PROFILE_SAVE: "/tutors/profile",
  TUTOR_SEARCH: "/tutors/search",
  TUTOR_COURSES: "/tutors/courses",
  TUTOR_BOOKED_SLOTS: "/tutors/:id/booked-slots",
  UPLOAD_COURSE_CONTENT: "/tutors/upload-content",

  // Bookings & Learnings
  BOOKINGS: "/bookings",
  BOOKINGS_ENROLL: "/bookings/enroll",
  LEARNINGS: "/bookings/learnings",

  // Notifications
  NOTIFICATIONS: "/notifications",
  NOTIFICATIONS_READ_ALL: "/notifications/read-all",
  NOTIFICATIONS_CLEAR_ALL: "/notifications/clear-all",
  NOTIFICATIONS_MY_STUDENTS: "/notifications/my-students",
  NOTIFICATIONS_SEND: "/notifications/send",

  // Chat
  CHAT_ROOMS: "/chat/rooms",
  CHAT_MESSAGES: "/chat/rooms/:roomId/messages",
  CHAT_SEARCH: "/chat/search",

  // Stripe Payments
  PAYMENTS_CHECKOUT: "/payments/create-checkout-session",
  PAYMENTS_SESSION: "/payments/session",
};