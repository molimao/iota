import { localizeValue } from "@/components/site/localization";
import { Download, ArrowUpRight, Monitor, Terminal, RefreshCw } from "lucide-react";
import { useLocale } from "./locale";
import release from "@/lib/local-tools-release.json";

const sourceUrl = "https://github.com/molimao/iota/tree/main/tools/iota-local";

export function DownloadsPage() {
  const { locale, en } = useLocale();
  const features = localizeValue(
    en
      ? ([
          [
            Monitor,
            "Local status",
            "Queue position, control connection and recent training activity. The status window refreshes every 60 seconds.",
          ],
          [
            Terminal,
            "Startup connection",
            "A loopback relay waits up to 180 seconds for the real miner service, keeping the official app intact.",
          ],
          [
            RefreshCw,
            "Background guardian",
            "Checks every 30 seconds. Restarts after three consecutive local failures; normal queues are left running.",
          ],
        ] as const)
      : ([
          [Monitor, "查看本机状态", "显示排队位置、控制连接和最近训练活动，查看窗口每 60 秒刷新。"],
          [
            Terminal,
            "优化启动连接",
            "通过本机中继等待真实矿工服务就绪，最多等待 180 秒，保留官方应用原文件。",
          ],
          [RefreshCw, "异常守护", "每 30 秒检查，连续三次本地异常才自动重启；正常排队不重启。"],
        ] as const),
    locale,
  );
  const steps = localizeValue(
    en
      ? [
          [
            "Install the official app",
            "Place IOTA Train at Home.app in Applications. Requires Python 3.9+ at /usr/bin/python3.",
          ],
          [
            "Extract and install the full toolkit",
            "Keep install.py and the runtime folder. Run 安装IOTA工具.command; this installs a per-user guardian that starts at login.",
          ],
          [
            "Use the startup command",
            "Quit IOTA normally, then run IOTA优化启动.command. Click Start training in the official app if needed.",
          ],
          [
            "Open the status window",
            "Run 查看IOTA状态.command. Ctrl+C or closing this window only stops viewing; the guardian keeps running.",
          ],
        ]
      : [
          [
            "先安装官方应用",
            "将 IOTA Train at Home.app 放入“应用程序”。需要 /usr/bin/python3 为 Python 3.9 或更新版本。",
          ],
          [
            "完整解压，再安装工具",
            "保留 install.py 和 runtime 文件夹，运行“安装IOTA工具.command”。安装会启用当前用户登录后运行的后台守护。",
          ],
          [
            "使用优化启动入口",
            "从 IOTA 菜单正常退出，再运行“IOTA优化启动.command”。如未开始训练，在官方应用中点击 Start training。",
          ],
          [
            "打开状态窗口",
            "运行“查看IOTA状态.command”。按 Ctrl+C 或关闭窗口只停止查看，后台守护继续运行。",
          ],
        ],
    locale,
  );
  return (
    <article className="article-page downloads-page">
      <a className="back-link" href={`/${locale}`}>
        ← {localizeValue(en ? "Home" : "首页", locale)}
      </a>
      <span className="eyebrow">{localizeValue(en ? "DOWNLOADS" : "工具下载", locale)}</span>
      <h1>{localizeValue(en ? "IOTA local tools" : "IOTA 本地工具", locale)}</h1>
      <p className="article-lead">
        {localizeValue(
          en
            ? "View local queue and training status, and handle slow miner startup connections."
            : "查看本机排队与训练状态，处理矿工启动连接超时。",
          locale,
        )}
      </p>

      <section className="tool-download-card" aria-labelledby="tool-release-title">
        <div>
          <div className="tool-release-meta">
            <span>macOS · Apple Silicon</span>
            <span>
              v{release.version} · {release.date}
            </span>
          </div>
          <h2 id="tool-release-title">
            {localizeValue(en ? "Complete toolkit" : "完整工具包", locale)}
          </h2>
          <p>
            {localizeValue(
              en
                ? "Includes installer, startup relay, status viewer, guardian and source code. No official app or account data included."
                : "包含安装器、优化启动、状态查看、后台守护和源码。不包含官方应用或账号数据。",
              locale,
            )}
          </p>
          <p className="tool-install-note">
            {localizeValue(
              en
                ? "Installation enables a login guardian with automatic restarts on local failures."
                : "安装后会启用登录启动与异常自动重启。",
              locale,
            )}
          </p>
        </div>
        <div className="tool-download-actions">
          <a className="site-button" href={`/downloads/${release.filename}`} download>
            <Download size={18} />
            {localizeValue(en ? "Download ZIP" : "下载 ZIP", locale)}
          </a>
          <span>ZIP · {(release.bytes / 1024).toFixed(1)} KB · MIT</span>
          <a className="tool-source-link" href={sourceUrl} target="_blank" rel="noreferrer">
            {localizeValue(en ? "View source" : "查看源码", locale)}
            <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
      <p className="tool-compatibility">
        {localizeValue(
          en
            ? "Independent community scripts. Used with official client 3.7.0 on an Apple Silicon Mac; other versions are unverified. No Windows/Linux release."
            : "独立社区脚本。已在 Apple Silicon Mac、官方客户端 3.7.0 上使用；其他版本未验证，暂不提供 Windows / Linux 版。",
          locale,
        )}
      </p>
      <div className="tool-features">
        {features.map(([Icon, title, text]) => (
          <section key={title}>
            <Icon size={20} aria-hidden="true" />
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>

      <section className="tool-instructions">
        <h2>{localizeValue(en ? "Install and use" : "安装与使用", locale)}</h2>
        <ol>
          {steps.map(([title, text]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <details>
          <summary>
            {localizeValue(
              en ? "The command file cannot be opened" : "脚本提示没有执行权限",
              locale,
            )}
          </summary>
          <p>
            {localizeValue(
              en
                ? "In Terminal, type /bin/zsh followed by a space, drag the .command file into the window, then press Return. Keep the entire toolkit together."
                : "打开终端，输入 /bin/zsh 和一个空格，把对应 .command 文件拖进终端，再按回车。请保留完整工具包。",
              locale,
            )}
          </p>
          <p>
            {localizeValue(
              en
                ? "If /usr/bin/python3 --version is unavailable or below 3.9, configure Python through Apple Command Line Tools first. No runtime is installed automatically."
                : "若 /usr/bin/python3 --version 不可用或低于 3.9，请先配置 Apple Command Line Tools 中的 Python。本工具不会自动安装运行环境。",
              locale,
            )}
          </p>
        </details>
      </section>
      <section className="tool-instructions">
        <h2>{localizeValue(en ? "Stop or uninstall" : "停止与卸载", locale)}</h2>
        <p>
          {localizeValue(
            en
              ? "停止IOTA守护.command stops the current guardian and leaves the miner running. It may return at the next login. 启动IOTA守护.command loads it again."
              : "“停止IOTA守护.command”只停止当前守护，不停止矿工；下次登录可能重新启用。“启动IOTA守护.command”可恢复守护。",
            locale,
          )}
        </p>
        <p>
          {localizeValue(
            en
              ? "To disable login startup, stop the guardian, then move this service file to Trash:"
              : "要取消登录启动，先停止守护，再将以下服务文件移到废纸篓：",
            locale,
          )}
        </p>
        <code>~/Library/LaunchAgents/com.local.iota.guardian.plist</code>
        <p>
          {localizeValue(
            en
              ? "To uninstall fully, also quit IOTA normally and move this folder to Trash. After the next login, launch IOTA from its official entry point."
              : "要完整卸载，再从菜单正常退出 IOTA，并将以下文件夹移到废纸篓。重新登录后，用官方入口启动 IOTA：",
            locale,
          )}
        </p>
        <code>~/Library/Application Support/IOTA Local Guardian/</code>
      </section>
      <section className="tool-instructions tool-files">
        <h2>{localizeValue(en ? "Files and verification" : "文件与校验", locale)}</h2>
        <p>
          <a href="/downloads/iota-status.command" download>
            {localizeValue(en ? "Download status command only" : "单独下载查看状态脚本", locale)}
          </a>{" "}
          —{" "}
          {localizeValue(
            en ? "Requires the complete toolkit to be installed first." : "需要先安装完整工具包。",
            locale,
          )}
        </p>
        <details>
          <summary>SHA-256</summary>
          <code>{release.sha256}</code>
        </details>
        <p>
          {localizeValue(
            en
              ? "The scripts read local logs and forward local control requests without recording authentication tokens. They do not modify the official app or security settings, read wallet files, or upload status to this website. Local status is separate from official online telemetry."
              : "脚本读取本机日志并转发本机控制请求，不记录认证信息；不修改官方应用或系统保护设置，不读取钱包文件，不向网站上传状态。本机状态与网页官方遥测是不同数据来源。",
            locale,
          )}
        </p>
      </section>
    </article>
  );
}
