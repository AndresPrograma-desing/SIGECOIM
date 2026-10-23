import { jsPDF } from 'jspdf';
import { CONTRATO_PDF } from '../../constants/text';
import { esMenorDeEdad } from '../edad';

const CONSERVACION_LABEL = { NUEVO: 'Nuevo', BUENO: 'Bueno', REGULAR: 'Regular', MALO: 'Malo' };

function seccion(doc, y, titulo) {
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(titulo, 14, y);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  return y + 7;
}

function linea(doc, y, label, valor) {
  doc.text(`${label}: ${valor ?? '—'}`, 14, y);
  return y + 6;
}

// Contrato/Acta de Comodato con los datos dinámicos del instrumento, estudiante,
// representante (si es menor de edad) y condición inicial (HU-38/HU-39).
export function generarContratoPDF(comodato) {
  const doc = new jsPDF();
  const estudiante = comodato.estudiante;
  const instrumento = comodato.instrumento;
  const representante = estudiante?.representante;
  const esMenor = esMenorDeEdad(estudiante?.fecha_nacimiento);

  let y = 18;
  doc.setFontSize(14);
  doc.text(CONTRATO_PDF.institucion, 14, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(CONTRATO_PDF.titulo, 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.text(`Correlativo: ${comodato.folio_contrato}`, 14, y);
  y += 10;

  y = seccion(doc, y, CONTRATO_PDF.seccionInstrumento);
  y = linea(doc, y, 'Instrumento', instrumento?.nombre);
  y = linea(doc, y, 'Marca / Modelo', `${instrumento?.marca ?? '—'} ${instrumento?.modelo ?? ''}`.trim());
  y = linea(doc, y, 'Número de serie', instrumento?.numero_serie);
  y = linea(doc, y, 'Código de inventario', instrumento?.codigo_inventario);
  y += 4;

  y = seccion(doc, y, CONTRATO_PDF.seccionEstudiante);
  y = linea(doc, y, 'Nombre', `${estudiante?.nombre ?? ''} ${estudiante?.apellido ?? ''}`.trim());
  y = linea(doc, y, 'Cédula', estudiante?.cedula);
  y += 4;

  if (esMenor && representante) {
    y = seccion(doc, y, CONTRATO_PDF.seccionRepresentante);
    y = linea(doc, y, 'Nombre', `${representante.nombre ?? ''} ${representante.apellido ?? ''}`.trim());
    y = linea(doc, y, 'Cédula', representante.cedula);
    y = linea(doc, y, 'Teléfono', representante.telefono);
    y += 4;
  }

  y = seccion(doc, y, CONTRATO_PDF.seccionFechas);
  y = linea(doc, y, 'Fecha de inicio', comodato.fecha_inicio);
  y = linea(doc, y, 'Devolución prevista', comodato.fecha_devolucion_prevista);
  y += 4;

  y = seccion(doc, y, CONTRATO_PDF.seccionCondicion);
  y = linea(doc, y, 'Condición inicial', CONSERVACION_LABEL[comodato.condicion_inicial] || comodato.condicion_inicial || '—');
  y = linea(doc, y, 'Observaciones', comodato.observaciones_iniciales || '—');

  y += 20;
  doc.line(14, y, 90, y);
  doc.line(120, y, 196, y);
  y += 6;
  doc.setFontSize(9);
  doc.text(CONTRATO_PDF.firmaAnalista, 14, y);
  doc.text(CONTRATO_PDF.firmaResponsable, 120, y);

  doc.save(`contrato-${comodato.folio_contrato}.pdf`);
}
