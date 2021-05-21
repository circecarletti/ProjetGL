const ManagerModel = require('../models/manager.model');

//signup manager
module.exports.signUpManager = async (req, res) => {
    //console.log(req.body);
    const {id, password, name, firstName} = req.body

    try {
        //verifiy id not in members collection
        if (await MemberModel.exists({ id: id}))
            return res.status(409).json({success: false, message: 'ID existed'}); 

        //creating manager user
        const user = await ManagerModel.create({ id, password, name, firstName });
        console.log('Manager successfully created!'); 
        return res.status(201).json({success: true, user: user.id}); 
    }
    catch(err) {
        if(err.code == 11000)
            return res.status(409).json({ success: false, message: 'ID existed' });
       else 
            return res.status(400).json({ success: false, err });
    }
}