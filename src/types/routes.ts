export interface AppRoutes {
    '/api/data': any;
    '/auth/login': any;
    '/api/users/profile': any;
}

export type ValidRoutePath = keyof AppRoutes;
