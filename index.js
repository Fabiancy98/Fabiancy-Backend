const express = require('express');
const http = require('http');
const userRoutes = require('./routes/userRoutes');
const waitlistRoute = require('./routes/waitlistRoute');
const { mongoConnect } = require('./services/db');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.port || 5000;

// headers
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Authorization, Accept'
//   );
//   next();
// });

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
);
app.use(morgan('tiny'));
app.disable('x-powered-by');

// routes
app.use(userRoutes);
app.use(waitlistRoute);
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();

  server.listen(port, () => {
    console.log(`Fabiancy server running on ${port} .....`);
  });
}
startServer();
