const jwt = require('jsonwebtoken');
const { Router } = require('express');
const UserComponent = require('../User');
const secret = require('../../config/secret');

const accessTokenSecret = secret.accessTokenSecret;

const authenticateJWT = (req, res, next) => {
    const authHeader = req.cookies.token;

    if (authHeader) {
        jwt.verify(authHeader, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route serving list of users.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/', UserComponent.main);
router.get('/register', UserComponent.register);
router.get('/list', authenticateJWT, UserComponent.findAll);
router.get('/update/:id', authenticateJWT, UserComponent.formUpdate);

/**
 * Route serving a user
 * @name /v1/users/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/:id', UserComponent.findById);

/**
 * Route serving a new user
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/login', UserComponent.login);
router.post('/', UserComponent.create);

/**
 * Route serving a new user
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.put('/:id', authenticateJWT, UserComponent.updateById);

/**
 * Route serving a new user
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.delete('/:id', authenticateJWT, UserComponent.deleteById);

module.exports = router;
