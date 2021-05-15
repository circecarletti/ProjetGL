
const mongoose = require('mongoose');
const { isEmail } = require('validator');

//child member schema 
const childMemberSchema = new mongoose.Schema(
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
            min: 4,
            max: 17,
            trim: true,
            required: true
        },
        adultMember: {
            type: String,
            trim: true,
            lowercase: true, 
            validate: [isEmail],
            required: true
        }
    }
)

const ChildMemberModel = mongoose.model('childMember', childMemberSchema);
module.exports = ChildMemberModel;  