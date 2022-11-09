import { Course } from './../model/course';
import { Injectable } from "@angular/core";
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";


//fascade service, manages all the states of the store
@Injectable()
export class CourseEntityService extends EntityCollectionServiceBase<Course> {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Course', serviceElementsFactory);
  }
}
