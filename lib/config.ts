/// <reference path="../typings/node/node.d.ts" />

//  Return the environment the instance is running under
export function env(): string {
    if (process.env['NODE_ENV']) {
        return (<string>process.env['NODE_ENV']).toLowerCase();
    } else {
        return "default";
    }
}

//  Return whether the instance is in development mode or not
export function dev(): boolean {
    let check: string = process.env['NODE_ENV'] || "";
    return check.toLowerCase() == 'development' || check.toLowerCase() == 'local' || check.toLowerCase() == 'dev';
}

export function settings<T>(envir: string = env()): T {

    let path = '~/settings/';

    let cwd = process.cwd();

    if (cwd.indexOf('tests') > 1) {
        cwd = cwd.substr(0, cwd.indexOf('tests') - 1);
        path = cwd + '/' + path.replace(/\~\//, '');
    } else {
        path = cwd + '/' + path.replace(/\~\//, '');
    }

    let settings: T;

    try {
        settings = require(path + "settings-" + envir.toLowerCase());
    } catch (ex) {
        settings = require(path + "settings");
    }

    return settings;
}
