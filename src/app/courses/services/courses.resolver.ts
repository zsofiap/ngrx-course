import { CourseEntityService } from './course-entity.service';
import { Observable } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from "@angular/core";
import { filter, first, map, tap } from 'rxjs/operators';

// will be responsible for fetching the data from BE and storing it in the store
@Injectable()
export class CoursesResolver implements Resolve<boolean> {

  constructor(private coursesService: CourseEntityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.coursesService.loaded$
        .pipe(
          tap(loaded => {  // using the value of the loaded flag as side effect
            if(!loaded) {
              this.coursesService.getAll();
            }
          }),
          filter(loaded => !!loaded),
          first()
        );
    // return this.coursesService.getAll() // this is going to call an http request and if successful, store them in the store
    //     .pipe(
    //       map(courses => !!courses)
    //     );

  }
}
