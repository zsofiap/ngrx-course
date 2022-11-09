import {createAction, props} from '@ngrx/store';
import {User} from './model/user.model';


export const login = createAction(
  // only the action type is compulsory, in [] the source of the action - it should modify only that part of the app, then the event of the action
  "[Login Page] User Login",
  //define the content of the payload of the action - does not take any argument, but one generic parameter - the type of the payload associated to this action:
  props<{user: User}>()
);

// login is not a class, but a function, it has to be called
// const newLoginAction = login({user: });


export const logout = createAction(
  "[Top Menu] Logout" // this action does not need any payload, happens locally in the top menu
);
