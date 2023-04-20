const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const url = "mongodb+srv://admin-anshu:Test123@cluster0.grusn.mongodb.net/mentalHealth";
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(con => {
    console.log("connected to DB");
}).catch(error => {
    console.log("error ", error);
})

module.exports = mongoose;