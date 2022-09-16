<template>
  <yh-input
    v-model="input"
    v-bind="{ placeholder: '请输入', ...attrs }"
    :clearable="false"
    @input="handlerValueChange"
    @blur="handlerInputBlur"
    @keydown.native="handlerInputKeydown"
    @keyup.native="handlerInputKeyup"
  />
</template>
<script>

export default {
  name: 'RmInputNumber',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: [Number, String],
    isEmptyFill: {
      type: Boolean,
      default: true,
    },
    precision: {
      type: Number,
      default: 2,
    },
    max: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      input: '',
      hasDecimal: false,
      defaultLength: 16,
      attrs: {
        type: 'text',
      },
    };
  },
  watch: {
    value(val) {
      this.input = val;
    },
  },
  created() {
    // 小数位最多两位，如果设置时大于2则直接替换为2
    this.precision = this.precision > 2 ? 2 : this.precision;

    Object.keys(this.$attrs).forEach((key) => {
      this.attrs[key] = this.$attrs[key];
    });

    // 判断传入的 type 值是不是其中的一个，如果不是则设置默认值 decimal
    if (['decimal', 'integer', 'positiveInt'].includes(this.$attrs.type)) {
      this.attrs.number = this.$attrs.type;
    } else {
      this.attrs.number = 'decimal';
    }

    // 是否设置最大长度，如果没有设置则使用默认的16位长度
    if (this.attrs.maxlength) {
      this.defaultLength = this.attrs.maxlength;
      delete this.attrs.maxlength;
    }

    // 如果设置了最小值 且 value 值为空时，使用最小值填充 value
    if (this.attrs.min && !this.value) {
      // this.input = Number(this.attrs.min);
      console.log(this.input);
      this.$emit('input', this.input);
      this.$emit('change', this.input);
    } else {
      this.input = this.value;
    }
  },
  methods: {
    /**
     * 输入框 input 事件
     */
    handlerValueChange(value) {
      let input = value;

      input = this.limitNumber(input, this.attrs.number, this.precision);

      // input 不等于 null / "" 时把数据转为数字
      if (input !== null && input !== '' && this.attrs.number !== 'decimal') {
        input = Number(input);
      }

      this.input = input;
      this.emitValue();
    },

    /**
     * input 输入框失去焦点时，判断输入的值是否在最大值最小值的范围内
     * 否则最终的值取最值或者最小值
     */
    handlerInputBlur() {
      let { input } = this;

      // 输入的值大于 max 时，取 max
      if (this.max && Number(input) > Number(this.max)) {
        input = this.max;
      }

      // 输入的值小于 min 时，取 min
      if (input !== '' || (this.isEmptyFill && this.attrs.min)) {
        if (Number(input) < Number(this.attrs.min)) {
          input = this.attrs.min;
        }
      }

      this.input = input;
      this.emitValue();
    },

    /**
     * 限制输入的数字
     */
    limitNumber(value, type, len = 2) {
      switch (type) {
        case 'decimal': // 只能输入小数
          return this.onlyDecimal(value, len);
        case 'integer': { // 限制整数
          const str = value.replace(/[^\d]/g, '');
          return !str && str !== 0 ? str : Number(str);
        }
        case 'positiveInt': { // 必须输入非0的正整数
          const str = value.replace(/^0/g, '');
          return str.replace(/[^\d]/g, '');
        }
        default:
          return value;
      }
    },

    /**
     * 键盘 keyup 事件
     * 没有小数点时截取 maxlength 的长度
     */
    handlerInputKeyup() {
      let { input } = this;
      input = (input !== null && input !== undefined && input !== '') ? this.input.toString() : '';
      if (input.indexOf('.') === -1) {
        this.attrs.maxlength = this.defaultLength;

        this.input = input.slice(0, this.attrs.maxlength);
        this.emitValue();
      }
    },

    /**
     * keydown 时判断是否输入的是点号 “.”
     */
    handlerInputKeydown(event) {
      if ((event.keyCode === 190 || event.keyCode === 110) && this.attrs.number === 'decimal') {
        this.attrs.maxlength = Number(this.defaultLength) + 3;
        this.$forceUpdate();
      }
    },

    /**
     * number = decimal 时处理数据
     */
    onlyDecimal(value, bits) {
      let valueStr = value || '';

      // 如果输入的数据中存在小数点，则 maxlength = maxlength + 1 + precision
      this.attrs.maxlength = this.defaultLength;
      if (valueStr.toString().indexOf('.') !== -1) {
        this.attrs.maxlength = Number(this.attrs.maxlength) + 1 + bits;
        this.$forceUpdate();
      }

      // 以0开头，且后面跟的都是0则替换为0，如：000000 => 0
      valueStr = valueStr.replace(/^0+$/g, '0');
      // 先把非数字的都替换掉，除了数字和.
      valueStr = valueStr.replace(/[^\d.]/g, '');
      // 必须保证第一个为数字而不是.
      valueStr = valueStr.replace(/^\./g, '');
      // 保证只有出现一个.而没有多个.
      valueStr = valueStr.replace(/\.{2,}/g, '.');
      // 保证.只出现一次，而不能出现两次以上
      valueStr = valueStr.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
      if (bits && bits === 1) {
        // 保留一位小数
        valueStr = valueStr.replace(/^(-)*(\d+)\.(\d).*$/, '$1$2.$3');
      } else if (bits && bits === 2) {
        // 保留两位小数
        valueStr = valueStr.replace(/^(-)*(\d+)\.(\d)(\d).*$/, '$1$2.$3$4');
      }
      return valueStr;
    },

    emitValue() {
      const { input } = this;
      const value = (input !== null && input !== undefined && input !== '') ? Number(this.input) : input;
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },
};
</script>
<style scoped lang="scss">
/deep/ {
  .yh-input__inner::-webkit-outer-spin-button,
  .yh-input__inner::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  .yh-input__inner[type="number"] {
    -moz-appearance: textfield;
  }
}

</style>
