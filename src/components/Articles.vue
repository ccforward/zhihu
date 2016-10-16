<template>
  <div class="article">
    <div class="img-wrap" :style="{'background-image':`url(${article.image})`}">
      <h1>{{ article.title }}</h1>
      <span>{{  article.imageSource }}</span>
      <div class="img-mask"></div>
    </div>
    <article v-html="article.body"></article>
  </div>
</template>


<script>
export default {
  name: 'article-item',
  props: ['article']
};
</script>


<style lang="stylus">
.article {
  padding-top 20px
  margin-bottom 50px
  .headline {
    border-bottom 4px solid #f6f6f6
    .headline-background-link {
      line-height 2em
      position relative
      display block
      padding 20px 45px 20px 20px!important
      text-decoration none !important
      .heading {
        color #999
        font-size 15px!important
        margin-bottom 8px
        line-height 1em
      }
      .heading-content {
        color #444
        font-size 17px!important
        line-height 1.2em
      }
    }
    .icon-arrow-right {
      position absolute
      top 50%
      right 20px
      background-image url(http://static.daily.zhihu.com/img/share-icons.png)
      background-repeat no-repeat
      display inline-block
      vertical-align middle
      background-position -70px -20px
      width 10px
      height 15px
      margin-top -7.5px
    }
  }
  h1 {
    position absolute
    bottom 10px
    padding 0 40px
    color #fff
    text-shadow 0 1px 2px rgba(0,0,0,.3)
    z-index 1
  }
  .img-wrap {
    position relative
    width 100%
    height 400px
    background-repeat no-repeat
    background-size cover
    span {
      position absolute
      bottom 10px
      z-index 1
      font-size 12px
      color rgba(255, 255, 255, 0.6)
      right 10px
      text-shadow 0 1px 2px rgba(0,0,0,.3)
    }
    .img-mask {
      position absolute
      top 0
      width 100%
      height 100%
      background linear-gradient(180deg, rgba(0, 0, 0, 0) 65%,rgba(0,0,0,.6))
    }
  }
  article {
    font-size 15px
    ol, ul {
      padding-left: 20px;
    }
    .main-wrap {
      -webkit-font-smoothing antialiased
    }
    .question-title {
      line-height 1.4em
      color #494b4d
      font-weight 700
      font-size 18px
      margin 20px 0
    }
    .meta {
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
      font-size 16px
      color #b8b8b8
      span {
        vertical-align middle
      }
      .author {
        color #444
        font-weight 700
      }
      .bio {
        color #999
      }
    }
    .comment-meta .avatar, 
    .meta .avatar {
        width 20px
        height 20px
        border-radius 2px
        margin-right 5px
        vertical-align middle
    }
    .content {
      font-size 17px
      color #616466
      img {
        width 100%
      }
    }
  }
}
</style>