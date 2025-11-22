const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const routes = require('./src/routes/index');
const CronJobs = require('./middleware/crons');

class Server {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT;
    this.routes = routes;
  }

  setupMiddlewares() {
    // Security middlewares
    this.app.use(helmet()); // Sets various HTTP headers for security
    this.app.use(cors()); // Enables CORS
    this.app.use(express.json()); // Parses JSON bodies
    // Parse URL-encoded bodies (form data)
    this.app.use(express.urlencoded({ extended: true }));
    CronJobs.startCronJobs();
    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    });
    this.app.use(limiter);

    // Global error handling middleware
    this.app.use((err, req, res, next) => {
      console.error('Error:', err.stack);
      res
        .status(500)
        .json({ success: false, message: 'Something went wrong!' });
    });
  }

  setupRoutes() {
    this.app.use('/server/api', routes);

    // Handle unknown API routes
    this.app.all(/(.*)/, (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
      });
    });
  }

  async connectDatabase() {
    await connectDB();
  }

  start() {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }

  async run() {
    this.connectDatabase();
    this.setupMiddlewares();
    this.setupRoutes();
    this.start();
  }
}

// Instantiate and run the server
const server = new Server();
server.run().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
