# MERN Stack Todo List App

A full-stack MERN (MongoDB, Express.js, React, Node.js) todo list application with CRUD functionality and comprehensive testing.

## Features

- ✅ **Full CRUD Operations**: Create, Read, Update, Delete todos
- ✅ **MongoDB Integration**: Secure database connection with Mongoose
- ✅ **REST API**: Well-structured Express.js API endpoints
- ✅ **React Frontend**: Modern React with hooks and functional components
- ✅ **Responsive Design**: Tailwind CSS for mobile-first responsive UI
- ✅ **Comprehensive Testing**: Jest + Supertest for backend, React Testing Library for frontend
- ✅ **Code Quality**: ESLint with Airbnb style guide
- ✅ **Environment Variables**: Secure configuration management

## Tech Stack

### Backend
- **Node.js** v20+
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **ESLint** - Code linting

### Frontend
- **React** 18+ - Frontend framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Testing Library** - Component testing
- **Jest** - Test runner

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd myapp
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `.env` with your MongoDB connection string:
   ```
   MONGO_URI=mongodb://localhost:27017/todoapp
   PORT=5000
   NODE_ENV=development
   ```

### Running the Application

1. **Development mode (both client and server)**
   ```bash
   npm run dev
   ```

2. **Run separately**
   ```bash
   # Backend only
   npm run server:dev
   
   # Frontend only
   npm run client:start
   ```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:5000`.

## Testing

### Run All Tests
```bash
npm test
```

### Backend Tests (Jest + Supertest)
```bash
npm run test:server
```

### Frontend Tests (React Testing Library)
```bash
npm run test:client
```

## Code Quality

```bash
npm run lint          # Lint both client and server
npm run lint:server   # Backend only
npm run lint:client   # Frontend only
```

The project follows the **Airbnb JavaScript Style Guide** with ESLint configuration.

## License

This project is licensed under the MIT License.
