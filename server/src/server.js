const connectDatabase = require("./Config/db");
const app = require("./app");
const { serverPort } = require("./config");

app.listen(serverPort, async () => {
    console.log(`listening on serverPort ${serverPort}`);
    await connectDatabase()
});