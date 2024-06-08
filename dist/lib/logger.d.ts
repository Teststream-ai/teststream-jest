declare class Logger {
    private prefix;
    constructor();
    info(message: string): void;
    error(message: string): void;
}
export default Logger;
