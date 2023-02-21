import { IUserRoleDTO } from './user-role';

export interface IUserDTO {
    id: number;
    name: string;
    email: string;
    ad?: string;
    roles: IUserRoleDTO[];
}