import { jsPDF } from 'jspdf';
import { esMenorDeEdad } from '../edad';

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const MARGIN_X = 18;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const BOTTOM_LIMIT = PAGE_HEIGHT - 20;

function fechaEnPalabras(fechaIso) {
  if (!fechaIso) return { dia: '___', mes: '____________________', anio: '______' };
  const [y, m, d] = fechaIso.split('-').map(Number);
  return { dia: String(d), mes: MESES[m - 1] || '____________________', anio: String(y) };
}

// Las 14 disposiciones generales son el mismo texto legal en ambos contratos
// (mayor/menor de edad), copiadas tal cual de las plantillas .doc originales.
const DISPOSICIONES = [
  'El Bien antes identificado, es propiedad de la FUNDACIÓN MUSICAL SIMÓN BOLÍVAR, y al momento de la entrega se encuentra en perfectas condiciones y apto para el uso para el cual fue creado.',
  'EL COMODATARIO declara en este mismo acto que recibe conforme El Bien; en el entendido, que el mismo es un Bien Público, es decir que pertenece al Estado, definición que se encuentra expresa en el artículo 5 del Decreto con Rango, Valor y Fuerza de la Ley de Reforma Parcial del Decreto con Rango Valor y Fuerza de la Ley de Bienes Públicos, publicado en Gaceta Oficial de carácter extraordinario N° 6.155, publicado en fecha 19 de noviembre de 2014, por lo que cualquier uso indebido o aprovechamiento de él podría acarrear sanciones penales y civiles cuando los particulares actúen contrarios a la Ley, así lo determina el artículo 105 ibídem, el cual establece que cualquier persona que use o aproveche de manera ilegal un bien público, responderá penal y civilmente por los daños y perjuicios ocasionados al patrimonio público.',
  'Queda entendido y así lo acepta EL COMODATARIO que si El Bien dado en comodato, sufriera alguna perdida, hurto, robo o deterioro será obligación de EL COMODATARIO la reposición del costo del mismo, así como realizar todos los trámites ante las autoridades policiales y de manera muy particular tiene la obligación de interponer la respectiva denuncia una vez ocurrido el hecho o al día hábil siguiente, hacerle seguimiento y remitir la misma a la mayor brevedad a la Dirección de Gestión Patrimonial de LA FUNDACIÓN MUSICAL SIMÓN BOLÍVAR, a través del correo electrónico: segurospatrimoniales@elsistema.org.ve; así como el físico de la misma.',
  'EL BIEN objeto del presente contrato lo destinará EL COMODATARIO para su uso personal, en su ejecución en las prácticas individuales o ensayos, y en general, en las actividades propias programadas por EL NÚCLEO, LA FUNDACIÓN REGIONAL y/o LA FUNDACIÓN MUSICAL SIMÓN BOLÍVAR. EL NÚCLEO se reserva el derecho de negar el uso de EL BIEN en oportunidades diferentes a las que se han especificados en el presente numeral. En caso de incumplimiento a la presente disposición por parte de EL COMODATARIO dará derecho a EL NÚCLEO a solicitarle la entrega inmediata de EL BIEN.',
  'EL COMODATARIO se obliga a cuidar y proteger como un Buen Padre de Familia EL BIEN entregado y que recibe en este acto, obligándose a darle un uso idóneo al mismo; en tal sentido, se compromete a observar un meticuloso cuidado, mantenimiento y conservación del mismo, y a responder por su culpa ante cualquier deterioro que este sufra; en consecuencia, Si EL BIEN dado aquí en comodato se destruye, o sufre deterioro alguno diferente al normal causado por el transcurso del tiempo y el uso adecuado del mismo, ello dará derecho a LA FUNDACIÓN MUSICAL SIMÓN BOLÍVAR de intentar las acciones que estime convenientes tendentes a recuperar el valor atribuible al mismo, y que consta en la cláusula primera del presente documento; así como también, por Daños y Perjuicios que se ocasionen por la falta de EL COMODATARIO. A tal efecto, la reposición del costo de EL BIEN se hará al valor del mercado vigente al momento de constatarse el daño. EL COMODATARIO responde de la pérdida del bien, aun cuando la pérdida se derive de caso fortuito o fuerza mayor.',
  'La vigencia del presente contrato es de Un (1) año contado a partir de la firma del mismo por las partes.',
  'LA DIRECCIÓN DE GESTIÓN PATRIMONIAL como unidad dependiente de LA FUNDACIÓN MUSICAL SIMÓN BOLÍVAR será la encargada de constituir una Póliza de Seguros mientras cuente con la disponibilidad presupuestaria, a través de una empresa de seguros de reconocida solvencia y cuya beneficiaria sea ésta, que garantice ante cualquier pérdida o daño ocasionado a EL BIEN. Por consiguiente, EL COMODATARIO se obliga a dar estricto cumplimiento de las condiciones que sean establecidas en la Póliza de Seguros que suscriba.',
  'EL NÚCLEO se reserva el derecho de supervisar el estado en que se encuentra EL BIEN dado en Comodato, en lo que se refiere a las condiciones de uso, mantenimiento y conservación sin que EL COMODATARIO pueda negarse de manera alguna a aceptar dichos actos de supervisión por parte de EL NÚCLEO. En consecuencia, El COMODATARIO pondrá a disposición de EL NÚCLEO EL BIEN en cualquier momento que así lo requiera éste.',
  'EL NÚCLEO se reserva el derecho de exigir la entrega de EL BIEN dado en Comodato en cualquier momento, mediante una simple comunicación por escrito dada con Diez (10) días de antelación a la entrega, sin que ello diere lugar a reclamación alguna por parte de EL COMODATARIO.',
  'EL COMODATARIO se obliga a entregar EL BIEN dado en Comodato en las mismas buenas condiciones en que lo recibe, salvo el normal deterioro causado por el uso idóneo del mismo.',
  'El presente contrato se entiende celebrado en atención a la persona de EL COMODATARIO en consecuencia este no podrá ceder o traspasar el presente contrato a terceras personas bajo pena de nulidad del presente contrato, en cuyo caso LA FUNDACIÓN y/o EL NÚCLEO exigirá la entrega inmediata de EL BIEN.',
  'El incumplimiento por parte de EL COMODATARIO a una cualquiera de las obligaciones que por este documento asume, constituirá la pérdida del beneficio del término del contrato y dará derecho a EL NÚCLEO de considerar rescindido de pleno derecho el mismo y a exigir la inmediata entrega de EL BIEN, y especialmente por las siguientes causas:\n' +
    '11.1.- Cuando EL COMODATARIO deje de pertenecer a EL NÚCLEO al cual pertenece, cualquiera que sea la causa.\n' +
    '11.2.- Cuando EL BIEN dado aquí en Comodato haya sido dado en préstamo, arrendamiento, comodato, o venta por parte de EL COMODATARIO.\n' +
    '11.3.- Cuando se compruebe que EL BIEN haya sido utilizado con fines distintos a los previstos en el presente contrato.\n' +
    '11.4.- Cuando sin causa justificada EL COMODATARIO dejare de asistir por Treinta (30) días consecutivos a clases, ensayos en grupos o generales o cualquier otra actividad que haya sido programada por EL NÚCLEO.\n' +
    '11.5.- Por muerte de EL COMODATARIO.\n' +
    '11.6.- Cuando EL COMODATARIO se niegue a permitir la inspección de EL BIEN en la oportunidad que así lo requiera EL NÚCLEO.\n' +
    '11.7.- Por el incumplimiento a una cualquiera de las cláusulas previstas en el presente contrato.',
  'En caso de que EL COMODATARIO que haya incurrido en alguna de las causales antes señaladas, dará derecho a EL NÚCLEO a exigir la entrega inmediata de EL BIEN; y de no hacerlo, EL NÚCLEO, lo participará oportunamente a LA FUNDACIÓN REGIONAL quien a su vez lo notificará a LA FUNDACIÓN MUSICAL SIMÓN BOLÍVAR para que proceda conforme a lo establecido en las Disposiciones Generales en su numeral 2, del presente contrato de comodato.',
  'EL COMODATARIO se obliga a notificar a EL NÚCLEO en un plazo no mayor de cinco días hábiles y en forma fehaciente en caso de que tuviere un cambio de domicilio distinto al informado a EL NÚCLEO, mismo que se tiene como domicilio para cualquier notificación y recibir documentos para todos los efectos legales a que haya lugar, a cuyo efecto EL COMODATARIO deberá consignar al momento de su inscripción en el Núcleo una constancia de Residencia emanada bien por la Junta Vecinal, el Consejo Comunal o la Prefectura de su jurisdicción.',
  'Las dudas y controversias de cualquier naturaleza que pudieran suscitarse con motivo del presente contrato de comodato y que no pudieran ser resueltas amigablemente por las partes serán atendidas inicialmente de manera amigable entre las partes; caso de no llegar a un acuerdo serán decididas por los Tribunales competentes de la República Bolivariana de Venezuela de conformidad con sus leyes, a cuyo efecto, se elige como domicilio especial a la ciudad de Caracas a la jurisdicción de cuyos tribunales ambas partes manifiestan someterse.',
];

// Contrato de Comodato — réplica fiel del texto legal de las plantillas .doc
// originales ("... MAYOR DE EDAD (2025).doc" / "... MENOR DE EDAD (2025).doc"),
// con los datos dinámicos del comodato insertados en los espacios en blanco.
export function generarContratoPDF(comodato, opciones = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const estudiante = comodato.estudiante;
  const instrumento = comodato.instrumento;
  const representante = estudiante?.representante;
  const esMenor = esMenorDeEdad(estudiante?.fecha_nacimiento);
  const nombreNucleo = opciones.nombreNucleo?.trim() || '___________________________________';
  const { dia, mes, anio } = fechaEnPalabras(comodato.fecha_inicio);

  let y = 20;

  const ensureSpace = (needed) => {
    if (y + needed > BOTTOM_LIMIT) {
      doc.addPage();
      y = 20;
    }
  };

  const writeParagraph = (text, { size = 10, bold = false, align = 'justify', gap = 4 } = {}) => {
    doc.setFontSize(size);
    doc.setFont(undefined, bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    for (const line of lines) {
      ensureSpace(5);
      doc.text(line, MARGIN_X, y, { align: align === 'justify' ? 'left' : align, maxWidth: CONTENT_WIDTH });
      y += 5;
    }
    y += gap;
  };

  // Correlativo
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text(comodato.folio_contrato || '', MARGIN_X, y);
  y += 10;

  // Título
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Contrato de Comodato', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 10;

  // Párrafo introductorio (varía según mayor/menor de edad)
  const estudianteNombre = `${estudiante?.nombre ?? ''} ${estudiante?.apellido ?? ''}`.trim() || '___________________________________';
  const estudianteCedula = estudiante?.cedula || '__________________';

  if (esMenor && representante) {
    const repNombre = `${representante.nombre ?? ''} ${representante.apellido ?? ''}`.trim() || '___________________________________';
    const repCedula = representante.cedula || '__________________';
    writeParagraph(
      `Entre EL NÚCLEO, ${nombreNucleo} quien a los efectos del presente documento se denominará EL NÚCLEO, por una parte, y por la otra el (la) ciudadano (a) ${repNombre}, venezolano (a), mayor de edad, de este domicilio, titular de la cédula de identidad Nro. ${repCedula}, en su carácter de Representante Legal del niño o adolescente ${estudianteNombre} titular de la cédula de identidad Nro. ${estudianteCedula}, integrante del Núcleo ${nombreNucleo}, y quien en lo adelante se denominará EL COMODATARIO, hemos convenido en celebrar el presente contrato de comodato, con el fin de hacer entrega al último de los mencionados en calidad de Comodato, el siguiente instrumento musical, el cual en lo adelante a los solos efectos del presente documento se identificará como EL BIEN:`,
    );
  } else {
    writeParagraph(
      `Entre EL NÚCLEO, ${nombreNucleo} quien a los efectos del presente documento se denominará EL NÚCLEO, por una parte, y por la otra el (la) ciudadano (a) ${estudianteNombre}, venezolano (a), mayor de edad, de este domicilio, titular de la cédula de identidad Nro. ${estudianteCedula}, integrante del Núcleo ${nombreNucleo}, y quien en lo adelante se denominará EL COMODATARIO, hemos convenido en celebrar el presente contrato de comodato, con el fin de hacer entrega al último de los mencionados en calidad de Comodato, el siguiente instrumento musical, el cual en lo adelante a los solos efectos del presente documento se identificará como EL BIEN:`,
    );
  }

  // Tabla del bien
  ensureSpace(40);
  const colW = CONTENT_WIDTH / 3;
  const filaBien = (fila) => {
    ensureSpace(16);
    const yTop = y;
    doc.setDrawColor(150);
    doc.setFontSize(9);
    fila.forEach((celda, i) => {
      const x = MARGIN_X + i * colW;
      doc.rect(x, yTop, colW, 16);
      doc.setFont(undefined, 'bold');
      doc.text(celda.label, x + 2, yTop + 5);
      doc.setFont(undefined, 'normal');
      doc.text(doc.splitTextToSize(celda.valor || '—', colW - 4), x + 2, yTop + 11);
    });
    y = yTop + 16;
  };

  filaBien([
    { label: 'Instrumento', valor: instrumento?.nombre },
    { label: 'Marca', valor: instrumento?.marca },
    { label: 'Modelo', valor: instrumento?.modelo },
  ]);
  filaBien([
    { label: 'Medida', valor: instrumento?.medida },
    { label: 'Color', valor: instrumento?.color },
    { label: 'Serial', valor: instrumento?.numero_serie },
  ]);
  filaBien([
    { label: 'Número de Inventario', valor: instrumento?.codigo_inventario },
    { label: 'Tipo de accesorios', valor: instrumento?.accesorios },
    { label: '', valor: '' },
  ]);
  y += 6;

  // Disposiciones generales
  writeParagraph('DISPOSICIONES GENERALES:', { bold: true, gap: 2 });
  DISPOSICIONES.forEach((texto, idx) => {
    writeParagraph(`${idx + 1}.- ${texto}`);
  });

  // Párrafo de cierre
  if (esMenor && representante) {
    const repNombre = `${representante.nombre ?? ''} ${representante.apellido ?? ''}`.trim() || '___________________________________';
    writeParagraph(
      `Yo, ${repNombre}, ya identificado, en nombre de mí representado por el presente documento declaro que recibo conforme EL BIEN que en este acto se me entrega en Comodato, obligándome a cumplir con las obligaciones estipuladas en el presente contrato. Se hacen dos ejemplares de un mismo tenor y a un solo efecto en ___________________________________ a los ${dia} días del mes ${mes} del ${anio}.`,
    );
  } else {
    writeParagraph(
      `Y yo, ${estudianteNombre}, ya identificado por el presente documento declaro que recibo conforme EL BIEN que en este acto se me entrega en Comodato, obligándome a cumplir con las obligaciones estipuladas en el presente contrato. Se hacen dos ejemplares de un mismo tenor y a un solo efecto en ___________________________________ a los ${dia} días del mes ${mes} del ${anio}.`,
    );
  }

  // Bloque de firmas
  ensureSpace(50);
  y += 10;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.line(MARGIN_X, y, MARGIN_X + 75, y);
  doc.line(MARGIN_X + 95, y, MARGIN_X + 170, y);
  y += 5;
  doc.text('Firma', MARGIN_X + 30, y);
  doc.text('Firma', MARGIN_X + 125, y);
  y += 10;
  doc.text('C.I. ___________________________', MARGIN_X, y);
  doc.text('C.I. ___________________________', MARGIN_X + 95, y);
  y += 8;
  doc.setFont(undefined, 'bold');
  doc.text('Por EL NÚCLEO', MARGIN_X + 15, y);
  doc.text('EL COMODATARIO', MARGIN_X + 115, y);
  y += 16;
  doc.setFont(undefined, 'normal');
  doc.text('Sello', MARGIN_X + 25, y);
  doc.text('Huella Dactilar', MARGIN_X + 110, y);

  doc.save(`contrato-${comodato.folio_contrato}.pdf`);
}
