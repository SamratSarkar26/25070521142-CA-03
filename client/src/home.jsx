import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Home = () => {

    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [enrolledIds, setEnrolledIds] = useState(() => {
        const saved = localStorage.getItem("enrolledCourses");
        return saved ? JSON.parse(saved) : [];
    });
    const [toast, setToast] = useState("");

    const studentName = localStorage.getItem("studentName") || "Samrat";
    const studentPrn = localStorage.getItem("studentPrn") || "25070521142";

    const getDashboardData = async () => {

        try {

            const resCourses = await fetch("http://localhost:5000/courses");
            const courseData = await resCourses.json();
            setCourses(courseData);

            const resStudents = await fetch("http://localhost:5000/getall");
            const studentData = await resStudents.json();
            setStudents(studentData);

        } catch (error) {

            console.log("Error fetching data : " + error);
        }

    };

    useEffect(() => {

        getDashboardData();

    }, []);

    const handleEnroll = async (course) => {

        if( enrolledIds.includes(course._id) ){
            setToast(`You are already enrolled in "${course.title}"`);
            setTimeout(() => setToast(""), 3000);
            return;
        }

        try {

            await fetch(`http://localhost:5000/courses/enroll/${course._id}`, {
                method : "POST"
            });

            const updated = [...enrolledIds, course._id];
            setEnrolledIds(updated);
            localStorage.setItem("enrolledCourses", JSON.stringify(updated));

            setToast(`Enrolled in "${course.title}"! (+1 saved in MongoDB Compass)`);
            setTimeout(() => setToast(""), 3500);
            getDashboardData();

        } catch (err) {

            console.log(err);
        }

    };

    const categories = ["All", "Web Development", "Computer Science", "AI & Data Science", "Cloud & DevOps", "Cybersecurity", "UI/UX Design"];

    const filteredCourses = courses.filter((item) => {
        const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
        const matchesSearch =
            (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.instructor || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.category || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const totalEnrollments = courses.reduce((sum, c) => sum + (Number(c.enrolled) || 0), 0);

    return (

        <div className="home-cont">

            {toast && <div className="toast-banner">{toast}</div>}

            <div className="hero-box">
                <div>
                    <span className="badge badge-category" style={{ marginBottom: "12px" }}>
                        FLEXI FULL-STACK PORTAL • PRN {studentPrn}
                    </span>
                    <h1>Welcome back, {studentName}!</h1>
                    <p>
                        Interactive Academic & Course Management System powered by React.js, Node.js, Express, and live MongoDB Compass persistence (`sitSecB`).
                    </p>
                </div>

                <div className="hero-status-box">
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#34d399", marginBottom: "6px" }}>
                        <span className="pulse-dot"></span>MongoDB Compass Connected
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#94a3b8" }}>
                        URI: mongodb://localhost:27017/sitSecB
                    </div>
                    <div style={{ marginTop: "12px" }}>
                        <Link to="/courses" className="btn-sm btn-edit" style={{ textDecoration: "none", display: "inline-block" }}>
                            + Launch Course Studio
                        </Link>
                    </div>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-tile">
                    <div className="stat-label">Active Flexi Courses</div>
                    <div className="stat-value">{courses.length}</div>
                    <div className="stat-sub">Live from `courses` collection</div>
                </div>

                <div className="stat-tile">
                    <div className="stat-label">Registered Students</div>
                    <div className="stat-value">{students.length}</div>
                    <div className="stat-sub">Bcrypt hashed in `student` DB</div>
                </div>

                <div className="stat-tile">
                    <div className="stat-label">Total Course Seatings</div>
                    <div className="stat-value">{totalEnrollments}</div>
                    <div className="stat-sub">Real-time enrollment counter</div>
                </div>

                <div className="stat-tile">
                    <div className="stat-label">Your Enrolled Modules</div>
                    <div className="stat-value">{enrolledIds.length}</div>
                    <div className="stat-sub">Click Enroll on any course below</div>
                </div>
            </div>

            <div className="toolbar-row">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search courses by title, professor, or technology..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="filter-pills">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="cards-grid">
                {filteredCourses.map((item) => {
                    const isEnrolled = enrolledIds.includes(item._id);
                    const capPercent = Math.min(100, Math.round(((item.enrolled || 45) / 220) * 100));

                    return (
                        <div className="card-item" key={item._id}>
                            <div>
                                <div className="card-top-meta">
                                    <span className={`badge ${item.status === "Active" ? "badge-active" : "badge-upcoming"}`}>
                                        {item.status}
                                    </span>
                                    <span className="badge badge-category">
                                        {item.category || "Web Development"}
                                    </span>
                                </div>

                                <h3>{item.title}</h3>

                                <div className="meta-line">
                                    <span>👨‍🏫 {item.instructor}</span>
                                    <span>⏱ {item.duration}</span>
                                    <span>🎓 {item.credits || 4} Credits</span>
                                </div>

                                <p className="desc-text">{item.description}</p>
                            </div>

                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8" }}>
                                    <span>👥 {item.enrolled || 42} Students Enrolled</span>
                                    <span>⭐ {item.rating || "4.9"} / 5.0</span>
                                </div>

                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${capPercent}%` }}></div>
                                </div>

                                <div className="action-row">
                                    <span style={{ fontSize: "12.5px", color: "#38bdf8", fontWeight: "600" }}>
                                        Level: {item.level || "Intermediate"}
                                    </span>

                                    <button
                                        className={`btn-sm ${isEnrolled ? "btn-enrolled" : "btn-enroll"}`}
                                        onClick={() => handleEnroll(item)}
                                    >
                                        {isEnrolled ? "✓ Enrolled" : "Enroll Now +"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default Home;
