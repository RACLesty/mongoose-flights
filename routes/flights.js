const express = require('express');
const router = express.Router();

const flightsCtrl = require('../controllers/flights');

router.get('/', flightsCtrl.index);

router.get('/new', flightsCtrl.new);

router.get('/:id', flightsCtrl.show);

router.post('/', flightsCtrl.create);

router.post('/:id/addDestination', flightsCtrl.addDestination);

router.get('/:id/tickets/new', flightsCtrl.showTickets);

router.post('/:id/tickets', flightsCtrl.createTicket);

router.get('/:id/tickets/new', flightsCtrl.newTicket);
	
module.exports = router;