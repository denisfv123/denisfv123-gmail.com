const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserService = require('./service');
const UserValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');
const secret = require('../../config/secret');

const accessTokenSecret = secret.accessTokenSecret;
const refreshTokenSecret = secret.refreshTokenSecret;

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function findAll(req, res, next) {
    try {
        const users = await UserService.findAll();

        res.status(200).render('users.ejs', {
            data: users
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            details: null,
        });

        next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function findById(req, res, next) {
    try {
        const { error } = UserValidation.findById(req.params);

        if (error) {
            throw new ValidationError(error.details);
        }

        const user = await UserService.findById(req.params.id);

        return res.status(200).json({
            data: user,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                error: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function create(req, res, next) {
    try {
        const { error } = UserValidation.create(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        const accessToken = jwt.sign({ email: req.body.email, fullName: req.body.fullName }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ email: req.body.email, fullName: req.body.fullName }, refreshTokenSecret);

        const user = await UserService.create({
            email: req.body.email,
            fullName: req.body.fullName,
            password: req.body.password,
            accessToken,
            refreshToken,
        });

        res.cookie('token', user.accessToken, { maxAge: 900000, httpOnly: true });
        res.redirect(301, '/v1/users/list');
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function updateById(req, res, next) {
    try {
        const { token } = req.cookies;
        const { error } = UserValidation.updateById(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        const accessToken = jwt.sign({ email: req.body.email, fullName: req.body.fullName }, accessTokenSecret, { expiresIn: '60m' });
        const refreshToken = jwt.sign({ email: req.body.email, fullName: req.body.fullName }, refreshTokenSecret);

        const updatedUser = await UserService.updateById(req.body.id, req.body);

        const updatedUserToken = await UserService.findUser({ accessToken: token }, {
            accessToken,
            refreshToken,
        });

        res.cookie('token', accessToken, { maxAge: 900000, httpOnly: true });
        res.redirect('/v1/users/list');
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function deleteById(req, res, next) {
    try {
        const { token } = req.cookies;
        const { error } = UserValidation.deleteById(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        const accessToken = jwt.sign({ email: req.user.email, fullName: req.user.fullName }, accessTokenSecret, { expiresIn: '60m' });
        const refreshToken = jwt.sign({ email: req.user.email, fullName: req.user.fullName }, refreshTokenSecret);

        const deletedUser = await UserService.deleteById(req.body.id);

        const updatedUser = await UserService.findUser({ accessToken: token }, {
            accessToken,
            refreshToken,
        });

        res.cookie('token', accessToken, { maxAge: 900000, httpOnly: true });
        res.redirect('/v1/users/list');
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

async function login(req, res, next) {
    try {
        const { error } = UserValidation.login(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        const accessToken = jwt.sign({ email: req.body.email, fullName: req.body.fullName }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ email: req.body.email, fullName: req.body.fullName }, refreshTokenSecret);

        const findUser = await UserService.findUser(req.body, {
            accessToken,
            refreshToken,
        });

        if (findUser) {
            res.cookie('token', findUser.accessToken, { maxAge: 900000, httpOnly: true });
            res.redirect(301, '/v1/users/list');
        } else {
            res.end('User is not defined');
        }
    } catch (error) {
        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

function main(req, res, next) {
    res.status(200).render('index.ejs');
}

function register(req, res, next) {
    res.status(200).render('register.ejs');
}

function formUpdate(req, res, next) {
    const { id } = req.params;

    res.status(200).render('update.ejs', {
        _id: id,
    });
}

module.exports = {
    findAll,
    findById,
    create,
    updateById,
    deleteById,
    main,
    login,
    register,
    formUpdate,
};
