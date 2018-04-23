import { allowPreviousPlayerStylesMerge, balancePreviousStylesIntoKeyframes } from '../../util';
import { containsElement, invokeQuery, matchesElement, validateStyleProperty } from '../shared';
import { CssKeyframesPlayer } from './css_keyframes_player';
import { DirectStylePlayer } from './direct_style_player';
var KEYFRAMES_NAME_PREFIX = 'gen_css_kf_';
var TAB_SPACE = ' ';
var CssKeyframesDriver = /** @class */ (function () {
    function CssKeyframesDriver() {
        this._count = 0;
        this._head = document.querySelector('head');
        this._warningIssued = false;
    }
    CssKeyframesDriver.prototype.validateStyleProperty = function (prop) { return validateStyleProperty(prop); };
    CssKeyframesDriver.prototype.matchesElement = function (element, selector) {
        return matchesElement(element, selector);
    };
    CssKeyframesDriver.prototype.containsElement = function (elm1, elm2) { return containsElement(elm1, elm2); };
    CssKeyframesDriver.prototype.query = function (element, selector, multi) {
        return invokeQuery(element, selector, multi);
    };
    CssKeyframesDriver.prototype.computeStyle = function (element, prop, defaultValue) {
        return window.getComputedStyle(element)[prop];
    };
    CssKeyframesDriver.prototype.buildKeyframeElement = function (element, name, keyframes) {
        keyframes = keyframes.map(function (kf) { return hypenatePropsObject(kf); });
        var keyframeStr = "@keyframes " + name + " {\n";
        var tab = '';
        keyframes.forEach(function (kf) {
            tab = TAB_SPACE;
            var offset = parseFloat(kf.offset);
            keyframeStr += "" + tab + offset * 100 + "% {\n";
            tab += TAB_SPACE;
            Object.keys(kf).forEach(function (prop) {
                var value = kf[prop];
                switch (prop) {
                    case 'offset':
                        return;
                    case 'easing':
                        if (value) {
                            keyframeStr += tab + "animation-timing-function: " + value + ";\n";
                        }
                        return;
                    default:
                        keyframeStr += "" + tab + prop + ": " + value + ";\n";
                        return;
                }
            });
            keyframeStr += tab + "}\n";
        });
        keyframeStr += "}\n";
        var kfElm = document.createElement('style');
        kfElm.innerHTML = keyframeStr;
        return kfElm;
    };
    CssKeyframesDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers, scrubberAccessRequested) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        if (scrubberAccessRequested) {
            this._notifyFaultyScrubber();
        }
        var previousCssKeyframePlayers = previousPlayers.filter(function (player) { return player instanceof CssKeyframesPlayer; });
        var previousStyles = {};
        if (allowPreviousPlayerStylesMerge(duration, delay)) {
            previousCssKeyframePlayers.forEach(function (player) {
                var styles = player.currentSnapshot;
                Object.keys(styles).forEach(function (prop) { return previousStyles[prop] = styles[prop]; });
            });
        }
        keyframes = balancePreviousStylesIntoKeyframes(element, keyframes, previousStyles);
        var finalStyles = flattenKeyframesIntoStyles(keyframes);
        // if there is no animation then there is no point in applying
        // styles and waiting for an event to get fired. This causes lag.
        // It's better to just directly apply the styles to the element
        // via the direct styling animation player.
        if (duration == 0) {
            return new DirectStylePlayer(element, finalStyles);
        }
        var animationName = "" + KEYFRAMES_NAME_PREFIX + this._count++;
        var kfElm = this.buildKeyframeElement(element, animationName, keyframes);
        document.querySelector('head').appendChild(kfElm);
        var player = new CssKeyframesPlayer(element, keyframes, animationName, duration, delay, easing, finalStyles);
        player.onDestroy(function () { return removeElement(kfElm); });
        return player;
    };
    CssKeyframesDriver.prototype._notifyFaultyScrubber = function () {
        if (!this._warningIssued) {
            console.warn('@angular/animations: please load the web-animations.js polyfill to allow programmatic access...\n', '  visit http://bit.ly/IWukam to learn more about using the web-animation-js polyfill.');
            this._warningIssued = true;
        }
    };
    return CssKeyframesDriver;
}());
export { CssKeyframesDriver };
function flattenKeyframesIntoStyles(keyframes) {
    var flatKeyframes = {};
    if (keyframes) {
        var kfs = Array.isArray(keyframes) ? keyframes : [keyframes];
        kfs.forEach(function (kf) {
            Object.keys(kf).forEach(function (prop) {
                if (prop == 'offset' || prop == 'easing')
                    return;
                flatKeyframes[prop] = kf[prop];
            });
        });
    }
    return flatKeyframes;
}
function hypenatePropsObject(object) {
    var newObj = {};
    Object.keys(object).forEach(function (prop) {
        var newProp = prop.replace(/([a-z])([A-Z])/g, '$1-$2');
        newObj[newProp] = object[prop];
    });
    return newObj;
}
function removeElement(node) {
    node.parentNode.removeChild(node);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzX2tleWZyYW1lc19kcml2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL3JlbmRlci9jc3Nfa2V5ZnJhbWVzL2Nzc19rZXlmcmFtZXNfZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBQyw4QkFBOEIsRUFBRSxrQ0FBa0MsRUFBZSxNQUFNLFlBQVksQ0FBQztBQUU1RyxPQUFPLEVBQUMsZUFBZSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFOUYsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFeEQsSUFBTSxxQkFBcUIsR0FBRyxhQUFhLENBQUM7QUFDNUMsSUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBRXRCLElBQUE7O3NCQUNtQixDQUFDO3FCQUNZLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDOzhCQUNuQyxLQUFLOztJQUU5QixrREFBcUIsR0FBckIsVUFBc0IsSUFBWSxJQUFhLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0lBRXBGLDJDQUFjLEdBQWQsVUFBZSxPQUFZLEVBQUUsUUFBZ0I7UUFDM0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDMUM7SUFFRCw0Q0FBZSxHQUFmLFVBQWdCLElBQVMsRUFBRSxJQUFTLElBQWEsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRTtJQUV0RixrQ0FBSyxHQUFMLFVBQU0sT0FBWSxFQUFFLFFBQWdCLEVBQUUsS0FBYztRQUNsRCxNQUFNLENBQUMsV0FB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ZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25QbGF5ZXIsIMm1U3R5bGVEYXRhfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuaW1wb3J0IHthbGxvd1ByZXZpb3VzUGxheWVyU3R5bGVzTWVyZ2UsIGJhbGFuY2VQcmV2aW91c1N0eWxlc0ludG9LZXlmcmFtZXMsIGNvbXB1dGVTdHlsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge0FuaW1hdGlvbkRyaXZlcn0gZnJvbSAnLi4vYW5pbWF0aW9uX2RyaXZlcic7XG5pbXBvcnQge2NvbnRhaW5zRWxlbWVudCwgaW52b2tlUXVlcnksIG1hdGNoZXNFbGVtZW50LCB2YWxpZGF0ZVN0eWxlUHJvcGVydHl9IGZyb20gJy4uL3NoYXJlZCc7XG5cbmltcG9ydCB7Q3NzS2V5ZnJhbWVzUGxheWVyfSBmcm9tICcuL2Nzc19rZXlmcmFtZXNfcGxheWVyJztcbmltcG9ydCB7RGlyZWN0U3R5bGVQbGF5ZXJ9IGZyb20gJy4vZGlyZWN0X3N0eWxlX3BsYXllcic7XG5cbmNvbnN0IEtFWUZSQU1FU19OQU1FX1BSRUZJWCA9ICdnZW5fY3NzX2tmXyc7XG5jb25zdCBUQUJfU1BBQ0UgPSAnICc7XG5cbmV4cG9ydCBjbGFzcyBDc3NLZXlmcmFtZXNEcml2ZXIgaW1wbGVtZW50cyBBbmltYXRpb25Ecml2ZXIge1xuICBwcml2YXRlIF9jb3VudCA9IDA7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2hlYWQ6IGFueSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKTtcbiAgcHJpdmF0ZSBfd2FybmluZ0lzc3VlZCA9IGZhbHNlO1xuXG4gIHZhbGlkYXRlU3R5bGVQcm9wZXJ0eShwcm9wOiBzdHJpbmcpOiBib29sZWFuIHsgcmV0dXJuIHZhbGlkYXRlU3R5bGVQcm9wZXJ0eShwcm9wKTsgfVxuXG4gIG1hdGNoZXNFbGVtZW50KGVsZW1lbnQ6IGFueSwgc2VsZWN0b3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBtYXRjaGVzRWxlbWVudChlbGVtZW50LCBzZWxlY3Rvcik7XG4gIH1cblxuICBjb250YWluc0VsZW1lbnQoZWxtMTogYW55LCBlbG0yOiBhbnkpOiBib29sZWFuIHsgcmV0dXJuIGNvbnRhaW5zRWxlbWVudChlbG0xLCBlbG0yKTsgfVxuXG4gIHF1ZXJ5KGVsZW1lbnQ6IGFueSwgc2VsZWN0b3I6IHN0cmluZywgbXVsdGk6IGJvb2xlYW4pOiBhbnlbXSB7XG4gICAgcmV0dXJuIGludm9rZVF1ZXJ5KGVsZW1lbnQsIHNlbGVjdG9yLCBtdWx0aSk7XG4gIH1cblxuICBjb21wdXRlU3R5bGUoZWxlbWVudDogYW55LCBwcm9wOiBzdHJpbmcsIGRlZmF1bHRWYWx1ZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSBhcyBhbnkpW3Byb3BdIGFzIHN0cmluZztcbiAgfVxuXG4gIGJ1aWxkS2V5ZnJhbWVFbGVtZW50KGVsZW1lbnQ6IGFueSwgbmFtZTogc3RyaW5nLCBrZXlmcmFtZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9W10pOiBhbnkge1xuICAgIGtleWZyYW1lcyA9IGtleWZyYW1lcy5tYXAoa2YgPT4gaHlwZW5hdGVQcm9wc09iamVjdChrZikpO1xuICAgIGxldCBrZXlmcmFtZVN0ciA9IGBAa2V5ZnJhbWVzICR7bmFtZX0ge1xcbmA7XG4gICAgbGV0IHRhYiA9ICcnO1xuICAgIGtleWZyYW1lcy5mb3JFYWNoKGtmID0+IHtcbiAgICAgIHRhYiA9IFRBQl9TUEFDRTtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHBhcnNlRmxvYXQoa2Yub2Zmc2V0KTtcbiAgICAgIGtleWZyYW1lU3RyICs9IGAke3RhYn0ke29mZnNldCAqIDEwMH0lIHtcXG5gO1xuICAgICAgdGFiICs9IFRBQl9TUEFDRTtcbiAgICAgIE9iamVjdC5rZXlzKGtmKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGtmW3Byb3BdO1xuICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICBjYXNlICdvZmZzZXQnOlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGNhc2UgJ2Vhc2luZyc6XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAga2V5ZnJhbWVTdHIgKz0gYCR7dGFifWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246ICR7dmFsdWV9O1xcbmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGtleWZyYW1lU3RyICs9IGAke3RhYn0ke3Byb3B9OiAke3ZhbHVlfTtcXG5gO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGtleWZyYW1lU3RyICs9IGAke3RhYn19XFxuYDtcbiAgICB9KTtcbiAgICBrZXlmcmFtZVN0ciArPSBgfVxcbmA7XG5cbiAgICBjb25zdCBrZkVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAga2ZFbG0uaW5uZXJIVE1MID0ga2V5ZnJhbWVTdHI7XG4gICAgcmV0dXJuIGtmRWxtO1xuICB9XG5cbiAgYW5pbWF0ZShcbiAgICAgIGVsZW1lbnQ6IGFueSwga2V5ZnJhbWVzOiDJtVN0eWxlRGF0YVtdLCBkdXJhdGlvbjogbnVtYmVyLCBkZWxheTogbnVtYmVyLCBlYXNpbmc6IHN0cmluZyxcbiAgICAgIHByZXZpb3VzUGxheWVyczogQW5pbWF0aW9uUGxheWVyW10gPSBbXSwgc2NydWJiZXJBY2Nlc3NSZXF1ZXN0ZWQ/OiBib29sZWFuKTogQW5pbWF0aW9uUGxheWVyIHtcbiAgICBpZiAoc2NydWJiZXJBY2Nlc3NSZXF1ZXN0ZWQpIHtcbiAgICAgIHRoaXMuX25vdGlmeUZhdWx0eVNjcnViYmVyKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNDc3NLZXlmcmFtZVBsYXllcnMgPSA8Q3NzS2V5ZnJhbWVzUGxheWVyW10+cHJldmlvdXNQbGF5ZXJzLmZpbHRlcihcbiAgICAgICAgcGxheWVyID0+IHBsYXllciBpbnN0YW5jZW9mIENzc0tleWZyYW1lc1BsYXllcik7XG5cbiAgICBjb25zdCBwcmV2aW91c1N0eWxlczoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fTtcblxuICAgIGlmIChhbGxvd1ByZXZpb3VzUGxheWVyU3R5bGVzTWVyZ2UoZHVyYXRpb24sIGRlbGF5KSkge1xuICAgICAgcHJldmlvdXNDc3NLZXlmcmFtZVBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgICBsZXQgc3R5bGVzID0gcGxheWVyLmN1cnJlbnRTbmFwc2hvdDtcbiAgICAgICAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKHByb3AgPT4gcHJldmlvdXNTdHlsZXNbcHJvcF0gPSBzdHlsZXNbcHJvcF0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAga2V5ZnJhbWVzID0gYmFsYW5jZVByZXZpb3VzU3R5bGVzSW50b0tleWZyYW1lcyhlbGVtZW50LCBrZXlmcmFtZXMsIHByZXZpb3VzU3R5bGVzKTtcbiAgICBjb25zdCBmaW5hbFN0eWxlcyA9IGZsYXR0ZW5LZXlmcmFtZXNJbnRvU3R5bGVzKGtleWZyYW1lcyk7XG5cbiAgICAvLyBpZiB0aGVyZSBpcyBubyBhbmltYXRpb24gdGhlbiB0aGVyZSBpcyBubyBwb2ludCBpbiBhcHBseWluZ1xuICAgIC8vIHN0eWxlcyBhbmQgd2FpdGluZyBmb3IgYW4gZXZlbnQgdG8gZ2V0IGZpcmVkLiBUaGlzIGNhdXNlcyBsYWcuXG4gICAgLy8gSXQncyBiZXR0ZXIgdG8ganVzdCBkaXJlY3RseSBhcHBseSB0aGUgc3R5bGVzIHRvIHRoZSBlbGVtZW50XG4gICAgLy8gdmlhIHRoZSBkaXJlY3Qgc3R5bGluZyBhbmltYXRpb24gcGxheWVyLlxuICAgIGlmIChkdXJhdGlvbiA9PSAwKSB7XG4gICAgICByZXR1cm4gbmV3IERpcmVjdFN0eWxlUGxheWVyKGVsZW1lbnQsIGZpbmFsU3R5bGVzKTtcbiAgICB9XG5cbiAgICBjb25zdCBhbmltYXRpb25OYW1lID0gYCR7S0VZRlJBTUVTX05BTUVfUFJFRklYfSR7dGhpcy5fY291bnQrK31gO1xuICAgIGNvbnN0IGtmRWxtID0gdGhpcy5idWlsZEtleWZyYW1lRWxlbWVudChlbGVtZW50LCBhbmltYXRpb25OYW1lLCBrZXlmcmFtZXMpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKSAhLmFwcGVuZENoaWxkKGtmRWxtKTtcblxuICAgIGNvbnN0IHBsYXllciA9IG5ldyBDc3NLZXlmcmFtZXNQbGF5ZXIoXG4gICAgICAgIGVsZW1lbnQsIGtleWZyYW1lcywgYW5pbWF0aW9uTmFtZSwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGZpbmFsU3R5bGVzKTtcblxuICAgIHBsYXllci5vbkRlc3Ryb3koKCkgPT4gcmVtb3ZlRWxlbWVudChrZkVsbSkpO1xuICAgIHJldHVybiBwbGF5ZXI7XG4gIH1cblxuICBwcml2YXRlIF9ub3RpZnlGYXVsdHlTY3J1YmJlcigpIHtcbiAgICBpZiAoIXRoaXMuX3dhcm5pbmdJc3N1ZWQpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnQGFuZ3VsYXIvYW5pbWF0aW9uczogcGxlYXNlIGxvYWQgdGhlIHdlYi1hbmltYXRpb25zLmpzIHBvbHlmaWxsIHRvIGFsbG93IHByb2dyYW1tYXRpYyBhY2Nlc3MuLi5cXG4nLFxuICAgICAgICAgICcgIHZpc2l0IGh0dHA6Ly9iaXQubHkvSVd1a2FtIHRvIGxlYXJuIG1vcmUgYWJvdXQgdXNpbmcgdGhlIHdlYi1hbmltYXRpb24tanMgcG9seWZpbGwuJyk7XG4gICAgICB0aGlzLl93YXJuaW5nSXNzdWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmxhdHRlbktleWZyYW1lc0ludG9TdHlsZXMoXG4gICAga2V5ZnJhbWVzOiBudWxsIHwge1trZXk6IHN0cmluZ106IGFueX0gfCB7W2tleTogc3RyaW5nXTogYW55fVtdKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICBsZXQgZmxhdEtleWZyYW1lczoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgaWYgKGtleWZyYW1lcykge1xuICAgIGNvbnN0IGtmcyA9IEFycmF5LmlzQXJyYXkoa2V5ZnJhbWVzKSA/IGtleWZyYW1lcyA6IFtrZXlmcmFtZXNdO1xuICAgIGtmcy5mb3JFYWNoKGtmID0+IHtcbiAgICAgIE9iamVjdC5rZXlzKGtmKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICBpZiAocHJvcCA9PSAnb2Zmc2V0JyB8fCBwcm9wID09ICdlYXNpbmcnKSByZXR1cm47XG4gICAgICAgIGZsYXRLZXlmcmFtZXNbcHJvcF0gPSBrZltwcm9wXTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBmbGF0S2V5ZnJhbWVzO1xufVxuXG5mdW5jdGlvbiBoeXBlbmF0ZVByb3BzT2JqZWN0KG9iamVjdDoge1trZXk6IHN0cmluZ106IGFueX0pOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gIGNvbnN0IG5ld09iajoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKHByb3AgPT4ge1xuICAgIGNvbnN0IG5ld1Byb3AgPSBwcm9wLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpO1xuICAgIG5ld09ialtuZXdQcm9wXSA9IG9iamVjdFtwcm9wXTtcbiAgfSk7XG4gIHJldHVybiBuZXdPYmo7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQobm9kZTogYW55KSB7XG4gIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cbiJdfQ==