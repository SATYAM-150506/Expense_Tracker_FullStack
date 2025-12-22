# Data Flow Diagram - Sequence Style (Step-by-Step)

## Complete System Data Flow - Like Sequence Diagram

This diagram shows the step-by-step data flow through your Expense Tracker system, similar to the order management flow in your reference image.

```mermaid
%%{init: {'primaryColor': '#383854', 'primaryBorderColor': '#d3d3d3', 'lineColor': '#d3d3d3', 'textColor': '#d3d3d3', 'mainBkg': '#383854', 'secondBkg': '#383854', 'tertiaryColor': '#383854'}}%%
sequenceDiagram
    actor User as User (Frontend)
    participant React as React App
    participant Axios as HTTP Client
    participant Express as Express API
    participant Auth as Auth Middleware
    participant Service as Service Layer
    participant Mongoose as Mongoose ODM
    participant MongoDB as MongoDB

    User->>React: 1. Click "Add Expense"
    activate React
    
    React->>React: 2. Validate Form Data<br/>(Amount, Category, Date)
    note right of React: Client-side validation
    
    React->>Axios: 3. Prepare Request<br/>POST /api/expenses
    activate Axios
    
    Axios->>Axios: 4. Add JWT Token<br/>to Headers
    note right of Axios: Authorization: Bearer JWT
    
    Axios->>Express: 5. Send HTTP POST Request<br/>{ title, amount, category, date }
    deactivate Axios
    activate Express
    
    Express->>Express: 6. Parse Request Body<br/>(JSON Parsing)
    note right of Express: Extract expense data
    
    Express->>Auth: 7. Verify JWT Token<br/>& Extract User ID
    activate Auth
    
    Auth->>Auth: 8. Validate Token<br/>(Check expiration, signature)
    
    Auth->>Express: 9. Return User ID<br/>(If Valid)
    deactivate Auth
    
    Express->>Service: 10. Call Service Layer<br/>addExpense(userId, data)
    activate Service
    
    Service->>Service: 11. Validate Business Rules<br/>(Amount > 0, Valid Category)
    note right of Service: Server-side validation
    
    Service->>Mongoose: 12. Create Expense Document<br/>{userId, title, amount, category, date}
    activate Mongoose
    
    Mongoose->>Mongoose: 13. Apply Schema Validation<br/>(Type checking, constraints)
    
    Mongoose->>MongoDB: 14. Save Document<br/>db.expenses.insertOne()
    activate MongoDB
    
    MongoDB->>MongoDB: 15. Insert into Collection<br/>Generate _id (ObjectID)
    
    MongoDB->>Mongoose: 16. Return Document<br/>with _id & timestamps
    deactivate MongoDB
    
    Mongoose->>Service: 17. Return Created Expense<br/>with _id
    deactivate Mongoose
    
    Service->>Express: 18. Return Success Response<br/>{ expense, _id, createdAt }
    deactivate Service
    
    Express->>Express: 19. Format Response<br/>Status: 201 Created
    
    Express->>Axios: 20. Send HTTP Response<br/>JSON with Expense Data
    deactivate Express
    activate Axios
    
    Axios->>Axios: 21. Parse Response<br/>Status 201 OK
    
    Axios->>React: 22. Return Data to React<br/>{ expense, status }
    deactivate Axios
    activate React
    
    React->>React: 23. Update Context State<br/>Add expense to array
    
    React->>React: 24. Clear Form Fields<br/>(Reset form)
    
    React->>User: 25. Update UI<br/>Show new expense in list<br/>Display success message
    deactivate React
    
    note over User,MongoDB: ✅ Expense Added Successfully
```

---

## User Login Flow - Step by Step

```mermaid
%%{init: {'primaryColor': '#383854', 'primaryBorderColor': '#d3d3d3', 'lineColor': '#d3d3d3'}}%%
sequenceDiagram
    actor User as User (Frontend)
    participant React as React App
    participant Axios as HTTP Client
    participant Express as Express API
    participant Service as Auth Service
    participant MongoDB as MongoDB
    participant Storage as Local Storage

    User->>React: 1. Enter Email & Password
    activate React
    
    React->>React: 2. Validate Input<br/>(Email format, Password)
    
    React->>Axios: 3. Prepare POST Request<br/>/api/auth/login
    activate Axios
    
    Axios->>Express: 4. Send Credentials<br/>{ email, password }
    deactivate Axios
    activate Express
    
    Express->>Express: 5. Parse Request<br/>Extract email & password
    
    Express->>Service: 6. Call Auth Service<br/>login(email, password)
    activate Service
    
    Service->>MongoDB: 7. Find User by Email<br/>db.users.findOne({email})
    activate MongoDB
    
    MongoDB->>Service: 8. Return User Document<br/>{ _id, email, password_hash }
    deactivate MongoDB
    
    Service->>Service: 9. Compare Passwords<br/>bcryptjs.compare()
    
    alt Password Match
        Service->>Service: 10a. Generate JWT Token<br/>Expires: 30 days
        Service->>Express: 10b. Return Token & User Data
    else Password Mismatch
        Service->>Express: 10c. Return Error<br/>Invalid credentials
    end
    deactivate Service
    
    Express->>Express: 11. Format Response<br/>Status: 200 OK or 401
    
    Express->>Axios: 12. Send Response<br/>{ token, user, status }
    deactivate Express
    activate Axios
    
    Axios->>React: 13. Return Data to React
    deactivate Axios
    activate React
    
    React->>Storage: 14. Store JWT Token<br/>localStorage.setItem('token', jwt)
    
    React->>React: 15. Update Auth Context<br/>isAuthenticated = true
    
    React->>User: 16. Redirect to Dashboard<br/>Show Welcome Message
    deactivate React
    
    note over User,Storage: ✅ User Logged In Successfully
```

---

## Fetch All Expenses Flow - Step by Step

```mermaid
%%{init: {'primaryColor': '#383854', 'primaryBorderColor': '#d3d3d3', 'lineColor': '#d3d3d3'}}%%
sequenceDiagram
    actor User as User (Frontend)
    participant React as React App
    participant Axios as HTTP Client
    participant Express as Express API
    participant Auth as Auth Middleware
    participant Service as Service Layer
    participant MongoDB as MongoDB

    User->>React: 1. Navigate to All Expenses
    activate React
    
    React->>React: 2. Trigger useEffect<br/>Fetch expenses on mount
    
    React->>Axios: 3. Prepare GET Request<br/>/api/expenses
    activate Axios
    
    Axios->>Axios: 4. Retrieve JWT from<br/>localStorage
    
    Axios->>Express: 5. Send GET Request<br/>Headers: { Authorization: Bearer JWT }
    deactivate Axios
    activate Express
    
    Express->>Auth: 6. Extract & Verify JWT<br/>from Header
    activate Auth
    
    Auth->>Auth: 7. Validate Token<br/>(Signature, Expiration)
    
    Auth->>Express: 8. Extract User ID<br/>from JWT payload
    deactivate Auth
    
    Express->>Service: 9. Call Service Layer<br/>getExpenses(userId)
    activate Service
    
    Service->>Service: 10. Build Query<br/>{ userId: user_id }
    
    Service->>Service: 11. Apply Sorting<br/>Sort by date DESC
    
    Service->>MongoDB: 12. Execute Query<br/>db.expenses.find({userId}).sort()
    activate MongoDB
    
    MongoDB->>MongoDB: 13. Use Index<br/>(userId, date)<br/>for fast lookup
    
    MongoDB->>MongoDB: 14. Return Cursor<br/>Fetch all matching documents
    
    MongoDB->>Service: 15. Return Expenses Array<br/>[ { expense1 }, { expense2 }, ... ]
    deactivate MongoDB
    
    Service->>Express: 16. Format Response<br/>{ expenses: [...], count: N }
    deactivate Service
    
    Express->>Express: 17. Set Status: 200 OK
    
    Express->>Axios: 18. Send HTTP Response<br/>JSON Array of Expenses
    deactivate Express
    activate Axios
    
    Axios->>Axios: 19. Parse JSON<br/>Convert to JavaScript
    
    Axios->>React: 20. Return Expenses Data<br/>{ expenses: [...] }
    deactivate Axios
    activate React
    
    React->>React: 21. Update Context State<br/>expenses = [ ... ]
    
    React->>React: 22. Trigger Re-render<br/>Component receives new props
    
    React->>User: 23. Display Expense List<br/>Show all expenses<br/>Calculate totals
    deactivate React
    
    note over User,MongoDB: ✅ Expenses Retrieved & Displayed
```

---

## Update Expense Flow - Step by Step

```mermaid
%%{init: {'primaryColor': '#383854', 'primaryBorderColor': '#d3d3d3', 'lineColor': '#d3d3d3'}}%%
sequenceDiagram
    actor User as User (Frontend)
    participant React as React App
    participant Axios as HTTP Client
    participant Express as Express API
    participant Auth as Auth Middleware
    participant Service as Service Layer
    participant MongoDB as MongoDB

    User->>React: 1. Click Edit Expense
    activate React
    
    React->>React: 2. Load Expense Data<br/>into Edit Form
    note right of React: Populate form fields
    
    User->>React: 3. Modify Fields<br/>(Amount, Category, etc)
    
    React->>React: 4. Validate New Data<br/>Client-side checks
    
    React->>Axios: 5. Prepare PUT Request<br/>PUT /api/expenses/:id
    activate Axios
    
    Axios->>Axios: 6. Add JWT Token<br/>to Headers
    
    Axios->>Express: 7. Send Request<br/>{ newTitle, newAmount, newCategory }
    deactivate Axios
    activate Express
    
    Express->>Express: 8. Parse Request<br/>Extract expense ID & new data
    
    Express->>Auth: 9. Verify JWT Token<br/>& Get User ID
    activate Auth
    Auth->>Express: Return User ID
    deactivate Auth
    
    Express->>Service: 10. Call Service Layer<br/>updateExpense(expenseId, userId, data)
    activate Service
    
    Service->>MongoDB: 11. Find Expense<br/>db.expenses.findById(expenseId)
    activate MongoDB
    
    MongoDB->>Service: 12. Return Expense Document<br/>{ userId, title, amount, ... }
    
    Service->>Service: 13. Check Ownership<br/>Verify userId matches
    
    alt Ownership Verified
        Service->>Service: 14a. Validate New Data<br/>Server-side checks
        Service->>MongoDB: 14b. Update Document<br/>db.expenses.updateOne()
        MongoDB->>Service: 14c. Return Updated Expense
    else Ownership Failed
        Service->>Express: Return Error 403<br/>Forbidden
    end
    deactivate MongoDB
    
    Service->>Express: 15. Return Updated Expense<br/>with all fields
    deactivate Service
    
    Express->>Express: 16. Format Response<br/>Status: 200 OK
    
    Express->>Axios: 17. Send HTTP Response<br/>Updated Expense Data
    deactivate Express
    activate Axios
    
    Axios->>React: 18. Return Updated Data<br/>to React
    deactivate Axios
    activate React
    
    React->>React: 19. Update Context State<br/>Find & replace expense
    
    React->>React: 20. Clear Edit Form<br/>Close modal
    
    React->>User: 21. Update UI<br/>Show updated expense<br/>Display success message
    deactivate React
    
    note over User,MongoDB: ✅ Expense Updated Successfully
```

---

## Delete Expense Flow - Step by Step

```mermaid
%%{init: {'primaryColor': '#383854', 'primaryBorderColor': '#d3d3d3', 'lineColor': '#d3d3d3'}}%%
sequenceDiagram
    actor User as User (Frontend)
    participant React as React App
    participant Axios as HTTP Client
    participant Express as Express API
    participant Auth as Auth Middleware
    participant Service as Service Layer
    participant MongoDB as MongoDB

    User->>React: 1. Click Delete Button
    activate React
    
    React->>React: 2. Show Confirmation<br/>Dialog/Modal
    
    User->>React: 3. Confirm Deletion
    
    React->>Axios: 4. Prepare DELETE Request<br/>DELETE /api/expenses/:id
    activate Axios
    
    Axios->>Axios: 5. Add JWT Token<br/>to Headers
    
    Axios->>Express: 6. Send DELETE Request<br/>Expense ID in URL
    deactivate Axios
    activate Express
    
    Express->>Express: 7. Parse Request<br/>Extract expense ID
    
    Express->>Auth: 8. Verify JWT Token<br/>& Get User ID
    activate Auth
    Auth->>Express: Return User ID
    deactivate Auth
    
    Express->>Service: 9. Call Service Layer<br/>deleteExpense(expenseId, userId)
    activate Service
    
    Service->>MongoDB: 10. Find Expense<br/>db.expenses.findById(expenseId)
    activate MongoDB
    
    MongoDB->>Service: 11. Return Expense<br/>{ userId, ... }
    
    Service->>Service: 12. Verify Ownership<br/>Check userId match
    
    alt Owner Verified
        Service->>MongoDB: 13a. Delete Document<br/>db.expenses.deleteOne()
        MongoDB->>Service: 13b. Confirm Deletion
    else Not Owner
        Service->>Express: Return Error 403
    end
    deactivate MongoDB
    
    Service->>Express: 14. Return Success Status
    deactivate Service
    
    Express->>Express: 15. Format Response<br/>Status: 200 OK
    
    Express->>Axios: 16. Send HTTP Response<br/>{ message: "Deleted" }
    deactivate Express
    activate Axios
    
    Axios->>React: 17. Return Success Response
    deactivate Axios
    activate React
    
    React->>React: 18. Update Context State<br/>Remove expense from array
    
    React->>React: 19. Close Confirmation Dialog
    
    React->>User: 20. Update UI<br/>Remove from list<br/>Display success message
    deactivate React
    
    note over User,MongoDB: ✅ Expense Deleted Successfully
```

---

## Fetch Statistics Flow - Step by Step

```mermaid
%%{init: {'primaryColor': '#383854', 'primaryBorderColor': '#d3d3d3', 'lineColor': '#d3d3d3'}}%%
sequenceDiagram
    actor User as User (Frontend)
    participant React as React App
    participant Axios as HTTP Client
    participant Express as Express API
    participant Auth as Auth Middleware
    participant Service as Service Layer
    participant MongoDB as MongoDB

    User->>React: 1. Navigate to Dashboard
    activate React
    
    React->>React: 2. useEffect Hook<br/>Fetch statistics
    
    React->>Axios: 3. Prepare GET Request<br/>/api/expenses/stats/summary
    activate Axios
    
    Axios->>Axios: 4. Retrieve JWT<br/>from localStorage
    
    Axios->>Express: 5. Send GET Request<br/>Headers: { Authorization: Bearer JWT }
    deactivate Axios
    activate Express
    
    Express->>Auth: 6. Verify JWT Token<br/>Extract User ID
    activate Auth
    Auth->>Express: Return User ID
    deactivate Auth
    
    Express->>Service: 7. Call Service Layer<br/>getStatistics(userId)
    activate Service
    
    Service->>Service: 8. Build Aggregation Pipeline
    note right of Service: $match, $group, $sum, $sort
    
    Service->>MongoDB: 9. Execute Aggregation<br/>db.expenses.aggregate(pipeline)
    activate MongoDB
    
    MongoDB->>MongoDB: 10. Stage 1: Match<br/>Filter by userId
    
    MongoDB->>MongoDB: 11. Stage 2: Group by Category<br/>Aggregate totals
    
    MongoDB->>MongoDB: 12. Stage 3: Sum Amounts<br/>Calculate category totals
    
    MongoDB->>MongoDB: 13. Stage 4: Sort<br/>Sort by total DESC
    
    MongoDB->>Service: 14. Return Aggregated Results<br/>{ category, total, count }
    deactivate MongoDB
    
    Service->>Service: 15. Calculate Additional Stats<br/>Total amount, Average, Count
    
    Service->>Express: 16. Return Stats Object<br/>{ total, average, byCategory }
    deactivate Service
    
    Express->>Express: 17. Format Response<br/>Status: 200 OK
    
    Express->>Axios: 18. Send HTTP Response<br/>JSON with all statistics
    deactivate Express
    activate Axios
    
    Axios->>React: 19. Return Stats Data<br/>to React
    deactivate Axios
    activate React
    
    React->>React: 20. Update Context State<br/>stats = { ... }
    
    React->>React: 21. Trigger Re-render<br/>Component receives new props
    
    React->>User: 22. Display Dashboard<br/>Show stat cards<br/>Display charts/graphs
    deactivate React
    
    note over User,MongoDB: ✅ Statistics Displayed Successfully
```

---

## Key Points

### Request Flow (Client → Server → Database)
✅ User action triggered
✅ Client-side validation
✅ Add JWT token to headers
✅ Send HTTP request
✅ Server receives & parses
✅ Middleware validates JWT
✅ Service layer processes
✅ Database operation executed
✅ Response formatted
✅ Sent back to client

### Response Flow (Database → Server → Client)
✅ Database returns results
✅ Mongoose formats data
✅ Service processes results
✅ Middleware adds response headers
✅ Express sends HTTP response
✅ Axios parses response
✅ React updates state
✅ Component re-renders
✅ UI updated for user

### Error Handling at Each Step
✅ **Client**: Form validation errors
✅ **Axios**: Network errors, timeouts
✅ **Middleware**: JWT verification failures
✅ **Service**: Business logic validation
✅ **Database**: Query execution errors

---

## Color Scheme Reference
- **Background**: #383854 (Deep Navy/Purple)
- **Borders/Text**: #d3d3d3 (Light Gray)
- **Boxes**: #e8e8e8 (Light Gray)
- **Text**: #383854 (Dark Navy)
