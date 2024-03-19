enum EnPermissionBits {
    ADMINISTER = 1,
    READ = 2,
    CONTRIBUTE = 4,
    FORCE_PUSH = 8,
    CREATE_BRANCH = 16,
    CREATE_TAG = 32,
    MANAGE_NOTE = 64,
    POLICY_EXEMPT = 128,
    CREATE_REPO = 256,
    DELETE_REPO = 512,
    RENAME_REPO = 1024,
    EDIT_POLICIES = 2048,
    REMOVE_OTHER_LOCKS = 4096,
    MANAGE_PERMISSIONS = 8192,
    PR_CONTRIBUTE = 16384,
    PR_BYPASS_POLICY = 32768,
    AS_VIEW_ALERTS = 65536,
    AS_MANAGE_ALERTS = 131072,
    AS_MANAGE_SETTINGS = 262144
}

const groups: Record<TGroupGrade, EnPermissionBits[]> = {
    junior: [
        EnPermissionBits.READ,
        EnPermissionBits.CREATE_BRANCH,
        EnPermissionBits.CREATE_TAG,
        EnPermissionBits.CONTRIBUTE,
    ],
    middle: [
        EnPermissionBits.READ,
        EnPermissionBits.CREATE_BRANCH,
        EnPermissionBits.CREATE_TAG,
        EnPermissionBits.CONTRIBUTE,
        EnPermissionBits.PR_CONTRIBUTE,
    ],
    senior: [
        EnPermissionBits.READ,
        EnPermissionBits.CREATE_BRANCH,
        EnPermissionBits.CREATE_TAG,
        EnPermissionBits.CONTRIBUTE,
        EnPermissionBits.PR_CONTRIBUTE,
        EnPermissionBits.RENAME_REPO,
    ],
    lead: [
        EnPermissionBits.READ,
        EnPermissionBits.CREATE_BRANCH,
        EnPermissionBits.CREATE_TAG,
        EnPermissionBits.CONTRIBUTE,
        EnPermissionBits.PR_CONTRIBUTE,
        EnPermissionBits.RENAME_REPO,
        EnPermissionBits.EDIT_POLICIES,
        EnPermissionBits.MANAGE_PERMISSIONS,
    ]
}

export type TGroupGrade = 'junior' | 'middle' | 'senior' | 'lead';

export class GroupPermissionsService {
    getGroupPermissionsSum(group: TGroupGrade): number {
        const permissionBits = groups[group];
        return permissionBits.reduce((acc, v) => acc + v);
    }
}
