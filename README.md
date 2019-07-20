# blog-front-vue

## 初始化
```
npm install
```

### 开发环境
```
npm run serve
```

### 打包编译
```
npm run build
```

### 单元测试
```
npm run test
```

### 代码规范检查
```
npm run lint
```

### 服务端部署
```
npm install -g pm2

npm run start
```

### 打包(包含build，且压缩为zip包)
```
npm run pack
```

### 部署（执行部署前，需先行执行打包`npm run pack`）    
```
npm run deploy
```

### 一件打包部署发布（集成打包，上传包， 部署包）
```
npm run publish
```

### 备注
> 打包生成的zip包名中的projectname version使用的是server/package.json中的字段
> 根目录下的package.json中的version主要用于前端版本管理和部署版本无关联
