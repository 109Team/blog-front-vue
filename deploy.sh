#!usr/bin/sh
echo "################## 读取配置文件... ##################"
# 读取配置函数
function getConfig() {
    conf=$1
    key=$2
    confValue=$(grep "$key" <<< "$conf" | awk -F '=' '{print $2}')
}

# 读取package.json信息
function getJsonkey() {
    local json=$1
    local key=$2
    # 类似这种类型中 $json | awk 变量$json在bash中不会替换为响应的变量值，而是会以command执行
    # 需使用 awk <<< "$json" 这种格式代替
    jsonValue=`awk -F '\"'$key'\"' '{print $2}' <<< "$json" | awk -F ',' '{print $1}' | awk -F ':' '{print $2}' | awk -F '\"' '{print $2}' | awk '$1=$1'`
}

# 读取配置文件
_configPath="./.deploy.conf"
if [ $(find "$_configPath" | wc -w) -gt 0 ]
    then _config=$(cat "$_configPath")
else 
    echo ".deploy.conf文件不存在，需要手动输入数据"
    _config=""
fi

# 如果没有配置文件提示输入响应的信息 响应的部署路径使用默认配置
if [ -z "$_config" ]
    then echo "请输入要部署的服务器地址: ex: user@172.***.***.***"
         read remoteAddress
else
    getConfig "$_config" "remoteAddress"
    remoteAddress=$confValue
    getConfig "$_config" "deployPath"
    deployPath=$confValue
fi

echo $deployPath
echo $remoteAddress
# 判断输入的合法性
# (2(5[0-5]|[0-4]\d))匹配200-255段  [0-1]?\d\{1,2\} 匹配0-199段 
reg=$(grep '[A-Za-z0-9\-_\.]\+@\(\(2\(5[0-5]\|[0-4]\d\)\)\|[0-1]\?\d\{1,2\}\)\(\.\(\(2\(5[0-5]\|[0-4]\d\)\)\|[0-1]\?\d\{1,2\}\)\)\{3\}'  <<< "$remoteAddress")
if [ -n "$reg" ]
    then echo "服务器地址: $remoteAddress"
else
    echo "请输入正确的服务器地址!"
    exit 0
fi

# 如果没有配置deployPath，则设置默认部署路径
if [ -z "$deployPath" ]
    then deployPath="/home/Hopen/website"
fi

# 获取项目名称和版本信息，用于匹配要发布的包
dirname=$(pwd)
json=$(cat ./server/package.json)
getJsonkey "$json" "version"
version=$jsonValue
getJsonkey "$json" "name"
projectname=$jsonValue

# 要发布的包名
echo "################## 查找要上传的包... ##################"
deployPackage=$(find $dirname/$projectname-$version-*.zip)

zipName=`awk -F ''$dirname/'' '{print $2}' <<< "$deployPackage"`
echo $zipName

# 拷贝目录文件到服务器
echo "################## 上传文件... ##################"
deployPackagePath=$remoteAddress:$deployPath/package

# 如果遇到Permission denied 请设置服务端文件夹$deployPackagePath的目录权限为可写
scp "$deployPackage" "$deployPackagePath"


# 远程登陆并部署
echo "################## 远程登陆并部署... ##################"
ssh "$remoteAddress" << remotessh
cd $deployPath/package
unzip -o $zipName -d ../$projectname
cd ../$projectname/server

# 暂停8秒，等待pm2重启， 已获得最新的PID
echo "################## 等待重启中... ##################"
sleep 8
sh ./deploy-remotessh.sh
remotessh