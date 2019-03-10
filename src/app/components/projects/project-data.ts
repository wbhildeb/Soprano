import { Project } from './project';

export const PROJECTS : Project[] = [
    new Project({
        title: 'Multiquadris',
        technologies: [ 'C++' ],
        repositoryURL: 'https://github.com/wbhildeb/Multiquadris',
        descriptionHTML: 'multiquadris.htm'
    }),
    new Project({
        title: 'Localize CS',
        technologies: [ 'Bash' ]
    }),
    new Project({
        title: 'Poker Stats Calculator',
        technologies: [ 'Java', 'SQL', ]
    }),
];