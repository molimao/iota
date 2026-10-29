import type { AgentInfo } from "@/lib/device-agent";
import type { FleetDevice, FleetBinding } from "@/lib/fleet";
import { FLEET_NAMES } from "@/lib/fleet";
import {
  deviceTodayEarnings,
  deviceEarningsHeadline,
  singleAccountSummary,
  retainedDeviceDaily,
} from "@/lib/fleet-earnings";
import { formatUsd } from "@/lib/earnings";
import { BntUsdEstimate } from "./bnt-usd-estimate";
import type { ProjectReading } from "./fleet-review-data";
import { useLocale } from "./site/locale";
import { fleetCopy } from "./fleet-copy";
import { DeviceAgentSummary } from "./device-agent-summary";
import { DeviceMinerSummary } from "./device-miner-summary";
import { IotaRosterStatus } from "./iota-device-run";
import { iotaAddCopy } from "./iota-add-copy";
import "./fleet-device-table.css";

export function FleetDeviceTable({
  devices,
  reading,
  preview = false,
  previewAgents,
  onLink,
  onEdit,
  onRemove,
}: {
  devices: FleetDevice[];
  reading: (b: FleetBinding) => ProjectReading;
  preview?: boolean;
  previewAgents?: Record<string, AgentInfo> | undefined;
  onLink: (id: string) => void;
  onEdit?: ((id: string) => void) | undefined;
  onRemove?: ((id: string) => void) | undefined;
}) {
  const { locale } = useLocale(),
    c = fleetCopy(locale);
  return (
    <div className="fleet-device-table-scroll">
      <table className="fleet-device-table">
        <thead>
          <tr>
            <th>{c.devices}</th>
            <th>{c.projects}</th>
            <th>{c.deviceDaily}</th>
            <th>Agent</th>
            <th>{iotaAddCopy.action[locale]}</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => {
            const values = device.bindings.map((binding) => ({ binding, data: reading(binding) })),
              daily = deviceTodayEarnings(values),
              native = deviceEarningsHeadline(daily);
            const retained =
              daily.known === 0 ? retainedDeviceDaily(values.map((v) => v.data)) : null;
            const account =
              daily.known === 0 ? singleAccountSummary(values.map((v) => v.data)) : null;
            const amount = retained ?? account ?? native;
            const hasIota = device.bindings.some((b) => b.project === "iota");
            return (
              <tr key={device.id}>
                <td>
                  <strong>{device.name}</strong>
                  <small>{device.hardware}</small>
                </td>
                <td>
                  <div className="fleet-table-projects">
                    {device.bindings.map((binding) => (
                      <div key={binding.id}>
                        <b>{FLEET_NAMES[binding.project]}</b>
                        {binding.project === "iota" ? (
                          <IotaRosterStatus
                            preview={preview}
                            previewAgent={previewAgents?.[device.id]}
                            deviceId={device.id}
                            miner={binding.identifier}
                            status={reading(binding).officialTraining?.status ?? "unknown"}
                          />
                        ) : (
                          <span className={`fleet-status fleet-status-${reading(binding).status}`}>
                            {reading(binding).activity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <small>
                    {retained
                      ? c.lastDaily
                      : account
                        ? account.kind === "month"
                          ? c.monthPoints
                          : c.balance
                        : hasIota
                          ? c.deviceYesterday
                          : c.deviceToday}
                  </small>
                  <strong>
                    {amount ? amount.amount : formatUsd(daily.usd)}{" "}
                    <small>{amount ? amount.unit : daily.usd !== null ? "USD" : ""}</small>
                  </strong>
                  {amount?.unit === "BNT" && <BntUsdEstimate amount={amount.amount} />}
                  {!amount &&
                    daily.native.map((value, index) => (
                      <small key={index}>
                        {value.amount} {value.unit}
                      </small>
                    ))}
                  <small>
                    {retained
                      ? c.stale
                      : account
                        ? c.wallet
                        : daily.usd !== null
                          ? `${c.usdEstimate}${daily.priceStale ? ` · ${c.quoteOlder}` : ""}`
                          : c.noEarningsPrice}
                  </small>
                </td>
                <td>
                  {hasIota ? (
                    <DeviceAgentSummary
                      compact
                      preview={preview}
                      deviceId={device.id}
                      previewAgent={previewAgents?.[device.id]}
                      official={values
                        .filter((v) => v.binding.project === "iota")
                        .map((v) => v.data.officialTraining)
                        .find(Boolean)}
                    />
                  ) : device.bindings.some((b) => b.project !== "iota") ? null : (
                    "—"
                  )}
                  {device.bindings.some((b) => b.project !== "iota") && (
                    <DeviceMinerSummary
                      deviceId={device.id}
                      bindings={device.bindings}
                      preview={preview}
                      previewAgent={previewAgents?.[device.id]}
                    />
                  )}
                </td>
                <td>
                  <div className="fleet-table-actions">
                    <button onClick={() => onLink(device.id)}>{c.addProject}</button>
                    {onEdit && <button onClick={() => onEdit(device.id)}>{c.rename}</button>}
                    {onRemove && <button onClick={() => onRemove(device.id)}>{c.remove}</button>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
