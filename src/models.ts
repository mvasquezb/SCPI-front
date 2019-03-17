export class Todo {
    title: string
    id: number
    completed: boolean = false

    constructor(title: string) {
        this.title = title;
        this.id = new Date().getTime()
    }
}