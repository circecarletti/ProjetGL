const mongoose = require('mongoose');
const { isEmail } = require('validator');

//adult member schema 
const adultMemberSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "member",
            required: true
        },
        _id: {
            type: String,
            validate: [isEmail],
            lowercase: true, 
            trim: true
        },
        age: {
            type: Number,
            min: 18,
            max: 100,
            required: true
        },
        childList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'childMember', default: null}]
    }
)

const AdultMemberModel = mongoose.model('adultMember', adultMemberSchema);
module.exports = AdultMemberModel; 