<template>
  <div class="fe-table-status fe-font_0">
    <i
      v-show="options.text"
      class="status-icon"
      :class="options.status"
    />
    <span>{{ options.text }}</span>
  </div>
</template>

<script>
export default {
  name: 'TableStatus',
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.fe-table-status {
  .status-icon {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: $--color-close;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;

    &.error {
      background-color: $--color-danger;
    }

    &.warning {
      background-color: $--color-warning;
    }

    &.close {
      background-color: $--color-close;
    }

    &.success {
      background-color: $--color-success;
    }

    &.inService {
      background-color: $--color-primary;
    }

    & + span {
      color: $--color-text-regular;
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
    }
  }
}
</style>
