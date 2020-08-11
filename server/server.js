const express = require("express")
const http = require("http")
const socketIo = require("socket.io");

const port = process.env.PORT || 6750;

const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
    console.log(`\x1b[95m${socket.handshake.address}\x1b[39m: \x1b[92mConnected\x1b[39m on \x1b[93m${socket.id}\x1b[39m`)
    socket.on("command", (data) => {
        console.log(`\x1b[95m${socket.handshake.address}\x1b[39m: Executed '\x1b[94m${data.cmd.replace("\n", " ").split(" ")[0]}\x1b[39m' in \x1b[93m${socket.id}\x1b[39m`)

        let message = "", returnData = data.data, displayCmd = true;
        switch (data.cmd.replace("\n", " ").split(" ")[0]) {
            case "cls":
            case "clear":
                message = "Successfully cleared the console!"
                displayCmd = false;
                returnData = []
                break;
            case "echo":
                message = data.cmd.substring(4);
                break;
            default:
                message = `Couldn't find a command called '${data.cmd}'`
                break
        }
        
        socket.emit("command-receive", displayCmd ? [{data: message, console: false}, {data: data.cmd, console: true}, ...returnData] : [{data: message, console: false}, ...returnData])
    })
    socket.on("disconnect", () => {
        console.log(`\x1b[95m${socket.handshake.address}\x1b[39m: \x1b[91mDisconnected\x1b[39m from \x1b[93m${socket.id}\x1b[39m`)
    })
})

server.listen(port, () => console.log(`Listening on port \x1b[96m${port}\x1b[39m`))
