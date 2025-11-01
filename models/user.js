const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
    },
    // user ka username and password by default
    //  passportLocalMongoose generate krega!!
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);