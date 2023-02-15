const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/mentalHealth", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(con => {
    console.log("connected to DB");
}).catch(error => {
    console.log("error ", error);
})

module.exports = mongoose;