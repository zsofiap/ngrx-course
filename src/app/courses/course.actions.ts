import {createAction, props} from '@ngrx/store';
import {Course} from './model/course';
import {Update} from '@ngrx/entity';
import {UpdateStr} from '@ngrx/entity/src/models';

//this action should be executed at the beginnning, so that the courses not loaded until login
//more of a command than an event, did not happen in the past, it should happen now
//[]: where it should be dispatched
export const loadAllCourses = createAction(
    "[Courses Resolver] Load All Courses"
);

//more of an event than a command, after the courses are requested from the BE, tells that it happened
//props: what payload each actions contain
export const allCoursesLoaded = createAction(
    "[Load Courses Effect] All Courses Loaded",
    props<{courses: Course[]}>()
);


export const courseUpdated = createAction(
  "[Edit Course Dialog] Course Updated",
  props<{update: Update<Course>}>()
);

