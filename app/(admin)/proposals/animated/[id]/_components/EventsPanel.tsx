import { format } from "date-fns";
import type { AnimatedProposalEvent } from "@/types/animated-proposal";

interface Props {
  events: AnimatedProposalEvent[];
}

export function EventsPanel({ events }: Props) {
  if (events.length === 0) return null;

  return (
    <div className="border border-border-primary rounded-lg p-6">
      <h3 className="font-bold mb-4">Engagement Events</h3>
      <div className="space-y-2">
        {events.slice(0, 20).map((ev) => (
          <div key={ev.id} className="flex items-center justify-between text-sm">
            <span className="capitalize text-text-secondary">{ev.event_type.replace(/_/g, " ")}</span>
            <span className="text-text-muted text-xs">{format(new Date(ev.created_at), "dd MMM HH:mm")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
