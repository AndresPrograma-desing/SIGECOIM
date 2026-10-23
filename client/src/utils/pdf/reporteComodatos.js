import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CONTRATO_PDF } from '../../constants/text';

const ESTADO_LABEL = { ACTIVO: 'Activo', FINALIZADO: 'Finalizado', VENCIDO: 'Vencido' };

// Reporte tabular exportable del historial de comodatos (HU-21), generado
// 100% en el cliente a partir de los datos ya cargados en Comodatos.jsx.
export function generarReporteComodatosPDF(comodatos) {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text(CONTRATO_PDF.institucion, 14, 16);
  doc.setFontSize(11);
  doc.text('Reporte de historial de comodatos', 14, 23);
  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-VE')}`, 14, 29);

  const filas = comodatos.map((c) => [
    c.folio_contrato,
    `${c.estudiante?.nombre ?? ''} ${c.estudiante?.apellido ?? ''}`.trim() || '—',
    c.instrumento?.nombre || '—',
    c.fecha_inicio || '—',
    c.fecha_devolucion_prevista || '—',
    ESTADO_LABEL[c.estado] || c.estado,
  ]);

  autoTable(doc, {
    startY: 34,
    head: [['Correlativo', 'Estudiante', 'Instrumento', 'Fecha inicio', 'Devolución prevista', 'Estado']],
    body: filas,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [11, 53, 88] },
  });

  doc.save(`reporte-comodatos-${new Date().toISOString().slice(0, 10)}.pdf`);
}
