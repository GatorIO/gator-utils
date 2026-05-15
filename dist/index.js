"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.epoch = exports.ip = void 0;
exports.JSONEscape = JSONEscape;
exports.JSONSafeParse = JSONSafeParse;
exports.superRandom = superRandom;
exports.isArray = isArray;
exports.prefixAttributes = prefixAttributes;
exports.isNumeric = isNumeric;
exports.currencyToNumber = currencyToNumber;
exports.toBytes = toBytes;
exports.uuid = uuid;
exports.base62decode = base62decode;
exports.base62encode = base62encode;
exports.isUTF8 = isUTF8;
exports.padLeft = padLeft;
exports.urlDecode = urlDecode;
exports.clone = clone;
exports.extend = extend;
exports.copyProperty = copyProperty;
exports.isFunction = isFunction;
exports.replaceAll = replaceAll;
exports.htmlify = htmlify;
exports.empty = empty;
exports.trimStart = trimStart;
exports.parseCookieValueFromString = parseCookieValueFromString;
exports.trimEnd = trimEnd;
exports.repeat = repeat;
exports.spaces = spaces;
exports.merge = merge;
exports.validEmail = validEmail;
exports.missingParams = missingParams;
exports.guid = guid;
exports.hash = hash;
exports.noCache = noCache;
exports.stripProtocol = stripProtocol;
exports.parseBoolean = parseBoolean;
exports.renameAttribute = renameAttribute;
exports.getUrlText = getUrlText;
exports.appendQueryString = appendQueryString;
exports.ip = require('./ip');
exports.epoch = require('./epoch');
exports.config = require('./config');
const crypto = require("crypto");
const cloneLib = require("clone");
const http = require("http");
const https = require("https");
let iconv = require("iconv-lite");
function JSONEscape(str) {
    return ('' + str).replace(/["\\\n\r\t\b\f\u2028\u2029]/g, function (character) {
        switch (character) {
            case '"':
            case '\\':
                return '\\' + character;
            case '\n':
                return '\\n';
            case '\t':
                return '\\t';
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\r':
                return '\\r';
            case '\u2028':
                return '\\u2028';
            case '\u2029':
                return '\\u2029';
        }
    });
}
function JSONSafeParse(str) {
    try {
        return JSON.parse(str);
    }
    catch (err) {
        return null;
    }
}
function superRandom(numBytes = 20) {
    return crypto.randomBytes(numBytes).toString('base64');
}
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
function prefixAttributes(obj, prefix) {
    for (let attrib in obj) {
        if (Object.hasOwn(obj, attrib)) {
            if (!isArray(obj) && attrib.substr(0, 1) != '$') {
                obj[prefix + '.' + attrib] = obj[attrib];
                delete obj[attrib];
            }
            else {
                if (typeof obj[attrib] == 'object') {
                    obj[attrib] = prefixAttributes(obj[attrib], prefix);
                }
            }
        }
    }
    return obj;
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function currencyToNumber(n) {
    if (typeof n == 'string') {
        n = n.replace('$', '');
        n = n.replace('€', '');
        n = n.replace('£', '');
        n = n.replace('¥', '');
    }
    if (isNumeric(n))
        return +n;
    else
        return null;
}
function toBytes(num) {
    let data = new Uint8Array(4);
    for (let i = 0; i < 4; i++) {
        data[i] = (num >> (i * 8)) & 0xff;
    }
    return data;
}
function uuid(len, radix) {
    let CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let chars = CHARS, uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++)
            uuid[i] = chars[0 | Math.random() * radix];
    }
    else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}
function base62decode(a) {
    let b, c, d;
    for (b = c = (a === (/\W|_|^$/.test(a += "") || a)
        ? 1 : 0) - 1; d = a.charCodeAt(c++);)
        b = b * 62 + d - [, 48, 29, 87][d >> 5];
    return b;
}
function base62encode(a) {
    let b, c;
    for (a = a !== +a || a % 1 ? -1 : a, b = ""; a >= 0; a = Math.floor(a / 62) || -1)
        b = String.fromCharCode(((c = a % 62) > 9 ? c > 35 ? 29 : 87 : 48) + c) + b;
    return b;
}
function isUTF8(charset) {
    if (!charset) {
        return true;
    }
    charset = charset.toLowerCase();
    return charset === 'utf8' || charset === 'utf-8';
}
function padLeft(value, padChar, padCount) {
    let str = "" + value;
    let padBuff = Array(padCount + 1);
    let pad = padBuff.join(padChar);
    return pad.substring(0, pad.length - str.length) + str;
}
function urlDecode(str, charset) {
    if (isUTF8(charset)) {
        try {
            return decodeURIComponent(str);
        }
        catch (err) {
            return str;
        }
    }
    let bytes = [];
    for (let i = 0; i < str.length;) {
        if (str[i] === '%') {
            i++;
            bytes.push(parseInt(str.substring(i, i + 2), 16));
            i += 2;
        }
        else {
            bytes.push(str.charCodeAt(i));
            i++;
        }
    }
    let buf = Buffer.from(bytes);
    return iconv.decode(buf, charset);
}
function clone(o) {
    if (!o || typeof (o) != 'object')
        return o;
    return cloneLib(o);
}
function extend(o1, o2) {
    if (o1 == null || o2 == null)
        return o1;
    for (let key in o2)
        if (Object.hasOwn(o2, key))
            o1[key] = o2[key];
}
function copyProperty(property, o1, o2, allowNull = false, allowEmpty = false) {
    if (o1 == null || o2 == null)
        throw new Error('both objects must have a value');
    if (property == null)
        throw new Error('you must specify a property value');
    let copy = false;
    if (Object.hasOwn(o2, property)) {
        if (allowNull && o2[property] == null) {
            copy = true;
        }
        else if (o2[property] instanceof Date) {
            copy = true;
        }
        else if (o2[property] != null) {
            if (allowEmpty || typeof o2[property] !== 'object') {
                copy = true;
            }
            else if (!empty(o2[property])) {
                copy = true;
            }
        }
    }
    if (copy)
        o1[property] = o2[property];
    return copy;
}
function isFunction(functionToCheck) {
    let getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
function replaceAll(original, search, replacement) {
    return original.split(search).join(replacement);
}
function htmlify(obj) {
    return '<pre>' + JSON.stringify(obj, null, 4) + '</pre>';
}
function empty(obj) {
    return Object.keys(obj).length == 0;
}
function trimStart(value, start) {
    if (value.length == 0)
        return value;
    start = start ? start : ' ';
    let i = 0, val = 0;
    for (; value.charAt(i) == start && i < value.length; i++)
        ;
    return value.substring(i);
}
function parseCookieValueFromString(headerVal, key) {
    let result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(headerVal)) ? (result[1]) : null;
}
function trimEnd(val, end) {
    if (val.slice(-end.length) === end)
        return val.substr(0, val.length - end.length);
    else
        return val;
}
function repeat(val, n) {
    n = n || 1;
    return Array(n + 1).join(val);
}
function spaces(n) {
    return this.repeat('&nbsp;', n);
}
function merge(o1, o2, overwrite) {
    if (!o1)
        return o2;
    let o = clone(o1);
    for (let key in o2) {
        if (Object.hasOwn(o2, key)) {
            if (o[key] == undefined) {
                o[key] = o2[key];
            }
            else {
                if (typeof o2[key] == 'object') {
                    o[key] = merge(o[key], o2[key], overwrite);
                }
                else {
                    if (overwrite) {
                        o[key] = o2[key];
                    }
                }
            }
        }
    }
    return o;
}
function validEmail(email) {
    return email && email.indexOf('@') > -1 && email.indexOf('.') > -1;
}
function missingParams(params, requiredParams) {
    let missing = [];
    for (let a = 0; a < requiredParams.length; a++) {
        if (!Object.hasOwn(params || {}, requiredParams[a])) {
            missing.push(requiredParams[a]);
        }
    }
    return missing;
}
function guid() {
    function _p8(s) {
        let p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}
function hash(input) {
    let hash = 0, len;
    for (let i = 0, len = input.length; i < len; i++) {
        hash = ((hash << 5) - hash) + input.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}
function noCache(res) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
}
function stripProtocol(url) {
    let ret = url;
    if (url.indexOf('://') > -1)
        ret = ret.substr(url.indexOf('://') + 3);
    return ret;
}
function parseBoolean(value, nullOnFailure = false) {
    switch (value) {
        case true:
        case 'true':
        case 1:
        case '1':
        case 'on':
        case 'yes':
            value = true;
            break;
        case false:
        case 'false':
        case 0:
        case '0':
        case 'off':
        case 'no':
            value = false;
            break;
        default:
            if (nullOnFailure) {
                value = null;
            }
            else {
                value = false;
            }
            break;
    }
    return value;
}
function renameAttribute(obj, name, replacement) {
    for (let attrib in obj) {
        if (Object.hasOwn(obj, attrib) && attrib == name) {
            if (!isArray(obj) && attrib.substr(0, 1) != '$') {
                obj[replacement] = obj[attrib];
                delete obj[attrib];
            }
        }
        else {
            if (typeof obj[attrib] == 'object') {
                obj[attrib] = renameAttribute(obj[attrib], name, replacement);
            }
        }
    }
    return obj;
}
function getUrlText(url) {
    const lib = url.indexOf('https:') == 0 ? https : http;
    return new Promise((resolve, reject) => {
        lib.get(url, function (res) {
            res.setEncoding('utf8');
            let body = '';
            res.on('data', function (d) {
                body += d;
            });
            res.on('end', function () {
                resolve(body);
            });
            res.on('error', reject);
        }).on('error', reject);
    });
}
function appendQueryString(url, name, value) {
    let result = url;
    if (result.indexOf('?') > 0) {
        result += '&';
    }
    else {
        result += '?';
    }
    return result += name + '=' + encodeURIComponent(value);
}
//# sourceMappingURL=index.js.map