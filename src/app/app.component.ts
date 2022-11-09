import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AppState } from './reducers';
import { isLoggedIn, isLoggedOut } from './auth/auth.selectors';
import { login, logout } from './auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loading = true;

  isLoggedIn$: Observable<boolean>;

  isLoggedOut$: Observable<boolean>;

  constructor(private router: Router, private store: Store<AppState>) { }

  ngOnInit() {

    const userProfile = localStorage.getItem("user");

    if (userProfile) {
      this.store.dispatch(login({ user: JSON.parse(userProfile) }));
    }

    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });

    // this.store.subscribe(state => console.log("store value:", state)); // complete data in the store is available

    this.isLoggedIn$ = this.store
      .pipe(
        select(isLoggedIn)
        // select(state => !!state["auth"].user) // if there is some data in the store about the user,
        //the boolean should be evaluated true - only if there is user profile - double negations
      );

    // select is from ngrx, better than map, because it removes any duplicates, but
    // the calculation also takes place every time - even better: after auth.selectors.ts created:
    //use the isLoggedIn function
    this.isLoggedOut$ = this.store
      .pipe(
        select(isLoggedOut)
      );
    // this.isLoggedOut$ = this.store.pipe(
    //   select(state => !state["auth"].user)
    // )
    // this.isLoggedOut$ = this.store.pipe(
    //   map(state => !state["auth"].user)
    // )

  }

  logout() {
    this.store.dispatch(logout());
  }

}
