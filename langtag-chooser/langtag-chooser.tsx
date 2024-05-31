import styles from './langtag-chooser.module.css';

/* eslint-disable-next-line */
export interface LangtagChooserProps {}

export function LangtagChooser(props: LangtagChooserProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to LangtagChooser!</h1>
    </div>
  );
}

export default LangtagChooser;
