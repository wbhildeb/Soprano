export class Project
{
    title: string = "Silly Walker forgot a title...";
    technologies: string[] = [];
    repositoryURL: string = null;
    descriptionHTML: string = "default.htm";

    constructor (data: Partial<Project>)
    {
        Object.assign(this, data);
    }
}