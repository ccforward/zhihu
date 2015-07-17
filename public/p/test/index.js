(function($){
    var calendar = new Calendar();
    calendar.init();

    var Daily = {
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
            $.ajax({
                type: 'GET',
                url: '/d/'+date,
                success: function(data){
                    var d = JSON.parse(data);
                    var list = '';
                    for(var i=0,len=d.length;i<len;i++){
                        list += '<p>'+d[i].title+'</p>';
                    }
                    $('.right-list').html(list);
                }
            })
        }

    }
    Daily.init();
})(Zepto)