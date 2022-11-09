import {
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector, createReducer,
    createSelector,
    MetaReducer, on
} from '@ngrx/store';
import {User} from '../model/user.model';
import {AuthActions} from '../action-types';



export interface AuthState {
    user: User
}

// what should be the state when we initialize the app:
export const initialAuthState: AuthState = {
    user: undefined
};

// export const reducers: ActionReducerMap<AuthState> = {

// };

// reducer: what the store has to do when an action is called. arguments: state: current state of the store, action: what is dispatched
// this function does not modify the state, but calculates a new version of the state based on the previous state and the action that just got dispatched

// function authRecuder(state, action): AuthState {}

export const authReducer = createReducer(

    initialAuthState,
// what to do in response to the login action (in this case: save the user profile in memory):
    on(AuthActions.login, (state, action) => {
      // console.log('calling login reducer');
    // debugger;
        return {
            user: action.user
        }
    }),

    on(AuthActions.logout, (state, action) => {
        return {
            user: undefined
        }
    })



);

