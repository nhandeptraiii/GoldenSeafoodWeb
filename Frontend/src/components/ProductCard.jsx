import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { ProductImage } from './ProductImage'
import { addInquiryItem } from '../redux/slices/inquirySlice'
import presentation from '../pages/Reference/productPresentation.json'

const typeLabels = { raw: { vi: 'Tươi sống', en: 'Raw' }, cooked: { vi: 'Hấp / Chín', en: 'Cooked' }, value_added: { vi: 'Gia công sâu', en: 'Value-added' } }

export function ProductCard({ product }) {
  const lang = useSelector((state) => state.language.current)
  const alreadyAdded = useSelector((state) => state.inquiry.items.some((item) => item.product_id === product.id))
  const dispatch = useDispatch()
  const primaryName = lang === 'vi' ? product.name_vi : product.name_en
  const secondaryName = lang === 'vi' ? product.name_en : product.name_vi
  const primaryImage = typeof product.primary_image === 'string'
    ? { image_url: product.primary_image, alt_text: primaryName }
    : product.primary_image || product.images?.find((image) => image.is_primary) || product.images?.[0]
  const reference = presentation[product.slug] || Object.values(presentation).find((item) => item.name.toLowerCase() === product.name_en?.toLowerCase())
  const imageUrl = reference?.image || primaryImage?.image_url
  const add = () => {
    if (alreadyAdded) { toast.info(lang === 'vi' ? 'Sản phẩm này đã có trong danh sách yêu cầu.' : 'This product is already in your inquiry list.'); return }
    dispatch(addInquiryItem({ product_id: product.id, product_name: primaryName, quantity: 1, specifications: '', notes: '', slug: product.slug, thumbnail_url: imageUrl }))
    toast.success(lang === 'vi' ? `Đã thêm “${primaryName}” vào danh sách yêu cầu.` : `“${primaryName}” was added to your inquiry list.`)
  }
  const displayName = (lang === 'vi' ? reference?.name_vi : reference?.name) || primaryName
  const categoryName = (lang === 'vi' ? reference?.category_vi : reference?.category_en) || (lang === 'vi' ? product.category?.name_vi : product.category?.name_en)
  return <article className="product-card">
    <Link to={`/products/${product.slug}`} className="product-thumb" aria-label={displayName}>
      {typeLabels[product.product_type] && <span className="ptag">{typeLabels[product.product_type][lang]}</span>}
      <ProductImage src={imageUrl} alt={displayName} />
    </Link>
    <div className="product-body">
      <div className="pcat">{categoryName}</div>
      <Link to={`/products/${product.slug}`}><h4>{displayName}</h4></Link>
      <div className="psci">{reference?.scientific || secondaryName}</div>
      <div className="product-actions"><button className={`btn btn-ghost${alreadyAdded ? ' added' : ''}`} onClick={add}><i className={`bi ${alreadyAdded ? 'bi-check-circle' : 'bi-cart-plus'}`} />{alreadyAdded ? (lang === 'vi' ? 'Đã thêm' : 'Added') : (lang === 'vi' ? 'Thêm vào báo giá' : 'Add to Inquiry')}</button></div>
    </div>
  </article>
}
