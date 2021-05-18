const ResourceModel = require('../models/resource.model');


module.exports.SearchByFilter = async (req, res) => {
    const { title, author, category, releaseDate, type } = req.body
    
    var query = {};
    if(title) {
        if (!(title === "")) {
            query.title = title;
        }
    }
    if(author) {
        if (!(author === "")) {
            query.author = author;
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
    
    await ResourceModel.find(query).exec(function(err, res){
        if(!err)
            return res.status(200).json({ success: true, docs: res}); 
        else
            return res.status(404).json({ success: false, message: "ressource not found"}); 
    });
};


