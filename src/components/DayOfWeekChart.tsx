import { formatCurrency } from "@/lib/format";

type DayData = {
  dia: string;
  total: string;
  cantidadVentas: number;
};

type DayOfWeekChartProps = {
  data: DayData[];
};

export function DayOfWeekChart({ data }: DayOfWeekChartProps) {
  const maxTotal = Math.max(...data.map((item) => Number(item.total)), 1);

  return (
    <section className="rounded-3xl border border-amber-500/15 bg-[#24180d]/80 p-6 shadow-xl shadow-black/20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-amber-50">
            Ventas por día de la semana
          </h2>
          <p className="mt-1 text-sm text-amber-100/60">
            Total acumulado según el día en que se registró cada venta
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {data.map((item) => {
          const width = (Number(item.total) / maxTotal) * 100;

          return (
            <div key={item.dia} className="grid gap-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="w-24 font-medium text-amber-100">{item.dia}</span>
                <span className="text-amber-50">{formatCurrency(item.total)}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-amber-950/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
              <p className="text-xs text-amber-100/50">
                {item.cantidadVentas} venta{item.cantidadVentas === 1 ? "" : "s"}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
