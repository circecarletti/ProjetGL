const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

//member schema 
const memberSchema = new mongoose.Schema(
    {   
        id: {
            type: String,
            validate: [isEmail],
            lowercase: true, 
            trim: true,
            required: true,
            unique:true
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
            ref: 'loan',
            unique: true
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
);

//password encryption with bcrypt
//cryptage mdp
memberSchema.pre("save", async function(next) {
    //salage du mot de passe
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const MemberModel = mongoose.model('member', memberSchema);
module.exports = MemberModel;
