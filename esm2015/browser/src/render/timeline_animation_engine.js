/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AUTO_STYLE } from '@angular/animations';
import { buildAnimationAst } from '../dsl/animation_ast_builder';
import { buildAnimationTimelines } from '../dsl/animation_timeline_builder';
import { ElementInstructionMap } from '../dsl/element_instruction_map';
import { ENTER_CLASSNAME, LEAVE_CLASSNAME } from '../util';
import { getOrSetAsInMap, listenOnPlayer, makeAnimationEvent, normalizeKeyframes, optimizeGroupPlayer } from './shared';
const EMPTY_INSTRUCTION_MAP = new ElementInstructionMap();
export class TimelineAnimationEngine {
    constructor(bodyNode, _driver, _normalizer) {
        this.bodyNode = bodyNode;
        this._driver = _driver;
        this._normalizer = _normalizer;
        this._animations = {};
        this._playersById = {};
        this.players = [];
    }
    register(id, metadata) {
        const errors = [];
        const ast = buildAnimationAst(this._driver, metadata, errors);
        if (errors.length) {
            throw new Error(`Unable to build the animation due to the following errors: ${errors.join("\n")}`);
        }
        else {
            this._animations[id] = ast;
        }
    }
    _buildPlayer(i, preStyles, postStyles) {
        const element = i.element;
        const keyframes = normalizeKeyframes(this._driver, this._normalizer, element, i.keyframes, preStyles, postStyles);
        return this._driver.animate(element, keyframes, i.duration, i.delay, i.easing, [], true);
    }
    create(id, element, options = {}) {
        const errors = [];
        const ast = this._animations[id];
        let instructions;
        const autoStylesMap = new Map();
        if (ast) {
            instructions = buildAnimationTimelines(this._driver, element, ast, ENTER_CLASSNAME, LEAVE_CLASSNAME, {}, {}, options, EMPTY_INSTRUCTION_MAP, errors);
            instructions.forEach(inst => {
                const styles = getOrSetAsInMap(autoStylesMap, inst.element, {});
                inst.postStyleProps.forEach(prop => styles[prop] = null);
            });
        }
        else {
            errors.push('The requested animation doesn\'t exist or has already been destroyed');
            instructions = [];
        }
        if (errors.length) {
            throw new Error(`Unable to create the animation due to the following errors: ${errors.join("\n")}`);
        }
        autoStylesMap.forEach((styles, element) => {
            Object.keys(styles).forEach(prop => { styles[prop] = this._driver.computeStyle(element, prop, AUTO_STYLE); });
        });
        const players = instructions.map(i => {
            const styles = autoStylesMap.get(i.element);
            return this._buildPlayer(i, {}, styles);
        });
        const player = optimizeGroupPlayer(players);
        this._playersById[id] = player;
        player.onDestroy(() => this.destroy(id));
        this.players.push(player);
        return player;
    }
    destroy(id) {
        const player = this._getPlayer(id);
        player.destroy();
        delete this._playersById[id];
        const index = this.players.indexOf(player);
        if (index >= 0) {
            this.players.splice(index, 1);
        }
    }
    _getPlayer(id) {
        const player = this._playersById[id];
        if (!player) {
            throw new Error(`Unable to find the timeline player referenced by ${id}`);
        }
        return player;
    }
    listen(id, element, eventName, callback) {
        // triggerName, fromState, toState are all ignored for timeline animations
        const baseEvent = makeAnimationEvent(element, '', '', '');
        listenOnPlayer(this._getPlayer(id), eventName, baseEvent, callback);
        return () => { };
    }
    command(id, element, command, args) {
        if (command == 'register') {
            this.register(id, args[0]);
            return;
        }
        if (command == 'create') {
            const options = (args[0] || {});
            this.create(id, element, options);
            return;
        }
        const player = this._getPlayer(id);
        switch (command) {
            case 'play':
                player.play();
                break;
            case 'pause':
                player.pause();
                break;
            case 'reset':
                player.reset();
                break;
            case 'restart':
                player.restart();
                break;
            case 'finish':
                player.finish();
                break;
            case 'init':
                player.init();
                break;
            case 'setPosition':
                player.setPosition(parseFloat(args[0]));
                break;
            case 'destroy':
                this.destroy(id);
                break;
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmVfYW5pbWF0aW9uX2VuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvcmVuZGVyL3RpbWVsaW5lX2FuaW1hdGlvbl9lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBMEYsTUFBTSxxQkFBcUIsQ0FBQztBQUd4SSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUUxRSxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVyRSxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUd6RCxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUV0SCxNQUFNLHFCQUFxQixHQUFHLElBQUkscUJBQXFCLEVBQUUsQ0FBQztBQUUxRCxNQUFNLE9BQU8sdUJBQXVCO0lBS2xDLFlBQ1csUUFBYSxFQUFVLE9BQXdCLEVBQzlDLFdBQXFDO1FBRHRDLGFBQVEsR0FBUixRQUFRLENBQUs7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUM5QyxnQkFBVyxHQUFYLFdBQVcsQ0FBMEI7UUFOekMsZ0JBQVcsR0FBK0MsRUFBRSxDQUFDO1FBQzdELGlCQUFZLEdBQW9DLEVBQUUsQ0FBQztRQUNwRCxZQUFPLEdBQXNCLEVBQUUsQ0FBQztJQUlhLENBQUM7SUFFckQsUUFBUSxDQUFDLEVBQVUsRUFBRSxRQUErQztRQUNsRSxNQUFNLE1BQU0sR0FBVSxFQUFFLENBQUM7UUFDekIsTUFBTSxHQUFHLEdBQUcsaUJBQWlCLENB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QUFNLEVBQUUsQ0FBQztnQkFDaEIsTUFBTTtZQUNSLEtBQUssTUFBTTtnQkFDVCxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2QsTUFBTTtZQUNSLEtBQUssYUFBYTtnQkFDaEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsTUFBTTtZQUNSLEtBQUssU0FBUztnQkFDWixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQixNQUFNO1NBQ1Q7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FVVE9fU1RZTEUsIEFuaW1hdGlvbk1ldGFkYXRhLCBBbmltYXRpb25NZXRhZGF0YVR5cGUsIEFuaW1hdGlvbk9wdGlvbnMsIEFuaW1hdGlvblBsYXllciwgybVTdHlsZURhdGF9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5pbXBvcnQge0FzdH0gZnJvbSAnLi4vZHNsL2FuaW1hdGlvbl9hc3QnO1xuaW1wb3J0IHtidWlsZEFuaW1hdGlvbkFzdH0gZnJvbSAnLi4vZHNsL2FuaW1hdGlvbl9hc3RfYnVpbGRlcic7XG5pbXBvcnQge2J1aWxkQW5pbWF0aW9uVGltZWxpbmVzfSBmcm9tICcuLi9kc2wvYW5pbWF0aW9uX3RpbWVsaW5lX2J1aWxkZXInO1xuaW1wb3J0IHtBbmltYXRpb25UaW1lbGluZUluc3RydWN0aW9ufSBmcm9tICcuLi9kc2wvYW5pbWF0aW9uX3RpbWVsaW5lX2luc3RydWN0aW9uJztcbmltcG9ydCB7RWxlbWVudEluc3RydWN0aW9uTWFwfSBmcm9tICcuLi9kc2wvZWxlbWVudF9pbnN0cnVjdGlvbl9tYXAnO1xuaW1wb3J0IHtBbmltYXRpb25TdHlsZU5vcm1hbGl6ZXJ9IGZyb20gJy4uL2RzbC9zdHlsZV9ub3JtYWxpemF0aW9uL2FuaW1hdGlvbl9zdHlsZV9ub3JtYWxpemVyJztcbmltcG9ydCB7RU5URVJfQ0xBU1NOQU1FLCBMRUFWRV9DTEFTU05BTUV9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge0FuaW1hdGlvbkRyaXZlcn0gZnJvbSAnLi9hbmltYXRpb25fZHJpdmVyJztcbmltcG9ydCB7Z2V0T3JTZXRBc0luTWFwLCBsaXN0ZW5PblBsYXllciwgbWFrZUFuaW1hdGlvbkV2ZW50LCBub3JtYWxpemVLZXlmcmFtZXMsIG9wdGltaXplR3JvdXBQbGF5ZXJ9IGZyb20gJy4vc2hhcmVkJztcblxuY29uc3QgRU1QVFlfSU5TVFJVQ1RJT05fTUFQID0gbmV3IEVsZW1lbnRJbnN0cnVjdGlvbk1hcCgpO1xuXG5leHBvcnQgY2xhc3MgVGltZWxpbmVBbmltYXRpb25FbmdpbmUge1xuICBwcml2YXRlIF9hbmltYXRpb25zOiB7W2lkOiBzdHJpbmddOiBBc3Q8QW5pbWF0aW9uTWV0YWRhdGFUeXBlPn0gPSB7fTtcbiAgcHJpdmF0ZSBfcGxheWVyc0J5SWQ6IHtbaWQ6IHN0cmluZ106IEFuaW1hdGlvblBsYXllcn0gPSB7fTtcbiAgcHVibGljIHBsYXllcnM6IEFuaW1hdGlvblBsYXllcltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgYm9keU5vZGU6IGFueSwgcHJpdmF0ZSBfZHJpdmVyOiBBbmltYXRpb25Ecml2ZXIsXG4gICAgICBwcml2YXRlIF9ub3JtYWxpemVyOiBBbmltYXRpb25TdHlsZU5vcm1hbGl6ZXIpIHt9XG5cbiAgcmVnaXN0ZXIoaWQ6IHN0cmluZywgbWV0YWRhdGE6IEFuaW1hdGlvbk1ldGFkYXRhfEFuaW1hdGlvbk1ldGFkYXRhW10pIHtcbiAgICBjb25zdCBlcnJvcnM6IGFueVtdID0gW107XG4gICAgY29uc3QgYXN0ID0gYnVpbGRBbmltYXRpb25Bc3QodGhpcy5fZHJpdmVyLCBtZXRhZGF0YSwgZXJyb3JzKTtcbiAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBVbmFibGUgdG8gYnVpbGQgdGhlIGFuaW1hdGlvbiBkdWUgdG8gdGhlIGZvbGxvd2luZyBlcnJvcnM6ICR7ZXJyb3JzLmpvaW4oXCJcXG5cIil9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvbnNbaWRdID0gYXN0O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2J1aWxkUGxheWVyKFxuICAgICAgaTogQW5pbWF0aW9uVGltZWxpbmVJbnN0cnVjdGlvbiwgcHJlU3R5bGVzOiDJtVN0eWxlRGF0YSxcbiAgICAgIHBvc3RTdHlsZXM/OiDJtVN0eWxlRGF0YSk6IEFuaW1hdGlvblBsYXllciB7XG4gICAgY29uc3QgZWxlbWVudCA9IGkuZWxlbWVudDtcbiAgICBjb25zdCBrZXlmcmFtZXMgPSBub3JtYWxpemVLZXlmcmFtZXMoXG4gICAgICAgIHRoaXMuX2RyaXZlciwgdGhpcy5fbm9ybWFsaXplciwgZWxlbWVudCwgaS5rZXlmcmFtZXMsIHByZVN0eWxlcywgcG9zdFN0eWxlcyk7XG4gICAgcmV0dXJuIHRoaXMuX2RyaXZlci5hbmltYXRlKGVsZW1lbnQsIGtleWZyYW1lcywgaS5kdXJhdGlvbiwgaS5kZWxheSwgaS5lYXNpbmcsIFtdLCB0cnVlKTtcbiAgfVxuXG4gIGNyZWF0ZShpZDogc3RyaW5nLCBlbGVtZW50OiBhbnksIG9wdGlvbnM6IEFuaW1hdGlvbk9wdGlvbnMgPSB7fSk6IEFuaW1hdGlvblBsYXllciB7XG4gICAgY29uc3QgZXJyb3JzOiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0IGFzdCA9IHRoaXMuX2FuaW1hdGlvbnNbaWRdO1xuICAgIGxldCBpbnN0cnVjdGlvbnM6IEFuaW1hdGlvblRpbWVsaW5lSW5zdHJ1Y3Rpb25bXTtcblxuICAgIGNvbnN0IGF1dG9TdHlsZXNNYXAgPSBuZXcgTWFwPGFueSwgybVTdHlsZURhdGE+KCk7XG5cbiAgICBpZiAoYXN0KSB7XG4gICAgICBpbnN0cnVjdGlvbnMgPSBidWlsZEFuaW1hdGlvblRpbWVsaW5lcyhcbiAgICAgICAgICB0aGlzLl9kcml2ZXIsIGVsZW1lbnQsIGFzdCwgRU5URVJfQ0xBU1NOQU1FLCBMRUFWRV9DTEFTU05BTUUsIHt9LCB7fSwgb3B0aW9ucyxcbiAgICAgICAgICBFTVBUWV9JTlNUUlVDVElPTl9NQVAsIGVycm9ycyk7XG4gICAgICBpbnN0cnVjdGlvbnMuZm9yRWFjaChpbnN0ID0+IHtcbiAgICAgICAgY29uc3Qgc3R5bGVzID0gZ2V0T3JTZXRBc0luTWFwKGF1dG9TdHlsZXNNYXAsIGluc3QuZWxlbWVudCwge30pO1xuICAgICAgICBpbnN0LnBvc3RTdHlsZVByb3BzLmZvckVhY2gocHJvcCA9PiBzdHlsZXNbcHJvcF0gPSBudWxsKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvcnMucHVzaCgnVGhlIHJlcXVlc3RlZCBhbmltYXRpb24gZG9lc25cXCd0IGV4aXN0IG9yIGhhcyBhbHJlYWR5IGJlZW4gZGVzdHJveWVkJyk7XG4gICAgICBpbnN0cnVjdGlvbnMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBVbmFibGUgdG8gY3JlYXRlIHRoZSBhbmltYXRpb24gZHVlIHRvIHRoZSBmb2xsb3dpbmcgZXJyb3JzOiAke2Vycm9ycy5qb2luKFwiXFxuXCIpfWApO1xuICAgIH1cblxuICAgIGF1dG9TdHlsZXNNYXAuZm9yRWFjaCgoc3R5bGVzLCBlbGVtZW50KSA9PiB7XG4gICAgICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2goXG4gICAgICAgICAgcHJvcCA9PiB7IHN0eWxlc1twcm9wXSA9IHRoaXMuX2RyaXZlci5jb21wdXRlU3R5bGUoZWxlbWVudCwgcHJvcCwgQVVUT19TVFlMRSk7IH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcGxheWVycyA9IGluc3RydWN0aW9ucy5tYXAoaSA9PiB7XG4gICAgICBjb25zdCBzdHlsZXMgPSBhdXRvU3R5bGVzTWFwLmdldChpLmVsZW1lbnQpO1xuICAgICAgcmV0dXJuIHRoaXMuX2J1aWxkUGxheWVyKGksIHt9LCBzdHlsZXMpO1xuICAgIH0pO1xuICAgIGNvbnN0IHBsYXllciA9IG9wdGltaXplR3JvdXBQbGF5ZXIocGxheWVycyk7XG4gICAgdGhpcy5fcGxheWVyc0J5SWRbaWRdID0gcGxheWVyO1xuICAgIHBsYXllci5vbkRlc3Ryb3koKCkgPT4gdGhpcy5kZXN0cm95KGlkKSk7XG5cbiAgICB0aGlzLnBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgIHJldHVybiBwbGF5ZXI7XG4gIH1cblxuICBkZXN0cm95KGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLl9nZXRQbGF5ZXIoaWQpO1xuICAgIHBsYXllci5kZXN0cm95KCk7XG4gICAgZGVsZXRlIHRoaXMuX3BsYXllcnNCeUlkW2lkXTtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucGxheWVycy5pbmRleE9mKHBsYXllcik7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMucGxheWVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2dldFBsYXllcihpZDogc3RyaW5nKTogQW5pbWF0aW9uUGxheWVyIHtcbiAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLl9wbGF5ZXJzQnlJZFtpZF07XG4gICAgaWYgKCFwbGF5ZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgdGhlIHRpbWVsaW5lIHBsYXllciByZWZlcmVuY2VkIGJ5ICR7aWR9YCk7XG4gICAgfVxuICAgIHJldHVybiBwbGF5ZXI7XG4gIH1cblxuICBsaXN0ZW4oaWQ6IHN0cmluZywgZWxlbWVudDogc3RyaW5nLCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiBhbnkpOlxuICAgICAgKCkgPT4gdm9pZCB7XG4gICAgLy8gdHJpZ2dlck5hbWUsIGZyb21TdGF0ZSwgdG9TdGF0ZSBhcmUgYWxsIGlnbm9yZWQgZm9yIHRpbWVsaW5lIGFuaW1hdGlvbnNcbiAgICBjb25zdCBiYXNlRXZlbnQgPSBtYWtlQW5pbWF0aW9uRXZlbnQoZWxlbWVudCwgJycsICcnLCAnJyk7XG4gICAgbGlzdGVuT25QbGF5ZXIodGhpcy5fZ2V0UGxheWVyKGlkKSwgZXZlbnROYW1lLCBiYXNlRXZlbnQsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gKCkgPT4ge307XG4gIH1cblxuICBjb21tYW5kKGlkOiBzdHJpbmcsIGVsZW1lbnQ6IGFueSwgY29tbWFuZDogc3RyaW5nLCBhcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgIGlmIChjb21tYW5kID09ICdyZWdpc3RlcicpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXIoaWQsIGFyZ3NbMF0gYXMgQW5pbWF0aW9uTWV0YWRhdGEgfCBBbmltYXRpb25NZXRhZGF0YVtdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29tbWFuZCA9PSAnY3JlYXRlJykge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IChhcmdzWzBdIHx8IHt9KSBhcyBBbmltYXRpb25PcHRpb25zO1xuICAgICAgdGhpcy5jcmVhdGUoaWQsIGVsZW1lbnQsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBsYXllciA9IHRoaXMuX2dldFBsYXllcihpZCk7XG4gICAgc3dpdGNoIChjb21tYW5kKSB7XG4gICAgICBjYXNlICdwbGF5JzpcbiAgICAgICAgcGxheWVyLnBsYXkoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwYXVzZSc6XG4gICAgICAgIHBsYXllci5wYXVzZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jlc2V0JzpcbiAgICAgICAgcGxheWVyLnJlc2V0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVzdGFydCc6XG4gICAgICAgIHBsYXllci5yZXN0YXJ0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZmluaXNoJzpcbiAgICAgICAgcGxheWVyLmZpbmlzaCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2luaXQnOlxuICAgICAgICBwbGF5ZXIuaW5pdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NldFBvc2l0aW9uJzpcbiAgICAgICAgcGxheWVyLnNldFBvc2l0aW9uKHBhcnNlRmxvYXQoYXJnc1swXSBhcyBzdHJpbmcpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZXN0cm95JzpcbiAgICAgICAgdGhpcy5kZXN0cm95KGlkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG4iXX0=