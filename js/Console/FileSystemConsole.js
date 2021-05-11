/**
 * @file
 * File system console components
 */

import FileSystemComponent from './FileSystemComponent.vue';

export let FileSystemConsole = function(site) {
    const Console = site.console;

    Console.tables.add({
        title: 'FileSystem',
        order: 30,
        api: '/api/filesystem/tables'
    });

    Console.components.addOption({
        atLeast: Site.User.STAFF,
        page: {title: 'Main', route: '', order: 1},
        section: {title: 'Site', order: 1},
        title: 'File System',
        order: 10,
        route: '/filesystem',
        routes: [
            {route: '/filesystem', component: FileSystemComponent}
        ]
    });


}
