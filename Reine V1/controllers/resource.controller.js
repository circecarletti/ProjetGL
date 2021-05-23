const ResourceModel = require('../models/resource.model');

//get resources
module.exports.getResources = async (req, res) => {
    //if no query send with get 
    if (((req.query === {}) || (req.query.name === undefined ))) {
        return res.send({success: false, message: 'error resources'});
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
                return res.send({success: false, message : 'error resources', err});
            }
            if (docs.length){
                return res.send({success: true,message:'success get ressource' , docs});
            } else {
                return res.send({success: false, message : 'resources not found', err});
            }
        });
    }
    catch(err){
        return res.send({ success: false, message: "error get resources"}); 
    }
};


//get resources
module.exports.getResourceByID = async (req, res) => {
    const id = req.params.id;
    //if no query send with get 
    if (!(await ResourceModel.exists({id: id})))
        return res.json({success: false, message : 'error id resource'});


    try {
        console.log(id)
        await ResourceModel.findOne({id: id},'-_id -__v', function(err, docs) {
            if(err){
                return res.json({success: false, message : 'error get resource', err});
            }
            if (docs){
                return res.json({success: true, message:'success get resource', docs});
            } else {
                return res.json({success: false, message : 'error get resource by id', err});
            }
        });
    }
    catch(err){
        return res.json({ success: false, message: "error get resource by id"}); 
    }
};

//search by filter
module.exports.SearchByFilter = async (req, res) => {

    if (req.query === {}) {
        return res.json({success: false, message : 'error params'});
    }

    const { title, author, releaseDate } = req.query 
    console.log(req.query)

    var query = {};
    var queryCategory = { $or: [] } ;
    var queryType = { $or: [] } ; 
    /* const query = {
        $or: [ 
            { "title" : { $regex: '.*' + name + '.*' }}, 
            { "author" : { $regex: '.*' + name + '.*' }}
        ]
    }; */
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
    if(req.query.category_child) {
        if (!(req.query.category_child === "")) {
            queryCategory["$or"].push( { "category" : req.query.category_child} );
        }
    }
    if(req.query.category_adult) {
        if (!(req.query.category_adult === "")) {
            queryCategory["$or"].push( { "category" : req.query.category_adult} );
        }
    }
    if(req.query.category_allpublic) {
        if (!(req.query.category_allpublic === "")) {
            queryCategory["$or"].push( { "category" : req.query.category_allpublic} );
        }
    }
    if(releaseDate) {
        if (!(releaseDate == 0)) {
            query.releaseDate = releaseDate;
        }
    }
    if(req.query.type_livre) {
        if (!(req.query.type_livre === "")) {
            queryType["$or"].push ( { "type" : req.query.type_livre});
        }
    }
    if(req.query.type_cd) {
        if (!(req.query.type_cd === "")) {
            queryType["$or"].push ( { "type" : req.query.type_cd});
        }
    }
    if(req.query.type_dvd) {
        if (!(req.query.type_dvd === "")) {
            queryType["$or"].push ( { "type" : req.query.type_dvd});
        }
    }
    if(req.query.type_videogames) {
        if (!(req.query.type_videogames === "")) {
            queryType["$or"].push ( { "type" : req.query.type_videogames});
        }
    }

    if(queryCategory["$or"].length>0){
        query.category = queryCategory;
    }

    if(queryType["$or"].length>0){
        query.type = queryType;
    }

    console.log(query)
    try {
        await ResourceModel.find(query,'-_id -__v',function(err, docs){
            if(err){
                return res.json({success: false, message : 'error search by filter ressources', err});
            }
            if (docs.length){
                return res.json({success: true, message:'success search by filter', docs});
            } else {
                return res.json({success: false, message : 'ressources not found', err});
            }
        });
    } catch(err) {
        return res.json({ success: false, message: "search by filter resources"}); 
    }
};
