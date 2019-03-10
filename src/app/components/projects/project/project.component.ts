import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit
{
  repositoryURL : string = "https://github.com/wbhildeb/Multiquadris";
  title : string = "Multiquadris";
  technologies : string[] = [
    "C++",
  ];

  descriptionPath : string = "multiquadris.htm";
  projectDescription : string = "";

  constructor(private http: HttpClient)
  {
    this.http.get('assets/project-descriptions/' + this.descriptionPath, { responseType: 'text' })
      .subscribe(data => {
        this.projectDescription = data;
        console.log(data);
      });
  }

  ngOnInit() {}

  getTechnologiesList() : string
  {
    var retval: string = "";
    for (let i = 0; i < this.technologies.length; ++i)
    {
      retval += this.technologies[i];
      if (i != this.technologies.length - 1) retval += ", ";
    }

    return retval;
  }

}
