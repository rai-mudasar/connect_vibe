import mongoose from "mongoose";

const connection = {
    isConnected: 0
};

async function connectToDb() {
    if(connection.isConnected === 1) {
        console.log('Database is already connected');
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '');
        connection.isConnected = db.connections[0].readyState;

        console.log('Database connected Successfully');
    }
    catch(err) {
        console.log('Error in Connection: ', err);
        process.exit(1);
    }
};

export default connectToDb;
