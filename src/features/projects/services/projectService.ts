export function extractProjectFromTitle(title: string, projects: string[]) {
    const trimmedTitle = title.trimStart();
    const project = projects
        .filter(item => trimmedTitle.toLocaleLowerCase().startsWith(item.toLocaleLowerCase()))
        .sort((first, second) => second.length - first.length)[0];

    return {
        project,
        title: project ? trimmedTitle.slice(project.length).trimStart() : title,
    };
}
