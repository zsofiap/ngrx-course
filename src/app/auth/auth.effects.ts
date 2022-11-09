import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './action-types';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class AuthEffects {

  login$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.login),
        tap(action => localStorage.setItem('user',
          JSON.stringify(action.user))
        )
      )
    ,
    { dispatch: false }); // so that there would not be an infinite loop because of the BE server comm.

  logout$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.logout),
        tap(action => {
          localStorage.removeItem('user');
          this.router.navigateByUrl('/login');
        })
      )
    , { dispatch: false }); // so that after removeing there will be no more communication with BE server

  // new service:
  constructor(private actions$: Actions,
    private router: Router) {
    //1. actions$.subscribe(action => {
    // first to check the action type to see if we respond to login action:
    //(we don't know the action type yet, it is a generic type, we know only that it will have one)
    // if(action.type == '[Login Page] User Login'){
    //   localStorage.setItem('user', JSON.stringify(action["user"]));
    // }
    //})

    //2. login$ inits only login actions and not all the actions like action$ before
    // ofType: ngrx version of filter a type
    //for side-effects in rxjs: tap operator
    // now we can use the type in a type-safe way, because of ofType we know the type of action
    // const login$ = this.actions$.pipe(
    //   ofType(AuthActions.login),
    //   tap(action => {
    //     localStorage.setItem('user', JSON.stringify(action.user));
    //   })
    // );

    // login$.subscribe();

    //3. so that we should not subscribe manually:
    //(infinite loop danger!!!!)
    // const login$ = createEffect(() =>
    // this.actions$.pipe(
    //   ofType(AuthActions.login),
    //   tap(action => {
    //     localStorage.setItem('user', JSON.stringify(action.user));
    //   })
    // )
    // );
    //also now it can be outside the constructor, see above

  }

}
