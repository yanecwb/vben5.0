<template>
  <div
    class="display-row align-items-center relative flex-wrap pl-[50px]"
  >
    <span
      class="mg-0-10-0-0 font-size-14 display-inline-block absolute left-0 top-0"
      style="min-width: 50px; height: 32px; line-height: 32px"
      >维度</span
    >
    <div
      v-for="(item, index) in groupbyList"
      :key="index"
      class="display-row align-items-center mb-2"
      :class="{ 'mg-0-10-0-0': index === groupbyList.length - 1 }"
    >
      <ElSelect
        v-model="item.prop"
        style="width: 160px"
        :clearable="index !== 0"
        placeholder="请选择"
        @change="onChange($event, index)"
      >
        <ElOption
          v-for="ele in item.option"
          :key="ele.prop"
          :label="ele.label"
          :value="ele.prop"
          :disabled="ele.disabled && index !== 0"
        ></ElOption>
      </ElSelect>
      <span
        v-if="index !== groupbyList.length - 1"
        class="icon-[bx--subdirectory-right] mx-1 h-[18px] w-[18px] text-[#909399]"
      ></span>
    </div>
    <div style="height: 32px; line-height: 32px">
      <span
        v-if="showAddBtn"
        class="icon-[line-md--plus] h-[18px] w-[18px] cursor-pointer text-[#909399]"
        @click="onAdd"
      ></span>
    </div>
  </div>
</template>

<script lang="ts" setup name="Groupby">
import { filter, map } from 'lodash';
import { computed, ref } from 'vue';

import { ElOption, ElSelect } from 'element-plus';

const { fields, displayFieldDisabled } = defineProps<{
  fields: any[];
  displayFieldDisabled: any[];
}>();
const emit = defineEmits(['fieldsChange']);

const groupbyList = ref<any[]>([]);
const dynamicsDisplayFieldDisabled = computed(() => {
  const dateFieldDisabledProps = ['byDay', 'byWeek', 'byMonth', 'byYear'];
  const generateConfig = (prop: string) => ({
    prop,
    disabledList: filter(dateFieldDisabledProps, (p: any) => p !== prop),
  });
  return [
    ...map(dateFieldDisabledProps, generateConfig),
    ...displayFieldDisabled,
  ];
});

const showAddBtn = computed(() => {
  let selectedGroupbyLen = groupbyList.value.filter(
    (item: any) => item.prop,
  ).length;
  return (
    selectedGroupbyLen === groupbyList.value.length &&
    !(selectedGroupbyLen === fields.length)
  );
});

groupbyList.value = fields
  .filter((item: any) => item.value)
  .map((ele: any) => ({
    prop: ele.prop,
    option: fields,
  }));
console.log(groupbyList.value);

const updateItemOption = () => {
  let selectedGroupby = groupbyList.value
    .filter((item: any) => item.prop)
    .map((item: any) => item.prop);
  groupbyList.value.forEach((item: any, index: number) => {
    if (index - 1 >= 0) {
      item.option = groupbyList.value[index - 1].option.filter((ele: any) => {
        ele.disabled = false;
        dynamicsDisplayFieldDisabled.value.forEach((o: any) => {
          if (selectedGroupby.includes(o.prop)) {
            ele.disabled = !!o.disabledList.includes(ele.prop);
          }
        });
        return ele.prop !== groupbyList.value[index - 1].prop;
      });
    } else {
      item.option = fields;
    }
  });
};
updateItemOption();

const onAdd = () => {
  groupbyList.value.push({
    prop: '',
    option: [],
  });
  updateItemOption();
};
const onChange = (event: any, index: number) => {
  let activeIndex = groupbyList.value.findIndex(
    (item: any) => item.prop === event,
  );
  let selectedGroupby = groupbyList.value
    .filter((item: any) => item.prop)
    .map((item: any) => item.prop);
  let selectedGroupbyRepeat = selectedGroupby.filter(
    (item: any) => item === event,
  );
  let isRepeat = false;
  groupbyList.value = groupbyList.value
    .filter((item: any) => item.prop)
    .filter((item: any, index: number) => {
      if (selectedGroupbyRepeat.length > 1) {
        isRepeat = true;
        return index <= activeIndex;
      } else {
        isRepeat = false;
        dynamicsDisplayFieldDisabled.value.forEach((o: any) => {
          if (selectedGroupby.includes(o.prop)) {
            if (o.disabledList.includes(item.prop)) {
              item.prop = '';
            }
          }
        });
        return item.prop;
      }
    });
  console.log(groupbyList.value);

  updateItemOption();
  emit(
    'fieldsChange',
    groupbyList.value
      .filter((item: any) => item.prop)
      .map((item: any) => item.prop),
    index,
    !event,
    isRepeat,
  );
};
</script>
