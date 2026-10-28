const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyparser = require("body-parser");
const bCrypt = require("bcrypt");
const jwtToken = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyparser.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const port = 5000;

const myDb = client.db("sitSecB");

async function connectToMongoDb(){

    try {

        await client.connect();
        console.log("Connection successfully done with mongodb");

        const count = await myDb.collection("courses").countDocuments();

        if( count < 4 ){

            await myDb.collection("courses").deleteMany({});

            await myDb.collection("courses").insertMany([
                {
                    title : "Full-Stack MERN & Cloud Architecture",
                    instructor : "Prof. Somesh Chutel",
                    category : "Web Development",
                    duration : "12 Weeks",
                    level : "Intermediate",
                    rating : "4.9",
                    enrolled : 142,
                    credits : 4,
                    status : "Active",
                    description : "Master React 19, Node.js, Express, JWT Security, and MongoDB Compass with real-world deployment."
                },
                {
                    title : "Data Structures & Competitive Algorithms",
                    instructor : "Dr. R. Deshmukh",
                    category : "Computer Science",
                    duration : "10 Weeks",
                    level : "Advanced",
                    rating : "4.8",
                    enrolled : 198,
                    credits : 4,
                    status : "Active",
                    description : "Deep dive into Graph Theory, Dynamic Programming, Heaps, Trees, and FAANG interview problem solving."
                },
                {
                    title : "Applied Machine Learning & Neural Networks",
                    instructor : "Dr. Sneha Kulkarni",
                    category : "AI & Data Science",
                    duration : "14 Weeks",
                    level : "Advanced",
                    rating : "4.9",
                    enrolled : 116,
                    credits : 5,
                    status : "Active",
                    description : "Hands-on supervised learning, deep neural networks, NLP transformers, and predictive analytics."
                },
                {
                    title : "DevOps, Docker & Kubernetes Pipelines",
                    instructor : "Prof. A. Verma",
                    category : "Cloud & DevOps",
                    duration : "8 Weeks",
                    level : "Intermediate",
                    rating : "4.7",
                    enrolled : 89,
                    credits : 3,
                    status : "Active",
                    description : "Automate CI/CD workflows, container orchestration, microservices monitoring, and cloud scaling."
                },
                {
                    title : "Cybersecurity & Ethical Hacking Lab",
                    instructor : "Prof. K. Joshi",
                    category : "Cybersecurity",
                    duration : "6 Weeks",
                    level : "Beginner",
                    rating : "4.8",
                    enrolled : 74,
                    credits : 3,
                    status : "Upcoming",
                    description : "Network penetration testing, cryptography, OWASP Top 10 vulnerabilities, and zero-trust security."
                },
                {
                    title : "Modern UI/UX Engineering & Design Systems",
                    instructor : "Prof. M. Patil",
                    category : "UI/UX Design",
                    duration : "6 Weeks",
                    level : "Beginner",
                    rating : "4.9",
                    enrolled : 128,
                    credits : 2,
                    status : "Active",
                    description : "Craft interactive golden-white luxury interfaces, micro-animations, Figma prototypes, and layouts."
                }
            ]);
        }

        app.listen(port, () => {

            console.log("Server started at port : " + port);
        });

    } catch (error) {

        console.log("Connection failed to mongodb : " + error);
    }

}

connectToMongoDb();

app.get("/getall", async (req, res) => {

    let data = await myDb.collection("student").find().sort({ _id : -1 }).toArray();

    res.send( data );

});

app.get("/get/:id", async (req, res) => {

    const id = req.params.id;

    const student = await myDb.collection("student").findOne({ _id : new ObjectId(id) });

    res.send( student );
});

app.post("/create", async (req, res) => {

    try {

        console.log( req.body );

        const { name, age, status, password, email, prn, branch } = req.body;
        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanPass = String(password || "").trim();

        const hashedPass = await bCrypt.hash(cleanPass, 10);

        await myDb.collection("student").deleteMany({
            email : { $regex : new RegExp("^" + cleanEmail + "$", "i") }
        });

        const response = await myDb.collection("student").insertOne({
            name : name,
            age : age,
            status : status || "Active",
            prn : prn || "25070521142",
            branch : branch || "CSE - Sec B",
            password : hashedPass,
            email : cleanEmail
        });

        res.send(response);

    } catch (err) {

        res.status(500).send({ msg : "Error creating student account" });
    }

});

app.post("/login", async (req, res) => {

    try {

        const email = (req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "").trim();

        const student = await myDb.collection("student").findOne(
            { email : { $regex : new RegExp("^" + email + "$", "i") } },
            { sort : { _id : -1 } }
        );

        if( student != null ){

            let isCorrect = false;
            try {
                isCorrect = await bCrypt.compare(password, student.password);
            } catch (e) {
                isCorrect = false;
            }

            if( !isCorrect && password === student.password ){
                isCorrect = true;
            }

            if( isCorrect ){

                const payLoad = {
                    subject : student.name,
                    role : student.status
                };

                res.send({
                    jwtToken : jwtToken.sign(payLoad, "MY_SECRET_TOKEN"),
                    name : student.name,
                    email : student.email,
                    prn : student.prn || "25070521142",
                    branch : student.branch || "CSE - Sec B",
                    status : student.status
                });
            }
            else{

                res.status(401).send({ msg : "Invalid Password. Please try again." });
            }

        }
        else{

            res.status(422).send({ msg : "No account found with this email. Please Sign Up first." });
        }

    } catch (err) {

        res.status(500).send({ msg : "Login error" });
    }

});

app.put("/update/:id", async (req, res) => {

    const id = req.params.id;

    const student = await myDb.collection("student").findOne({ _id : new ObjectId(id) });

    if( student != null ){

        const { status } = req.body;

        const response = await myDb.collection("student").updateOne(
            { _id : new ObjectId(id) },
            { $set : { status : status } }
        );

        res.send(response);
    }
    else{

        res.status(404).send({ msg : "Student Id Invalid" });
    }

});

app.delete("/delete/:id", async (req, res) => {

    const id = req.params.id;

    const response = await myDb.collection("student").deleteOne({ _id : new ObjectId(id) });

    res.send(response);

});

app.get("/courses", async (req, res) => {

    let data = await myDb.collection("courses").find().sort({ _id : -1 }).toArray();

    res.send( data );

});

app.post("/courses/create", async (req, res) => {

    const { title, instructor, category, duration, level, credits, status, description } = req.body;

    const response = await myDb.collection("courses").insertOne({
        title : title,
        instructor : instructor,
        category : category || "Web Development",
        duration : duration || "10 Weeks",
        level : level || "Intermediate",
        rating : "4.9",
        enrolled : 1,
        credits : Number(credits) || 4,
        status : status || "Active",
        description : description
    });

    res.send(response);

});

app.put("/courses/update/:id", async (req, res) => {

    const id = req.params.id;
    const { title, instructor, category, duration, level, credits, status, description } = req.body;

    const response = await myDb.collection("courses").updateOne(
        { _id : new ObjectId(id) },
        {
            $set : {
                title : title,
                instructor : instructor,
                category : category,
                duration : duration,
                level : level || "Intermediate",
                credits : Number(credits) || 4,
                status : status,
                description : description
            }
        }
    );

    res.send(response);

});

app.post("/courses/enroll/:id", async (req, res) => {

    const id = req.params.id;

    const response = await myDb.collection("courses").updateOne(
        { _id : new ObjectId(id) },
        { $inc : { enrolled : 1 } }
    );

    res.send(response);

});

app.delete("/courses/delete/:id", async (req, res) => {

    const id = req.params.id;

    const response = await myDb.collection("courses").deleteOne({ _id : new ObjectId(id) });

    res.send(response);

});
