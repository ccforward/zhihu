# 知乎日报的 Spider-Man

[详细介绍](https://github.com/ccforward/cc/issues/45)

## About

Node.js + Vue.js + MongoDB 的知乎日报爬虫项目

## 技术栈

#### 后端

Node.js + Express + MongoDB

使用 Express 搭建 web 服务，爬虫爬取的数据用 MongoDB 存储。


用 node-jieba分词 分析正文的tag，做则更能准确的数据分析和内容搜索 (doing)

#### 前端

ES6 + Vue + Webpack

基于 Vue2.0 的单页面应用 用webpack做前端代码构建

数据统计的页面使用原生 ES6 代码编写，单独配置了webpack做构建，没有和 Vue 的webpack构建代码混在一起

## 说明


### config.js.sample

config.js.sample 重命名为 config.js

说明:

* auth 知乎日报用来验证用户的key 用于http的请求头(真正的key叫做 `Authorization`)
* spider.fire 是否启动爬虫爬取历史信息
* spider.openTask 是否启动爬虫定时任务
* spider.interval 爬虫间隔时间
* spider.start spider.end  爬历史数据的开始结束时间 （知乎日报生日: 20130519）
* start时间 比 end时间 晚

如果在页面的HTTP的请求头里想加入 auth 和 referer 可以用这个 [chrome扩展](https://github.com/ccforward/C-Header)
![](http://ww2.sinaimg.cn/large/7853084cjw1f6wvzw1utxj208w0bhjrp.jpg)

## 知乎日报的API

### 1、启动界面图像

* URL `http://news-at.zhihu.com/api/4/start-image/1080*1776`
* 图像分辨:
	* 320*432
	* 480*728
	* 720*1184
	* 1080*1776

现在返回的图片应该都不再区分分辨率，都是同一尺寸了
	
### 2、最新消息
* URL `http://news-at.zhihu.com/api/4/news/latest`


### 3、历史消息
* URL `http://news.at.zhihu.com/api/4/news/before/20150101`
* 请求 20150101 返回 2014年12月31日 的内容
* 请求日期大于今日 返回今日的内容

### 4、文章详情内容
* URL `http://news-at.zhihu.com/api/4/news/4620055`
* 参数： 最新消息和历史消息返回的字段: id
* 返回信息：
	* body： HTML格式的详情文章
	* title：文只标题
	* image：文章顶部的大图
	* image-source：图片的版权信息
* 特殊情况：
	* `http://news-at.zhihu.com/api/4/story/3942319`
	* 来自之乎日报站外的内容
	* 返回的字段 没有body、img、image-source等字段
	* share_url 字段会跳转到站外文章

#### 4.1、文章详情的点赞数、长评论、短评论数量
* URL `http://news-at.zhihu.com/api/4/story-extra/7033320`
* 返回信息：
	* long_comments： 长评论
	* popularity：点赞数
	* short_comments：短评论数
	* comments：总评论数

### 5、文章长评论
* URL `http://news-at.zhihu.com/api/4/story/4628696/long-comments` 
* story后面即为文章的id

### 6、文章短评论
* URL `http://news-at.zhihu.com/api/4/story/4628696/short-comments` 

### 7、主题日报的列表
* URL `http://news-at.zhihu.com/api/4/themes`

### 8、主题日报内容
* URL `http://news-at.zhihu.com/api/4/theme/2`





