import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { globalErrorHandler } from './middleware/errorHandler';

import { requestLogger } from './middleware/requestLogger';
import { sanitizeInput } from './middleware/sanitize.middleware';

import authRoutes from './modules/access-control/routes/auth.routes';
import geographyRoutes from './modules/geography/routes/geography.routes';
import organizationRoutes from './modules/organization/routes/organization.routes';
import customerRoutes from './modules/billing/routes/customer.routes';
import inventoryRoutes from './modules/inventory/routes/inventory.routes';
import billingRoutes from './modules/billing/routes/billing.routes';
import { AppError } from './utils/AppError';
import { HttpStatus } from './shared/constants';

const app = express();

// 1. Security & Standard Middleware
// The original document did not have these, but the instruction implies they should be there.
// I will add them as per the instruction's implied context for where sanitizeInput should go.
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); // Log requests
app.use(sanitizeInput); // Sanitize inputs (Trim strings)

// 2. Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/geography', geographyRoutes);
app.use('/api/v1/organization', organizationRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/billing', billingRoutes);

// 2. Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
    });
});

// 3. Global Error Handler
app.use(globalErrorHandler);



// 4. 404 Handler
app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, HttpStatus.NOT_FOUND));
});

export default app;
