<template>
    <div class="editor-container">
      <div class="code-edit-tools">
        <el-button @click="downloadLogFn">下载</el-button>
      </div>
      <div ref="codeEditBox" class="code-edit-box"></div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import * as monaco from 'monaco-editor'
  import { editor } from 'monaco-editor'
  import KfAppAPI from '@/api/kfApp';

  const route = useRoute();
  
  let content = ref('');
  const codeEditBox = ref<HTMLElement | null>(null)
  let monacoEditor: editor.IStandaloneCodeEditor | null = null
  
  // 初始化编辑器
  const initMonaco = () => {
    if (!codeEditBox.value) return
  
    monacoEditor = monaco.editor.create(codeEditBox.value, {
      value: content.value,
      language: 'javascript',
      theme: 'vs',
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
    monaco.editor.defineTheme("myTheme", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.foreground": "#000000",
        "editor.background": "#FFFFFF",
        "editorCursor.foreground": "#8B0000",
        "editor.selectionBackground": "#88000030",
        "editor.inactiveSelectionBackground": "#88000015",
      },
    });
    monaco.editor.setTheme("myTheme");
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
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filename'; // 指定文件名
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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