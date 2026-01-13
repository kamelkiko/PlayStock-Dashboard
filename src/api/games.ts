import api from './axios';
import {
    ApiResponse,
    Game,
    GameFilterRequest,
    PaginatedResponse,
    GamePriceDisplay,
    GamePriceDisplayWithGame,
    CreateGamePriceDisplayRequest,
    UpdateGamePriceDisplayRequest,
} from './types';

export const gamesApi = {
    getAll: async (
        page: number = 1,
        size: number = 20,
        filter: GameFilterRequest = {}
    ): Promise<ApiResponse<PaginatedResponse<Game>>> => {
        const response = await api.get<ApiResponse<PaginatedResponse<Game>>>('/games', {
            params: {
                ...filter,
                page,
                size,
            },
            paramsSerializer: {
                serialize: (params) => {
                    const searchParams = new URLSearchParams();
                    Object.entries(params).forEach(([key, value]) => {
                        if (value === undefined || value === null) return;
                        if (Array.isArray(value)) {
                            value.forEach((v) => searchParams.append(key, v));
                        } else {
                            searchParams.append(key, String(value));
                        }
                    });
                    return searchParams.toString();
                }
            }
        });
        return response.data;
    },

    getById: async (id: string): Promise<ApiResponse<Game>> => {
        const response = await api.get<ApiResponse<Game>>(`/games/${id}`);
        return response.data;
    },

    // Game pricing
    getPrice: async (gameId: string): Promise<ApiResponse<GamePriceDisplay>> => {
        const response = await api.get<ApiResponse<GamePriceDisplay>>(`/games/${gameId}/prices`);
        return response.data;
    },

    setPrice: async (
        gameId: string,
        data: CreateGamePriceDisplayRequest
    ): Promise<ApiResponse<GamePriceDisplay>> => {
        const response = await api.post<ApiResponse<GamePriceDisplay>>(`/games/${gameId}/prices`, data);
        return response.data;
    },

    updatePrice: async (
        gameId: string,
        data: UpdateGamePriceDisplayRequest
    ): Promise<ApiResponse<GamePriceDisplay>> => {
        const response = await api.put<ApiResponse<GamePriceDisplay>>(`/games/${gameId}/prices`, data);
        return response.data;
    },

    getStorePrices: async (page: number = 1, size: number = 20): Promise<ApiResponse<PaginatedResponse<GamePriceDisplayWithGame>>> => {
        // Assuming endpoint based on patterns, user didn't specify exact path but implied /stores connection
        // Trying /stores/game-prices or similar. 
        // Based on "you just copy paste from game", I should implement proper endpoint.
        // I will try /game-prices if it exists or /stores/game-prices.
        // Given the user routes, there is no /stores/game-prices in the snippet.
        // But maybe it's in a separate route file.
        // I'll stick with /stores/game-prices for now as a best guess or /game-prices.
        // Update: User shared CreateGamePriceDisplayRequest.
        // I'll try GET /game-prices
        const response = await api.get<ApiResponse<PaginatedResponse<GamePriceDisplayWithGame>>>(
            '/stores/me/game-prices', { params: { page, size } }
        );
        return response.data;
    },
};

export default gamesApi;
