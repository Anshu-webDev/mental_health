const User = require("../models/users");

const home = (req, res) => {
    res.render('index');
}

const register = (req, res) => {
    res.render('register');
}

const login = (req, res) => {
    res.render('login');
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
                    res.redirect("/login");
                }
            } else {
                // incorrect user
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

    // let doc = User.findOneAndUpdate({ "_id": req.session.user._id }, {
    //     username: username,
    //     email: email,
    //     address: address,
    //     hobbies: hobbies,
    //     job: job
    // }, { new: true });

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
        res.render("health_tracker", { user: req.session.user });
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

const nutritional_guide = (req, res) => {
    if (req.session.user) {
        res.render("nutritional_guide", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
}

const individual_therapy = (req, res) => {
    if (req.session.user) {
        res.render("individual_therapy", { user: req.session.user });
    } else {
        res.redirect("/login");
    }
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
    nutritional_guide, individual_therapy, discussion, logout
}