import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CourseActions} from './action-types';
import {CoursesHttpService} from './services/courses-http.service';
import {concatMap, map} from 'rxjs/operators';
import {allCoursesLoaded} from './course.actions';


@Injectable()
export class CoursesEffects {

    loadCourses$ = createEffect(
        () => this.actions$
            .pipe(
                ofType(CourseActions.loadAllCourses),
    //concatMap insures that we only send one request at a time to the BE (mergeMap would allow multiple)
                concatMap(action =>
                    this.coursesHttpService.findAllCourses()),
    //this chain expects an action at the end, take the respond courses and map it into a new action:
    //dispatch it by calling our action creator and pass the payload so that it contains only 1 porperty:
                map(courses => allCoursesLoaded({courses}))

            )
    );


    saveCourse$ = createEffect(
        () => this.actions$
            .pipe(
                ofType(CourseActions.courseUpdated),
    // concatMap is good for save operations, it goes sequentially, only happens when prev. finished
                concatMap(action => this.coursesHttpService.saveCourse(
                    action.update.id,
                    action.update.changes
                ))
            ),
        {dispatch: false}
    );

    constructor(private actions$: Actions,
                private coursesHttpService: CoursesHttpService) {

    }

}
