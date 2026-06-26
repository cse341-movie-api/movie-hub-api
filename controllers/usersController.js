const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

const getUserByEmail = async (req, res, next) => {
    try {
        const email = req.params.email;
        if (!email) {
            return res.status(400).json({ message: "Must provide a valid email address to find a user." });
        }
        const db = mongodb.getDb();
        const result = await db.collection('users').findOne({ email: email });

        if (!result) {
            return res.status(404).json({ message: "No user profile was found with that email address." });
        }
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const db = mongodb.getDb();
        const result = await db.collection('users').find().toArray();
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getOneUser = async (req, res, next) => {
    try {
        const db = mongodb.getDb();
        const result = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });

        if (!result) {
            return res.status(404).json({ message: "No user found." });
        }

        return res.json(result);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const db = mongodb.getDb();
        const {
            googleId,
            displayName,
            email,
            role,
            location,
            preferences
        } = req.body;

        const newUser = {
            googleId,
            displayName,
            email,
            joinedDate: new Date(),
            role: role || "user",
            location: location || "not specified",
            preferences: preferences || { favoriteGenre: "none", notifications: true }
        };

        const result = await db.collection('users').insertOne(newUser);
        if (result.acknowledged) {
            const createdUser = await db.collection('users').findOne({ _id: result.insertedId });
            return res.status(201).json(createdUser);
        } else {
            res.status(500).json({ message: "Failed to create user." });
        }
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const db = mongodb.getDb();
        const {
            googleId,
            displayName,
            email,
            joinedDate,
            role,
            location,
            preferences
        } = req.body;

        const result = await db.collection('users').updateOne({ _id: new ObjectId(req.params.id) },
            {
                $set: {
                    googleId,
                    displayName,
                    email,
                    joinedDate,
                    role,
                    location,
                    preferences
                }
            });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found. No update occurred." });
        }
        if (result.acknowledged) {
            const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
            return res.status(200).json(updatedUser);
        }
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const db = mongodb.getDb();
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found. No user deleted." });
        }
        return res.status(204).json();
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserByEmail, getAllUsers, getOneUser, createUser, updateUser, deleteUser };