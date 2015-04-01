# 知乎日报收集

## 功能 TODO
* 爬下所有文章 离线到本地
* 添加搜索引擎，全文检索
* 文章保存为pdf/jpg

## API
代理之乎日报的HTTP请求后发现的之乎日报的部分API，如下：

### 1、启动界面图像

* URL `http://news-at.zhihu.com/api/4/start-image/1080*1776`
* 图像分辨:
	* 320*432
	* 480*728
	* 720*1184
	* 1080*1776
	
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

### 5、文章长评论
* URL `http://news-at.zhihu.com/api/4/story/4628696/long-comments` 
* story后面即为文章的id

### 6、文章短评论
* URL `http://news-at.zhihu.com/api/4/story/4628696/short-comments` 

### 7、主题日报的列表
* URL `http://news-at.zhihu.com/api/4/themes`

### 8、主题日报内容
* URL `http://news-at.zhihu.com/api/4/theme/2`


### 9、合集
合集总览 `http://news-at.zhihu.com/api/3/sections`

* 深夜惊奇
	* URL `http://news-at.zhihu.com/api/4/section/1`
* 瞎扯
	* URL `http://news-at.zhihu.com/api/4/section/2`
* 饿了
	* URL `http://news-at.zhihu.com/api/4/section/17`





