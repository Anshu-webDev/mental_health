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
    console.log(username);
    console.log(email);
    console.log(password);

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
                    res.redirect("/dashboard");
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

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        }
        res.redirect("/");
    })
}

module.exports = { home, register, login, handleRegister, handleLogin, dashboard, health_tracker, ai_voice, logout }