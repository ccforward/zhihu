(function($){
    var calendar = new Calendar();
    calendar.init();

    var Daily = {
        _CONSTDATA: {
            history: {}
        },
        init: function(){
            this.events();
        },
        events: function(){
            var _self = this;
            $('#J_ZHCalendar').on('click', '.J_DailyData', function(e){
                var date = $(this).attr('data-date');
                date && _self.zhData(date);
            });
        },
        zhData: function(date){
            var _self = this;
            if(_self._CONSTDATA.history[date]){
                _self._render(_self._CONSTDATA.history[date]);
            }else {
                $.ajax({
                    type: 'GET',
                    url: '/d/'+date,
                    success: function(data){
                        // 存储已请求内容
                        var d = JSON.parse(data);
                        if(!_self._CONSTDATA.history[date]){
                            _self._CONSTDATA.history[date] = d;
                        }
                        _self._render(d);
                    }
                });

            }
        },
        _render: function(d){
            var list = '';
            for(var i=0,len=d.length;i<len;i++){
                list += '<p>'+d[i].title+'</p>';
            }
            $('.right-list').html(list);            
        }

    }
    Daily.init();
})(Zepto)