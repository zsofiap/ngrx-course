import {Component, OnInit} from '@angular/core';
import {compareCourses, Course} from '../model/course';
import {Observable} from "rxjs";
import {defaultDialogConfig} from '../shared/default-dialog-config';
import {EditCourseDialogComponent} from '../edit-course-dialog/edit-course-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {map, shareReplay} from 'rxjs/operators';
import {CoursesHttpService} from '../services/courses-http.service';
import {AppState} from '../../reducers';
import {select, Store} from '@ngrx/store';
import {selectAdvancedCourses, selectBeginnerCourses, selectPromoTotal} from '../courses.selectors';



@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    promoTotal$: Observable<number>;

    // loading$: Observable<boolean>; - global loading indicator in app.comp

    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;


    constructor(
      private dialog: MatDialog,
      // private coursesHttpService: CoursesHttpService, - instead, get courses from the store:
      private store: Store<AppState>) {

    }

    ngOnInit() {
      this.reload();
    }

  reload() {

    //after getting data from the store, these are not necessary:

    // const courses$ = this.coursesHttpService.findAllCourses()
    //   .pipe(
    //     map(courses => courses.sort(compareCourses)),
    //     shareReplay()
    //   );

    // this.loading$ = courses$.pipe(map(courses => !!courses));

    // this.beginnerCourses$ = courses$
    //   .pipe(
    //     map(courses => courses.filter(course => course.category == 'BEGINNER'))
    //   );


    // this.advancedCourses$ = courses$
    //   .pipe(
    //     map(courses => courses.filter(course => course.category == 'ADVANCED'))
    //   );

    // this.promoTotal$ = courses$
    //     .pipe(
    //         map(courses => courses.filter(course => course.promo).length)
    //     );

        this.beginnerCourses$ = this.store.pipe(select(selectBeginnerCourses));

        this.advancedCourses$ = this.store.pipe(select(selectAdvancedCourses));

        this.promoTotal$ = this.store.pipe(select(selectPromoTotal));

  }

  onAddCourse() {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle:"Create Course",
      mode: 'create'
    };

    this.dialog.open(EditCourseDialogComponent, dialogConfig);

  }


}
