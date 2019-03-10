import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Project } from './project';
import { PROJECTS } from './project-data';

@Injectable({
    providedIn: 'root',
})
export class ProjectsService
{
    constructor() {}

    getProjects(): Observable<Project[]>
    {
        return of(PROJECTS);
    }

}