const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 8000;

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from middleware.....');
  next();
});

app.use((req, res, next) => {
  req.responseTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log(req.responseTime);

  res.status(200).json({
    status: 'success',
    total: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'failed',
      message: "Tour doesn't exist or invalid ID",
    });
  }
  return res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const addTour = (req, res) => {
  console.log(req.body);

  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id > tours.length) {
    res.status(404).json({
      status: 'failed',
      message: "Tour doesn't exist or invalid ID",
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour here.....',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: "Tour doesn't exist or invalid ID",
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.route('/api/v1/tours').post(addTour).get(getAllTours);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(port, () => {
  console.log(`Listening on port ${port}  `);
});
