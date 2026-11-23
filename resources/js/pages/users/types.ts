export interface RoleOption {
    id: number;
    name: string;
    slug: string;
    color?: string;
}

export interface UserItem {
    id: number;
    name: string;
    email: string;
    role_id: number | null;
    role_name: string;
    role_slug: string;
    role_color?: string;
    created_at: string;
    is_current_user: boolean;
}

export interface UserFormData {
    name: string;
    email: string;
    role_id: string;
    password: string;
    password_confirmation: string;
}
