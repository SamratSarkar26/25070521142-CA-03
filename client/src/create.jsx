import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

const Create = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [prn, setPrn] = useState("25070521142");
    const [branch, setBranch] = useState("CSE - Sec B");
    const [age, setAge] = useState("20");
    const [status, setStatus] = useState("Active");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const handleCreate = async (e) => {

        e.preventDefault();
        setMsg("");

        try {

            const response = await fetch("http://localhost:5000/create", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    name : name,
                    email : email,
                    prn : prn,
                    branch : branch,
                    age : age,
                    status : status,
                    password : password
                })
            });

            const data = await response.json();

            if( data.insertedId ){

                navigate("/login");
            }
            else{

                setMsg(data.msg || "Unable to create user. Please check inputs.");
            }

        } catch (error) {

            console.log("Error : " + error);
            setMsg("Backend server unreachable. Make sure node server.js is running on port 5000.");
        }

    };

    return (

        <div className="form-wrapper">

            <div className="form-card">

                <span className="badge badge-category" style={{ marginBottom: "10px" }}>
                    Symbiosis Institute of Technology
                </span>
                <h2>Create Student Account</h2>
                <p className="sub-text">Register your PRN & credentials into MongoDB Compass</p>

                {msg && <div className="alert-box">{msg}</div>}

                <form onSubmit={handleCreate}>

                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Samrat Sarkar"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Official Email Address</label>
                        <input
                            type="email"
                            placeholder="samrat@sitnagpur.siu.edu.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div className="input-group">
                            <label>PRN Number</label>
                            <input
                                type="text"
                                placeholder="25070521142"
                                value={prn}
                                onChange={(e) => setPrn(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Age</label>
                            <input
                                type="number"
                                placeholder="20"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div className="input-group">
                            <label>Branch & Section</label>
                            <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                                <option value="CSE - Sec A">CSE - Sec A</option>
                                <option value="CSE - Sec B">CSE - Sec B</option>
                                <option value="CSE - Sec C">CSE - Sec C</option>
                                <option value="CSE - Sec D">CSE - Sec D</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Academic Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Active">Active</option>
                                <option value="Honors Track">Honors Track</option>
                                <option value="Hosteller">Hosteller</option>
                                <option value="Day Scholar">Day Scholar</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password (Encrypted with Bcrypt)</label>
                        <input
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Complete Registration & Proceed to Login →
                    </button>

                </form>

                <p style={{ marginTop: "20px", fontSize: "14px", textAlign: "center", color: "#94a3b8" }}>
                    Already registered? <Link to="/login" style={{ color: "#38bdf8", fontWeight: "600", textDecoration: "none" }}>Sign in here</Link>
                </p>

            </div>

        </div>
    );
};

export default Create;
