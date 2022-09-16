<template>
  <div class="xw-layout-tags">
    <vue-context-menu
      class="contextmenu"
      :context-menu-data="contextMenuData"
      @closeTag="handlerCloseTag"
      @closeAll="handlerCloseAll"
      @closeLeft="handlerCloseLeft"
      @closeRight="handlerCloseRight"
      @closeOhter="handlerCloseOhter"
    />
    <ul id="container" class="xw-layout-tags--container">
      <li
        v-for="(tag, index) in tagsList"
        :key="tag.id"
        :class="{'xw-active': tag.name === select}"
        @contextmenu="(e) => handlerMenuShow(e, {...tag, index})"
        @click="handlerTagClick(tag)"
      >
        <span class="name">{{ tag.meta.title }}</span>
        <i class="el-icon-close icon" @click.stop="handlerCloseClick(tag)" />
      </li>
    </ul>
  </div>
</template>
<script>
import { setSessionStorage, getSessionStorage } from '@/utils/tools';

export default {
  name: 'LayoutTag',
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
      tagsList: [],
      select: '',
      firstMenu: {},
      currentTag: 0,
      contextMenuData: {
        menuName: 'headerTags',
        axis: {
          x: null,
          y: null,
        },
        menulists: [{
          fnHandler: 'closeTag',
          btnName: '关闭',
        }, {
          fnHandler: 'closeAll',
          btnName: '关闭全部',
        }, {
          fnHandler: 'closeLeft',
          btnName: '关闭左边',
        }, {
          fnHandler: 'closeRight',
          btnName: '关闭右边',
        }, {
          fnHandler: 'closeOhter',
          btnName: '关闭其它',
        }],
      },
    };
  },
  watch: {
    menuTags: {
      handler(value) {
        this.tagsList = [...value];
      },
      deep: true,
    },
    selected(value) {
      this.select = value;
    },
    $route() {
      this.updateMenus();
    },
  },
  created() {
    this.firstMenu = getSessionStorage('firstMenu') || {};
    this.updateMenus();
  },
  mounted() {
    this.addEventListenerScroll();
  },
  methods: {
    updateMenus() {
      const menuTags = getSessionStorage('menuTags') || [];
      const selected = getSessionStorage('selected') || '';
      this.tagsList = menuTags;
      this.select = selected;
    },
    /**
     * 绑定鼠标滚动设置为橫向滚动
     */
    addEventListenerScroll() {
      const a = document.getElementById('container');
      const scrollWidth = 100; // 滚动一下的距离

      function mousewheelEvent(event) {
        const e = event || window.event;
        let v;
        v = e.wheelDelta ? e.wheelDelta : e.detail;
        if (v > 3 || -v > 3) v = -v;
        if (v > 0) {
          a.scrollLeft += scrollWidth;
        } else {
          a.scrollLeft -= scrollWidth;
        }
        e.preventDefault(); // 阻止浏览器的默认滚动
      }

      if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', mousewheelEvent, false); // FF
      }

      a.onmousewheel = mousewheelEvent;
    },

    /**
     * 点击标签跳转页面
     */
    handlerTagClick(item) {
      if (item.name === this.select) return;
      const menuTags = getSessionStorage('menuTags') || [];
      const current = menuTags.find((menu) => menu.meta.fullPath === item.meta.fullPath);
      this.$router.push({ path: current.meta.fullPath, query: current.query });
      this.$emit('update:selected', item.name);
      this.select = item.name;
    },

    /**
     * 关闭标签
     */
    handlerCloseClick(item) {
      const newList = [...this.tagsList];
      const index = this.tagsList.findIndex((list) => list.name === item.name);
      if (index > -1) {
        this.tagsList.splice(index, 1);
        setSessionStorage('menuTags', this.tagsList);

        const { length } = newList;
        if (index === 0) {
          if (length === 1) {
            this.handlerTagClick(this.firstMenu);
            setSessionStorage('menuTags', [this.firstMenu]);
            this.tagsList = [this.firstMenu];
          } else {
            const menu = newList[index + 1];
            this.handlerTagClick(menu);
          }
        }

        if (index !== 0) {
          let menu = null;
          if (index === length - 1) {
            menu = newList[index - 1];
          } else {
            menu = newList[index + 1];
          }
          this.handlerTagClick(menu);
        }
      }
    },

    /**
     * 关闭当前标签
     */
    handlerCloseTag() {
      this.handlerCloseClick(this.currentTag);
    },

    /**
     * 关闭全部标签
     */
    handlerCloseAll() {
      this.handlerTagClick(this.firstMenu);
      setSessionStorage('menuTags', [this.firstMenu]);
      this.tagsList = [this.firstMenu];
    },

    /**
     * 关闭左边的标签
     */
    handlerCloseLeft() {
      const { tagsList } = this;
      const { index } = this.currentTag;
      const currentIndex = tagsList.findIndex((tag) => tag.name === this.select);

      if (index > 0) {
        for (let i = index - 1; i >= 0; i -= 1) {
          tagsList.splice(i, 1);
        }
        setSessionStorage('menuTags', tagsList);
      }

      if (currentIndex < index) {
        this.handlerTagClick(tagsList[0]);
      }
    },

    /**
     * 关闭右边的标签
     */
    handlerCloseRight() {
      const { index } = this.currentTag;
      const { tagsList } = this;
      const { length } = tagsList;
      const currentIndex = tagsList.findIndex((tag) => tag.name === this.select);

      if (index < length) {
        for (let i = length; i > index; i -= 1) {
          tagsList.splice(i, 1);
        }
        setSessionStorage('menuTags', tagsList);
      }

      if (currentIndex > index) {
        this.handlerTagClick(tagsList[tagsList.length - 1]);
      }
    },

    /**
     * 关闭其它标签
     */
    handlerCloseOhter() {
      const menu = this.tagsList.find((tag) => tag.name === this.currentTag.name);
      this.handlerTagClick(menu);
      setSessionStorage('menuTags', [menu]);
      this.tagsList = [menu];
    },

    /**
     * 点击右键显示菜单
     */
    handlerMenuShow(event, index) {
      this.currentTag = index;
      event.preventDefault();
      const x = event.clientX;
      const y = event.clientY;
      this.contextMenuData.axis = {
        x, y,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.xw-layout-tags {
  height: 33px;
  line-height: 33px;
  flex: 0 0 auto;
  background-color: $-layout-tags-bg-color;

  .xw-layout-tags--container {
    display: flex;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    li {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      max-width: 200px;
      min-width: 165px;
      font-size: 14px;
      font-weight: 400;
      color: $-layout-tags-font-color;
      border-right: $-layout-tags-boder;
      cursor: pointer;

      &.xw-active {
        color: $-layout-tags-active-font-color;
        background: $-layout-tags-active-bg-color;
      }

      .name {
        margin-left: 16px;
      }

      .icon {
        margin-right: 12px;
      }
    }
  }
}

.contextmenu {
  box-shadow: $-menu-shadow;
  color: #606266;

  :deep(.context-menu-list:hover) {
    background-color: #409eff;
    color: #fff;
  }

  :deep(.btn-wrapper-simple) {
    height: auto;
  }

  :deep(.context-menu-list) {
    margin: 0 !important;
  }

  :deep(.nav-name-right) {
    margin: 0 !important;
  }
}
</style>
