import 'whatwg-fetch'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
// 引入组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

import './statis/base.styl';
import './statis/month.styl';

const MonthData = document.querySelector('#dmonth').innerHTML;
const statisTop = echarts.init(document.querySelector('#star-comment'));        
const statisSum = echarts.init(document.querySelector('#star-comment-sum'));

let starData = {}, cmtData = {};

const paint = (data, dmonth) => {
    statisTop.setOption({
        title: { text: dmonth+' 点赞、评论 TOP 10' },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['点赞数','评论数'],
            x: 'center'
        },
        xAxis: [
            {
                type: 'category',
                data: ['1','2','3','4','5','6','7','8','9','10']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '点赞',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '评论',
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name:'点赞数',
                type:'bar',
                itemStyle: {
                    normal: {
                        color: '#4285f4'
                    }
                },
                data: starData.count
            },
            {
                name:'评论数',
                type:'line',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: '#f60'
                    },
                },
                lineStyle: {
                    normal: {
                        width: 5,
                        shadowColor: 'rgba(255, 102, 0, 0.5)',
                        shadowBlur: 5
                    }
                },
                data: cmtData.count
            }
        ]
    });

    statisSum.setOption({
        title: { text: '当月点赞和评论总数' },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            x: 'right',
            data:['点赞总数','评论总数']
        },
        series: [
            {
                name:'用户互动',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {
                        value: starData.sum, 
                        name:'点赞总数',
                        itemStyle: {
                            normal: {
                                color: '#4285f4'
                            }
                        },
                    },
                    {
                        value: cmtData.sum, 
                        name:'评论总数',
                        itemStyle: {
                            normal: {
                                color: '#f60'
                            }
                        },
                    }
                ]
            }
        ]
    })
}

const renderArticles = (articles, type) => {
    let statisData = starData;
    if(type == 'comment'){
        statisData = cmtData;
    }
    statisData.article = [];
    for(let j=0,length=statisData.aids.length;j<length;j++){
        for(let i=0,len=articles.length;i<len;i++){
            if(statisData.aids[j] == articles[i].id){
                statisData.article.push(articles[i])
            }
        }
    }
    let dom = '';
    for(let i=0,len=statisData.article.length;i<len;i++){
        dom += `<li><i>[${statisData.count[i]}]</i> <a href="/#/detail?aid=${statisData.article[i].id}">${statisData.article[i].title}</a></li>`
    }
    if(type == 'comment'){
        document.querySelector('.comment-top').innerHTML = dom;
    }else {
        document.querySelector('.star-top').innerHTML = dom;
    }
}
const fetchArticles = (aids, type) => {
    fetch(`/api-statis/articles/${aids}`)
        .then(function(response){
            return response.json()
        })
        .then(function(articles){
            renderArticles(articles, type);
        })
}


fetch(`/api-statis/month/${MonthData}`)
    .then(function(response){
        return response.json()
    })
    .then(function(json){
        if(json.length){
            if(json[0].type == 'star'){
                starData = json[0];
                cmtData = json[1];
            }else {
                starData = json[1];
                cmtData = json[0];
            }
            fetchArticles(starData.aids, 'star');
            fetchArticles(cmtData.aids, 'comment');
            paint(json, MonthData); 
        }else {
            paint([], MonthData);
        }
    })
    .catch(function(err){
        paint([], MonthData);
    })

