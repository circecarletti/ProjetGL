const AdultMemberModel = require('../models/adultMember.model');
const MemberModel = require('../models/member.model');


module.exports.signUp = async (req, res) => {
    console.log(req.body);
    const {email, password, name, firstName, age} = req.body

    try {

        const member = new MemberModel({
            email: email,
            password: password,
            name: name,
            firstName: firstName
        })
        member.save(function(error) {
            if (error) console.log(error);
            console.log('Member successfully created!');
          });
        //res.status(201).json({ user: mbm._id});    
        const user = await AdultMemberModel.create({ member, age });
        res.status(201).json({ user: user._id});

        /*
        //member.save();
        const mbm = await MemberModel.create({email, password, name, firstName });
        res.status(201).json({ user: mbm._id});

        const user2 = await AdultMemberModel.create({ mbm_id, age });
        res.status(201).json({ user2: user2._id});*/
    }
    catch(err) {
        res.status(200).send({ err });
    }
}
