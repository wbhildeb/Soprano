import { Project } from './project';

export const PROJECTS : Project[] = [
    new Project({
        title: 'EasyDocs',
        technologies: [ 'Python', 'SQLite', 'HTML', 'CSS', 'JavaScript' ],
        repositoryURL: 'https://github.com/wbhildeb/EasyDocs'
    }),
    new Project({
        title: 'Multiquadris',
        technologies: [ 'C++' ],
        repositoryURL: 'https://github.com/wbhildeb/Multiquadris',
        descriptionHTML: 'multiquadris.htm'
    }),
    new Project({
        title: 'Localize CS',
        technologies: [ 'Bash' ],
        repositoryURL: 'https://github.com/wbhildeb/localize-cs'
    }),
    new Project({
        title: 'Poker Stats',
        technologies: [ 'Java', 'SQL', ],
        repositoryURL: 'https://github.com/wbhildeb/Texas-Hold-em-Calculator'
    }),
    new Project({
        title: 'Ride the Bus',
        technologies: [ 'C#', ".NET" ],
        repositoryURL: 'https://github.com/wbhildeb/Ride-The-Bus'
    })
];