import { UserPermissionEnum } from 'src/app/shared/enums/user-permission';

import { UserRoleEnum } from '../../../enums/user-role';

export interface IUserRoleDTO {
    role: UserRoleEnum;
    permission: UserPermissionEnum;
}