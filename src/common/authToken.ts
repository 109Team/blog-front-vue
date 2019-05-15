import { cookies, cookieOption } from '../common/util';

export function getAuthToken(): string{
    return cookies('authToken') || '';
}

export function setAuthToken(value: string, option?: cookieOption): void{
    cookies('authToken', value, option);
}