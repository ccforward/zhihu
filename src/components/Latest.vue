<template>
  <ul>
    <li v-for="item in latest">
        <router-link class="title" :to="{path: 'article', query:{aid: item.id}}"> {{item.title}} </router-link>
        <img :src="item.image">
    </li>
  </ul>
</template>


<script>
export default {
  name: 'latest-item',
  props: ['latest']
};
</script>