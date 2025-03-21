<template>
  <div class="text-tooltip">
    <el-tooltip
      class="item"
      effect="dark"
      :disabled="isShowToolTip"
      :content="content"
      :placement="placement">
      <p
        class="over-flow"
        :class="className"
        @mouseover="onMouseOver(refName)">
        <span :ref="refName">{{ content || '-' }}</span>
      </p>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  name: 'TextTooltip',
  props: {
    content: {
      type: String,
      default: () => {
        return '';
      }
    },
    placement: {
      type: String,
      default: () => {
        return 'right';
      }
    },
    className: {
      type: String,
      default: () => {
        return '';
      }
    },
    refName: {
      type: String,
      default: () => {
        return '';
      }
    }
  },
  data() {
    return {
      isShowToolTip: true
    };
  },
  methods: {
    onMouseOver(str) {
      let parentWidth = this.$refs[str].parentNode.offsetWidth;
      let contentWidth = this.$refs[str].offsetWidth;
      if (contentWidth > parentWidth) {
        this.isShowToolTip = false;
      } else {
        this.isShowToolTip = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.over-flow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p {
  margin: 0;
}

.checkBoxText:hover {
  color: white;
}
</style>
