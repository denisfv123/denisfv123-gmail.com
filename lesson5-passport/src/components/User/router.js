const jwt = require('jsonwebtoken');
const { Router } = require('express');
const UserComponent = require('../User');

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/v1/users/');
    }
}

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
// router.get('/', UserComponent.registr);
router.get('/list', checkAuthentication, UserComponent.findAll);
router.get('/update/:id', checkAuthentication, UserComponent.formUpdate);
router.get('/logout', UserComponent.logout);

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
router.put('/:id', checkAuthentication, UserComponent.updateById);

/**
 * Route serving a new user
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.delete('/:id', checkAuthentication, UserComponent.deleteById);

module.exports = router;
