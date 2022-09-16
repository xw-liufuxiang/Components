<script>
import { formatMenusAndRouterData, formatTreeArray, setSessionStorage } from '@/utils/tools';
// eslint-disable-next-line import/no-unresolved
import { getMenus } from '@/api/authorize';

function layoutMenuItems(h, menus) {
  if (!Array.isArray(menus)) return null;

  return menus.map((item) => {
    // 判断当前菜单是否有 icon 展示
    let icon = null;
    if (item.meta && item.meta.icon) {
      icon = <xw-icon class="xw-menu-icon" name={item.meta.icon} size="20"></xw-icon>;
    }

    // 判断是否有子菜单，并递归处理子菜单
    if (item.children && Array.isArray(item.children) && item.children.length) {
      return (
        <el-submenu class="xw-menu-item" index={item.name}>
          <template slot="title">
            { icon }
            <span>{item.meta.title}</span>
          </template>
          {
            layoutMenuItems.call(this, h, item.children)
          }
        </el-submenu>
      );
    }
    // 处理没有子菜单的数据
    return (
      <el-menu-item class="xw-menu-item fiexd-height" index={item.name}>
        { icon }
        <span slot="title">{item.meta.title}</span>
      </el-menu-item>
    );
  });
}

export default {
  name: 'LayoutMenu',
  props: {
    menuTags: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      defaultSelect: '',
      menus: [],
      oldMenuId: '',
      matchMenus: [],
    };
  },
  watch: {
    selected(value) {
      this.defaultSelect = value;
    },
    $route() {
      this.updateCurrentMenu();
    },
  },
  async created() {
    const { code, data, message } = await getMenus();

    if (code) {
      this.$message.warning(message);
      return;
    }

    if (!Array.isArray(data)) return;

    const routerData = [...this.$router.options.routes];
    const newMenus = formatMenusAndRouterData.call(this, data, routerData);
    this.matchMenus = newMenus;
    this.menus = formatTreeArray(newMenus);
    setSessionStorage('firstMenu', newMenus[0]);
    this.updateCurrentMenu();
  },
  methods: {
    updateCurrentMenu() {
      const { path } = this.$router.history.current;
      const menu = this.matchMenus.find((item) => item.meta.fullPath === path);
      this.defaultSelect = menu ? menu.name : '';
      this.oldMenuId = this.defaultSelect;
      this.handlerSetTags(this.defaultSelect);
    },
    /**
     * 菜单点击事件
     */
    handlerMenuSelect(index) {
      if (index === this.oldMenuId) return;
      const menu = this.matchMenus.find((item) => item.name === index);
      this.$router.push(menu.meta.fullPath);
      this.oldMenuId = index;
      this.handlerSetTags(menu.name);
    },

    /**
     * 点击菜单时判断是否已经存入了 session 里面
     */
    handlerSetTags(name) {
      // const menuTags = getSessionStorage('menuTags') || [];
      // const index = menuTags.findIndex((item) => item.name === menu.name);
      // if (index === -1) {
      //   menuTags.push(menu);
      //   setSessionStorage('menuTags', menuTags);
      //   setSessionStorage('selected', menu.name);
      //   this.$emit('update:menu-tags', menuTags);
      // }
      this.$emit('update:selected', name);
    },
  },
  render(h) {
    return (
      <div class="xw-layout-menus">
        <el-scrollbar style="height: 100%;" class="xw-scroll-container">
          <el-menu
            default-active={this.defaultSelect}
            onSelect={this.handlerMenuSelect}
          >
            { layoutMenuItems.call(this, h, this.menus) }
          </el-menu>
        </el-scrollbar>
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-menu) {
  z-index: 3;
  border-right: none;
  background-color: transparent;

  .el-submenu__title,
  .el-menu-item {
    color: $-menu-item-font-color;

    &.is-active {
      background: $-menu-item-active-bg-color;
    }
  }

  .el-menu-item i,
  .el-submenu__title i {
    color: $-menu-item-font-color;
  }

  .xw-menu-item {
    line-height: 50px;

    .el-submenu__title {
      height: 50px;
      line-height: 50px;
    }

    .xw-menu-icon {
      transform: translateX(-5px);
    }
  }

  .fiexd-height {
    height: 50px;
  }

  .el-submenu__title:hover,
  .el-menu-item:focus,
  .el-menu-item:hover {
    background-color: $-menu-item-hover-bg-color;
  }
}

.xw-layout-menus {
  width: 215px;
  flex: 0 0 auto;
  overflow: hidden;
  box-shadow: $-menu-shadow;
  position: relative;
  z-index: 2;
  background: $-menu-bg-color;

  .xw-scroll-container {
    overflow-x: hidden;

    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background: $-menu-bg-color2;
    opacity: 0.4;
  }
}
</style>
