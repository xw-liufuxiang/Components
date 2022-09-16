<template>
  <div class="fe-table-status fe-font_0">
    <xw-icon
      v-if="options.text"
      class="status-icon"
      :name="options.icon"
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
    color: $--color-close;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;

    &.error {
      color: $--color-danger;
    }

    &.close {
      color: $--color-close;
    }

    &.success {
      color: $--color-success;
    }

    &.inService {
      color: $--color-primary;
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
