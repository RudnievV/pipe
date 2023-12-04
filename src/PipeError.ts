export default class PipeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PipeError';
    }
}
