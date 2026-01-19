import { RoleType } from '@prisma/client';

export const ROLES = {
    ADMIN: RoleType.ADMIN,
    STAFF: RoleType.STAFF,
} as const;

export const ROLE_HIERARCHY = {
    [RoleType.ADMIN]: 100,
    [RoleType.STAFF]: 10,
};

export const SCOPES = {
    INVENTORY_WRITE: [RoleType.ADMIN],
    INVENTORY_READ: [RoleType.ADMIN, RoleType.STAFF],
    USER_MANAGEMENT: [RoleType.ADMIN],
    BILLING_WRITE: [RoleType.ADMIN, RoleType.STAFF],
    REPORTS: [RoleType.ADMIN],
};
