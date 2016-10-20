<template>
  <ul class="history">
    <li v-for="item in data">
        <router-link :to="{path: 'detail', query:{aid: item.id}}"> 
          <span class="title">{{item.title}}</span>
          <img :src="'http://ccforward.sinaapp.com/api/proxy.php?url='+item.image">
          <p class="sns">
            <i :class="item.popularity>500 && 'hot' ">{{ item.popularity }} stars</i> | 
            <i>{{ item.comments }} comments</i>
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