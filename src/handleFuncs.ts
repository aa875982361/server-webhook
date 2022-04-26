
/**
 * 处理结果
 */
export interface HandleResult {
    statusCode: number,
    data: any
}
/**
 * 调用webhook的方法
 * @param projectPath 项目名
 * @returns 返回状态
 */
export async function handleWebHook(projectPath: string): Promise<HandleResult> {
    console.log("projectPath", projectPath);
    
    let res = {
        statusCode: 200,
        data: "success"
    }
    return res
}