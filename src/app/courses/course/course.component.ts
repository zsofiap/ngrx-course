import { CourseEntityService } from './../services/course-entity.service';
import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {Observable, of} from 'rxjs';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {CoursesHttpService} from '../services/courses-http.service';
import { LessonEntityService } from '../services/lesson-entity.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
  //onPush Change Detection: the component template will update only if a new data is pushed to the component
  // it the app uses a lot of manual subscriptions, we need some extra refactoring as well,
  //but easy w ngrx: data from store is immutable and subscription is via asnyc pipe
  // good for performance
})
export class CourseComponent implements OnInit {

  course$: Observable<Course>;

  loading$: Observable<boolean>;

  lessons$: Observable<Lesson[]>;

  displayedColumns = ['seqNo', 'description', 'duration'];

  nextPage = 0;

  constructor(
    // private coursesService: CoursesHttpService,
    private coursesService: CourseEntityService,
    private lessonsService: LessonEntityService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {

    const courseUrl = this.route.snapshot.paramMap.get("courseUrl");

    // this.course$ = this.coursesService.findCourseByUrl(courseUrl);

    this.course$ = this.coursesService.entities$
         .pipe(
           map(courses => courses.find(course => course.url == courseUrl))
           // the first course thats url corresponds to the url coming from the route snapshot
         )

    // this.lessons$ = this.course$.pipe(
    //   concatMap(course => this.coursesService.findLessons(course.id)),
    //   tap(console.log)
    // );

    this.lessons$ = this.lessonsService.entities$ // entities$ contains all lessons of all courses
          .pipe(
            withLatestFrom(this.course$), // to combine the 2 observables (courses and lessons entities) to find the course id for each lesson -> derived observable
            tap(([lessons, course]) => { // side-effect: which page should be loaded
              if(this.nextPage == 0) {
                this.loadLessonsPage(course)
              }
            }),
            map(([lessons, course]) =>
                 lessons.filter(lesson => lesson.courseId == course.id)) // in map: tuple
          );

    this.loading$ = this.lessonsService.loading$ // this loading$ emits true whenever lessonsentityservice is fetching some lessons from BE
          .pipe(delay(0)); // so that we don't get the ExpressionChangedAfterItHasBeenCheckedError:
          // the loading indicator part of the template will only be effected in the next change detection run
  }


  loadLessonsPage(course: Course) {
    this.lessonsService.getWithQuery({
      'courseId': course.id.toString(),
      'pageNumber': this.nextPage.toString(),
      'pageSize': '3' // how many we want on our screen at once from the BE
    });

    this.nextPage +=1; // each time we hit the Load More button we load another page
  }

}


