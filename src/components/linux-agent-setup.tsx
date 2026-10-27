import { localized as l } from '@/lib/product-discovery';
import { useLocale } from './site/locale';
export function LinuxAgentSetup(){
 const {locale}=useLocale();
 return <details className="compute-panel"><summary>Linux GPU Agent</summary>
 <p>{l(['选择下方已有的 IOTA 设备生成配对码；在 Linux 运行配对命令，然后启动只读监控。不会重启矿工。','選擇下方已有的 IOTA 設備產生配對碼；在 Linux 配對並啟動唯讀監控，不會重啟礦工。','Generate a pairing code for your IOTA device below, then pair and start the read-only monitor on Linux. Miners keep running.','아래 IOTA 기기의 페어링 코드를 생성하고 Linux 읽기 전용 모니터를 실행하세요. 채굴기는 재시작하지 않습니다.','下のIOTA端末で接続コードを作成し、Linuxでペアリングして監視を開始します。マイナーは再起動しません。'])[locale]}</p>
 <a href="/downloads/iota-watch-linux-1.0.15.zip" download>{l(['下载 Linux Agent 与说明','下載 Linux Agent 與說明','Download Linux agent and instructions','Linux 에이전트 및 안내 다운로드','Linuxエージェントと手順をダウンロード'])[locale]} ↗</a>
 </details>;
}
