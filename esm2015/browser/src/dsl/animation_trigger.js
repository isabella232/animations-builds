import { AnimationStateStyles, AnimationTransitionFactory } from './animation_transition_factory';
/**
 * @publicApi
 */
export function buildTrigger(name, ast) {
    return new AnimationTrigger(name, ast);
}
/**
 * @publicApi
 */
export class AnimationTrigger {
    constructor(name, ast) {
        this.name = name;
        this.ast = ast;
        this.transitionFactories = [];
        this.states = {};
        ast.states.forEach(ast => {
            const defaultParams = (ast.options && ast.options.params) || {};
            this.states[ast.name] = new AnimationStateStyles(ast.style, defaultParams);
        });
        balanceProperties(this.states, 'true', '1');
        balanceProperties(this.states, 'false', '0');
        ast.transitions.forEach(ast => {
            this.transitionFactories.push(new AnimationTransitionFactory(name, ast, this.states));
        });
        this.fallbackTransition = createFallbackTransition(name, this.states);
    }
    get containsQueries() {
        return this.ast.queryCount > 0;
    }
    matchTransition(currentState, nextState, element, params) {
        const entry = this.transitionFactories.find(f => f.match(currentState, nextState, element, params));
        return entry || null;
    }
    matchStyles(currentState, params, errors) {
        return this.fallbackTransition.buildStyles(currentState, params, errors);
    }
}
function createFallbackTransition(triggerName, states) {
    const matchers = [(fromState, toState) => true];
    const animation = { type: 2 /* Sequence */, steps: [], options: null };
    const transition = {
        type: 1 /* Transition */,
        animation,
        matchers,
        options: null,
        queryCount: 0,
        depCount: 0
    };
    return new AnimationTransitionFactory(triggerName, transition, states);
}
function balanceProperties(obj, key1, key2) {
    if (obj.hasOwnProperty(key1)) {
        if (!obj.hasOwnProperty(key2)) {
            obj[key2] = obj[key1];
        }
    }
    else if (obj.hasOwnProperty(key2)) {
        obj[key1] = obj[key2];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL2RzbC9hbmltYXRpb25fdHJpZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFZQSxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsMEJBQTBCLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUloRzs7R0FFRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQUMsSUFBWSxFQUFFLEdBQWU7SUFDeEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZ0JBQWdCO0lBSzNCLFlBQW1CLElBQVksRUFBUyxHQUFlO1FBQXBDLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUFZO1FBSmhELHdCQUFtQixHQUFpQyxFQUFFLENBQUM7UUFFdkQsV0FBTSxHQUFnRCxFQUFFLENBQUM7UUFHOUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksb0JBQW9CLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztRQUM3RSxDQUFDLENBQUMsQ0FBQztRQUVILGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTdDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSwwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3hGLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGtCQUFrQixHQUFHLHdCQUF3QixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsZUFBZSxDQUFDLFlBQWlCLEVBQUUsU0FBYyxFQUFFLE9BQVksRUFBRSxNQUE0QjtRQUUzRixNQUFNLEtBQUssR0FDUCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFGLE9BQU8sS0FBSyxJQUFJLElBQUksQ0FBQztJQUN2QixDQUFDO0lBRUQsV0FBVyxDQUFDLFlBQWlCLEVBQUUsTUFBNEIsRUFBRSxNQUFhO1FBQ3hFLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNFLENBQUM7Q0FDRjtBQUVELFNBQVMsd0JBQXdCLENBQzdCLFdBQW1CLEVBQ25CLE1BQW1EO0lBQ3JELE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxTQUFjLEVBQUUsT0FBWSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxRCxNQUFNLFNBQVMsR0FBZ0IsRUFBQyxJQUFJLGtCQUFnQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDO0lBQ2hHLE1BQU0sVUFBVSxHQUFrQjtRQUNoQyxJQUFJLG9CQUFrQztRQUN0QyxTQUFTO1FBQ1QsUUFBUTtRQUNSLE9BQU8sRUFBRSxJQUFJO1FBQ2IsVUFBVSxFQUFFLENBQUM7UUFDYixRQUFRLEVBQUUsQ0FBQztLQUNaLENBQUM7SUFDRixPQUFPLElBQUksMEJBQTBCLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN6RSxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxHQUF5QixFQUFFLElBQVksRUFBRSxJQUFZO0lBQzlFLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM3QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZCO0tBQ0Y7U0FBTSxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN2QjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QW5pbWF0aW9uTWV0YWRhdGFUeXBlLCDJtVN0eWxlRGF0YX0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbmltcG9ydCB7Y29weVN0eWxlcywgaW50ZXJwb2xhdGVQYXJhbXN9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge1NlcXVlbmNlQXN0LCBTdHlsZUFzdCwgVHJhbnNpdGlvbkFzdCwgVHJpZ2dlckFzdH0gZnJvbSAnLi9hbmltYXRpb25fYXN0JztcbmltcG9ydCB7QW5pbWF0aW9uU3RhdGVTdHlsZXMsIEFuaW1hdGlvblRyYW5zaXRpb25GYWN0b3J5fSBmcm9tICcuL2FuaW1hdGlvbl90cmFuc2l0aW9uX2ZhY3RvcnknO1xuXG5cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFRyaWdnZXIobmFtZTogc3RyaW5nLCBhc3Q6IFRyaWdnZXJBc3QpOiBBbmltYXRpb25UcmlnZ2VyIHtcbiAgcmV0dXJuIG5ldyBBbmltYXRpb25UcmlnZ2VyKG5hbWUsIGFzdCk7XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uVHJpZ2dlciB7XG4gIHB1YmxpYyB0cmFuc2l0aW9uRmFjdG9yaWVzOiBBbmltYXRpb25UcmFuc2l0aW9uRmFjdG9yeVtdID0gW107XG4gIHB1YmxpYyBmYWxsYmFja1RyYW5zaXRpb246IEFuaW1hdGlvblRyYW5zaXRpb25GYWN0b3J5O1xuICBwdWJsaWMgc3RhdGVzOiB7W3N0YXRlTmFtZTogc3RyaW5nXTogQW5pbWF0aW9uU3RhdGVTdHlsZXN9ID0ge307XG5cbiAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGFzdDogVHJpZ2dlckFzdCkge1xuICAgIGFzdC5zdGF0ZXMuZm9yRWFjaChhc3QgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFBhcmFtcyA9IChhc3Qub3B0aW9ucyAmJiBhc3Qub3B0aW9ucy5wYXJhbXMpIHx8IHt9O1xuICAgICAgdGhpcy5zdGF0ZXNbYXN0Lm5hbWVdID0gbmV3IEFuaW1hdGlvblN0YXRlU3R5bGVzKGFzdC5zdHlsZSwgZGVmYXVsdFBhcmFtcyk7XG4gICAgfSk7XG5cbiAgICBiYWxhbmNlUHJvcGVydGllcyh0aGlzLnN0YXRlcywgJ3RydWUnLCAnMScpO1xuICAgIGJhbGFuY2VQcm9wZXJ0aWVzKHRoaXMuc3RhdGVzLCAnZmFsc2UnLCAnMCcpO1xuXG4gICAgYXN0LnRyYW5zaXRpb25zLmZvckVhY2goYXN0ID0+IHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbkZhY3Rvcmllcy5wdXNoKG5ldyBBbmltYXRpb25UcmFuc2l0aW9uRmFjdG9yeShuYW1lLCBhc3QsIHRoaXMuc3RhdGVzKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmZhbGxiYWNrVHJhbnNpdGlvbiA9IGNyZWF0ZUZhbGxiYWNrVHJhbnNpdGlvbihuYW1lLCB0aGlzLnN0YXRlcyk7XG4gIH1cblxuICBnZXQgY29udGFpbnNRdWVyaWVzKCkge1xuICAgIHJldHVybiB0aGlzLmFzdC5xdWVyeUNvdW50ID4gMDtcbiAgfVxuXG4gIG1hdGNoVHJhbnNpdGlvbihjdXJyZW50U3RhdGU6IGFueSwgbmV4dFN0YXRlOiBhbnksIGVsZW1lbnQ6IGFueSwgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSk6XG4gICAgICBBbmltYXRpb25UcmFuc2l0aW9uRmFjdG9yeXxudWxsIHtcbiAgICBjb25zdCBlbnRyeSA9XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkZhY3Rvcmllcy5maW5kKGYgPT4gZi5tYXRjaChjdXJyZW50U3RhdGUsIG5leHRTdGF0ZSwgZWxlbWVudCwgcGFyYW1zKSk7XG4gICAgcmV0dXJuIGVudHJ5IHx8IG51bGw7XG4gIH1cblxuICBtYXRjaFN0eWxlcyhjdXJyZW50U3RhdGU6IGFueSwgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSwgZXJyb3JzOiBhbnlbXSk6IMm1U3R5bGVEYXRhIHtcbiAgICByZXR1cm4gdGhpcy5mYWxsYmFja1RyYW5zaXRpb24uYnVpbGRTdHlsZXMoY3VycmVudFN0YXRlLCBwYXJhbXMsIGVycm9ycyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlRmFsbGJhY2tUcmFuc2l0aW9uKFxuICAgIHRyaWdnZXJOYW1lOiBzdHJpbmcsXG4gICAgc3RhdGVzOiB7W3N0YXRlTmFtZTogc3RyaW5nXTogQW5pbWF0aW9uU3RhdGVTdHlsZXN9KTogQW5pbWF0aW9uVHJhbnNpdGlvbkZhY3Rvcnkge1xuICBjb25zdCBtYXRjaGVycyA9IFsoZnJvbVN0YXRlOiBhbnksIHRvU3RhdGU6IGFueSkgPT4gdHJ1ZV07XG4gIGNvbnN0IGFuaW1hdGlvbjogU2VxdWVuY2VBc3QgPSB7dHlwZTogQW5pbWF0aW9uTWV0YWRhdGFUeXBlLlNlcXVlbmNlLCBzdGVwczogW10sIG9wdGlvbnM6IG51bGx9O1xuICBjb25zdCB0cmFuc2l0aW9uOiBUcmFuc2l0aW9uQXN0ID0ge1xuICAgIHR5cGU6IEFuaW1hdGlvbk1ldGFkYXRhVHlwZS5UcmFuc2l0aW9uLFxuICAgIGFuaW1hdGlvbixcbiAgICBtYXRjaGVycyxcbiAgICBvcHRpb25zOiBudWxsLFxuICAgIHF1ZXJ5Q291bnQ6IDAsXG4gICAgZGVwQ291bnQ6IDBcbiAgfTtcbiAgcmV0dXJuIG5ldyBBbmltYXRpb25UcmFuc2l0aW9uRmFjdG9yeSh0cmlnZ2VyTmFtZSwgdHJhbnNpdGlvbiwgc3RhdGVzKTtcbn1cblxuZnVuY3Rpb24gYmFsYW5jZVByb3BlcnRpZXMob2JqOiB7W2tleTogc3RyaW5nXTogYW55fSwga2V5MTogc3RyaW5nLCBrZXkyOiBzdHJpbmcpIHtcbiAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkxKSkge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleTIpKSB7XG4gICAgICBvYmpba2V5Ml0gPSBvYmpba2V5MV07XG4gICAgfVxuICB9IGVsc2UgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkyKSkge1xuICAgIG9ialtrZXkxXSA9IG9ialtrZXkyXTtcbiAgfVxufVxuIl19