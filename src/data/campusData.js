// =============================================
// campusData.js — Seed Data for Campus Search
// =============================================
// 85+ entries across 10 categories
// Each entry: { word, category, frequency, tags }
// =============================================

const campusData = [
  // ─── NOTES (10) ───
  { word: "DAA Notes", category: "notes", frequency: 87, tags: ["algorithm", "subject", "exam prep"] },
  { word: "OS Notes", category: "notes", frequency: 72, tags: ["operating system", "subject", "exam prep"] },
  { word: "DBMS Notes", category: "notes", frequency: 78, tags: ["database", "subject", "exam prep"] },
  { word: "CN Notes", category: "notes", frequency: 65, tags: ["networking", "subject", "exam prep"] },
  { word: "DS Notes", category: "notes", frequency: 83, tags: ["data structures", "subject", "exam prep"] },
  { word: "TOC Notes", category: "notes", frequency: 58, tags: ["automata", "theory", "exam prep"] },
  { word: "AI Notes", category: "notes", frequency: 69, tags: ["artificial intelligence", "subject", "exam prep"] },
  { word: "ML Notes", category: "notes", frequency: 61, tags: ["machine learning", "subject"] },
  { word: "Compiler Design Notes", category: "notes", frequency: 45, tags: ["compiler", "subject"] },
  { word: "Discrete Math Notes", category: "notes", frequency: 52, tags: ["math", "discrete", "exam prep"] },

  // ─── EXAMS (9) ───
  { word: "Mid Sem Schedule", category: "exams", frequency: 91, tags: ["exam", "schedule", "midterm"] },
  { word: "End Sem Dates", category: "exams", frequency: 88, tags: ["exam", "schedule", "final"] },
  { word: "Exam Form", category: "exams", frequency: 76, tags: ["registration", "exam"] },
  { word: "Hall Ticket", category: "exams", frequency: 82, tags: ["admit card", "exam"] },
  { word: "Result Portal", category: "exams", frequency: 95, tags: ["results", "grades", "portal"] },
  { word: "Revaluation Form", category: "exams", frequency: 42, tags: ["recheck", "exam"] },
  { word: "Backlog Exam", category: "exams", frequency: 55, tags: ["supplementary", "exam"] },
  { word: "Exam Timetable", category: "exams", frequency: 89, tags: ["schedule", "timetable"] },
  { word: "Internal Marks", category: "exams", frequency: 73, tags: ["marks", "internal", "assessment"] },

  // ─── FACULTY (8) ───
  { word: "Dr. Sharma", category: "faculty", frequency: 48, tags: ["professor", "cse"] },
  { word: "HOD CSE", category: "faculty", frequency: 62, tags: ["head", "department", "cse"] },
  { word: "Faculty Directory", category: "faculty", frequency: 57, tags: ["staff", "directory"] },
  { word: "Attendance Portal", category: "faculty", frequency: 85, tags: ["attendance", "portal"] },
  { word: "Prof. Gupta", category: "faculty", frequency: 44, tags: ["professor", "mathematics"] },
  { word: "Dean Academics", category: "faculty", frequency: 39, tags: ["dean", "administration"] },
  { word: "Mentor Allocation", category: "faculty", frequency: 51, tags: ["mentor", "guidance"] },
  { word: "Faculty Feedback", category: "faculty", frequency: 46, tags: ["feedback", "survey"] },

  // ─── HOSTEL (8) ───
  { word: "Hostel Food Menu", category: "hostel", frequency: 74, tags: ["food", "mess", "menu"] },
  { word: "Hostel Rules", category: "hostel", frequency: 41, tags: ["rules", "regulations"] },
  { word: "Room Allotment", category: "hostel", frequency: 67, tags: ["room", "allocation", "hostel"] },
  { word: "Laundry Schedule", category: "hostel", frequency: 38, tags: ["laundry", "schedule"] },
  { word: "Hostel Fee Payment", category: "hostel", frequency: 63, tags: ["fee", "payment", "hostel"] },
  { word: "Hostel Warden", category: "hostel", frequency: 35, tags: ["warden", "hostel", "contact"] },
  { word: "Guest Room Booking", category: "hostel", frequency: 29, tags: ["guest", "booking"] },
  { word: "Hostel Complaint", category: "hostel", frequency: 47, tags: ["complaint", "grievance"] },

  // ─── EVENTS (9) ───
  { word: "Technothon", category: "events", frequency: 81, tags: ["tech", "fest", "competition"] },
  { word: "Cultural Fest", category: "events", frequency: 77, tags: ["cultural", "fest", "annual"] },
  { word: "Hackathon 2025", category: "events", frequency: 86, tags: ["hackathon", "coding", "competition"] },
  { word: "Sports Week", category: "events", frequency: 64, tags: ["sports", "annual", "tournament"] },
  { word: "Convocation", category: "events", frequency: 53, tags: ["graduation", "ceremony"] },
  { word: "Workshop AI", category: "events", frequency: 59, tags: ["workshop", "ai", "training"] },
  { word: "Seminar IoT", category: "events", frequency: 43, tags: ["seminar", "iot", "technology"] },
  { word: "Alumni Meet", category: "events", frequency: 37, tags: ["alumni", "networking"] },
  { word: "Orientation Program", category: "events", frequency: 56, tags: ["freshers", "welcome"] },

  // ─── LIBRARY (8) ───
  { word: "Library Timing", category: "library", frequency: 68, tags: ["timing", "hours", "library"] },
  { word: "E-Library", category: "library", frequency: 71, tags: ["digital", "ebooks", "online"] },
  { word: "Book Issue", category: "library", frequency: 54, tags: ["borrow", "books"] },
  { word: "Research Papers", category: "library", frequency: 49, tags: ["research", "papers", "journals"] },
  { word: "Library Card", category: "library", frequency: 40, tags: ["card", "membership"] },
  { word: "Return Books", category: "library", frequency: 36, tags: ["return", "books", "due"] },
  { word: "New Arrivals", category: "library", frequency: 33, tags: ["new", "books", "arrivals"] },
  { word: "Study Room Booking", category: "library", frequency: 60, tags: ["study", "room", "reservation"] },

  // ─── COURSES (9) ───
  { word: "B.Tech CSE", category: "courses", frequency: 92, tags: ["btech", "computer science"] },
  { word: "MCA", category: "courses", frequency: 66, tags: ["masters", "computer applications"] },
  { word: "MBA", category: "courses", frequency: 70, tags: ["masters", "business"] },
  { word: "BCA", category: "courses", frequency: 58, tags: ["bachelors", "computer applications"] },
  { word: "Course Registration", category: "courses", frequency: 84, tags: ["registration", "enrollment"] },
  { word: "Elective Subjects", category: "courses", frequency: 50, tags: ["elective", "choice"] },
  { word: "Syllabus Download", category: "courses", frequency: 75, tags: ["syllabus", "curriculum"] },
  { word: "Credit System", category: "courses", frequency: 44, tags: ["credits", "cgpa"] },
  { word: "Chandigarh University", category: "courses", frequency: 142, tags: ["university", "campus", "CU"] },

  // ─── CLUBS (8) ───
  { word: "Coding Club", category: "clubs", frequency: 79, tags: ["coding", "programming", "club"] },
  { word: "Robotics Club", category: "clubs", frequency: 62, tags: ["robotics", "engineering", "club"] },
  { word: "Literary Club", category: "clubs", frequency: 34, tags: ["literature", "writing", "club"] },
  { word: "Photography Club", category: "clubs", frequency: 45, tags: ["photography", "media", "club"] },
  { word: "Music Club", category: "clubs", frequency: 41, tags: ["music", "band", "club"] },
  { word: "Dance Club", category: "clubs", frequency: 47, tags: ["dance", "performance", "club"] },
  { word: "Debate Society", category: "clubs", frequency: 38, tags: ["debate", "speaking", "society"] },
  { word: "Entrepreneurship Cell", category: "clubs", frequency: 56, tags: ["startup", "business", "ecell"] },

  // ─── LABS (8) ───
  { word: "Computer Lab", category: "labs", frequency: 73, tags: ["lab", "computer", "practical"] },
  { word: "Physics Lab", category: "labs", frequency: 51, tags: ["lab", "physics", "practical"] },
  { word: "Chemistry Lab", category: "labs", frequency: 48, tags: ["lab", "chemistry", "practical"] },
  { word: "Language Lab", category: "labs", frequency: 39, tags: ["lab", "english", "communication"] },
  { word: "Electronics Lab", category: "labs", frequency: 53, tags: ["lab", "electronics", "circuits"] },
  { word: "Network Lab", category: "labs", frequency: 46, tags: ["lab", "networking", "cisco"] },
  { word: "IoT Lab", category: "labs", frequency: 57, tags: ["lab", "iot", "embedded"] },
  { word: "AI Research Lab", category: "labs", frequency: 64, tags: ["lab", "ai", "research"] },

  // ─── RESOURCES (8) ───
  { word: "Placement Portal", category: "resources", frequency: 96, tags: ["placement", "jobs", "careers"] },
  { word: "Scholarship Form", category: "resources", frequency: 71, tags: ["scholarship", "financial aid"] },
  { word: "Transport", category: "resources", frequency: 59, tags: ["bus", "transport", "shuttle"] },
  { word: "Cafeteria Menu", category: "resources", frequency: 66, tags: ["food", "cafeteria", "canteen"] },
  { word: "WiFi Password", category: "resources", frequency: 88, tags: ["wifi", "internet", "password"] },
  { word: "Student ID Card", category: "resources", frequency: 63, tags: ["id", "card", "student"] },
  { word: "Fee Payment Portal", category: "resources", frequency: 90, tags: ["fee", "payment", "tuition"] },
  { word: "Anti Ragging Cell", category: "resources", frequency: 32, tags: ["ragging", "safety", "complaint"] },
];

export default campusData;

/**
 * Get all unique categories
 */
export function getCategories() {
  return [...new Set(campusData.map(item => item.category))];
}

/**
 * Get all words as a flat array (for Levenshtein matching)
 */
export function getAllWords() {
  return campusData.map(item => item.word);
}

/**
 * Get items by category
 */
export function getByCategory(category) {
  return campusData.filter(item => item.category === category);
}

/**
 * Get category icon name (for Lucide)
 */
export function getCategoryIcon(category) {
  const icons = {
    notes: 'FileText',
    exams: 'GraduationCap',
    faculty: 'Users',
    hostel: 'Building2',
    events: 'Calendar',
    library: 'BookOpen',
    courses: 'School',
    clubs: 'Heart',
    labs: 'FlaskConical',
    resources: 'Globe',
  };
  return icons[category] || 'Search';
}

/**
 * Get category color
 */
export function getCategoryColor(category) {
  const colors = {
    notes: '#4f8ef7',
    exams: '#ef4444',
    faculty: '#a855f7',
    hostel: '#f59e0b',
    events: '#00d4aa',
    library: '#06b6d4',
    courses: '#8b5cf6',
    clubs: '#ec4899',
    labs: '#14b8a6',
    resources: '#f97316',
  };
  return colors[category] || '#94a3b8';
}
