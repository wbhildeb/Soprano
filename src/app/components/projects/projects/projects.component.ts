import { Component, OnInit } from '@angular/core';

import { ProjectsService } from '../projects.service';
import { Project } from '../project';


@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit
{
    selectedProject : Project = null;
    projects : Project[] = [];
    index: number;
    constructor(private projectsService: ProjectsService) {}

    ngOnInit()
    {
        this.updateProjects();
    }

    updateProjects()
    {
        this.projectsService
            .getProjects()
            .subscribe(projects => {
                this.projects = projects;
            });
    }

    onSelectProject(index: number)
    {
        console.log(index);
        if (this.projects.length == 0)
        {
            throw 'Projects array is empty'
        }
        else if (index < 0 || index >= this.projects.length)
        {
            throw `Index out of range [0, ${this.projects.length-1}]`
        }

        this.selectedProject = this.projects[index];
        this.index = index;
    }
}
