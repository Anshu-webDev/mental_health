const express = require("express");
const router = express.Router();

const Controller = require('../controllers/userCtrl');

router.get('/', Controller.home);

router.get('/register', Controller.register);
router.post('/register', Controller.handleRegister);

router.get('/login', Controller.login);
router.post('/login', Controller.handleLogin);

router.get("/dashboard", Controller.dashboard);

router.get("/edit_profile", Controller.edit_profile);
router.post("/edit_profile", Controller.handleEditProfile);

router.get("/health_tracker", Controller.health_tracker);
router.get("/ai_voice", Controller.ai_voice);
router.get("/nutritional_guide", Controller.nutritional_guide);
router.get("/individual_therapy", Controller.individual_therapy);

router.get("/discussion_forum", Controller.discussion);

router.get('/logout', Controller.logout)

module.exports = router;