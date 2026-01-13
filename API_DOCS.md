# 📡 PlayStock Dashboard API Documentation

This document references all backend API endpoints integrated into the frontend application.

> **Base URL:** Defined in `.env` (e.g., `VITE_API_BASE_URL`)
> **Wrapper:** All responses are wrapped in `ApiResponse<T>`
> ```ts
> {
>   data: T;
>   isSuccess: boolean;
>   code: number;
>   message: string;
> }
> ```

---

## 🔐 Auth

| Method | Endpoint | Description | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | User login | `LoginRequest` | `LoginResponse` |
| `POST` | `/auth/refresh` | Refresh access token | `RefreshTokenRequest` | `TokenResponse` |
| `POST` | `/auth/logout` | Logout user | - | - |

---

## 👤 Users

| Method | Endpoint | Description | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/users/me` | Get current user profile | - | `User` |

---

## 🏪 Stores

| Method | Endpoint | Description | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/stores` | Get all stores | - | `Store[]` |
| `GET` | `/stores/me` | Get current user's store | - | `Store` |
| `GET` | `/stores/:id` | Get store by ID | - | `Store` |
| `POST` | `/stores` | Create a new store | `CreateStoreRequest` | `Store` |
| `PUT` | `/stores/:id` | Update a store | `UpdateStoreRequest` | `Store` |

---

## 🏢 Outlets

| Method | Endpoint | Description | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/outlets` | Get all outlets | - | `Outlet[]` |
| `GET` | `/outlets/:id` | Get outlet by ID | - | `Outlet` |
| `POST` | `/outlets` | Create outlet | `CreateOutletRequest` | `Outlet` |
| `PUT` | `/outlets/:id` | Update outlet | `UpdateOutletRequest` | `Outlet` |

---

## 📦 Vendors

| Method | Endpoint | Description | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/vendors` | Get all vendors | - | `Vendor[]` |
| `GET` | `/vendors/:id` | Get vendor by ID | - | `Vendor` |
| `POST` | `/vendors` | Create vendor | `CreateVendorRequest` | `Vendor` |
| `PUT` | `/vendors/:id` | Update vendor | `UpdateVendorRequest` | `Vendor` |

---

## 👥 Customers

| Method | Endpoint | Description | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/customers` | Get all customers | - | `Customer[]` |
| `GET` | `/customers/:id` | Get customer by ID | - | `Customer` |
| `POST` | `/customers` | Create customer | `CreateCustomerRequest` | `Customer` |
| `PUT` | `/customers/:id` | Update customer | `UpdateCustomerRequest` | `Customer` |

---

## 🎮 Games & Pricing

| Method | Endpoint | Description | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/games` | List global games (paginated/filtered) | `params: { page, size, ...filter }` | `PaginatedResponse<Game>` |
| `GET` | `/games/:id` | Get game details | - | `Game` |
| `GET` | `/games/:id/prices` | Get price for specific game | - | `GamePriceDisplay` |
| `POST` | `/games/:id/prices` | Set store price for game | `CreateGamePriceDisplayRequest` | `GamePriceDisplay` |
| `PUT` | `/games/:id/prices` | Update store price for game | `UpdateGamePriceDisplayRequest` | `GamePriceDisplay` |
| `GET` | `/stores/me/game-prices` | Get current store's game list with prices | `params: { page, size }` | `PaginatedResponse<GamePriceDisplayWithGame>` |

---

## 🛠 Type Definitions

### Auth Models

```ts
interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: User;
}
```

### Store Models

```ts
interface Store {
    id: string;
    name: string;
    code: string;
    logo?: string | null;
    socialLinks: Record<string, string>;
    isActive: boolean;
    // ... timestamps
}

interface CreateStoreRequest {
    code: string;
    name: string;
    logo?: string | null;
    description?: string | null;
    socialLinks?: Record<string, string> | null;
}
```

### Game Pricing Models

```ts
interface GamePriceDisplayWithGame {
    id: string;
    gameId: string;
    gameName: string;
    priceFull?: number | null;
    pricePrimaryPs4?: number | null;
    pricePrimaryPs5?: number | null;
    priceSecondary?: number | null;
    priceOffline?: number | null;
    isActive: boolean;
}
```

> *For full type definitions, refer to `src/api/types.ts`.*
