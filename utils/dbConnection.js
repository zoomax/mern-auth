const mongoose = require("mongoose");
async function connect() {
    try {
        await mongoose.connect("mongodb://localhost:27017/api-auth" , { 
            useUnifiedTopology : true  , 
            useNewUrlParser : true , 
            useFindAndModify : true  , 
        }) ; 
        console.log("you're now connected to our database ")
    } catch (error) {
        console.log(error) ; 
    }

}

module.exports = connect ; 