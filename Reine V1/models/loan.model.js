const mongoose = require('mongoose');
const { isEmail } = require('validator');

//loan schema 
const loanSchema = new mongoose.Schema(
    {
        idadherent: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'members',
            unique: true,
            required: true
        },
        idresources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'resource'}]
    }
);

const LoanModel = mongoose.model('loan', loanSchema);
module.exports = LoanModel;