import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AppState} from '../reducers';
import {select, Store} from '@ngrx/store';
import {filter, finalize, first, tap} from 'rxjs/operators';
import {loadAllCourses} from './course.actions';
import {areCoursesLoaded} from './courses.selectors';


//special type of service: router resolver
//plain angular service implementing resolve interface
//if the target needs some data from the BE, the resolver is the best place to fetch it,
//so that it fetches only if the page is available on the screen (login happened)
//the target gets data from store not BE, so the type is not so important
@Injectable()
export class CoursesResolver implements Resolve<any> {

    loading = false;

     //to check if the courses are already there or not we need the store
    constructor(private store: Store<AppState>) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store
            .pipe(
              //fetch the value of allCoursesLoaded flag
                select(areCoursesLoaded),
                tap(coursesLoaded => {

                    if (!this.loading && !coursesLoaded) {
                        this.loading = true;
                        this.store.dispatch(loadAllCourses()); // currently http request happen everty time this effect dispatched
                    }
                }),
                filter(coursesLoaded => coursesLoaded), // first will only called (observable completed) if coursesLoaded is true, so the data is in the store
                first(),
                finalize(() => this.loading = false)
            );

    }

}
