import { useEffect, useState } from 'react';
import './App.css';

const Courses = () => {

    const [courses, setCourses] = useState([]);
    const [title, setTitle] = useState("");
    const [instructor, setInstructor] = useState("");
    const [category, setCategory] = useState("Web Development");
    const [duration, setDuration] = useState("10 Weeks");
    const [level, setLevel] = useState("Intermediate");
    const [credits, setCredits] = useState("4");
    const [status, setStatus] = useState("Active");
    const [description, setDescription] = useState("");
    const [editId, setEditId] = useState(null);
    const [toast, setToast] = useState("");

    const fetchCourses = async () => {

        try {

            const res = await fetch("http://localhost:5000/courses");
            const data = await res.json();
            setCourses(data);

        } catch (error) {

            console.log("Error : " + error);
        }

    };

    useEffect(() => {

        fetchCourses();

    }, []);

    const handleSaveCourse = async (e) => {

        e.preventDefault();

        const courseObj = {
            title : title,
            instructor : instructor,
            category : category,
            duration : duration,
            level : level,
            credits : credits,
            status : status,
            description : description
        };

        if( editId ){

            await fetch(`http://localhost:5000/courses/update/${editId}`, {
                method : "PUT",
                headers : { "Content-Type" : "application/json" },
                body : JSON.stringify(courseObj)
            });

            setToast("Course updated in MongoDB Compass!");
            setEditId(null);
        }
        else{

            await fetch("http://localhost:5000/courses/create", {
                method : "POST",
                headers : { "Content-Type" : "application/json" },
                body : JSON.stringify(courseObj)
            });

            setToast("New course added to MongoDB Compass!");
        }

        setTimeout(() => setToast(""), 3000);
        setTitle("");
        setInstructor("");
        setDescription("");
        fetchCourses();

    };

    const handleEdit = (item) => {

        setEditId(item._id);
        setTitle(item.title);
        setInstructor(item.instructor);
        setCategory(item.category || "Web Development");
        setDuration(item.duration || "10 Weeks");
        setLevel(item.level || "Intermediate");
        setCredits(item.credits || "4");
        setStatus(item.status || "Active");
        setDescription(item.description || "");
        window.scrollTo({ top : 0, behavior : "smooth" });
    };

    const handleDelete = async (id) => {

        await fetch(`http://localhost:5000/courses/delete/${id}`, {
            method : "DELETE"
        });

        setToast("Course removed from MongoDB!");
        setTimeout(() => setToast(""), 3000);
        fetchCourses();

    };

    return (

        <div className="home-cont">

            {toast && <div className="toast-banner">{toast}</div>}

            <div className="form-card" style={{ maxWidth: "100%", marginBottom: "34px" }}>
                <span className="badge badge-category" style={{ marginBottom: "8px" }}>
                    MONGODB COMPASS CRUD STUDIO
                </span>
                <h2>{editId ? "Edit Selected Course Module" : "Publish New Flexi Course"}</h2>
                <p className="sub-text">Create, update, and manage academic courses directly in `sitSecB.courses`</p>

                <form onSubmit={handleSaveCourse}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                        <div className="input-group">
                            <label>Course Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Full-Stack Cloud Engineering"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Faculty / Instructor</label>
                            <input
                                type="text"
                                placeholder="e.g. Prof. Somesh Chutel"
                                value={instructor}
                                onChange={(e) => setInstructor(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Domain Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="Web Development">Web Development</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="AI & Data Science">AI & Data Science</option>
                                <option value="Cloud & DevOps">Cloud & DevOps</option>
                                <option value="Cybersecurity">Cybersecurity</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Duration</label>
                            <input
                                type="text"
                                placeholder="12 Weeks"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Difficulty Level</label>
                            <select value={level} onChange={(e) => setLevel(e.target.value)}>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Course Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Active">Active</option>
                                <option value="Upcoming">Upcoming</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Syllabus Overview & Learning Outcomes</label>
                        <input
                            type="text"
                            placeholder="Describe key technologies, lab work, and assessment outcomes..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                        <button type="submit" className="btn-primary" style={{ maxWidth: "240px" }}>
                            {editId ? "Save Changes (PUT)" : "+ Publish Course (POST)"}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                className="btn-sm btn-del"
                                style={{ marginTop: "8px", padding: "0 20px" }}
                                onClick={() => {
                                    setEditId(null);
                                    setTitle("");
                                    setInstructor("");
                                    setDescription("");
                                }}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h2 style={{ marginBottom: "18px", fontSize: "24px" }}>
                Published Course Catalog ({courses.length})
            </h2>

            <div className="cards-grid">
                {courses.map((item) => (
                    <div className="card-item" key={item._id}>
                        <div>
                            <div className="card-top-meta">
                                <span className={`badge ${item.status === "Active" ? "badge-active" : "badge-upcoming"}`}>
                                    {item.status}
                                </span>
                                <span className="badge badge-category">{item.category}</span>
                            </div>

                            <h3>{item.title}</h3>
                            <div className="meta-line">
                                <span>👨‍🏫 {item.instructor}</span>
                                <span>⏱ {item.duration}</span>
                                <span>📊 {item.level || "Intermediate"}</span>
                            </div>
                            <p className="desc-text">{item.description}</p>
                        </div>

                        <div className="action-row">
                            <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>
                                Enrolled: {item.enrolled || 1} students
                            </span>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button className="btn-sm btn-edit" onClick={() => handleEdit(item)}>
                                    Edit (PUT)
                                </button>
                                <button className="btn-sm btn-del" onClick={() => handleDelete(item._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Courses;
