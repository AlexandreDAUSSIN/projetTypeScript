export class User {
    id: number;
    email: string;
    name: string;
    password: string;

    constructor(id?: number, email?: string, name?: string, password?: string) {
        this.id = id == null ? 0 : id;
        this.email = email == null ? "" : email;
        this.name = name == null ? "" : name;
        this.password = password == null ? "" : password;
    }
}