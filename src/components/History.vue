<template>
    <section class="history">
      <div class="date" v-if="day.month">
        <span><i class="m">{{ day.month.substr(0,3) }}</i><i class='d'>{{ day.month.substr(3,2) }}</i></span>
        <small>{{ day.date }}</small>
      </div>
      <ul>
        <li v-for="item in day.data">
          <router-link :to="{path: 'detail', query:{aid: item.id}}">
            <span class="title">{{item.title}}</span> 
            <img :src="'http://ccforward.sinaapp.com/api/proxy.php?url='+item.image">
            <p class="sns">
              <i :class="item.popularity>500 && 'hot' ">{{ item.popularity }} likes</i> | 
              <i>{{ item.comments }} comments</i>
            </p>
          </router-link>
        </li>
      </ul>
  </section>
</template>


<script>
export default {
  name: 'history-item',
  props: ['day']
};
</script>


<style lang="stylus">
.history {
  a {
    text-decoration none !important
  }
  ul {
    border-top 1px solid #ccc
  }
  .sns {
    margin-left 10px
    font-size 13px
    color #999
    i {
      font-style normal
    }
  }
  .hot {
    color #f06
  }
  .date {
    padding 12px 0
    margin 10px 0
    margin-left -59px
    font-size 0
    span {
      display inline-block
      padding 2px 0
      margin-right 25px
      width 34px
      height 40px
      background #948CF1
      color #fff
      text-align center
    }
    i {
      position relative
      font-style normal
      display block
      &.m {
        top 2px
        font-size 12px
        text-transform uppercase
        letter-spacing 1px
      }
      &.d {
        margin-top 4px
        font-size 16px
      }
    }
  }
  small {
    display inline-block
    height 44px
    line-height 44px
    color #4e627a
    text-align center
    font-size 16px
    font-weight 600
    vertical-align: top;
  }
}
</style>