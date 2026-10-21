import { Barnner } from 'anteriority-ui';
import styles from './FormMessage.module.css';

// Barnner está pensado como badge corto (width: max-content) y se desborda con
// texto largo (errores de formulario, advertencias). Este wrapper lo fuerza a
// ocupar el ancho disponible y hacer wrap normal.
export default function FormMessage({ type, children }) {
  return (
    <div className={styles.wrapper}>
      <Barnner type={type} className="form-message-barnner">
        {children}
      </Barnner>
    </div>
  );
}
