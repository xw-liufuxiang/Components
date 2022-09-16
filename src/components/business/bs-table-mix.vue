<template>
  <div ref="bsTableMix" class="bs-table-mix" :class="{'no-padding': noPadding}">
    <div class="bs-table-mix--filter">
      <div class="bs-table-mix__filter-form">
        <slot name="filter-form" />
      </div>
      <div v-if="filterBtns" class="bs-table-mix__filter-btns">
        <slot name="filter-btns">
          <el-button size="small" @click="handlerResetClick">
            重置
          </el-button>
          <el-button type="primary" size="small" @click="handlerSearchClick">
            查询
          </el-button>
        </slot>
      </div>
    </div>

    <div v-if="handleBtnGroup" class="bs-table-mix__handle-btn-group">
      <slot name="handle-btn-group" />
    </div>

    <div ref="tableContainer" v-loading="tableLoading" class="bs-table-mix__table">
      <slot :_tableHeight="`${tableHeight}px`" />
    </div>

    <div v-if="showPagination" class="bs-table-mix__pagination">
      <el-pagination
        class="xw-float-right"
        :current-page.sync="pageData.current"
        :page-size.sync="pageData.size"
        :page-sizes="pageData.sizes"
        :total="pageData.total"
        :layout="pageData.layout"
        background
        @size-change="(size)=>handlerSizeChange(size)"
        @current-change="(current)=>handlerCurrentChange(current)"
      />
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import ResizeObserver from 'resize-observer-polyfill';

export default {
  name: 'BsTableMix',
  props: {
    pageData: {
      type: Object,
      default: () => ({
        current: 1,
        size: 30,
        total: 0,
      }),
    },
    tableLoading: {
      type: Boolean,
      default: false,
    },
    filterBtns: {
      type: Boolean,
      default: true,
    },
    handleBtnGroup: {
      type: Boolean,
      default: true,
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
    sizeChange: {
      type: Function,
      default: () => {},
    },
    paginationChange: {
      type: Function,
      default: () => {},
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timeout: null,
      tableHeight: 0,
      resizeObserver: null,
    };
  },
  watch: {
    'page.current': function (value) {
      clearTimeout(this.timeout);
      // 当最后一页只有一条数据，并且被删除时 current 的值会改变，但是不会触发 handlePaginationChange 方法
      // 所以手动监听 current 值的变化，如果 handlePaginationChange 方法也被触发，那么直接清除定时器，防止重复请求数据
      this.timeout = setTimeout(() => {
        this.paginationChange(value);
      }, 50);
    },
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(() => {
      this.tableHeight = this.$refs.tableContainer.offsetHeight;
    });
    this.resizeObserver.observe(this.$refs.bsTableMix);
  },
  beforeDestroy() {
    this.resizeObserver.disconnect();
  },
  methods: {
    /**
     * 点击重置按钮
     */
    handlerResetClick() {
      this.$emit('reset');
    },

    /**
     * 点击查询按钮
     */
    handlerSearchClick() {
      this.$emit('search');
    },

    /**
     * 翻页触发size改变
     */
    handlerSizeChange(size) {
      this.sizeChange(size);
    },

    /**
     * 翻页页数改变
     */
    handlerCurrentChange(currentPage) {
      clearTimeout(this.timeout);
      this.paginationChange(currentPage);
    },
  },
};
</script>
<style lang="scss" scoped>
:deep(.el-form-item--mini.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-form-item--small.el-form-item) {
  margin-bottom: 12px;
}

.bs-table-mix {
  display: flex;
  flex-direction: column;
  padding: 12px;
  height: 100%;
  overflow: hidden;

  &.no-padding {
    padding: 0;
  }

  .bs-table-mix--filter {
    display: flex;
    flex: 0 0 auto;

    .bs-table-mix__filter-form {
      flex: 1;
      width: 100%;
      overflow: hidden;
      margin-right: 20px;

      :deep(.el-form-item) {
        margin-bottom: 12px;
        margin-right: 18px;

        .el-form-item__label {
          padding-right: 6px;
        }

        .el-form-item__content {
          width: 180px;
        }
      }
    }

    .bs-table-mix__filter-btns {
      flex: 0 0 auto;
      display: flex;
      align-items: self-end;
      padding-bottom: 12px;
    }
  }

  .bs-table-mix__handle-btn-group {
    flex: 0 0 auto;
    margin-bottom: 8px;
  }

  .bs-table-mix__table {
    flex: 1;
    height: 100%;
    overflow: hidden;
    background-color: antiquewhite;
  }

  .bs-table-mix__pagination {
    margin-top: 12px;
  }
}

.xw-float-right {
  float: right;
}
</style>
