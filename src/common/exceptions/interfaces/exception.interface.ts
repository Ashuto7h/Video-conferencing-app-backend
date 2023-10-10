export interface Exception<T = undefined> {
    code?: string;
    message: string;
    details?: T;
}
