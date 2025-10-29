# Web Development Project

A full-stack web application with React frontend and Spring Boot backend.

## Project Structure

```
Web Development/
├── Frontend/          # React.js frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/          # API integration
│   │   └── ...
│   ├── public/
│   └── package.json
│
└── Backend/           # Spring Boot backend application
    ├── src/
    │   ├── main/java/com/example/demo/
    │   │   ├── Controller/    # REST controllers
    │   │   ├── Entity/        # JPA entities
    │   │   ├── Service/       # Business logic
    │   │   ├── Repos/         # Data repositories
    │   │   └── DTO/           # Data transfer objects
    │   └── resources/
    └── pom.xml
```

## Features

### Frontend (React)
- User authentication and registration
- Book listing and management
- Book reviews and ratings
- Admin panel
- Responsive design with CSS
- Protected routes

### Backend (Spring Boot)
- RESTful API endpoints
- JWT authentication
- User management
- Book management
- Review system
- Database integration
- Security configuration

## Technologies Used

### Frontend
- React.js
- JavaScript (ES6+)
- CSS3
- HTML5

### Backend
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT (JSON Web Tokens)
- Maven

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Java 11 or higher
- Maven
- Git

### Frontend Setup
```bash
cd Frontend
npm install
npm start
```

### Backend Setup
```bash
cd Backend
./mvnw spring-boot:run
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Create new book (Admin)
- `PUT /api/books/{id}` - Update book (Admin)
- `DELETE /api/books/{id}` - Delete book (Admin)

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).