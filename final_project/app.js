const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/attendanceSystem');

// Create a mongoose model for OTPs
const Otp = mongoose.model('Otp', {
    otp: String,
    validUntil: Date,
});


const teacher_array = [
    {
        id:1,
        Email: "gautamsaha12@gmail.com",
        password: "123"

    },
    {
        id:2,
        Email: "rohanbiswas11@gmail.com",
        password: "456"
    }
]

app.get("/", function(req, res) {
    res.sendFile("/Users/somnath/Desktop/final_project/views/index.html");
})
app.get("/teacher_login", function(req, res) {
    res.sendFile("/Users/somnath/Desktop/final_project/views/teacherLogin.html")
})
app.post("/teacher_login", function(req, res) {
    // teacher_array.forEach(array => {
    //     for (let i = 0; i < teacher_array.length; i++) {
    //         if (teacher_array[i].Email === req.body.email) {
    //             if (teacher_array[i].password === req.body.password)  {
    //                 console.log(true);
    //                 res.sendFile("/Users/somnath/Desktop/final_project/views/teacherDashboard.html");
    //             } else {
    //                 console.log(false);
    //                 res.send("Password incorrect")
    //             }  // Email found in the array
    //         } else {
    //             res.send("User not registered")
    //         }
    //     }
    // })
    res.redirect("/teacher_dashbaord");
});
app.get("/teacher_dashboard", function(req, res) {
    res.sendFile("/Users/somnath/Desktop/final_project/views/teacherDashboard.html");
})

app.get("/student_login", function(req, res) {
    res.sendFile("/Users/somnath/Desktop/final_project/views/studentLogin.html")
})


app.post('/teacher/submit', async (req, res) => {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    const validUntil = new Date(Date.now() + 3 * 60 * 1000); // Valid for 5 minutes

    // Save OTP in the database
    const teacherOtp = new Otp({ otp, validUntil });
    await teacherOtp.save();
    res.send(`Your Otp is: ${otp}`);
});

app.get('/student', (req, res) => {
    firstName = "Rohan"
    res.render('student.ejs', { firstName });
});

// Handle student form submission
app.post('/student/submit', async (req, res) => {
    const enteredOtp = req.body.enteredOtp;
    
    // Find the OTP in the database
    const teacherOtp = await Otp.findOne({ otp: enteredOtp, validUntil: { $gt: new Date() } });

    if (teacherOtp) {
        s = "Attendance Taken Successfully!!"
        // Valid OTP, mark attendance or perform other actions
        res.render("successful.ejs", { s });
    } else {
        f = "Sorry your attendance has not been taken.."
        res.render("successful.ejs", { f });
    }
});














app.listen(3000, () => {
    console.log("Server runing successfully on port 3000")
})