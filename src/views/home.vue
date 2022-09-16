<template>
  <el-tabs v-model="activeName" class="xw-page-container" @tab-click="handleClick">
    <el-tab-pane label="富文本" name="tinymce">
      <xw-tinymce />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import XwTinymce from '@/components/xw-tinymce';

export default {
  components: { XwTinymce },
  data() {
    return {
      activeName: 'tinymce',
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="scss" scoped>
.xw-page-container {
  padding: 12px;
  height: calc(100% - 24px);
  display: flex;
  flex-direction: column;

  .el-tabs__header {
    flex: 0 0 auto;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }
}
</style>
