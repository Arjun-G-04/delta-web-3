# delta-web-3
This is my code for Task 3 of Delta Inductions 2023 (Web development)

# Objectives
## Normal Mode
- ~Authentication system allowing registration and log in~
- ~Users can create quizzes~
- ~Search bar allowing to search for other users~
- ~Profile page of users - Should have method to take up their quizzes~
- Allow users to see scores of quizzes they have taken

# Setup
### 1. Clone the repository
Clone the **main** branch of this repo into your folder

### 2. Install MySQL
Follow the guide [here](https://www.simplilearn.com/tutorials/mysql-tutorial/mysql-workbench-installation)

### 3. Open local instance in MySQL
Inside MySQL Workbench, open the default local instance

### 4. Create quizdb
Create database **quizdb** in this local instance of MySQL

### 4. Configure database in config.json
Navigate to server > config > config.json

Inside the development options, change the values according to your MySQL configurations (username and password)

### 5. Open seperate terminals for client and react folders
From the main repo folder, cd client and cd react in different terminals

### 6. Create .env files for both the folders
Server side
```
JWT_SECRET=<some random string>
```

Client side
```
REACT_APP_BASE_URL=http://localhost:3001
```
URL would vary if hosted the server on different IP or port. By default, this is the URL for development phase

### 7. Run server
Update the modules inside **server terminal** using
```
npm update
```

Run the server inside **server terminal** using
```
npm run dev
```

### 8. Run client
Update the modules inside **client terminal** using
```
npm update
```

Run the server inside **client terminal** using
```
npm run dev
```

### Voila! The web app is up and running!!

In the future, you can simply run the
```
npm run dev
```
command for both client and server after every new version!