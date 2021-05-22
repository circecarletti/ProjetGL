const mongoose = require('mongoose');
const { isEmail } = require('validator');

//loan schema 
const loanSchema = new mongoose.Schema(
    {
        idAdherent: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'members',
            unique: true,
            required: true
        },
        idResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'resource'}]
    }
);

const LoanModel = mongoose.model('loan', loanSchema);
module.exports = LoanModel;