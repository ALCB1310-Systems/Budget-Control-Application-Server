# ***BUDGET CONTROL APP***

[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://shields.io/)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

![5%](https://progress-bar.dev/5/)

## [Tech stack](./Documentation/tech-stack.md)

![Node JS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Express JS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

[More...](./Documentation/tech-stack.md)

---

## Project Standarization

- ### [File structure](./Documentation/project-file-structure.md)

[//]: # (TODO insert an image of the folder structure when done)

- ### [Coding Standards](./Documentation/coding-standards.md)

In this section you will be able to find all of the coding standards that will govern this project, like how to name the variables, how to create functions, write strings, etc

[More...](./Documentation/coding-standards.md)

- ### [Testing](./Documentation/testing.md)

In this section you will be able to find how will all the tests should be written. Since we are going to be developing using TDD this will be the backbone of all the development process.

[More...](./Documentation/testing.md)

---

## Database

### Selecting a RDBMS

In this project we will be using a Relational Database Managment System that will have to have the following characteristics:

- Free to use
- Easy to deploy
- Open source

Given this the main RDBMS available are the following:

- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
- [![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)
- [![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)](https://mariadb.org)
- [![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/index.html)
- [![Firebird](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebirdsql.org)

There are others too, but the ones listed are the major free open source database management systems.

After doing some research it was decided we will be working with PostgreSQL.  This RDBMS is common to find in many sites where we can deploy the app like [Railways](https://railway.app/), [Heroku](https://www.heroku.com/) or many others that are available.

### Entity Relationship Diagram

![EntityRelationshipDiagram](./Documentation/graphics/BCAB.png)

## Routes

### Routing naming convention

This project will have a RESTfull design, with this in mind, there are the following considerations:

- All routes will be within the /api/v1.0 route.  This identifies that the route is within the API and in its version 1.0, so when there are upgrades we can keep track of it.
- All routes will have the name of the entity with which it is working with and will always be plural. Eg. the route /users will work with the Users entity
- The routes, depending on its necesities, will work with the following methods:

  - POST: To create a new element, eg. a POST request to the /users endpoint will create a new user
  - GET: This will retrieve the information of the element, this will be sepparated into two different routes

    - A GET request to the base endpoint, will get all of the elements for that entity
    - A GET request passing in the route the UUID of the element, will return the one element

  - PUT: This request will always have to reference a specific UUID, and will be in charge of updating the corresponding element
  - DELETE: This request will always have to reference a specific UUID, and will be in charge of deleting the corresponding element, keeping in mind that this request will be used on very specific cases.

**Example:**

|Resource|POST|GET|PUT|DELETE|
|---|---|---|---|---|
|/users|Create a new user|Retrieve all users|Error|Error|
|/users/1|Error|Retrieve details of user 1|Update details of user 1|Deletes user 1|

### Data modeling

All the information that will be sent to and from the API will be in a JSON format, so the headers must include

```HTTP
Content-Type: application/json
```

### Routes available

These are the available routes for this API and a brief description:

|Route|GET|POST|PUT|DELETE|Description|
|---|---|---|---|---|---|
|/login|✖️|✔️|✖️|✖️|Login process, generates the JWT token|
|/companies|✔️|✔️|✔️|✖️|Information about the companies that uses the application|
|/users|✔️|✔️|✔️|✖️|User information including email and password|
|/budget-items|✔️|✔️|✔️|✖️|Budget item information|
|/suppliers|✔️|✔️|✔️|✖️|Supplier contact information|
|/projects|✔️|✔️|✔️|✖️|Information about the project we are budgeting|
|/budgets|✔️|✔️|✔️|✖️|Budget information, the core of the application|
|/invoices|✔️|✔️|✔️|✖️|Invoice header information|
|/invoice/{uuid}/details|✔️|✔️|✖️|✔️|Detail of the invoice indicating what budget item will be afected|

Almost all of the routes will be *protected* routes, meaning you will need to be logged in to be able to access.  The only routes that will not be protected are:

- login (POST)
- comapnies(POST)
- users(POST)

The reason is with the first the authentication token will be generated and credentials will be validated and with the other two is for the application registration process.
