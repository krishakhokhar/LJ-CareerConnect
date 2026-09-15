import { FUNNEL_RAMP } from '../../utils/chartTheme';

/**
 * Ordinal "narrowing funnel" bars - each stage's width is proportional to
 * its count relative to the first stage, shaded light -> dark down the
 * brand ramp so stage order reads as position, not hue identity.
 */
const FunnelStages = ({ stages }) => {
  const max = stages[0]?.count || 1;
  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const pct = Math.max(6, Math.round((stage.count / max) * 100));
        return (
          <div key={stage.stage}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-semibold text-ink-700">{stage.stage}</span>
              <span className="font-semibold text-ink-500">{stage.count}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: FUNNEL_RAMP[i % FUNNEL_RAMP.length] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FunnelStages;
