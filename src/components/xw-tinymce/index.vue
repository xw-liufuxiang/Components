<template>
  <Editor v-model="editorValue" :init="init" />
</template>

<script>
import tinymce from 'tinymce/tinymce';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/themes/silver';
import 'tinymce/icons/default/icons';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/bbcode';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullpage';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/legacyoutput';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/noneditable';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/print';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/tabfocus';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/toc';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import './langs/zh_CN';
import Editor from '@tinymce/tinymce-vue';

export default {
  name: 'XwTinymce',
  components: { Editor },
  props: {
    value: {
      type: String,
      default: '',
    },
    // 文件上传地址
    uploadURL: {
      type: String,
      default: '',
    },
    // 文件访问时的域名
    fileURL: {
      type: String,
      default: '',
    },
    plugins: {
      type: [String, Array],
      // save autosave
      default: 'autoresize advlist anchor autolink code codesample directionality fullscreen hr image insertdatetime link lists nonbreaking noneditable pagebreak paste preview print searchreplace tabfocus table template textpattern visualblocks visualchars',
    },
    toolbar: {
      type: [String, Array],
      default: 'styleselect forecolor backcolor bold italic underline strikethrough undo redo blockquote removeformat alignleft aligncenter alignright outdent indent subscript superscript ht bullist numlist link image charmap preview code pagebreak insertdatetime table fullscreen',
    },
  },
  data() {
    return {
      editorValue: this.value,
      init: {
        // 是用了 autoresize 则设置的高度无效
        height: 300,
        skin: 'oxide',
        menubar: false,
        branding: false,
        auto_focus: true,
        statusbar: false,
        language: 'zh_CN',
        link_title: false,
        plugins: this.plugins,
        toolbar: this.toolbar,
        object_resizing: false,
        toolbar_mpde: 'sliding',
        code_dialog_height: 450,
        code_dialog_widht: 1000,
        nonbreaking_force_tab: true,
        default_link_target: '_blank',
        advlist_bullist_styles: 'square',
        powerpaste_word_import: 'clean',
        advlist_number_styles: 'default',
        end_container_on_empty_block: true,
        images_upload_handler: this.upload,
        // 选择媒体文件需要打开一下注释，并在 plugins toolbar 中添加  media
        // file_picker_types: 'media',
        // file_picker_callback: this.selectFile,
        // 输入框失焦事件
        setup: (ed) => {
          ed.on('blur', (e) => {
            this.$emit('blur', e);
          });
        },
      },
    };
  },
  watch: {
    value(val) {
      this.editorValue = val;
    },
    editorValue(value) {
      this.$emit('inpit', value);
    },
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    /**
     * 选择文件
     */
    selectFile(callback, value, meta) {
      if (meta.filetype === 'media') {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'video/*');
        const vthis = this;
        input.onchange = function () {
          const file = this.file[0];

          vthis.upload(file, callback, (err) => {
            throw (new Error(err));
          }, 'media');
        };

        input.click();
      }
    },

    /**
     * 上传文件
     */
    upload(file, succFun, failFun, type) {
      if (type === 'media') {
        file = file.blob();
      }

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open('post', this.uploadURL);
      // TODO：如果上传时需要设置 token 请自行添加
      // xhr.setRequestHeader('token', '');
      xhr.onload = () => {
        if (xhr.status !== 200) {
          failFun(`HTTP Error: ${xhr.status}`);
          return;
        }

        const json = JSON.parse(xhr.responseText);
        if (!json || typeof json.data !== 'string') {
          failFun(`Invalid JSON: ${xhr.responseText}`);
          return;
        }

        let url = null;
        if (json.data.indexOf('http') === -1) {
          url = `${this.fileURL}${json.data}`;
        } else {
          url = json.data;
        }

        succFun(url);
      };

      const formData = new FormData();
      formData.append('file', file, file.name);
      xhr.send(formData);
    },
  },
};
</script>
