// Mismo cálculo que usa el backend (src/controllers/estudianteController.js) para
// decidir si un estudiante es menor de edad y necesita representante legal.
export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;
  const birthDate = new Date(fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function esMenorDeEdad(fechaNacimiento) {
  const edad = calcularEdad(fechaNacimiento);
  return edad !== null && edad < 18;
}
