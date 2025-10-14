<template>
    <el-dialog 
        v-model="dialogVisible" 
        :title="isEdit ? $t('groupDetail.editRoleTitle') : $t('groupDetail.newRole')"
        class="role-dialog"
        :before-close="handleClose"
        @close="resetForm"
        :destroy-on-close="true"
        :append-to-body="true"
    >
        <el-form 
            ref="formRef" 
            :model="form" 
            :rules="rules"
            label-width="auto"
            class="role-form"
        >
            <el-form-item prop="roleName" :label="$t('groupDetail.roleName')">
                <el-input 
                    v-model="form.roleName" 
                    :placeholder="isEdit ? $t('groupDetail.roleNamePlaceholderEdit') : $t('groupDetail.roleNamePlaceholderNew')"
                    maxlength="20"
                    show-word-limit
                    style="width: 300px;"
                />
            </el-form-item>

            <el-form-item prop="permissions" :label="$t('groupDetail.permissionAllocation')">
                <div class="permissions-container">
                    <!-- 恢复默认按钮 -->
                    <div class="restore-default-section">
                        <el-button @click="handleResetOrDefault" class="restore-default-btn">
                            <el-icon><RefreshLeft /></el-icon>
                            {{ isEdit ? t('groupDetail.reset') : t('groupDetail.restoreDefault') }}
                        </el-button>
                    </div>
                    
                    <!-- 权限组卡片列表 -->
                    <div class="permission-groups" :class="{ 'language-switching': isLanguageSwitching }">
                        <div v-if="permissionGroupsLoading" class="permission-groups-loading">
                            <el-icon class="is-loading"><Loading /></el-icon>
                            <span>{{ t('groupDetail.loadingPermissionGroups') || '正在加载权限组数据...' }}</span>
                        </div>
                        <div v-else-if="permissionGroups.length === 0" class="permission-groups-empty">
                            <el-empty :description="t('groupDetail.noPermissionGroups') || '暂无权限组数据'" />
                        </div>
                        <template v-else>
                            <transition-group 
                                name="permission-card" 
                                tag="div" 
                                class="permission-cards-container"
                                appear
                            >
                                <PermissionGroupCard
                                    v-for="group in permissionGroups"
                                    :key="group.actionType"
                                    :group-title="group.actionType"
                                    :permissions="group.actions"
                                    @update:permissions="(permissions) => handlePermissionGroupUpdate(group.actionType, permissions)"
                                />
                            </transition-group>
                        </template>
                    </div>
                </div>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">{{ t('btnText.cancel') }}</el-button>
                <el-button type="primary" @click="handleConfirm" :loading="submitLoading">
                    {{ t('btnText.confirm') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { RefreshLeft, Loading } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import PermissionGroupCard from './PermissionGroupCard.vue';
import { useI18n } from 'vue-i18n';
import GroupAPI from '@/api/group';
import { useAppStoreHook } from '@/store';


// 表单数据
interface RoleForm {
    roleName: string;
    permissionGroups: PermissionGroup[];
}

// 提交数据
interface SubmitData {
    roleName: string;
    actions: string[];
}

// Props 定义
interface Props {
    visible: boolean;
    isEdit?: boolean;
    roleData?: any; // 编辑时的角色数据
    roleId?: string; // 编辑时的角色ID
}

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    isEdit: false,
    roleData: null,
    roleId: undefined
});

// Emits 定义
const emit = defineEmits<{
    'update:visible': [value: boolean];
    'confirm': [data: SubmitData];
}>();

// 国际化
const { t } = useI18n();

// Store
const appStore = useAppStoreHook();

// 响应式数据
const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
});

const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const permissionGroupsLoading = ref(false);
const isLanguageSwitching = ref(false); // 标记是否正在切换语言
const permissionGroups = ref<PermissionGroup[]>([]);


// 表单数据
const form = reactive<RoleForm>({
    roleName: '',
    permissionGroups: []
});


// 权限组类型定义
interface PermissionItem {
    action: string;
    actionName: string;
    isUsed: boolean;
}

interface PermissionGroup {
    actionType: string;
    actions: PermissionItem[];
}

// 表单验证规则
const rules = computed<FormRules>(() => ({
    roleName: [
        { required: true, message: t('groupDetail.roleNameRequired'), trigger: 'blur' },
        { min: 1, max: 20, message: t('groupDetail.roleNameLength'), trigger: 'blur' }
    ]
}));

// 获取权限组数据
const fetchPermissionGroups = async (preserveSelection = false, isLanguageSwitch = false) => {
    try {
        // 语言切换时不显示加载状态，避免闪烁
        if (!isLanguageSwitch) {
            permissionGroupsLoading.value = true;
        } else {
            isLanguageSwitching.value = true;
        }
        
        // 如果需要保持选择状态，先保存当前的选择
        let previousSelections: Record<string, boolean> = {};
        if (preserveSelection && permissionGroups.value.length > 0) {
            permissionGroups.value.forEach(group => {
                group.actions.forEach(action => {
                    previousSelections[action.action] = action.isUsed;
                });
            });
        }
        
        // 获取当前语言环境
        const currentLanguage = appStore.language;
        const response = await GroupAPI.getRoleActions(currentLanguage);
        
        if (response && (response as any).TypeActions) {
            const newPermissionGroups = (response as any).TypeActions;
            
            // 如果需要保持选择状态，恢复之前的选择
            if (preserveSelection && Object.keys(previousSelections).length > 0) {
                newPermissionGroups.forEach((group: PermissionGroup) => {
                    group.actions.forEach(action => {
                        if (previousSelections.hasOwnProperty(action.action)) {
                            action.isUsed = previousSelections[action.action];
                        }
                    });
                });
            }
            
            // 语言切换时使用平滑过渡
            if (isLanguageSwitch) {
                // 添加短暂延迟，让过渡动画更自然
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            permissionGroups.value = newPermissionGroups;
            
            // 如果是编辑模式，同步角色的权限状态
            if (props.isEdit && props.roleData && props.roleData.typeActions) {
                syncRolePermissions();
            }
            
            // 同步到表单数据
            form.permissionGroups = [...permissionGroups.value];
        } else {
            permissionGroups.value = [];
            form.permissionGroups = [];
        }
    } catch (error) {
        console.error('获取权限组数据失败:', error);
        ElMessage.error(t('groupDetail.fetchPermissionGroupsError') || '获取权限组数据失败');
        // 失败时设置为空数组
        permissionGroups.value = [];
    } finally {
        permissionGroupsLoading.value = false;
        isLanguageSwitching.value = false;
    }
};

// 处理权限组更新
const handlePermissionGroupUpdate = (groupKey: string, permissions: PermissionItem[]) => {
    // 更新权限组数据中的权限值
    const groupIndex = permissionGroups.value.findIndex(group => group.actionType === groupKey);
    if (groupIndex !== -1) {
        // 更新权限组的 actions 数组
        permissionGroups.value[groupIndex].actions = [...permissions];
        
        // 同时更新表单数据
        form.permissionGroups = [...permissionGroups.value];
        
    } else {
        console.warn(`未找到权限组: ${groupKey}`);
    }
};

// 同步角色权限状态（编辑模式使用）
const syncRolePermissions = () => {
    if (!props.roleData || !props.roleData.typeActions) return;
    
    // 遍历角色的权限数据，同步到权限组中
    props.roleData.typeActions.forEach((typeAction: any) => {
        const permissionGroup = permissionGroups.value.find(group => group.actionType === typeAction.actionType);
        if (permissionGroup) {
            // 同步每个权限项的状态
            typeAction.actions.forEach((roleAction: any) => {
                const permissionAction = permissionGroup.actions.find(action => action.action === roleAction.action);
                if (permissionAction) {
                    permissionAction.isUsed = roleAction.isUsed;
                }
            });
        }
    });
};


// 初始化表单数据
const initForm = () => {
    if (props.isEdit && props.roleData) {
        // 编辑模式：使用传入的角色数据
        form.roleName = props.roleData.roleName || '';
        // 暂时清空权限组，等待fetchPermissionGroups完成后再同步
        form.permissionGroups = [];
    } else {
        // 新建模式：清空表单
        form.roleName = '';
        form.permissionGroups = [];
    }
};

// 恢复默认/重置
const handleResetOrDefault = () => {
    // 重新获取权限组数据以恢复默认状态
    fetchPermissionGroups();
};

// 关闭对话框
const handleClose = () => {
    // 确保对话框正确关闭
    emit('update:visible', false);
    dialogVisible.value = false;
};

// 重置表单
const resetForm = () => {
    if (formRef.value) {
        formRef.value.clearValidate();
    }
    form.roleName = '';
    form.permissionGroups = [];
    permissionGroups.value = [];
    // 确保提交状态重置
    submitLoading.value = false;
};

// 确认提交
const handleConfirm = async () => {
    if (!formRef.value) return;
    
    try {
        await formRef.value.validate();
        
        submitLoading.value = true;
        
        // 收集选中的权限项
        const selectedActions = collectSelectedActions();
        
        // 准备提交数据
        const submitData = {
            roleName: form.roleName.trim(),
            actions: selectedActions
        };

        // 获取团队ID
        const teamId = localStorage.getItem('teamId') ?? '';
        
        // 调用创建或更新角色接口
        if (props.isEdit) {
            // 编辑模式：使用roleId，如果props中没有则从roleData中获取
            const roleId = props.roleId || props.roleData?.roleId;
            if (!roleId) {
                throw new Error('编辑角色时缺少roleId');
            }
            await GroupAPI.updateRole(submitData, roleId);
        } else {
            await GroupAPI.createRole(submitData, teamId);
        }
        
        // 显示成功消息
        ElMessage.success(props.isEdit ? t('groupDetail.roleEditSuccess') : t('groupDetail.roleCreateSuccess'));
        
        // 发送确认事件（可选，用于父组件刷新列表等）
        emit('confirm', submitData);
        
        // 关闭对话框
        handleClose();
        
    } catch (error) {
        console.error('角色操作失败:', error);
        ElMessage.error(props.isEdit ? '角色更新失败' : '角色创建失败');
    } finally {
        submitLoading.value = false;
    }
};

// 收集选中的权限项
const collectSelectedActions = (): string[] => {
    const selectedActions: string[] = [];
    
    permissionGroups.value.forEach(group => {
        group.actions.forEach(action => {
            // 如果权限项被选中（isUsed 为 true），则添加action字符串到数组中
            if (action.isUsed) {
                selectedActions.push(action.action);
            }
        });
    });
    
    return selectedActions;
};

// 强制清理对话框（用于紧急情况）
const forceCleanup = () => {
    dialogVisible.value = false;
    submitLoading.value = false;
    resetForm();
    // 手动清理可能残留的遮罩层
    nextTick(() => {
        const overlays = document.querySelectorAll('.el-overlay');
        overlays.forEach(overlay => {
            const htmlElement = overlay as HTMLElement;
            if (htmlElement.style.zIndex && htmlElement.style.display !== 'none') {
                htmlElement.remove();
            }
        });
    });
};

// 监听对话框显示状态
watch(() => props.visible, (newVal) => {
    if (newVal) {
        initForm();
        fetchPermissionGroups();
    }
});

// 监听语言变化，重新获取权限组数据
watch(() => appStore.language, (newLanguage, oldLanguage) => {
    // 只有在对话框打开状态下且语言确实发生变化时才重新获取数据
    if (props.visible && newLanguage !== oldLanguage && oldLanguage !== undefined) {
        // 切换语言时保持用户的权限选择状态，并标记为语言切换
        fetchPermissionGroups(true, true);
    }
});

// 组件挂载时初始化
onMounted(() => {
    if (props.visible) {
        initForm();
        fetchPermissionGroups();
    }
});

// 暴露方法给父组件
defineExpose({
    forceCleanup
});
</script>

<style lang="scss">
.role-form {
    .permissions-container {
        width: 100%;

        .restore-default-section {
            margin-bottom: 16px;
            
            .restore-default-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                padding: 6px 12px;
                
                :deep(.el-icon) {
                    font-size: 14px;
                }
            }
        }
        
        .permission-groups {
            /* 移除固定高度限制，让内容自然流动 */
            display: flex;
            flex-direction: column;
            gap: 4px;
            transition: all 0.3s ease;
            
            // 语言切换时的样式
            &.language-switching {
                .permission-cards-container {
                    opacity: 0.7;
                    transform: translateY(-2px);
                    transition: all 0.2s ease;
                }
            }
            
            .permission-cards-container {
                display: flex;
                flex-direction: column;
                gap: 4px;
                transition: all 0.3s ease;
            }
            
            .permission-groups-loading {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 40px 20px;
                color: var(--el-text-color-secondary);
                font-size: 14px;
                
                .el-icon {
                    font-size: 16px;
                }
            }
            
            .permission-groups-empty {
                padding: 20px;
                
                :deep(.el-empty) {
                    padding: 20px 0;
                }
            }
        }
        
        // 权限卡片过渡动画
        .permission-card-enter-active,
        .permission-card-leave-active {
            transition: all 0.3s ease;
        }
        
        .permission-card-enter-from {
            opacity: 0;
            transform: translateX(-10px);
        }
        
        .permission-card-leave-to {
            opacity: 0;
            transform: translateX(10px);
        }
        
        .permission-card-move {
            transition: transform 0.3s ease;
        }
    }
}

.dialog-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
}

/* 对话框容器样式 */
.role-dialog.el-dialog {
    width: 80vw !important;
    max-width: 1200px !important;
    min-width: 800px !important;
    max-height: 85vh !important;
}

/* 对话框主体样式 */
.role-dialog.el-dialog .el-dialog__body {
    overflow-y: auto !important;
    max-height: 60vh !important;
    padding: 20px !important;
}
</style>
