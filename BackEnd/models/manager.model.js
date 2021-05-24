const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

//manager schema 
const managerSchema = new mongoose.Schema(
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
        age: {
            type: Number,
            min: 18,
            max: 100,
            required: true
        },
        statut: {
            type: String,
            default: 'manager'
        },
        picture: {
            type: String,
            default: "images/icon.jpg"        
        }
    }
)

//password encryption with bcrypt
//cryptage mdp
managerSchema.pre("save", async function(next) {
    //salage du mot de passe
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//function (decrypt password) to test if password send is equal to password in the database
managerSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ id: email });

    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const ManagerModel = mongoose.model('manager', managerSchema);
module.exports = ManagerModel;