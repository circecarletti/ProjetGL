const ResourceModel = require('../models/resource.model');

//get resources
module.exports.getResources = async (req, res) => {
    //if no query send with get 
    if (((req.query === {}) || (req.query.name === undefined ) || (req.query.name === '' ))) {
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
module.exports.SearchByFilter = (req, res) => {

    if (req.query === {}) {
        return res.json({success: false, message : 'error params'});
    }

    const { title, author, releasedate } = req.query 
    console.log(req.query)

    var query = {};
    var queryAnd = { $and: [] };
    var queryArray = new Array();
    var queryCategory = { $or: [] };
    var queryType = { $or: [] }; 

    console.log(title)

    if(title) {
        if (!(title === "")) {
            console.log()
            query.title = { $regex: '.*' + title + '.*' };
        }
    }
    console.log("oka")
    console.log(query)

    console.log(query.title )

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

    if(releasedate) {
        if (!(releasedate == 0)) {
            query.releasedate = releasedate;
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
    var queryobject;
    if( queryCategory["$or"].length>0 && queryType["$or"].length>0 ){

        queryAnd["$and"].push( queryCategory );
        queryAnd["$and"].push( queryType );
        console.log('query and ')
        console.log(queryAnd)
        console.log("&&&")
        if (!(query === {})){
            console.log('query empty ')
            queryArray.push(query)
        }
        queryArray.push(queryAnd)
        queryobject = Object.assign({} , ...queryArray);

    }
    else if(queryCategory["$or"].length>0) {
        if (!(query === {})){
            console.log('query empty ')
            queryArray.push(query)
        }
        queryArray.push(queryCategory)
        queryobject = Object.assign({} , ...queryArray);

    }
    else if(queryType["$or"].length>0){
        console.log("querytype")
        console.log(query)
        console.log(queryType["$or"])
        if (!(query === {})){
            console.log('query empty ')
            queryArray.push(query)
        }
        queryArray.push(queryType)
        console.log(queryArray )
        queryobject = Object.assign({} , ...queryArray);

    }else{
        queryobject = query;
    }
    console.log(queryArray)
    //const queryobject = Object.assign({} , ...queryArray);
    console.log(queryobject)

    try {
        ResourceModel.find(queryobject,'-_id -__v',function(err, docs){
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


//get info Resource Available
module.exports.getResourceAvailable = async (req, res) => {
    const id = req.params.id;
    //if no query send with get 
    if (!(await ResourceModel.exists({id: id})))
        return res.json({success: false, message : 'error id resource'});

    try {
        console.log(id)
        await ResourceModel.findOne({id: id},'loan -_id -__v', function(err, docs) {
            if(err){
                return res.json({success: false, message : 'error get resource', err});
            }
            if (docs.loan){
                return res.json({success: true, available: true, message:'resource is available'});
            } else {
                return res.json({success: true, available: false, message : 'resource is not available', err});
            }
        });
    }
    catch(err){
        return res.json({ success: false, message: "error get resource by id"}); 
    }
};



//getNouveaute
module.exports.getNouveaute = async (req, res) => {
    try {
        const query = {
            $or: [ 
                { "id" : Number(5) }, 
                { "id" : Number(6) },
                { "id" : Number(7) },
                { "id" : Number(8) } 
            ]
        };

        console.log(query)
        console.log(Number(5))

        await ResourceModel.find(query, function(err, docs) {
            if(err){
                return res.json({success: false, message : 'error get nouveaute', err});
            }
            return res.json({success: true, available: true, message:'success get news resource', docs});
        });
    }
    catch(err){
        return res.json({ success: false, message: "get news resource"}); 
    }
};



/*

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
*/