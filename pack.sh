#!usr/bin/sh
# 读取package.json信息
function getJsonkey() {
    local json=$1
    local key=$2
    # 类似这种类型中 $json | awk 变量$json在bash中不会替换为响应的变量值，而是会以command执行
    # 需使用 awk <<< "$json" 这种格式代替
    value=`awk -F '\"'$key'\"' '{print $2}' <<< "$json" | awk -F ',' '{print $1}' | awk -F ':' '{print $2}' | awk -F '\"' '{print $2}' | awk '$1=$1'`
}

# 设置pack变量
echo "################## 设置pack变量... ##################"
json=$(cat ./package.json)
getJsonkey "$json" "version"
version=$value
getJsonkey "$json" "name"
projectname=$value
now=$(date "+%Y%m%d%H%M%S")
dirname=$(pwd)
packpath=$dirname/$projectname"-*.zip"
packname=$projectname-$version-$now.zip
echo "项目名称: $projectname"
echo "版本号:   $version"

# 编译构建
echo "#################### 编译构建... ####################"
# npm run build

# 打包zip
echo "#################### 打包zip... ####################"
# 如果存在之前打包的文件则删除
finds=$(find $packpath | wc -w)
if [ $finds -gt 0 ]
    then    echo "发现有之前的包 准备删除"
            rm -rf $packpath
            echo "已删除 $packpath"
fi
zip -r $packname server
echo "#################### 打包完成 ####################"
echo "包名称: $packname"
exit