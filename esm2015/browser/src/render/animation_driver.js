/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NoopAnimationPlayer } from '@angular/animations';
import { Injectable } from '@angular/core';
import { containsElement, invokeQuery, matchesElement, validateStyleProperty } from './shared';
import * as i0 from "@angular/core";
/**
 * @publicApi
 */
let NoopAnimationDriver = /** @class */ (() => {
    class NoopAnimationDriver {
        validateStyleProperty(prop) {
            return validateStyleProperty(prop);
        }
        matchesElement(element, selector) {
            return matchesElement(element, selector);
        }
        containsElement(elm1, elm2) {
            return containsElement(elm1, elm2);
        }
        query(element, selector, multi) {
            return invokeQuery(element, selector, multi);
        }
        computeStyle(element, prop, defaultValue) {
            return defaultValue || '';
        }
        animate(element, keyframes, duration, delay, easing, previousPlayers = [], scrubberAccessRequested) {
            return new NoopAnimationPlayer(duration, delay);
        }
    }
    NoopAnimationDriver.ɵfac = function NoopAnimationDriver_Factory(t) { return new (t || NoopAnimationDriver)(); };
    NoopAnimationDriver.ɵprov = i0.ɵɵdefineInjectable({ token: NoopAnimationDriver, factory: NoopAnimationDriver.ɵfac });
    return NoopAnimationDriver;
})();
export { NoopAnimationDriver };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NoopAnimationDriver, [{
        type: Injectable
    }], null, null); })();
/**
 * @publicApi
 */
let AnimationDriver = /** @class */ (() => {
    class AnimationDriver {
    }
    AnimationDriver.NOOP = new NoopAnimationDriver();
    return AnimationDriver;
})();
export { AnimationDriver };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2RyaXZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvcmVuZGVyL2FuaW1hdGlvbl9kcml2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFrQixtQkFBbUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3pFLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLGVBQWUsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLHFCQUFxQixFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUU3Rjs7R0FFRztBQUNIO0lBQUEsTUFDYSxtQkFBbUI7UUFDOUIscUJBQXFCLENBQUMsSUFBWTtZQUNoQyxPQUFPLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxjQUFjLENBQUMsT0FBWSxFQUFFLFFBQWdCO1lBQzNDLE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBRUQsZUFBZSxDQUFDLElBQVMsRUFBRSxJQUFTO1lBQ2xDLE9BQU8sZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQsS0FBSyxDQUFDLE9BQVksRUFBRSxRQUFnQixFQUFFLEtBQWM7WUFDbEQsT0FBTyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBRUQsWUFBWSxDQUFDLE9BQVksRUFBRSxJQUFZLEVBQUUsWUFBcUI7WUFDNUQsT0FBTyxZQUFZLElBQUksRUFBRSxDQUFDO1FBQzVCLENBQUM7UUFFRCxPQUFPLENBQ0gsT0FBWSxFQUFFLFNBQTJDLEVBQUUsUUFBZ0IsRUFBRSxLQUFhLEVBQzFGLE1BQWMsRUFBRSxrQkFBeUIsRUFBRSxFQUMzQyx1QkFBaUM7WUFDbkMsT0FBTyxJQUFJLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRCxDQUFDOzswRkExQlUsbUJBQW1COytEQUFuQixtQkFBbUIsV0FBbkIsbUJBQW1COzhCQWhCaEM7S0EyQ0M7U0EzQlksbUJBQW1CO2tEQUFuQixtQkFBbUI7Y0FEL0IsVUFBVTs7QUE4Qlg7O0dBRUc7QUFDSDtJQUFBLE1BQXNCLGVBQWU7O0lBQzVCLG9CQUFJLEdBQW9CLElBQUksbUJBQW1CLEVBQUUsQ0FBQztJQWUzRCxzQkFBQztLQUFBO1NBaEJxQixlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25QbGF5ZXIsIE5vb3BBbmltYXRpb25QbGF5ZXJ9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtjb250YWluc0VsZW1lbnQsIGludm9rZVF1ZXJ5LCBtYXRjaGVzRWxlbWVudCwgdmFsaWRhdGVTdHlsZVByb3BlcnR5fSBmcm9tICcuL3NoYXJlZCc7XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTm9vcEFuaW1hdGlvbkRyaXZlciBpbXBsZW1lbnRzIEFuaW1hdGlvbkRyaXZlciB7XG4gIHZhbGlkYXRlU3R5bGVQcm9wZXJ0eShwcm9wOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdmFsaWRhdGVTdHlsZVByb3BlcnR5KHByb3ApO1xuICB9XG5cbiAgbWF0Y2hlc0VsZW1lbnQoZWxlbWVudDogYW55LCBzZWxlY3Rvcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG1hdGNoZXNFbGVtZW50KGVsZW1lbnQsIHNlbGVjdG9yKTtcbiAgfVxuXG4gIGNvbnRhaW5zRWxlbWVudChlbG0xOiBhbnksIGVsbTI6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBjb250YWluc0VsZW1lbnQoZWxtMSwgZWxtMik7XG4gIH1cblxuICBxdWVyeShlbGVtZW50OiBhbnksIHNlbGVjdG9yOiBzdHJpbmcsIG11bHRpOiBib29sZWFuKTogYW55W10ge1xuICAgIHJldHVybiBpbnZva2VRdWVyeShlbGVtZW50LCBzZWxlY3RvciwgbXVsdGkpO1xuICB9XG5cbiAgY29tcHV0ZVN0eWxlKGVsZW1lbnQ6IGFueSwgcHJvcDogc3RyaW5nLCBkZWZhdWx0VmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBkZWZhdWx0VmFsdWUgfHwgJyc7XG4gIH1cblxuICBhbmltYXRlKFxuICAgICAgZWxlbWVudDogYW55LCBrZXlmcmFtZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd8bnVtYmVyfVtdLCBkdXJhdGlvbjogbnVtYmVyLCBkZWxheTogbnVtYmVyLFxuICAgICAgZWFzaW5nOiBzdHJpbmcsIHByZXZpb3VzUGxheWVyczogYW55W10gPSBbXSxcbiAgICAgIHNjcnViYmVyQWNjZXNzUmVxdWVzdGVkPzogYm9vbGVhbik6IEFuaW1hdGlvblBsYXllciB7XG4gICAgcmV0dXJuIG5ldyBOb29wQW5pbWF0aW9uUGxheWVyKGR1cmF0aW9uLCBkZWxheSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBbmltYXRpb25Ecml2ZXIge1xuICBzdGF0aWMgTk9PUDogQW5pbWF0aW9uRHJpdmVyID0gbmV3IE5vb3BBbmltYXRpb25Ecml2ZXIoKTtcblxuICBhYnN0cmFjdCB2YWxpZGF0ZVN0eWxlUHJvcGVydHkocHJvcDogc3RyaW5nKTogYm9vbGVhbjtcblxuICBhYnN0cmFjdCBtYXRjaGVzRWxlbWVudChlbGVtZW50OiBhbnksIHNlbGVjdG9yOiBzdHJpbmcpOiBib29sZWFuO1xuXG4gIGFic3RyYWN0IGNvbnRhaW5zRWxlbWVudChlbG0xOiBhbnksIGVsbTI6IGFueSk6IGJvb2xlYW47XG5cbiAgYWJzdHJhY3QgcXVlcnkoZWxlbWVudDogYW55LCBzZWxlY3Rvcjogc3RyaW5nLCBtdWx0aTogYm9vbGVhbik6IGFueVtdO1xuXG4gIGFic3RyYWN0IGNvbXB1dGVTdHlsZShlbGVtZW50OiBhbnksIHByb3A6IHN0cmluZywgZGVmYXVsdFZhbHVlPzogc3RyaW5nKTogc3RyaW5nO1xuXG4gIGFic3RyYWN0IGFuaW1hdGUoXG4gICAgICBlbGVtZW50OiBhbnksIGtleWZyYW1lczoge1trZXk6IHN0cmluZ106IHN0cmluZ3xudW1iZXJ9W10sIGR1cmF0aW9uOiBudW1iZXIsIGRlbGF5OiBudW1iZXIsXG4gICAgICBlYXNpbmc/OiBzdHJpbmd8bnVsbCwgcHJldmlvdXNQbGF5ZXJzPzogYW55W10sIHNjcnViYmVyQWNjZXNzUmVxdWVzdGVkPzogYm9vbGVhbik6IGFueTtcbn1cbiJdfQ==