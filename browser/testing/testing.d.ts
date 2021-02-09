/**
 * @license Angular v11.2.0-rc.0+63.sha-415ad8d
 * (c) 2010-2020 Google LLC. https://angular.io/
 * License: MIT
 */

import { AnimationDriver } from '@angular/animations/browser';
import { AnimationPlayer } from '@angular/animations';
import { NoopAnimationPlayer } from '@angular/animations';
import { ɵStyleData } from '@angular/animations';

/**
 * @publicApi
 */
export declare class MockAnimationDriver implements AnimationDriver {
    static log: AnimationPlayer[];
    validateStyleProperty(prop: string): boolean;
    matchesElement(element: any, selector: string): boolean;
    containsElement(elm1: any, elm2: any): boolean;
    query(element: any, selector: string, multi: boolean): any[];
    computeStyle(element: any, prop: string, defaultValue?: string): string;
    animate(element: any, keyframes: {
        [key: string]: string | number;
    }[], duration: number, delay: number, easing: string, previousPlayers?: any[]): MockAnimationPlayer;
}

/**
 * @publicApi
 */
export declare class MockAnimationPlayer extends NoopAnimationPlayer {
    element: any;
    keyframes: {
        [key: string]: string | number;
    }[];
    duration: number;
    delay: number;
    easing: string;
    previousPlayers: any[];
    private __finished;
    private __started;
    previousStyles: {
        [key: string]: string | number;
    };
    private _onInitFns;
    currentSnapshot: ɵStyleData;
    constructor(element: any, keyframes: {
        [key: string]: string | number;
    }[], duration: number, delay: number, easing: string, previousPlayers: any[]);
    finish(): void;
    destroy(): void;
    play(): void;
    hasStarted(): boolean;
    beforeDestroy(): void;
}

export { }
