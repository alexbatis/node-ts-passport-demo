import async from "async";
// import crypto from "crypto";
// import nodemailer from "nodemailer";
import * as passport from "passport";
import { default as User, UserModel } from "../../../models/mongo/User";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { WriteError } from "mongodb";

const request = require("express-validator");

export class Controller {

    getUserInfo(req: Request, res: Response, next: NextFunction){
        return (req.user) ? res.send(req.user) : res.send('no user logged in');
    }

    login(req: Request, res: Response, next: NextFunction): void {
        req.assert("email", "Email is not valid").isEmail();
        req.assert("password", "Password cannot be blank").notEmpty();
        req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

        const errors = req.validationErrors();

        if (errors) {
            //   req.flash("errors", errors);
            //   return res.redirect("/login");
            res.send(errors);
            return;
        }

        passport.authenticate("local", (err: Error, user: UserModel, info: IVerifyOptions) => {
            if (err) { return next(err); }
            if (!user) {
                // req.flash("errors", info.message);
                // return res.redirect("/login");
                res.send(info.message);
                return;
            }
            req.logIn(user, (err) => {
                if (err) { return next(err); }
                // req.flash("success", { msg: "Success! You are logged in." });
                // res.redirect(req.session.returnTo || "/");
                res.send(user);
                return;
            });
        })(req, res, next);
    }


    //Create a new local account.
    signup(req: Request, res: Response, next: NextFunction) {
        req.assert("email", "Email is not valid").isEmail();
        req.assert("password", "Password must be at least 4 characters long").len({ min: 4 });
        req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);
        req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

        const errors = req.validationErrors();

        if (errors) {
            //   req.flash("errors", errors);
            //   return res.redirect("/signup");
            res.send(errors);
            return;
        }

        const user = new User({
            email: req.body.email,
            password: req.body.password
        });

        User.findOne({ email: req.body.email }, (err, existingUser) => {
            if (err) { return next(err); }
            if (existingUser) {
                // req.flash("errors", { msg: "Account with that email address already exists." });
                // return res.redirect("/signup");
                res.send("Account with that email address already exists.");
                return;
            }
            user.save((err) => {
                if (err) { return next(err); }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    // res.redirect("/");
                    res.send(user);
                    return;
                });
            });
        });
    };

    logout(req: Request, res: Response) {
        req.logout();
        res.send('logged out');
    };
}
export default new Controller();
