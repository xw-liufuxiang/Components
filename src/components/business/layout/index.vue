<template>
  <div class="xw-layout-container">
    <!-- 头部系统名称及用户信息 -->
    <layout-header />

    <div class="xw-layout-content">
      <!-- 左侧菜单 -->
      <layout-menu :menu-tags.sync="menuTags" :selected.sync="selected" />

      <div class="xw-layout-content--container">
        <!-- 打开的标签 -->
        <layout-tag :menu-tags="menuTags" :selected.sync="selected" />

        <!-- 内容区域 -->
        <div class="xw-layout-content__container-centent">
          <!-- 默认所有页面使用 keep-alive 缓存页面 -->
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive !== false" />
          </keep-alive>
          <router-view v-if="$route.meta.keepAlive === false" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { getSessionStorage } from '@/utils/tools';
import layoutTag from './components/layout-tag';
import layoutMenu from './components/layout-menu';
import layoutHeader from './components/layout-header';

export default {
  name: 'Layout',
  components: { layoutMenu, layoutTag, layoutHeader },
  data() {
    return {
      menuTags: [],
      selected: '',
    };
  },
  created() {
    // const token = getSessionStorage('token');
    // if (!token) {
    //   this.$router.push('/login');
    // }
  },
};
</script>
<style lang="scss" scoped>
.xw-layout-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $-page-bg-color;

  .xw-layout-content {
    display: flex;
    flex: 1;
    height: 100%;
    overflow: hidden;

    .xw-layout-content--container {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      overflow: hidden;

      .xw-layout-content__container-centent {
        flex: 1;
        height: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>
