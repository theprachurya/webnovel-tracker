# Mugen's List - Web Novel Tracker

A personal web novel tracking application built with React, Node.js, and MongoDB. Track your reading progress, manage your novel collection, and keep notes on your favorite web novels.

## Features

- Track reading progress with chapter counts
- Add, edit, and delete novels
- Upload cover images
- Dark mode support
- Responsive design
- User authentication
- Progress tracking with visual indicators

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- File Upload: Multer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/webnovel-tracker.git
cd webnovel-tracker
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
   - Create `.env` file in the server directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

4. Initialize the admin user:
```bash
cd server
npm run init-admin
```

5. Start the development servers:
```bash
# Start the backend server
cd server
npm run dev

# Start the frontend development server
cd ../client
npm start
```

## Deployment

The application is configured for deployment on Vercel. Follow these steps:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 