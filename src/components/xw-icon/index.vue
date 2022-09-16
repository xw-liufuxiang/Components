<template>
  <svg
    version="1.1"
    :class="clazz"
    :role="label ? 'img' : 'presentation'"
    :aria-label="label"
    :width="size"
    :height="size"
    :viewBox="box"
    :style="{
      fontSize: `${size}px`,
    }"
  >
    <path
      v-for="(path, i) in icon.paths"
      :key="i"
      :d="path.d"
      :fill="path.fill"
      :stroke="path.stroke"
    />
  </svg>
</template>
<script>
/* eslint-disable */
const convert = require('./parse');

export default {
  name: 'XwIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 18,
    },
    spin: Boolean,
    flip: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    index: {
      type: [Number, String],
      default: '',
    },
    currentIndex: {
      type: String,
      default: '',
    },
  },
  computed: {
    clazz() {
      return {
        'svg-icon': true,
        spin: this.spin,
        'flip-horizontal': this.flip === 'horizontal',
        'flip-vertical': this.flip === 'vertical',
        active: this.index === this.currentIndex,
      };
    },
    icon() {
      try {
        const xml = require(`!xml-loader!@/icons/${this.name}.svg`);
        const t = xml.svg.$.viewBox.split(' ');
        return {
          width: t[2],
          height: t[3],
          paths: convert.SVGtoArray(xml.svg),
        };
      } catch(e) {
        console.error(`错误：src/icons/${this.name}.svg 文件未找到`)
        return {
          width: 200,
          height: 200,
          paths: '',
        }
      }
    },
    box() {
      return `0 0 ${this.icon.width} ${this.icon.height}`;
    },
  },
  register() {
    console.warn('inject deprecated since v1.2.0, SVG files can be loaded directly, so just delete the inject line.');
  },
};
</script>

<style lang="scss" scoped>
  .svg-icon {
    display: inline-block;
    fill: currentColor;
  }

  .svg-icon.flip-horizontal {
    transform: scale(-1, 1);
  }

  .svg-icon.flip-vertical {
    transform: scale(1, -1);
  }

  .svg-icon.spin {
    animation: fa-spin 1s 0s infinite linear;
  }

  @keyframes fa-spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
