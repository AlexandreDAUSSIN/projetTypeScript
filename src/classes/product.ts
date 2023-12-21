export class Product {
    id: number;
    name: string;
    price: number;

    constructor(id?: number, name?: string, price?: number) {
        this.id = id == null ? 0 : id;
        this.name = name == null ? "" : name;
        this.price = price == null ? 0 : price;
    }
}