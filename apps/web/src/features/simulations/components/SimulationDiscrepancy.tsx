import { formatEuro } from '../../customers/format';

export function SimulationDiscrepancy({
  previousTotalCents,
  savedTotalCents,
}: {
  previousTotalCents: number;
  savedTotalCents: number;
}) {
  return (
    <p>
      El servidor ha actualizado el presupuesto. Total previo:{' '}
      {formatEuro(previousTotalCents)}. Total guardado:{' '}
      {formatEuro(savedTotalCents)}. Se muestra el cálculo definitivo guardado.
    </p>
  );
}
