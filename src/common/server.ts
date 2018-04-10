/*--------------------THIRD PARTY-------------------*/
import * as express from "express";
import { Application, Request, Response, NextFunction } from "express";
import * as path from "path";
// import * as expressValidator from "express-validator";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as os from "os";
import * as cookieParser from "cookie-parser";
import * as net from "net";
import * as passport from "passport";
import * as session from "express-session";
import * as mongo from "connect-mongo";
import * as expressValidator from "express-validator";
/*--------------------CUSTOM-------------------*/
import swaggerify from "./swagger";
import L from "./logger";
import db from "./mongodb";
import * as passportConfig from "./passport";
/*------------------------------MODULE CONSTANTS---------------------*/
// const this.app = express();
const database = new db();
const MongoStore = mongo(session);

/*------------------------------MODULE DEFINITION--------------------*/
export default class ExpressServer {
  app = express();
  /*--------------------CONSTRUCTOR----------------------------------*/
  constructor() {
    passportConfig;
    const root = path.normalize(__dirname + "/../..");
    this.app.set("this.appPath", root + "client");
    this.app.use(expressValidator());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser(process.env.SESSION_SECRET));
    this.app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      store: new MongoStore({
        url: process.env.MONGODB_URI,
        autoReconnect: true
      })
    }));
    this.app.use(express.static(`${root}/public`));
    this.app.use(passport.initialize());
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    // require('./passport')(passport);//add this line
    this.app.use((req, res, next) => {
      res.locals.user = req.user;
      next();
    });

    interface ABExpressSession {
      key: string // Available using `S3`.
      path: string // Available using `DiskStorage`.
      mimetype: string
      originalname: string
      size: number
      returnTo: any;
    }
    // this.app.use((req: any, res, next) => {
    //   // After successful login, redirect back to the intended page
    //   if (!req.user &&
    //     req.path !== "api/v1/auth/login" &&
    //     req.path !== "api/v1/auth/signup" &&
    //     !req.path.match(/^\/auth/) &&
    //     !req.path.match(/\./)) {
    //     req.session.returnTo = req.path;
    //   } else if (req.user &&
    //     req.path == "/account") {
    //     req.session.returnTo = req.path;
    //   }
    //   next();
    // });
  }

  /*--------------------FUNCTIONS------------------------------------*/
  isPortTaken(port: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const tester: any = net.createServer()
        .once("error", (err: any) => (err.code == "EADDRINUSE" ? resolve(false) : reject(err)))
        .once("listening", () => tester.once("close", () => resolve(true)).close())
        .listen(port);
    });
  }

  // Registers this.app with router & swagger docs
  router(routes: (app: Application) => void): ExpressServer {
    swaggerify(this.app, routes);
    return this;
  }

  // makes connection to db
  async connectToDB(): Promise<boolean> {
    try {
      const connected: boolean = await database.connect();
      return true;
    }
    catch (err) {
      L.fatal(`Error connecting to database. Please make sure database is running. ${err}`);
    }
  }

  listen(port = parseInt(process.env.PORT)): Application {
    const welcome = (port: number) => () => L.info(`up and running in ${process.env.NODE_ENV || "development"} @: ${os.hostname()} on port: ${port}}`);
    http.createServer(this.app).listen(port, welcome(port));
    return this.app;
  }
}