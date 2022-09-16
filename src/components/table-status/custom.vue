<template>
  <div class="fe-table-status fe-font_0">
    <i
      class="status-icon"
      :style="{
        'background-color': options.color
      }"
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
  @import "@/styles/common/vars.scss";

  .fe-table-status {
    .status-icon {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: $comp--close;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;

      & + span {
        color: $--color-text-regular;
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
      }
    }
  }
</style>
