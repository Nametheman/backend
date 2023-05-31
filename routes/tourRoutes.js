const express = require('express');
const {
  addTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
} = require('./../controllers/tourControllers');

const router = express.Router();

router.route('/').post(addTour).get(getAllTours);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
