<template>
  <div class=" mg-0-0-12 border-radius-8 search-container">
    <div class="display-row search-father flex-wrap">
      <!--  编辑筛选项  -->
      <div class="search-left-action">
        <span class="font-size-14 flex-center"
          >筛选
          <span
            class="icon-[line-md--edit-twotone] ml-[4px] h-[15px] w-[16px] cursor-pointer text-[#2265ff]"
            @click="editVisible = true"
          ></span>
        </span>
      </div>
      <SearchEdit
        :visible="editVisible"
        :search-items="searchItems"
        @close="editVisible = false"
        @confirm="handleChangeShowSearchItems"
      ></SearchEdit>
      <!--展开折叠筛选项-->
      <div class="search-right-action">
        <el-button
          v-if="0"
          class="reload_btn"
          type="primary"
          icon="el-icon-refresh"
          style="padding: 6px 10px"
          @click="(e: any) => emit('change', e)"
          >刷新
        </el-button>
        <div v-show="isWrapped" class="unfold-fold" @click="handleUnFold()">
          <span v-if="!foldSearchItem" class="flex-center"
            >展开 <i class="icon-[uiw--down] ml-[4px]"
          /></span>
          <span v-else class="flex-center"
            >折叠<i class="icon-[uiw--up] ml-[4px]"
          /></span>
        </div>
      </div>

      <div ref="searchItemsContainer" class="search-items-container">
        <template v-for="(searchItem, index) in searchItems">
          <div v-if="!searchItem.Value?.hide" :key="index" class="filter-item">
            <div
              class="search-border display-row align-items-center border-radius-4 mg-0-10-0-0"
            >
              <div class="search-label">{{ searchItem.Label }} :</div>
              <div
                v-if="searchItem.Value instanceof InputValue"
                class="subtract-border"
              >
                <el-input
                  v-model="searchItem.Value.value"
                  :placeholder="searchItem.Placeholder"
                  clearable
                  :class="{ 'search-input-border': !searchItem.Default }"
                  @change="(e: any) => emit('change', e)"
                ></el-input>
              </div>
              <div
                v-else-if="searchItem.Value instanceof SelectValue"
                class="subtract-border"
              >
                <el-select
                  v-model="searchItem.Value.value"
                  :placeholder="searchItem.Placeholder"
                  :clearable="searchItem.Value.clearable"
                  :filterable="searchItem.Value.filterable"
                  style="width: 100%"
                  :class="{ 'search-input-border': !searchItem.Default }"
                  @change="(e: any) => emit('change', e)"
                >
                  <el-option
                    v-for="item in searchItem.Value.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <div
                      class="display-row align-items-center justify-content-between"
                    >
                      <span>{{ item.label }}</span>
                      <span v-if="item.type" class="badge badge-soft-primary">{{
                        item.type
                      }}</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
              <div
                v-else-if="searchItem.Value instanceof MultiSelectValue"
                class="subtract-border"
              >
                <el-select
                  ref="mutipleSelect"
                  v-model="searchItem.Value.value"
                  multiple
                  collapse-tags
                  :placeholder="searchItem.Placeholder"
                  :filterable="searchItem.Value.filterable"
                  :clearable="searchItem.Value.clearable"
                  style="width: 100%"
                  :allow-create="searchItem.Value.allowCreate"
                  default-first-option
                  :class="{ 'search-input-border': !searchItem.Default }"
                  @remove-tag="(e: any) => emit('change', e)"
                  @focus="blurSelect"
                >
                  <el-option
                    v-for="item in searchItem.Value.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <div
                      class="display-row align-items-center justify-content-between"
                    >
                      <span>{{ item.label }}</span>
                      <span v-if="item.type" class="badge badge-soft-primary">{{
                        item.type
                      }}</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
              <div
                v-else-if="searchItem.Value instanceof DateValue"
                class="subtract-border"
              >
                <el-date-picker
                  v-model="searchItem.Value.value"
                  type="date"
                  placeholder="请选择时间"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  :class="{ 'search-input-border': !searchItem.Default }"
                  @change="(e: any) => emit('change', e)"
                ></el-date-picker>
              </div>
              <div
                v-else-if="searchItem.Value instanceof DateRangeValue"
                class="subtract-border"
              >
                <el-date-picker
                  v-model="searchItem.Value.value"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :clearable="searchItem.Value.clearable"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  :picker-options="pickerQuickOptions"
                  :class="{ 'search-input-border': !searchItem.Default }"
                  @change="(e: any) => emit('change', e)"
                ></el-date-picker>
              </div>
              <div
                v-else-if="searchItem.Value instanceof DateTimeRangeValue"
                class="subtract-border"
              >
                <el-date-picker
                  v-model="searchItem.Value.value"
                  style="width: 100%"
                  type="datetimerange"
                  align="right"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :default-time="[new Date(0, 0, 0), new Date(23, 59, 59)]"
                  :class="{ 'search-input-border': !searchItem.Default }"
                  @change="(e: any) => emit('change', e)"
                >
                </el-date-picker>
              </div>
              <div
                v-else-if="searchItem.Value instanceof NumericalIntervalValue"
                style="width: 210px; margin-right: 1px"
                class="subtract-border"
              >
                <div
                  class="display-row align-items-center justify-content-between search-label-radius"
                  style="
                    height: 38px;
                    background-color: #f5f7fa;
                    border: 1px solid #dcdfe6;
                    border-radius: 0 4px 4px 0;
                  "
                >
                  <!-- <div class="text-info mx-2">
                {{ searchItem.Label }}
              </div> -->
                  <div
                    class="display-row align-items-center justify-content-between mg-0-5"
                  >
                    <el-input
                      v-model="searchItem.Value.value[0]"
                      size="small"
                      style="width: 45%; margin-left: 3px"
                      placeholder="开始"
                      clearable
                      @input="
                        searchItem.Value.value[0] = (
                          searchItem.Value.value[0] as string
                        ).replace(/[^\-\d.]/g, '')
                      "
                      @change="(e: any) => emit('change', e)"
                    >
                    </el-input>
                    <div style="width: 10%" class="text-center">-</div>
                    <el-input
                      size="small"
                      v-model="searchItem.Value.value[1]"
                      style="width: 45%"
                      placeholder="结束"
                      clearable
                      @input="
                        searchItem.Value.value[1] = (
                          searchItem.Value.value[1] as string
                        ).replace(/[^\-\d.]/g, '')
                      "
                      @change="(e: any) => emit('change', e)"
                    >
                    </el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isEmpty } from '@vben/utils';
import { hasPermission } from '#/utils/global';

import {
  ref,
  nextTick,
  watch,
  type PropType,
  onMounted,
  onUnmounted,
} from 'vue';

import { pickerQuickOptions } from '#/constant/global';
import {
  DateRangeValue,
  DateTimeRangeValue,
  DateValue,
  InputValue,
  MultiSelectValue,
  NumericalIntervalValue,
  SearchItem,
  SearchParam,
  SelectValue,
} from '../models/search';
import SearchEdit from './components/SearchEdit.vue';
import {
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
} from 'element-plus';

const { searchParam } = defineProps({
  searchParam: {
    type: Object as PropType<SearchParam>,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['change']);
const mutipleSelect = ref(null);
const searchItemsContainer = ref(null);
const editVisible = ref<boolean>(false);
const searchItems = ref<SearchItem[]>([]);

watch(
  () => searchParam,
  (newVal: SearchParam) => {
    searchItems.value = newVal.SearchItems.filter(
      (item: SearchItem) =>
        isEmpty(item.Permission) ||
        (item.Permission && hasPermission(item.Permission)),
    );
  },
  { immediate: true, deep: true },
);

const blurSelect = () => {
  const mutipleSelectList = mutipleSelect.value as any;
  mutipleSelectList.forEach((item: any) => {
    if (item.$refs.input) {
      item.$refs.input.blur = () => {
        emit('change', searchParam.Params);
      };
    }
  });
};

let cacheMetricsContainerWidth = 0;
const foldSearchItem = ref<boolean>(true);
const isWrapped = ref<boolean>(false);
const openResizeObserverSearch = () => {
  const element = document.querySelector('.search-items-container');
  (window as any).resizeObserverSearch = new (window as any).ResizeObserver(
    (entries: any) => {
      for (const entry of entries) {
        if (cacheMetricsContainerWidth === entry.contentRect.width) return;
        cacheMetricsContainerWidth = entry.contentRect.width;
        handleUnFold(true);
        foldSearchItem.value = true;
      }
    },
  );
  element && (window as any).resizeObserverSearch.observe(element);
};
const handleUnFold = (isEditSearchItem = false) => {
  function checkIfWrapped(
    parentSelector: string,
    itemSelector: string,
    reloadBtnSelector?: string,
  ): {
    isWrapped: boolean;
    totalWidth: number;
    parentWidth: number;
  } {
    const parent = document.querySelector(parentSelector);
    const items = document.querySelectorAll(itemSelector);
    const reloadBtn =
      reloadBtnSelector &&
      (document.querySelector(reloadBtnSelector) as HTMLElement);
    if (!parent || items.length === 0) {
      return { isWrapped: false, totalWidth: 0, parentWidth: 0 };
    }

    const parentWidth = parent.clientWidth;
    let totalWidth = 0;

    items.forEach((item: any) => {
      const style = getComputedStyle(item);
      const marginLeft = parseFloat(style.marginLeft);
      const marginRight = parseFloat(style.marginRight);
      totalWidth += item.offsetWidth + marginLeft + marginRight;
    });

    if (reloadBtn) {
      const reloadStyle = getComputedStyle(reloadBtn);
      const reloadBtnWidth =
        reloadBtn.offsetWidth +
        parseFloat(reloadStyle.marginLeft) +
        parseFloat(reloadStyle.marginRight);
      totalWidth += reloadBtnWidth;
    }
    return { isWrapped: totalWidth > parentWidth, totalWidth, parentWidth };
  }

  const {
    isWrapped: wrap,
    totalWidth,
    parentWidth,
  } = checkIfWrapped('.search-items-container', '.filter-item');
  isWrapped.value = wrap;
  foldSearchItem.value = isEditSearchItem ? wrap : !foldSearchItem.value;

  const rows = Math.ceil(totalWidth / parentWidth);
  const expandedHeight = `${36 * rows + (rows - 1) * 10}px`;
  const collapsedHeight = '36px';

  const searchFather = searchItemsContainer.value as any;

  if (searchFather) {
    searchFather.style.height = foldSearchItem.value
      ? expandedHeight
      : collapsedHeight;
  }
};

const handleChangeShowSearchItems = (data: string[]) => {
  searchItems.value.forEach((i: any) => {
    i.value.hide = !data.includes(i.value.key);
  });
  nextTick(() => handleUnFold(true));
};
const offResizeObserverSearch = () => {
  const searchItemsContainer = document.querySelector(
    '.search-items-container',
  ) as any;
  if (searchItemsContainer) {
    (window as any).resizeObserverSearch.unobserve(searchItemsContainer);
    (window as any).resizeObserverSearch.disconnect();
  }
};

onMounted(() => {
  openResizeObserverSearch();
});

onUnmounted(() => {
  offResizeObserverSearch();
});
</script>
<style lang="scss" scoped>
:deep(.el-date-editor .el-range-separator) {
  width: unset;
}

:deep(.el-date-editor .el-range-input) {
  width: 45%;
}

:deep(.el-input--mini .el-input__inner) {
  padding-right: 22px !important;
  padding-left: 8px !important;
}

:deep(.el-input--small .el-input__inner) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

:deep(.el-range-editor--small.el-input__inner) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.search-father {
  position: relative;
  align-items: self-start;
  padding-right: 40px;
  padding-left: 70px;

  .search-left-action {
    position: absolute;
    left: 0;
    height: 36px;
    line-height: 36px;
  }

  .search-right-action {
    position: absolute;
    right: 0;

    .unfold-fold {
      display: inline-block;
      margin-left: 10px;
      font-size: 12px;
      color: #2265ff;
      cursor: pointer;
    }
  }

  .search-items-container {
    display: flex;
    flex-wrap: wrap;
    place-content: space-between flex-start;
    height: 34px;
    overflow: hidden;
    transition: 0.3s;

    .filter-item {
      width: 280px;
      margin-bottom: 10px;
    }
  }
}

.search-border {
  height: 36px;
  border: 1px solid hsl(var(--border));
}

.search-label {
  padding-left: 8px;
  font-size: 12px;
  // color: #1f2126e5;
  cursor: default;
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

:deep(.search-input-border) {
  height: 30px;

  .el-range-editor.el-input__inner {
    min-height: 28px;
    line-height: 28px;
  }
}

.subtract-border {
  flex: 1 1 0;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  height: 30px;
  font-size: 13px;
  box-shadow: none;

  &:hover {
    box-shadow: none !important;
  }
}

:deep(.el-input__inner) {
  position: relative;
  // top: 1px;
  height: 30px;
  // padding-left: 12px;
  font-size: 13px;
  border: none;
}
</style>
