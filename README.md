# Study Ninja 🥷

A practice exam platform for children preparing to enter elementary school, focusing on progress tracking and interactive quizzes.

## 🎯 Overview

Study Ninja provides a gamified exam practice environment to help children prepare for elementary school entrance exams with comprehensive progress tracking and peer comparison features.

## 👥 Users

- **Students**: Kids practicing quizzes and tracking their progress
- **Parents**: Monitoring their children's performance and progress
- **Admins**: Educational content creators managing exam questions

## ✨ Features

### For Students & Parents
- 🔐 Login via email/password or SSO (Google, Facebook)
- 📝 Take timed practice exams with instant results
- 📊 View historical performance with interactive progress charts
- 📈 Compare performance metrics with peer averages

### For Admins
- 👨‍💼 Admin dashboard with secure login
- ✏️ Create, edit, and delete exam content
- 🖼️ Support for text and image-based questions
- ☑️ Multiple-choice answer options

## 🏗️ Architecture

- **Monorepo Structure**: All services in a single repository
- **Dockerized**: Every service runs in Docker containers
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Database**: Managed providers (Postgres, MongoDB, Redis)
- **Deployment**: DigitalOcean Container Registry and Droplets

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/faisol-chehumar/study-ninja.git
   cd study-ninja
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:3000/admin

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (for local development)

### Development Workflow
1. Create GitHub issue for new features
2. Create branch: `task/<ticket_number>/<feature-desc>`
3. Implement changes with tests
4. Create PR with squash-merge strategy

### Available Scripts
```bash
npm run dev          # Start development servers
npm run build        # Build all services
npm run test         # Run test suite
npm run lint         # Lint code
npm run format       # Format code
```

## 🔧 Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Redis for caching
- **Authentication**: JWT with OAuth2 (Google, Facebook)
- **Deployment**: Docker, GitHub Actions, DigitalOcean

## 📁 Project Structure

```
study-ninja/
├── apps/
│   ├── frontend/          # React.js application
│   └── backend/           # Node.js API server
├── .github/
│   └── workflows/         # CI/CD pipelines
├── docker-compose.yml     # Docker services
├── package.json          # Workspace configuration
└── docs/                 # Additional documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Create a pull request

Please read [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architectural decisions and [CLAUDE.md](./CLAUDE.md) for development workflow.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Project Status

🚧 **Currently in development** - MVP1 features are being implemented.

---

Made with ❤️ for young learners preparing for their educational journey.