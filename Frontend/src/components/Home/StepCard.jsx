import styles from './StepCard.module.scss'

export function StepCard({ step, index, active }) {
  return (
    <article className={`${styles.card} ${active ? styles.active : ''}`}>
      <div className={styles.imageWrap}><img src={step.image} alt="" loading="lazy" /></div>
      <p className={styles.number}>{String(index + 1).padStart(2, '0')}</p>
      <h3>{step.title}</h3>
      <p className={styles.description}>{step.description}</p>
    </article>
  )
}
