const User = require("../models/users");
const Depression_data = require("../models/data");

const home = (req, res) => {
    res.render('index');
}

const register = (req, res) => {
    res.render('register', {message: req.flash("message")});
}

const login = (req, res) => {
    res.render('login', {message: req.flash("message")});
}

const handleRegister = (req, res) => {
    const { username, email, password } = req.body;
    // console.log(username);
    // console.log(email);
    // console.log(password);

    const user = new User({
        username: username,
        email: email,
        password: password
    });

    user.save((err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash("message", "User created successfully");
            res.redirect("/login")
        }
    })
}

const handleLogin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, foundUser) => {
        if (!err) {
            if (foundUser) {
                if (foundUser.password == password) {
                    // create session then redirect to dashboard
                    let sess = req.session;
                    sess.user = foundUser;
                    res.redirect("/health_tracker");
                } else {
                    // incorrect password
                    req.flash("message", "Incorrect password");
                    res.redirect("/login");
                }
            } else {
                // incorrect user
                req.flash("message", "Incorrect username or password")
                res.redirect("/login")
            }
        }
    })
}

const dashboard = (req, res) => {
    if (req.session.user) {
        res.render("dashboard", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
}

const edit_profile = (req, res) => {
    if (req.session.user) {
        res.render("edit_profile", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
}

const handleEditProfile = (req, res) => {
    // console.log(req.body);
    // console.log(req.session.user);
    const { username, email, age, gender, address, hobbies, job, dwh, phy_ill } = req.body;

    // console.log(req.session.user._id);
    let data = User.findOneAndUpdate({ _id: req.session.user._id }, {
        username: username,
        email: email,
        age: age,
        gender: gender,
        address: address,
        hobbies: hobbies,
        job: job,
        dwh: dwh,
        phy_ill: phy_ill
    }, { useFindAndModify: false, new: true }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            console.log("Successfully updated the document");
        }
    });
    req.session.user = data._update;
    // User.findOne({ _id: req.session.user._id }, (err, foundUser) => {
    //     if (foundUser) {
    //         req.session.user = foundUser;
    //     }
    // })
    res.redirect("/dashboard");


    // User.updateOne({ "_id": req.session.user._id }, {
    //     "$set": {
    //         "username": username,
    //         "email": email,
    //         "address": address,
    //         "hobbies": hobbies,
    //         "job": job
    //     }
    // }, (err, result) => {
    //     if (!err) {
    //         console.log(result);
    //         res.redirect("/dashboard");
    //     }
    // })
}


const health_tracker = (req, res) => {
    if (req.session.user) {
        console.log(typeof(req.session.user._id));
        Depression_data.find({user_id: req.session.user._id}, (err, result)=>{
            if(!err){
                console.log(result);
                res.render("health_tracker", { user: req.session.user, depression_data: result });
            }
        })
    } else {
        res.redirect("/login");
    }
}

const ai_voice = (req, res) => {
    if (req.session.user) {
        res.render("chat", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
}

const handleAudio = (req, res)=>{
    console.log(req.file.filename);
    let data = User.findOneAndUpdate({ _id: req.session.user._id }, {
        $push: {
            audio_rec : req.file.filename
        }
    }, { useFindAndModify: false, new: true }, (err, result)=>{
        if(!err){
            res.redirect("/individual_therapy");
        }
    })
    req.session.user.audio_rec.push(data._update.$push.audio_rec);
}

const nutritional_guide = (req, res) => {
    if (req.session.user) {
        res.render("nutritional_guide", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
}

const individual_therapy = (req, res) => {
    if (req.session.user) {
        res.render("individual_therapy", { user: req.session.user, message: req.flash("message") });
    } else {
        res.redirect("/login");
    }
}

const handleIndividual_therapy = (req, res)=>{
    let data = User.findOneAndUpdate({ _id: req.session.user._id }, {
        $push: {
            appointments : req.body
        }
    }, { useFindAndModify: false, new: true }, (err, result)=>{
        if(!err){
            req.flash("message", "Appointment booked successfully");
            res.redirect("/individual_therapy");
        }
    })
    req.session.user.appointments.push(data._update.$push.appointments);
}

const discussion = (req, res) => {
    if (req.session.user) {
        res.render("discussion", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        }
        res.redirect("/");
    })
}

module.exports = {
    home, register, login, handleRegister, handleLogin, dashboard, edit_profile, handleEditProfile, health_tracker, ai_voice,
    nutritional_guide, handleAudio, individual_therapy, handleIndividual_therapy, discussion, logout
}