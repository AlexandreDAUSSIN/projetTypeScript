export class User {
    id: number;
    email: string;
    name: string;
    password: string;
    role: number;

    constructor(email?: string, name?: string, password?: string, role?: number, id?: number) {
        this.id = id == null ? 0 : id;
        this.email = email == null ? "" : email;
        this.name = name == null ? "" : name;
        this.password = password == null ? "" : password;
        this.role = role == null ? UserRole.Client : role;
    }
}