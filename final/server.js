

const express = require('express');
const socketIO = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const port = 6789; //process.env.PORT || 3000;
var app = express();
let server = http.createServer(app);
var io = socketIO(server);
 
// make connection with user from server side
io.on('connection',
    (socket) => {
        console.log('New user connected');
 
        // listen for message from user
        socket.on('createMemo',
            (newMessage) => {
                console.log('newMessage', newMessage);
                // open the database
                let db = new sqlite3.Database('./memo.db', sqlite3.OPEN_READWRITE, (err) => {
                    if (err) {
                    console.error(err.message);
                    }
                    console.log('Connected to the memo database.');
                });
                
                let sql = `INSERT INTO memos ("to", "from", "msg")
                VALUES ("${newMessage.memo.to}", "${newMessage.memo.from}", "${newMessage.memo.body}");`;
                        
                db.run(sql, function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                    // get the last insert id
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                    socket.emit('memoCreated',"Successfully created memo.");
                    });
                
                db.close((err) => {
                    if (err) {
                    console.error(err.message);
                    }
                    console.log('Close the database connection.');
                });
                
            });
        
        socket.on('viewMemos',
        (options) => {
            console.log('viewMe', options);
            // open the database
            let db = new sqlite3.Database('./memo.db', sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                console.error(err.message);
                }
                console.log('Connected to the memo database.');
            });
            
            /*let usercheck = `SELECT 
            count(*)
            FROM memos
            WHERE "to" = "${options.to}";`;

            let numRows = 0;
            db.get(usercheck, [], (err, row) => {
                if (err) {
                  return console.error(err.message);
                }
                numRows = row.count;
              });
            console.log(numRows);
            
            if (numRows.count == null) {
                socket.emit('noMemosFound',"No memos found.");
            } else {*/
                //query db for messages
                let sql = `SELECT rowid, "to", "from", "msg", STRFTIME('%m/%d/%Y @ %H:%M', timestamp) AS ts
                FROM memos
                WHERE
                    "to" = "${options.to}" COLLATE NOCASE
                ORDER BY
                    rowid desc LIMIT ${options.count};
                `;
                        
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        console.error(err.message);
                        return;
                    } else {
                        rows.forEach((row) => {
                            socket.emit('displayMemo',
                            {
                                to: row.to,
                                from: row.from,
                                body: row.msg,
                                timestamp: row.ts
                            });
                        });
                    }
                    
                });
            //}
            
            
            db.close((err) => {
                if (err) {
                console.error(err.message);
                }
                console.log('Close the database connection.');
            });

        });
 
        // when server disconnects from user
        socket.on('disconnect',
            () => {
                console.log('disconnected from user');
            });
    });
 
app.get("/",
    (req, res) => {
        res.sendFile(__dirname + "/index.html");
    });
 
server.listen(port);

async function sendRequest(data, url, step) {
    let xhr = new XMLHttpRequest();
    
    console.log("data: ", data);
    console.log("data to String: ", JSON.stringify(data));

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
    xhr.send(data);
    console.log("sent request to server");
    xhr.onreadystatechange = function (oEvent) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Success! ",xhr.responseText);
                handleResponse(xhr, step);
            } else {
            console.log("Error: ", xhr.statusText);
            }
        }
    };
}
