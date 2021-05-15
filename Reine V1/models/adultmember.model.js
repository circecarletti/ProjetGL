const mongoose = require('mongoose');
const { isEmail } = require('validator');

//adult member schema 
const adultMemberSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true, 
            unique: true,
            trim: true
        },
        age: {
            type: Number,
            min: 18,
            max: 100,
            required: true
        },
        childList: {
            type: [String]
        }
    }
)

const AdultMemberModel = mongoose.model('adultMember', adultMemberSchema);
module.exports = AdultMemberModel; 