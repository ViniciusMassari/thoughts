const express = require('express');
const ThoughtsController = require('../controllers/ThoughtsController.js');
const router = express.Router();
const checkAuth = require('../helpers/auth.js');

router.get('/add', checkAuth, ThoughtsController.createThought);
router.post('/add', checkAuth, ThoughtsController.createThoughtSave);

router.get('/dashboard', checkAuth, ThoughtsController.dashboard);
router.get('/', ThoughtsController.showThoughts);

router.post('/remove', checkAuth, ThoughtsController.removeThought);

router.get('/edit/:id', checkAuth, ThoughtsController.updateThought);
router.post('/edit', checkAuth, ThoughtsController.updateThoughtSave);

module.exports = router;
