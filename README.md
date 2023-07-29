# delta-web-3
This is my **latest code**(most recent version) for Task 3 of the Delta Inductions 2023 (Web development)

# Objectives
## Normal Mode (Completed ✅)
Refer [Normal Mode Branch](https://github.com/Arjun-G-04/delta-web-3/tree/normal)

## Hacker Mode (In Progress 🛠️)
Refer [Hacker Mode Branch](https://github.com/Arjun-G-04/delta-web-3/tree/hacker)

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