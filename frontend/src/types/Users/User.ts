export type User = {
    id: number;
    username: string;
    name: string;
    password: string;
    email: string;
    bio: string |null;
    website: string |null;
    location: string |null;
    profilePhoto: string;
    backgroundPhoto: string;
    role: string;
    joinedDate: string;
}