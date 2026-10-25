import { expect, it, vi } from "vitest";
import { subscribeAgentClock, agentClockSnapshot } from "../hooks/use-agent-clock";
import { agentOnline, agentDisplayPhase } from "@/lib/device-agent";
it("ages an unchanged heartbeat into offline without any query response", () => {
 vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-25T08:00:00Z"));
 const beat = new Date().toISOString(), first=vi.fn(), second=vi.fn();
 const stop = subscribeAgentClock(first), stop2=subscribeAgentClock(second);
 try {
   expect(vi.getTimerCount()).toBe(1);
   expect(agentOnline(beat,agentClockSnapshot())).toBe(true);
   vi.advanceTimersByTime(55000);
   expect(agentOnline(beat,agentClockSnapshot())).toBe(true);
   vi.advanceTimersByTime(5000);
   expect(agentOnline(beat,agentClockSnapshot())).toBe(false);
   expect(agentDisplayPhase({lastSeen:beat,snapshot:{appRunning:true,workerRunning:true}}, {status:"contributing",fetchedAt:Date.now()},agentClockSnapshot())).toBe("offline");
   expect(first).toHaveBeenCalled(); expect(second).toHaveBeenCalled();
 } finally {stop(); stop2(); expect(vi.getTimerCount()).toBe(0); vi.useRealTimers();}
});
