export interface IToken {
    userId: string;
    iat: number;
    exp: number;
    isAdmin: boolean;
}