/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
const ANIMATION_PROP = 'animation';
const ANIMATIONEND_EVENT = 'animationend';
const ONE_SECOND = 1000;
export class ElementAnimationStyleHandler {
    constructor(_element, _name, _duration, _delay, _easing, _fillMode, _onDoneFn) {
        this._element = _element;
        this._name = _name;
        this._duration = _duration;
        this._delay = _delay;
        this._easing = _easing;
        this._fillMode = _fillMode;
        this._onDoneFn = _onDoneFn;
        this._finished = false;
        this._destroyed = false;
        this._startTime = 0;
        this._position = 0;
        this._eventFn = (e) => this._handleCallback(e);
    }
    apply() {
        applyKeyframeAnimation(this._element, `${this._duration}ms ${this._easing} ${this._delay}ms 1 normal ${this._fillMode} ${this._name}`);
        addRemoveAnimationEvent(this._element, this._eventFn, false);
        this._startTime = Date.now();
    }
    pause() {
        playPauseAnimation(this._element, this._name, 'paused');
    }
    resume() {
        playPauseAnimation(this._element, this._name, 'running');
    }
    setPosition(position) {
        const index = findIndexForAnimation(this._element, this._name);
        this._position = position * this._duration;
        setAnimationStyle(this._element, 'Delay', `-${this._position}ms`, index);
    }
    getPosition() {
        return this._position;
    }
    _handleCallback(event) {
        const timestamp = event._ngTestManualTimestamp || Date.now();
        const elapsedTime = parseFloat(event.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES)) * ONE_SECOND;
        if (event.animationName == this._name &&
            Math.max(timestamp - this._startTime, 0) >= this._delay && elapsedTime >= this._duration) {
            this.finish();
        }
    }
    finish() {
        if (this._finished)
            return;
        this._finished = true;
        this._onDoneFn();
        addRemoveAnimationEvent(this._element, this._eventFn, true);
    }
    destroy() {
        if (this._destroyed)
            return;
        this._destroyed = true;
        this.finish();
        removeKeyframeAnimation(this._element, this._name);
    }
}
function playPauseAnimation(element, name, status) {
    const index = findIndexForAnimation(element, name);
    setAnimationStyle(element, 'PlayState', status, index);
}
function applyKeyframeAnimation(element, value) {
    const anim = getAnimationStyle(element, '').trim();
    let index = 0;
    if (anim.length) {
        index = countChars(anim, ',') + 1;
        value = `${anim}, ${value}`;
    }
    setAnimationStyle(element, '', value);
    return index;
}
function removeKeyframeAnimation(element, name) {
    const anim = getAnimationStyle(element, '');
    const tokens = anim.split(',');
    const index = findMatchingTokenIndex(tokens, name);
    if (index >= 0) {
        tokens.splice(index, 1);
        const newValue = tokens.join(',');
        setAnimationStyle(element, '', newValue);
    }
}
function findIndexForAnimation(element, value) {
    const anim = getAnimationStyle(element, '');
    if (anim.indexOf(',') > 0) {
        const tokens = anim.split(',');
        return findMatchingTokenIndex(tokens, value);
    }
    return findMatchingTokenIndex([anim], value);
}
function findMatchingTokenIndex(tokens, searchToken) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].indexOf(searchToken) >= 0) {
            return i;
        }
    }
    return -1;
}
function addRemoveAnimationEvent(element, fn, doRemove) {
    doRemove ? element.removeEventListener(ANIMATIONEND_EVENT, fn) :
        element.addEventListener(ANIMATIONEND_EVENT, fn);
}
function setAnimationStyle(element, name, value, index) {
    const prop = ANIMATION_PROP + name;
    if (index != null) {
        const oldValue = element.style[prop];
        if (oldValue.length) {
            const tokens = oldValue.split(',');
            tokens[index] = value;
            value = tokens.join(',');
        }
    }
    element.style[prop] = value;
}
function getAnimationStyle(element, name) {
    return element.style[ANIMATION_PROP + name];
}
function countChars(value, char) {
    let count = 0;
    for (let i = 0; i < value.length; i++) {
        const c = value.charAt(i);
        if (c === char)
            count++;
    }
    return count;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9hbmltYXRpb25fc3R5bGVfaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvcmVuZGVyL2Nzc19rZXlmcmFtZXMvZWxlbWVudF9hbmltYXRpb25fc3R5bGVfaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxNQUFNLCtCQUErQixHQUFHLENBQUMsQ0FBQztBQUMxQyxNQUFNLGNBQWMsR0FBRyxXQUFXLENBQUM7QUFDbkMsTUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUM7QUFDMUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBRXhCLE1BQU0sT0FBTyw0QkFBNEI7SUFPdkMsWUFDcUIsUUFBYSxFQUFtQixLQUFhLEVBQzdDLFNBQWlCLEVBQW1CLE1BQWMsRUFDbEQsT0FBZSxFQUFtQixTQUErQixFQUNqRSxTQUFvQjtRQUhwQixhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDN0MsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUFtQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2xELFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBbUIsY0FBUyxHQUFULFNBQVMsQ0FBc0I7UUFDakUsY0FBUyxHQUFULFNBQVMsQ0FBVztRQVRqQyxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFPcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsS0FBSztRQUNILHNCQUFzQixDQUNsQixJQUFJLENBQUMsUUFB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R0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzFCO0tBQ0Y7SUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUM5QixDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxPQUFZLEVBQUUsSUFBWTtJQUNuRCxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxLQUFhLEVBQUUsSUFBWTtJQUM3QyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNyQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLElBQUk7WUFBRSxLQUFLLEVBQUUsQ0FBQztLQUN6QjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuY29uc3QgRUxBUFNFRF9USU1FX01BWF9ERUNJTUFMX1BMQUNFUyA9IDM7XG5jb25zdCBBTklNQVRJT05fUFJPUCA9ICdhbmltYXRpb24nO1xuY29uc3QgQU5JTUFUSU9ORU5EX0VWRU5UID0gJ2FuaW1hdGlvbmVuZCc7XG5jb25zdCBPTkVfU0VDT05EID0gMTAwMDtcblxuZXhwb3J0IGNsYXNzIEVsZW1lbnRBbmltYXRpb25TdHlsZUhhbmRsZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IF9ldmVudEZuOiAoZTogYW55KSA9PiBhbnk7XG4gIHByaXZhdGUgX2ZpbmlzaGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdGFydFRpbWUgPSAwO1xuICBwcml2YXRlIF9wb3NpdGlvbiA9IDA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IF9lbGVtZW50OiBhbnksIHByaXZhdGUgcmVhZG9ubHkgX25hbWU6IHN0cmluZyxcbiAgICAgIHByaXZhdGUgcmVhZG9ubHkgX2R1cmF0aW9uOiBudW1iZXIsIHByaXZhdGUgcmVhZG9ubHkgX2RlbGF5OiBudW1iZXIsXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IF9lYXNpbmc6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBfZmlsbE1vZGU6ICcnfCdib3RoJ3wnZm9yd2FyZHMnLFxuICAgICAgcHJpdmF0ZSByZWFkb25seSBfb25Eb25lRm46ICgpID0+IGFueSkge1xuICAgIHRoaXMuX2V2ZW50Rm4gPSAoZSkgPT4gdGhpcy5faGFuZGxlQ2FsbGJhY2soZSk7XG4gIH1cblxuICBhcHBseSgpIHtcbiAgICBhcHBseUtleWZyYW1lQW5pbWF0aW9uKFxuICAgICAgICB0aGlzLl9lbGVtZW50LFxuICAgICAgICBgJHt0aGlzLl9kdXJhdGlvbn1tcyAke3RoaXMuX2Vhc2luZ30gJHt0aGlzLl9kZWxheX1tcyAxIG5vcm1hbCAke3RoaXMuX2ZpbGxNb2RlfSAke1xuICAgICAgICAgICAgdGhpcy5fbmFtZX1gKTtcbiAgICBhZGRSZW1vdmVBbmltYXRpb25FdmVudCh0aGlzLl9lbGVtZW50LCB0aGlzLl9ldmVudEZuLCBmYWxzZSk7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgfVxuXG4gIHBhdXNlKCkge1xuICAgIHBsYXlQYXVzZUFuaW1hdGlvbih0aGlzLl9lbGVtZW50LCB0aGlzLl9uYW1lLCAncGF1c2VkJyk7XG4gIH1cblxuICByZXN1bWUoKSB7XG4gICAgcGxheVBhdXNlQW5pbWF0aW9uKHRoaXMuX2VsZW1lbnQsIHRoaXMuX25hbWUsICdydW5uaW5nJyk7XG4gIH1cblxuICBzZXRQb3NpdGlvbihwb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgY29uc3QgaW5kZXggPSBmaW5kSW5kZXhGb3JBbmltYXRpb24odGhpcy5fZWxlbWVudCwgdGhpcy5fbmFtZSk7XG4gICAgdGhpcy5fcG9zaXRpb24gPSBwb3NpdGlvbiAqIHRoaXMuX2R1cmF0aW9uO1xuICAgIHNldEFuaW1hdGlvblN0eWxlKHRoaXMuX2VsZW1lbnQsICdEZWxheScsIGAtJHt0aGlzLl9wb3NpdGlvbn1tc2AsIGluZGV4KTtcbiAgfVxuXG4gIGdldFBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgX2hhbmRsZUNhbGxiYWNrKGV2ZW50OiBhbnkpIHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBldmVudC5fbmdUZXN0TWFudWFsVGltZXN0YW1wIHx8IERhdGUubm93KCk7XG4gICAgY29uc3QgZWxhcHNlZFRpbWUgPVxuICAgICAgICBwYXJzZUZsb2F0KGV2ZW50LmVsYXBzZWRUaW1lLnRvRml4ZWQoRUxBUFNFRF9USU1FX01BWF9ERUNJTUFMX1BMQUNFUykpICogT05FX1NFQ09ORDtcbiAgICBpZiAoZXZlbnQuYW5pbWF0aW9uTmFtZSA9PSB0aGlzLl9uYW1lICYmXG4gICAgICAgIE1hdGgubWF4KHRpbWVzdGFtcCAtIHRoaXMuX3N0YXJ0VGltZSwgMCkgPj0gdGhpcy5fZGVsYXkgJiYgZWxhcHNlZFRpbWUgPj0gdGhpcy5fZHVyYXRpb24pIHtcbiAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgfVxuICB9XG5cbiAgZmluaXNoKCkge1xuICAgIGlmICh0aGlzLl9maW5pc2hlZCkgcmV0dXJuO1xuICAgIHRoaXMuX2ZpbmlzaGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9vbkRvbmVGbigpO1xuICAgIGFkZFJlbW92ZUFuaW1hdGlvbkV2ZW50KHRoaXMuX2VsZW1lbnQsIHRoaXMuX2V2ZW50Rm4sIHRydWUpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZGVzdHJveWVkKSByZXR1cm47XG4gICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLmZpbmlzaCgpO1xuICAgIHJlbW92ZUtleWZyYW1lQW5pbWF0aW9uKHRoaXMuX2VsZW1lbnQsIHRoaXMuX25hbWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBsYXlQYXVzZUFuaW1hdGlvbihlbGVtZW50OiBhbnksIG5hbWU6IHN0cmluZywgc3RhdHVzOiAncnVubmluZyd8J3BhdXNlZCcpIHtcbiAgY29uc3QgaW5kZXggPSBmaW5kSW5kZXhGb3JBbmltYXRpb24oZWxlbWVudCwgbmFtZSk7XG4gIHNldEFuaW1hdGlvblN0eWxlKGVsZW1lbnQsICdQbGF5U3RhdGUnLCBzdGF0dXMsIGluZGV4KTtcbn1cblxuZnVuY3Rpb24gYXBwbHlLZXlmcmFtZUFuaW1hdGlvbihlbGVtZW50OiBhbnksIHZhbHVlOiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCBhbmltID0gZ2V0QW5pbWF0aW9uU3R5bGUoZWxlbWVudCwgJycpLnRyaW0oKTtcbiAgbGV0IGluZGV4ID0gMDtcbiAgaWYgKGFuaW0ubGVuZ3RoKSB7XG4gICAgaW5kZXggPSBjb3VudENoYXJzKGFuaW0sICcsJykgKyAxO1xuICAgIHZhbHVlID0gYCR7YW5pbX0sICR7dmFsdWV9YDtcbiAgfVxuICBzZXRBbmltYXRpb25TdHlsZShlbGVtZW50LCAnJywgdmFsdWUpO1xuICByZXR1cm4gaW5kZXg7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUtleWZyYW1lQW5pbWF0aW9uKGVsZW1lbnQ6IGFueSwgbmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IGFuaW0gPSBnZXRBbmltYXRpb25TdHlsZShlbGVtZW50LCAnJyk7XG4gIGNvbnN0IHRva2VucyA9IGFuaW0uc3BsaXQoJywnKTtcbiAgY29uc3QgaW5kZXggPSBmaW5kTWF0Y2hpbmdUb2tlbkluZGV4KHRva2VucywgbmFtZSk7XG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgdG9rZW5zLnNwbGljZShpbmRleCwgMSk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB0b2tlbnMuam9pbignLCcpO1xuICAgIHNldEFuaW1hdGlvblN0eWxlKGVsZW1lbnQsICcnLCBuZXdWYWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZEluZGV4Rm9yQW5pbWF0aW9uKGVsZW1lbnQ6IGFueSwgdmFsdWU6IHN0cmluZykge1xuICBjb25zdCBhbmltID0gZ2V0QW5pbWF0aW9uU3R5bGUoZWxlbWVudCwgJycpO1xuICBpZiAoYW5pbS5pbmRleE9mKCcsJykgPiAwKSB7XG4gICAgY29uc3QgdG9rZW5zID0gYW5pbS5zcGxpdCgnLCcpO1xuICAgIHJldHVybiBmaW5kTWF0Y2hpbmdUb2tlbkluZGV4KHRva2VucywgdmFsdWUpO1xuICB9XG4gIHJldHVybiBmaW5kTWF0Y2hpbmdUb2tlbkluZGV4KFthbmltXSwgdmFsdWUpO1xufVxuXG5mdW5jdGlvbiBmaW5kTWF0Y2hpbmdUb2tlbkluZGV4KHRva2Vuczogc3RyaW5nW10sIHNlYXJjaFRva2VuOiBzdHJpbmcpOiBudW1iZXIge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0b2tlbnNbaV0uaW5kZXhPZihzZWFyY2hUb2tlbikgPj0gMCkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuZnVuY3Rpb24gYWRkUmVtb3ZlQW5pbWF0aW9uRXZlbnQoZWxlbWVudDogYW55LCBmbjogKGU6IGFueSkgPT4gYW55LCBkb1JlbW92ZTogYm9vbGVhbikge1xuICBkb1JlbW92ZSA/IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihBTklNQVRJT05FTkRfRVZFTlQsIGZuKSA6XG4gICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEFOSU1BVElPTkVORF9FVkVOVCwgZm4pO1xufVxuXG5mdW5jdGlvbiBzZXRBbmltYXRpb25TdHlsZShlbGVtZW50OiBhbnksIG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgaW5kZXg/OiBudW1iZXIpIHtcbiAgY29uc3QgcHJvcCA9IEFOSU1BVElPTl9QUk9QICsgbmFtZTtcbiAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICBjb25zdCBvbGRWYWx1ZSA9IGVsZW1lbnQuc3R5bGVbcHJvcF07XG4gICAgaWYgKG9sZFZhbHVlLmxlbmd0aCkge1xuICAgICAgY29uc3QgdG9rZW5zID0gb2xkVmFsdWUuc3BsaXQoJywnKTtcbiAgICAgIHRva2Vuc1tpbmRleF0gPSB2YWx1ZTtcbiAgICAgIHZhbHVlID0gdG9rZW5zLmpvaW4oJywnKTtcbiAgICB9XG4gIH1cbiAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBnZXRBbmltYXRpb25TdHlsZShlbGVtZW50OiBhbnksIG5hbWU6IHN0cmluZykge1xuICByZXR1cm4gZWxlbWVudC5zdHlsZVtBTklNQVRJT05fUFJPUCArIG5hbWVdO1xufVxuXG5mdW5jdGlvbiBjb3VudENoYXJzKHZhbHVlOiBzdHJpbmcsIGNoYXI6IHN0cmluZyk6IG51bWJlciB7XG4gIGxldCBjb3VudCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjID0gdmFsdWUuY2hhckF0KGkpO1xuICAgIGlmIChjID09PSBjaGFyKSBjb3VudCsrO1xuICB9XG4gIHJldHVybiBjb3VudDtcbn1cbiJdfQ==