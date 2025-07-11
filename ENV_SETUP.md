# Environment Configuration Guide

## Overview

This project uses environment-specific configuration files to manage different deployment environments. Each environment has its own configuration file with appropriate settings.

## Environment Files

### `.env.example`
Template file showing all required environment variables. Use this as a reference when setting up new environments.

### `.env.local`
Local development environment configuration:
- Uses local PostgreSQL and Redis instances
- Relaxed security settings for development
- Debug mode enabled
- Higher rate limits

### `.env.development`
Development/staging environment configuration:
- Uses DigitalOcean managed databases
- Moderate security settings
- Debug mode enabled
- Moderate rate limits

### `.env.production`
Production environment configuration:
- Uses DigitalOcean managed databases
- Strict security settings
- Debug mode disabled
- Conservative rate limits

## Setup Instructions

### 1. Local Development Setup

```bash
# Start local databases with Docker
docker-compose -f docker-compose.local.yml up -d

# Copy the local environment file
cp .env.local .env

# Update with your actual values:
# - OAuth client IDs and secrets
# - Email service credentials (optional for local dev)

# Access database tools:
# - PostgreSQL Admin: http://localhost:8080 (server: postgres, user: postgres, pass: password)
# - Redis Commander: http://localhost:8081
```

### 2. Development Environment Setup

```bash
# For deployment scripts, use:
cp .env.development .env

# Update with your actual values:
# - DigitalOcean database URLs
# - Production OAuth credentials
# - Email service credentials
```

### 3. Production Environment Setup

```bash
# For production deployment, use:
cp .env.production .env

# Update with your actual values:
# - Secure JWT and NextAuth secrets
# - Production database URLs
# - Production OAuth credentials
```

## Environment Variables Reference

### Database Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string

### Authentication
- `JWT_SECRET`: Secret key for JWT token signing
- `NEXTAUTH_URL`: Base URL for NextAuth
- `NEXTAUTH_SECRET`: Secret key for NextAuth

### OAuth Providers
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `FACEBOOK_CLIENT_ID`: Facebook OAuth client ID
- `FACEBOOK_CLIENT_SECRET`: Facebook OAuth client secret

### API Configuration
- `NEXT_PUBLIC_API_URL`: Public API base URL
- `CORS_ORIGIN`: Allowed CORS origins

### File Upload
- `UPLOAD_MAX_SIZE`: Maximum file size (bytes)
- `UPLOAD_ALLOWED_TYPES`: Comma-separated MIME types

### Email Configuration
- `EMAIL_FROM`: Sender email address
- `EMAIL_SERVICE`: Email service provider
- `EMAIL_USER`: Email service username
- `EMAIL_PASS`: Email service password

### Security
- `RATE_LIMIT_WINDOW_MS`: Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window

### Debug Settings
- `DEBUG`: Enable/disable debug mode
- `LOG_LEVEL`: Logging level (debug, info, warn, error)

## Security Best Practices

1. **Never commit actual credentials** to version control
2. **Use strong, unique secrets** for production environments
3. **Rotate secrets regularly** in production
4. **Use environment-specific OAuth applications**
5. **Monitor rate limits and adjust as needed**

## Deployment Notes

- Environment files are ignored by Git for security
- Use your deployment platform's environment variable management
- For Docker deployments, pass environment variables through docker-compose or Kubernetes secrets
- For DigitalOcean App Platform, use the environment variable section in the app spec

## Local Development Database Management

### Starting the databases
```bash
docker-compose -f docker-compose.local.yml up -d
```

### Stopping the databases
```bash
docker-compose -f docker-compose.local.yml down
```

### Viewing logs
```bash
docker-compose -f docker-compose.local.yml logs -f
```

### Resetting databases (removes all data)
```bash
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d
```

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure Docker containers are running: `docker ps`
   - Check DATABASE_URL format
   - Verify port 5432 is not used by other services

2. **Redis connection errors**
   - Ensure Redis container is running
   - Check port 6379 is not used by other services

3. **OAuth authentication failures**
   - Verify client IDs and secrets
   - Check redirect URLs in OAuth provider settings
   - Ensure NEXTAUTH_URL matches your domain

4. **CORS errors**
   - Verify CORS_ORIGIN matches your frontend domain
   - Check for trailing slashes in URLs

5. **Rate limiting issues**
   - Adjust RATE_LIMIT_MAX_REQUESTS for your needs
   - Consider different limits for different environments