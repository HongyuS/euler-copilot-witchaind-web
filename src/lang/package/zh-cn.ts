export default {
  // 登录页面国际化
  login: {
    username: '用户名',
    password: '密码',
    login: '登录',
    signin: '注册',
    backToLogin: '返回登录',
    logOut: '退出登录',
    welcomeToUse: '欢迎使用',
    appName: '知识库',
    loginSuccessful: '登录成功',
    signinSuccessful: '注册成功',
    message: {
      name: {
        nameMsg: '昵称不能为空',
        required: '请输入昵称',
        notMinThan: '昵称长度不能大于10个字符',
        popoverMsg: '长度为1-10个字符',
      },
      username: {
        usernameMsg: '用户名不能为空',
        required: '请输入用户名',
        notMinThan: '用户名长度不能少于5个字符',
        notMaxThan: '用户名长度不能大于20个字符',
        regxMsg: '用户名只能为小写字母、数字',
        popoverMsg: '长度为5-20个字符,只能包含小写字母、数字',
      },
      password: {
        passwordMsg: '密码不能为空',
        required: '请输入密码',
        notMinThan: '密码长度不能少于6个字符',
        notMaxThan: '密码长度不能大于20个字符',
        regxMsg: '密码必须包含大写字母、小写字母、数字',
        popoverMsg: '长度为6-20个字符,必须包含大写字母、小写字母、数字',
      },
      passwd: {
        passwordMsg: '密码不能为空',
        required: '请输入密码',
        notMinThan: '密码长度不能少于6个字符',
        notMaxThan: '密码长度不能大于20个字符',
        regxMsg: '密码必须包含大写字母、小写字母、数字',
        popoverMsg: '长度为6-20个字符,必须包含大写字母、小写字母、数字',
      },
      email: {
        emailMsg: '邮箱不能为空',
        required: '请输入邮箱',
        notMinThan: '邮箱长度不能少于5个字符',
        notMaxThan: '邮箱长度不能大于20个字符',
        regxMsg: '邮箱格式不正确',
        popoverMsg: '长度为5-20个字符,格式必须为XXX@XXX.XXX',
      },
      loginTip: '用户名或密码错误',
      loginToken: '您的会话已过期，请重新登录',
    },
  },
  langSelect: {
    message: {
      success: '切换语言成功',
    },
  },
  group: {
    myCreate: '我创建的',
    myJoin: '我加入的',
    createTeam: '新建团队',
    editTeam: '编辑团队',
    pleaseInput: '请输入团队名称',
    public: '公开',
    private: '私密',
    editor: '编辑',
    people: '人',
    teamName: '团队名称',
    teamDesc: '团队简介',
    teamSize: '团队人数',
    teamAuth: '团队权限',
    isPublic: '是否公开',
    creator: '创建人',
    createTime: '创建时间',
    noData: '暂无数据',
    teamDetail: '团队详情',
    witchaind: '数据治理',
    documentMnagement: '文档管理',
    datasetManagement: '数据集管理',
    testingManagement: '评测管理',
    create: '创建',
  },
  groupDetail: {
    teamSet: '团队设置',
    teamNews: '团队动态',
    roleManage: '角色管理',
    MemberAuthority: '成员/权限',
    dissolveTeam: '解散团队',
    dissolve: '解散',
    dissolveTip: '解散团队后相关资源都会被释放，请谨慎操作',
    updateTeamTip: '团队更新成功',
    confirmDissolve:
      '解散【{name}】团队后，该团队下的所有项目都将被同步删除，且不可恢复！请谨慎操作。',
    team: '团队',
    dissolveSuccess: '解散成功',
    createTeamSuccess: '团队创建成功',
    updateTeamSuccess: '团队更新成功',
    inviteMember: '邀请成员',
    placeholderMember: '请输入成员ID/姓名',
    memberId: '成员ID',
    memberName: '成员名称',
    roleAuth: '角色权限',
  },
  assetLibrary: {
    assetLibrary: '资产库',
    assetId: '资产ID',
    welcomeUsePro: '欢迎使用知识库!',
    profile:
      '知识库专注于文档的高效管理和智能解析，支持包括xlsx,pdf,doc,docx,pptx,html,json,yaml,md,zip,jpeg,png以及txt在内的多种文件格式。本平台搭载的先进文档处理技术，结合openEuler Intelligence的强大检索功能，旨在为您提供卓越的智能问答服务体验。',
    message: {
      name: '请输入资产库名称',
      libraryNameLen: '资产库名称长度1-15个字符',
      categoryInfo: '请输入类别名称',
      languagePlace: '请选择语言',
      modelPlace: '请选择模型',
      analyticMethodPlace: '请选择解析方法',
      pleasePlace: '请输入',
      pleaseChoose: '请选择',
      assetEditSuccess: '配置信息修改成功',
    },
    piece: '篇',
    file: '文档',
    name: '资产库名称',
    desc: '简介',
    language: '分词器',
    embeddedModel: '嵌入模型',
    analyticMethod: '文档解析器',
    fileChunkSize: '文件分块大小',
    configCategory: '文档类别',
    fileConfigCategory: '文档信息类别',
    supAddCategoris: '最多支持添加10个文档信息类别',
    fileNum: '文档数量',
    fileSize: '文档大小',
    creator: '创建人',
    uploadTime: '创建时间',
    importTaskList: '文件上传列表',
    exportTaskList: '导出任务列表',
    uploadIng: '上传中',
    uploadFailedNet: '上传失败，请检查网络',
    fileSuffiexNot: '文件后缀不符合要求，请检查文件',
    copySuccessFul: '复制成功',
    copyFailed: '复制失败',
    numberUpperLimit: '单次文档上传个数上限',
    sizeUpperLimit: '单次文档上传尺寸上限',
    assetEmptyText: '新建资产库',
    assetEmptyDesc: '暂无资产',
    assetFormat: '资产ID必须是一个正确的uuid格式',
  },
  assetFile: {
    docName: '文档名称',
    category: '类别',
    chunkSize: '分块大小',
    uploadTime: '上传时间',
    analyticStatus: '解析状态',
    parsingMethod: '解析方法',
    parsingComTime: '解析完成时间',
    analyticTip: '修改文件分块大小，文档会自动重新解析',
    contentView: '内容预览',
    baseInfo: '基本信息',
    message: {
      name: '请输入文档名称',
      docNameLen: '资产库名称长度1-15个字符',
    },
    status: {
      analyticIng: '解析中',
      analyticWaitIng: '等待解析',
      analyticFail: '解析失败',
      cancelAnalytic: '取消解析',
      analyticSucces: '解析成功',
    },
    open: '开启',
    close: '关闭',
    generateDataset: '生成数据集',
    documentInfo: '文档信息',
    log: '日志',
    contentPlaceholder: '请输入内容',
    placeholderFile: '请输入文档名称',
    generateTip: '只有【解析成功】状态的文档可以生成数据集！',
  },

  fileChunk: {
    parag: '段落',
    table: '表格',
    img: '图片',
    link: '链接',
    code: '代码',
    qa: '问答对',
  },
  dataset: {
    importDataset: '导入数据集',
    emptyText: '去生成数据集',
    emptyDesc: '暂无数据集信息，去文档管理生成一个吧！',
    placeholderDataset: '请输入数据集名称',
    placeInput: '请输入',
    datasetName: '数据集名称',
    datasetDesc: '数据集简介',
    dataCountLimit: '数据条目限制',
    datasetNum: '数据集条目',
    currentDataCount: '现有数据条目',
    isDataCleared: '是否进行数据清洗',
    isChunkRelated: '是否补全上下文',
    status: '状态',
    score: '数据集质量分数',
    createTime: '创建时间',
    creator: '创建人',
    finishedTime: '完成时间',
    taskStatus: {
      pending: '等待生成',
      running: '生成中',
      success: '生成完毕',
      failed: '生成失败',
      canceled: '取消生成',
    },
    testing: '评测',
    generate: '生成',
    stop: '暂停',
    yes: '是',
    no: '否',
    baseInfo: '基本信息',
    question: '问题',
    standardAnswer: '标准答案',
    chunk: '原始片段上下文',
    chunkType: '片段类型',
    sourceDoc: '来源文档',
  },
  testing: {
    createTesting: '新建评测',
    datasetUsed: '所用数据集',
    testingName: '测试名称',
    testingDesc: '简介',
    type: '模型类型',
    method: '检索方法',
    placeholderTest: '请输入评测名称',
    testingStatus: {
      pending: '等待测试',
      running: '测试中',
      success: '测试成功',
      failed: '测试失败',
      canceled: '取消测试',
    },
    evaluationQuality: '评估质量',
    testingScore: '综合评分',
    modelAnswer: '大模型的回答',
    retrievedSegments: '检索到的片段',
    accurateRate: '精确率',
    recallRate: '召回率',
    fidelity: '忠实值',
    interpretability: '可解释性',
    longestScore: '最长公共子串得分',
    editDistanceScore: '编辑距离得分',
    Jaccard: '杰卡徳相似系数',
    scoreY: '分数（分）',
    avg: '平均',
    testEmptyText: '去生成评测',
    testEmptyDesc: '暂无评测信息，去新建一个吧！',
    chartDomNotFound: '图标元素不存在',
  },
  model: {
    pleasePlace: '请输入',
    modelName: '模型名称',
    modelType: '模型类型',
    modelConfig: '模型配置',
    maxToken: '最大Token数',
    localModel: '本地模型',
    onlineModel: '在线模型',
    repeatTip: '请勿重复配置',
  },
  btnText: {
    confirm: '确定',
    cancel: '取消',
    operation: '操作',
    export: '导出',
    edit: '编辑',
    delete: '删除',
    batchDelete: '批量删除',
    batchExport: '批量导出',
    retry: '重试',
    restart: '重启',
    clearAll: '全部清空',
    homePage: '首页',
    assetDocList: '文档列表',
    configInfo: '配置信息',
    importFile: '导入文档',
    createAssetLibrary: '新建资产库',
    editAssetLibrary: '编辑资产库',
    batchImport: '导入资产库',
    batchOps: '批量操作',
    download: '下载',
    downloadAll: '下载全部',
    downloadChoose: '下载已选',
    batchDownload: '批量下载',
    downloadReport: '下载报告',
    all: '全部',
    chooseFile: '选择文件',
    batch: '批量',
    enable: '启用',
    close: '关闭',
    save: '保存',
    add: '添加',
    analytic: '解析',
    batchAnalytic: '批量解析',
    delAll: '删除全部',
    selectAll: '选择全部',
    reset: '重置',
    multiple: '多选',
    cancelMultiple: '取消多选',
    checkAll: '全选',
    selected: '已选{count}项',
    search: '搜索',
  },
  dialogTipText: {
    importAssetLibrary: '导入资产库',
    tipsText: '提示',
    isAddFilr: '是否继续添加文档',
    confirmDelAsset: '确定删除资产库',
    confirmDelFile: '确定删除文档',
    confirmDelSelected: '确定删除选择的文档吗',
    eidtFile: '文档编辑',
    confirmCancelAnalytic: '确认取消解析？点击确认后将停止解析，请谨慎操作。',
    fileZipFormat: '文件支持.zip格式，最多支持上传5个资产库，资产库总大小不超过5GB',
    fileAllFormat:
      '文件支持.xlsx,.pdf,.doc,.docx,.txt,.pptx,.html,.json,.yaml,.md,.zip,.jpeg,.png格式，最多支持上传128个文件，文件总大小不超过500MB',
    fileDataSetFormat:
      '文件支持xlsx、yaml和json格式导入，最多支持上传10个文件，每个文件包含的数据量不超过512条',
    continueAdd: '您仍可以通过拖拽文件到下方列表区域进行文件添加',
    dragDropAdd: '将文件拖到此处即可继续添加',
    dragFile: '将文件拖到此处',
    fileName: '文件名',
    fileSize: '大小',
    singleFileSize: '单个文件大小不能超过20MB',
    fileNums: '文件数',
    fileSizes: '文件大小',
    confirmDelDataset: '确定删除选择的数据集吗？',
    delDataset: '确定删除数据集',
    existConfirm: '当前数据集已有关联评测任务，是否新建一个评测任务？',
    confirmDelData: '确定删除选择的数据吗？',
    confirmDelSingleData: '确定删除此条数据吗？',
    stopTesting: '确定暂停测试？点击确定后将停止测试，请谨慎操作。',
    testDownloadTips: '只有【测试成功】的评测信息才可以下载！',
    consfirmDelTesting: '确定删除选择的测试数据吗？',
    confirmDelSingleTesting: '确定删除测试数据',
    confirmDelKL: '确定删除选择的资产库吗？',
  },
  formTipText: {
    analyticTip:
      '文档分块后，将分块转换为向量的向量化模型类型，先暂支持两种向量化模型bge-large-en（面向英文向量化场景）和bge-large-zh（面向中文向量化场景），默认情况下选择bge-large-zh模型。',
    fileChunkSizeTip:
      '配置文档上传后，将文件处理成片段分块的大小，分块大小范围为512-1024Token/块，默认使用1024Toke/块对文件进行分块。',
  },
  pageTipText: {
    NoData: '暂无数据',
    systemError: '系统出错',
    Loading: '加载中',
  },
  uploadText: {
    uploadFailed: '上传失败',
    uploadSuccess: '上传成功',
  },
  exportTask: {
    export: '导出任务',
    pendingExport: '待导出',
    exportFailed: '导出失败',
    exportSuccess: '导出成功',
    reason: '失败原因',
    downloadTask: '下载任务',
    canceled: '已取消',
  },
  opsMessage: {
    opsSuccess: '操作成功',
    opsRestart: '重启成功',
    opsCancel: '取消成功',
    opsAnalyticIng: '解析中',
    delSuccess: '删除成功',
    modifSuccess: '修改成功',
  },
  timerSearch: {
    lastHour: '最近 {timer} 小时',
  },
  copyright: '版权所有© 华为软件技术有限公司2024。保留一切权利',
};
