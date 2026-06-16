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
const getOneReview = async (req,res) =>{
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

const postReview = async (req,res) => {
    const review = {
        userId : new ObjectId(req.body.userId),
        movieId :new ObjectId(req.body.movieId),
        rating : req.body.rating,
        reviewText: req.body.reviewText, 
        dateCreated:  new Date(), 
        authorName: req.body.authorName, 
        isSpoiler: req.body.isSpoiler
    }
    try {
        const POST = await mongodb
        .getDb()
        .collection(collection)
        .insertOne(review);
    
    if (POST.acknowledged) {
                res.status(201).json(POST);
                return;
            }

    } catch (error) {
        res.status(500).json(error)
        console.log(error)
        return;
    }
}
const updateReview = async (req,res) => {
    const id = new ObjectId(req.params.id);
    const review = {
        userId : new ObjectId(req.body.userId),
        movieId :new ObjectId(req.body.movieId),
        rating : req.body.rating,
        reviewText: req.body.reviewText, 
        dateCreated:  new Date(), 
        authorName: req.body.authorName, 
        isSpoiler: req.body.isSpoiler 
    };

    try {
        const PUT = await mongodb
            .getDb()
            .collection(collection)
            .replaceOne({_id:id},review);
        
        if (PUT.acknowledged) {
            return res.status(204).json(PUT);

        }
    } catch (error) {
        return res.status(500).json(error);
        
    }
}
const deleteReview = async (req,res) => {
    const id = new ObjectId(req.params.id);
    try {
        const DELETE = await mongodb
            .getDb()
            .collection(collection)
            .deleteOne({ _id: id });
        
        if (DELETE.acknowledged) {
            return res.status(204).json(DELETE);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}


module.exports = {
    getReviews,
    getOneReview,
    postReview,
    updateReview,
    deleteReview
}

/* */