#!/usr/bin/sh
# 读取package.json信息
function getJsonkey() {
    local json=$1
    local key=$2
    # 类似这种类型中 $json | awk 变量$json在bash中不会替换为响应的变量值，而是会以command执行
    # 需使用 awk <<< "$json" 这种格式代替
    jsonValue=`awk -F '\"'$key'\"' '{print $2}' <<< "$json" | awk -F ',' '{print $1}' | awk -F ':' '{print $2}' | awk -F '\"' '{print $2}' | awk '$1=$1'`
}
json=$(cat ./package.json)
getJsonkey "$json" "name"
projectname=$jsonValue

serverConf=$(cat ./server.config.js)
port=$(grep "port:" <<< $serverConf | awk -F 'port:' '{print $2}' | awk -F '}' '{print $1}' | awk -F ',' '{print $1}' | awk '$1=$1')
appName=$projectname-$port
pid=$(pm2 pid "$appName")
pidLine=$(pm2 pid "$appName" | wc -w)
# 如果不存在pid，则是第一次部署，执行pm2启动命令
if [ "$pidLine" -eq 0 ] 
    then echo "第一次部署，执行intall,pm2启动..."
         npm install
         pm2 start server.js --name="$appName" --watch --ignore-watch="node_modules"
         # 保存
         pm2 save
else
    echo "已存在项目全量更新："
    echo "appName: "$appName"   pid: "$pid"    port: "$port
fi
pm2 list "$appName"
echo "################## 部署成功 ##################"