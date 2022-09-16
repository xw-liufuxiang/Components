import debounce from 'lodash/debounce';

export default {
  data() {
    return {
      // 自动运行获取数据
      autoRun: true,
      // 请求接口方法
      tableDataApi: '',
      // 表格加载状态
      tableLoading: false,
      // 表头 form 数据
      formData: {},
      // 表格数据
      tableData: [],
      timeout: null,
      random: null,
      // 分页数据
      pageData: {
        total: 0,
        size: 30,
        current: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizes: [10, 30, 50, 100, 200],
      },
    };
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.autoRun && this.tableDataApi) {
        this.getTableData();
      }
    },

    /**
     * 获取表格数据
     */
    async querytableDataApi(random) {
      const params = await this.getSearchParams();
      if (params !== false) {
        this.tableLoading = true;
        this.tableDataApi(params).then(({ data }) => {
          if (random === this.random) {
            const tableData = data.list || [];
            this.pageData.total = data.total || data.count || 0;
            this.tableLoading = false;
            this.tableData = tableData;
          }
        }).catch(() => {
          this.tableData = [];
          this.tableLoading = false;
        });
      }
    },

    /**
     * 防抖
     */
    getTableData: debounce(function () {
      this.random = `${new Date().getTime()}${Math.floor((Math.random() + 1) * 1000)}`;
      this.querytableDataApi(this.random);
    }, 300),

    /**
     * 获取表格头部筛选参数
     */
    async getSearchParams() {
      if (this.$refs.filterForm) {
        const valid = await this.$refs.filterForm;
        if (valid) {
          return { ...this.formData, ...this.getPageData() };
        }
        return false;
      }
      return { ...this.formData, ...this.getPageData() };
    },

    /**
     * 获取分页数
     */
    getPageData() {
      return {
        size: this.pageData.size,
        page: this.pageData.current,
      };
    },

    /**
     * 条数改变
     */
    handlerSizeChange(size) {
      this.pageData.size = size;
      this.getTableData();
    },

    /**
     * 页码改变
     */
    handlerCurrentChange(current) {
      this.pageData.current = current;
      this.getTableData();
    },
  },
};
