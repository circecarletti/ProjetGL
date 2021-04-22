
const mongoose = require('mongoose');
const { isEmail } = require('validator');

const childMemberSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'member',
            unique: true
        },
        age: {
            type: Number,
            min: 4,
            max: 17,
            trim: true,
            required: true,
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