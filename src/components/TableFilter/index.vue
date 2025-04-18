<template>
  <div v-if="filterCustomType === 'checkBox'">
    <div class="checkBoxGroup">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        ref="checkAllRef"
        @change="handleCheckAllChange"
        :class="isHoverIndex === 'all' ? 'isChcekHover' : ''"
        @mouseover="onMouseOver('all')"
        @mouseout="handleMouseOut">
        {{ $t('btnText.all') }}
      </el-checkbox>
    </div>

    <el-checkbox-group
      v-model="checkedList"
      @change="handleCheckedChange"
      class="checkBoxGroup">
      <el-checkbox
        v-for="(item, index) in checkList"
        :key="item.value || item"
        :label="item.label || item"
        :value="item.value || item"
        class=""
        :class="isHoverIndex === index ? 'isChcekHover' : ''"
        @mouseover="onMouseOver(index)"
        @mouseout="handleMouseOut">
        <TextTooltip
          :content="item.label || item"
          className="checkBoxText" />
      </el-checkbox>
    </el-checkbox-group>
  </div>
  <div
    class="filter-btn"
    v-if="filterCustomType === 'checkBox'">
    <el-button
      type="primary"
      class="resetBtn"
      @click="handleSubimitFilter(null)">
      {{ $t('btnText.confirm') }}
    </el-button>
    <el-button
      class="resetBtn cancelBtn"
      @click="handleSubimitFilter('reset')">
      {{ $t('btnText.reset') }}
    </el-button>
  </div>
  <div v-if="filterCustomType === 'input'">
    <el-input
      ref="inputRef"
      class="o-style-serch"
      placeholder="搜索"
      width="240"
      clearable
      @clear="hanldeSearhNameFilter"
      @keyup.enter="hanldeSearhNameFilter"
      v-model="searchName">
      <template #suffix>
        <el-icon
          class="el-input__icon"
          @click="hanldeSearhNameFilter">
          <IconSearch />
        </el-icon>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts" setup>
import TextTooltip from '@/components/TextSingleTootip/index.vue';
import { IconSearch } from '@computing/opendesign-icons';
import { CheckboxValueType } from 'element-plus';

import { ref } from 'vue';
const { t } = useI18n();

const props = defineProps({
  filterList: {
    type: <any>[],
  },
  checkedFilterList: {
    type: Array,
  },
  filterType: {
    type: String,
  },
  handelSubFilterProper: {
    type: Function,
    default: () => {},
  },
  hanldeSearhNameFilter: {
    type: Function,
    default: () => {},
  },
  searchPayload: {
    type: Object,
  },
  filterProp: {
    type: String,
  },
  handelSubTimeFilterProper: {
    type: Function,
    default: () => {},
  },
});

const isHoverIndex = ref();
const checkAll = ref(false);
const checkList = ref<any[]>([]);
const checkedList = ref<any[]>([]);
const isIndeterminate = ref(false);
const filterCustomType = ref();
const checkAllRef = ref();
const searchName = ref<string>();

watch(
  () => props.filterList,
  (newVal, oldVal) => {
    checkAll.value = props.filterList?.length === props.checkedFilterList?.length;
    checkList.value = props.filterList as string[];
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => props.filterType,
  (newVal, oldVal) => {
    filterCustomType.value = props.filterType;
  },
  {
    deep: true,
    immediate: true,
  }
);

const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedList.value = val
    ? (props.filterList.map((item: any) => {
        return item?.value !== undefined ? item.value : item;
      }) as any[])
    : [];
  isIndeterminate.value = false;
};
const handleCheckedChange = (value: CheckboxValueType[]) => {
  checkAll.value = value.length === props.filterList?.length;
  isIndeterminate.value = value.length > 0 && props.filterList?.length > value.length;
};

const onMouseOver = (index: Number | string) => {
  isHoverIndex.value = index;
};

const handleMouseOut = () => {
  isHoverIndex.value = '';
};

const handleSubimitFilter = (type: any) => {
  if (type) {
    checkedList.value = [];
    checkAll.value = false;
    isIndeterminate.value = false;
  }
  props.handelSubFilterProper(checkedList.value);
};

const hanldeSearhNameFilter = () => {
  props.hanldeSearhNameFilter(searchName.value);
};
</script>

<style lang="scss">
.isChcekHover {
  .el-checkbox__label {
    color: rgb(255 255 255) !important;
  }

  .el-checkbox__inner {
    box-sizing: border-box;
  }
}

.isChcekHover::after {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 168px;
  content: '';
  background: rgb(82 163 255);
  transform: translateX(-16px);
}

.filter-btn {
  display: flex;

  .resetBtn {
    width: 64px;
    height: 24px;
  }
}

.checkBoxGroup {
  position: relative;
  left: -16px;
  width: 168px;
  max-height: 500px;
  padding: 0 16px;
  overflow: hidden auto;

  :not(.isChcekHover) .is-checked {
    border: unset !important;

    .el-checkbox__inner {
      border: unset !important;
    }
  }

  .el-checkbox__inner::after {
    left: 5px;
    top: 2px;
  }

  .isChcekHover .el-checkbox__inner::after {
    left: 4px;
    top: 1px;
  }
}

.filterPopper {
  border: 1px solid #0077ff !important;
}

.inputSearchFilterPopper {
  width: 240px !important;
  padding: 0 !important;
  margin: 0 !important;
  border: unset !important;
  box-shadow: unset !important;
  transform: translateY(-10px);

  .el-input {
    height: 32px !important;

    .el-input__inner {
      height: 32px !important;
    }

    .el-input__wrapper {
      height: 32px !important;
      padding-right: 8px !important;
    }
  }

  .el-input__suffix {
    cursor: pointer;

    .el-icon {
      font-size: 16px;
    }
  }

  .el-input__icon:hover {
    color: rgb(0 119 255);
  }
}

.checkBoxText {
  span {
    line-height: 16px;
  }
}
</style>
