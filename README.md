# Ecommerce Website Backend

This project is a backend implementation for an ecommerce website. It provides APIs for managing products, orders, and user authentication.

## Installation

1. Clone the repository: `git clone https://github.com/itsmesohit/ecommerce-backend.git`
2. Install dependencies: `npm install`
3. Set up the database: Create a MongoDB database and update the database configuration in `config.js`.
4. Run database migrations: `npm run migrate` (if applicable)
5. Start the server: `npm start`

## Usage

To use the APIs, you can send HTTP requests to the following endpoints:

- `/api/v1/admin/users`: 
  - `GET`: Get all users (admin role required)
- `/api/v1/admin/user/:id`: 
  - `GET`: Get a specific user (admin role required)
  - `PUT`: Update a specific user (admin role required)
  - `DELETE`: Delete a specific user (admin role required)
- `/api/v1/manager/users`: 
  - `GET`: Get all users (manager role required)

- `/api/v1/register`: 
  - `POST`: Register a new user.
- `/api/v1/login`: 
  - `POST`: Log in with a registered user.
- `/api/v1/forgetpassword`: 
  - `POST`: Send reset password instructions to the email for users who forgot their passwords.
- `/api/v1/resetpassword/:token`: 
  - `POST`: Reset user's password using the token sent by email.

- `/api/v1/changepassword`:  
  - `PUT`: Change the logged-in user's password.
- `/api/v1/userProfile`:   
  - `GET`: Get logged-in user's profile information.
- `/api/v1/updateProfile`:  
  - `PUT`: Update logged-in user's profile information.

- `/api/v1/products`: 
  - `GET`: Get all products.
  - `POST`: Create a new product.
- `/api/v1/products/:id`: 
  - `GET`: Get a specific product.
  - `PUT`: Update a specific product.
  - `DELETE`: Delete a specific product.
- `/api/v1/orders`: 
  - `GET`: Get all orders.
  - `POST`: Create a new order.
- `/api/v1/orders/:id`: 
  - `GET`: Get a specific order.
  - `PUT`: Update a specific order.
  - `DELETE`: Delete a specific order.

## Configuration

The project uses environment variables for configuration. Create a `.env` file in the root directory and add the following variables:

```plaintext
PORT=4000  # Port number for the server


DB_URL = mongodb+srv://username:password@cluster0.ad3buwr.mongodb.net

CLOUDINARY_NAME = # Your Cloudinary name
CLOUDINARY_API_KEY = # Your Cloudinary API Key
CLOUDINARY_API_SECRET = # Your Cloudinary API secret
PORT = 4000
JWT_SECRET=your_jwt_secret_key  # Secret key for JWT token
JWT_EXPIRE = 3d
COOKIE_TIME = 3d

SMTP_Host = sandbox.smtp.mailtrap.io
SMTP_Port =  587 
SMTP_Username = #  your username here
SMTP_Password = #   your password here
