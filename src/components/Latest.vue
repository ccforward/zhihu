<template>
  <ul>
    <li v-for="item in data">
        <router-link class="title" :to="{path: 'detail', query:{aid: item.id}}"> {{item.title}} </router-link>
        <img :src="'http://ccforward.sinaapp.com/api/proxy.php?url='+item.image">
        <p class="sns">
          <i :class="item.popularity>500 && 'hot' ">{{ item.popularity }} stars</i> | 
          <i>{{ item.comments }} comments</i>
        </p>
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