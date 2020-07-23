/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export const ANY_STATE = '*';
export function parseTransitionExpr(transitionValue, errors) {
    const expressions = [];
    if (typeof transitionValue == 'string') {
        transitionValue.split(/\s*,\s*/).forEach(str => parseInnerTransitionStr(str, expressions, errors));
    }
    else {
        expressions.push(transitionValue);
    }
    return expressions;
}
function parseInnerTransitionStr(eventStr, expressions, errors) {
    if (eventStr[0] == ':') {
        const result = parseAnimationAlias(eventStr, errors);
        if (typeof result == 'function') {
            expressions.push(result);
            return;
        }
        eventStr = result;
    }
    const match = eventStr.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
    if (match == null || match.length < 4) {
        errors.push(`The provided transition expression "${eventStr}" is not supported`);
        return expressions;
    }
    const fromState = match[1];
    const separator = match[2];
    const toState = match[3];
    expressions.push(makeLambdaFromStates(fromState, toState));
    const isFullAnyStateExpr = fromState == ANY_STATE && toState == ANY_STATE;
    if (separator[0] == '<' && !isFullAnyStateExpr) {
        expressions.push(makeLambdaFromStates(toState, fromState));
    }
}
function parseAnimationAlias(alias, errors) {
    switch (alias) {
        case ':enter':
            return 'void => *';
        case ':leave':
            return '* => void';
        case ':increment':
            return (fromState, toState) => parseFloat(toState) > parseFloat(fromState);
        case ':decrement':
            return (fromState, toState) => parseFloat(toState) < parseFloat(fromState);
        default:
            errors.push(`The transition alias value "${alias}" is not supported`);
            return '* => *';
    }
}
// DO NOT REFACTOR ... keep the follow set instantiations
// with the values intact (closure compiler for some reason
// removes follow-up lines that add the values outside of
// the constructor...
const TRUE_BOOLEAN_VALUES = new Set(['true', '1']);
const FALSE_BOOLEAN_VALUES = new Set(['false', '0']);
function makeLambdaFromStates(lhs, rhs) {
    const LHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(lhs) || FALSE_BOOLEAN_VALUES.has(lhs);
    const RHS_MATCH_BOOLEAN = TRUE_BOOLEAN_VALUES.has(rhs) || FALSE_BOOLEAN_VALUES.has(rhs);
    return (fromState, toState) => {
        let lhsMatch = lhs == ANY_STATE || lhs == fromState;
        let rhsMatch = rhs == ANY_STATE || rhs == toState;
        if (!lhsMatch && LHS_MATCH_BOOLEAN && typeof fromState === 'boolean') {
            lhsMatch = fromState ? TRUE_BOOLEAN_VALUES.has(lhs) : FALSE_BOOLEAN_VALUES.has(lhs);
        }
        if (!rhsMatch && RHS_MATCH_BOOLEAN && typeof toState === 'boolean') {
            rhsMatch = toState ? TRUE_BOOLEAN_VALUES.has(rhs) : FALSE_BOOLEAN_VALUES.has(rhs);
        }
        return lhsMatch && rhsMatch;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyYW5zaXRpb25fZXhwci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvZHNsL2FuaW1hdGlvbl90cmFuc2l0aW9uX2V4cHIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUk3QixNQUFNLFVBQVUsbUJBQW1CLENBQy9CLGVBQTJDLEVBQUUsTUFBZ0I7SUFDL0QsTUFBTSxXQUFXLEdBQTBCLEVBQUUsQ0FBQztJQUM5QyxJQUFJLE9BQU8sZUFBZSxJQUFJLFFBQVEsRUFBRTtRQUN0QyxlQUFlLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDcEMsR0FBRyxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDL0Q7U0FBTTtRQUNMLFdBQVcsQ0FBQyxJQUFJLENBQXNCLGVBQWUsQ0FBQyxDQUFDO0tBQ3hEO0lBQ0QsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQUVELFNBQVMsdUJBQXVCLENBQzVCLFFBQWdCLEVBQUUsV0FBa0MsRUFBRSxNQUFnQjtJQUN4RSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7UUFDdEIsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELElBQUksT0FBTyxNQUFNLElBQUksVUFBVSxFQUFFO1lBQy9CLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekIsT0FBTztTQUNSO1FBQ0QsUUFBUSxHQUFHLE1BQU0sQ0FBQztLQUNuQjtJQUVELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMseUNBQXlD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QUNELElBQUksQ0FBQyxRQUFRLElBQUksaUJBQWlCLElBQUksT0FBTyxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQ2xFLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ25GO1FBRUQsT0FBTyxRQUFRLElBQUksUUFBUSxDQUFDO0lBQzlCLENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmV4cG9ydCBjb25zdCBBTllfU1RBVEUgPSAnKic7XG5leHBvcnQgZGVjbGFyZSB0eXBlIFRyYW5zaXRpb25NYXRjaGVyRm4gPVxuICAgIChmcm9tU3RhdGU6IGFueSwgdG9TdGF0ZTogYW55LCBlbGVtZW50OiBhbnksIHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0pID0+IGJvb2xlYW47XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRyYW5zaXRpb25FeHByKFxuICAgIHRyYW5zaXRpb25WYWx1ZTogc3RyaW5nfFRyYW5zaXRpb25NYXRjaGVyRm4sIGVycm9yczogc3RyaW5nW10pOiBUcmFuc2l0aW9uTWF0Y2hlckZuW10ge1xuICBjb25zdCBleHByZXNzaW9uczogVHJhbnNpdGlvbk1hdGNoZXJGbltdID0gW107XG4gIGlmICh0eXBlb2YgdHJhbnNpdGlvblZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgdHJhbnNpdGlvblZhbHVlLnNwbGl0KC9cXHMqLFxccyovKS5mb3JFYWNoKFxuICAgICAgICBzdHIgPT4gcGFyc2VJbm5lclRyYW5zaXRpb25TdHIoc3RyLCBleHByZXNzaW9ucywgZXJyb3JzKSk7XG4gIH0gZWxzZSB7XG4gICAgZXhwcmVzc2lvbnMucHVzaCg8VHJhbnNpdGlvbk1hdGNoZXJGbj50cmFuc2l0aW9uVmFsdWUpO1xuICB9XG4gIHJldHVybiBleHByZXNzaW9ucztcbn1cblxuZnVuY3Rpb24gcGFyc2VJbm5lclRyYW5zaXRpb25TdHIoXG4gICAgZXZlbnRTdHI6IHN0cmluZywgZXhwcmVzc2lvbnM6IFRyYW5zaXRpb25NYXRjaGVyRm5bXSwgZXJyb3JzOiBzdHJpbmdbXSkge1xuICBpZiAoZXZlbnRTdHJbMF0gPT0gJzonKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gcGFyc2VBbmltYXRpb25BbGlhcyhldmVudFN0ciwgZXJyb3JzKTtcbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBleHByZXNzaW9ucy5wdXNoKHJlc3VsdCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGV2ZW50U3RyID0gcmVzdWx0O1xuICB9XG5cbiAgY29uc3QgbWF0Y2ggPSBldmVudFN0ci5tYXRjaCgvXihcXCp8Wy1cXHddKylcXHMqKDw/Wz0tXT4pXFxzKihcXCp8Wy1cXHddKykkLyk7XG4gIGlmIChtYXRjaCA9PSBudWxsIHx8IG1hdGNoLmxlbmd0aCA8IDQpIHtcbiAgICBlcnJvcnMucHVzaChgVGhlIHByb3ZpZGVkIHRyYW5zaXRpb24gZXhwcmVzc2lvbiBcIiR7ZXZlbnRTdHJ9XCIgaXMgbm90IHN1cHBvcnRlZGApO1xuICAgIHJldHVybiBleHByZXNzaW9ucztcbiAgfVxuXG4gIGNvbnN0IGZyb21TdGF0ZSA9IG1hdGNoWzFdO1xuICBjb25zdCBzZXBhcmF0b3IgPSBtYXRjaFsyXTtcbiAgY29uc3QgdG9TdGF0ZSA9IG1hdGNoWzNdO1xuICBleHByZXNzaW9ucy5wdXNoKG1ha2VMYW1iZGFGcm9tU3RhdGVzKGZyb21TdGF0ZSwgdG9TdGF0ZSkpO1xuXG4gIGNvbnN0IGlzRnVsbEFueVN0YXRlRXhwciA9IGZyb21TdGF0ZSA9PSBBTllfU1RBVEUgJiYgdG9TdGF0ZSA9PSBBTllfU1RBVEU7XG4gIGlmIChzZXBhcmF0b3JbMF0gPT0gJzwnICYmICFpc0Z1bGxBbnlTdGF0ZUV4cHIpIHtcbiAgICBleHByZXNzaW9ucy5wdXNoKG1ha2VMYW1iZGFGcm9tU3RhdGVzKHRvU3RhdGUsIGZyb21TdGF0ZSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlQW5pbWF0aW9uQWxpYXMoYWxpYXM6IHN0cmluZywgZXJyb3JzOiBzdHJpbmdbXSk6IHN0cmluZ3xUcmFuc2l0aW9uTWF0Y2hlckZuIHtcbiAgc3dpdGNoIChhbGlhcykge1xuICAgIGNhc2UgJzplbnRlcic6XG4gICAgICByZXR1cm4gJ3ZvaWQgPT4gKic7XG4gICAgY2FzZSAnOmxlYXZlJzpcbiAgICAgIHJldHVybiAnKiA9PiB2b2lkJztcbiAgICBjYXNlICc6aW5jcmVtZW50JzpcbiAgICAgIHJldHVybiAoZnJvbVN0YXRlOiBhbnksIHRvU3RhdGU6IGFueSk6IGJvb2xlYW4gPT4gcGFyc2VGbG9hdCh0b1N0YXRlKSA+IHBhcnNlRmxvYXQoZnJvbVN0YXRlKTtcbiAgICBjYXNlICc6ZGVjcmVtZW50JzpcbiAgICAgIHJldHVybiAoZnJvbVN0YXRlOiBhbnksIHRvU3RhdGU6IGFueSk6IGJvb2xlYW4gPT4gcGFyc2VGbG9hdCh0b1N0YXRlKSA8IHBhcnNlRmxvYXQoZnJvbVN0YXRlKTtcbiAgICBkZWZhdWx0OlxuICAgICAgZXJyb3JzLnB1c2goYFRoZSB0cmFuc2l0aW9uIGFsaWFzIHZhbHVlIFwiJHthbGlhc31cIiBpcyBub3Qgc3VwcG9ydGVkYCk7XG4gICAgICByZXR1cm4gJyogPT4gKic7XG4gIH1cbn1cblxuLy8gRE8gTk9UIFJFRkFDVE9SIC4uLiBrZWVwIHRoZSBmb2xsb3cgc2V0IGluc3RhbnRpYXRpb25zXG4vLyB3aXRoIHRoZSB2YWx1ZXMgaW50YWN0IChjbG9zdXJlIGNvbXBpbGVyIGZvciBzb21lIHJlYXNvblxuLy8gcmVtb3ZlcyBmb2xsb3ctdXAgbGluZXMgdGhhdCBhZGQgdGhlIHZhbHVlcyBvdXRzaWRlIG9mXG4vLyB0aGUgY29uc3RydWN0b3IuLi5cbmNvbnN0IFRSVUVfQk9PTEVBTl9WQUxVRVMgPSBuZXcgU2V0PHN0cmluZz4oWyd0cnVlJywgJzEnXSk7XG5jb25zdCBGQUxTRV9CT09MRUFOX1ZBTFVFUyA9IG5ldyBTZXQ8c3RyaW5nPihbJ2ZhbHNlJywgJzAnXSk7XG5cbmZ1bmN0aW9uIG1ha2VMYW1iZGFGcm9tU3RhdGVzKGxoczogc3RyaW5nLCByaHM6IHN0cmluZyk6IFRyYW5zaXRpb25NYXRjaGVyRm4ge1xuICBjb25zdCBMSFNfTUFUQ0hfQk9PTEVBTiA9IFRSVUVfQk9PTEVBTl9WQUxVRVMuaGFzKGxocykgfHwgRkFMU0VfQk9PTEVBTl9WQUxVRVMuaGFzKGxocyk7XG4gIGNvbnN0IFJIU19NQVRDSF9CT09MRUFOID0gVFJVRV9CT09MRUFOX1ZBTFVFUy5oYXMocmhzKSB8fCBGQUxTRV9CT09MRUFOX1ZBTFVFUy5oYXMocmhzKTtcblxuICByZXR1cm4gKGZyb21TdGF0ZTogYW55LCB0b1N0YXRlOiBhbnkpOiBib29sZWFuID0+IHtcbiAgICBsZXQgbGhzTWF0Y2ggPSBsaHMgPT0gQU5ZX1NUQVRFIHx8IGxocyA9PSBmcm9tU3RhdGU7XG4gICAgbGV0IHJoc01hdGNoID0gcmhzID09IEFOWV9TVEFURSB8fCByaHMgPT0gdG9TdGF0ZTtcblxuICAgIGlmICghbGhzTWF0Y2ggJiYgTEhTX01BVENIX0JPT0xFQU4gJiYgdHlwZW9mIGZyb21TdGF0ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBsaHNNYXRjaCA9IGZyb21TdGF0ZSA/IFRSVUVfQk9PTEVBTl9WQUxVRVMuaGFzKGxocykgOiBGQUxTRV9CT09MRUFOX1ZBTFVFUy5oYXMobGhzKTtcbiAgICB9XG4gICAgaWYgKCFyaHNNYXRjaCAmJiBSSFNfTUFUQ0hfQk9PTEVBTiAmJiB0eXBlb2YgdG9TdGF0ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICByaHNNYXRjaCA9IHRvU3RhdGUgPyBUUlVFX0JPT0xFQU5fVkFMVUVTLmhhcyhyaHMpIDogRkFMU0VfQk9PTEVBTl9WQUxVRVMuaGFzKHJocyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxoc01hdGNoICYmIHJoc01hdGNoO1xuICB9O1xufVxuIl19