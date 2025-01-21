<template>
  <ElDialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    width="720px"
    @closed="() => (dialogVisible = false)"
  >
    <JsonViewer
      :expanded="false"
      :expand-depth="5"
      :sort="true"
      :boxed="true"
      :value="jsonData"
    ></JsonViewer>
    <template #footer class="dialog-footer">
      <ElButton @click="dialogVisible = false">取 消</ElButton>
    </template>
  </ElDialog>
</template>

<script lang="ts" setup name="JsonViewer">
import { ElDialog, ElButton } from 'element-plus';
import { shallowRef } from 'vue';
import JsonViewer from 'vue-json-viewer';

const title = shallowRef<string>('');
const dialogVisible = shallowRef<boolean>(false);
const jsonData = shallowRef<object | null>(null);

const open = (t: string, json: string): void => {
  title.value = t;
  jsonData.value = isJSON(json) ? JSON.parse(json) : {};
  dialogVisible.value = true;
};

const isJSON = (str: string) => {
  try {
    const obj = JSON.parse(str);
    return !!(typeof obj == 'object' && obj);
  } catch (e) {
    return false;
  }
};

defineExpose({
  open,
});
</script>
