const ExpressRouter = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new ExpressRouter();
const expressValidator = require('express-validator');

router.post(
  '/registration',
  expressValidator.body('email').isEmail(),
  expressValidator.body('password').isLength({ min: 3, max: 32 }),
  userController.registration
);
// router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', userController.getUsers);

module.exports = router;
