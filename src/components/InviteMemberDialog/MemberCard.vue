<template>
    <div class="member-card">
        <div class="member-info">
            <div class="member-name">{{ memberData.userName }}</div>
            <div class="member-id">{{ memberData.userId }}</div>
        </div>
        <div class="member-actions">
            <el-select 
                v-model="memberData.selectedRole" 
                :placeholder="$t('groupDetail.pleaseSelectRole')"
                size="small"
                style="width: 120px; margin-right: 12px;"
            >
                <el-option
                    v-for="option in roleOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                />
            </el-select>
            <el-button 
                type="text" 
                @click="handleDelete"
                class="delete-btn"
                size="small"
            >
                {{ $t('groupDetail.deleteMember') }}
            </el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 组件属性定义
interface MemberData {
    userId: string;
    userName: string;
    selectedRole: string;
}

interface RoleOption {
    value: string;
    label: string;
}

interface Props {
    memberData: MemberData;
    roleOptions: RoleOption[];
}

interface Emits {
    (e: 'delete', memberId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleDelete = () => {
    emit('delete', props.memberData.userId);
};
</script>

<style lang="scss" scoped>
.member-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #f0f9ff; /* 浅蓝色背景 */
    border: 1px solid #e0f2fe;
    border-radius: 8px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    
    // 深色模式支持
    html.dark &,
    body[theme='dark'] & {
        background-color: #2a2a2a;
        border-color: #404040;
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

    .member-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
        
        .member-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--o-text-color-primary);
        }
        
        .member-id {
            font-size: 12px;
            color: var(--o-text-color-secondary);
        }
    }

    .member-actions {
        display: flex;
        align-items: center;
        
        .delete-btn {
            color: var(--el-color-danger) !important;
            padding: 0;
            font-size: 12px;
            border: none !important;
            background: none !important;
            box-shadow: none !important;
            
            &:hover {
                color: var(--el-color-danger-light-3) !important;
                background: none !important;
                border: none !important;
            }
            
            &:focus {
                background: none !important;
                border: none !important;
                box-shadow: none !important;
            }
            
            &:active {
                background: none !important;
                border: none !important;
            }
        }
    }
}
</style>
