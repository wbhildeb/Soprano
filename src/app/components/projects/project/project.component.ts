import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../project';
import { ProjectsService } from '../projects.service';


@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
    @Input() project: Project;

    description: string = "";
    technologies: string = "";

    constructor(private projectsService: ProjectsService) { }

    ngOnInit()
    {
        this.updateDescription();
        this.updateTechnologies();
    }

    updateDescription()
    {
        this.projectsService
            .getDescription(this.project)
            .subscribe(desc => {
                this.description = desc;
            });
    }

    updateTechnologies()
    {
       this.technologies = "";
        for (let i = 0; i < this.technologies.length; ++i)
        {
            this.technologies += this.technologies[i];
            if (i != this.technologies.length - 1) this.technologies += ", ";
        }
    }
}
