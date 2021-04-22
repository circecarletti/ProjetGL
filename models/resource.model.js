const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
            trim: true
        },
        idMember: {
            type: String,
            validate: [isEmail],
            lowercase: true, 
            unique: true,
            trim: true
        },
        title: {
            type: String,
            required: true,
            maxlength: 30, 
            minlength: 3,
            trim: true
        },
        categorie: { 
            type: String, 
            enum: ['enfant', 'adulte', 'tousPublic'],
            required: true
        },
        author: {
            type: String,
            required: true,
            maxlength: 30, 
            minlength: 3,
            trim: true
        },
        loan: {
            type: Boolean,
            default: false
        },
        type: { 
            type: String, 
            enum: ['livre', 'CD', 'DVD', 'jeuxVideo'],
        },
        loanday: { //jourDEmpruntRestant
            type: Number, 
            min: 0,
            max: 30,
            default:30
        }, 
        releaseDate: {
            type: Number,
            min: 1000,
            max: 2021,
            required: true
        },
    }
)

const ResourceModel = mongoose.model('resource', resourceSchema);
module.exports = ResourceModel;