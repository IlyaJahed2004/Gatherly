# Gatherly - Social Event Network

A modern, high-performance web application designed for organizing and discovering social events. This project is built using a **Clean Architecture** approach with **.NET 10** for the backend and **React 19** for the frontend.

---

## 🚀 Phase 1: Backend Infrastructure & Database Setup

In this initial phase, the core focus was on establishing a robust foundation for data management and API communication.

### 🏗 Architecture Highlights
*   **Clean Architecture:** Strict separation of concerns across `Domain`, `Persistence`, and `API` projects.
*   **Entity Framework Core:** Used as the Object-Relational Mapper (ORM) with **SQLite** for efficient data storage.
*   **Async/Await Pattern:** Fully implemented across all database operations to ensure high scalability and non-blocking I/O.

### 🛠 Key Technical Implementations

#### 1. Database Management & Seeding
*   **Dynamic Scoping:** Implemented a manual `IServiceScope` in `Program.cs` to handle database migrations and seeding at startup. This ensures the environment is ready before the application starts listening for requests.
*   **Automated Migrations:** The system automatically applies schema changes using `context.Database.MigrateAsync()`.
*   **Data Seeding:** A `DbInitializer` class populates the database with sample **events**, utilizing existence checks (`Any()`) to prevent duplicates.

#### 2. API Design & Controllers
*   **BaseApiController:** A centralized base class with `[ApiController]` and `[Route]` attributes to enforce **DRY (Don't Repeat Yourself)** principles.
*   **Primary Constructors:** Leveraged C# 12's Primary Constructors in `EventsController` for clean and modern Dependency Injection (DI).
*   **ActionResult Management:** Used `ActionResult<T>` to return both data and standard HTTP status codes (200 OK, 404 Not Found).

---

### 🔄 Execution & Dependency Injection Flow

To ensure the application is reliable and the database is always ready, the following flow is executed during the startup and request lifecycle:

#### 1. Startup & Initialization Phase (Pre-Run)
*   **Service Registration:** `GatherlyDbContext` is registered in the DI Container. .NET creates a **Configuration Blueprint** specifying the SQLite provider and connection string.
*   **Manual Scope Creation:** A temporary `IServiceScope` is created to access 'Scoped' services before the app starts.
*   **Dependency Resolution:** 
    1. The DI container constructs the `DbContextOptions`.
    2. It injects these options into the `GatherlyDbContext` constructor.
    3. It returns a live `context` object to be used for migrations and seeding.
*   **Disposal:** Once finished, the temporary scope is disposed of, clearing resources from RAM before `app.Run()`.

#### 2. Request Lifecycle (Runtime)
*   **Controller Activation:** When a user calls an endpoint (e.g., `GET /api/events`), the framework identifies the `EventsController`.
*   **Constructor Injection:** The DI container automatically injects a new instance of `GatherlyDbContext` into the controller's **Primary Constructor**.
*   **Scoped Instance:** A new database context is created specifically for **this unique web request** and is destroyed once the response is sent to ensure zero memory leaks.

---

### 📂 Database Structure (SQLite)
*   **WAL Mode (Write-Ahead Logging):** SQLite uses `-wal` and `-shm` files to allow concurrent read/write operations without locking the database, ensuring a smooth user experience.

### 💻 Technologies Used
*   **.NET 10 Web API**
*   **Entity Framework Core**
*   **SQLite**
*   **C# 12/13 Features** (Primary Constructors, File-scoped namespaces)

---

## 🚦 Getting Started

### How to Run
1.  Navigate to the `API` project directory: `cd API`
2.  Run the application: `dotnet watch`
3.  The database (`Gatherly.db`) will be automatically created and seeded on the first run.
4.  Test the endpoints via the provided **Postman Collection** in the `.postman/` folder.

---

## 📈 Project Status
- [x] **Phase 1:** Backend Infrastructure, SQLite Integration, and **Event** Seed Data.
- [ ] **Phase 2:** React 19 Frontend Integration & API Consumption.
- [ ] **Phase 3:** Identity, Authentication, and Social Features (Chat System).