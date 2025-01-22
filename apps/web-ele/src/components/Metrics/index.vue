<template>
  <div class="metrics-container overflow-hidden">
    <div class="metrics-father">
      <div
        class="mg-0-10-0-0 font-size-14 display-inline-block flex-center absolute left-0"
        style="min-width: 50px; height: 24px; line-height: 24px"
      >
        指标
        <span
          class="icon-[line-md--edit-twotone] ml-[4px] h-[15px] w-[16px] cursor-pointer text-[#2265ff]"
          @click="quotaColumn.changeShow(true)"
        ></span>
      </div>
      <div v-show="isWrapped" class="unfold-fold" @click="handleUnFold(true)">
        <span v-if="!foldMetricsItem">
          展开<i class="icon-[uiw--down] ml-[4px]" />
        </span>
        <span v-else>折叠<i class="icon-[uiw--up] ml-[4px]" /></span>
      </div>
      <div class="display-row flex-wrap">
        <draggable
          :list="props.dragMetricsColumns"
          :animation="100"
          :force-fallback="true"
          drag-class="drag-class"
          chosen-class="drag-class"
          handle=".draghandle"
          @change="change"
        >
          <template #item="{ element }">
            <el-tag
              v-show="!element.hide"
              type="info"
              class="mg-0-10-0-0 mg-0-0-10 metrics-item draghandle cursor-move select-none"
              :style="'color:#1f2126e6'"
            >
              <span class="icon-[uil--draggabledots] mg-0-2-0-0"></span>
              <span> {{ element.label }}</span>
              <span
                class="icon-[line-md--menu-to-close-transition] close-icon ml-[4px] h-[12px] w-[12px] cursor-pointer text-[#555658]"
                @click="
                  handleRemoveMetrics({
                    metricsItem: element,
                    columnsIndex: element.columnsIndex,
                  })
                "
              ></span>
            </el-tag>
          </template>
        </draggable>
      </div>
    </div>
    <QuotaColumn
      ref="quotaColumn"
      :treeColumn="treeColumns"
      :fieldGroup="fieldGroup"
      :fieldsCurrent="fieldsCurrent"
      @uptableColumns="(e: any) => emit('change', e)"
    ></QuotaColumn>
  </div>
</template>

<script lang="ts" setup name="Metrics">
import {
  computed,
  defineEmits,
  defineProps,
  nextTick,
  onMounted,
  onUnmounted,
  shallowRef,
  watch,
  ref,
  type PropType,
} from 'vue';
import { type ColumnOption } from '#/components/Crud/types/table';

import { ElTag } from 'element-plus';
import draggable from 'vuedraggable';
import QuotaColumn from './components/QuotaColumn.vue';
import { sleep } from '#/utils/global';

const props = defineProps({
  dragMetricsColumns: {
    type: Array as PropType<Array<ColumnOption | any>>,
    required: true,
    default: () => [],
  },
  columnsFilterOptions: {
    type: Array,
    required: true,
    default: (): { label: string; metricsKeys?: string }[] => [
      { label: '基础细分' },
    ],
  },
  fieldGroup: {
    type: Array as PropType<Array<ColumnOption>>,
    required: true,
    default: () => [],
  },
  fieldsCurrent: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['change']);
const quotaColumn = ref<any>(null);

const isWrapped = shallowRef(true);
const foldMetricsItem = shallowRef(true);
const handleUnFold = (isButton = false) => {
  function checkIfWrapped(
    parentSelector: string,
    itemSelector: string,
  ): {
    isWrapped: boolean;
    totalWidth: number;
    parentWidth: number;
  } {
    const parent = document.querySelector(parentSelector);
    const items = document.querySelectorAll(itemSelector);
    if (!parent || items.length === 0) {
      return { isWrapped: false, totalWidth: 0, parentWidth: 0 };
    }
    const parentWidth =
      parent.clientWidth -
      parseFloat(getComputedStyle(parent).paddingRight) -
      parseFloat(getComputedStyle(parent).paddingLeft);
    let totalWidth = 0;

    items.forEach((item: any) => {
      if (item) {
        const style = getComputedStyle(item);

        if (style.display !== 'none') {
          const marginLeft = parseFloat(style.marginLeft);
          const marginRight = parseFloat(style.marginRight);
          totalWidth += item.offsetWidth + marginLeft + marginRight;
        }
      }
    });
    return { isWrapped: totalWidth > parentWidth, totalWidth, parentWidth };
  }

  const {
    isWrapped: wrap,
    totalWidth,
    parentWidth,
  } = checkIfWrapped('.metrics-father', '.metrics-item');
  isWrapped.value = wrap;
  foldMetricsItem.value = isButton ? !foldMetricsItem.value : wrap;

  const rows = Math.ceil(totalWidth / parentWidth);
  const expandedHeight = `${34 * rows}px`;
  const collapsedHeight = '34px';

  const metricsFather = document.querySelector(
    '.metrics-father',
  ) as HTMLElement;

  if (metricsFather) {
    metricsFather.style.height = foldMetricsItem.value
      ? expandedHeight
      : collapsedHeight;
  }
};

const handleRemoveMetrics = (e: {
  metricsItem: ColumnOption;
  columnsIndex?: number;
}) => {
  const updatedColumns = [...props.dragMetricsColumns];
  const ColumnsMap = new Map(updatedColumns.map((col: any) => [col.prop, col]));
  const columnsItem = ColumnsMap.get(e.metricsItem?.prop) as ColumnOption;
  columnsItem.hide = true;
  emit('change', updatedColumns);
};

const change = ({ moved }: Record<string, any>) => {
  const { oldIndex, newIndex, element } = moved;
  const updatedColumns = [...props.dragMetricsColumns];
  const oldOutItems = updatedColumns.splice(oldIndex);
  updatedColumns[oldIndex] = undefined;
  updatedColumns.length = updatedColumns.length - 1;
  updatedColumns.push(...oldOutItems);
  emit('change', updatedColumns);
};

const treeColumns = computed(
  () =>
    props.columnsFilterOptions
      .map((i: any) => ({
        label: i.label,
        children: props.dragMetricsColumns.filter(
          (item: any) => item.metricsKeys === i.metricsKeys,
        ),
      }))
      .filter((f: any) => f.children?.length) as Array<{
      label: string;
      children: ColumnOption[];
    }>,
);

watch(
  treeColumns,
  () =>
    nextTick(async () => {
      await sleep(500);
      handleUnFold();
    }),
  {
    deep: true,
    immediate: true,
  },
);

let cacheMetricsContainerWidth = 0;
onMounted(() => {
  const element = document.querySelector('.metrics-container');
  const resizeObserver = new (window as any).ResizeObserver((entries: any) => {
    for (const entry of entries) {
      if (cacheMetricsContainerWidth === entry.contentRect.width) return;
      cacheMetricsContainerWidth = entry.contentRect.width;
      handleUnFold();
    }
  });

  element && resizeObserver.observe(element);
  onUnmounted(() => {
    resizeObserver.unobserve(element);
    resizeObserver.disconnect();
  });
});
</script>
<style scoped lang="scss">
.drag-class {
  color: #2265ff !important;
  // background-color: #2265ff !important;
}

.metrics-father {
  position: relative;
  display: flex;
  height: 38px;
  padding-right: 50px;
  padding-left: 60px;
  transition: 0.3s;

  .unfold-fold {
    position: absolute;
    right: 0;
    height: 26px;
    font-size: 12px;
    line-height: 26px;
    color: #2265ff;
    cursor: pointer;
  }
}

.bx-grid-vertical::before {
  color: #babcbf;
}

:deep(.el-tag__content) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
