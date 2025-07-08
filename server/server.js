const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

// Import routes
const deviceRoutes = require('./routes/devices');
const ticketRoutes = require('./routes/tickets');
const customerRoutes = require('./routes/customers');
const analyticsRoutes = require('./routes/analytics');
const healthRoutes = require('./routes/health');
const rahulLogsRoutes = require('./routes/rahulLogs');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
const apiBase = process.env.API_BASE_URL || '/api/v1';

app.use(`${apiBase}/devices`, deviceRoutes);
app.use(`${apiBase}/tickets`, ticketRoutes);
app.use(`${apiBase}/customers`, customerRoutes);
app.use(`${apiBase}/analytics`, analyticsRoutes);
app.use(`${apiBase}/health`, healthRoutes);
app.use(`${apiBase}/rahulLogs`, rahulLogsRoutes);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Agent API',
      version: '1.0.0',
      description: 'API documentation for AI Agent',
    },
    servers: [
      { url: `http://localhost:${PORT}${apiBase}` },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Agent Backend API with Prisma & SQLite',
    version: process.env.API_VERSION || 'v1',
    status: 'running',
    timestamp: new Date().toISOString(),
    database: 'SQLite with Prisma ORM',
    endpoints: {
      devices: `${apiBase}/devices`,
      tickets: `${apiBase}/tickets`,
      customers: `${apiBase}/customers`,
      analytics: `${apiBase}/analytics`,
      health: `${apiBase}/health`
    }
  });
});

// API info endpoint
app.get(`${apiBase}`, (req, res) => {
  res.json({
    message: 'AI Agent API v1 with Prisma & SQLite',
    version: '1.0.0',
    database: {
      type: 'SQLite',
      orm: 'Prisma',
      location: './dev.db'
    },
    endpoints: {
      devices: `${apiBase}/devices`,
      tickets: `${apiBase}/tickets`,
      customers: `${apiBase}/customers`,
      analytics: `${apiBase}/analytics`,
      health: `${apiBase}/health`
    },
    documentation: 'https://api-docs.deviceguard.ai'
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 DeviceGuard AI Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API Base URL: ${apiBase}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`);
  console.log(`🗄️  Database: SQLite with Prisma ORM`);
  console.log(`📁 Database file: ./dev.db`);
  console.log(`\n🔧 Setup commands:`);
  console.log(`   npm run db:generate  - Generate Prisma client`);
  console.log(`   npm run db:push      - Push schema to database`);
  console.log(`   npm run db:seed      - Seed database with sample data`);
  console.log(`   npm run db:studio    - Open Prisma Studio`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;