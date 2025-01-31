<template>
  <div class="max-h-[70vh] overflow-auto">
    <ElTable
      stripe
      border
      v-loading="loading"
      size="small"
      :key="tableKey"
      :ref="tableKey"
      :style="{
        fontSize: tableOption.fontSize ? tableOption.fontSize : '12px',
      }"
      :show-summary="tableOption.handleSummaries !== undefined"
      :summary-method="tableOption.handleSummaries"
      :data="tableData"
      :max-height="height"
      :highlight-current-row="tableOption.highlightCurrentRow"
      :indent="4"
      :row-key="tableOption.lazy ? 'keyid' : ''"
      :lazy="tableOption.lazy"
      :load="(row,treeNode,resolve) => emit('load', row,treeNode,resolve)"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :row-class-name="tableOption.tableRowClassName"
      @current-change="
        (currentRow: Record<string, any>, oldCurrentRow: Record<string, any>) =>
          emit('currentChange', currentRow, oldCurrentRow)
      "
      @sort-change="formatSortChange"
      @selection-change="(e) => emit('selectionChange', e)"
    >
      <ElTableColumn
        v-if="tableOption.selection"
        :selectable="tableOption.selectable"
        align="left"
        type="selection"
        width="50"
      ></ElTableColumn>

      <ElTableColumn
        v-if="tableOption.draggable"
        label="排序"
        align="left"
        width="50"
      >
        <template #header>
          <ElTooltip
            effect="dark"
            :open-delay="1000"
            content="按住行图标进行拖拽排序"
            placement="top-start"
          >
            <span>
              <i class="md:ooui--draggable"></i>
            </span>
          </ElTooltip>
        </template>
        <template #default="{ row }">
          <i
            v-if="
              tableOption.draggableDisabled === undefined ||
              !tableOption.draggableDisabled(row)
            "
            class="bx bx-menu fs-4 handle align-middle"
          ></i>
          <i
            v-else
            class="bx bx-menu fs-4 is-disabled align-middle"
            style="color: #c0c4cc; cursor: not-allowed"
          ></i>
        </template>
      </ElTableColumn>
      <template v-if="!tableOption.multHeader">
        <ElTableColumn
          v-for="item in tableColumnData"
          :key="item.uuid"
          :prop="item.prop"
          :min-width="`${item.minWidth}px`"
          :label="item.label"
          :align="item.align || tableOption.align || 'center'"
          :fixed="item.fixed"
          :sortable="item.sortable ? 'custom' : item.localSortable"
        >
          <template #header>
            <ElTooltip
              :disabled="!!!item.tips"
              effect="dark"
              :open-delay="1000"
              :content="item.tips"
              placement="top-start"
            >
              <span class="flex-center">
                <span>{{ item.label }}</span>
                <span
                  v-if="item.tips"
                  class="icon-[ic--twotone-tips-and-updates] ml-[2px]"
                ></span>
              </span>
            </ElTooltip>
          </template>
          <template #default="{ row }">
            <!-- 内容通过自定义插槽展示 -->
            <span v-if="item.slot">
              <slot :name="item.prop" :row="row"></slot>
            </span>
            <span v-else-if="item.percent">
              {{
                !isEmpty(row[item.prop])
                  ? (row[item.prop] * 100).toFixed(2) + '%'
                  : '-'
              }}
            </span>
            <div v-else-if="item.tagFormatter && item.tagFormatter(row)">
              <span :class="item.tagFormatter(row).class">{{
                item.tagFormatter(row).label
              }}</span>
            </div>
            <div v-else-if="item.imageFormatter && item.imageFormatter(row)">
              <img />
              <el-image
                :src="item.imageFormatter(row).url"
                :style="item.imageFormatter(row).style"
                :preview-src-list="
                  item.imageFormatter(row).urlList || [
                    item.imageFormatter(row).url,
                  ]
                "
              >
              </el-image>
            </div>
            <div v-else-if="item.jsonView">
              <span
                class="badge badge-soft-primary cursor-pointer"
                style="font-size: 12px"
                @click="jsonView.open('Json View', row[item.prop])"
              >
                查看
              </span>
            </div>
            <!-- 限制内容行数的, 添加tooltip -->
            <!-- 有提供内容formatter方法的,进行格式化内容处理 -->
            <ElTooltip
              v-else
              effect="dark"
              placement="top-start"
              :open-delay="1000"
              :disabled="!item.limitLine"
              :content="
                item.formatter
                  ? String(item.formatter(row))
                  : String(row[item.prop])
              "
            >
              <span
                :style="item.limitLine ? limitLineStyle(item.limitLine) : ''"
              >
                {{
                  item.formatter?.(row) ??
                  (!isEmpty(row[item.prop]) ? row[item.prop] : '-')
                }}
              </span>
            </ElTooltip>
          </template>
        </ElTableColumn>
      </template>

      <ElTableColumn
        v-if="tableOption.menu"
        :fixed="tableOption.actionFixed"
        align="center"
        label="操作"
        :width="tableOption.actionWidth"
      >
        <template #default="{ row }">
          <slot name="menu" :row="row"></slot>
        </template>
      </ElTableColumn>

      <template #empty>
        <slot name="empty"> 暂无数据</slot>
      </template>
    </ElTable>
    <JsonView ref="jsonView"></JsonView>
  </div>
</template>

<script lang="ts" setup>
import sortable from 'sortable';
import { cloneDeep, isEmpty } from '@vben/utils';
import { createEmptySortParams } from '../config';
import { ElTable, ElTableColumn, ElTooltip,ElImage } from 'element-plus';
import type { ColumnOption, SortParams, TableOptions } from '../types/table';
import JsonView from '../../JsonViewer/index.vue';

import { onMounted, computed, ref, nextTick, type PropType } from 'vue';
import { useAccess } from '@vben/access';
import { getUuid } from '#/utils/global';
/* variable */
const { hasAccessByCodes } = useAccess();
const { tableOption, tableData, loading } = defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  tableData: {
    type: Array as PropType<Record<string, any>[]>,
    required: true,
  },
  tableOption: {
    type: Object as PropType<TableOptions>,
    required: true,
  },
  height: {
    type: String || Number,
    required: false,
  },
});

const emit = defineEmits([
  'dropEnd',
  'selectionChange',
  'currentChange',
  'sortChange',
  'load',
]);

const jsonView = ref<any>(null);
const tableKey = ref<any>(getUuid());
const tableColumnData = computed(() => {
  let tableOptionCopy = cloneDeep(tableOption?.columns);
  let list = tableOptionCopy.filter(
    (item: ColumnOption) =>
      isEmpty(item.permission) ||
      (item.permission && hasAccessByCodes(item.permission + '')),
  );
  list.forEach((item: ColumnOption, index: number) => {
    if (item.list?.length) {
      item.list = item.list.filter(
        (ele: any) => isEmpty(ele.hide) || !ele.hide,
      );
      item.list = item.list?.map((i) => ({
        ...i,
        uuid: item.uuid || getUuid(),
      }));
    }
    item.uuid = item.uuid || getUuid();
  });
  return list.filter((item: ColumnOption) => isEmpty(item.hide) || !item.hide);
});

/* handle */
const openSortable = async () => {
  let tbody = null;
  await nextTick(() => {
    tbody = tableKey.value.$el.querySelectorAll(
      '.el-table__body-wrapper > table > tbody',
    )[0];
  });
  sortable.create(tbody, {
    handle: '.handle',
    animation: 300,
    onEnd({ newIndex, oldIndex }: any) {
      // 刷新tableKey促使重新绘制table,从而确保拖拽排序生效
      tableKey.value = getUuid();
      const currRow = tableData.splice(oldIndex, 1)[0] as Record<string, any>;
      tableData.splice(newIndex, 0, currRow);
      emit('dropEnd', currRow, tableData);
    },
  });
};
const formatSortChange = (val: Record<string, any>): SortParams => {
  const sortParams: SortParams = createEmptySortParams();
  if (val.order === 'descending') {
    sortParams.descs = [val.prop];
    sortParams.ascs = [];
  } else if (val.order === 'ascending') {
    sortParams.descs = [];
    sortParams.ascs = [val.prop];
  } else {
    sortParams.descs = [];
    sortParams.ascs = [];
  }
  emit('sortChange',sortParams)
  return sortParams;
};
const limitLineStyle = (line: number): any => ({
  display: '-webkit-box',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': line,
  overflow: 'hidden',
});

onMounted(() => {
  if (tableOption?.draggable) {
    openSortable();
  }
});
</script>

<style scoped lang="scss">
:deep(.el-table__header) {
  & tr th {
    color: hsl(var(--heavy-foreground));
    background-color: hsl(var(--border)) !important;
  }

  & .cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
