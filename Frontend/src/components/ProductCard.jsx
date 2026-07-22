import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import { addInquiryItem } from '../redux/slices/inquirySlice'
import styles from './ProductCard.module.scss'

const typeLabels = { raw: { vi: 'Tươi sống', en: 'Raw' }, cooked: { vi: 'Hấp / Chín', en: 'Cooked' }, value_added: { vi: 'Gia công sâu', en: 'Value-added' } }

export function ProductCard({ product }) {
  const lang = useSelector((state) => state.language.current)
  const alreadyAdded = useSelector((state) => state.inquiry.items.some((item) => item.product_id === product.id))
  const dispatch = useDispatch()
  const primaryName = lang === 'vi' ? product.name_vi : product.name_en
  const secondaryName = lang === 'vi' ? product.name_en : product.name_vi
  const add = () => {
    if (alreadyAdded) {
      toast.info(lang === 'vi' ? 'Sản phẩm này đã có trong danh sách yêu cầu.' : 'This product is already in your inquiry list.')
      return
    }
    dispatch(addInquiryItem({ product_id: product.id, product_name: primaryName, quantity: 1, specifications: '', notes: '', slug: product.slug, thumbnail_url: product.thumbnail_url }))
    toast.success(lang === 'vi' ? `Đã thêm “${primaryName}” vào danh sách yêu cầu.` : `“${primaryName}” was added to your inquiry list.`)
  }
  return <article className={styles.card}>
    <Link to={`/products/${product.slug}`} className={styles.imageLink} aria-label={primaryName}><img src={product.thumbnail_url} alt={primaryName} loading="lazy" decoding="async" /></Link>
    <div className={styles.content}>
      {typeLabels[product.product_type] ? <p className={styles.type}>{typeLabels[product.product_type][lang]}</p> : null}
      <Link to={`/products/${product.slug}`}><h2>{primaryName}</h2><p className={styles.secondaryName}>{secondaryName}</p></Link>
      <div className={styles.actions}><Link to={`/products/${product.slug}`}>{lang === 'vi' ? 'Chi tiết' : 'Details'}<ArrowOutwardRoundedIcon /></Link><button onClick={add}><AddRoundedIcon />{lang === 'vi' ? 'Gửi yêu cầu' : 'Inquire Now'}</button></div>
    </div>
  </article>
}
