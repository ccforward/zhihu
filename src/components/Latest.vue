<template>
  <ul class="history">
    <li v-for="item in data">
        <router-link :to="{path: 'top-detail', query:{aid: item.id}}"> 
          <span class="title">{{item.title}}</span>
          <!-- <img v-lazy="'http://ccforward.sinaapp.com/api/proxy.php?url='+item.image"> -->
          <div class="img" v-lazy:background-image="'http://ccforward.sinaapp.com/api/proxy.php?url='+item.image"></div>
          <p class="sns">
            <i :class="item.popularity>500 && 'hot' ">{{ item.popularity || 0 }} likes</i> | 
            <i>{{ item.comments || 0 }} comments</i>
          </p>
        </router-link>
    </li>
  </ul>
</template>


<script>
export default {
  name: 'latest-item',
  props: ['data']
};
</script>

<style lang="stylus" scoped>
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
</style>