<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## 生产发布确认（2026-10-03 用户明确要求）

- 所有生产发布必须先说明当次发布的具体改动、目标和验证结果，并获得用户对当次发布的明确确认后才能执行。
- 上线、重新发布、热修复、回滚和生产配置上线均适用；不得沿用历史授权，不得将“继续”“优化”“加上这个”等开发请求视为发布确认。
- 本地开发、测试和预览可以继续；确认前不得调用生产部署工具。若推送、合并或其他动作会自动发布生产，也必须先确认。
- 只读检查官网无需发布确认。此规则持续生效。
