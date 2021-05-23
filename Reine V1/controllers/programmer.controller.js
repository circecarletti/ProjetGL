const ManagerModel = require('../models/manager.model');
const MemberModel = require('../models/member.model');

//signup manager
module.exports.signUpManager = async (req, res) => {
    //console.log(req.body);
    const {id, password, name, firstname} = req.body

    try {
        //verifiy id not in members collection
        if (await MemberModel.exists({ id: id}))
            return res.json({success:false, message:'ID existed'});

        //creating manager user
        const user = await ManagerModel.create({ id, password, name, firstname });
        console.log('Manager successfully created!'); 
        return res.json({success: true, user: user.id}); 
    }
    catch(err) {
        if(err.code == 11000)
            return res.json({ success: false, message: 'ID existed' });
       else {
            console.log(err);
            return res.json({ success: false, message:'error signup manager', err });
       }
    }
}