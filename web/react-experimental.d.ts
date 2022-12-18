import * as React from 'react';
declare module 'react' {
    function cache<T extends Function>(fn: T): T;
    function use<T>(promise: Promise<T>): T;
}
