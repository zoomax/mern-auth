const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");
// creating a schema
const UserSchema = new Schema({
    method: {
        type: String,
        enum: ["local", "facebook", "google"]
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String,
        },

    },
    google: {
        id: String,
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: String,
        email: {
            type: String,
            lowercase: true
        }
    }

})
// adding middlewars for CRUD operations
UserSchema.pre("save", async function (next) {
    try {
        if (this.method === "local") {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(this.local.password, salt);
            this.local.password = hashedPassword;
           
        }
        next();
    } catch (error) {
        next(error)
    }
});
// ADDING INSTANCE METHODS TO USER-MODEL INSTANCES 
UserSchema.methods.isValidPassword = async function (password) {
    try {
        if(this.method ===  "local") { 
            const isMatch = await bcryptjs.compare(password, this.local.password);
            return isMatch
        } 
    } catch (error) {
        throw new Error(error);
    }
}

//  creating a model 
const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel; 