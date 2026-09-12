import { createContext, useContext } from "react";
export type Locale = "en" | "zh";
export const LocaleContext = createContext<Locale>("zh");
const EN: Record<string, string> = {
  我的设备: "My devices",
  "香港时间今日 00:00 起的已记账收益": "Accounted rewards since midnight in Hong Kong (UTC+8)",
  所有已添加设备的累计记账收益: "Lifetime accounted rewards across your saved devices",
  刷新中: "Refreshing",
  立即刷新: "Refresh now",
  添加设备: "Add device",
  "用 Google 登录": "Sign in with Google",
  正在登录: "Signing in",
  退出登录: "Sign out",
  "收益和运行情况，一眼看清。": "Your devices. One clear view.",
  "台设备 · ID 保存在当前浏览器": "devices · IDs saved in this browser",
  "台设备 · 已绑定到 Google 账号": "devices · bound to your Google account",
  "台设备 · 未登录保存在此浏览器，登录后最多 10 台并可换设备查看":
    "devices · saved in this browser. Sign in to keep up to 10 and use them on other devices",
  "设备已绑定到你的账号。": "Device bound to your account.",
  "登录未完成，请重试。": "Sign-in did not finish. Try again.",
  "读取账号设备清单失败，请稍后重试。": "Could not load your account list. Try again later.",
  "每个账号最多绑定 10 台设备，更多暂不支持。": "Each account can keep up to 10 devices for now.",
  "未登录最多保存 3 台设备，登录后可绑定 10 台。":
    "Without signing in you can keep 3 devices here. Sign in to bind up to 10.",
  "保存到账号失败，请稍后重试。": "Could not save to your account. Try again later.",
  请填写设备名称: "Enter a device name",
  "设备名称最多 40 个字": "Device names can be up to 40 characters",
  "Miner ID 无效": "That Miner ID is not valid",
  "这个 Miner ID 已经添加过了": "This Miner ID is already on the list",
  "改名失败，请稍后重试。": "Could not rename the device. Try again later.",
  "移除失败，请稍后重试。": "Could not remove the device. Try again later.",
  "请填写 Miner ID": "Enter a Miner ID",
  "仅查询公开数据。登录后清单绑定账号；退出后此浏览器仍保留未登录时的本地副本。":
    "Public data only. Signed-in lists stay on your account. After sign-out this browser still keeps the local copy from before you signed in.",
  "仅查询公开数据；未登录时清理浏览器数据会移除本地清单，请先导出备份。":
    "Public data only. Without signing in, clearing browser data removes the local list — export a backup first.",
  最近获取: "Last fetched",
  关闭提示: "Dismiss",
  "正在连接，先显示浏览器保存的旧数据。": "Connecting. Showing the last browser-cached data.",
  "旧数据会保留，连接恢复后自动更新。":
    "Previous data is kept and updates when the connection recovers.",
  今日总收益: "Today’s rewards",
  累计总收益: "Lifetime rewards",
  金额: "Amount",
  美元按公开市场价格估算: "USD is a public market estimate",
  "美元价格暂未获取，IOTA 数量仍按官方记账显示":
    "USD price is unavailable. IOTA amounts still use official accounting.",
  设备: "Devices",
  导入: "Import",
  导出备份: "Export backup",
  导入失败: "Import failed",
  文件读取失败: "Unable to read file",
  把你的第一台设备加进来: "Add your first device",
  "打开 IOTA 应用，复制 Miner 页面里的 Miner ID。":
    "Open the IOTA app and copy the Miner ID from the Miner page.",
  今日收益: "Today",
  累计收益: "Lifetime",
  "收益为旧数据 · IOTA": "Cached rewards · IOTA",
  "IOTA · 子网代币": "IOTA · Subnet token",
  查看详情: "View details",
  "每 5 秒检查更新；官方状态缓存 60 秒，收益缓存 5 分钟。支持手动刷新。":
    "Checks every 5 seconds. Status cache: 60 seconds. Rewards cache: 5 minutes. Manual refresh available.",
  "仅查询公开数据；清理浏览器数据会移除设备清单，请先导出备份。":
    "Public data only. Export a backup before clearing browser storage.",
  "填写公开的 Miner ID，不需要私钥或助记词。":
    "Enter your public Miner ID. No private key or seed phrase needed.",
  "设备已保存到此浏览器。": "Device saved in this browser.",
  保存失败: "Could not save",
  设备名称: "Device name",
  "例如：家里的 Mac": "For example: Home Mac",
  "从 IOTA 应用复制完整 ID": "Copy the full ID from the IOTA app",
  保存设备: "Save device",
  "Miner ID 已复制": "Miner ID copied",
  "复制失败，请展开技术信息手动复制。":
    "Copy failed. Expand technical details and copy the ID manually.",
  "复制 ID": "Copy ID",
  名称已保存: "Name saved",
  改名: "Rename",
  移除设备: "Remove device",
  运行情况: "Overview",
  训练记录: "Training history",
  收益记录: "Reward history",
  激活处理量: "Activations",
  "吞吐量（官方上报）": "Throughput (reported)",
  "今日收益 · IOTA": "Today · IOTA",
  "累计收益 · IOTA": "Lifetime · IOTA",
  "统计采样：": "Statistics sample:",
  "。采样时间不是本机心跳。": ". Sample time is not a device heartbeat.",
  技术信息: "Technical details",
  训练任务: "Run",
  尚未找到: "Not found",
  负责的模型分区: "Model partition",
  "正在获取最近一周训练记录…": "Loading the last week of training records…",
  "训练记录获取失败，请稍后重试。": "Could not load training history. Try again later.",
  轮次: "Epoch",
  "训练 Token": "Training tokens",
  激活排名: "Activation rank",
  "暂无可用的训练记录。": "No training records available.",
  "收益刷新失败，以下可能为旧记录。": "Reward refresh failed. Records below may be old.",
  记账时间: "Accounting time",
  状态: "Status",
  待结算: "Pending",
  已结算: "Settled",
  冻结: "Frozen",
  "暂无收益记录。": "No reward records available.",
  有贡献: "Contributing",
  等待任务: "Waiting",
  需检查: "Check device",
  待确认: "Unknown",
  有训练贡献: "Contributing",
  在线待任务: "Waiting for tasks",
  暂未参与: "Not participating",
  刷新中断: "Refresh interrupted",
  "官方最近一次统计显示该设备正在处理训练任务（为上报数据，不代表此刻一定在算）。":
    "The latest official sample reports training activity. This is not a live guarantee of computation.",
  "官方统计显示设备在线，但最近一次采样没有处理量，通常是在等待分配任务。":
    "The device is reported active with no throughput in the latest sample; it may be waiting for tasks.",
  "官方统计显示该设备当前未参与训练，这不等于设备已离线或出错。":
    "The device is not reported as participating. This does not prove it is offline or broken.",
  "已成功读取全部进行中的训练任务名单，其中没有这个 Miner ID。请核对 ID 是否正确。":
    "This ID was not found in the fetched active run lists. Check that you copied the correct ID.",
  "部分训练任务名单本次没读取成功，覆盖不完整，暂时无法判断，不代表设备有问题。":
    "Some run lists could not be fetched. Incomplete coverage does not mean your device has a problem.",
  "超过 5 分钟没有成功获取官方数据，下面显示的是上一次成功读取的内容。":
    "No successful fetch for more than five minutes. Showing previously fetched data.",
};
export function useLocale() {
  const locale = useContext(LocaleContext);
  return {
    locale,
    en: locale === "en",
    t: (s: string) =>
      locale === "en"
        ? (EN[s] ??
          (/[^\x00-\x7F]/.test(s) && /[\u4e00-\u9fff]/.test(s)
            ? "The request could not be completed. Check the ID, browser storage, or connection and try again."
            : s))
        : s,
  };
}
