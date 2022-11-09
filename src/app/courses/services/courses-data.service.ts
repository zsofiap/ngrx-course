import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Course } from "../model/course";
import { map } from 'rxjs/operators';

//needed only if the rest data format is not the same as ngrx needs
@Injectable()
export class CoursesDataService extends DefaultDataService<Course> {

  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Course', http, httpUrlGenerator);
  }

  //to inform ngrx data how to call a request from the rest BE (which format etc.)
  getAll(): Observable<Course[]> {
    return this.http.get('/api/courses')
       .pipe(
         map(res => res["payload"]) // how to handle the response to get the data form the ngrx needs
       );
  }
}
