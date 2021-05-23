const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

//ressource schema
const resourceSchema = new mongoose.Schema(
    {
        id: {//added directly by sequence (plugin Autoincrement) //require indirectly by plugin sequence
            type: Number,
            unique: true
        },
        idmember: {
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
            enum: ['child', 'adult', 'allpublic'],
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
            enum: ['book', 'cd', 'dvd', 'videogames'],
        },
        loanday: { //jourDEmpruntRestant
            type: Number, 
            min: 0,
            max: 30,
            default:30
        }, 
        releasedate: {
            type: Number,
            min: 1000,
            max: 2021,
            required: true
        },
        picture: {
            type: String,
            default: "./upoads/profil/random-user.png"
        },
        resume: {
            type: String,
            maxlength: 1000, 
            minlength:0,
            trim: true
        },
        synopsis: {
            type: String,
            maxlength: 1000, 
            minlength:0,
            trim: true
        },
        price: {
            type: Number,
            min: 1,
            max: 500,
            required: true
        }
    }
)

//plugin mongoose sequence 
resourceSchema.plugin(AutoIncrement, {id: 'ressource_seq', inc_field: 'id'});

const ResourceModel = mongoose.model('resource', resourceSchema);
module.exports = ResourceModel;