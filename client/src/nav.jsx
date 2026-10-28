import { Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

const Nav = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("jwtToken");
    const studentName = localStorage.getItem("studentName") || "Student";
    const studentPrn = localStorage.getItem("studentPrn") || "25070521142";

    const handleLogout = () => {

        localStorage.removeItem("jwtToken");
        localStorage.removeItem("studentName");
        localStorage.removeItem("studentPrn");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path ? "nav-link-item nav-link-active" : "nav-link-item";

    return (

        <nav className='my-nav'>

            <Link to = "/home" className='brand-wrap'>
                <div className='brand-icon'>EP</div>
                <span className='brand-title'>EduPulse Pro</span>
                <span className='brand-badge'>SIT LMS</span>
            </Link>

            <ul className='d-flex'>
                <li>
                    <Link to = "/home" className={isActive("/home")}>Dashboard</Link>
                </li>
                <li>
                    <Link to = "/courses" className={isActive("/courses")}>Course Studio</Link>
                </li>
                <li>
                    <Link to = "/students" className={isActive("/students")}>Student Directory</Link>
                </li>
                <li>
                    <Link to = "/about" className={isActive("/about")}>Architecture</Link>
                </li>

                {!token ? (
                    <>
                        <li>
                            <Link to = "/" className={isActive("/")}>Register</Link>
                        </li>
                        <li>
                            <Link to = "/login" className='btn-sm btn-edit' style={{ textDecoration: "none", marginLeft: "6px" }}>
                                Student Login
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <div className='user-pill'>
                                <span className='avatar-circle'>{studentName.charAt(0).toUpperCase()}</span>
                                <span>{studentName} ({studentPrn})</span>
                            </div>
                        </li>
                        <li>
                            <button onClick={handleLogout} className='btn-sm btn-del'>
                                Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>

        </nav>
    );
};

export default Nav;
