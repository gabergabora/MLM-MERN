import mongoose from "mongoose";

const treeschema = mongoose.Schema({
    useremail: {
        type: String,
        trim: true,
        default: null
    },
    left: {
        type: String,
        trim: true,
        default: null
    },
    right: {
        type: String,
        trim: true,
        default: null
    },
    leftcount: {
        type: Number,
        trim: true,
        default: 0
    },
    rightcount: {
        type: Number,
        trim: true,
        default: 0
    }
},
    { timestamps: true }
)
const Tree = mongoose.model('Tree', treeschema);

export default Tree;