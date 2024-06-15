const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://iamsourav:d8CxuX6ZkVFfHty5@cluster0.p7huf4f.mongodb.net/inotebook?retryWrites=true&w=majority&appName=Cluster0'

const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(mongoURI, {
        }).then(() => {
            console.log('Connected to MongoDB');
        }).catch(err => {
            console.error('Error connecting to MongoDB:', err);
        });
    }
    catch (error) {
        console.log(error)
        process.exit()
    }
}
module.exports = connectToMongo;


