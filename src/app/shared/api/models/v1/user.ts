

import { UserRoleEnum } from 'src/app/shared/enums/user-role';



export interface IUserDTO {
    id: number;
    name: string;
    email: string;
    ad: string;
    isActive: boolean;
    role: UserRoleEnum;
}