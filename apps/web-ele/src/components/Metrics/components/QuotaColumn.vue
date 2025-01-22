<template>
  <div>
    <el-dialog
      title="指标设置"
      :model-value="dialogVisible"
      :close-on-click-modal="true"
      :modal-append-to-body="false"
      width="1100px"
      @closed="changeShow(false)"
    >
      <div class="display-row p-[6px]">
        <div class="column-left flex-1">
          <div class="column-height">
            <el-tree
              ref="tree"
              :data="treeColumnCopy"
              :props="{
                children: 'children',
                label: 'label',
              }"
              :default-checked-keys="defaultCheckedKeys"
              show-checkbox
              node-key="prop"
              default-expand-all
              @check="onCheckChange"
            ></el-tree>
          </div>
        </div>
        <div class="column-right">
          <div class="column-height display-column">
            <div class="column-name display-column flex overflow-y-auto">
              <div class="mg-0-0-10">
                <span class="font-size-15 font-weight-bold mg-0-5-0-0"
                  >指标</span
                >
                <span class="font-size-12 font-weight-normal">
                  已选择{{ columns.filter((item) => !item.hide).length }}列
                </span>
                <span
                  class="text-primary font-size-12 float-end cursor-pointer"
                  @click="delColumn(true)"
                  >清空</span
                >
                <span
                  class="text-primary font-size-12 mg-0-5-0-0 float-end cursor-pointer"
                  @click="chooseAll"
                  >全选</span
                >
              </div>
              <div class="overflow-y-auto">
                <draggable
                  :list="columns"
                  :animation="100"
                  :force-fallback="true"
                  drag-class="drag-class"
                  chosen-class="drag-class"
                  handle=".draghandle"
                >
                  <template #item="{ element }">
                    <div
                      v-if="!element.hide"
                      :class="{ column: !element.hide }"
                      class="draghandle display-row align-items-center justify-content-between select-none"
                    >
                      <span class="display-row align-items-center">
                        <span
                          class="icon-[uil--draggabledots] mg-0-2-0-0"
                        ></span>
                        <span>{{ element.label }}</span>
                      </span>
                      <span
                        class="icon-[line-md--menu-to-close-transition] close-icon ml-[4px] h-[12px] w-[12px] cursor-pointer text-[#555658]"
                        @click="delColumn(false, element)"
                      ></span>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="confirm">应 用</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="QuotaColumn">
import { cloneDeep, find, forEach, has, map } from 'lodash';

import {
  defineEmits,
  defineProps,
  shallowRef,
  ref,
  type PropType,
  computed,
} from 'vue';
import { type ColumnOption } from '#/components/Crud/types/table';
import draggable from 'vuedraggable';
import { ElDialog, ElTree, ElButton } from 'element-plus';

const props = defineProps({
  treeColumn: {
    type: Array as PropType<
      Array<{
        children: ColumnOption[];
        label: string;
      }>
    >,
    required: true,
    default: () => [],
  },
  fieldGroup: {
    type: Array as PropType<Array<ColumnOption>>,
    required: true,
    default: () => [],
  },
  fieldsCurrent: {
    type: Array as PropType<Array<any>>,
    required: true,
    default: () => [],
  },
});
const emit = defineEmits(['uptableColumns']);
const tree = ref();

const dialogVisible = shallowRef<boolean>(false);
const treeColumnCopy = ref<any[]>([]);
const columns = ref<any[]>([]);

const defaultCheckedKeys = computed(() => {
  return columns.value
    .filter((item: any) => !item.hide)
    .map((item: any) => item.prop);
});
const fields = computed(() => {
  return [
    ...props.fieldGroup.filter((item: any) =>
      props.fieldsCurrent.includes(item.prop),
    ),
  ];
});

const changeShow = (show: boolean) => {
  treeColumnCopy.value = cloneDeep(props.treeColumn);
  treeColumnCopy.value.forEach((item: any) => {
    item.children = item.children.filter((ele: any) => !ele.list);
  });
  columns.value = treeColumnCopy.value.map((item: any) => item.children).flat();
  columns.value.forEach((item: any) => {
    item.hide = item.hide;
  });
  dialogVisible.value = show;
};

const onCheckChange = (node: any, checked: any) => {
  if (has(node, 'children')) {
    forEach(node.children, (n: any) => {
      const columnItem = columns.value.find(
        (item: any) => n.prop === item.prop,
      );
      columnItem.hide = !checked?.checkedKeys.includes(columnItem.prop);
    });
    return;
  }
  const currentItem = columns.value.find(
    (item: any) => item.prop === (node as any).prop,
  );
  if (currentItem) {
    currentItem.hide = !find(
      checked?.checkedKeys,
      (i: any) => i === currentItem.prop,
    );
  }
};
const delColumn = (all = false, item?: any) => {
  if (all) {
    columns.value = map(columns.value, (i: any) => ({ ...i, hide: true }));
  } else {
    item.hide = true;
  }
  tree.value && (tree.value as any).setCheckedKeys(defaultCheckedKeys.value);
};
const chooseAll = () => {
  columns.value = map(columns.value, (i: any) => ({
    ...i,
    hide: false,
  }));
  tree.value && (tree.value as any).setCheckedKeys(defaultCheckedKeys.value);
};

const confirm = () => {
  dialogVisible.value = false;
  emit('uptableColumns', columns.value);
};

defineExpose({
  changeShow,
});
</script>
<style lang="scss" scoped>
.drag-class {
  color: white !important;
  background-color: #2265ff !important;
}

.column-height {
  max-height: 500px;
  overflow-y: auto;

  .el-tree {
    display: flex;
    align-items: self-start;
  }
}

:deep(.el-tree > .el-tree-node) {
  width: 188px;
  padding: 10px;
  margin-right: 20px;
  color: hsl(var(--heavy-foreground));
  background: hsl(var(--border));
  border-radius: 4px;
}

:deep(.el-tree-node__children > .el-tree-node) {
  padding: 3px 0;
}

:deep(.el-tree-node__label) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid #e6e9ed;
}

.column-left {
  border-right: 1px solid #dcdfe6;
}

.column-right {
  width: 240px;
  margin-left: 15px;

  .column-right-items-maxheight {
    max-height: 200px;
    overflow-y: auto;
  }

  .column-name {
    margin-bottom: 15px;
  }

  .column-name:last-child {
    margin-bottom: 0;
  }

  .column {
    padding: 6px 6px 6px 2px;
    margin-bottom: 5px;
    font-size: 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }

  .column:last-child {
    margin-bottom: 0;
  }

  .disabled {
    cursor: not-allowed;
  }
}

.column-line {
  padding-bottom: 15px;
  border-bottom: 1px solid #dcdfe6;
}
</style>
