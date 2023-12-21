"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(id, name, price) {
        this.id = id == null ? 0 : id;
        this.name = name == null ? "" : name;
        this.price = price == null ? 0 : price;
    }
}
exports.Product = Product;
