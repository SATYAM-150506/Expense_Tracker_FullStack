# HIGH-LEVEL DESIGN (HLD) - EXPENSE TRACKER

## System Architecture Overview

ExpenseTracker is a cloud-based MERN stack application for personal expense management. The system consists of three main layers: Client (React), Server (Express.js), and Database (MongoDB).

---

## System Components & Data Flow

### Component 1: Client Layer (React Frontend)
**Technology:** React 18 + Tailwind CSS + Axios

**Responsibilities:**
- User Interface (Login, Register, Dashboard, Expense List, Expense Detail)
- State Management (Context API for authentication)
- Form Validation (client-side)
- Real-time UI updates
- Local Storage (store JWT token)

**Key Features:**
- Responsive design (mobile, tablet, desktop)
- Animated transitions
- Dynamic filtering and sorting
- Error notifications

---

### Component 2: API Gateway Layer (Express.js Server)
**Technology:** Express.js 4.18.2, Node.js v14+
**Port:** 5000

**Responsibilities:**
- Route HTTP requests (/api/auth, /api/expenses)
- CORS middleware handling
- Request body parsing (JSON)
- JWT token authentication
- Centralized error handling
- Request validation

**Middleware Stack:**
1. CORS - Allow frontend requests
2. Body Parser - Parse JSON
3. Authentication - Verify JWT tokens
4. Error Handler - Global error processing
5. Logging - Request tracking (future)

---

### Component 3: Service Layer (Business Logic)
**Technology:** Express routes with validation

**Services:**

**A. Authentication Service**
- Endpoints: POST /api/auth/register, POST /api/auth/login, GET /api/auth/profile
- Operations: Password hashing (bcryptjs), JWT generation, credential verification
- Security: Input validation, secure password storage

**B. Expense Service**
- Endpoints: GET/POST/PUT/DELETE /api/expenses, GET /api/expenses/:id
- Operations: CRUD operations, filtering, sorting, user authorization
- Validation: Amount > 0, valid category, date validation

**C. Analytics Service**
- Endpoint: GET /api/expenses/stats/summary
- Operations: Aggregation pipeline, calculations (total, average, category breakdown)
- Real-time computation of statistics

---

### Component 4: Data Access Layer (Mongoose ODM)
**Technology:** Mongoose 7.5.0

**Models:**

**User Model**
- Fields: _id, name, email, password (hashed), createdAt, updatedAt
- Indexes: email (unique), createdAt
- Methods: Password hashing, password comparison

**Expense Model**
- Fields: _id, user (ref), title, amount, category, description, date, createdAt, updatedAt
- Indexes: user+date (composite), user+category (composite), user
- Validation: Required fields, amount range, category enum (9 types)

---

### Component 5: Database Layer (MongoDB)
**Technology:** MongoDB

**Collections:**
- **Users:** Store user credentials (encrypted passwords)
- **Expenses:** Store all user expenses with relationships

**Features:**
- ACID compliance
- Automatic timestamp management
- Indexed queries for performance
- Connection pooling

---

### Component 6: Security Layer
**Technology:** JWT + bcryptjs

**Security Features:**
- JWT tokens (30-day expiration)
- Password hashing (bcryptjs, 10 salt rounds)
- User ownership verification
- CORS whitelist validation
- Input validation (server + client)
- SQL injection prevention (Mongoose ORM)

---

### Component 7: Caching Layer (Future)
**Technology:** Redis (planned)
- Cache analytics computations
- Session management
- Rate limiting counters

---

## Data Flow Diagrams

### Flow 1: User Registration
```
User Registration Form → Client Validation → POST /api/auth/register 
→ Server Validation → Check Email Exists → Hash Password (bcryptjs) 
→ Save User to MongoDB → Generate JWT Token → Return Token 
→ Store in localStorage → Redirect to Dashboard
```

### Flow 2: User Login
```
Login Form Input → Client Validation → POST /api/auth/login 
→ Query User by Email → Compare Password → Password Match? 
→ YES: Generate JWT → Return Token → Store Token → Redirect Dashboard
→ NO: Return 401 Error → Show Error Message
```

### Flow 3: Create Expense
```
Expense Form Input → Client Validation → POST /api/expenses 
→ JWT Authorization Check → Extract User ID → Server Validation 
→ Create Expense Document (MongoDB) → Return Response 
→ Update UI → Fetch Statistics → Display Success
```

### Flow 4: Get Expenses List
```
Dashboard Load → GET /api/expenses (with filters) → JWT Authorization 
→ Build Query (user, category, date range) → MongoDB Query with Indexes 
→ Sort & Paginate → Return Expense Array → React Render List
```

### Flow 5: Get Analytics/Statistics
```
Dashboard Load → GET /api/expenses/stats/summary → JWT Authorization 
→ MongoDB Aggregation Pipeline → Calculate Metrics (total, average, category breakdown) 
→ Return Statistics JSON → React Display Cards & Charts
```

### Flow 6: Update Expense
```
Click Edit → Load Form with Data → Edit Fields → PUT /api/expenses/:id 
→ JWT Authorization → Verify User Ownership → Server Validation 
→ Update MongoDB Document → Return Updated Data → Update UI
```

### Flow 7: Delete Expense
```
Click Delete → Confirmation Dialog → Confirm → DELETE /api/expenses/:id 
→ JWT Authorization → Verify User Ownership → Delete from MongoDB 
→ Remove from UI → Refresh Statistics → Show Success
```

---

## Component Interaction Matrix

| Component | Interacts With | Type | Purpose |
|---|---|---|---|
| React UI | Express API | HTTP REST | Send requests, receive JSON |
| Express Server | MongoDB | Mongoose Driver | CRUD operations |
| Express Server | JWT | Cryptographic Lib | Token generation/validation |
| Express Server | bcryptjs | Hashing Lib | Password encryption |
| React Frontend | localStorage | Browser API | Store JWT token |
| React Frontend | axios | HTTP Client | Make API calls |
| React Frontend | Context API | State Mgmt | Global auth state |
| MongoDB | Mongoose Models | ORM | Schema definition |

---

## System Architecture Layers

```
┌──────────────────────────────────────────────────────┐
│ PRESENTATION LAYER (React 18)                        │
│ - Pages: Login, Register, Dashboard, Expense Detail  │
│ - Components: Forms, Cards, Charts                   │
│ - State: Context API (Authentication)                │
└──────────────────┬───────────────────────────────────┘
                   │ HTTP/REST API (Axios)
┌──────────────────▼───────────────────────────────────┐
│ API GATEWAY LAYER (Express.js)                       │
│ - CORS, Authentication Middleware                    │
│ - Route Management, Error Handling                   │
│ - Request Validation                                 │
└──────────────────┬───────────────────────────────────┘
                   │ Service Calls
┌──────────────────▼───────────────────────────────────┐
│ SERVICE LAYER (Business Logic)                       │
│ - Auth Service, Expense Service, Analytics Service  │
│ - Validation, Authorization, Data Processing        │
└──────────────────┬───────────────────────────────────┘
                   │ Database Queries
┌──────────────────▼───────────────────────────────────┐
│ DATA ACCESS LAYER (Mongoose ODM)                     │
│ - User Model, Expense Model                          │
│ - Query Builders, Aggregation Pipeline               │
└──────────────────┬───────────────────────────────────┘
                   │ Database Operations
┌──────────────────▼───────────────────────────────────┐
│ DATABASE LAYER (MongoDB)                             │
│ - Users Collection, Expenses Collection              │
│ - Indexes, Relationships, Aggregation                │
└──────────────────────────────────────────────────────┘
```

---

## External Integrations

### Current
- None

### Planned (Future)
- **Banking APIs:** Transaction import (Plaid)
- **Payment Gateway:** Stripe (subscriptions)
- **Email Service:** SendGrid (notifications)
- **Cloud Storage:** AWS S3 (export backup)
- **Analytics:** Google Analytics (usage tracking)

---

## Performance Optimizations

### Frontend
- Code splitting and lazy loading
- Minification and compression
- Browser caching for static assets

### Backend
- Database indexing (user+date, user+category)
- Connection pooling
- Query optimization with aggregation
- Response compression

### Database
- Composite indexes on frequently queried fields
- Efficient Mongoose schema design
- Data archiving for old expenses (future)

---

## Security Architecture

### Authentication
- JWT tokens with 30-day expiration
- Stateless authentication
- Secure token storage (localStorage)

### Authorization
- User ownership verification
- Role-based access control (future)

### Data Protection
- Password hashing (bcryptjs, 10 rounds)
- HTTPS/TLS (production)
- CORS configuration
- Input validation (server + client)

---

## Scalability Approach

### Current
- Single Express server instance
- Stateless application design
- Database indexing

### Future
- Horizontal scaling (load balancer)
- Redis caching layer
- Database sharding (MongoDB)
- CDN for static assets
- Microservices architecture (optional)

---

## Deployment Architecture

### Development
- Frontend: localhost:3000 (React Dev Server)
- Backend: localhost:5000 (Node.js)
- Database: Local MongoDB

### Production (Future)
- Frontend: CDN (Vercel, Netlify)
- Backend: Cloud Platform (AWS EC2, Heroku)
- Database: MongoDB Atlas (managed)
- Load Balancer: NGINX
- SSL: Let's Encrypt

---

## Key Metrics & SLAs

| Metric | Target |
|---|---|
| API Response Time | < 200ms |
| Dashboard Load Time | < 2 seconds |
| System Uptime | 99.9% |
| Concurrent Users | 10,000+ |
| Database Query Time | < 100ms |
| Page Load Time | < 3 seconds |

---

## Technology Stack Summary

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 18.2.0 |
| Styling | Tailwind CSS | 3.4.17 |
| HTTP Client | Axios | 1.5.0 |
| Routing | React Router | 6.15.0 |
| State Mgmt | Context API | Native |
| Backend | Express.js | 4.18.2 |
| Runtime | Node.js | v14+ |
| Database | MongoDB | Latest |
| ORM | Mongoose | 7.5.0 |
| Auth | JWT | 9.0.2 |
| Hashing | bcryptjs | 2.4.3 |
| Validation | express-validator | 7.0.1 |

---

## System Capabilities

✅ User authentication (register, login, profile)
✅ Expense CRUD operations (create, read, update, delete)
✅ Expense filtering (category, date range)
✅ Advanced search and sorting
✅ Real-time analytics (total, average, category breakdown)
✅ Responsive design (mobile, tablet, desktop)
✅ Secure data storage and transmission
✅ Input validation (client + server)
✅ Error handling and user notifications
✅ JWT-based authentication
✅ Password encryption with bcryptjs
✅ Database indexing for performance

---

## Future Enhancements

🔜 Admin dashboard (Q1 2026)
🔜 Custom expense categories
🔜 Budget management and alerts
🔜 Recurring expense templates
🔜 Banking API integration
🔜 AI-powered categorization
🔜 Predictive analytics
🔜 Family/group expense sharing
🔜 Mobile app (iOS/Android)
🔜 Multi-language support
🔜 Dark mode theme
🔜 Export to PDF/Excel

---

## Conclusion

ExpenseTracker follows a **clean, modular, three-tier architecture** with clear separation of concerns. The system is designed for **scalability, security, and performance**, with a strong foundation for future enhancements and integrations.

**Design Principles:**
- ✅ Stateless API (horizontal scalability)
- ✅ Secure by default (JWT, bcryptjs, input validation)
- ✅ Database indexing for performance
- ✅ User data isolation and ownership verification
- ✅ Responsive and intuitive UI
- ✅ RESTful API design
- ✅ Error handling and logging
- ✅ Future-proof architecture

---

**Document Version:** 1.0  
**Date:** November 8, 2025  
**Status:** Final
