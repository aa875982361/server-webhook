/**
 * 客户端通过rpc 调用微服务
 */
import express from "express"
import bodyParser from "body-parser";
import * as path from "path"
import { handleWebHook } from "./handleFuncs";
// 端口
const port = "5001"
// 接口访问密码
const secretKey = process.env.WEBHOOK_KEY || ""
const app = express();
// 处理的请求id
let requestId = 0
// 全部项目的根路径
const rootRelativePath = process.env.WEBHOOK_ROOT_PATH ||  "../../"
// 项目绝对路径
const rootPath = rootRelativePath.indexOf("/") === 0 ? rootRelativePath : path.join(__dirname, rootRelativePath)
// 输出项目绝对路径名
console.log("rootPath", rootPath);


// 解析body的数据
app.use(bodyParser.json())
// 增加一个路由
app.all('/webhook/:project', async function(req, res){
    console.log("res.body", req.body);
    const currentRequestId = requestId++
    // 请求project名
    const projectName = req.params.project || ""
    // 如果没传这个字段
    if(!projectName){
        res.status(400).end("请传入项目名")
        return
    }
    // 存在秘钥就需要判断秘钥
    if(secretKey){
        // post 在body get 在query
        // const {}
        console.log("secretKey", secretKey);
    }
    // 具体项目路径
    const projectPath = path.join(rootPath, projectName)
    console.log("开始处理 currentRequestId ", currentRequestId, projectName);
    // 处理项目hook
    const { statusCode, data } = await handleWebHook(projectPath, projectName)
    let sendStr = data
    // 发送到客户端的数据
    if(data && typeof data === "object"){
        sendStr = JSON.stringify(data)
    }
    res.header("Content-Type", "application/json; charset=utf-8")
    res.status(statusCode).end(sendStr, "utf-8");
})

app.listen(port, () => {
    console.log("开始监听", port);
})
