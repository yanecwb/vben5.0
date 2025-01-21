<template>
  <ElCard>
  <div class="mg-0-0-10">
    <div
      class="display-column justify-content-center"
      style="min-width: 1000px"
    >
      <div class="row">
        <!-- header -->
        <slot name="header"></slot>
      </div>
      <!-- Left Search -->
      <div class="display-row">
        <div class="flex">
          <slot name="search"></slot>
          <slot name="custom-search"></slot>
        </div>
        <div class="mg-0-0-10 text-right">
          <!-- Right Action -->
          <slot name="action"></slot>
        </div>
      </div>

      <!-- Left Search -->
      <slot name="search-items"></slot>

      <slot name="groupby"></slot>

      <slot name="card"></slot>

      <div class="text-warning">
        <slot name="tips"></slot>
      </div>

      <slot name="content"></slot>

      <!-- Table data -->
      <slot name="table"></slot>
      <!-- pagination -->
      <slot name="pagination"></slot>
    </div>
  </div>
  </ElCard>
</template>

<script lang="ts" setup name="commonListTemplate">
import { ElCard } from 'element-plus';

// const props = defineProps({
//   cardStyle: {
//     type: Boolean,
//     required: false,
//     default: () => true,
//   },
// });
// const cardStyle = props.cardStyle;
</script>
