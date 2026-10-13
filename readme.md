# Cloud-Based File Management System

A cloud-based file management backend built with **Node.js, Express.js, MongoDB Atlas, and Cloudinary**, with email notifications powered by Nodemailer.

The application demonstrates how a backend can receive file uploads, validate and process them, store files in cloud storage, maintain file metadata in a database, and send email notifications.

## Overview

Managing uploaded files involves more than simply accepting a file from a user. An application must handle incoming requests, process files, store them reliably, maintain associated metadata, and communicate the result.

This project implements these concepts through a modular Node.js and Express.js backend. Cloudinary handles cloud file storage, MongoDB Atlas stores file metadata, and Nodemailer integrates email notifications through an SMTP mail server.

## Features

- **File Uploads:** Handle file uploads through Express routes and multipart form data.
- **Local File Handling:** Support local file-upload processing.
- **Image Uploads:** Upload images to Cloudinary and obtain their hosted URLs.
- **Video Uploads:** Support video uploads with a configured 10 MB upload limit.
- **Cloud Storage Integration:** Store uploaded media using Cloudinary instead of relying exclusively on local storage.
- **Database Integration:** Store file metadata in MongoDB Atlas using Mongoose.
- **Email Notifications:** Send email notifications for image uploads through Nodemailer and SMTP.
- **Environment Configuration:** Keep database credentials, cloud-service credentials, and email configuration outside the source code.
- **Modular Backend:** Organize application logic into configuration, routes, controllers, and database models.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime for the backend |
| Express.js | HTTP server and routing |
| MongoDB Atlas | Cloud-hosted NoSQL database |
| Mongoose | MongoDB object modeling |
| Cloudinary | Cloud storage for uploaded media |
| Nodemailer | Email notifications |
| SMTP | Email delivery |
| express-fileupload | Handling multipart file uploads |
| dotenv | Loading environment variables |
| Git and GitHub | Version control and source-code hosting |

## Architecture

The application uses separate services for file storage, metadata persistence, and email delivery.

```text
                Client / API Request
                        |
                        v
                 Express.js Server
                        |
                        v
                  Upload Routes
                        |
                        v
                  Controllers
                   /    |    \
                  /     |     \
                 v      v      v
          Cloudinary  MongoDB  SMTP Server
          File Storage Atlas   (via Nodemailer)
                      |
                      v
               File Metadata
```

### How it works

1. A client sends an upload request to an Express endpoint using multipart form data.
2. Express routes the request to the corresponding controller.
3. The controller processes the uploaded file and performs the relevant upload operation.
4. For cloud uploads, Cloudinary stores the media and provides a URL.
5. Mongoose stores associated metadata, including the file name, URL, email, and tags where applicable.
6. For supported upload operations, Nodemailer sends an email notification through the configured SMTP provider.

Cloudinary stores the actual uploaded media, while MongoDB stores the associated metadata and file URL.

## Project Structure

```text
Cloud-Based-File-Management-System/
│
├── config/
│   ├── database.js       # Database configuration
│   ├── cloudinary.js     # Cloudinary configuration
│   └── mail.js           # SMTP and email configuration
│
├── controllers/
│   └── upload.js         # File upload processing
│
├── models/
│   └── upload.js         # Upload metadata model
│
├── routes/
│   └── upload.js         # Upload-related routes
│
├── index.js              # Application entry point
├── package.json          # Dependencies and scripts
├── package-lock.json     # Dependency lockfile
├── .gitignore
└── .env                  # Local environment variables (not committed)
```

## Getting Started

### Prerequisites

Install or arrange access to the following:

- Node.js and npm
- Git
- A MongoDB Atlas database
- A Cloudinary account
- An SMTP email account and its required credentials

### 1. Clone the repository

```bash
git clone https://github.com/sri-bhargav-09/Cloud-Based-File-Management-System.git
cd Cloud-Based-File-Management-System
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root, alongside `index.js`.

Add the configuration variables required by the application:

```env
PORT=3000

MONGO_URL=your_mongodb_connection_string

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

MAIL_USER=your_smtp_username
MAIL_HOST=your_smtp_host
MAIL_PASSWORD=your_smtp_password
```

Replace the placeholder values with your own credentials.

**Security note:** Never commit your `.env` file or expose database passwords, Cloudinary API secrets, or email credentials in source code, screenshots, or public repositories.

For MongoDB Atlas, configure database access and network access so that your application can connect. Use appropriately restricted credentials and network rules.

### 4. Start the application

To start the application normally:

```bash
npm start
```

To run the application in development mode with automatic restarts:

```bash
npm run dev
```

The development command uses Nodemon.

With the default port configured above, the server runs at:

```text
http://localhost:3000
```

The root endpoint can be checked in a browser or with curl:

```bash
curl http://localhost:3000/
```

The current root route returns:

```text
hello file Upload
```

## API Overview

The upload router is mounted at `/api/v1/upload`.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/upload/localUpload` | Handle a local file upload |
| `POST` | `/api/v1/upload/imageUpload` | Handle an image upload |
| `POST` | `/api/v1/upload/videoUpload` | Handle a video upload |
| `POST` | `/api/v1/upload/imageReducer` | Image-reduction upload operation |

### Example: Local file upload

The local upload endpoint accepts a multipart form-data request with a file field named `file`.

```bash
curl -X POST http://localhost:3000/api/v1/upload/localUpload \
  -F "file=@test.txt"
```

A successful request has returned a response similar to:

```json
{
  "success": true,
  "message": "local file upload successfully"
}
```

For image and video uploads, use the multipart field names and validation requirements defined by the current controller implementation. The image-reduction endpoint should likewise be tested against its implemented request format.

> API behavior and response formats can change as the project evolves. Refer to the route and controller files for the latest implementation details.

## Database and Cloud Storage

### MongoDB Atlas

MongoDB Atlas stores file-related metadata. Mongoose defines the document structure and handles database operations.

The upload metadata model includes fields such as:

- File name
- Hosted image URL
- Email
- Tags

### Cloudinary

Cloudinary provides cloud storage for uploaded media. After a successful upload, the returned URL can be stored in MongoDB alongside the other metadata.

### Email Notifications

Nodemailer sends email through the configured SMTP server. The SMTP host, username, and password are provided through environment variables rather than hardcoded in the application.

## Error Handling and Validation

The application includes upload validation and error handling for supported operations. For example, invalid upload requests and oversized video uploads should be tested to verify that the server handles them appropriately.

When extending the application, useful improvements include consistent HTTP status codes, structured error responses, stricter file-type validation, and more comprehensive request validation.

## Future Improvements

Potential improvements as the project develops:

- Build a frontend using HTML, CSS, and JavaScript.
- Expand the REST API and improve API documentation.
- Add stronger file-type and file-size validation.
- Improve centralized error handling and logging.
- Add file listing, retrieval, and deletion functionality where appropriate.
- Add authentication and authorization.
- Deploy the application to AWS EC2.
- Introduce automated tests and a deployment workflow.

These are planned improvements, not claims about features already implemented.

## Learning Outcomes

This project provides practical experience with:

- Building a backend using Node.js and Express.js.
- Designing and organizing API routes and controllers.
- Handling multipart file uploads.
- Connecting an application to MongoDB Atlas using Mongoose.
- Integrating third-party cloud storage through Cloudinary.
- Sending email through SMTP with Nodemailer.
- Managing configuration and secrets with environment variables.
- Using Git and GitHub to manage project changes.

## Author

**Sri Bhargava**

GitHub: [sri-bhargav-09](https://github.com/sri-bhargav-09)

---

*Built as a practical project to explore backend development, database integration, cloud storage, and email notifications.*
