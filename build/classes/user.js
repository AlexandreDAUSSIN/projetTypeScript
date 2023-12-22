"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(email, name, password, id) {
        this.id = id == null ? 0 : id;
        this.email = email == null ? "" : email;
        this.name = name == null ? "" : name;
        this.password = password == null ? "" : password;
    }
}
exports.User = User;
