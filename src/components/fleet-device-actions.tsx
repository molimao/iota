import { Ellipsis, History, Plus } from "lucide-react";
import { localized as l } from "@/lib/product-discovery";
import { timelineCopy } from "./device-timeline";
import { fleetCopy } from "./fleet-copy";
import { useLocale } from "./site/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const moreActions = l(["更多操作", "更多操作", "More actions", "추가 작업", "その他の操作"]);

export function FleetDeviceActions({ onLink, onTimeline, onEdit, onRemove }: {
  onLink?: (() => void) | undefined;
  onTimeline?: (() => void) | undefined;
  onEdit?: (() => void) | undefined;
  onRemove?: (() => void) | undefined;
}) {
  const { locale } = useLocale();
  const copy = fleetCopy(locale);
  return (
    <div className="fleet-device-actions">
      {onTimeline && <button type="button" onClick={onTimeline}><History size={15} />{timelineCopy.title[locale]}</button>}
      {onLink && <button type="button" onClick={onLink}><Plus size={15} />{copy.addProject}</button>}
      {(onEdit || onRemove) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label={moreActions[locale]}><Ellipsis size={18} /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="fleet-device-actions-menu" align="end">
            {onEdit && <DropdownMenuItem onSelect={onEdit}>{copy.rename}</DropdownMenuItem>}
            {onRemove && <DropdownMenuItem onSelect={onRemove}>{copy.remove}</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
