const Trainer = require('../models/Trainer');

// Get all trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const trainer = await Trainer.findByIdAndDelete(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.json({ message: 'Trainer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Toggle block/unblock a trainer
exports.toggleBlockTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    // Toggle the blocked status
    trainer.blocked = !trainer.blocked;
    await trainer.save();

    res.json({ 
      message: trainer.blocked ? 'Trainer blocked successfully' : 'Trainer unblocked successfully',
      blocked: trainer.blocked
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Search trainers by name
exports.searchTrainerByName = async (req, res) => {
  try {
    const { name } = req.query;
    const trainers = await Trainer.find({ name: { $regex: name, $options: 'i' } });

    if (trainers.length === 0) {
      return res.status(404).json({ message: 'No trainers found' });
    }

    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
