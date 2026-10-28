import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();
        setMsg("");

        try {

            const response = await fetch("http://localhost:5000/login", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    email : email,
                    password : password
                })
            });

            const data = await response.json();

            if( data.jwtToken ){

                localStorage.setItem("jwtToken", data.jwtToken);
                localStorage.setItem("studentName", data.name || "Student");
                localStorage.setItem("studentPrn", data.prn || "25070521142");
                navigate("/home");
            }
            else{

                setMsg(data.msg || "Invalid email or password");
            }

        } catch (error) {

            console.log("Error : " + error);
            setMsg("Cannot connect to backend server on port 5000.");
        }

    };

    return (

        <div className="form-wrapper">

            <div className="form-card">

                <span className="badge badge-active" style={{ marginBottom: "10px" }}>
                    JWT + Bcrypt Secured
                </span>
                <h2>Welcome Back</h2>
                <p className="sub-text">Sign in with your registered email to launch the Interactive Dashboard</p>

                {msg && <div className="alert-box">{msg}</div>}

                <form onSubmit={handleLogin}>

                    <div className="input-group">
                        <label>Registered Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Authenticate & Launch Dashboard →
                    </button>

                </form>

                <p style={{ marginTop: "20px", fontSize: "14px", textAlign: "center", color: "#94a3b8" }}>
                    New student? <Link to="/" style={{ color: "#38bdf8", fontWeight: "600", textDecoration: "none" }}>Create a Student Account</Link>
                </p>

            </div>

        </div>
    );
};

export default Login;
