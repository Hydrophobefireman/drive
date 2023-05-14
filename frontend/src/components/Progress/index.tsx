import { css } from "catom";


function Circle({percent}: {percent: number}) {
  const R = 40;
  const circum = 2 * Math.PI * R;
  const rdraw = percent * circum;
  return (
    <svg
      class="round"
      viewBox="0 0 100 100"
      width="32"
      height="32"
      className={css({
        fill: "none",
        stroke: "var(--kit-theme-fg)",
        strokeWidth: "16px",
        strokeLinecap: "round",
        strokeDasharray: "0 999",
      })}
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="black"
        stroke-width="3"
        fill="none"
        class={css({fill: "var(--kit-shade-2)"})}
      ></circle>
      <circle
        cx="50"
        cy="50"
        r={R}
        style={{strokeDasharray: `${rdraw}, 999`}}
      />
    </svg>
  );
}

export interface ProgressItem {
  name: string;
  percent: number;
  status: string;
  cancel(): void;
  isClearable: boolean;
  clear(): void;
}
export function Progress({
  items,
  icon,
}: {
  icon: JSX.Element;
  items: Array<ProgressItem>;
}) {
  if (!items.length) return;
  const xButton = (f: ProgressItem) => (
    <button onClick={f.isClearable ? f.clear : f.cancel}>
      {f.isClearable ? "clear" : "cancel"}
    </button>
  );
  return (
    <div
      class={css({
        borderRadius: "10px",
        boxShadow: "var(--kit-shadow)",
        border: "1px solid var(--kit-border)",
        padding: ".5rem",
      })}
    >
      <div>{icon}</div>
      <div
        class={css({
          display: "flex",
          flexDirection: "column",
        })}
      >
        {items.map((f) => (
          <div>
            <div
              title={`${f.percent * 100}%`}
              class={css({
                display: "grid",
                gridTemplateColumns: ".1fr 1fr",
                gap: "1rem",
              })}
            >
              <Circle percent={f.percent} />{" "}
              <span
                class={css({
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                })}
              >
                {f.name}
              </span>
            </div>
            <div
              class={css({
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              })}
            >
              {f.isClearable ? xButton(f) : <div>{xButton(f)}</div>}
              <span class={css({textTransform: "lowercase"})}>{f.status} </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
