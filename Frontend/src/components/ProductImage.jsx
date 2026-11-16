import { useState } from 'react'
import { useSelector } from 'react-redux'
import SetMealOutlinedIcon from '@mui/icons-material/SetMealOutlined'
import styles from './ProductImage.module.scss'

export function ProductImage({ src, alt }) {
  const lang = useSelector((state) => state.language.current)
  const [failedSrc, setFailedSrc] = useState(null)

  if (!src || failedSrc === src) {
    return <div className={styles.placeholder}>
      <SetMealOutlinedIcon aria-hidden="true" />
      <span>{lang === 'vi' ? 'Sản phẩm chưa có hình ảnh' : 'Product images coming soon'}</span>
    </div>
  }

  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailedSrc(src)} />
}
