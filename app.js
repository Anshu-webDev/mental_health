const express = require("express");
const port = 3000;
const router = require('./routes/router')
const session = require("express-session")
const flash = require("connect-flash")

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'my little secrets',
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(router);

app.listen(process.env.PORT || port, () => {
    console.log(`server is listening on port ${port}`);
})