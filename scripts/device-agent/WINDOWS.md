# Windows Agent

Windows 10 / 11。使用运行矿工的同一个 Windows 用户安装，需要 [Python 3.11 或更新版本](https://www.python.org/downloads/windows/)。

1. 在 IOTA Watch 的「我的设备」添加这台电脑，并给它关联 BNT 或 PRL 的**钱包和 Worker 名称**。两种矿都在这台电脑上时，把两组 Worker 加到同一设备。
2. 在「连接设备」选中它并生成配对码。
3. 解压下载包，双击 `Install.cmd`，粘贴配对码并按回车。输入时配对码隐藏。Agent 会立即启动，并在当前 Windows 用户登录时启动。

## 采集

- **BNT**：识别 Seine 的钱包和 Worker。若正在运行的 Seine 已打开本机 API，Agent 用它读取会话算力与份额；网站也保留独立的矿池数据。
- **PRL**：识别 OneZeroMiner、prlminer 和 redPeaRL 的钱包与 Worker。矿池算力来自已关联的 Worker。redPeaRL 有新鲜的本地状态行时，另显示本机算力。
- **XDS**：识别 `discreted.exe`，从它的日志读带时间戳的独挖算力。自定义日志路径可在命令提示符手动指定。

```cmd
py -3 "%LOCALAPPDATA%\IOTA Watch Agent\windows_agent.py" configure-xds "D:\Mining\Discrete\discreted.log"
```

Agent 只发送结构化数据。它不会上传矿工日志、命令行或矿工 API 密钥，也不会启停矿工。

在命令提示符查看本机识别结果，或移除本机 Agent 的配置和登录启动项：

```cmd
py -3 "%LOCALAPPDATA%\IOTA Watch Agent\windows_agent.py" check
py -3 "%LOCALAPPDATA%\IOTA Watch Agent\windows_agent.py" uninstall
```

卸载后可以在网站的设备管理中断开配对。
