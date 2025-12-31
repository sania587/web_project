const express = require('express');
const router = express.Router();
const { getExercises } = require('../controllers/exerciseController');

router.get('/', getExercises);

module.exports = router;
