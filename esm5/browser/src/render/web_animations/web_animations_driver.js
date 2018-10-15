import { allowPreviousPlayerStylesMerge, balancePreviousStylesIntoKeyframes, copyStyles } from '../../util';
import { CssKeyframesDriver } from '../css_keyframes/css_keyframes_driver';
import { containsElement, invokeQuery, isBrowser, matchesElement, validateStyleProperty } from '../shared';
import { WebAnimationsPlayer } from './web_animations_player';
var WebAnimationsDriver = /** @class */ (function () {
    function WebAnimationsDriver() {
        this._isNativeImpl = /\{\s*\[native\s+code\]\s*\}/.test(getElementAnimateFn().toString());
        this._cssKeyframesDriver = new CssKeyframesDriver();
    }
    WebAnimationsDriver.prototype.validateStyleProperty = function (prop) { return validateStyleProperty(prop); };
    WebAnimationsDriver.prototype.matchesElement = function (element, selector) {
        return matchesElement(element, selector);
    };
    WebAnimationsDriver.prototype.containsElement = function (elm1, elm2) { return containsElement(elm1, elm2); };
    WebAnimationsDriver.prototype.query = function (element, selector, multi) {
        return invokeQuery(element, selector, multi);
    };
    WebAnimationsDriver.prototype.computeStyle = function (element, prop, defaultValue) {
        return window.getComputedStyle(element)[prop];
    };
    WebAnimationsDriver.prototype.overrideWebAnimationsSupport = function (supported) { this._isNativeImpl = supported; };
    WebAnimationsDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers, scrubberAccessRequested) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        var useKeyframes = !scrubberAccessRequested && !this._isNativeImpl;
        if (useKeyframes) {
            return this._cssKeyframesDriver.animate(element, keyframes, duration, delay, easing, previousPlayers);
        }
        var fill = delay == 0 ? 'both' : 'forwards';
        var playerOptions = { duration: duration, delay: delay, fill: fill };
        // we check for this to avoid having a null|undefined value be present
        // for the easing (which results in an error for certain browsers #9752)
        if (easing) {
            playerOptions['easing'] = easing;
        }
        var previousStyles = {};
        var previousWebAnimationPlayers = previousPlayers.filter(function (player) { return player instanceof WebAnimationsPlayer; });
        if (allowPreviousPlayerStylesMerge(duration, delay)) {
            previousWebAnimationPlayers.forEach(function (player) {
                var styles = player.currentSnapshot;
                Object.keys(styles).forEach(function (prop) { return previousStyles[prop] = styles[prop]; });
            });
        }
        keyframes = keyframes.map(function (styles) { return copyStyles(styles, false); });
        keyframes = balancePreviousStylesIntoKeyframes(element, keyframes, previousStyles);
        return new WebAnimationsPlayer(element, keyframes, playerOptions);
    };
    return WebAnimationsDriver;
}());
export { WebAnimationsDriver };
export function supportsWebAnimations() {
    return typeof getElementAnimateFn() === 'function';
}
function getElementAnimateFn() {
    return (isBrowser() && Element.prototype['animate']) || {};
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2FuaW1hdGlvbnNfZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvd2ViX2FuaW1hdGlvbnMvd2ViX2FuaW1hdGlvbnNfZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBQyw4QkFBOEIsRUFBRSxrQ0FBa0MsRUFBRSxVQUFVLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFMUcsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDekUsT0FBTyxFQUFDLGVBQWUsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxxQkFBcUIsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUV6RyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUU1RDtJQUFBO1FBQ1Usa0JBQWEsR0FBRyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3JGLHdCQUFtQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztJQW9EekQsQ0FBQztJQWxEQyxtREFBcUIsR0FBckIsVUFBc0IsSUFBWSxJQUFhLE9BQU8scUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXBGLDRDQUFjLEdBQWQsVUFBZSxPQUFZLEVBQUUsUUFBZ0I7UUFDM0MsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCw2Q0FBZSxHQUFmLFVBQWdCLElBQVMsRUFBRSxJQUFTLElBQWEsT0FBTyxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0RixtQ0FBSyxHQUFMLFVBQU0sT0FBWSxFQUFFLFFBQWdCLEVBQUUsS0FBYztRQUNsRCxPQUFPLFdBQVcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCwwQ0FBWSxHQUFaLFVBQWEsT0FBWSxFQUFFLElBQVksRUFBRSxZQUFxQjtRQUM1RCxPQUFRLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQVMsQ0FBQyxJQUFJLENBQVcsQ0FBQztJQUNuRSxDQUFDO0lBRUQsMERBQTRCLEdBQTVCLFVBQTZCLFNBQWtCLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBRXBGLHFDQUFPLEdBQVAsVUFDSSxPQUFZLEVBQUUsU0FBdUIsRUFBRSxRQUFnQixFQUFFLEtBQWEsRUFBRSxNQUFjLEVBQ3RGLGVBQXVDLEVBQUUsdUJBQWlDO1FBQTFFLGdDQUFBLEVBQUEsb0JBQXVDO1FBQ3pDLElBQU0sWUFBWSxHQUFHLENBQUMsdUJBQXVCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3JFLElBQUksWUFBWSxFQUFFO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FDbkMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztTQUNuRTtRQUVELElBQU0sSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQzlDLElBQU0sYUFBYSxHQUFxQyxFQUFDLFFBQVEsVUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUM7UUFDaEYsc0VBQXNFO1FBQ3RFLHdFQUF3RTtRQUN4RSxJQUFJLE1BQU0sRUFBRTtZQUNWLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUM7U0FDbEM7UUFFRCxJQUFNLGNBQWMsR0FBeUIsRUFBRSxDQUFDO1FBQ2hELElBQU0sMkJBQTJCLEdBQTBCLGVBQWUsQ0FBQyxNQUFNLENBQzdFLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxZQUFZLG1CQUFtQixFQUFyQyxDQUFxQyxDQUFDLENBQUM7UUFFckQsSUFBSSw4QkFBOEIsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDbkQsMkJBQTJCLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTTtnQkFDeEMsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztnQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO1FBQy9ELFNBQVMsR0FBRyxrQ0FBa0MsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ25GLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUF0REQsSUFzREM7O0FBRUQsTUFBTSxVQUFVLHFCQUFxQjtJQUNuQyxPQUFPLE9BQU8sbUJBQW1CLEVBQUUsS0FBSyxVQUFVLENBQUM7QUFDckQsQ0FBQztBQUVELFNBQVMsbUJBQW1CO0lBQzFCLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBVSxPQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3BFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FuaW1hdGlvblBsYXllciwgybVTdHlsZURhdGF9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5pbXBvcnQge2FsbG93UHJldmlvdXNQbGF5ZXJTdHlsZXNNZXJnZSwgYmFsYW5jZVByZXZpb3VzU3R5bGVzSW50b0tleWZyYW1lcywgY29weVN0eWxlc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge0FuaW1hdGlvbkRyaXZlcn0gZnJvbSAnLi4vYW5pbWF0aW9uX2RyaXZlcic7XG5pbXBvcnQge0Nzc0tleWZyYW1lc0RyaXZlcn0gZnJvbSAnLi4vY3NzX2tleWZyYW1lcy9jc3Nfa2V5ZnJhbWVzX2RyaXZlcic7XG5pbXBvcnQge2NvbnRhaW5zRWxlbWVudCwgaW52b2tlUXVlcnksIGlzQnJvd3NlciwgbWF0Y2hlc0VsZW1lbnQsIHZhbGlkYXRlU3R5bGVQcm9wZXJ0eX0gZnJvbSAnLi4vc2hhcmVkJztcblxuaW1wb3J0IHtXZWJBbmltYXRpb25zUGxheWVyfSBmcm9tICcuL3dlYl9hbmltYXRpb25zX3BsYXllcic7XG5cbmV4cG9ydCBjbGFzcyBXZWJBbmltYXRpb25zRHJpdmVyIGltcGxlbWVudHMgQW5pbWF0aW9uRHJpdmVyIHtcbiAgcHJpdmF0ZSBfaXNOYXRpdmVJbXBsID0gL1xce1xccypcXFtuYXRpdmVcXHMrY29kZVxcXVxccypcXH0vLnRlc3QoZ2V0RWxlbWVudEFuaW1hdGVGbigpLnRvU3RyaW5nKCkpO1xuICBwcml2YXRlIF9jc3NLZXlmcmFtZXNEcml2ZXIgPSBuZXcgQ3NzS2V5ZnJhbWVzRHJpdmVyKCk7XG5cbiAgdmFsaWRhdGVTdHlsZVByb3BlcnR5KHByb3A6IHN0cmluZyk6IGJvb2xlYW4geyByZXR1cm4gdmFsaWRhdGVTdHlsZVByb3BlcnR5KHByb3ApOyB9XG5cbiAgbWF0Y2hlc0VsZW1lbnQoZWxlbWVudDogYW55LCBzZWxlY3Rvcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG1hdGNoZXNFbGVtZW50KGVsZW1lbnQsIHNlbGVjdG9yKTtcbiAgfVxuXG4gIGNvbnRhaW5zRWxlbWVudChlbG0xOiBhbnksIGVsbTI6IGFueSk6IGJvb2xlYW4geyByZXR1cm4gY29udGFpbnNFbGVtZW50KGVsbTEsIGVsbTIpOyB9XG5cbiAgcXVlcnkoZWxlbWVudDogYW55LCBzZWxlY3Rvcjogc3RyaW5nLCBtdWx0aTogYm9vbGVhbik6IGFueVtdIHtcbiAgICByZXR1cm4gaW52b2tlUXVlcnkoZWxlbWVudCwgc2VsZWN0b3IsIG11bHRpKTtcbiAgfVxuXG4gIGNvbXB1dGVTdHlsZShlbGVtZW50OiBhbnksIHByb3A6IHN0cmluZywgZGVmYXVsdFZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpIGFzIGFueSlbcHJvcF0gYXMgc3RyaW5nO1xuICB9XG5cbiAgb3ZlcnJpZGVXZWJBbmltYXRpb25zU3VwcG9ydChzdXBwb3J0ZWQ6IGJvb2xlYW4pIHsgdGhpcy5faXNOYXRpdmVJbXBsID0gc3VwcG9ydGVkOyB9XG5cbiAgYW5pbWF0ZShcbiAgICAgIGVsZW1lbnQ6IGFueSwga2V5ZnJhbWVzOiDJtVN0eWxlRGF0YVtdLCBkdXJhdGlvbjogbnVtYmVyLCBkZWxheTogbnVtYmVyLCBlYXNpbmc6IHN0cmluZyxcbiAgICAgIHByZXZpb3VzUGxheWVyczogQW5pbWF0aW9uUGxheWVyW10gPSBbXSwgc2NydWJiZXJBY2Nlc3NSZXF1ZXN0ZWQ/OiBib29sZWFuKTogQW5pbWF0aW9uUGxheWVyIHtcbiAgICBjb25zdCB1c2VLZXlmcmFtZXMgPSAhc2NydWJiZXJBY2Nlc3NSZXF1ZXN0ZWQgJiYgIXRoaXMuX2lzTmF0aXZlSW1wbDtcbiAgICBpZiAodXNlS2V5ZnJhbWVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3NzS2V5ZnJhbWVzRHJpdmVyLmFuaW1hdGUoXG4gICAgICAgICAgZWxlbWVudCwga2V5ZnJhbWVzLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgcHJldmlvdXNQbGF5ZXJzKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxsID0gZGVsYXkgPT0gMCA/ICdib3RoJyA6ICdmb3J3YXJkcyc7XG4gICAgY29uc3QgcGxheWVyT3B0aW9uczoge1trZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlcn0gPSB7ZHVyYXRpb24sIGRlbGF5LCBmaWxsfTtcbiAgICAvLyB3ZSBjaGVjayBmb3IgdGhpcyB0byBhdm9pZCBoYXZpbmcgYSBudWxsfHVuZGVmaW5lZCB2YWx1ZSBiZSBwcmVzZW50XG4gICAgLy8gZm9yIHRoZSBlYXNpbmcgKHdoaWNoIHJlc3VsdHMgaW4gYW4gZXJyb3IgZm9yIGNlcnRhaW4gYnJvd3NlcnMgIzk3NTIpXG4gICAgaWYgKGVhc2luZykge1xuICAgICAgcGxheWVyT3B0aW9uc1snZWFzaW5nJ10gPSBlYXNpbmc7XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNTdHlsZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge307XG4gICAgY29uc3QgcHJldmlvdXNXZWJBbmltYXRpb25QbGF5ZXJzID0gPFdlYkFuaW1hdGlvbnNQbGF5ZXJbXT5wcmV2aW91c1BsYXllcnMuZmlsdGVyKFxuICAgICAgICBwbGF5ZXIgPT4gcGxheWVyIGluc3RhbmNlb2YgV2ViQW5pbWF0aW9uc1BsYXllcik7XG5cbiAgICBpZiAoYWxsb3dQcmV2aW91c1BsYXllclN0eWxlc01lcmdlKGR1cmF0aW9uLCBkZWxheSkpIHtcbiAgICAgIHByZXZpb3VzV2ViQW5pbWF0aW9uUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICAgIGxldCBzdHlsZXMgPSBwbGF5ZXIuY3VycmVudFNuYXBzaG90O1xuICAgICAgICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2gocHJvcCA9PiBwcmV2aW91c1N0eWxlc1twcm9wXSA9IHN0eWxlc1twcm9wXSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBrZXlmcmFtZXMgPSBrZXlmcmFtZXMubWFwKHN0eWxlcyA9PiBjb3B5U3R5bGVzKHN0eWxlcywgZmFsc2UpKTtcbiAgICBrZXlmcmFtZXMgPSBiYWxhbmNlUHJldmlvdXNTdHlsZXNJbnRvS2V5ZnJhbWVzKGVsZW1lbnQsIGtleWZyYW1lcywgcHJldmlvdXNTdHlsZXMpO1xuICAgIHJldHVybiBuZXcgV2ViQW5pbWF0aW9uc1BsYXllcihlbGVtZW50LCBrZXlmcmFtZXMsIHBsYXllck9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdXBwb3J0c1dlYkFuaW1hdGlvbnMoKSB7XG4gIHJldHVybiB0eXBlb2YgZ2V0RWxlbWVudEFuaW1hdGVGbigpID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50QW5pbWF0ZUZuKCk6IGFueSB7XG4gIHJldHVybiAoaXNCcm93c2VyKCkgJiYgKDxhbnk+RWxlbWVudCkucHJvdG90eXBlWydhbmltYXRlJ10pIHx8IHt9O1xufVxuIl19