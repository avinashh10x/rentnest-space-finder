# Backend Project for RentNest Space Finder

This is the backend for the RentNest Space Finder application. It provides user and admin authentication, estate management, and user profile management functionalities.

## Project Structure

- **controllers/**: Contains the logic for handling requests related to authentication, estates, and user profiles.
- **models/**: Defines the data models for MongoDB using Mongoose.
- **routes/**: Sets up the API endpoints for the application.
- **middleware/**: Contains middleware functions for authentication and authorization.
- **config/**: Configuration files, including database connection settings.
- **index.js**: The entry point of the application.

## Setup Instructions

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd rentnest-space-finder/server
   ```

2. **Install Dependencies**
   Ensure you have Node.js installed, then run:
   ```
   npm install
   ```

3. **Set Up MongoDB**
   Make sure MongoDB is installed and running on your machine. Update the connection string in `config/db.js` to match your MongoDB setup.

4. **Environment Variables**
   Create a `.env` file in the root of the server directory and add the following variables:
   ```
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_connection_string
   ```

5. **Run the Server**
   Start the server using:
   ```
   npm start
   ```

## API Usage

- **Authentication**
  - POST `/api/auth/register`: Register a new user.
  - POST `/api/auth/login`: Log in an existing user.

- **Estate Management**
  - POST `/api/estate`: Create a new estate (admin only).
  - GET `/api/estate`: Retrieve all estates.
  - PUT `/api/estate/:id`: Update an estate (admin only).
  - DELETE `/api/estate/:id`: Delete an estate (admin only).

- **User Profile Management**
  - GET `/api/user/profile`: Retrieve user profile information.
  - POST `/api/user/book/:estateId`: Book an estate.

## License

This project is licensed under the MIT License. See the LICENSE file for details.