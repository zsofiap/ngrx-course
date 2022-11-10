import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CoursesHttpService} from '../services/courses-http.service';
import { CourseEntityService } from '../services/course-entity.service';

@Component({
  selector: 'course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCourseDialogComponent {

  form: FormGroup;

  dialogTitle: string;

  course: Course;

  mode: 'create' | 'update';

  loading$:Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    // private coursesService: CoursesHttpService
    private coursesService: CourseEntityService //fascade service for our dialog interacting w the course entity
    ) {

    this.dialogTitle = data.dialogTitle;
    this.course = data.course;
    this.mode = data.mode;

    const formControls = {
      description: ['', Validators.required],
      category: ['', Validators.required],
      longDescription: ['', Validators.required],
      promo: ['', []]
    };

    if (this.mode == 'update') {
      this.form = this.fb.group(formControls);
      this.form.patchValue({...data.course});
    }
    else if (this.mode == 'create') {
      this.form = this.fb.group({
        ...formControls,
        url: ['', Validators.required],
        iconUrl: ['', Validators.required]
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {

    const course: Course = {
      ...this.course,
      ...this.form.value
    };

    // this.coursesService.saveCourse(course.id, course)
    //   .subscribe(
    //     () => this.dialogRef.close()
    //   )


    //pessimistic way, for optimistic see courses.module
    if(this.mode == 'update') {           //all of this happens only in update mode
      this.coursesService.update(course);
      //update method updates not only the data in the memory store but also generates an http put request

      this.dialogRef.close();
      //we want immediately close the dialog, no need to wait until the BE call succeed
    } else if (this.mode == 'create') {
      this.coursesService.add(course)
           .subscribe(                     // this observable will complete when the BE call completes successfully
            newCourse => {
              console.log('New course', newCourse);

              this.dialogRef.close();
            }
           )
    } // add creates an http post request, by default it is pessimistic
    //(FE does not safely create entity id-s, but the database in relational dbs - but firebas eg. is the other way around)




  }


}
