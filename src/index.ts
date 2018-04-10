/*------------------------------IMPORTS------------------------------*/
/*--------------------THIRD PARTY-------------------*/
/*--------------------CUSTOM-------------------*/
import "./common/env";
import Server from "./common/server";
import routes from "./routes";
import ExpressServer from "./common/server";
import L from "./common/logger";

const port = parseInt(process.env.PORT);
const app = new Server();
app.router(routes);
app.connectToDB().then(() => app.listen(port));

export default app;