# Goeazymart (GEM) Spring Boot Backend

Enterprise RESTful API backend for Goeazymart Global B2B & Retail Marketplace.

## Features
- **Decoupled Architecture**: Strictly separated from the Vite + React frontend.
- **REST Endpoints**:
  - `GET /api/products` & `POST /api/products`: Full catalog management.
  - `POST /api/auth/login` & `POST /api/auth/register`: Authentication & user role tokens.
  - `GET /api/orders` & `POST /api/orders`: Order placement & status updates.
  - `GET /api/rfqs` & `POST /api/rfqs`: Tender quotes and bulk bidding.
  - `GET /api/admin/stats`, `GET /api/admin/users`, `GET /api/admin/disputes`: Platform governance.
- **CORS Configured**: Pre-configured to accept requests from frontend on `http://localhost:5173`.
- **Pre-seeded In-Memory Store**: Seeded with verified mills, wholesale commodities, and retail products.

## Prerequisites
- Java 17+ installed (`java -version`)
- Maven 3.8+ (or open project directly in IntelliJ IDEA / VS Code with Java Extension Pack / Eclipse)

## How to Run
In this directory (`backend`):
```bash
# Using standard Maven
mvn clean spring-boot:run

# Or in an IDE (IntelliJ IDEA / Eclipse / VS Code)
# Simply open the 'backend' folder and run `com.goeazymart.GemMarketplaceApplication`
```

The server starts on port `8080`.
Live endpoints:
- Products: `http://localhost:8080/api/products`
- Orders: `http://localhost:8080/api/orders`
- RFQs: `http://localhost:8080/api/rfqs`
