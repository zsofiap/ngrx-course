import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AuthState} from './reducers';

//feature selectors - select a feature state branch of the global app state (here: state["auth"])
// a type-safe version of it:
export const selectAuthState =
    createFeatureSelector<AuthState>("auth");

//mapping function, but it wont't calculate until the state not changed
//- selection is a mapping f. with memory
export const isLoggedIn = createSelector(
    selectAuthState,
    // state => state["auth"],
    //projector function, auth state:
    auth =>  !!auth.user

);


export const isLoggedOut = createSelector(
    isLoggedIn,
    //projector function:
    loggedIn => !loggedIn
);
