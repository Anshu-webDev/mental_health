const express = require("express");
const router = express.Router();

const multer = require("multer")

const storage = multer.diskStorage({
    destination : (req, file, callback)=>{
        callback(null, "./public/sound-rec/")
    },
    filename: (req, file, callback)=>{
        callback(null, req.session.user._id + file.originalname)
    }

})

const  upload = multer({
    storage: storage
});

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
router.post("/send_audio", upload.single("audio"), Controller.handleAudio);

router.get("/nutritional_guide", Controller.nutritional_guide);

router.get("/individual_therapy", Controller.individual_therapy);
router.post("/individual_therapy", Controller.handleIndividual_therapy);

router.get("/discussion_forum", Controller.discussion);

router.get('/logout', Controller.logout)

module.exports = router;