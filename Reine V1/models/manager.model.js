const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

//manager schema 
const managerSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            validate: [isEmail],
            lowercase: true, 
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

const ManagerModel = mongoose.model('manager', managerSchema);
module.exports = ManagerModel;