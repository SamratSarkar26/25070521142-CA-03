import { useEffect, useState } from 'react';
import './App.css';

const Students = () => {

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [toast, setToast] = useState("");

    const getAllStudents = async () => {

        try {

            const res = await fetch("http://localhost:5000/getall");
            const data = await res.json();
            setStudents(data);

        } catch (error) {

            console.log("Error : " + error);
        }

    };

    useEffect(() => {

        getAllStudents();

    }, []);

    const updateStudentStatus = async (item) => {

        const nextStatus = item.status === "Active" ? "Verified Honors" : "Active";

        await fetch(`http://localhost:5000/update/${item._id}`, {
            method : "PUT",
            headers : { "Content-Type" : "application/json" },
            body : JSON.stringify({ status : nextStatus })
        });

        setToast(`Updated ${item.name}'s status to ${nextStatus}`);
        setTimeout(() => setToast(""), 3000);
        getAllStudents();

    };

    const deleteStudent = async (id) => {

        await fetch(`http://localhost:5000/delete/${id}`, {
            method : "DELETE"
        });

        setToast("Student record deleted from MongoDB Compass");
        setTimeout(() => setToast(""), 3000);
        getAllStudents();

    };

    const filtered = students.filter((s) =>
        (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.prn || "").toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div className="home-cont">

            {toast && <div className="toast-banner">{toast}</div>}

            <div className="toolbar-row">
                <div>
                    <h2 style={{ fontSize: "22px" }}>Registered Student Directory (`sitSecB.student`)</h2>
                    <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                        Live records retrieved via GET /getall with PUT & DELETE controls
                    </p>
                </div>

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by student name, PRN, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-wrap">
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>PRN</th>
                            <th>Email Address</th>
                            <th>Branch</th>
                            <th>Age</th>
                            <th>Status</th>
                            <th>Database Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                                    No matching student records found. Register a new student on the Register page!
                                </td>
                            </tr>
                        ) : (
                            filtered.map((std) => (
                                <tr key={std._id}>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "700" }}>
                                            <span className="avatar-circle">{(std.name || "S").charAt(0).toUpperCase()}</span>
                                            {std.name}
                                        </div>
                                    </td>
                                    <td style={{ color: "#38bdf8", fontWeight: "600" }}>{std.prn || "25070521142"}</td>
                                    <td>{std.email}</td>
                                    <td>{std.branch || "CSE - Sec B"}</td>
                                    <td>{std.age}</td>
                                    <td>
                                        <span className={`badge ${std.status === "Active" ? "badge-active" : "badge-category"}`}>
                                            {std.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-sm btn-edit"
                                            style={{ marginRight: "8px" }}
                                            onClick={() => updateStudentStatus(std)}
                                        >
                                            Toggle Status (PUT)
                                        </button>
                                        <button
                                            className="btn-sm btn-del"
                                            onClick={() => deleteStudent(std._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Students;
