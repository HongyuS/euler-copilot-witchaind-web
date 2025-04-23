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
  
  let content = `2025-04-22T15:30:45.123Z | INFO  | 192.168.1.105 | GET /api/v1/products?category=electronics | Status:200 | Latency:82ms | UserAgent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
2025-04-22T15:30:46.845Z | ERROR | 10.20.35.207 | POST /payment/process | Status:500 | Error:PaymentGatewayTimeout | DeviceID:ANDROID-7X8S9 | SessionID:ZYA1B3C4D5
2025-04-22T15:30:47.112Z | DEBUG | 172.16.0.34 | GET /user/profile/12345 | CacheHit:false | QueryTime:235ms | Location:{lat:31.2304, lng:121.4737}
{
  "timestamp": "2025-04-22T15:31:12.335Z",
  "level": "WARN",
  "ip": "203.119.84.15",
  "event": "AD_CLICK",
  "properties": {
    "ad_id": "X9F3G7",
    "user_id": "U12345678",
    "campaign": "spring_sale",
    "device": "iPhone14,3/iOS16.4.1",
    "location": {"city": "Shanghai", "country": "CN"}
  }
}
  {
  "timestamp": "2025-04-22T15:31:12.335Z",
  "level": "WARN",
  "ip": "203.119.84.15",
  "event": "AD_CLICK",
  "properties": {
    "ad_id": "X9F3G7",
    "user_id": "U12345678",
    "campaign": "spring_sale",
    "device": "iPhone14,3/iOS16.4.1",
    "location": {"city": "Shanghai", "country": "CN"}
  }
}
  {
  "timestamp": "2025-04-22T15:31:12.335Z",
  "level": "WARN",
  "ip": "203.119.84.15",
  "event": "AD_CLICK",
  "properties": {
    "ad_id": "X9F3G7",
    "user_id": "U12345678",
    "campaign": "spring_sale",
    "device": "iPhone14,3/iOS16.4.1",
    "location": {"city": "Shanghai", "country": "CN"}
  }
}
{
  "timestamp": "2025-04-22T15:31:12.335Z",
  "level": "WARN",
  "ip": "203.119.84.15",
  "event": "AD_CLICK",
  "properties": {
    "ad_id": "X9F3G7",
    "user_id": "U12345678",
    "campaign": "spring_sale",
    "device": "iPhone14,3/iOS16.4.1",
    "location": {"city": "Shanghai", "country": "CN"}
  }
}
  {
  "timestamp": "2025-04-22T15:31:12.335Z",
  "level": "WARN",
  "ip": "203.119.84.15",
  "event": "AD_CLICK",
  "properties": {
    "ad_id": "X9F3G7",
    "user_id": "U12345678",
    "campaign": "spring_sale",
    "device": "iPhone14,3/iOS16.4.1",
    "location": {"city": "Shanghai", "country": "CN"}
  }
}
`
  const codeEditBox = ref<HTMLElement | null>(null)
  let monacoEditor: editor.IStandaloneCodeEditor | null = null
  
  // 初始化编辑器
  const initMonaco = () => {
    if (!codeEditBox.value) return
  
    monacoEditor = monaco.editor.create(codeEditBox.value, {
      value: content,
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
  
  // 生命周期钩子
  onMounted(() => {
    initMonaco()
  })
  
  onBeforeUnmount(() => {
    if (monacoEditor) {
      monacoEditor.dispose()
      monacoEditor = null
    }
  })

  const downloadLogFn = () => {

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
