import './App.css';

const About = () => {

    return (

        <div className="home-cont">

            <div className="hero-box">
                <div>
                    <span className="badge badge-active" style={{ marginBottom: "10px" }}>
                        SYSTEM ARCHITECTURE • CA-03 FLEXI PROJECT
                    </span>
                    <h1>Full-Stack Architecture & API Specification</h1>
                    <p>
                        Built by PRN 25070521142 using React 19, Node.js, Express 5, Bcrypt Cryptography, JSON Web Tokens, and MongoDB Compass.
                    </p>
                </div>
            </div>

            <div className="cards-grid">
                <div className="card-item">
                    <div>
                        <span className="badge badge-category" style={{ marginBottom: "12px" }}>Frontend Layer</span>
                        <h3>React.js 19 + Vite SPA</h3>
                        <p className="desc-text">
                            Component-driven Single Page Application with React Router DOM v7, real-time search & category filtering, interactive course enrollment, and persistent JWT session state.
                        </p>
                    </div>
                    <div className="meta-line">Port: http://localhost:5173</div>
                </div>

                <div className="card-item">
                    <div>
                        <span className="badge badge-active" style={{ marginBottom: "12px" }}>Backend Layer</span>
                        <h3>Node.js + Express REST API</h3>
                        <p className="desc-text">
                            Asynchronous RESTful API server handling student authentication (`/create`, `/login`), password hashing via Bcrypt (10 salt rounds), and JWT signing (`MY_SECRET_TOKEN`).
                        </p>
                    </div>
                    <div className="meta-line">Port: http://localhost:5000</div>
                </div>

                <div className="card-item">
                    <div>
                        <span className="badge badge-upcoming" style={{ marginBottom: "12px" }}>Database Layer</span>
                        <h3>MongoDB Compass (`sitSecB`)</h3>
                        <p className="desc-text">
                            Connected via the official MongoDB Node.js driver to `mongodb://localhost:27017`. Stores collections `student` and `courses` with full `GET`, `POST`, `PUT`, and `DELETE` operations.
                        </p>
                    </div>
                    <div className="meta-line">URI: mongodb://localhost:27017</div>
                </div>
            </div>

        </div>
    );
};

export default About;
