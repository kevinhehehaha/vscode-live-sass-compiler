
export class LogEvent {
    public createdAt: Date;
    public event: unknown;

    constructor(event: unknown) {
        this.createdAt = new Date();
        this.event = event;
    }
}
