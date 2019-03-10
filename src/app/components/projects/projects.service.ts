import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Project } from './project';
import { PROJECTS } from './project-data';


@Injectable({
    providedIn: 'root',
})
export class ProjectsService
{
    constructor(private http: HttpClient) {}

    public getProjects(): Observable<Project[]>
    {
        return of(PROJECTS);
    }

    public getDescription(project: Project) : Observable<string>
    {
        return this.http.get('assets/project-descriptions/' + project.descriptionHTML, { responseType: 'text' });
    }
}