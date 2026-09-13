"use client";

const DAY_NAMES = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];

/* État d'un créneau horaire selon l'heure actuelle */
function getSlotState(slot: string): "closed" | "past" | "now" | "future" {
  const s = slot.trim().toLowerCase();
  if (s === "fermé") return "closed";
  const m = s.match(/^(\d{1,2})h(\d{2})?\s*-\s*(\d{1,2})h(\d{2})?$/);
  if (!m) return "future";
  const now = new Date();
  const cur = now.getHours() + now.getMinutes() / 60;
  const start = parseInt(m[1], 10) + (m[2] ? parseInt(m[2], 10) / 60 : 0);
  const end = parseInt(m[3], 10) + (m[4] ? parseInt(m[4], 10) / 60 : 0);
  if (cur < start) return "future";
  if (cur >= end) return "past";
  return "now";
}

interface ScheduleCardProps {
  title: string;
  headers: string[];
  data: string[][];
  tone?: "orange" | "green";
}

export default function ScheduleCard({
  title,
  headers,
  data,
  tone = "orange",
}: ScheduleCardProps) {
  const todayName = DAY_NAMES[new Date().getDay()];
  const columns = `1.3fr repeat(${headers.length}, 1fr)`;

  return (
    <div className="sched-card">
      <div className={`sched-card__head sched-card__head--${tone}`}>
        <span className="sched-card__title">{title}</span>
      </div>

      <div className="sched-card__table">
        {/* En-tête des colonnes */}
        <div className="sched-card__row sched-card__thead-row" style={{ gridTemplateColumns: columns }}>
          <div className="sched-card__cell sched-card__cell--day">Jour</div>
          {headers.map((h) => (
            <div key={h} className="sched-card__cell sched-card__thead">
              {h}
            </div>
          ))}
        </div>

        {/* Lignes */}
        {data.map(([day, ...slots]) => {
          const isToday = day === todayName;
          return (
            <div
              key={day}
              className={`sched-card__row ${isToday ? "is-today" : ""}`}
              style={{ gridTemplateColumns: columns }}
            >
              <div className="sched-card__cell sched-card__cell--day">
                <span>{day}</span>
                {isToday && (
                  <em className={`sched-chip sched-chip--${tone}`}>
                    Aujourd&apos;hui
                  </em>
                )}
              </div>

              {slots.map((s, i) => {
                const state = isToday ? getSlotState(s) : "future";
                const cls = [
                  "sched-card__cell",
                  "sched-card__cell--slot",
                  state === "closed" ? "is-closed" : "",
                  state === "now" ? "is-now" : "",
                  state === "past" ? "is-past" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <div key={i} className={cls}>
                    <span>{s}</span>
                    {state === "now" && (
                      <em className={`sched-chip sched-chip--${tone}`}>
                        En ce moment
                      </em>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}