/// <reference path="epoch.ts" />
/// <reference path="ip.ts" />
/// <reference path="../typings/node/node.d.ts" />
exports.ip = require('./ip');
exports.epoch = require('./epoch');
exports.config = require('./config');
var crypto = require('crypto');
/*
 Common utility functions
 */
var iconv = require("iconv-lite");
function superRandom(bytes) {
    if (bytes === void 0) { bytes = 20; }
    return crypto.randomBytes(bytes).toString('base64');
}
exports.superRandom = superRandom;
//  return whether an object is an array or not
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
exports.isArray = isArray;
//  Add a prefix to all the attributes.  This is used when manipulating nested objects.
function prefixAttributes(obj, prefix) {
    for (var attrib in obj) {
        if (obj.hasOwnProperty(attrib)) {
            //  skip over arrays and $ operators
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
exports.prefixAttributes = prefixAttributes;
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
exports.isNumeric = isNumeric;
//  Convert an integer to a 4 byte array
function toBytes(num) {
    var data = new Uint8Array(4);
    for (var i = 0; i < 4; i++) {
        data[i] = (num >> (i * 8)) & 0xff;
    }
    return data;
}
exports.toBytes = toBytes;
function uuid(len, radix) {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++)
            uuid[i] = chars[0 | Math.random() * radix];
    }
    else {
        // rfc4122, version 4 form
        var r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}
exports.uuid = uuid;
/**
 * this base62 is only safe for decoding to integers
 */
function base62decode(a) {
    var b, c, d;
    for (b = c = (a === (/\W|_|^$/.test(a += "") || a) // tests if 'a' is a properly base62-encoded string and coerces it to one
        ? 1 : 0) - 1; d = a.charCodeAt(c++);)
        b = b * 62 + d - [, 48, 29, 87][d >> 5]; // See comments : https://gist.github.com/1170594#gistcomment-48129
    return b; // positive base10 integer or '-1' if 'a' is not a base62 encoded string
}
exports.base62decode = base62decode;
/**
 * this base62 is only safe for encoding integers
 */
function base62encode(a) {
    var b, c;
    for (a = a !== +a || a % 1 ? -1 : a, b = ""; 
    // for example, '.5 % 1 == .5' but '1 % 1 == 0'
    a >= 0; a = Math.floor(a / 62) || -1 // using a bitwise hack here will fail with great numbers
    )
        // a%62 -> 0-61
        // 0-9   | 36-61 | 10-35
        // 48-57 | 65-90 | 97-121
        // 0-9   | A-Z   | a-z
        b = String.fromCharCode(((c = a % 62) > 9 ? c > 35 ? 29 : 87 : 48) + c) + b;
    return b; // will return either an empty or a base62-encoded string
}
exports.base62encode = base62encode;
function isUTF8(charset) {
    if (!charset) {
        return true;
    }
    charset = charset.toLowerCase();
    return charset === 'utf8' || charset === 'utf-8';
}
exports.isUTF8 = isUTF8;
function padLeft(value, padChar, padCount) {
    var str = "" + value;
    var padBuff = Array(padCount + 1);
    var pad = padBuff.join(padChar);
    return pad.substring(0, pad.length - str.length) + str;
}
exports.padLeft = padLeft;
function urlDecode(str, charset) {
    if (isUTF8(charset)) {
        try {
            return decodeURIComponent(str);
        }
        catch (err) {
            return str;
        }
    }
    var bytes = [];
    for (var i = 0; i < str.length;) {
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
    var buf = new Buffer(bytes);
    return iconv.decode(buf, charset);
}
exports.urlDecode = urlDecode;
//  SHALLOW clone an object into a new object.  No functions will be carried over.
function clone(o) {
    if (!o || typeof (o) != 'object')
        return o;
    return Object['assign']({}, o);
}
exports.clone = clone;
//  Concatenate two objects into the first object
function extend(o1, o2) {
    if (o1 == null || o2 == null)
        return o1;
    for (var key in o2)
        if (o2.hasOwnProperty(key))
            o1[key] = o2[key];
}
exports.extend = extend;
/**
 * Copies the specified property from the second object into the first object if it exists
 * returns true if the property was found and copied
 */
function copyProperty(
    /**
     * The property you are copying
     */
    property, 
    /**
     * The object you are copying to
     */
    o1, 
    /**
     * The object you are copying from
     */
    o2, 
    /**
     * Allow the copying of null values
     */
    allowNull, 
    /**
     * Allow the copying of empty values
     */
    allowEmpty) {
    if (allowNull === void 0) { allowNull = false; }
    if (allowEmpty === void 0) { allowEmpty = false; }
    if (o1 == null || o2 == null)
        throw new Error('both objects must have a value');
    if (property == null)
        throw new Error('you must specify a property value');
    /// I felt this was far more readable than the alternative method started with
    var copy = false;
    if (o2.hasOwnProperty(property)) {
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
exports.copyProperty = copyProperty;
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
exports.isFunction = isFunction;
//  replaceAll string function, needed since javascript's replace function only replaces the first instance
function replaceAll(original, search, replacement) {
    return original.split(search).join(replacement);
}
exports.replaceAll = replaceAll;
//  Format an object to html with indentation and spaces
function htmlify(obj) {
    return '<pre>' + JSON.stringify(obj, null, 4) + '</pre>';
}
exports.htmlify = htmlify;
//  Return whether an object is empty or noe
function empty(obj) {
    return Object.keys(obj).length == 0;
}
exports.empty = empty;
//  trim a specific string off the start of a string
function trimStart(value, start) {
    if (value.length == 0)
        return value;
    start = start ? start : ' ';
    var i = 0, val = 0;
    for (; value.charAt(i) == start && i < value.length; i++)
        ;
    return value.substring(i);
}
exports.trimStart = trimStart;
/**
 * Get the value from a cookie from the raw header string
 */
function parseCookieValueFromString(headerVal, key) {
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(headerVal)) ? (result[1]) : null;
}
exports.parseCookieValueFromString = parseCookieValueFromString;
//  trim a specific string off the end of a string
function trimEnd(val, end) {
    if (val.slice(-end.length) === end)
        return val.substr(0, val.length - end.length);
    else
        return val;
}
exports.trimEnd = trimEnd;
//  Repeat a string N times
function repeat(val, n) {
    n = n || 1;
    return Array(n + 1).join(val);
}
exports.repeat = repeat;
//  Repeat html spaces N times
function spaces(n) {
    return this.repeat('&nbsp;', n);
}
exports.spaces = spaces;
//  merge two object - overwrite existing elements, if specified
function merge(o1, o2, overwrite) {
    if (!o1)
        return o2;
    var o = clone(o1);
    for (var key in o2) {
        if (o2.hasOwnProperty(key)) {
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
exports.merge = merge;
function validEmail(email) {
    return email && email.indexOf('@') > -1 && email.indexOf('.') > -1;
}
exports.validEmail = validEmail;
//  Collect missing arguments on a REST request
function missingParams(params, requiredParams) {
    var missing = [];
    for (var a = 0; a < requiredParams.length; a++) {
        if (!params || !params.hasOwnProperty(requiredParams[a])) {
            missing.push(requiredParams[a]);
        }
    }
    return missing;
}
exports.missingParams = missingParams;
/**
 *  Generates a GUID string.
 *  example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 */
function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}
exports.guid = guid;
//  Return a 32-bit integer hash from a string.  This uses a variation of the murmur3 hash algorithm.  The collision
//  rate is very small.
//  Params:  input - the string to hash
function hash(input) {
    var hash = 0, len;
    for (var i = 0, len = input.length; i < len; i++) {
        hash = ((hash << 5) - hash) + input.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}
exports.hash = hash;
//# sourceMappingURL=index.js.map