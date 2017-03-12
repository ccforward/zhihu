"use strict";

const CronJob = require('cron').CronJob;
const CONFIG = require('../../config');
const zhAPI = require('../api/index-promise');
const Spider = require('../spider');
const DateCalc = require('./date');


// ============== BAE node-log ==============
let logger = console;
if(!CONFIG.log.openBae){
    let logger = require('log4js').getLogger('cheese');
}

const d = new DateCalc()

const Task = {
    fire: function(){
        this.hourly();
        this.daily();
        this.weekly();
    },
    // 00:00 - 23:00 每1个小时爬取一次lastest
    hourly: function(){
        new CronJob('00 00 0-23/1 * * *', function(){
            Spider.latest();
        }, function(){
            logger.info('hourly cron-job over')
        }, true, 'Asia/Shanghai');
    },
    // 每天23:50 爬取当天的数据
    daily: function(){
        new CronJob('00 50 23 * * *', function(){
            const day = new DateCalc()
            Spider.day(day.after())
        }, function(){
            logger.info('daily cron-job over @date:' + new Date())
        }, true, 'Asia/Shanghai');
    },
    
    // 每周三、日 03:30 更新前7天的评论点赞数 
    // 从start到end前一天 共7天
    weekly: function(){
        new CronJob('00 30 03 * * 0,3', function(){
            const start = d.before()
            const end = d.before(8)
            Spider.updateCmtCount(start, end);
        }, function(){
            logger.info('weekly cron-job over ')
        }, true, 'Asia/Shanghai');
    }
}

module.exports = Task;