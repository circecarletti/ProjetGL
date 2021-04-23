const mongoose = require('mongoose');
                                                                                                                                
const adultMemberSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'member',
            unique: true
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