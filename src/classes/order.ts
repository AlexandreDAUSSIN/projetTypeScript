export class Order {
    id: number;
    authorId: number;

    constructor(authorId?: number, id?: number) {
        this.id = id == null ? 0 : id;
        this.authorId = authorId == null ? 0 : authorId;
    }
}