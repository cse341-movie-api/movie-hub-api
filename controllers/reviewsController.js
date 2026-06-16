const mongodb = require ('../db/connect');
const ObjectId  = require('mongodb').ObjectId;
const collection = 'reviews';

/*functions*/
const getReviews = async (req, res) =>{

    try{
        const GET = await mongodb
            .getDb()
            .collection(collection)
            .find()
            .toArray();

            res.status(200).json(GET);
        
    }
    catch(error){
        res.status(405).json(error);
    };
}
const getReview = async (req,res) =>{
    const id = req.params.id;
    try {
        const GET = await mongodb
            .getDb()
            .collection(collection)
            .findOne(new ObjectId(id));
            res.status(200).json(GET)
    } catch (error) {
        res.status(400).json(error);
    }
}
module.exports = {
    getReviews,
    getReview
}

/* */