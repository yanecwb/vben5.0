<template>
  <CommonListTemplate>
    <template v-if="searchParam" #search>
      <CrudSearch
        ref="search"
        :search-param="searchParam"
        @change="(e) => emit('searchValueChange', e)"
      >
        <template #custom-search-btn>
          <slot name="custom-search-btn"></slot>
        </template>
      </CrudSearch>
    </template>
    <template #custom-search>
      <slot name="custom-search"></slot>
    </template>
    <template #card>
      <slot name="card"></slot>
    </template>
    <template #tips>
      <slot name="tips"></slot>
    </template>
    <template #content>
      <slot name="content"></slot>
    </template>
    <template v-if="tableOptions" #table>
      <div class="border-radius-8">
        <div
          class="display-row justify-content-between align-items-start mg-0-0-10"
        >
          <slot name="header-right-title">
            <div class="font-size-15">
              {{ tableOptions.title || '数据预览' }}
            </div>
          </slot>
          <div>
            <ElButton @click="(e) => emit('searchValueChange', e)">
              <span class="icon-[solar--refresh-bold]"></span>
            </ElButton>
            <slot name="header-right-action"></slot>
          </div>
        </div>
        <slot name="groupby-metrics"></slot>

        <CrudTable
          :loading="tableDataLoading"
          :tableData="tableData"
          :tableOption="tableOptions"
          :height="height"
          @load="
            (row, treeNode, resolve) => emit('load', row, treeNode, resolve)
          "
          @sort-change="(e) => emit('sortChange', e)"
        >
          <template v-for="column in slotColumns" #[column.prop]="{ row }">
            <slot :name="column.prop" :row="row"></slot>
          </template>

          <template #menu="{ row }">
            <slot name="menu" :row="row"></slot>
          </template>
        </CrudTable>
      </div>
    </template>
    <template #pagination>
      <Pagination
        :tableDataTotal="tableDataTotal"
        :defaultPaginationParams="paginationParams"
      ></Pagination>
    </template>
  </CommonListTemplate>
</template>

<script lang="ts" setup>
import CommonListTemplate from './common-list-template/index.vue';
import CrudTable from './table/index.vue';
import CrudSearch from './search/index.vue';
import Pagination from './pagination/index.vue';
import { ElButton } from 'element-plus';
import { SearchParam } from '#/components/Crud/models/search';
import type {
  TableOptions,
  ColumnOption,
  PaginationParams,
} from './types/table';
import { computed, type PropType } from 'vue';

const emit = defineEmits(['searchValueChange', 'load', 'sortChange']);
const {
  searchParam,
  tableOptions,
  tableData,
  tableDataTotal,
  tableDataLoading,
  paginationParams,
  height,
} = defineProps({
  searchParam: {
    type: Object as PropType<any>,
    required: true,
    default: () => ({
      searchItems: [],
      showMoreFilterBtn: false,
    }),
  },
  paginationParams: {
    type: Object as PropType<PaginationParams>,
    required: false,
    default: () => ({
      size: 10,
      current: 1,
    }),
  },
  tableDataLoading: {
    type: Boolean,
    required: true,
  },
  tableData: {
    type: Array as PropType<Record<string, any>[]>,
    required: true,
  },
  tableDataTotal: {
    type: Number,
    required: true,
  },
  tableOptions: {
    type: Object as PropType<TableOptions>,
    required: true,
  },
  height: {
    type: String || Number,
    required: false,
  },
});

const slotColumns = computed(() => {
  return tableOptions.columns.filter((item: ColumnOption) => item.slot);
});
</script>
