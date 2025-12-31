const express = require('express');
const router = express.Router();
const trainerManageController = require('../controllers/trainerManageController');

// Route to get all trainers
router.get('/', trainerManageController.getAllTrainers);

// Route to search trainers by name
router.get('/search', trainerManageController.searchTrainerByName);

// Route to delete a trainer
router.delete('/:id', trainerManageController.deleteTrainer);

// Route to toggle block/unblock a trainer
router.put('/block/:id', trainerManageController.toggleBlockTrainer);

module.exports = router;
