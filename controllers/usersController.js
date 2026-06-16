const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');


const getAllUsers = async (req, res, next) => {
    try {
        const db = mongodb.getDb();
        const users = await db.collection('users').find().toArray();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

const getOneUser = async (req, res, next) => {
    try {
        const db = mongodb.getDb();
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });

        if (!user) {
            return res.status(404).json({ message: "No user found." });
        }

        return res.json(user);
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
            res.status(201).json({ insertedId: result.insertedId });
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

        const user = await db.collection('users').updateOne({ _id: new ObjectId(req.params.id) },
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
        if (user.matchedCount === 0) {
            return res.status(404).json({ message: "User not found. No update occurred." });
        }
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const db = mongodb.getDb();
        const user = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });

        if (user.deletedCount === 0) {
            return res.status(404).json({ message: "User not found. No user deleted." });
        }
        return res.status(200).json({ message: "User successfully deleted." });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, getOneUser, createUser, updateUser, deleteUser };