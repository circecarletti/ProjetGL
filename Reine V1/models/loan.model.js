const mongoose = require('mongoose');
const { isEmail } = require('validator');

//loan schema 
const loanSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true, 
            unique: true,
            trim: true
        },
        idResources: {
            type: [Number]
        }
    }
)

const LoanModel = mongoose.model('loan', loanSchema);
module.exports = LoanModel;