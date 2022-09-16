# 区域封装 input number

## 说明

  用于限制 `input` `type` = `number` 时的处理，当前组件不支持输入负值

``` html
  <rm-input-number
    v-model="rmInputNumber"
    type="decimal"
    maxlength="16"
    placeholder="数字输入框"
    :min="1"
    :max="999"
    :precision="2"
    :isEmptyFill="false"
  />
```

| 属性        |  类型   | 说明                                        | 默认值 |
| ----------  | ------ | ------------------------------------------- |--------------------------------------------- |
| min         | Number | 能输入的最小值，如果绑定的默认值为空，则使用最小值填充，使用时建议必须有最小值时使用，比如 1     | -- |
| max         | Number | 能输入的最大值，max 和 maxlength 同时存在则取最小的值     | -- |
| type        | String | 输入数字类型 integer/decimal/positiveInt     | decimal |
| precision   | Number | 小数点长度，最大为2                           | 2 |
| maxlength   | String | 限制数字输入长度，最大为16位，不含小数位        | 16 |
| placeholder | String | 输入框默认 placeholder                       | 请输入 |
| isEmptyFill | Boolean | 输入框值为空时是否填充最小值（最小值不为空或者0）                       | true |

### `maxlength`

  当 `type` = `decimal` 时，maxlength 限制的长度为整数部分，如：`maxlength` = 2，可输入的最大值为 99.99

### `type` 参数值

| 参数        | 说明                                   | 默认值 |
| ----------- | -------------------------------------- |--------------------------------------------- |
| integer     | 只能输入正整数                          | -- |
| decimal     | 默认只能输入小数                        | -- |
| positiveInt | 必须输入非0的正整数                     | -- |
