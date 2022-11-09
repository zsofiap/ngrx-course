import {compareCourses, Course} from '../model/course';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {CourseActions} from '../action-types';


// export interface CoursesState {
//   // courses: Course[]; - would be ok, but time consuming to get by id

//   //creating an entity instead - key-value map: keys: identifiers of the entites, values: entities
//   entities: {[key: number]: Course}, //key: id, entity: Course
//   ids: number[] //auxiliary ids array, ids in their natural order
//
//entity format: entities and separate order array
//   //reducers and interfaces are needed to handle - not convenient - ngrx Entity is better
// }
export interface CoursesState extends EntityState<Course> {
    allCoursesLoaded: boolean
}

//to arrange in order based on seqNo
export const adapter = createEntityAdapter<Course>({
    sortComparer: compareCourses
});
//adapter: auxiliary utility

//every module needs its initial state:
export const initialCoursesState = adapter.getInitialState({
    allCoursesLoaded:false
});


export const coursesReducer = createReducer(

    initialCoursesState,

    on(CourseActions.allCoursesLoaded,
        (state, action) => adapter.setAll(
            action.courses,
            {...state, allCoursesLoaded:true})), //shallow copy of the state, plus setting the flag to true


    on(CourseActions.courseUpdated,
      (state, action) => adapter.updateOne(
        action.update,
        state) )

);


export const {selectAll} = adapter.getSelectors();

