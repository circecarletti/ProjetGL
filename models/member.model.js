const mongoose = require('mongoose');
const { isEmail } = require('validator');

const memberSchema = new mongoose.Schema(
    {   
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true, 
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            maxlength: 1024, //1024 car cryptage, verification taille max : 24 en front 
            minlength: 8,
            trim: true
        }, 
        name: {
            type: String,
            required: true,
            maxlength: 30, 
            minlength: 3,
            trim: true
        },
        firstName: {
            type: String,
            required: true,
            maxlength: 30, 
            minlength: 3,
            trim: true
        }, 
        balance: {
            type: Number,
            max: 5000, 
            min: -1000,
            default: 0
        }, 
        nbResource: {
            type: Number,
            max: 10, 
            min: 0,
            default: 0
        },
        block: {
            type: Boolean,
            default: false
        },
        loan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'loan'
        },
        dateSubscription: {
            type: Date
        },
        nbFailConnection: {
            type: Number, 
            min: 0,
            max: 10,
            default:0
        }, 
        subscribe: {
            type: Boolean, 
            default: false
        }
    }
)

const MemberModel = mongoose.model('member', memberSchema);
module.exports = MemberModel;