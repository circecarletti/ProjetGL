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
        firstname: {
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
        nbresource: {
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
        datesubscription: {
            type: Date
        },
        nbfailconnexion: {
            type: Number, 
            min: 0,
            max: 10,
            default:0
        }, 
        subscribe: { 
            type: Boolean, 
            default: false
        },
        statut: {
            type: String,          
            enum: ['adultmember', 'childmember']
        },
        picture: {
            type: String,
            default: "./upoads/profil/random-user.png"
        }
    }
);


//password encryption with bcrypt
//cryptage mdp
memberSchema.pre("save", async function(next) {
    const user = this;
    //salage du mot de passe 
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

//function (decrypt password) to test if password send is equal to password in the database
memberSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ id: email }); //find user with email

    if(user){ //if user exist 
        const auth = await bcrypt.compare(password, user.password); //bcrypt compare password crypted with password send
        if(auth){ 
            return user; //password ok
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

/*
memberSchema.pre('update', async function (next) {
    const user = this
    //console.log(req.body.password)
    console.log(user)
    console.log(path.password)

   // console.log(user.obj.password)
    console.log(user._update.$set.password) //bon
    if(user){
        //const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user._update.$set.password, 10);
        next();
    }else 
        next();
});
*/

const MemberModel = mongoose.model('member', memberSchema);
module.exports = MemberModel;