import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {Store} from "@ngrx/store";

import {AuthService} from "../auth.service";
import {tap} from "rxjs/operators";
import {noop} from "rxjs";
import {Router} from "@angular/router";
import {AppState} from '../../reducers';
import {login} from '../auth.actions';
import {AuthActions} from '../action-types';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
      private fb:FormBuilder,
      private auth: AuthService,
      private router:Router,
      private store: Store<AppState>) {

      this.form = fb.group({
          email: ['test@angular-university.io', [Validators.required]],
          password: ['test', [Validators.required]]
      });

  }

  ngOnInit() {

  }

  login() {

      const val = this.form.value;

      this.auth.login(val.email, val.password)
      .pipe(
        tap(user => {
          console.log('user:', user);

          const newLoginAction = login({user});

          // console.log('new login action:', newLoginAction);

          // debugger;


          //save the user profile inside the store (also an observable, we can subscribe, but now we want to modify: dispatch is the only way for it)
          this.store.dispatch(login({user})); //{user:user} - in ts, if the value of the property is the same as the name of it, it can be simplified to the value
            // after login action is created in auth.actions, it is enough to call here and pass the user{
            // type: 'Login Action', // ngrx action: an object that we send to the store to do some modification in the state
            // payload: {            // the payload of the action is any data that the store might need in order to create a new version of its internal state (here: the user itself)
              // userProfile: user - after createAction is auth.actions.ts: it can be simplified
            //   user
            // }
          // }
          // )

          this.router.navigateByUrl('/courses');
        })
      )
      .subscribe(
        noop, // no operation if the login successful
        () => alert('Login Failed')
      );


  }

}

