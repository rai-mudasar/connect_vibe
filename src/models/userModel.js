import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: [true, 'Username is already present'],
    },
    
    email: {
        type: String,
        required: [true, 'Please enter a email'],
        unique: [true, 'Email is already present']
    },
    
    password: {
        type: String,
        required: [true, 'Please enter a password'],
    },

    isVerified: {
        type: Boolean,
    },

    verificationOtp: {
        type: Number,
    },

    verifictionOtpExpiry: {
        type: Date,
    }

});

const User = mongoose.models.user || mongoose.model(userSchema);

export default User;