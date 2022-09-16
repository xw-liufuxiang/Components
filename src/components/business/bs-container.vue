<template>
  <div class="xw-bs-max--container">
    <div class="xw-bs-container" :style="{padding: noPadding ? '' : '8px'}">
      <div class="xw-bs-container--border">
        <div v-if="!noHeader" class="xw-bs-container--header">
          <div class="xw-bs-container__header-title">
            {{ title || $route.meta.title }}
            <slot name="title-tips" />
          </div>
          <div class="xw-bs-container__header-right-button">
            <slot name="header-button" />
          </div>
        </div>

        <div class="xw-bs-container--body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BsContainer',
  props: {
    title: {
      type: String,
      default: '',
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
    noHeader: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.xw-bs-max--container {
  width: 100%;
  height: 100%;
  overflow-x: auto;
}

.xw-bs-container {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  position: relative;

  .xw-bs-container--border {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }

  .xw-bs-container--header {
    display: flex;
    justify-content: space-between;
    flex: 0 0 auto;
    height: 48px;
    border-bottom: 1px solid #d9d9d9;

    .xw-bs-container__header-title {
      font-size: 18px;
      line-height: 48px;
      font-weight: 500;
      color: #262626;
      margin-left: 12px;
    }

    .xw-bs-container__header-right-button {
      display: flex;
      align-items: center;
      margin-right: 12px;
    }
  }

  .xw-bs-container--body {
    flex: 1;
    height: 100%;
    overflow: hidden;

    :deep(.v-modal) {
      position: absolute;
    }

    :deep(.el-dialog__wrapper) {
      position: absolute;
    }
  }
}
</style>
