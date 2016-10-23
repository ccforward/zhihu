import 'whatwg-fetch'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
// 引入组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

import DateCalc from '../common/util/date'

import './statis/base.styl';
import './statis/year.styl';

const $ = document.querySelector.bind(document);
const starColor = '#4285f4';
const cmtColor = '#f60';
const $Loading = $('.loading');
const YearData = $('#dyear').innerHTML;

const renderArticles = (topData, container) => {
    let dom = '',
        arts = topData.articles;
    for(let i=0,len=arts.length;i<len;i++){
        dom += `<li><i class='month'>${arts[i].dtime.substr(0,6)}：</i><i>[${topData.counts[i]}]</i> <a href="/#/detail?aid=${arts[i].id}">${arts[i].title}</a></li>`
    }
    container.innerHTML = dom
}
const fetchArticles = aids => {
    return fetch(`/api-statis/articles/${aids}`)
        .then(function(response){
            return response.json()
        })
        .catch(function(){
            return [];
        })
}

const renderCharts = (data) => {
    // echarts 图表容器
    const chartSum = echarts.init($('#sum-all'));        
    const chartTopStar = echarts.init($('#top-star'));
    const chartTopCmt = echarts.init($('#top-cmt'));

    // 每月总数
    let sumStarData = []; 
    let sumCmtData = [];

    // 全年总数
    let sumStarCount = 0; 
    let sumCmtCount = 0;

    // 每月最高
    let topMonthStar = {
        counts: [],
        aids: [],
        articles: []
    }; 
    let topMonthCmt = {
        counts: [],
        aids: [],
        articles: []
    };

    for(let s of data.star){
        sumStarCount += parseInt(s.sum);
        sumStarData.push(s.sum);
        topMonthStar.counts.push(s.count[0])
        topMonthStar.aids.push(s.aids[0])
    }
    for(let c of data.cmt){
        sumCmtCount += parseInt(c.sum)
        sumCmtData.push(c.sum)
        topMonthCmt.counts.push(c.count[0])
        topMonthCmt.aids.push(c.aids[0])
    }

    // 渲染总数
    chartSum.setOption({
        title: { text: YearData+'每月点赞、评论总数' },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
           feature: {
               magicType: {show: true, type: ['line', 'bar']},
               restore: {show: true},
               saveAsImage: {show: true}
           }
       },
       legend: {
            data:['点赞总和','评论总和'],
            x: 'center'
        },
        xAxis: [
            {
                type: 'category',
                data: data.month
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '点赞总和',
                nameTextStyle: {
                    color: starColor
                },
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '评论总和',
                nameTextStyle: {
                    color: cmtColor
                },
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name:'点赞总和',
                type:'bar',
                itemStyle: {
                    normal: {
                        color: starColor
                    }
                },
                data: sumStarData
            },
            {
                name:'评论总和',
                type:'line',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: cmtColor
                    },
                },
                lineStyle: {
                    normal: {
                        width: 5,
                        shadowColor: '#rgba(255, 102, 0, 0.5)',
                        shadowBlur: 2
                    }
                },
                data: sumCmtData
            }
        ]
    });
    $('#sum-star-count strong').innerHTML = sumStarCount;
    $('#sum-cmt-count strong').innerHTML = sumCmtCount;


    // 获取最多点赞评论文章标题
    fetchArticles(topMonthStar.aids).then(function(d){
        for(let j=0,length=topMonthStar.aids.length;j<length;j++){
            for(let i=0,len=d.length;i<len;i++){
                if(topMonthStar.aids[j] == d[i].id){
                    topMonthStar.articles.push(d[i])
                }
            }
        }
        renderArticles(topMonthStar, $('#star-articles'))
    });
    fetchArticles(topMonthCmt.aids).then(function(d){
        for(let j=0,length=topMonthCmt.aids.length;j<length;j++){
            for(let i=0,len=d.length;i<len;i++){
                if(topMonthCmt.aids[j] == d[i].id){
                    topMonthCmt.articles.push(d[i])
                }
            }
        }
        renderArticles(topMonthCmt, $('#cmt-articles'))
    });




    console.log(topMonthStar)
    console.log(topMonthCmt)

    // 渲染每月最多
    chartTopStar.setOption({
        title: { text: YearData+'每月最多点赞文章' },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['最多点赞'],
            x: 'center'
        },
        xAxis: [
            {
                type: 'category',
                data: data.month
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '单篇最多点赞',
                nameTextStyle: {
                    color: starColor
                },
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name:'最多点赞',
                type:'line',
                itemStyle: {
                    normal: {
                        color: starColor
                    },
                },
                lineStyle: {
                    normal: {
                        width: 5,
                        shadowColor: '#rgba(255, 102, 0, 0.5)',
                        shadowBlur: 2
                    }
                },
                data: topMonthStar.counts
            }
        ]
    });

    chartTopCmt.setOption({
        title: { text: YearData+'每月最多评论文章' },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['最多评论'],
            x: 'center'
        },
        xAxis: [
            {
                type: 'category',
                data: data.month
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '单篇最多评论',
                nameTextStyle: {
                    color: cmtColor
                },
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name:'最多评论',
                type:'line',
                itemStyle: {
                    normal: {
                        color: cmtColor
                    },
                },
                lineStyle: {
                    normal: {
                        width: 5,
                        shadowColor: '#rgba(255, 102, 0, 0.5)',
                        shadowBlur: 2
                    }
                },
                data: topMonthCmt.counts
            }
        ]
    });



}




fetch(`/api-statis/year/${YearData}`)
    .then(function(response){
        return response.json()
    })
    .then(function(json){
        if(json.length){
            $Loading.classList.add('hide');
            renderCharts(json[0]);
        }else {
            $Loading.classList.add('hide');
            $('.app').innerHTML = '<h1>还没统计</h1>'
        }
    })

