
const mongoose = require('mongoose');
const { isEmail } = require('validator');

//child member schema 
const childMemberSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "member",
            required: true
        },
        id: {
            type: String,
            validate: [isEmail],
            lowercase: true, 
            trim: true,
            required: true,
            unique:true
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
            validate: [isEmail],
            lowercase: true, 
            trim: true,
            required: true
        }
    }
)

const ChildMemberModel = mongoose.model('childMember', childMemberSchema);
module.exports = ChildMemberModel;  