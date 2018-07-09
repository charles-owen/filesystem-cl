/**
 * @file
 * File system console components
 */



let FileSystemConsole = function() {

}


Console.tables.add({
    title: 'FileSystem',
    order: 5,
    api: '/api/filesystem/tables'
});

// Console.components.addOption({
//     atLeast: Users.User.STAFF,
//     page: {title: 'Main', route: '', order: 1},
//     section: {title: 'Site', order: 1},
//     title: 'Users',
//     order: 1,
//     route: '/users',
//     routes: [
//         {route: '/users', component: UsersEditorComponent, props: {management: false}}
//     ]
// });
//
//
// Console.components.addOption({
//     atLeast: Users.User.ADMIN,
//     page: {title: 'Management', route: '/management', order: 10},
//     section: {title: 'Site Management', order: 1},
//     title: 'Users',
//     order: 1,
//     route: '/management/users',
//     routes: [
//         {route: '/management/users', name: 'users', component: UsersEditorComponent, props: {management: true}},
//         {route: '/management/user/:id', name: 'user', component: UserEditorComponent, props: true}
//     ]
// });

export default FileSystemConsole;
