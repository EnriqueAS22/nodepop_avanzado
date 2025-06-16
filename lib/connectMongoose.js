import mongoose from 'mongoose'

export default function connectMongoose () {
    return mongoose.connect('mongodb://localhost/nodepop')
        .then(mongoose => mongoose.connection)
}