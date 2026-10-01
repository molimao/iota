# IOTA 本地工具 / IOTA Local Tools

版本 / Version: 1.0.0 · 2026-10-01 · MIT

供 IOTA Train at Home 使用的独立社区脚本，不是官方客户端。
已在 Apple Silicon Mac、官方客户端 3.7.0 上使用；其他客户端版本未验证。
需要 `/usr/bin/python3` 为 Python 3.9 或更新版本，以及已安装的官方应用。
没有 Windows / Linux 版本，不包含第三方 Python 依赖。

## 安装与使用

1. 先将官方 IOTA Train at Home.app 安装到 `/Applications` 或自己的 `~/Applications`。
2. 完整解压 ZIP，保留 `install.py` 和 `runtime` 文件夹。
3. 双击「安装IOTA工具.command」。它会为当前用户安装文件，并注册登录后运行的后台守护。
4. 从 IOTA 菜单正常退出应用，再运行「IOTA优化启动.command」。如果没有开始训练，在官方应用里点击 Start training。
5. 运行「查看IOTA状态.command」。窗口每 60 秒刷新最近的守护结果；后台每 30 秒检查。

如果双击提示没有执行权限，在终端输入 `/bin/zsh `（末尾有一个空格），将对应 `.command` 文件拖进终端，按回车。也可先在终端运行 `chmod u+x `，拖入该文件并回车，再双击。

如 `/usr/bin/python3 --version` 不可用或低于 3.9，请先配置 Apple Command Line Tools 中的 Python；工具不会自动安装运行环境。

## 工作范围

- 优化启动使用仅监听 `127.0.0.1:18010` 的本地中继，最多等待 180 秒后连接真实矿工的 `127.0.0.1:8010` 服务。不会伪造健康响应。
- 状态取自本机官方日志和控制服务，不代表网页上的官方遥测已同步，也不保证收益。
- 连续三次本地异常才自动重启：五分钟启动宽限、十五分钟重启退避、每小时最多三次。
- 正常排队不会因位置长时间未更新而重启。正常退出和已记录的手动停止会保留。
- 不修改官方应用、签名或系统安全设置。不读取钱包文件，不上传状态到网站。
- 中继在本机转发官方控制请求，保留原认证信息，但不会记录请求地址、请求头、认证信息或载荷。

安装文件：`~/Library/Application Support/IOTA Local Guardian/`

登录服务：`~/Library/LaunchAgents/com.local.iota.guardian.plist`

## 停止、恢复与卸载

- 关闭状态窗口或 Ctrl+C：只停止查看。
- 「停止IOTA守护.command」：停止当前后台守护，不停止矿工；下次登录可能重新启用。
- 「启动IOTA守护.command」：再次加载后台守护。
- 要取消登录启动：先停止守护，再将上述 `com.local.iota.guardian.plist` 移到废纸篓。
- 要完整卸载：先停止守护，从官方菜单退出 IOTA，再将服务文件及 `IOTA Local Guardian` 文件夹移到废纸篓。重新登录后用官方入口启动即可恢复默认启动方式。

仅下载「查看IOTA状态.command」时，必须已安装完整工具包，否则它没有可读取的守护程序和状态文件。

## English

Independent community scripts for IOTA Train at Home. Tested on an Apple Silicon Mac with official client 3.7.0; other client versions are unverified. Requires the official app and Python 3.9+ at `/usr/bin/python3`. No Windows/Linux release or third-party Python packages.

Extract the entire ZIP, keep `install.py` and `runtime`, then run `安装IOTA工具.command` to install a per-user login guardian. Quit IOTA normally and run `IOTA优化启动.command`. Start training in the official app if needed. Run `查看IOTA状态.command` to display status every 60 seconds; the guardian checks every 30 seconds.

If executable permission is missing, type `/bin/zsh ` in Terminal, drag the command file into the window, and press Return. The status command alone requires the full toolkit to have been installed.

The loopback relay waits up to 180 seconds for the real miner service. It preserves authentication while forwarding locally, without logging requests or tokens. It does not modify the official app or security settings, read wallet files, or upload status. The guardian restarts only after three consecutive local failures, with a five-minute startup grace, fifteen-minute cooldown, and three restarts per hour. Normal queues and recorded manual stops do not trigger a restart.

Closing the status window only stops viewing. `停止IOTA守护.command` stops the current guardian; it may return at next login. To disable login startup, stop it and move `~/Library/LaunchAgents/com.local.iota.guardian.plist` to Trash. To uninstall fully, also quit IOTA normally and move `~/Library/Application Support/IOTA Local Guardian/` to Trash. After the next login, launch the official app normally.
