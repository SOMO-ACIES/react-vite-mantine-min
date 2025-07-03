# DeviceGuard AI Backend API with Prisma & SQLite

A comprehensive Node.js Express backend for the AI Agent device management dashboard, powered by Prisma ORM and SQLite database.

## 🚀 Features

- **RESTful API** with comprehensive endpoints for devices, tickets, customers, and analytics
- **Prisma ORM** for type-safe database operations
- **SQLite Database** for lightweight, file-based storage
- **Data Validation** using express-validator
- **Security** with helmet, CORS, and rate limiting
- **Error Handling** with detailed error responses
- **Health Monitoring** with system health checks
- **Database Seeding** with realistic sample data
- **Comprehensive Logging** with Morgan
- **Performance** with compression middleware

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager

## 🛠️ Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. Initialize the database:
```bash
npm run db:init
```

This command will:
- Generate the Prisma client
- Create the SQLite database
- Run migrations
- Seed the database with sample data

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🗄️ Database Management

### Prisma Commands

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database (for development)
npm run db:push

# Create and run migrations (for production)
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with sample data
npm run db:seed

# Reset database (WARNING: deletes all data)
npm run db:reset

# Complete setup (migrate + seed)
npm run db:init
```

### Database Schema

The database includes the following main entities:

- **Devices** - Hardware devices with telemetry data
- **Customers** - Organizations owning devices
- **Tickets** - Support tickets for device issues
- **Users** - System users and administrators
- **Analytics** - Historical analytics data
- **System Events** - System-wide events and logs
- **Telemetry Data** - Time-series device metrics

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Endpoints

#### Devices
- `GET /devices` - Get all devices with filtering and pagination
- `GET /devices/:id` - Get device by ID
- `GET /devices/:id/telemetry` - Get device telemetry data
- `POST /devices/:id/actions/notify` - Send notification for device
- `GET /devices/stats/summary` - Get device statistics

#### Tickets
- `GET /tickets` - Get all tickets with filtering and pagination
- `GET /tickets/:id` - Get ticket by ID
- `POST /tickets` - Create new ticket
- `PUT /tickets/:id` - Update ticket
- `DELETE /tickets/:id` - Delete ticket
- `GET /tickets/stats/summary` - Get ticket statistics

#### Customers
- `GET /customers` - Get all customers with filtering and pagination
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `GET /customers/stats/summary` - Get customer statistics

#### Analytics
- `GET /analytics/dashboard` - Get dashboard analytics
- `GET /analytics/trends` - Get trend data
- `GET /analytics/predictions` - Get AI predictions

#### Health
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health check

### Query Parameters

#### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

#### Filtering
- `search` - Search term for text fields
- `status` - Filter by status
- `priority` - Filter by priority
- `brand` - Filter by device brand
- `channel` - Filter by device channel
- `riskLevel` - Filter by risk level

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {},
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": []
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/devices",
  "method": "GET"
}
```

## 🔧 Configuration

### Environment Variables

- `DATABASE_URL` - SQLite database file path
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - CORS origin URL
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database
- `npm run db:init` - Initialize database (migrate + seed)

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request rate limiting
- **Input Validation** - Request validation with express-validator
- **Error Handling** - Secure error responses
- **SQL Injection Protection** - Prisma ORM prevents SQL injection

## 📊 Monitoring

The API includes comprehensive health monitoring:

- System resource usage
- Database connection status
- Query performance metrics
- Error tracking
- Service availability

## 🗃️ Database Features

- **Type Safety** - Full TypeScript support with Prisma
- **Migrations** - Version-controlled schema changes
- **Seeding** - Automated sample data generation
- **Relations** - Proper foreign key relationships
- **Indexing** - Optimized query performance
- **Validation** - Schema-level data validation

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Run migrations: `npm run db:migrate`
4. Set up proper logging
5. Configure reverse proxy (nginx)
6. Set up SSL certificates
7. Configure monitoring and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Update database schema if needed
6. Run migrations and tests
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License.