const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

//ressource schema
const resourceSchema = new mongoose.Schema(
    {
        id: {//added directly by sequence (plugin Autoincrement) //require indirectly by plugin sequence
            type: Number,
            unique: true
        },
        idMember: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "member"
        },
        title: {
            type: String,
            required: true,
            maxlength: 30, 
            minlength: 3,
            trim: true
        },
        category: { 
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
        picture: {
            type: String,
            default: "./upoads/profil/random-user.png"
        }
    }
)

//plugin mongoose sequence 
resourceSchema.plugin(AutoIncrement, {id: 'ressource_seq', inc_field: 'id'});

const ResourceModel = mongoose.model('resource', resourceSchema);
module.exports = ResourceModel;