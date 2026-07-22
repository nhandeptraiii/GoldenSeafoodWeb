import { useEffect, useState } from 'react'
import { Alert, Skeleton } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded'
import { addInquiryItem } from '../../redux/slices/inquirySlice'
import { getProductBySlug } from '../../services/product.service'
import styles from './ProductDetailPage.module.scss'

const copy = {
  vi: { back: 'Tất cả sản phẩm', specs: 'Thông số kỹ thuật', add: 'Thêm vào danh sách báo giá', zoom: 'Rê chuột để phóng to', mixedTitle: 'Giải pháp Container Hỗn Hợp', mixed: 'Bạn đang tìm nguồn cung ứng linh hoạt? Chúng tôi chuyên phối trộn Container Hỗn Hợp (Tôm, Cá, Mực...) nhằm tối ưu chi phí vận chuyển và tồn kho. Liên hệ đội ngũ Sourcing của chúng tôi ngay hôm nay!', contact: 'Liên hệ đội ngũ Sourcing' },
  en: { back: 'All products', specs: 'Product Specifications', add: 'Add to Inquiry List', zoom: 'Hover to zoom', mixedTitle: 'Mixed Container Solutions', mixed: 'Looking for a flexible supply? We specialize in consolidating Mixed Containers (Shrimp, Fish, Cephalopods) to optimize your inventory and freight costs. Contact our Sourcing Team today!', contact: 'Contact our Sourcing Team' },
}

export function ProductDetailPage() {
  const { slug } = useParams()
  const lang = useSelector((state) => state.language.current)
  const inquiryItems = useSelector((state) => state.inquiry.items)
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState('')
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%')
  const text = copy[lang]
  useEffect(() => { getProductBySlug(slug).then((data) => { setError(''); setProduct(data); setActiveImage(data?.images?.[0]?.image_url || data?.thumbnail_url) }).catch((err) => setError(err.message)) }, [slug])
  useEffect(() => {
    if (!product) return
    const productName = lang === 'vi' ? product.name_vi : product.name_en
    document.title = `${productName} | Golden Seafood`
  }, [lang, product])
  if (error) return <main className={styles.loading}><Alert severity="error">{error}</Alert></main>
  if (!product) return <main className={styles.loading}><Skeleton variant="rectangular" height={540} /></main>

  const primaryName = lang === 'vi' ? product.name_vi : product.name_en
  const secondaryName = lang === 'vi' ? product.name_en : product.name_vi
  const primaryDescription = lang === 'vi' ? product.description_vi || product.short_desc_vi : product.description_en || product.short_desc_en
  const secondaryDescription = lang === 'vi' ? product.short_desc_en : product.short_desc_vi
  const images = product.images?.length ? product.images : [{ image_url: product.thumbnail_url }]
  const addToInquiry = () => {
    if (inquiryItems.some((item) => item.product_id === product.id)) {
      toast.info(lang === 'vi' ? 'Sản phẩm này đã có trong danh sách yêu cầu.' : 'This product is already in your inquiry list.')
      return
    }
    dispatch(addInquiryItem({ product_id: product.id, product_name: primaryName, quantity: 1, specifications: '', notes: '', slug: product.slug, thumbnail_url: product.thumbnail_url }))
    toast.success(lang === 'vi' ? `Đã thêm “${primaryName}” vào danh sách yêu cầu.` : `“${primaryName}” was added to your inquiry list.`)
  }
  const moveZoom = (event) => { const rect = event.currentTarget.getBoundingClientRect(); setZoomOrigin(`${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`) }

  return <main className={styles.page}>
    <div className={styles.container}>
      <Link to="/products" className={styles.back}><ArrowBackRoundedIcon />{text.back}</Link>
      <div className={styles.productLayout}>
        <section className={styles.gallery}>
          <div className={styles.mainImage} onMouseMove={moveZoom}><img src={activeImage} alt={primaryName} style={{ transformOrigin: zoomOrigin }} /><span><ZoomInRoundedIcon />{text.zoom}</span></div>
          <div className={styles.thumbnails}>{images.map((image) => <button key={image.id || image.image_url} className={activeImage === image.image_url ? styles.activeThumb : ''} onClick={() => setActiveImage(image.image_url)}><img src={image.image_url} alt="" loading="lazy" /></button>)}</div>
        </section>
        <section className={styles.details}>
          <p className={styles.category}>{lang === 'vi' ? product.category?.name_vi : product.category?.name_en}</p>
          <h1>{primaryName}</h1><p className={styles.secondaryName}>{secondaryName}</p>
          <div className={styles.description}><p>{primaryDescription}</p>{secondaryDescription ? <p>{secondaryDescription}</p> : null}</div>
          <button className={styles.inquiryButton} onClick={addToInquiry}><AddRoundedIcon />{text.add}</button>
          <section className={styles.specifications}><h2>{text.specs}</h2><div className={styles.specTable}>{product.specifications?.map((spec) => <div className={styles.specRow} key={spec.id || `${spec.spec_key_en}-${spec.spec_value}`}><div><strong>{lang === 'vi' ? spec.spec_key_vi : spec.spec_key_en}</strong><small>{lang === 'vi' ? spec.spec_key_en : spec.spec_key_vi}</small></div><p>{spec.spec_value}</p></div>)}</div></section>
        </section>
      </div>
      <aside className={styles.mixedBanner}><div><p>{text.mixedTitle}</p><h2>{text.mixed}</h2></div><Link to="/contact">{text.contact}<ArrowForwardRoundedIcon /></Link></aside>
    </div>
  </main>
}
