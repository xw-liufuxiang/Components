<template>
  <div class="xw-edit-container">
    <el-button
      type="text"
      icon="el-icon-magic-stick"
      class="xw-format-button"
      @click="handlerFormatClick"
    >
      格式化
    </el-button>
    <codemirror ref="cm" v-model="code" :options="cmOptions" @input="inputChange" />
  </div>
</template>

<script>
/* eslint-disable */

// 全局引入vue-codemirror
import { codemirror } from 'vue-codemirror';
import sqlFormatter from 'sql-formatter';

// 引入css文件
import 'codemirror/lib/codemirror.css';
// 引入主题 可以从 codemirror/theme/ 下引入多个
import 'codemirror/theme/idea.css';
// 引入语言模式 可以从 codemirror/mode/ 下引入多个
import 'codemirror/mode/sql/sql';

// 搜索功能
// find：Ctrl-F (PC), Cmd-F (Mac)
// findNext：Ctrl-G (PC), Cmd-G (Mac)
// findPrev：Shift-Ctrl-G (PC), Shift-Cmd-G (Mac)
// replace：Shift-Ctrl-F (PC), Cmd-Alt-F (Mac)
// replaceAll：Shift-Ctrl-R (PC), Shift-Cmd-Alt-F (Mac)
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/match-highlighter';

// 代码提示功能 具体语言可以从 codemirror/addon/hint/ 下引入多个
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';

// 高亮行功能
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/selection/selection-pointer';

// 调整scrollbar样式功能
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/scroll/simplescrollbars';

// 自动括号匹配功能
import 'codemirror/addon/edit/matchbrackets';

// 全屏功能 由于项目复杂，自带的全屏功能一般不好使
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/display/fullscreen';

// 显示自动刷新
import 'codemirror/addon/display/autorefresh';

// 多语言支持？
import 'codemirror/addon/mode/overlay';
import 'codemirror/addon/mode/multiplex';

// 代码段折叠功能
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';

import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';

// merge功能
import 'codemirror/addon/merge/merge.css';
import 'codemirror/addon/merge/merge';

// google DiffMatchPatch
import DiffMatchPatch from 'diff-match-patch';
// DiffMatchPatch config with global
window.diff_match_patch = DiffMatchPatch;
window.DIFF_DELETE = -1;
window.DIFF_INSERT = 1;
window.DIFF_EQUAL = 0;

export default {
  name: 'Show',
  components: { codemirror },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      code: '',
      cmOptions: {
        // 语言及语法模式
        mode: 'text/x-sql',
        // 主题
        theme: 'idea',
        // 显示函数
        line: true,
        lineNumbers: true,
        // 软换行
        lineWrapping: true,
        // tab宽度
        tabSize: 2,
        // 代码提示功能
        hintOptions: {
          // 避免由于提示列表只有一个提示信息时，自动填充
          completeSingle: false,
        },
        // 高亮行功能
        styleActiveLine: true,
        // 调整scrollbar样式功能
        scrollbarStyle: 'overlay',
        // 自动括号匹配功能
        matchBrackets: true,
      },
    };
  },
  created(){
    this.code = this.content
  },
  mounted() {
    // 代码提示功能 当用户有输入时，显示提示信息
    this.$refs.cm.codemirror.on('inputRead', (cm) => {
      cm.showHint();
    });
  },
  methods: {
    inputChange(content) {
      this.$emit('update:content', this.code);
    },

    /**
     * 点击格式化 sql
     */
    handlerFormatClick() {
      this.$refs.cm.codemirror.setValue(sqlFormatter.format(this.code));
    },

    getContent() {
      return this.code
    },

    setContent(content) {
      this.$refs.cm.codemirror.setValue(content)
    },
  },
};
</script>

<style lang="scss" scoped>
.xw-edit-container {
  width: 100%;
  height: 100%;
  position: relative;

  .xw-format-button {
    position: absolute;
    right: 0;
    top: 4px;
    z-index: 122;
    padding: 12px;
    background-color: #fff;
    border-radius: 0;
  }

  :deep(.CodeMirror) {
    height: 100%;
    width: 100%;
  }

  :deep(.vue-codemirror) {
    height: 100%;
    width: 100%;
  }
}
</style>
