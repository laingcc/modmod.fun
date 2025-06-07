# modmod.fun

Welcome to `modmod.fun`, a collaborative platform for sharing and discussing projects, ideas, and community-driven content. Built with Angular, this application provides a seamless and interactive experience for users to engage with each other.

## Features

- **Project Sharing**: Create and showcase your projects with detailed descriptions and images.
- **Community Discussions**: Engage in threaded discussions with support for nested comments and quoting.
- **Tripcode Support**: Optionally secure your identity with tripcodes for added authenticity.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Angular CLI](https://angular.io/cli) (v17.3.3 or higher)

### Running the Development Server

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/modmod.fun.git
   cd modmod.fun
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the  frontend development server:
   ```bash
   ng serve
   ```
   
4. Start the backend server:
   ```bash
   gunicorn -b 0.0.0.0:5000 'server:app'
   ```

4. Open your browser and navigate to `http://localhost:4200/`.

The application will automatically reload if you make changes to the source files.

## File Structure

The project follows a modular structure for scalability and maintainability:
```
src/
├── app/
│   ├── components/       # Reusable components
│   ├── services/         # Application services
│   ├── utils/            # Utility functions
│   ├── static-pages/     # Static content pages
│   └── app.module.ts     # Root module
├── assets/               # Static assets (images, sounds, etc.)
├── environments/         # Environment-specific configurations
└── index.html            # Application entry point
```

## Contributing

We welcome contributions! To get started:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the GNU General Public License v3.0. See the `LICENSE` file for details.

## Acknowledgments

Special thanks to the open-source community for providing the tools and inspiration to build this platform.
