---
id: core_components
---

# Core Components

## Description of Key Components

- **Applications (apps/)**: Contains the various applications, each with its own configuration and source code. For example, the `beneficiary` application includes specific services, controllers, and modules necessary for its functionality.
- **Libraries (libs/)**: Shared libraries that can be utilized by multiple applications to promote code reuse and consistency.
- **Prisma (prisma/)**: Manages database migrations and schema definitions, ensuring data integrity and ease of database management.
- **Tools (tools/)**: Scripts and configurations for development tools, such as Docker compose files and utility scripts for setting up and managing the development environment.
  - **docker-compose/**: Contains Docker Compose configurations for setting up various development environments.
    - **dev-tools/**: Configuration files and scripts for setting up development tools using Docker Compose.
      - **.env.example**: Example environment variables file.
      - **docker-compose.yml**: Docker Compose configuration file for development tools.
      - **.env**: Environment variables file.
    - **graph/**: Configuration files for setting up graph-related services using Docker Compose.
      - **docker-compose.yml**: Docker Compose configuration file for graph services.
  - **scripts/**: Utility scripts for setting up, managing, and maintaining the development environment.
    - **getEth.ts**: Script to obtain test ETH for development purposes.
    - **setupDevTools.sh**: Shell script to set up development tools.
    - **utils.sh**: Shell script containing utility functions.
    - **bootstrap.sh**: Shell script to bootstrap the development environment.
    - **mn.ts**: Script for managing mnemonic phrases for test accounts.
    - **publish.mjs**: Script to publish packages.
    - **reset.sh**: Shell script to reset the development environment.
- **Configuration Files**: Includes ESLint, Prettier, Jest, and other configuration files (`.eslintrc.json`, `jest.config.ts`, `tsconfig.base.json`, etc.) to enforce coding standards and streamline the development workflow.
- **Documentation (README.md, CONTRIBUTING.md)**: Provides guidelines for contributing to the repository, setup instructions, and an overview of the repository's purpose and structure.
