"use strict";

const CronJob = require('cron').CronJob;
const CONFIG = require('../../config');
const zhAPI = require('../api/index-promise');
const Spider = require('./spider');
const DateCalc = require('./date');


// ============== BAE node-log ==============
let logger = console;
if(!CONFIG.log.openBae){
    let logger = require('log4js').getLogger('cheese');
}

const Task = {
    fire: function(){
        this.hourly();
        this.daily();
        this.weekly();
    },
    // 07:00 - 22:00 每1个小时爬取一次lastest
    hourly: function(){
        new CronJob('00 00 7-22/1 * * *', function(){
            Spider.latest();
        }, function(){
            logger.info('hourly cron-job over')
        }, true, 'Asia/Shanghai');
    },
    // 每天23:30 爬取当天的数据
    daily: function(){
        new CronJob('00 30 23 * * *', function(){
            var date = new DateCalc().after();
            Spider.day(date);
        }, function(){
            logger.info('daily cron-job over @date:' + new Date())
        }, true, 'Asia/Shanghai');
    },
    
    // 每周三、日 00:30 更新前7天的评论点赞数 
    // 从start到end前一天 共7天
    weekly: function(){
        new CronJob('00 30 00 * * 0,3', function(){
            var start = new DateCalc().before(),
                end = new DateCalc().before(8);
            Spider.updateCmtCount(start, end);
        }, function(){
            logger.info('weekly cron-job over ')
        }, true, 'Asia/Shanghai');
    }
}

module.exports = Task;