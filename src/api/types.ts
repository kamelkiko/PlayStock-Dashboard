// API Response wrapper
export interface ApiResponse<T> {
    data: T;
    isSuccess: boolean;
    code: number;
    message: string;
}

// User types
export interface User {
    code: string;
    name: string;
    email: string;
    phone: string;
    username: string;
    profilePicture?: string | null;
    notes?: string | null;
    isBanned: boolean;
    createdAt: string;
    updatedAt: string;
}

// Auth types
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: User;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

// Store types
export interface Store {
    id: string;
    code: string;
    name: string;
    logo?: string | null;
    description?: string | null;
    socialLinks: Record<string, string>;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// UI-specific view model for Store, extending core domain model
export interface StoreUI extends Store {
    revenue?: string; // formatted revenue string, e.g. "1000 ج.م"
    outletsCount?: number;
    lastActivity?: string; // human-readable timestamp
}

export interface CreateStoreRequest {
    code: string;
    name: string;
    logo?: string | null;
    description?: string | null;
    socialLinks?: Record<string, string> | null;
}

export interface UpdateStoreRequest {
    name?: string | null;
    code?: string | null;
    logo?: string | null;
    description?: string | null;
    socialLinks?: Record<string, string> | null;
    isActive?: boolean | null;
}

// Outlet types
export type OutletType = 'PHYSICAL' | 'ONLINE';

export interface Outlet {
    id: string;
    storeId: string;
    code: string;
    name: string;
    type: OutletType;
    address?: string | null;
    googleMapsUrl?: string | null;
    phones: string[];
    whatsApps: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOutletRequest {
    code: string;
    name: string;
    type: OutletType;
    address?: string | null;
    googleMapsUrl?: string | null;
    phones?: string[] | null;
    whatsApps?: string[] | null;
}

export interface UpdateOutletRequest {
    name?: string | null;
    code?: string | null;
    type?: OutletType | null;
    address?: string | null;
    googleMapsUrl?: string | null;
    phones?: string[] | null;
    whatsApps?: string[] | null;
    isActive?: boolean | null;
}

// Vendor types
export interface Vendor {
    id: string;
    name: string;
    storeId: string;
    phone?: string | null;
    notes?: string | null;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVendorRequest {
    name: string;
    phone?: string | null;
    code: string;
    notes?: string | null;
}

export interface UpdateVendorRequest {
    name?: string | null;
    phone?: string | null;
    code?: string | null;
    notes?: string | null;
}

// Customer types
export interface Customer {
    id: string;
    code: string;
    name: string;
    storeId: string;
    phone?: string | null;
    email?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomerRequest {
    name: string;
    code: string;
    phone?: string | null;
    email?: string | null;
    notes?: string | null;
}

export interface UpdateCustomerRequest {
    name?: string | null;
    code?: string | null;
    phone?: string | null;
    email?: string | null;
    notes?: string | null;
}

// Game types
export type GamePlatform = 'PS4' | 'PS5';

export interface Game {
    id: string;
    code: string;
    name: string;
    platform: GamePlatform;
    price?: number | null;
    releaseDate?: string | null;
    rating?: string | null;
    publisher?: string | null;
    genres: string[];
    coverImage?: string | null;
    description?: string | null;
    gameUrl?: string | null;
    sonyId?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface GameFilterRequest {
    name?: string | null;
    platform?: GamePlatform | null;
    genres?: string[] | null;
    publisher?: string | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    releaseDateFrom?: string | null;
    releaseDateTo?: string | null;
    sortField?: string;
    sortDirection?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
}

// Game Pricing types
export interface GamePriceDisplay {
    id: string;
    storeId: string;
    gameId: string;
    priceFull?: number | null;
    pricePrimaryPs4?: number | null;
    pricePrimaryPs5?: number | null;
    priceSecondary?: number | null;
    priceOffline?: number | null;
    isActive: boolean;
    displayOrder?: number | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface GamePriceDisplayWithGame {
    id: string;
    gameId: string;
    gameName: string;
    gamePlatform?: string | null;
    gameCoverImage?: string | null;
    gameBasePrice?: number | null;
    priceFull?: number | null;
    pricePrimaryPs4?: number | null;
    pricePrimaryPs5?: number | null;
    priceSecondary?: number | null;
    priceOffline?: number | null;
    isActive: boolean;
    displayOrder?: number | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateGamePriceDisplayRequest {
    priceFull?: number | null;
    pricePrimaryPs4?: number | null;
    pricePrimaryPs5?: number | null;
    priceSecondary?: number | null;
    priceOffline?: number | null;
    isActive?: boolean | null;
    notes?: string | null;
}

export interface UpdateGamePriceDisplayRequest {
    priceFull?: number | null;
    pricePrimaryPs4?: number | null;
    pricePrimaryPs5?: number | null;
    priceSecondary?: number | null;
    priceOffline?: number | null;
    isActive?: boolean | null;
    notes?: string | null;
}
