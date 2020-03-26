const { Schema } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const connections = require('../../config/connection');

const UserSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
    },
    {
        collection: 'usermodel',
        versionKey: false,
    },
);

UserSchema.plugin(passportLocalMongoose);

module.exports = connections.model('UserModel', UserSchema);
