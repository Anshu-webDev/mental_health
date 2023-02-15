const express = require("express");
const router = express.Router();

const Controller = require('../controllers/userCtrl');

router.get('/', Controller.home);

router.get('/register', Controller.register);
router.post('/register', Controller.handleRegister);

router.get('/login', Controller.login);
router.post('/login', Controller.handleLogin);

router.get("/dashboard", Controller.dashboard);

router.get('/logout', Controller.logout)

module.exports = router;