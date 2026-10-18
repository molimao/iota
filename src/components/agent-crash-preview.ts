// Local screenshot fixture: real model output from synthetic logs, never a customer incident.
import { groundLogAnalysis, savedAnalysis } from "@/lib/log-analysis";
const raw = {
  "summary": "日志显示P2P读取超时后，Rust代码因缺少本地CID状态触发panic，导致进程被SIGABRT终止。GPU内存占用高但未报OOM，非内存压力所致。",
  "confidence": "high",
  "findings": [
    {
      "title": "P2P超时与Rust Panic序列",
      "explanation": "第1行记录P2P读取超时，紧接着第2行Rust panic提示缺少本地CID状态。此序列表明网络通信失败可能触发了软件内部的状态检查失败，导致程序主动中止。",
      "lines": [
        1,
        2
      ]
    },
    {
      "title": "SIGABRT终止原因",
      "explanation": "第3行显示进程以SIGABRT退出。在Rust环境中，这通常由未捕获的panic引起，而非非法内存访问或OOM。这是程序对前述错误的响应。",
      "lines": [
        3
      ]
    },
    {
      "title": "GPU内存状态",
      "explanation": "第4行显示GPU内存使用率为86.7%，但未出现显式的OOM错误。高内存使用本身不是崩溃的直接证据，且无OOM报错，故排除内存压力导致。",
      "lines": [
        4
      ]
    }
  ],
  "nextSteps": [
    "保存第1-3行的完整日志及崩溃报告，用于后续问题追踪。",
    "检查并更新IOTA官方应用程序至最新版本，以修复可能的网络或状态处理Bug。",
    "尝试受控重启训练进程，观察是否复现相同的P2P超时及panic序列。",
    "若问题持续，请将包含第1-3行日志的完整日志提交至官方项目Issue。",
    "注意：重启将中断当前训练进度，请确保已保存必要的工作状态。",
    "避免尝试修改Rust内部参数或初始化CID，这可能导致更严重的状态不一致。"
  ],
  "unknowns": [
    "P2P超时的根本网络原因（如防火墙、节点不可用或网络波动）。",
    "“缺少本地CID状态”的具体软件逻辑缺陷或触发条件。",
    "该问题是否仅在特定网络环境下出现，还是普遍存在。",
    "官方是否有针对此特定panic的已知补丁或版本说明。",
    "GPU高内存使用是否与当前任务规模匹配，是否存在其他资源瓶颈。"
  ],
  "evidence": [
    {
      "line": 1,
      "text": "[2026-10-18 10:00:00.000] P2P read timeout"
    },
    {
      "line": 2,
      "text": "[2026-10-18 10:00:01.000] Rust panic: missing local CID state for path=0"
    },
    {
      "line": 3,
      "text": "[2026-10-18 10:00:02.000] Training process exited with code=null signal=SIGABRT"
    },
    {
      "line": 4,
      "text": "[2026-10-18 10:00:03.000] GPU memory 10.66GB / 12.30GB; no explicit out-of-memory error"
    }
  ]
};
export const crashPreviewResult = savedAnalysis.parse({
  ...groundLogAnalysis({...raw,confidence:"high"},raw.evidence.map(e=>e.text),"zh"),
  locale:"zh",evidence:raw.evidence,
});
