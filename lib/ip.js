/// <reference path="../typings/node/node.d.ts" />
var utils = require('./index');
/*
 Common IP functions
 */
//  Return whether the current request is from the local server.
function localHost(req) {
    return req.connection.remoteAddress.substring(0, 8) == "127.0.0." || req.connection.remoteAddress == "::1";
}
exports.localHost = localHost;
//  Whether an IP address is IPV6.
function isIPV6(address) {
    if (!address) {
        return false;
    }
    return address.indexOf(':') > -1;
}
exports.isIPV6 = isIPV6;
//  Return the I.P. address of the request (checking for proxy server forwarding).
function remoteAddress(req) {
    //   The X-Forwarded-For header is used to identify the originating IP address when a hit is passed via a proxy server.
    //   This is easily faked and cannot be considered authoritative except for trusted proxies, like the Opera Mini proxy.  In addition, this
    //   header often contains intranet IP addresses, like 10.1.1.1.  Therefore, only use it in special cases.
    if (req.headers['x-forwarded-for']) {
        var xf = req.headers['x-forwarded-for'].trim();
        var xfs = null;
        //  see if multiple addresses are in the XFF header
        if (xf.indexOf(",") > -1) {
            xfs = xf.split(',');
        }
        else {
            if (xf.indexOf(" ") > -1) {
                xfs = xf.split(' ');
            }
        }
        if (xfs != null) {
            //  get first public address, since multiple private routings can occur and be added to forwarded list
            for (var i = 0; i < xfs.length; i++) {
                var ipTrim = xfs[i].trim();
                if (ipTrim != "" && ipTrim.substring(0, 3) != "10." && ipTrim.substring(0, 8) != "127.0.0." && ipTrim.substring(0, 8) != "192.168." && ipTrim != "unknown" && ipTrim != "::1") {
                    return ipTrim;
                }
            }
            xf = xfs[0].trim();
        }
        //  a tiny % of hits have an unknown ip address
        if (xf.substring(0, 7) == "unknown") {
            return "1.2.3.4";
        }
        return xf;
    }
    else {
        var xf = req.connection.remoteAddress;
        //  a tiny % of hits have an unknown ip address, so return a default address
        if (xf.substring(0, 7) == "unknown") {
            return "1.2.3.4";
        }
        return xf;
    }
}
exports.remoteAddress = remoteAddress;
function isLoopback(addr) {
    return /^127\.0\.0\.1/.test(addr)
        || /^fe80::1/.test(addr)
        || /^::1/.test(addr);
}
exports.isLoopback = isLoopback;
//  Return a 52-bit integer hash from an IPv6 address.  This uses a variation of the murmur3 hash algorithm.  The collision
//  rate is small, roughly one in 100,000,000.
function hashIPV6(ip) {
    var hash = 0, len;
    for (var i = 0, len = ip.length; i < len; i++) {
        hash = ((hash << 5) - hash) + ip.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
    }
    return hash;
}
exports.hashIPV6 = hashIPV6;
//  Convert an IP address to a shardable number.
function hash(address) {
    if (isIPV6(address)) {
        //  hash an IPv6 address to 4 bytes - this is because IPv6 addresses are too big for effective indexing
        //  and it is acceptably close to uniqueness with the hash
        return hashIPV6(address);
    }
    else {
        var _ip = address.split('.');
        //  reverse the order of bytes of the IP address for better shard distribution
        return Number(_ip[0]) * 16777216 +
            Number(_ip[1]) * 65536 +
            Number(_ip[2]) * 256 +
            Number(_ip[3]);
    }
}
exports.hash = hash;
//  Convert an IP address to a number.
function toNumber(address, reverse) {
    if (reverse === void 0) { reverse = false; }
    if (isIPV6(address)) {
        //  hash an IPv6 address to 4 bytes - this is because IPv6 addresses are too big for effective indexing
        //  and it is acceptably close to uniqueness with the hash
        return toNumberIPV6(address);
    }
    else {
        var _ip = address.split('.');
        //  create a number from the octets
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
exports.toNumber = toNumber;
//  Format an IP address to a storable format.
//  If IPv4: the ip address converted to a 32-bit integer
//  If IPv6: the ip address converted to a 16 byte binary
function compress(address) {
    if (!isIPV6(address)) {
        return toNumber32(address);
    }
    else {
        var parts = address.split(':');
        var bytes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < parts.length; i++) {
            //  When the :: is hit, start filling from the end of the array
            if (parts[i] == '') {
                break;
            }
            else {
                parts[i] = ('000' + parts[i]).slice(-4); //  deal with missing leading zeroes
                bytes[i * 2] = parseInt(parts[i].substr(0, 2), 16);
                bytes[i * 2 + 1] = parseInt(parts[i].substr(2, 2), 16);
            }
        }
        var index = 15;
        for (var j = parts.length - 1; j > i; j--) {
            parts[j] = ('000' + parts[j]).slice(-4); //  deal with missing leading zeroes
            bytes[index - 1] = parseInt(parts[j].substr(0, 2), 16);
            bytes[index] = parseInt(parts[j].substr(2, 2), 16);
            index -= 2;
        }
        return bytes;
    }
}
exports.compress = compress;
//  Convert an IP address to a 32-bit number.
function toNumber32(address) {
    if (isIPV6(address)) {
        //  hash an IPv6 address to 4 bytes - this is because IPv6 addresses are too big for effective indexing
        //  and it is acceptably close to uniqueness with the hash
        return toNumberIPV6(address);
    }
    else {
        var _ip = address.split('.');
        //  create a number from the octets
        var num = Number(_ip[0]) * 16777216 +
            Number(_ip[1]) * 65536 +
            Number(_ip[2]) * 256 +
            Number(_ip[3]);
        if (num >= 2147483648)
            num -= 4294967296;
        return num;
    }
}
exports.toNumber32 = toNumber32;
//  Convert an IP number (as created by the toNumber function) to an IP address
function fromNumber(ipNumber) {
    var addr = utils.toBytes(ipNumber);
    return addr[3] + '.' +
        addr[2] + '.' +
        addr[1] + '.' +
        addr[0];
}
exports.fromNumber = fromNumber;
//  Convert an IP address to a number.
function toNumberIPV6(address) {
    //  need to come up with an algorithm to convert ipv6 address to rangable numbers
    return 100;
}
exports.toNumberIPV6 = toNumberIPV6;
//# sourceMappingURL=ip.js.map