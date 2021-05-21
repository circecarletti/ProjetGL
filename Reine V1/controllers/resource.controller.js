const ResourceModel = require('../models/resource.model');

//get resources
module.exports.getResources = async (req, res) => {

    //if no query send with get 
    if (((req.query === {}) || (req.query.name === undefined ))) {
        return res.status(500).send({success: false, message : 'error resources'});
    }
    const name = req.query.name;
    console.log(name)

    try {
        //search in author or title
        const query = {
            $or: [ 
                { "title" : { $regex: '.*' + name + '.*' }}, 
                { "author" : { $regex: '.*' + name + '.*' }}
            ]
        };

        await ResourceModel.find(query,'-_id -__v', function(err, docs) {
            if(err){
                return res.status(400).send({success: false, message : 'error resources', err});
            }
            if (docs.length){
                return res.status(200).send({success: true, docs});
            } else {
                return res.status(400).send({success: false, message : 'resources not found', err});
            }
        });
    }
    catch(err){
        return res.status(400).send({ success: false, message: "error resources"}); 
    }
};


//get resources
module.exports.getResourceByID = async (req, res) => {
    const id = req.params.id;
    //if no query send with get 
    if (!(await ResourceModel.exists({id: id}))) {
        return res.status(500).json({success: false, message : 'error id resource'});
    }

    try {
        console.log(id)
        await ResourceModel.findOne({id: id},'-_id -__v', function(err, docs) {
            if(err){
                return res.status(400).json({success: false, message : 'error get resource', err});
            }
            if (docs){
                return res.status(200).json({success: true, docs});
            } else {
                return res.status(400).json({success: false, message : 'error get resource by id', err});
            }
        });
    }
    catch(err){
        return res.status(400).json({ success: false, message: "error get resource by id"}); 
    }
};

//search by filter
module.exports.SearchByFilter = async (req, res) => {

    if (req.query === {}) {
        return res.status(500).json({success: false, message : 'error params'});
    }

    const { title, author, category, releaseDate, type } = req.query
    console.log(req.query)

    var query = {};
    console.log(query)

    if(title) {
        if (!(title === "")) {
            query.title = { $regex: '.*' + title + '.*' };
        }
    }
    if(author) {
        if (!(author === "")) {
            query.author = { $regex: '.*' + author + '.*' };
        }
    }
    if(category) {
        if (!(category === "")) {
            query.category = category;
        }
    }
    if(releaseDate) {
        if (!(releaseDate == 0)) {
            query.releaseDate = releaseDate;
        }
    }
    if(type) {
        if (!(type === "")) {
            query.type = type;
        }
    }
    console.log(query)
    try {
        await ResourceModel.find(query,'-_id -__v',function(err, docs){
            if(err){
                return res.status(400).json({success: false, message : 'error search by filter ressources', err});
            }
            if (docs.length){
                return res.status(200).json({success: true, docs});
            } else {
                return res.status(400).json({success: false, message : 'ressources not found', err});
            }
        });
    } catch(err) {
        return res.status(400).json({ success: false, message: "search by filter resources"}); 
    }
};
