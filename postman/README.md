# AnimoPlus API - Postman Collections

This directory contains comprehensive Postman collections for testing the AnimoPlus API endpoints.

## Collections Overview

### 1. Environment Configuration
- **File**: `AnimoPlus_Environment.postman_environment.json`
- **Purpose**: Contains environment variables for API testing
- **Variables**:
  - `base_url`: API base URL (http://localhost:8000)
  - `access_token`: JWT access token (auto-populated after login)
  - `refresh_token`: JWT refresh token (auto-populated after login)
  - `user_id`: Current authenticated user ID
  - Test credentials for both client and veterinarian accounts

### 2. Authentication Collection
- **File**: `Auth_Collection.postman_collection.json`
- **Endpoints**:
  - User registration (client & veterinarian)
  - Login with automatic token storage
  - Token refresh
  - Password reset flow
  - Email verification
  - Logout (single device & all devices)

### 3. User Management Collection
- **File**: `User_Management_Collection.postman_collection.json`
- **Purpose**: User profile and account management
- **Features**:
  - Profile management (view/update)
  - Password change
  - Account deactivation

### 4. Session Management Collection
- **File**: `Session_Management_Collection.postman_collection.json`
- **Purpose**: Complete JWT session and token management
- **Features**:
  - Authentication & token generation
  - Access token refresh
  - Active sessions listing
  - Selective session revocation
  - Global logout (all devices)
  - Token expiration testing
  - Multi-device simulation

### 5. Veterinarian Collection
- **File**: `Veterinarian_Collection.postman_collection.json`
- **Endpoints**:
  - Veterinarian dashboard
  - Professional profile management
  - Appointment management
  - Client and pet management
  - Medical records creation/viewing

### 6. Client Collection
- **File**: `Client_Collection.postman_collection.json`
- **Endpoints**:
  - Client dashboard
  - Pet management (add/update/view pets)
  - Appointment booking and management
  - Medical records viewing
  - Veterinarian search and selection

## Setup Instructions

1. **Import Environment**:
   - Import `AnimoPlus_Environment.postman_environment.json`
   - Set as active environment in Postman

2. **Import Collections**:
   - Import all collection files into Postman
   - Collections are organized by functionality

3. **Authentication Flow**:
   - Start with registering users (client/veterinarian)
   - Use login endpoints to authenticate
   - Tokens are automatically stored in environment variables
   - Use protected endpoints with stored tokens

## Testing Workflow

### For Client Testing:
1. Register a client account using "Register Client"
2. Login using "Login Client" (tokens auto-saved)
3. Test client-specific endpoints in Client Collection
4. Test general user management features

### For Veterinarian Testing:
1. Register a veterinarian account using "Register Veterinarian"
2. Verify email using token from email (if email is configured)
3. Login using "Login Veterinarian" (tokens auto-saved)
4. Test veterinarian-specific endpoints in Veterinarian Collection
5. Test general user management features

## Security Features Tested

- **JWT Authentication**: Access and refresh token flow
- **Role-based Access**: Veterinarian vs client endpoint access
- **Account Security**: Login attempts, account lockout
- **Email Verification**: Required for veterinarian accounts
- **Session Management**: Multiple device session tracking
- **Password Security**: Secure password reset flow

## Notes

- All collections include automatic token management via test scripts
- Environment variables are updated automatically during authentication
- Collections use Postman dynamic variables for realistic test data
- Protected endpoints require valid JWT tokens
- Rate limiting is implemented on authentication endpoints

## Troubleshooting

- Ensure Laravel server is running on `http://localhost:8000`
- Check that database migrations have been run
- Verify email configuration if testing email features
- Use the environment variables for consistent testing
- Check token expiration if requests fail (refresh or re-login)
