
interface cookieOption {
    path?: string;
    expires?: number;
}

function cookies(name?: string, value?: string | number, option?: cookieOption): string {
    let _argLen = arguments.length;
    // 不传参数返回所有
    if (_argLen == 0) {
        return document.cookie;
    } else {
        let _arr = (document.cookie || '').split(';') || [],
            _cookies: any = {};
        _arr.forEach((__item: string) => {
            _cookies[((__item.split('=')[0]) as string).trim()] = __item.split('=')[1];
        })
        // 返回对应name的值
        if (_argLen == 1) {
            return _cookies[name as string]
        } else {
            // 两个以上的参数赋值
            let _cookie = `${name}=${value}`;
            // 如果传了空字符串，则设置过期
            if (isEmpty(value)) {
                (option as cookieOption).expires = 0;
            }

            if (option) {
                option.path && (_cookie += `;path=${option.path}`);
                (option.expires === 0 || option.expires) && (_cookie += `;expires=${new Date(Date.now() + option.expires).toUTCString()}`);
            }
            return document.cookie = _cookie;
        }
    }
}

function isEmpty(value: any): boolean {
    if (typeof value === 'string' || isArray(value)) {
        return value.length === 0;
    } else if (typeof value === 'number') {
        return value === NaN;
    } else if (isObject(value)) {
        return value.keys().length === 0;
    } else if (isNull(value) || value === undefined) {
        return true;
    } else {
        return false
    }
}

function isArray(arr: any): boolean {
    return Array.isArray ? Array.isArray(arr) : Object.prototype.toString.call(arr) == '[object Array]';
}

function isObject(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function isNull(obj: any): boolean {
    return !obj && typeof obj === 'object';
}

const escapeTest: RegExp = /[&<>"']/;
const escapeReplace: RegExp = /[&<>"']/g;
const escapeTestNoEncode: RegExp = /[<>"']|&(?!#?\w+;)/;
const escapeReplaceNoEncode: RegExp = /[<>"']|&(?!#?\w+;)/g;
interface stringObejct{
    [propName: string]: string;
}
const escapeReplacements: stringObejct = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

// 转义字符
function escape(html: string, encode: boolean): string {
    if (encode) {
        if (escapeTest.test(html)) {
            return html.replace(escapeReplace, function (ch: string): string { return escapeReplacements[ch]; });
        }
    } else {
        if (escapeTestNoEncode.test(html)) {
            return html.replace(escapeReplaceNoEncode, function (ch) { return escapeReplacements[ch]; });
        }
    }
    return html;
}

export {
    cookies,
    cookieOption,
    isArray,
    isEmpty,
    isNull,
    isObject,
    escape
}