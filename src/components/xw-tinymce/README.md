# 富文本编辑器

使用 [tinymce-vue](https://github.com/tinymce/tinymce-vue)、 [tinymce](https://github.com/tinymce/tinymce) 实现的富文本编辑器

## 使用

### 安装依赖

```shell
// vue2
npm install tinymce@5.x @tinymce/tinymce-vue@3.x

// vue3
npm install tinymce @tinymce/tinymce-vue
```

### props

| 属性        |  类型   | 说明                                        | 默认值 |
| ----------  | ------ | ------------------------------------------- |--------------------------------------------- |
| v-model | String | 值 | '' |
| uploadURL | String | 上传文件的地址 | '' |
| fileURL | String | 文件访问时的域名 | '' |
| plugins | String/Array | 依赖的插件，可根据具体情况删减 | 'autoresize advlist anchor autolink code codesample directionality fullscreen hr image insertdatetime link lists nonbreaking noneditable pagebreak paste preview print searchreplace tabfocus table template textpattern visualblocks visualchars' |
| toolbar | String/Array | 工具栏的内容，可根据具体情况删减 | 'styleselect forecolor backcolor bold italic underline strikethrough undo redo blockquote removeformat alignleft aligncenter alignright outdent indent subscript superscript ht bullist numlist link image charmap preview code pagebreak insertdatetime table fullscreen' |
