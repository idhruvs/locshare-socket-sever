import express from 'express';
import chalk from 'chalk';
import socket from 'socket.io';
import http from 'http';

import middlewaresConfig from './config/middlewares';
import constants from './config/constants';

const app = express();
middlewaresConfig(app);

const server = http.createServer(app);
const io = socket(server); // < Interesting!

const users = [];



// We need this to make sure we don't run a second instance
if ( !module.parent ) {
    server.listen( constants.PORT, err => {
        if ( err ) {
            console.log( chalk.red( 'Cannot run!' ) );
        } else {
            console.log(
                chalk.green.bold(
                    `
        App started on port: ${ constants.PORT }
        Env: ${ process.env.NODE_ENV }
      `,
                ),
            );
        }
    });
}


// Socket Events
io.on( 'connection', socket => {
    console.log( chalk.green( 'New client connected at: ' , new Date() ) );
    
    socket.on( 'newUser', ( change ) => {
        console.log( chalk.green.bold( 'Username: ' , change.username ) );
        users.push( {username: change.username, location: change.location } );
        socket.emit('users', users);
        socket.emit('userLocation', {loc: users});
    });

    socket.on('locationUpdate', ( change ) => {
       var index = users.findIndex( (element) => {
           return element.username === change.username
       });
       users[index].location = change.location;
       socket.emit('users', users);

       console.log(index);
    });
    
    socket.on( 'location', ( change ) => {
        console.log( chalk.green.bold( 'Location: ', change.location ) );
    })
    socket.on( 'disconnect', () => console.log( chalk.blue( 'Client disconnected' ) ) );
});

export default server;