<template>
  <div id="comment" class="article-comments">
    <section class="item" v-for="item in comments">
      <div class="avatar">
        <img v-lazy="'http://ccforward.sinaapp.com/api/proxy.php?url='+item.avatar">
      </div>
      <div class="content">
        <p class="author">{{ item.author }} <span :class="item.likes>10 && 'hot' "><i class="icon like"></i>{{ item.likes }}</span></p>
        <p class="cmt">
          {{ item.content }}
        </p>
        <div v-if="item.reply_to" class="reply">
          <span>//{{item.reply_to.author}} : </span>{{ item.reply_to.content }}
        </div>
        <span class="date">{{ item.time | date }}</span>
      </div>
    </section>
  </div>
</template>


<script>
export default {
  name: 'article-comments',
  props: ['comments']
};
</script>


<style lang="stylus">
.article-comments {
  margin-bottom 20px
  .item {
    display flex
    padding 15px 0 10px
    border-top 1px solid #ccc
  }
  .avatar {
    width 50px
    height 50px
    margin-right 10px
  }
  img {
    width 100%
    border-radius 50%
  }
  p {
    margin 0
  }
  .content {
    flex 1
  }
  .author {
    margin-bottom 5px
    line-height 20px
    font-size 14px
    font-weight bold
    color #000
    span {
      float right
      color #888
      font-size 13px
      font-weight normal
      &.hot {
        color #f06
        font-weight bold
      }
      .icon {
        margin-right 5px
        width 13px
        height 13px
      }
    }
  }
  .cmt {
    margin-bottom 5px
    font-size 13px
    color #333
  }
  .date {
    float right
    font-size 12px
    color #bbb
  }
  .reply {
    font-size 13px
    color #999
    margin-bottom 5px
    margin-left 10px
    span {
      font-weight bold
      color #333
    }
  }
}
</style>