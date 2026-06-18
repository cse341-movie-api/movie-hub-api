const mongodb = require ('../db/connect');
const ObjectId  = require('mongodb').ObjectId;
const collection = 'reviews';

/*functions*/
const getReviews = async (req, res,next) =>{

    try{
        const result = await mongodb
            .getDb()
            .collection(collection)
            .find()
            .toArray();

            res.status(200).json(result);
        
    }
    catch(error){
        next(error);
    };
}
const getOneReview = async (req,res,next) =>{
    const id = req.params.id;
    try {
        const result = await mongodb
            .getDb()
            .collection(collection)
            .findOne(new ObjectId(id));
            
            
        if (!result) {
            return res.status(404).json({ error: 'The reviews is not found in the database' });
        }else {
            res.status(200).json(result)
        }
        
    } catch (error) {
        next(error);
    }
}

const postReview = async (req,res,next) => {
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
        const result = await mongodb
        .getDb()
        .collection(collection)
        .insertOne(review);
    
    if (result.acknowledged) {
                res.status(201).json(result);
                return;
            }

    } catch (error) {
        next(error);
    }
}
const updateReview = async (req,res,next) => {
    const id = req.params.id;
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
        const result = await mongodb
            .getDb()
            .collection(collection)
            .replaceOne({_id:new ObjectId(id)},review);
        if (result.matchedCount === 0){
            return res.status(404).json({error: 'the review could not be found in the database'})
        
        }else if (result.acknowledged) {
            return res.status(204).json(result);
        }

    } catch (error) {
        next(error);
        
    }
}
const deleteReview = async (req,res,next) => {
    const id = req.params.id;
    try {
        const result = await mongodb
            .getDb()
            .collection(collection)
            .deleteOne({_id:new ObjectId(id)});
        if (result.deletedCount === 0){
            return res.status(404).json({error: 'the review could not be found in the database'}) 
        
        }else if (result.acknowledged) {
            return res.status(204).json(result);
        }
    } catch (error) {
        next(error);
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