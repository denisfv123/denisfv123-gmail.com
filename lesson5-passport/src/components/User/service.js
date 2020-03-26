const UserModel = require('./model');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

/**
 * @exports
 * @method findAll
 * @param {}
 * @summary get list of all users
 * @returns Promise<UserModel[]>
 */
function findAll() {
    return UserModel.find({}).exec();
}

/**
 * @exports
 * @method findById
 * @param {string} id
 * @summary get a user
 * @returns {Promise<UserModel>}
 */
function findById(id) {
    return UserModel.findById(id).exec();
}

/**
 * @exports
 * @method create
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<UserModel>}
 */
/*
function create(profile) {
    return UserModel.create(profile);
}
*/

function create(userData, userPass, req, res) {
    UserModel.register(new UserModel(userData), userPass, (err, user) => {
        if (err) {
            return res.end('Stop');
        }

        passport.authenticate('local')(req, res, () => {
            res.redirect('/v1/users/list');
        });
    });
}


function findUser(profile, update) {
    return UserModel.findOneAndUpdate(profile, update);
}

/**
 * Find a user by id and update his profile
 * @exports
 * @method updateById
 * @param {string} _id
 * @param {object} newProfile
 * @summary update a user's profile
 * @returns {Promise<void>}
 */
function updateById(_id, newProfile) {
    return UserModel.updateOne({ _id }, newProfile).exec();
}

/**
 * @exports
 * @method deleteById
 * @param {string} _id
 * @summary delete a user from database
 * @returns {Promise<void>}
 */
function deleteById(_id) {
    return UserModel.deleteOne({ _id }).exec();
}

/**
 * @exports
 * @method multiply
 * @param {a} number
 * @param {b} number
 * @returns {Number}
 */
function multiply(a, b) {
    return a + b;
}

module.exports = {
    findAll,
    findById,
    create,
    updateById,
    deleteById,
    multiply,
    findUser,
};
