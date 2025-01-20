export interface User {
    username: string; 
    password: string;
}

export interface UserData {
    display_name?: string;
    firstname: string;
    lastname: string,
    mail: string;
    nickname?: string;
    addresses?: Address[]
    optInMarketing?: boolean;
    oldPassword?: string;
    newPassword?: string;
}

export interface UpdatedUserData {
    mail: string;
    firstname: string;
    lastname: string;
    optInMarketing?: boolean;
    nickname?: string;
    display_name?: string;
    oldPassword?: string;
    addresses: Address[]

}

export interface Address {
    address1: string;
    address2: string;
    billing: boolean;
    city: string;
    company: string;
    country: string;
    email: string;
    firstname: string;
    id: number;
    lastname: string;
    phone: string;
    postalCode: number;
    shipping: boolean
}

export interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    isSignedIn: boolean;
    login: (User: User) => Promise<void>;
    logout: () => void;
    register: (User: User) => Promise<void>;
    updateUser: (User : UserData) => Promise<void>;
}
