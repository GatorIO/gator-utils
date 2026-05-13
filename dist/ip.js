"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localHost = localHost;
exports.isIPV6 = isIPV6;
exports.remoteAddress = remoteAddress;
exports.isLoopback = isLoopback;
exports.hashIPV6 = hashIPV6;
exports.hash = hash;
exports.toNumber = toNumber;
exports.compress = compress;
exports.decompress = decompress;
exports.toNumber32 = toNumber32;
exports.fromNumber = fromNumber;
exports.toNumberIPV6 = toNumberIPV6;
exports.isPrivate = isPrivate;
const utils = require("./index");
function localHost(req) {
    if (!req || !req.connection || !req.connection.remoteAddress) {
        return false;
    }
    return req.connection.remoteAddress.substring(0, 8) == "127.0.0." || req.connection.remoteAddress == "::1";
}
function isIPV6(address) {
    if (!address) {
        return false;
    }
    return typeof address == 'object' || address.indexOf(':') > -1;
}
function remoteAddress(req) {
    if (req.headers['x-forwarded-for']) {
        let xf = req.headers['x-forwarded-for'].trim();
        let xfs = null;
        if (xf.indexOf(",") > -1) {
            xfs = xf.split(',');
        }
        else {
            if (xf.indexOf(" ") > -1) {
                xfs = xf.split(' ');
            }
        }
        if (xfs != null) {
            for (let i = 0; i < xfs.length; i++) {
                let ipTrim = xfs[i].trim();
                if (ipTrim.substr(0, 7) == '::ffff:' && ipTrim.split('.').length == 4)
                    ipTrim = ipTrim.substr(7);
                if (ipTrim.split('.').length != 2) {
                    if (ipTrim != "" && ipTrim.substring(0, 3) != "10." && ipTrim.substring(0, 7) != "172.16." && ipTrim.substring(0, 7) != "172.31." && ipTrim.substring(0, 8) != "127.0.0." && ipTrim.substring(0, 8) != "192.168." && ipTrim != "unknown" && ipTrim != "::1") {
                        return ipTrim;
                    }
                }
            }
            xf = xfs[0].trim();
        }
        if (xf.substr(0, 7) == '::ffff:' && xf.split('.').length == 4)
            xf = xf.substr(7);
        if (xf.substring(0, 7) == "unknown") {
            return "127.0.0.1";
        }
        return xf;
    }
    else {
        let xf = req.connection.remoteAddress;
        if (!xf || xf.substring(0, 7) == "unknown") {
            return "127.0.0.1";
        }
        return xf;
    }
}
function isLoopback(addr) {
    return /^127\.0\.0\.1/.test(addr)
        || /^fe80::1/.test(addr)
        || /^::1/.test(addr);
}
function hashIPV6(ip) {
    let hash = 0, len;
    for (let i = 0, len = ip.length; i < len; i++) {
        hash = ((hash << 5) - hash) + ip.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}
function hash(address) {
    if (isIPV6(address)) {
        return hashIPV6(address);
    }
    else {
        let _ip = address.split('.');
        return Number(_ip[0]) * 16777216 +
            Number(_ip[1]) * 65536 +
            Number(_ip[2]) * 256 +
            Number(_ip[3]);
    }
}
function toNumber(address, reverse = false) {
    if (isIPV6(address)) {
        return toNumberIPV6(address);
    }
    else {
        let _ip = address.split('.');
        if (reverse)
            return Number(_ip[3]) * 16777216 +
                Number(_ip[2]) * 65536 +
                Number(_ip[1]) * 256 +
                Number(_ip[0]);
        else
            return Number(_ip[0]) * 16777216 +
                Number(_ip[1]) * 65536 +
                Number(_ip[2]) * 256 +
                Number(_ip[3]);
    }
}
function compress(address) {
    if (!isIPV6(address)) {
        return toNumber32(address);
    }
    else {
        let parts = address.split(':');
        let bytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let i;
        for (i = 0; i < parts.length; i++) {
            if (parts[i] == '') {
                break;
            }
            else {
                parts[i] = ('000' + parts[i]).slice(-4);
                bytes[i * 2] = parseInt(parts[i].substr(0, 2), 16);
                bytes[i * 2 + 1] = parseInt(parts[i].substr(2, 2), 16);
            }
        }
        let index = 15;
        for (let j = parts.length - 1; j > i; j--) {
            parts[j] = ('000' + parts[j]).slice(-4);
            bytes[index - 1] = parseInt(parts[j].substr(0, 2), 16);
            bytes[index] = parseInt(parts[j].substr(2, 2), 16);
            index -= 2;
        }
        return bytes;
    }
}
function decompress(address) {
    if (typeof address == 'number') {
        let addr = utils.toBytes(address);
        return addr[3] + '.' +
            addr[2] + '.' +
            addr[1] + '.' +
            addr[0];
    }
    else {
        let ret = '';
        for (let i = 0; i < address.length; i += 2) {
            let byte = '0' + address[i].toString(16);
            ret += byte.length == 2 ? byte : byte.substr(1, 2);
            byte = '0' + address[i + 1].toString(16);
            ret += byte.length == 2 ? byte : byte.substr(1, 2);
            if (i != address.length - 2)
                ret += ':';
        }
        return ret;
    }
}
function toNumber32(address) {
    if (isIPV6(address)) {
        return toNumberIPV6(address);
    }
    else {
        let _ip = address.split('.');
        let num = Number(_ip[0]) * 16777216 +
            Number(_ip[1]) * 65536 +
            Number(_ip[2]) * 256 +
            Number(_ip[3]);
        if (num >= 2147483648)
            num -= 4294967296;
        return num;
    }
}
function fromNumber(ipNumber) {
    let addr = utils.toBytes(ipNumber);
    return addr[3] + '.' +
        addr[2] + '.' +
        addr[1] + '.' +
        addr[0];
}
function toNumberIPV6(address) {
    return hashIPV6(address);
}
function isPrivate(address) {
    return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i
        .test(address) ||
        /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(address) ||
        /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i
            .test(address) ||
        /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(address) ||
        /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(address) ||
        /^f[cd][0-9a-f]{2}:/i.test(address) ||
        /^fe80:/i.test(address) ||
        /^::1$/.test(address) ||
        /^::$/.test(address);
}
//# sourceMappingURL=ip.js.map