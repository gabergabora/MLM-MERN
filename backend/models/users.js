import mongoose from "mongoose";

const userschema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8
    },
    under_useremail: {
        type: String,
        trim: true,
        default: ''
    },
    side: {
        type: String,
        enum: ['left', 'right'],
        default: 'left'
    }
})
const User = mongoose.model('User', userschema);

export default User;