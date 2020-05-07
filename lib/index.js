"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = require("nodemailer");
var dotenv = require("dotenv");dotenv.config();
var path = require("path");
var fs = require("fs");
var util = require("util");

const readFile = util.promisify(fs.readFile);

class NotificationHub {
    /**
     * Construct NotificationHub config and create nodemailer Transporter with config
     * @constructor
     * @param {any} config 
     */
    constructor(config){
        this.config = config;
        this.notifcater = nodemailer.createTransport({
            host: config ? config.host : process.env.SMTP_HOST,
            port: config ? config.port : process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: config ? config.user : process.env.SMTP_USER,
                pass: config ? config.pass : process.env.SMTP_PASS // generated ethereal password
            }
        });
        this.message //this message expecting a promise<html>
        this.ConnectionDisable
    }

    /**
     * @param to whom this email send to 
     * @param subject email subject
     * @param text text to be in email body, which support text only
     * @param html text to be in email body, which support html
     * @returns void
     */
    
    async sendMail(to, subject, html) {
        
        if (this.message instanceof Promise) {
            var html = await this.message
        }else {
            var html = "<h1>No Template</h1>"
        }
        console.log(html)
        var mailOptions = {
            from: this.config ? this.config.senderAddress : process.env.SMTP_SENDER,
            to: to,
            subject: subject,
            html: html // html body
        };
        
        this.notifcater.sendMail(mailOptions).catch(
            // to access this object in errHandler, we should use => function, instead of pass function obj to catch
            (e) => this.errHandler(e)
            );
    }
    /**
     * 
     * @param {string} templateId in format T.<GROUP_ID>.<TEMPLATE_NUMBER>, template file store in <root>/template/email/<templateId>.html
     * 
     */
    msgTemplate(templateId) {
        const messagePath = path.resolve(process.cwd(),`template/email/${templateId}.html`)
        /**
         * this message should be a array of messages, which is observerbal of event,
         * @message {template, to, ...args}
         */
        this.message = readFile(messagePath).then(_ => _.toString()).catch(()=> `No template of ${templateId}`);
        return this
    }
    /**
     * 
     * @param {string} err 
     * @issue can not access this of 
     */
    errHandler(err) {
        switch (err.errno) {
            case "ETIMEOUT":
                console.log(`Connection timeout, queue up`)
                break;
            case "ECONNREFUSED":
                this.ConnectionDisable = true;
                console.log(`Connection Refuse, Host is not avaiable`);
                break;
            default:
                console.log(`Unknow Error ${err}`)

        }
    }
}

exports.NotificationHub = NotificationHub;
