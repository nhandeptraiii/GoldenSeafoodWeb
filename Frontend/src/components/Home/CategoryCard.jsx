import { useState } from 'react'
import { Link } from 'react-router-dom'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import SetMealOutlinedIcon from '@mui/icons-material/SetMealOutlined'
import styles from './CategoryCard.module.scss'

export function CategoryCard({ category, lang, labels }) {
  const [iconFailed, setIconFailed] = useState(false)
  const name = (lang === 'vi' ? category.name_vi : category.name_en) || category.name_en || category.name_vi || labels.details
  return (
    <article className={styles.card}>
      <div className={styles.iconWrap}>{category.icon_url && !iconFailed ? <img src={category.icon_url} alt="" loading="lazy" onError={() => setIconFailed(true)} /> : <SetMealOutlinedIcon aria-hidden="true" />}</div>
      <p className={styles.index}>{String(category.sort_order || category.id).padStart(2, '0')}</p>
      <h3>{name}</h3>
      <Link to="/products" className={styles.link} aria-label={`${labels.details}: ${name}`}>{labels.details}<ArrowForwardRoundedIcon /></Link>
    </article>
  )
}
