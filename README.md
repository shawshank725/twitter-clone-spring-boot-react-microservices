# Twitter Clone Backend & Frontend

> **🚧 Status:** This project is currently in active development. Some features are incomplete or may change, and additional improvements are planned.

This is a microservices-based Twitter clone built with **Spring Boot**, **React**, **MySQL**, **WebSockets**, **Consul** for service discovery, and other modern tools.  
It includes multiple backend services and a frontend application.

---

## 🚀 Tech Stack
- **Backend**: Spring Boot, MySQL, WebSockets, Consul
- **Frontend**: React, Vite, TanStack Query
- **Service Discovery**: HashiCorp Consul
- **Database**: MySQL

---

## 📦 Project Structure
```
backend/
  posting-service/
  authentication-service/
  notification-service/
  config-service/
  gateway-service/
  connection-service/
  config-repo/
  media-service/
frontend/
```

---

## 🛠 Setup & Running Instructions

### 1️⃣ Start Consul Server
1. **Open Command Prompt as Administrator**
2. Get your local IP:
   ```bash
   ipconfig
   ```
3. Run the Consul server (replace `youripaddress` with your IP):
   ```bash
   consul agent -server -bootstrap-expect=1 -data-dir=consul-data -ui -bind=youripaddress
   ```
4. Visit:
   ```
   http://localhost:8500
   ```
   to check your services’ health.
5. Go to config-repo folder and use the command *git init* 
---

### 2️⃣ Start Backend Services
**Important:** Start these in order:
1. **Config Service**
2. **Gateway Service**
3. Any other microservice (`posting-service`, `authentication-service`, `notification-service`, etc.)

💡 Each service folder contains the **SQL queries** needed to create its database schema in MySQL.

---

### 3️⃣ Start Frontend
```bash
cd frontend
npm install
npm run dev
```
The app should now be running locally.

---

## 📂 Database Setup
- Ensure MySQL is running.
- Execute the SQL scripts found inside each service folder before starting the backend.

---

## 📜 License
This project is licensed under **All Rights Reserved**.  
See [LICENSE](./LICENSE) for details.

---

## 👤 Author
**Shashank Verma**  
Original Creator of this Twitter Clone Project.
