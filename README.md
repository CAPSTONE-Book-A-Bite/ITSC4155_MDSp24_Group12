# Book-A-Bite

> **_NOTE:_** PROJECT IN PROGRESS

Welcome to our restaurant reservation application for Software Development 4155!

### Possible Technologies

- Node.js for server-side javascript (industry standard)
- Express.js for RESTful API to perform CRUD operations
- PostgreSQL for backend storage
- Vanilla HTML, CSS, Javascript

### Tips

- In directory, you will see a Backend folder
- In the backend, a node and express app references the frontend folder for static HTML pages.
- Will need to open the backend folder; there are no environment variables needed as we hardcoded everything (to make it easier to run and grade)

### Contributors

- Cameron Boydd
- Marcel Newman
- Diego Lopez
- Abrar Mian
- Cayden Renegar

# Book-A-Bite: D2 Design Document   

# 1.  Project Overview      

_We are creating a web application for restaurant reservations. We are trying to reduce the workload on restaurant hosts and servers by reducing the number of calls and paper writing that the hosts and servers would have to perform when customers want to schedule a reservation. This would also help customers as they can log on to check available times and then set a reservation, all without making a single phone call. This provides a better system for customers, and it saves restaurant employees time and, thus, money._

![](ReadMeReferences\Activity_diagram_Group12.png)

![](https://lh7-us.googleusercontent.com/Ke8oZRMiv2yDAXtk6vI42-iodCa0WRWpYXO-JswdSllZ4HsEv1J1ktLRnNbxNqV-iT5NzDR_hjrAZOAAgyuf1_4O73E9OjVITy4pOZBoTbjUG9LjlP4f6hGiLYdN33mlYot0bjvKYVXkcnJ0RG8ot0o)

# 2.  Architectural Overview       

_Our application will run off of a custom API back-end, running on node.js and express.js. Our front-end will consist of vanilla javascript, HTML and CSS. The frontend will make calls to the backend to call functions based on the user’s input. We originally wanted to try to create a React.js front-end, but based on the team’s varying experience in this technology we decided it was no longer feasible. So we scrapped React.js and decided to use vanilla languages, since this is what more team members were comfortable with._

# 2.1 Subsystem Architecture      

_Book-A-Bite Structure Layers:_

**_Presentation_**_: This layer shows all functionalities to the user in a clean layout with transparent navigation to each task. Works with the Database to showcase existing/non-existent users as well as availability of restaurants extracted from our continuously updated tables._

**_Data_**_: Keeps information on the user, all relevant information, and keeps track of table availability for each restaurant and the time slots for their tables. For our presentation, we have a hardcorded test establishment to use for booking._

![](https://lh7-us.googleusercontent.com/iRmcNO_Czhc5eAGZ7GksKucR6jykvniHJKVgeeXB0x3DBLGQJ8eGUt7MFkt32acMr3-2Oikd2iMHpKXxzwLp5JUmQJeetIAzljdd_CGpchZAAVRYcdvTIzyk3BnE7p2CR8kOfkZPOmHZcYwELmPaTfQ)

# 2.2   **_Deployment Architecture_**

![](https://lh7-us.googleusercontent.com/1gdXwrcESoRy26DNOBTQgzXmx_ABfTKn7VdJ-DCUxZhDvi00TxeOSqLsEesHlRl9jnNSfla0sdKgxwDtWvbbM93AqMFzj96J2YnZEYCUdUG0FXluGx3_sIrKV81qwf1Fn-YttoYy5v6RjGMGNhXCL1c)

_The client connects to the Book-A-Bite Website Application via HTTP. When data needs to be transferred or retrieved, the application is connected to our SQL Database so information can be quickly delivered._

# 2.3  Data Model

_For our data storage approach, we have opted for a relational database using SQL. This choice enables us to efficiently manage and query the required pieces of information throughout different reservations and users. Within the database, we have designed a schema comprising various tables that tend to organize Users (consumers AND restaurants host accounts) and the reservations that the aforementioned have made. Each table is structured to accommodate identifying user and scheduling information, ensuring clarity and adding security to said database. We focused on scalability due to our potential amount of usage, aiding to seamless integration with our application's functionality._

_Our tables (table name - column names):_

_Users - id, name, email, password, phone_number_

_Reservations - id, user_id, table_number, num_guests, datetime, name, email, phone_number, restaurant_

_Restaurant - id, name, email, password_

# 2.4  Global Control Flow            

_When creating the execution control of our system, we decided on a time-dependent model, particularly crucial when managing restaurant reservations within our application. This model operates on the premise that booking availability and scheduling are contingent upon specific time parameters, preventing users from experiencing conflicting table bookings with another that desired a similar experience. We implement algorithms and logic that consider factors such as reservation duration, peak hours, and restaurant capacity to optimize the booking process. Through time dependency, our system dynamically adjusts availability of tables/restaurants and allocates resources accordingly._

3   Detailed System Design

# 3.1 Static view 

![](https://lh7-us.googleusercontent.com/_gABM44CKw2jXM3iJjTM2_B5TcHelmTZAu5Cvb7_IMrh2qqZnLUBjleMP5oXeHX-nFGIoiUFIlnjvLSSV-SEZtUuTfFhjBjLKarH2vq72CIZyHcjQY5iEvrKbPXMQuSUolRAvK63S4Ez2rM-lr0YPpQ)

_The reservation/users controllers set up the functionality of creating a new account or booking into the database. The request is transferred through to the appropriate route, goes through validation, and then posted as a request._

# 3.2 Dynamic view        

![](https://lh7-us.googleusercontent.com/iwcII-whoHlDlDisB0dMk0KCtVCCm5HxQyJT3PGI_5n6h92vTy66pyGhvvKAVMdcEM6ix2zMMmJNjoWAFW9D8dolBcQJZRGj8VXO65yxyYwgDzG7-ggmGW0apibB6MRbXW2gBHD8ngOG5TTKegGgXq8)

_If the user is a customer, they will be able to login, access their home feed, and select a restaurant of their choice to reserve a table for. Once selected, they will be shown available time slots for the table, select their slot, and book a reservation. The reservation is posted, updated in our database, and once finished, out sms bot notifies the user the reservation has been booked._

_If the user is a restaurant host/staff, their home page will immediately show them current/upcoming reservations, so they can prepare their areas accordingly for the customer_.
