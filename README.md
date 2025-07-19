# MERN Stack Todo List Application

A full-stack Todo List application built with MongoDB, Express.js, React, and Node.js (MERN stack) featuring complete CRUD functionality, responsive design, and comprehensive testing.

## Features

### Backend (Express.js + MongoDB)
- **RESTful API** with Express.js
- **MongoDB integration** with Mongoose ODM
- **CRUD operations** for todos (Create, Read, Update, Delete)
- **Data validation** and error handling
- **Environment-based configuration**
- **Comprehensive Jest tests** with Supertest

### Frontend (React + Tailwind CSS)
- **Modern React** with functional components and hooks
- **Responsive design** with Tailwind CSS
- **Real-time updates** with API integration
- **Form validation** and user feedback
- **Loading states** and error handling
- **Component testing** with React Testing Library

### API Endpoints
- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo by ID
- `DELETE /api/todos/:id` - Delete a todo by ID

### Todo Model Schema
```javascript
{
  title: String (required),
  description: String (optional),
  status: String (enum: ['pending', 'completed'], default: 'pending'),
  createdAt: Date (default: Date.now)
}
```

## Quick Start

### Prerequisites
- Node.js v20 or higher
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd myapp
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your MongoDB connection string
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   This runs both backend (port 5000) and frontend (port 3000) concurrently.

### Individual Commands

- **Backend only:** `npm run server`
- **Frontend only:** `npm run client`
- **Run tests:** `npm test`
- **Build for production:** `npm run build`

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todoapp
NODE_ENV=development
```

For production or MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
```

## Project Structure

```
myapp/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── TodoList.jsx
│   │   │   ├── TodoForm.jsx
│   │   │   └── TodoItem.jsx
│   │   ├── __tests__/      # Component tests
│   │   ├── App.jsx         # Main App component
│   │   ├── App.css         # Tailwind CSS styles
│   │   ├── index.js        # React entry point
│   │   └── setupTests.js   # Test configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   │   └── Todo.js
│   │   ├── routes/         # Express routes
│   │   │   └── todos.js
│   │   ├── __tests__/      # API tests
│   │   │   └── todo.test.js
│   │   └── index.js        # Express server
│   ├── .env.example        # Environment template
│   └── package.json
├── package.json            # Root package.json
├── .gitignore
└── README.md
```

## API Usage Examples

### Create a new todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn React", "description": "Complete the React tutorial"}'
```

### Get all todos
```bash
curl http://localhost:5000/api/todos
```

### Update a todo
```bash
curl -X PUT http://localhost:5000/api/todos/6507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn React", "status": "completed"}'
```

### Delete a todo
```bash
curl -X DELETE http://localhost:5000/api/todos/6507f1f77bcf86cd799439011
```

## Testing

The application includes comprehensive test suites for both frontend and backend.

### Backend Tests (Jest + Supertest)
- API endpoint testing
- CRUD operation validation
- Error handling verification
- Input validation testing

```bash
cd server
npm test
```

### Frontend Tests (Jest + React Testing Library)
- Component rendering tests
- User interaction testing
- API integration testing
- Form validation testing

```bash
cd client
npm test
```

### Run All Tests
```bash
npm test
```

## Development Guidelines

### Code Style
- **ESLint** configuration for consistent code style
- **Prettier** for code formatting
- **Airbnb style guide** for JavaScript

### Component Structure
- Functional components with React hooks
- Props validation with PropTypes (optional)
- Modular component architecture
- Responsive design with Tailwind CSS

### API Design
- RESTful conventions
- Consistent error handling
- Input validation and sanitization
- Proper HTTP status codes

## Deployment

### Frontend (React)
```bash
npm run build
# Deploy the `client/build` folder to your hosting service
```

### Backend (Express)
- Configure production environment variables
- Set up MongoDB connection (local or Atlas)
- Deploy to services like Heroku, Vercel, or DigitalOcean

### Full-Stack Deployment
Consider using platforms like:
- **Heroku** - Easy deployment with MongoDB add-ons
- **Vercel** - Great for frontend with serverless functions
- **DigitalOcean App Platform** - Full-stack deployment
- **Railway** - Modern deployment platform

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Built following MERN stack best practices
- Styled with Tailwind CSS
- Tested with Jest and React Testing Library
- MongoDB integration with Mongoose