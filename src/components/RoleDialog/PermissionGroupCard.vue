<template>
    <div class="permission-group-card">
        <!-- 权限组标题行 -->
        <div class="group-header">
            <el-checkbox 
                v-model="groupState.all"
                :indeterminate="groupState.indeterminate"
                @change="handleGroupChange"
                class="group-checkbox"
            >
                {{ groupTitle }}
            </el-checkbox>
        </div>
        
        <!-- 权限项列表 -->
        <div class="group-items">
            <el-checkbox 
                v-for="item in permissions"
                :key="item.actionName"
                v-model="item.isUsed"
                class="item-checkbox"
                @change="handleItemChange"
            >
                {{ item.actionName }}
            </el-checkbox>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue';
import type { CheckboxValueType } from 'element-plus';

// 权限项类型定义
interface PermissionItem {
    action: string;
    actionName: string;
    isUsed: boolean;
}

// Props 定义
interface Props {
    groupTitle: string;
    permissions: PermissionItem[];
}


const props = withDefaults(defineProps<Props>(), {});

// Emits 定义
const emit = defineEmits<{
    'update:permissions': [permissions: PermissionItem[]];
}>();

// 权限组状态
const groupState = reactive({
    all: false,
    indeterminate: false
});

// 处理权限组全选/取消全选
const handleGroupChange = (checked: CheckboxValueType) => {
    const isChecked = Boolean(checked);
    props.permissions.forEach(item => {
        item.isUsed = isChecked;
    });
    // 触发更新事件
    emit('update:permissions', props.permissions);
};

// 处理单个权限项变化
const handleItemChange = () => {
    updateGroupState();
    // 触发更新事件
    emit('update:permissions', props.permissions);
};

// 更新权限组状态（全选/半选/未选）
const updateGroupState = () => {
    const checkedCount = props.permissions.filter(item => item.isUsed).length;
    const totalCount = props.permissions.length;
    
    groupState.all = checkedCount === totalCount;
    groupState.indeterminate = checkedCount > 0 && checkedCount < totalCount;
};

// 监听权限数据变化，更新组状态
watch(() => props.permissions, () => {
    updateGroupState();
}, { immediate: true, deep: true });
</script>

<style lang="scss" scoped>
.permission-group-card {
    background-color: #f0f7ff; 
    padding: 12px;
    margin-bottom: 4px;
    border: 1px solid #e1ecf4;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    // 添加内容变化时的平滑过渡
    * {
        transition: color 0.2s ease, opacity 0.2s ease;
    }
    
    // 深色模式支持
    html.dark &,
    body[theme='dark'] & {
        background-color: #2a2a2a;
        border-color: #404040;
    }
    
    .group-header {        
        .group-checkbox {
            :deep(.el-checkbox__label) {
                font-weight: 600;
                font-size: 14px;
                color: var(--o-text-color-primary);
            }
        }
    }
    
    .group-items {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); // 增加最小宽度避免挤压
        gap: 12px 16px; // 增加间距：行间距12px，列间距16px
        margin-top: 12px;
        align-items: start; // 顶部对齐，避免高度不一致时的对齐问题
        
        // 响应式布局优化
        @media (max-width: 768px) {
            grid-template-columns: 1fr; // 小屏幕单列显示
            gap: 8px;
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); // 中等屏幕调整
            gap: 10px 14px;
        }
        
        .item-checkbox {
            margin-right: 0;
            margin-bottom: 0; // 确保没有额外的底部边距
            line-height: 1.4; // 设置合适的行高
            min-height: 32px; // 增加最小高度确保一致性
            display: flex;
            align-items: center; // checkbox内容垂直居中
            width: 100%; // 确保占满网格单元格
            box-sizing: border-box;
            padding: 4px 0; // 添加内边距增加点击区域
            
            :deep(.el-checkbox__label) {
                font-size: 12px;
                font-weight: 400;
                color: var(--o-text-color-secondary);
                white-space: nowrap; // 防止文本换行
                overflow: hidden;
                text-overflow: ellipsis; // 长文本显示省略号
                max-width: 100%;
                line-height: 1.4;
            }
            
            // 确保checkbox本身也有合适的对齐
            :deep(.el-checkbox__input) {
                margin-right: 8px;
                flex-shrink: 0; // 防止checkbox被压缩
            }
        }
    }
    
    // 不可编辑状态的样式优化
    .disabled-checkbox {
        opacity: 1;
        cursor: not-allowed !important;
        position: relative;
        
        // 添加锁定图标或背景效果
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
            pointer-events: none;
            z-index: 1;
        }
        
        :deep(.el-checkbox__input) {
            cursor: not-allowed !important;
            
            .el-checkbox__inner {
                background-color: var(--el-disabled-bg-color) !important;
                border-color: var(--el-disabled-border-color) !important;
                cursor: not-allowed !important;
                box-shadow: inset 0 0 3px var(--el-border-color-darker) !important;
                
                &::after {
                    border-color: var(--el-disabled-text-color) !important;
                }
            }
            
            &.is-checked .el-checkbox__inner {
                background-color: var(--el-disabled-bg-color) !important;
                border-color: var(--el-disabled-border-color) !important;
                box-shadow: inset 0 0 3px var(--el-border-color-darker) !important;
                
                &::after {
                    border-color: var(--el-disabled-text-color) !important;
                }
            }
            
            &.is-indeterminate .el-checkbox__inner {
                background-color: var(--el-disabled-bg-color) !important;
                border-color: var(--el-disabled-border-color) !important;
                box-shadow: inset 0 0 3px var(--el-border-color-darker) !important;
                
                &::before {
                    background-color: var(--el-disabled-text-color) !important;
                }
            }
        }
        
        :deep(.el-checkbox__label) {
            color: var(--el-disabled-text-color) !important;
            cursor: not-allowed !important;
            text-decoration: line-through;
            text-decoration-color: var(--el-disabled-text-color);
            opacity: 0.8;
        }
        
        &:hover {
            :deep(.el-checkbox__input .el-checkbox__inner) {
                border-color: var(--el-disabled-border-color) !important;
                box-shadow: inset 0 0 3px var(--el-border-color-darker) !important;
            }
            
            :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
                background-color: var(--el-disabled-bg-color) !important;
                border-color: var(--el-disabled-border-color) !important;
                box-shadow: inset 0 0 3px var(--el-border-color-darker) !important;
            }
        }
    }
    
    // 权限组标题不可编辑状态的特殊样式
    .group-header .disabled-checkbox {
        :deep(.el-checkbox__label) {
            font-weight: 500 !important;
            color: var(--el-disabled-text-color) !important;
        }
    }
    
    // 悬停效果
    &:hover {
        background-color: #e8f4fd;
        border-color: #c6e2ff;
        
        // 深色模式悬停效果
        html.dark &,
        body[theme='dark'] & {
            background-color: #353535;
            border-color: #505050;
        }
    }
}
</style>
