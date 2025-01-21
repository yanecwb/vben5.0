<template>
  <div>
    <el-dialog
      :model-value="visible"
      title="筛选设置"
      :close-on-click-modal="true"
      :modal-append-to-body="false"
      width="620px"
      @closed="emits('close')"
    >
      <div
        class="text-primary font-size-13 mg-0-0-10 mg-0-5-0-0 cursor-pointer"
        @click="chooseAll"
      >
        全选
      </div>
      <div style="max-height: 200px; overflow: auto">
        <el-checkbox-group v-model="checkSearchItemList">
          <template v-for="i in searchItems" :key="i.value.key">
            <el-checkbox
              :label="i.value.key"
              :disabled="disableLastOne === i.value.key"
              border
            >
              {{ i.label }}
            </el-checkbox>
          </template>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="$emit('close')">关闭</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="SearchEdit">
import { filter, map } from 'lodash';
import { computed, ref, shallowRef } from 'vue';
import { ElDialog, ElButton, ElCheckboxGroup, ElCheckbox } from 'element-plus';

const props = defineProps(['visible', 'searchItems']);
const emits = defineEmits(['close', 'confirm']);
const visible = computed({
  get: () => {
    return props.visible;
  },
  set: (v) => {
    emits('close');
  },
});

const disableLastOne = computed(() => {
  if (checkSearchItemList.value.length !== 1) return false;
  return checkSearchItemList.value[0];
});
const btnLoading = shallowRef(false);

const { searchItems } = props;

const checkSearchItemList = ref<string[]>([]);
checkSearchItemList.value = map(
  filter(searchItems, (i: any) => {
    return !i.value.hide;
  }),
  (o: any) => {
    return o.value.key;
  },
);
const confirm = async () => {
  btnLoading.value = true;
  try {
    emits('confirm', checkSearchItemList.value);
    emits('close');
  } finally {
    btnLoading.value = false;
  }
};

const chooseAll = () => {
  checkSearchItemList.value = map(searchItems, (i: any) => i.value.key);
};
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-checkbox {
      width: 180px;
      margin: 0 !important;
      margin-bottom: 10px !important;
    }

    .el-checkbox:nth-child(3n + 2) {
      margin: 0 20px !important;
    }
  }
}
</style>
