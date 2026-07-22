import { useState } from 'react'
import { Link } from 'react-router-dom'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import SetMealOutlinedIcon from '@mui/icons-material/SetMealOutlined'
import styles from './CategoryCard.module.scss'

const descriptions = {
  shrimp: { en: 'Vannamei: breaded shrimp, lychee shrimp, crispy shrimp popcorn and shrimp balls.', vi: 'Tôm thẻ chân trắng: tẩm bột, tôm trái vải, tôm popcorn và tôm viên.' },
  cephalopods: { en: 'Whole cleaned, rings, pineapple cut, baby octopus and skewers.', vi: 'Nguyên con làm sạch, cắt khoanh, cắt hoa, bạch tuộc hai da và xiên que.' },
  'marine-fish': { en: 'Premium tuna, mackerel and mahi mahi processed into loins, fillets, steaks and cubes.', vi: 'Cá ngừ, cá thu, cá dũa cao cấp được gia công thành thịt thăn, phi lê, cắt lát và cắt khối.' },
  'freshwater-fish': { en: 'Pangasius and tilapia: well-trimmed fillets and standard fish blocks for industry.', vi: 'Cá tra (Basa) và cá điêu hồng: phi lê, block phục vụ sản xuất công nghiệp.' },
  shellfish: { en: 'Premium frog legs, cleaned crab, frozen scallops and clean white or brown clams.', vi: 'Đùi ếch cao cấp, cua làm sạch, sò điệp đông lạnh và nghêu trắng hoặc nghêu lụa sạch cát.' },
}

export function CategoryCard({ category, lang, labels }) {
  const [iconFailed, setIconFailed] = useState(false)
  const name = lang === 'vi' ? category.name_vi : category.name_en
  const description = descriptions[category.slug]?.[lang] || ''
  return (
    <article className={styles.card}>
      <div className={styles.iconWrap}>{category.icon_url && !iconFailed ? <img src={category.icon_url} alt="" loading="lazy" onError={() => setIconFailed(true)} /> : <SetMealOutlinedIcon aria-hidden="true" />}</div>
      <p className={styles.index}>{String(category.sort_order || category.id).padStart(2, '0')}</p>
      <h3>{name}</h3><p className={styles.description}>{description}</p>
      <Link to="/products" className={styles.link} aria-label={`${labels.details}: ${name}`}>{labels.details}<ArrowForwardRoundedIcon /></Link>
    </article>
  )
}
