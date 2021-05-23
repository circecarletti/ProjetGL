const mongoose = require('mongoose');
const { isEmail } = require('validator');
const ChildMemberModel = require('../models/childmember.model');


//adult member schema 
const adultMemberSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "member",
            required: true, 
            unique: true
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
            min: 18,
            max: 100,
            required: true
        },
        childlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'childmember', default: null}]
    }
)

const AdultMemberModel = mongoose.model('adultmember', adultMemberSchema);
module.exports = AdultMemberModel; 