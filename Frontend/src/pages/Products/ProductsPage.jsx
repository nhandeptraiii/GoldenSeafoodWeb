import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Checkbox, Drawer, Pagination, Skeleton } from '@mui/material'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Link, useSearchParams } from 'react-router-dom'
import { ReferenceMarkup } from '../Reference/ReferenceMarkup'
import hero from '../Reference/templates/products-hero.html?raw'
import callout from '../Reference/templates/products-callout.html?raw'
import { useSelector } from 'react-redux'
import { ProductCard } from '../../components/ProductCard'
import { getCategories } from '../../services/category.service'
import { getCatalogueProducts } from '../../services/product.service'
import '../../assets/GoldenSeafoodNew/vendor/bootstrap-icons/bootstrap-icons.min.css'
import styles from './ProductsPage.module.scss'

const pageSize = 9
const copy = {
  vi: { eyebrow: 'Danh mục thủy sản đông lạnh', title: 'Sản phẩm của chúng tôi', subtitle: 'Khám phá danh mục thủy sản đông lạnh theo nhóm sản phẩm và loại hình chế biến, sau đó tạo danh sách yêu cầu báo giá.', search: 'Tìm theo tên sản phẩm...', filter: 'Bộ lọc sản phẩm', categories: 'Danh mục chính', all: 'Tất cả sản phẩm', type: 'Loại sản phẩm', results: 'sản phẩm', clear: 'Xóa bộ lọc', empty: 'Không tìm thấy sản phẩm phù hợp.', close: 'Đóng bộ lọc' },
  en: { eyebrow: 'Frozen Seafood Catalogue', title: 'Our Products', subtitle: 'Browse our frozen seafood catalogue by species group and processing type, then build your inquiry list.', search: 'Search products...', filter: 'Product filters', categories: 'Main categories', all: 'All products', type: 'Product type', results: 'products', clear: 'Clear filters', empty: 'No matching products found.', close: 'Close filters' },
}
const typeOptions = [
  { value: 'raw', vi: 'Tươi sống', en: 'Raw' },
  { value: 'cooked', vi: 'Hấp / Chín', en: 'Cooked' },
  { value: 'value_added', vi: 'Tẩm bột / Gia công sâu', en: 'Value-added / Breaded' },
]
function FilterPanel({ lang, text, categories, categoryId, setCategoryId, types, toggleType, clearFilters, onClose }) {
  return <aside className={styles.filterPanel}>
    <div className={styles.filterHeading}><span>{text.filter}</span>{onClose ? <button onClick={onClose} aria-label={text.close}><CloseRoundedIcon /></button> : null}</div>
    <div className={styles.filterGroup}><p>{text.categories}</p>
      <button className={!categoryId ? styles.activeCategory : ''} onClick={() => setCategoryId('')}><span>{text.all}</span></button>
      {categories.map((category) => <button key={category.id} className={String(categoryId) === String(category.id) ? styles.activeCategory : ''} onClick={() => setCategoryId(category.id)}><span>{lang === 'vi' ? category.name_vi : category.name_en}</span><small>{category.productCount ?? 0}</small></button>)}
    </div>
    <div className={styles.filterGroup}><p>{text.type}</p>{typeOptions.map((item) => <label className={styles.checkRow} key={item.value}><Checkbox size="small" checked={types.includes(item.value)} onChange={() => toggleType(item.value)} /><span>{lang === 'vi' ? item.vi : item.en}</span></label>)}</div>
    <div className={styles.customSpec}><p>{lang === 'vi' ? 'Cần quy cách chưa có trong danh mục?' : 'Need a specification not listed here?'}</p><Link to="/contact" className="btn btn-ocean btn-block btn-sm">{lang === 'vi' ? 'Yêu cầu quy cách riêng' : 'Request Custom Spec'}</Link></div>
    {(categoryId || types.length) ? <button className={styles.clearButton} onClick={clearFilters}>{text.clear}</button> : null}
  </aside>
}

export function ProductsPage() {
  const lang = useSelector((state) => state.language.current)
  const text = copy[lang]
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedCategory = searchParams.get('cat') || ''
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const categoryId = categories.find((category) => category.slug === requestedCategory)?.id || ''
  const [types, setTypes] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mobileFilters, setMobileFilters] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const panel = filterRef.current
    if (!panel) return
    // Let a tall filter scroll fully into view before its bottom becomes sticky.
    const updatePosition = () => {
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 84
      const top = Math.min(headerHeight + 20, window.innerHeight - panel.offsetHeight - 24)
      panel.style.setProperty('--filter-sticky-top', `${top}px`)
    }
    const observer = new ResizeObserver(updatePosition)
    observer.observe(panel)
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => { observer.disconnect(); window.removeEventListener('resize', updatePosition) }
  }, [])

  useEffect(() => {
    let active = true
    getCategories().then((data) => { if (active) setCategories(data) }).catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [])
  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getCatalogueProducts(requestedCategory)
        if (active) { setProducts(data); setPage(1) }
      } catch (err) {
        if (active) { setProducts([]); setError(err.message) }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [requestedCategory])
  const filtered = useMemo(() => products.filter((product) => {
    const query = search.trim().toLocaleLowerCase()
    const matchesSearch = !query || [product.name_en, product.name_vi, product.short_desc_en, product.short_desc_vi].some((value) => value?.toLocaleLowerCase().includes(query))
    const matchesType = !types.length || types.includes(product.product_type)
    return matchesSearch && matchesType
  }), [products, search, types])
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const showAllProducts = !requestedCategory
  const visibleProducts = showAllProducts ? filtered : filtered.slice((page - 1) * pageSize, page * pageSize)
  const selectCategory = (value) => {
    const category = categories.find((item) => String(item.id) === String(value))
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (category) next.set('cat', category.slug)
      else next.delete('cat')
      return next
    })
    setPage(1)
    setMobileFilters(false)
  }
  const toggleType = (value) => { setTypes((current) => current.includes(value) ? current.filter((type) => type !== value) : [...current, value]); setPage(1) }
  const clearFilters = () => { selectCategory(''); setTypes([]); setPage(1) }
  const panelProps = { lang, text, categories, categoryId, setCategoryId: selectCategory, types, toggleType, clearFilters }

  return <main className={styles.page}>
    <ReferenceMarkup html={hero} />
    <div className={styles.layout}>
      <div ref={filterRef} className={styles.desktopFilter}><FilterPanel {...panelProps} /></div>
      <section className={styles.catalog}>
        <div className={styles.toolbar}>
          <div className={styles.search}><SearchRoundedIcon /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder={text.search} aria-label={text.search} /></div>
          <button className={styles.mobileFilterButton} onClick={() => setMobileFilters(true)}><FilterListRoundedIcon />{text.filter}{categoryId || types.length ? <b>{types.length + (categoryId ? 1 : 0)}</b> : null}</button>
          <p><strong>{filtered.length}</strong> {text.results}</p>
        </div>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? <div className={styles.grid}>{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} variant="rectangular" className={styles.skeleton} />)}</div> : null}
        {!loading && visibleProducts.length ? <div className={styles.grid}>{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : null}
        {!loading && !visibleProducts.length && !error ? <div className={styles.empty}>{text.empty}</div> : null}
        {!showAllProducts && pages > 1 ? <Pagination page={page} count={pages} onChange={(_, value) => { setPage(value); window.scrollTo({ top: 260, behavior: 'smooth' }) }} color="primary" className={styles.pagination} /> : null}
      </section>
    </div>
    <ReferenceMarkup html={callout} />
    <Drawer anchor="left" open={mobileFilters} onClose={() => setMobileFilters(false)}><FilterPanel {...panelProps} onClose={() => setMobileFilters(false)} /></Drawer>
  </main>
}

