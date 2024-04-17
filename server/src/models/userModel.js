const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs');
const { defaultUserImagePath } = require('../config');



const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        maxlength: [31, 'The length of the username can be maximum  31 characters'],
        minlength: [3, 'The minimum length of the username can be minimum 3 characters'],
    },
    email: {
        type: String,
        required: [true, 'User email is missing'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message:"Enter a valid email address"
        }
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minlength: [6, 'The minimum length of the username can be minimum 6 characters'],
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    image: {
        type: String,
        default: defaultUserImagePath
    },
    address: {
        type: String,
        required: [true, 'User address is required'],
    },
    phone: {
        type: String,
        required: [true, 'User phone is required'],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


const User = model('Users', userSchema)
module.exports = User