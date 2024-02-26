const Flight = require("../models/flight");
const Ticket = require("../models/ticket");

function generateAllSeats() {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 30;
  const allSeats = [];

  rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const seat = `${row}${i.toString().padStart(2, '0')}`;
      allSeats.push(seat);
    }
  });

  return allSeats;
}

module.exports = {
  index,
  show,
  new: newFlight,
  create,
  addDestination,
  showTickets,
  createTicket,
  newTicket,
};

async function index(req, res) {
  const flights = await Flight.find({});
  res.render("flights/index", { title: "All Flights", flights });
}

async function show(req, res) {
  const flight = await Flight.findById(req.params.id);
  const tickets = await Ticket.find({ flight: flight._id });
  res.render("flights/show", { flight, tickets });
}

async function newFlight(req, res) {
  const airlines = await Flight.distinct("airline");
  const airports = await Flight.distinct("airport");
  res.render("flights/new", { title: "Add Flight", airlines, airports });
}

async function create(req, res) {
  const { airline, airport, flightNo, departs } = req.body;
  const flight = new Flight({ airline, airport, flightNo, departs });
  await flight.save();
  res.redirect("/flights");
}

async function addDestination(req, res) {
  const flightId = req.params.id;
  const { airport, arrival } = req.body;
  const flight = await Flight.findById(flightId);
  flight.destinations.push({ airport, arrival });
  await flight.save();
  res.redirect(`/flights/${flightId}`);
}

async function showTickets(req, res) {
  const flight = await Flight.findById(req.params.id);
  const tickets = await Ticket.find({ flight: flight._id });
  const allSeats = generateAllSeats();
  const existingSeats = tickets.map(ticket => ticket.seat);
  const availableSeats = allSeats.filter(seat => !existingSeats.includes(seat));
  res.render("tickets/new", { flight, availableSeats });
}

async function createTicket(req, res) {
  const flight = await Flight.findById(req.params.id);
  req.body.flight = flight._id;
  const ticket = await Ticket.create(req.body);
  res.redirect(`/flights/${flight._id}`);
}

async function newTicket(req, res) {
  const flightId = req.params.id;
  const existingSeats = await Ticket.find({ flight: flightId }).distinct("seat");
  const allSeats = generateAllSeats();
  const availableSeats = allSeats.filter(seat => !existingSeats.includes(seat));

  res.render("flights/newTicket", { title: "Add Ticket", availableSeats, existingSeats });
}


