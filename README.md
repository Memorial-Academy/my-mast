# MyMAST

## About
MyMAST is the web application responsible for running all programs related to the Memorial Academy of Science and Technology. The app is intended to connect students, parents, volunteers, program directors, and organization leaders in a central ecosystem.

### Parents
Parents create an account that allows them to sign up for programs with a minimal number of clicks. Important information is stored on the parent's account and automatically linked to their enrollments. Additionally, parents will be able to fill out any necessary forms (ex: waivers) directly from the web interface.
<br>
Once enrolled, parents will be able to receive confirmation and updates on their enrollment directly from MyMAST.

### Students
Student accounts are linked directly to the parent's account (and must be created by a parent account), however utilizing separate login credentials, reducing the complexities of logging in and ensuring easy tracking of student enrollments, and creating a foundation for students to receive activities directly from MAST team members via MyMAST (with parents able to observe from their dashboard).

### Volunteers
Volunteers will be able to create accounts to sign up for programs, track their hours, and receive instructions, student information, and instructional information directly from their dashboard.

## Development
This is a monorepo for the three central components of MyMAST:
- `server`: Express.js application providing an API to access/modify data related to the application
- `client`: Next.js application serving content to end users (students, volunteers, and parents)
- `admin`: Next.js application providing access to the administrative controls of MyMAST infrastructure

The project utilizes PNPM as the package manager, with Turborepo as a monorepo manager.

### MongoDB and Docker
The project utilizes MongoDB as the database provider. A Docker Compose file is provided that will handle the process of creating a secure and properly configured MongoDB instance.

The `config` directory provides the config files utilized to correctly configure MongoDB for MyMAST

### Required environment variables
#### `config/mongo.env`
- `MONGO_INITDB_ROOT_USERNAME`: admin username for MongoDB
- `MONGO_INITDB_ROOT_PASSWORD`: admin password for MongoDB
- `MONGO_INITDB_ROOT_DATABASE`: authentication database for MongoDB
- `MONGO_USER`: username of the permissioned user that will be used by the API to access the necessary databases
- `MONGO_PASSWORD`: password of the permissioned user that will be used by the API

#### `apps/server/.env`
- `PORT`: API server port
- `MONGO_USER`: see `MONGO_USER` in `config/mongo.env`
- `MONGO_PASSWORD`:  see `MONGO_PASSWORD` in `config/mongo.env`

#### `apps/client/.env`
- `NEXT_PUBLIC_API_URL`: the URL to be used by the application to connect to the API server (ex: localhost:5000)