import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        unique: [true, 'Username is already present'],
    },

    email: {
        type: String,
        unique: [true, 'Email is already present']
    },

    password: {
        type: String,
    },

    forgetPasswordPin: {
        type: Number,
    },

    forgetPasswordPinExpiry: {
        type: Date,
    },

    isVerified: {
        type: Boolean,
    }
});

const User = mongoose.models.user || mongoose.model(userSchema);

export default User;