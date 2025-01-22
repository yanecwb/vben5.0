<template>
  <div class="flex h-4 mb-[16px] items-center">
    <span
      class="mg-0-10-0-0 font-size-14 display-inline-block"
      style="min-width: 50px;height: 20px;line-height: 20px;"
      >维度</span
    >
    <el-tag
      v-for="item in upSelectedFieldGroup"
      :key="item.prop"
      :type="selectedFieldGroup.includes(item.prop) ? undefined : 'info'"
      size="small"
      class="mg-0-10-0-0 cursor-pointer"
      :style="selectedFieldGroup.includes(item.prop) ? '' : 'color:#1f2126e6'"
      @click="handleChangeSelect(item.prop)"
    >
      <span  v-show="selectedFieldGroup.includes(item.prop)" class="icon-[material-symbols--check]"></span>
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script lang="ts" setup name="GroupbyMul">
import { cloneDeep, filter, find, map } from 'lodash';
import { computed, ref } from 'vue';
import { ElTag } from 'element-plus';

const props = defineProps<{
  fields: any[];
  displayFieldDisabled: any[];
}>();
const emit = defineEmits(['fieldsMulChange']);

const upSelectedFieldGroup = ref<any[]>(cloneDeep(props.fields));
const dynamicsDisplayFieldDisabled = computed(() => {
  const dateFieldDisabledProps = ['byDay', 'byWeek', 'byMonth', 'byYear'];
  const generateConfig = (prop: string) => ({
    prop,
    disabledList: filter(dateFieldDisabledProps, (p: any) => p !== prop),
  });
  return [
    ...map(dateFieldDisabledProps, generateConfig),
    ...props.displayFieldDisabled,
  ];
});

const selectedFieldGroup = computed(() => {
  return map(
    filter(upSelectedFieldGroup.value, (ele: any) => ele.value),
    'prop',
  );
});

const handleChangeSelect = (itemProp: string) => {
  if (
    (selectedFieldGroup.value[0] === itemProp &&
      selectedFieldGroup.value.length === 1) ||
    (selectedFieldGroup.value.length === 2 &&
      ['byDay', 'byWeek', 'byMonth', 'byYear'].includes(itemProp) &&
      selectedFieldGroup.value.includes(itemProp))
  )
    return;
  const item = find(
    upSelectedFieldGroup.value,
    (i: any) => i.prop === itemProp,
  );
  if (item) {
    item.value = !item.value;
  } else {
    console.warn(`未找到 prop 为 ${itemProp} 的项`);
    return;
  }

  const disabledMap = new Map(
    dynamicsDisplayFieldDisabled.value.map((item: any) => [
      item.prop,
      item.disabledList,
    ]),
  );
  const currentDisabledList = disabledMap.get(itemProp) || [];
  upSelectedFieldGroup.value.forEach((ele: any) => {
    const eleDisabledList = disabledMap.get(ele.prop) || [];
    if (
      currentDisabledList.includes(ele.prop) ||
      eleDisabledList.includes(itemProp)
    ) {
      ele.value = false;
    }
  });
  emit('fieldsMulChange', upSelectedFieldGroup.value, selectedFieldGroup.value);
};
</script>
