import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Project } from '../project';
import { ProjectsService } from '../projects.service';


@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnChanges {
    @Input() project: Project;

    description: string = "";
    technologies: string = "";

    constructor(private projectsService: ProjectsService) { }

    ngOnChanges(changes: SimpleChanges)
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
        const techList = this.project.technologies;
        this.technologies = "";
        for (let i = 0; i < techList.length; ++i)
        {
            this.technologies += techList[i];
            if (i != techList.length - 1) this.technologies += ", ";
        }
    }
}
