<template>
    <div class="editor-container">
      <div class="code-edit-tools">
        <el-button @click="downloadLogFn">{{ $t('btnText.download') }}</el-button>
      </div>
      <div ref="codeEditBox" class="code-edit-box"></div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import * as monaco from 'monaco-editor'
  import { editor } from 'monaco-editor'
  import KfAppAPI from '@/api/kfApp';
  import { downloadFun } from '@/utils/downloadFun';

  const route = useRoute();
  
  let content = ref('');
  const codeEditBox = ref<HTMLElement | null>(null)
  let monacoEditor: editor.IStandaloneCodeEditor | null = null
  
  // 注册自定义语言和主题
  const registerCustomLanguage = () => {
    // 注册自定义语言
    monaco.languages.register({ id: 'customLog' });
    
    // 定义语言的标记器规则
    monaco.languages.setMonarchTokensProvider('customLog', {
      tokenizer: {
        root: [
          // 匹配UUID格式
          [/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/, 'uuid'],
          // 匹配时间戳格式: 2025-05-19 08:19:22.862548+00:00
          [/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d+\+\d{2}:\d{2}/, 'timestamp'],
        ]
      }
    });
    
    // 定义主题规则
    monaco.editor.defineTheme('customLogTheme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'uuid', foreground: '#808080' }, // 灰色
        { token: 'timestamp', foreground: '#CE9178' }, // 紫色
      ],
      colors: {}
    });
  }
  
  // 初始化编辑器
  const initMonaco = () => {
    if (!codeEditBox.value) return
    
    // 注册自定义语言和主题
    registerCustomLanguage();
  
    monacoEditor = monaco.editor.create(codeEditBox.value, {
      value: content.value,
      language: 'customLog',
      theme: 'customLogTheme',
      readOnly: true,
      minimap: {
        enabled: true,
        maxColumn: 60,       // 控制缩略图显示的最大列数
      },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      fontSize: 12,
      lineNumbers: 'on',
      scrollbar: {
        verticalScrollbarSize: 10,
      },
      wordWrap: 'on'
    })
  }

  const getDocumentLog = () => {
    const docId = route.query.file_id as string;
    KfAppAPI.getDocumentLog({docId:docId}).then((res:any) => {
      content.value = res;
      // 更新Monaco编辑器的内容
      if (monacoEditor) {
        monacoEditor.setValue(res);
      }
    })
  }
  
  // 生命周期钩子
  onMounted(() => {
    initMonaco();
    getDocumentLog();
  })
  
  onBeforeUnmount(() => {
    if (monacoEditor) {
      monacoEditor.dispose()
      monacoEditor = null
    }
  })

  const downloadLogFn = () => {
    const url = `${window.origin}/witchaind/api/doc/report/download?docId=${route.query.file_id as string}`;
    downloadFun(url);
  }
  </script>
  
  <style lang="scss" scoped>
  .editor-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    padding: 8px;
    border: 1px solid #dcdfe6;
    .code-edit-tools{
      padding:16px;
    }
    .code-edit-box {
      min-height:calc(100vh - 310px);
      border-radius: 8px;
    }
  }
  </style>