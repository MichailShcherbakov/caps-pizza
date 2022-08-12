import styles from "../index.module.scss";

export interface ModalFormProps extends React.HTMLAttributes<HTMLFormElement> {}

export default function ModalForm(props: ModalFormProps) {
  return <form {...props} className={styles["modal__form"]} />;
}
