import mongoose from "mongoose";

const connection = {
    isConnected: String
};

async function connectToDb() {
    if(connection.isConnected) {
        console.log('Database is already connected');
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONDODB_URI || '');
        connection.isConnected = db.connection[0].readyState;

        console.log('Database connected Successfully');
    }
    catch(err) {
        console.log('Error in Connection: ', err);
        process.exit(1);
    }
};

export default connectToDb;
