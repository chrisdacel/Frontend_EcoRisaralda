<p align="center"><img width="400" height="200" alt="Screenshot" src="https://github.com/user-attachments/assets/caca9021-e495-4e47-8c5d-2a49858284e7" /></p>

# Conexion EcoRisaralda

Conexion EcoRisaralda is a web-based Ecotourism system designed to showcase the most attractive natural locations in the department of Risaralda.  
User functionalities are based on three different roles:  
Administrator, Operator, and Tourist.  
Access to the full system is provided through registration and login modules. Regular users are typically assigned the Tourist role, allowing them to access reliable information about registered ecotourism sites, with the option to also save favorite sites, rate, and comment.

## System Objective
To develop a web system that allows the management and promotion of ecotourism in Risaralda, providing users with a platform where they can register, personalize their profile, explore events and tourist sites based on their preferences, thus facilitating an interactive, secure, and personalized experience.

## Main Features

- User registration and login  
- Profile management (photo, name, email, password)  
- Exploration of ecotourism destinations  
- Event publishing and visualization  
- User preference customization  
- Interest-based recommendations  

## Technologies Used
**Backend:**
- PHP 8.2.12
- Laravel Framework 12
- ORM: Eloquent
  
**Frontend:**
- JavaScript
- React (with Vite as build tool and development environment)

**Runtime and Package Management:**
- Node.js
- npm
  
**Database:**
- MySQL
  
**Version Control:**
- GitHub
- Git


## System Roles
The EcoRisaralda platform provides various functionalities aimed at improving user experience and ecotourism management in the region.

**User Functionalities**
- Registration and login
- Exploration of ecotourism sites
- Saving sites as favorites
- Viewing browsing history
- Profile management (personal data and preferences)
- Comments and site ratings
- Receiving system notifications

**Operator Functionalities**
- Registration and publishing of ecotourism sites
- Creation of events associated with their sites
- Viewing statistics of their sites
- Managing and updating site information
- Moderation and restriction of inappropriate comments

**Administrator Functionalities**
- Management of ecotourism sites
- User administration
- Tag/category management
- Event management
- Comment moderation and administration
  
## Project Structure
```
backend/
└── Conexion-EcoRisaralda/
├── app/ # Main logic (controllers, models, etc.)
├── bootstrap/ # Framework initialization
├── config/ # Configuration files
├── database/ # Migrations, seeders and factories
├── public/ # Entry point (index.php) and public files
├── resources/ # Views, styles and assets
├── routes/ # Route definitions
├── storage/ # Logs, cache and generated files
├── tests/ # System tests
├── vendor/ # Composer dependencies
│
├── .editorconfig # Editor configuration
├── .env # Environment variables
├── .env.example # Example variables
├── .gitattributes # Git configuration
├── .gitignore # Ignored files
│
├── artisan # Laravel CLI
├── composer.json # PHP dependencies
├── composer.lock # Exact versions
│
├── package.json # Node.js dependencies
├── package-lock.json # Exact Node versions
│
├── phpunit.xml # Testing configuration
├── postcss.config.js # PostCSS configuration
├── tailwind.config.js # Tailwind configuration
├── vite.config.js # Vite configuration
│
├── create_admin.php # Script to create admin
├── create_admin_simple.php # Alternative script
├── reset_db.php # Database reset
│
├── test_login.html # UI test
├── test_login.php # Authentication test
│
└── README.md # Backend documentation
```
```
frontend/
└── FrontEndEcoturismo/
├── node_modules/ # Installed dependencies
├── public/ # Public files
├── src/ # Main source code
│
├── .env # Environment variables
├── .gitignore # Ignored files
│
├── index.html # Main HTML file
├── package.json # Project dependencies
├── package-lock.json # Exact dependency versions
│
├── postcss.config.js # PostCSS configuration
├── tailwind.config.js # Tailwind CSS configuration
├── vite.config.js # Vite configuration
```

## System Architecture
The project is divided into two main parts:

**Backend:** Developed with Laravel, responsible for system logic, authentication, and data management.

**Frontend:** Developed with Vite, Tailwind CSS and JavaScript, responsible for the user interface.


## Installation and Configuration
Follow the steps below to run the project in your local environment.

**Initial Structure**

Create a main folder containing:
```
project/
├── backend/
└── frontend/
```

### Backend Installation
1. Navigate to the backend folder:
   
`cd backend`

2. Clone the repository:
   
`git clone https://github.com/CrisMonsalve348/Conexion-EcoRisaralda.git`

3. Enter the project folder:
   
`cd Conexion-EcoRisaralda`

4. Install PHP dependencies:
   
`composer install`

5. Install Node dependencies (interactive map):
   
`npm install`
### Environment Configuration (.env)
   
6. Create the `.env` file:
- Copy the content from `.env.example`
- Paste it into a new file named `.env`
  
**Backend Environment Variables**

**Application**
```
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

ASSET_URL=http://localhost

FRONTEND_URL=http://localhost:5173

FRONTEND_URL_ALT=http://127.0.0.1:5173

```
----------------------------------------------------------------------
| Variable          |	Description                                   |
|-------------------|-------------------------------------------------|
| APP_NAME          |	Project name                                  |
| APP_ENV           |	Environment (local, production)               |
| APP_KEY           |	Security key (generated with artisan)         |
| APP_DEBUG         |	Displays errors in development                |
| APP_URL           |	Backend URL                                   |
| ASSET_URL         |	Assets URL                                    |
| FRONTEND_URL      |	Main frontend URL                             |
| FRONTEND_URL_ALT  |	Alternative URL                               |
----------------------------------------------------------------------

**Localization**
```
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US
```

---------------------------------------------------------
| Variable              |	Description                  |
|-----------------------|--------------------------------|
| APP_LOCALE            |	Main language                |
| APP_FALLBACK_LOCALE   |	Fallback language            |
| APP_FAKER_LOCALE      |	Fake data language           |
---------------------------------------------------------

**Maintenance**

``APP_MAINTENANCE_DRIVER=file``

------------------------------------------------------------
| Variable	             |  Description                     |
|------------------------|----------------------------------|
| APP_MAINTENANCE_DRIVER |	Maintenance mode control        |
------------------------------------------------------------

**Security**

``BCRYPT_ROUNDS=12``

--------------------------------------------
| Variable       |	Description            |
|----------------|-------------------------|
| BCRYPT_ROUNDS  |	Encryption level       |
--------------------------------------------

**Logs**
````
LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=debug
````
---------------------------------------------
| Variable     |	Description              |
|--------------|-----------------------------|
| LOG_CHANNEL  |	Log channel              |
| LOG_STACK    |	Storage type             |
| LOG_LEVEL    |	Detail level             |
----------------------------------------------

**Database**
````
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=conexion_ecorisaralda
DB_USERNAME=root
DB_PASSWORD=
````
-----------------------------------------------------
| Variable        | 	Description                 |
|-----------------|---------------------------------|
| DB_CONNECTION   |	Database type (mysql, sqlite)   |
| DB_HOST         |	Server                          |
| DB_PORT         |	Port                            |
| DB_DATABASE     |	Database name                   |
| DB_USERNAME     |	Username                        |
| DB_PASSWORD     |	Password                        |
-----------------------------------------------------

**Sessions**
````
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=true
````
----------------------------------------------------
| Variable               |	Description            |
|------------------------|-------------------------|
| SESSION_DRIVER         |	Session type           |
| SESSION_LIFETIME       |	Duration               |
| SESSION_ENCRYPT        |	Encryption             |
| SESSION_PATH           |	Path                   |
| SESSION_DOMAIN         |	Domain                 |
| SESSION_SECURE_COOKIE  |	Cookie security        |
----------------------------------------------------

 **System**
 ````
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database
````
-----------------------------------------
| Variable	            | Description    |
|-----------------------|----------------|
| BROADCAST_CONNECTION  |	Events        |
| FILESYSTEM_DISK       |	Files         |
| QUEUE_CONNECTION      |	Queue         |
| CACHE_STORE           |	Cache         |
------------------------------------------

**Redis / Memcached**
````
MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
````
-----------------------------------------
| Variable       |	Description         |
|----------------|----------------------|
| REDIS_HOST     |	Redis server       |
| REDIS_PORT     |	Port               |
| MEMCACHED_HOST |	Memcached server   |
-----------------------------------------

**Mail**
````
MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com
"
MAIL_FROM_NAME="${APP_NAME}"
````
------------------------------------------
| Variable          |	Description      |
|-------------------|--------------------|
| MAIL_MAILER       |	Mail driver      |
| MAIL_HOST         |	Server           |
| MAIL_PORT         |	Port             |
| MAIL_USERNAME     |	Username         |
| MAIL_PASSWORD     |	Password         |
| MAIL_FROM_ADDRESS |	Sender email     |
| MAIL_FROM_NAME    |	Sender name      |
------------------------------------------

**AWS (Optional)**
````
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
````
--------------------------------------------
| Variable              |	Description    |
|-----------------------|------------------|
| AWS_ACCESS_KEY_ID     |	AWS key         |
| AWS_SECRET_ACCESS_KEY |	Secret key      |
| AWS_BUCKET            |	Storage         |
--------------------------------------------

**Vite**

``VITE_APP_NAME="${APP_NAME}"``

------------------------------------------
| Variable       |	Description          |
|----------------|-----------------------|
| VITE_APP_NAME  |	Frontend app name   |
------------------------------------------

**Generate application key**

``php artisan key:generate``

**Database configuration**

Create a MySQL database, for example:

``conexion_ecorisaralda``

Run migrations:

``php artisan migrate:fresh --seed``

### Run Backend

``php artisan serve``


### Frontend Installation

Navigate to the folder:

``cd frontend``

Clone the repository:

``git clone https://github.com/chrisdacel/FrontEndEcoturismo.git``

Enter the project:

``cd FrontEndEcoturismo``

Install dependencies:

``npm install``

### Frontend Configuration (.env)

Create a `.env` file in the frontend:

``VITE_API_URL=http://localhost:8000/api``

------------------------------------
| Variable     |	Description     |
|--------------|--------------------|
| VITE_API_URL |	Backend URL      |
-------------------------------------

### Run Frontend

``npm run dev``

**System Access**

``http://localhost:5173/``

## Requirements
- PHP >= 8.x
- Composer
- Node.js
- MySQL
- XAMPP or similar environment

## CORS Configuration
The Conexión EcoRisaralda system implements CORS (Cross-Origin Resource Sharing) configuration in the backend developed with Laravel.

This allows secure communication between the frontend (React) and the backend (REST API), even when they are hosted on different domains.

**Purpose**

CORS allows defining which domains can access the backend, preventing unauthorized access.

In this project, it is used together with Laravel Sanctum for cookie-based authentication.

**Main Configuration**

Protected routes
````
'paths' => [
'api/*',
'sanctum/csrf-cookie',
'login',
'logout',
'user',
],
````
Defines the endpoints where CORS rules are applied.

**Allowed origins**
````
'allowed_origins' => [
env('FRONTEND_URL'),
env('FRONTEND_URL_ALT'),
],
````

Allows access from the frontend.

It can also be configured with multiple domains using:

``CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173``

**HTTP Methods**

``'allowed_methods' => ['*'],``

Allows all methods (GET, POST, PUT, DELETE).

**Headers**

``'allowed_headers' => ['*'],``

Allows all HTTP headers.

**Credentials**

``'supports_credentials' => true,``

Allows sending cookies and sessions (required for Sanctum).

**Cache**

``'max_age' => 0,``

Does not cache preflight requests.

This configuration allows:

- Secure communication between frontend and backend
- Authentication with Laravel Sanctum
- Compatibility across environments (local and production)


## Run Tests
**Frontend (React)**

``npm test``

**Backend (Laravel)**

``php artisan test``

These tests include validations of components, business logic, and communication between client and server.

### Types of tests implemented

- Unit tests  
- Integration tests  
- Component tests  

For more information, see the **Testing** section in the project documentation.

## Test Users

To facilitate system validation, the following test users are available:

--------------------------------------------------------------------
| Role       | Email                    | Password               |
|------------|---------------------------|--------------------------|
| Admin      | admin@ecorisaralda.com    | ecorisaralda123          |
| Operator   | test@example.com          | password123              |
| Tourist    | test2@example.com         | password123              |
--------------------------------------------------------------------

## REST API - Documentation
### Base URL
`http://localhost:8000/api`

### AUTHENTICATION

The API uses authentication based on Laravel Sanctum.

Required header for protected routes:

`
Authorization: Bearer {token}
Accept: application/json
`

### SYSTEM ROLES
**admin:** Full control

**operator:** Manages their sites

**user:** Interacts and comments

**guest:** View-only access

### RESPONSE FORMAT
- Success
  
```
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

- Error
```  
{
  "success": false,
  "message": "Operation error"
}
```

### AUTHENTICATION
**Login**

POST `/api/login`

Starts session.

**Body**
```
{
  "email": "user@email.com",
  "password": "123456"
}
```

**Positive**
```
{
  "token": "access_token",
  "user": {
    "id": 1,
    "name": "User",
    "role": "admin"
  }
}
```

**Negative**
````
{
"message": "Invalid credentials"
}
````

**Logout**

POST `/api/logout`

Requires authentication.

**Register**

POST `/api/register`

Creates a user.

**Password recovery**

----------------------------------------
| Method	| Endpoint                 |
|-----------|--------------------------|
| POST	    |  `/api/forgot-password`  |
| POST	    |  `/api/reset-password`   |
----------------------------------------

### ECOTOURISM SITES (PLACES)
**Get all sites**

GET `/api/places`

Public access.

**Response**
````
{
"data": [
{
"id": 1,
"name": "Cascada Verde",
"municipio": "Santa Rosa",
"rating": 4.7
}
]
}
````

**Get site by ID***

GET `/api/places/{id}`

**Error**
````
{
"message": "Site not found"
}
````

**Create tourist site**

POST `/api/places`

Roles: operator, admin

**Body**
````
{
"name": "Natural Reserve",
"description": "Ecotourism",
"municipio_id": 3
}

````

**No permissions**
````
{
"message": "Unauthorized"
}
````

**Update site**

PUT `/api/places/{id}`

Roles:

- admin
- owner operator
  
**Delete site**

DELETE `/api/places/{id}`

**Operator sites**

GET `/api/user-places`

Returns sites created by the operator.

### REVIEWS
**Create review**

POST `/api/places/{id}/reviews`

Authenticated user.
````
{
"rating": 5,
"comment": "Excellent experience"
}
````

**Edit review**

PUT ``/api/reviews/{id}``

**Delete review**

DELETE ``/api/reviews/{id}``

**React to review**

POST ``/api/reviews/{id}/react``


### COMMENTS
**Create comment**

POST ``/api/places/{id}/comments``


**Edit comment**

PUT ``/api/comments/{id}``

**Delete comment**

DELETE ``/api/comments/{id}``

### FAVORITES
**Add favorite**

POST ``/api/places/{id}/favorite``

**Remove favorite**

DELETE ``/api/places/{id}/favorite``

**View favorites**

GET ``/api/favorites``

### USER PROFILE
**View profile**

GET ``/api/profile``

**Update profile**

PUT ``/api/profile``

**Change password**

POST ``/api/profile/password``

**Upload avatar**

POST ``/api/profile/avatar``

**Delete avatar**

DELETE ``/api/profile/avatar``

### NOTIFICATIONS
***List notifications**

GET ``/api/user/notifications``

**Mark as read**

POST ``/api/user/notifications/{id}/read``


**Archive notification**

POST ``/api/user/notifications/{id}/archive``

**Archive all**

POST ``/api/user/notifications/archive-all``

### EVENTS
**Upcoming events**

GET ``/api/events/upcoming``

**Specific event**

GET ``/api/events/{id}``

**Create event on site**

POST ``/api/places/{id}/events``

### ADMIN API

(Admin-only access)

**Dashboard**

GET ``/api/admin/dashboard``

**Manage users**

--------------------------------------------
| Method	 | Endpoint                    |
|------------|-----------------------------|
| GET        |	`/api/admin/users`         |
| POST       |	`/api/admin/users`         |
| GET        |	`/api/admin/users/{id}`    |
| PUT        |	`/api/admin/users/{id}`    |
| DELETE     | 	`/api/admin/users/{id}`    |
--------------------------------------------

**Manage sites**

-------------------------------------
| Method  |	Endpoint                 |
|---------|--------------------------|
| GET	  | `/api/admin/places`      |
| PUT	  | `/api/admin/places/{id}` |
| DELETE  |	`/api/admin/places/{id}` |
--------------------------------------

**Moderate reviews**

-----------------------------------------------------
| Method  |	Endpoint                                |
|---------|-----------------------------------------|
| GET	  | ``/api/admin/reviews``                  |
| POST    |	``/api/admin/reviews/{id}/restrict``    |
| POST    | ``/api/admin/reviews/{id}/unrestrict``  |
------------------------------------------------------

**Approve operators**

--------------------------------------------------
| Method  |	Endpoint                             |
|---------|--------------------------------------|
| GET     |	``/api/admin/operators/pending``     |
| POST    |	``/api/admin/operators/{id}/approve``|
| POST    |	``/api/admin/operators/{id}/reject`` |
--------------------------------------------------

### OPERATOR API
**Operator stats**

GET ``/api/operator/stats``

**Moderate own reviews**

------------------------------------------------------
| Method  |	Endpoint                                 |
|---------|------------------------------------------|
| GET     |	``/api/operator/reviews``                |
| POST    |	``/api/operator/reviews/{id}/restrict``  |
| POST    |	``/api/operator/reviews/{id}/unrestrict``|
------------------------------------------------------

### PREFERENCES AND RECOMMENDATIONS
**User preferences**

--------------------------------------
| Method  |	Endpoint                  |
|---------|---------------------------|
| GET	  | ``/api/user/preferences`` |
| POST	  | ``/api/user/preferences`` |
---------------------------------------

**Recommendations**
GET ``/api/recommendations``

### SYSTEM HEALTH
**Health Check**

GET ``/api/health``

Verifies that the API is active.

### HTTP CODES

--------------------------------
| Code   |	Meaning             |
|--------|----------------------|
| 200    |	OK                  |
| 201    |	Created             |
| 401    |	Unauthorized        |
| 403    |	Forbidden           |
| 404    |	Not found           |
| 422    |	Validation error    |
| 500    |	Server error        |
--------------------------------

### PUBLIC ENDPOINTS

No login required:

- ``/api/places``
- ``/api/places/{id}``
- ``/api/events/upcoming``
- ``/api/recommendations``
- ``/api/register``
- ``/api/login``


## Authors

- **Cristian Monsalve**
   
  3146355214  

- **Cristian Acevedo**
  
  3502502052  

- **Jackeline Giraldo Gaviria**
  
  3018164826  

