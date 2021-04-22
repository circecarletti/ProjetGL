const MemberModel = require('../models/member.model');


module.exports.signUp = async (req, res) => {
    console.log(req.body);
    const {email, password, nom, prenom, age} = req.body

    try {
        const user = await MemberModel.create({email, password, nom, prenom, age });
        res.status(201).json({ user: user._id});
    }
    catch(err) {
        res.status(200).send({ err });
    }
}