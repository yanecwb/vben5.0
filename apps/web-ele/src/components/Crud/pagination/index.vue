<template>
  <div class="dataTables_paginate paging_simple_numbers float-start">
    <ElPagination
      class="mg-20-0-0 flex flex-wrap"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPaginationParams.current"
      :page-sizes="[5, 10, 30, 50, 100, 150, 300]"
      :page-size="currentPaginationParams.size"
      :total="tableDataTotal"
      @size-change="handleChange('size', $event)"
      @current-change="handleChange('current', $event)"
    >
    </ElPagination>
  </div>
</template>

<script lang="ts" setup name="Pagination">
import { ElPagination } from 'element-plus';
import type { PropType } from 'vue';
import { ref } from 'vue';
import type { PaginationParams } from '../types/table';

const emit = defineEmits(['change']);

const { tableDataTotal, defaultPaginationParams } = defineProps({
  tableDataTotal: {
    type: Number,
    required: true,
  },
  defaultPaginationParams: {
    type: Object as PropType<PaginationParams>,
    required: false,
    default: () => ({
      size: 10,
      current: 1,
    }),
  },
});

const currentPaginationParams = ref<{
  size: number;
  current: number;
}>(defaultPaginationParams);

const handleChange = (type: 'current' | 'size', event: number) => {
  currentPaginationParams.value[type] = event;
  emit('change', currentPaginationParams.value);
};
</script>

<style lang="scss" scoped></style>
