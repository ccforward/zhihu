"use strict";

const mail = require('../../config').mail
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: mail
});

module.exports = transporter
