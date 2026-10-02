import { createContext, useContext } from "react";
import type { SiteLocale } from "@/lib/site";
import { localizeText } from "./localization";
export type Locale = SiteLocale;
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
  "收益和运行情况。": "Status and rewards.",
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
  整个矿场: "Network",
  全网训练: "Network training",
  进行中任务: "Active runs",
  在线矿工: "Slots",
  占用名额: "Slots",
  剩余名额: "Open slots",
  排查: "Check",
  个任务: "runs",
  你在: "You are in",
  全网名额: "Network slots",
  剩余: "open",
  台在训练: "training",
  矿工分布: "Where miners are: ",
  各任务: "Runs",
  已满: "Full",
  训练进度: "Training",
  损失: "Loss",
  段: "splits",
  档位: "Tier",
  名额: "Slots",
  官方面板: "Official dashboard",
  你的设备: "Yours",
  金额: "Amount",
  美元按公开市场价格估算: "USD is a public market estimate",
  "正在读取美元行情…": "Loading the USD market quote…",
  "美元行情暂不可用，收益仍按官方 IOTA 记账。":
    "USD quote is temporarily unavailable. Rewards still use official IOTA accounting.",
  "美元价格暂未获取，IOTA 数量仍按官方记账显示":
    "USD price is unavailable. IOTA amounts still use official accounting.",
  设备: "Devices",
  导入: "Import",
  导出备份: "Export backup",
  导入失败: "Import failed",
  文件读取失败: "Unable to read file",
  添加第一台设备: "Add the first device",
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
  "例如：书房电脑": "For example: Study Mac",
  "从 IOTA 应用复制完整 ID": "Copy the full ID from the IOTA app",
  保存设备: "Save device",
  取消: "Cancel",
  "保存中…": "Saving…",
  "移除中…": "Removing…",
  "导入中…": "Importing…",
  确认移除: "Confirm removal",
  设备已移除: "Device removed",
  "正在读取设备清单…": "Loading your device list…",
  "正在获取设备数据…": "Loading device data…",
  重试: "Try again",
  未获取: "Unavailable",
  设备状态: "Device status",
  收益记账: "Rewards",
  任务列表: "Runs",
  网络名额: "Network slots",
  矿工名单: "Miner lists",
  训练贡献: "Contribution",
  "累计 Token": "Cumulative tokens",
  最近轮次: "Latest epoch",
  贡献占比: "Contribution share",
  统计采样: "Sample time",
  累计记账: "Lifetime accounting",
  已支付: "Paid",
  最低支付金额: "Minimum payout",
  部分数据: "Partial data",
  全部: "All",
  状态为旧数据: "Cached status",
  收益为旧数据: "Cached rewards",
  全网部分数据未刷新: "Some network data could not refresh",
  "这个状态下暂无设备。": "No devices with this status.",
  查看全部设备: "Show all devices",
  "官方数据格式异常，已保留上次有效数据。":
    "Official data has an unexpected format. Keeping the last valid data.",
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
  吞吐量: "Throughput",
  旧数据: "Cached",
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
  官方在线: "Officially online",
  已开始训练: "Training started",
  是: "Yes",
  否: "No",
  还看不到: "Not yet",
  "依据官方最近一次采样，不是这台电脑的心跳。":
    "From the latest official sample, not a heartbeat from this computer.",
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
  请求超时: "Request timed out",
  请求排队超时: "Request queued too long",
  读取响应超时: "Timed out reading the response",
  状态刷新超时: "Status refresh timed out",
  收益刷新超时: "Rewards refresh timed out",
  "刷新超时，已停止等待。请稍后再试。": "Refresh timed out. Try again in a moment.",
  刷新失败: "Refresh failed",
  本次未在时限内读完官方名单: "Could not finish reading official lists in time",
  "本次未在时限内读完全部训练任务名单，已返回当前已找到的设备":
    "Could not finish every run list in time. Showing devices already found.",
  "上游返回的不是有效 JSON（可能被中间层拦截）": "Official API did not return valid JSON",
  未知错误: "Unknown error",
  市场价格暂不可用: "Market price is unavailable",
  找不到这台设备: "That device is not on the list",
  "文件不是有效的 JSON": "That file is not valid JSON",
  文件格式不符合导入要求: "That file is not in the import format",
  "本地保存的设备清单格式损坏，已忽略。可以重新添加或导入备份。":
    "The saved device list was damaged and was ignored. Add the devices again or import a backup.",
  "本地保存的设备清单不符合格式要求，已忽略。":
    "The saved device list was not valid and was ignored.",
  "此浏览器不允许本地存储，设备清单无法保存。":
    "This browser blocked local storage, so the list could not be saved.",
  "读取本地设备清单失败。": "Could not read the local device list.",
  "此浏览器不允许本地存储，改动无法保存。":
    "This browser blocked local storage, so the change could not be saved.",
  "浏览器存储空间已满，改动没能保存。":
    "Browser storage is full, so the change could not be saved.",
  "写入本地存储失败，改动没能保存（可能处于隐私模式）。":
    "Could not write to browser storage. You may be in private mode.",
  "浏览器未能保存，请检查存储权限。": "Could not save. Check this browser’s storage permission.",
  "浏览器未能保存导入清单。": "Could not save the imported list.",
  "单次最多查询 200 台设备，请分批查询": "You can look up 200 devices at a time. Split the list.",
  非法的训练任务编号: "That training run id is not valid",
  "非法的 Miner ID": "That Miner ID is not valid",
  "格式不对：含有无效字符": "Invalid characters in that Miner ID",
  "长度不对：应为 48 位左右的 SS58 地址": "Length looks wrong. A Miner ID is about 48 characters.",
  "校验失败：请检查是否有漏字或错字": "Checksum failed. Check for a missing or mistyped character.",
  "网络前缀不对：需要通用网络 42 的地址": "Wrong network prefix. Use a generic network 42 address.",
};

const PREFIXES: Array<[string, string]> = [
  ["训练任务列表：", "Runs list: "],
  ["默认矿工名单：", "Default miner list: "],
  ["状态连接失败：", "Could not load status: "],
  ["收益连接失败：", "Could not load rewards: "],
];

function translatePiece(text: string): string {
  if (EN[text]) return EN[text];
  const task = text.match(/^任务 (.+)：(.+)$/);
  if (task) return `Run ${task[1]}: ${translatePiece(task[2]!)}`;
  const reward = text.match(/^收益 (.+)：(.+)$/);
  if (reward) return `Rewards ${reward[1]}: ${translatePiece(reward[2]!)}`;
  const blocked = text.match(/^上游拒绝访问（HTTP (\d+)，可能是 Cloudflare 拦截）：(.*)$/);
  if (blocked) return `Official API blocked (HTTP ${blocked[1]}): ${blocked[2]}`;
  const http = text.match(/^上游返回 HTTP (\d+)：(.*)$/);
  if (http) return `Official API returned HTTP ${http[1]}: ${http[2]}`;
  const quote = text.match(/^(.+): 无有效 SN9 报价$/);
  if (quote) return `${quote[1]}: no usable SN9 price`;
  for (const [zh, en] of PREFIXES) {
    if (text.startsWith(zh)) return `${en}${translatePiece(text.slice(zh.length))}`;
  }
  return /[\u4e00-\u9fff]/.test(text) ? "Something went wrong. Try again." : text;
}

export function localizeMessage(text: string, locale: Locale): string {
  if (!text || locale === "zh") return text;
  if (locale === "zh-TW") return localizeText(text, locale);
  return text
    .split("；")
    .map((part) => localizeText(translatePiece(part.trim()), locale))
    .join(locale === "ja" ? "；" : "; ");
}

export function useLocale() {
  const locale = useContext(LocaleContext);
  return {
    locale,
    en: locale !== "zh" && locale !== "zh-TW",
    t: (s: string) => localizeMessage(s, locale),
  };
}
