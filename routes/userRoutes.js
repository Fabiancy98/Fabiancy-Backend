const { Router } = require('express');
const { auth, isAdmin, localVariables } = require('../middleware/auth');
const userController = require('../controllers/userControllers');
const router = Router();

router.get('/', userController.home_get);
router.get('/find/:email', userController.findUser);
router.get('/find', userController.getUser);
router.post('/signup', userController.signup_post);
router.post('/login', userController.login_post, isAdmin);
router.post('/logout', auth, userController.logout_post);
router.post('/logoutall', auth, userController.logoutall_post);
router.patch('/reset/:id', userController.reset_password);
router.patch('/user/:id', auth, userController.user_patch_customer);
router.patch('/user/admin/:id', auth, isAdmin, userController.user_patch_admin);
router.delete('/delete/:id', auth, isAdmin, userController.delete_user);

router.post('/generate-otp', localVariables, userController.gen);
router.post('/verify-otp', userController.verify);

module.exports = router;
