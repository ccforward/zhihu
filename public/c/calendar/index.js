function Calendar(date){
    var d = '';
    if(!date){
        d = new Date();
    } else {
        d = new Date(date);
    }
    this.weekDay = d.getDay();
    this.day = d.getDate();
    this.month = d.getMonth()+1;
    this.year = d.getFullYear();
    this.firstWeekDay = new Date(this.year + '-' + this.month + '-01').getDay();
}

Calendar.prototype = {
    constructor: Calendar,
    // 常量
    _CONST: {
        monthDays: ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"],
        weekDays: ["一", "二", "三", "四", "五", "六", "日"]
        
    },
    init: function(){
        var _self = this;
        _self._renderControl();
        _self._renderWeek();
        _self._renderDays();
        
    },
    _renderControl: function(){
        var _self = this;
        var year = '<div class="year-box dib">2015</div>';
        var month = '<div class="month-box dib"><a href="#" class="prev"><</a>07<a href="#" class="next">></a></div>';
        var ctrl = '<div class="control">'+year+month+'</div>';


        // $('#J_ZHCalendar').append(ctrl);
    },
    _renderWeek: function(){
        var _self = this;
        var weekBody = [];
        for(var i=0, len=_self._CONST.weekDays.length; i<len;i++){
            weekBody.push('<li>'+_self._CONST.weekDays[i]+'</li>')
        }
        var week = '<ul class="week">' + weekBody.join('') + '</ul>';
        $('#J_ZHCalendar').append(week);
        $('#J_ZHCalendar .week').width($('#J_ZHCalendar .week li').width()*7)
    },
    _renderDays: function(){
        var _self = this;
        // 天数
        var totalDays = _self._CONST.monthDays[_self.month-1];
        // 1号星期
        var weekDay = _self.firstWeekDay;
        // 前序空白
        var blanks = _self.firstWeekDay - 1;
        // 
        var daysBody = [];
        var d = 1;
        for(var i=0,len=parseInt(blanks)+parseInt(totalDays);i<len;i++){
            
            if(i<blanks){
                daysBody.push('<li>0</li>')
            }else {
                var day = '';
                if(d == _self.day){
                    day = '<li class="J_DailyData current" data-date="'
                }else {
                    day = '<li class="J_DailyData" data-date="'
                }
                var dailyDate = _self.year + '' + _self._coverDay(_self.month);
                daysBody.push(day + dailyDate + _self._coverDay(d) + '">' + d + '</li>');
                d++;
            }
        }
        var days = '<ul class="days">' + daysBody.join('') + '</ul>';
        $('#J_ZHCalendar').append(days);  
        $('#J_ZHCalendar .days').width($('#J_ZHCalendar .week').width());      
    },
    _coverDay: function(d){
        return d = d<10 ? '0'+d : d;
    },
    _changeMonth: function(){

    }
};

