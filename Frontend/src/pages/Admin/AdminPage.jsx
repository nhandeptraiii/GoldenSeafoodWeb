import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LogoutIcon from '@mui/icons-material/Logout'
import UploadIcon from '@mui/icons-material/Upload'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { toggleLanguage } from '../../redux/slices/languageSlice'
import logo from '../../assets/logo.png'
import styles from './AdminPage.module.scss'
import {
  adminLogin,
  clearAdminSession,
  deleteAdminInquiry,
  getAdminInquiryById,
  getAdminInquiries,
  getAdminProfile,
  getStoredAdminSession,
  saveAdminSession,
  updateAdminInquiryStatus,
} from '../../services/admin.service'
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../../services/category.service'
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProductById,
  getAdminProducts,
  updateAdminProduct,
} from '../../services/product.service'
import { uploadCategoryIcon, uploadProductImage } from '../../services/upload.service'

const PRODUCT_LIMIT = 8
const INQUIRY_LIMIT = 10

const emptyCategoryForm = {
  id: null,
  name_en: '',
  name_vi: '',
  icon_url: '',
  sort_order: 0,
  is_active: true,
}

const emptyProductForm = {
  id: null,
  category_id: '',
  name_en: '',
  name_vi: '',
  short_desc_en: '',
  short_desc_vi: '',
  description_en: '',
  description_vi: '',
  images: [],
  product_type: 'raw',
  is_featured: false,
  is_active: true,
  sort_order: 0,
  specifications: [{ spec_key_en: '', spec_key_vi: '', spec_value: '' }],
}

const defaultInquiryFilters = {
  search: '',
  status: '',
  source: '',
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'processing', label: 'Processing' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'closed', label: 'Closed' },
]

const sourceOptions = [
  { value: 'contact_form', label: 'Contact form' },
  { value: 'inquiry_basket', label: 'Inquiry basket' },
]

const productTypeOptions = [
  { value: 'raw', label: 'Raw' },
  { value: 'cooked', label: 'Cooked' },
  { value: 'value_added', label: 'Value added' },
]

function formatDate(value) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString('vi-VN')
}

function normalizeSpecifications(specifications) {
  if (!Array.isArray(specifications)) return []
  return specifications
    .filter((item) => item.spec_key_en?.trim() || item.spec_key_vi?.trim() || item.spec_value?.trim())
    .map((item, index) => ({
    spec_key_en: item.spec_key_en || '',
    spec_key_vi: item.spec_key_vi || '',
    spec_value: item.spec_value || '',
    sort_order: index + 1,
  }))
}

function getStatusColor(status) {
  switch (status) {
    case 'new':
      return 'error'
    case 'processing':
      return 'warning'
    case 'quoted':
      return 'info'
    case 'closed':
      return 'success'
    default:
      return 'default'
  }
}

const adminCopy = {
  vi: {
    portal: 'Cổng quản trị', management: 'Quản lý website', signInText: 'Đăng nhập để quản lý danh mục, sản phẩm và yêu cầu báo giá.', username: 'Tên đăng nhập', password: 'Mật khẩu', signingIn: 'Đang đăng nhập...', signIn: 'Đăng nhập',
    loggedIn: 'Đăng nhập với tài khoản', logout: 'Đăng xuất', loading: 'Đang tải cổng quản trị...', overview: 'Tổng quan', categories: 'Danh mục', products: 'Sản phẩm', inquiries: 'Yêu cầu báo giá',
    categoryHint: 'Nhóm danh mục hiện có', productHint: 'Sản phẩm trong catalog', newHint: 'Đang chờ xử lý', visibleHint: 'Bản ghi gần nhất',
    overviewTitle: 'Tổng quan quản trị', overviewText: 'Theo dõi nhanh catalog và trạng thái yêu cầu báo giá.', categoryTitle: 'Quản lý danh mục', categoryText: 'Tạo, cập nhật và quản lý các nhóm sản phẩm.', productTitle: 'Quản lý sản phẩm', productText: 'Quản lý nội dung, trạng thái và thông số kỹ thuật.', inquiryTitle: 'Quản lý yêu cầu báo giá', inquiryText: 'Xem yêu cầu mới và cập nhật tiến trình xử lý.',
    newCategory: 'Thêm danh mục', newProduct: 'Thêm sản phẩm', apply: 'Áp dụng bộ lọc', language: 'VI / EN',
  },
  en: {
    portal: 'Admin Portal', management: 'Website Management', signInText: 'Sign in to manage categories, products and inquiries.', username: 'Username', password: 'Password', signingIn: 'Signing in...', signIn: 'Sign in',
    loggedIn: 'Logged in as', logout: 'Logout', loading: 'Loading admin portal...', overview: 'Overview', categories: 'Categories', products: 'Products', inquiries: 'Inquiries',
    categoryHint: 'Active taxonomy items', productHint: 'Catalog entries', newHint: 'Waiting for first action', visibleHint: 'Latest records',
    overviewTitle: 'Admin overview', overviewText: 'Quick access to the current catalog and inquiry state.', categoryTitle: 'Category management', categoryText: 'Create, update and manage catalog groups.', productTitle: 'Product management', productText: 'Manage product metadata, status and technical specifications.', inquiryTitle: 'Inquiry management', inquiryText: 'Review incoming requests and move them through the workflow.',
    newCategory: 'New category', newProduct: 'New product', apply: 'Apply filters', language: 'EN / VI',
  },
}

function getAttachmentUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  const backendOrigin = new URL(apiBaseUrl, window.location.origin).origin
  return new URL(path.replace(/^\/+/, ''), `${backendOrigin}/`).toString()
}

function showAdminFormError(error, lang) {
  if (error.validationErrors?.length) {
    error.validationErrors.forEach((item) => {
      const field = item.field ? `${item.field}: ` : ''
      toast.error(`${field}${item.message}`)
    })
    return
  }
  toast.error(error.message || (lang === 'vi' ? 'Không thể lưu dữ liệu.' : 'Unable to save the form.'))
}

function AdminLoginCard({ form, onChange, onSubmit, loading, error, lang, onToggleLanguage }) {
  const text = adminCopy[lang]
  return (
    <Box className={styles.loginPage}>
      <Box className={styles.loginVisual}>
        <img src={logo} alt="Golden Seafood" />
        <p>GOLDEN SEAFOOD</p>
        <span>{lang === 'vi' ? 'Nguồn hàng Việt Nam · Tiêu chuẩn toàn cầu' : 'Vietnamese sourcing · Global standards'}</span>
      </Box>
      <Paper component="form" onSubmit={(event) => { event.preventDefault(); onSubmit() }} elevation={0} className={styles.loginCard}>
        <Button className={styles.loginLanguage} variant="outlined" onClick={onToggleLanguage}>{text.language}</Button>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 2 }}>
              {text.portal}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              {text.management}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {text.signInText}
            </Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            label={text.username}
            value={form.username}
            onChange={(event) => onChange('username', event.target.value)}
            fullWidth
          />
          <TextField
            label={text.password}
            type="password"
            value={form.password}
            onChange={(event) => onChange('password', event.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? text.signingIn : text.signIn}
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography color="text.secondary">{subtitle}</Typography>
      </Box>
      {action}
    </Stack>
  )
}

function StatCard({ label, value, hint }) {
  return (
    <Paper sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
        {value}
      </Typography>
      <Typography color="text.secondary" variant="caption">
        {hint}
      </Typography>
    </Paper>
  )
}

export function AdminPage() {
  const lang = useSelector((state) => state.language.current)
  const dispatch = useDispatch()
  const text = adminCopy[lang]
  const [bootstrapping, setBootstrapping] = useState(true)
  const [auth, setAuth] = useState({ token: '', user: null })
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    document.title = `${lang === 'vi' ? 'Quản trị' : 'Administration'} | Golden Seafood`
    document.documentElement.lang = lang
  }, [lang])

  const [tab, setTab] = useState(0)
  const [alert, setAlert] = useState('')
  const [loading, setLoading] = useState({ categories: false, products: false, inquiries: false })

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [productPagination, setProductPagination] = useState({ page: 1, totalPages: 1 })
  const [productFilters, setProductFilters] = useState({ search: '', category_id: '', type: '' })

  const [inquiries, setInquiries] = useState([])
  const [inquiryPagination, setInquiryPagination] = useState({ page: 1, totalPages: 1 })
  const [inquiryFilters, setInquiryFilters] = useState(defaultInquiryFilters)

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm)
  const [categorySaving, setCategorySaving] = useState(false)
  const [categoryUpload, setCategoryUpload] = useState({ loading: false, error: '', success: false, preview: '' })

  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [productForm, setProductForm] = useState(emptyProductForm)
  const [productSaving, setProductSaving] = useState(false)
  const [productUpload, setProductUpload] = useState({ loading: false, error: '', success: false, preview: '' })

  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [inquiryLoading, setInquiryLoading] = useState(false)

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((category) => [String(category.id), category])),
    [categories],
  )

  const newInquiryCount = useMemo(
    () => inquiries.filter((item) => item.status === 'new').length,
    [inquiries],
  )

  const loadCategories = async () => {
    setLoading((current) => ({ ...current, categories: true }))
    try {
      setCategories(await getAdminCategories())
    } catch (error) {
      setAlert(error.message)
    } finally {
      setLoading((current) => ({ ...current, categories: false }))
    }
  }

  const loadProducts = async (nextPage = productPagination.page) => {
    setLoading((current) => ({ ...current, products: true }))
    try {
      const data = await getAdminProducts({
        page: nextPage,
        limit: PRODUCT_LIMIT,
        search: productFilters.search || undefined,
        category_id: productFilters.category_id || undefined,
        type: productFilters.type || undefined,
      })
      setProducts(data.products || [])
      setProductPagination(data.pagination || { page: 1, totalPages: 1 })
    } catch (error) {
      setAlert(error.message)
    } finally {
      setLoading((current) => ({ ...current, products: false }))
    }
  }

  const loadInquiries = async (nextPage = inquiryPagination.page) => {
    setLoading((current) => ({ ...current, inquiries: true }))
    try {
      const data = await getAdminInquiries({
        page: nextPage,
        limit: INQUIRY_LIMIT,
        search: inquiryFilters.search || undefined,
        status: inquiryFilters.status || undefined,
        source: inquiryFilters.source || undefined,
      })
      setInquiries(data.inquiries || [])
      setInquiryPagination(data.pagination || { page: 1, totalPages: 1 })
    } catch (error) {
      setAlert(error.message)
    } finally {
      setLoading((current) => ({ ...current, inquiries: false }))
    }
  }

  useEffect(() => {
    const initialize = async () => {
      const session = getStoredAdminSession()
      if (!session.token) {
        setBootstrapping(false)
        return
      }

      setAuth(session)
      try {
        const profile = await getAdminProfile()
        setAuth({ token: session.token, user: profile })
        const [categoriesData, productsData, inquiriesData] = await Promise.all([
          getAdminCategories(),
          getAdminProducts({ page: 1, limit: PRODUCT_LIMIT }),
          getAdminInquiries({ page: 1, limit: INQUIRY_LIMIT }),
        ])

        setCategories(categoriesData)
        setProducts(productsData.products || [])
        setProductPagination(productsData.pagination || { page: 1, totalPages: 1 })
        setInquiries(inquiriesData.inquiries || [])
        setInquiryPagination(inquiriesData.pagination || { page: 1, totalPages: 1 })
      } catch (error) {
        clearAdminSession()
        setAuth({ token: '', user: null })
        setLoginError(error.message)
      } finally {
        setBootstrapping(false)
      }
    }

    initialize()
  }, [])

  const handleLogin = async () => {
    setLoginLoading(true)
    setLoginError('')
    try {
      const data = await adminLogin(loginForm)
      const session = { token: data.token, user: data.user }
      saveAdminSession(session)
      setAuth(session)
      const [categoriesData, productsData, inquiriesData] = await Promise.all([
        getAdminCategories(),
        getAdminProducts({ page: 1, limit: PRODUCT_LIMIT }),
        getAdminInquiries({ page: 1, limit: INQUIRY_LIMIT }),
      ])

      setCategories(categoriesData)
      setProducts(productsData.products || [])
      setProductPagination(productsData.pagination || { page: 1, totalPages: 1 })
      setInquiries(inquiriesData.inquiries || [])
      setInquiryPagination(inquiriesData.pagination || { page: 1, totalPages: 1 })
    } catch (error) {
      setLoginError(error.message)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    clearAdminSession()
    setAuth({ token: '', user: null })
    setCategories([])
    setProducts([])
    setInquiries([])
  }

  const openCategoryDialog = (category = null) => {
    if (category) {
      setCategoryForm({
        id: category.id,
        name_en: category.name_en || '',
        name_vi: category.name_vi || '',
        icon_url: category.icon_url || '',
        sort_order: category.sort_order ?? 0,
        is_active: Boolean(category.is_active),
      })
    } else {
      setCategoryForm(emptyCategoryForm)
    }
    setCategoryUpload({
      loading: false,
      error: '',
      success: Boolean(category?.icon_url),
      preview: category?.icon_url || '',
    })
    setCategoryDialogOpen(true)
  }

  const saveCategory = async () => {
    if (categoryUpload.loading || !categoryUpload.success || !categoryForm.icon_url) {
      setCategoryUpload((current) => ({ ...current, error: 'Upload an icon successfully before saving.' }))
      return
    }

    setCategorySaving(true)
    try {
      const payload = {
        name_en: categoryForm.name_en,
        name_vi: categoryForm.name_vi,
        icon_url: categoryForm.icon_url,
        sort_order: Number(categoryForm.sort_order || 0),
        is_active: categoryForm.is_active,
      }
      if (categoryForm.id) {
        await updateAdminCategory(categoryForm.id, payload)
      } else {
        await createAdminCategory(payload)
      }
      setCategoryDialogOpen(false)
      await loadCategories()
    } catch (error) {
      setAlert(error.message)
      showAdminFormError(error, lang)
    } finally {
      setCategorySaving(false)
    }
  }

  const uploadIcon = async (file) => {
    if (!file) return

    const preview = URL.createObjectURL(file)
    setCategoryForm((current) => ({ ...current, icon_url: '' }))
    setCategoryUpload({ loading: true, error: '', success: false, preview })
    try {
      const url = await uploadCategoryIcon(file)
      setCategoryForm((current) => ({ ...current, icon_url: url }))
      setCategoryUpload({ loading: false, error: '', success: true, preview: url })
    } catch (error) {
      setCategoryUpload({ loading: false, error: error.message, success: false, preview })
      showAdminFormError(error, lang)
    }
  }

  const removeCategory = async (category) => {
    if (!window.confirm(`Delete category ${category.name_en}?`)) {
      return
    }

    try {
      await deleteAdminCategory(category.id)
      await loadCategories()
    } catch (error) {
      setAlert(error.message)
    }
  }

  const openProductDialog = async (product = null) => {
    setAlert('')
    if (!categories.length) {
      await loadCategories()
    }

    if (!product) {
      setProductForm(emptyProductForm)
      setProductUpload({ loading: false, error: '', success: false, preview: '' })
      setProductDialogOpen(true)
      return
    }

    try {
      const detail = await getAdminProductById(product.id)
      setProductForm({
        id: detail.id,
        category_id: detail.category_id || '',
        name_en: detail.name_en || '',
        name_vi: detail.name_vi || '',
        short_desc_en: detail.short_desc_en || '',
        short_desc_vi: detail.short_desc_vi || '',
        description_en: detail.description_en || '',
        description_vi: detail.description_vi || '',
        images: (detail.images || []).map((item, index) => ({ image_url: item.image_url, alt_text: item.alt_text || '', is_primary: Boolean(item.is_primary) || (!detail.images?.some((image) => image.is_primary) && index === 0) })),
        product_type: detail.product_type || 'raw',
        is_featured: Boolean(detail.is_featured),
        is_active: Boolean(detail.is_active),
        sort_order: detail.sort_order ?? 0,
        specifications: detail.specifications?.length
          ? detail.specifications.map((item) => ({ spec_key_en: item.spec_key_en || '', spec_key_vi: item.spec_key_vi || '', spec_value: item.spec_value || '' }))
          : [{ spec_key_en: '', spec_key_vi: '', spec_value: '' }],
      })
      setProductUpload({
        loading: false,
        error: '',
        success: Boolean(detail.images?.length),
        preview: '',
      })
      setProductDialogOpen(true)
    } catch (error) {
      setAlert(error.message)
    }
  }

  const saveProduct = async () => {
    if (productUpload.loading || !productForm.images.length) {
      const message = lang === 'vi' ? 'Vui lòng tải lên ít nhất một ảnh sản phẩm.' : 'Upload at least one product image before saving.'
      setProductUpload((current) => ({ ...current, error: message }))
      toast.error(message)
      return
    }

    setProductSaving(true)
    setAlert('')
    try {
      const payload = {
        ...productForm,
        category_id: Number(productForm.category_id),
        sort_order: Number(productForm.sort_order || 0),
        images: productForm.images.map((image, index) => ({ image_url: image.image_url, alt_text: image.alt_text || productForm.name_en, is_primary: image.is_primary, sort_order: index })),
        specifications: normalizeSpecifications(productForm.specifications),
      }

      delete payload.id

      if (productForm.id) {
        await updateAdminProduct(productForm.id, payload)
      } else {
        await createAdminProduct(payload)
      }

      setProductDialogOpen(false)
      await Promise.all([loadProducts(), loadCategories()])
    } catch (error) {
      setAlert(error.message)
      showAdminFormError(error, lang)
    } finally {
      setProductSaving(false)
    }
  }

  const uploadProductImages = async (files) => {
    const selectedFiles = Array.from(files || [])
    if (!selectedFiles.length) return
    setProductUpload((current) => ({ ...current, loading: true, error: '' }))
    try {
      const urls = await Promise.all(selectedFiles.map((file) => uploadProductImage(file)))
      setProductForm((current) => {
        const hasPrimary = current.images.some((image) => image.is_primary)
        const appended = urls.map((url, index) => ({ image_url: url, alt_text: current.name_en ? `${current.name_en}${current.images.length + index ? ` - ${current.images.length + index}` : ''}` : selectedFiles[index].name.replace(/\.[^.]+$/, ''), is_primary: !hasPrimary && index === 0 }))
        return { ...current, images: [...current.images, ...appended] }
      })
      setProductUpload({ loading: false, error: '', success: true, preview: '' })
      toast.success(lang === 'vi' ? `Đã tải lên ${urls.length} ảnh.` : `${urls.length} images uploaded.`)
    } catch (error) {
      setProductUpload({ loading: false, error: error.message, success: false, preview: '' })
      showAdminFormError(error, lang)
    }
  }

  const setPrimaryProductImage = (index) => {
    setProductForm((current) => ({ ...current, images: current.images.map((image, imageIndex) => ({ ...image, is_primary: imageIndex === index })) }))
  }

  const updateProductImageAlt = (index, value) => {
    setProductForm((current) => ({ ...current, images: current.images.map((image, imageIndex) => imageIndex === index ? { ...image, alt_text: value } : image) }))
  }

  const removeProductImage = (index) => {
    setProductForm((current) => {
      const removedPrimary = current.images[index]?.is_primary
      const images = current.images.filter((_, imageIndex) => imageIndex !== index)
      return { ...current, images: removedPrimary && images.length ? images.map((image, imageIndex) => ({ ...image, is_primary: imageIndex === 0 })) : images }
    })
  }

  const addSpecificationRow = () => {
    setProductForm((current) => ({ ...current, specifications: [...current.specifications, { spec_key_en: '', spec_key_vi: '', spec_value: '' }] }))
  }

  const updateSpecificationRow = (index, field, value) => {
    setProductForm((current) => ({ ...current, specifications: current.specifications.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }))
  }

  const removeSpecificationRow = (index) => {
    setProductForm((current) => ({ ...current, specifications: current.specifications.filter((_, itemIndex) => itemIndex !== index) }))
  }

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete product ${product.name_en}?`)) {
      return
    }

    try {
      await deleteAdminProduct(product.id)
      await Promise.all([loadProducts(), loadCategories()])
    } catch (error) {
      setAlert(error.message)
    }
  }

  const openInquiryDialog = async (inquiry) => {
    setInquiryLoading(true)
    setInquiryDialogOpen(true)
    try {
      setSelectedInquiry(await getAdminInquiryById(inquiry.id))
    } catch (error) {
      setAlert(error.message)
      setInquiryDialogOpen(false)
    } finally {
      setInquiryLoading(false)
    }
  }

  const saveInquiryStatus = async (status) => {
    if (!selectedInquiry) {
      return
    }

    try {
      await updateAdminInquiryStatus(selectedInquiry.id, status)
      const updated = await getAdminInquiryById(selectedInquiry.id)
      setSelectedInquiry(updated)
      await loadInquiries()
    } catch (error) {
      setAlert(error.message)
    }
  }

  const removeInquiry = async (inquiry) => {
    if (!window.confirm(`Delete inquiry ${inquiry.inquiry_code}?`)) {
      return
    }

    try {
      await deleteAdminInquiry(inquiry.id)
      await loadInquiries()
      if (selectedInquiry?.id === inquiry.id) {
        setInquiryDialogOpen(false)
      }
    } catch (error) {
      setAlert(error.message)
    }
  }

  const summaryCards = useMemo(
    () => [
      { label: text.categories, value: categories.length, hint: text.categoryHint },
      { label: text.products, value: productPagination?.totalItems ?? products.length, hint: text.productHint },
      { label: lang === 'vi' ? 'Yêu cầu mới' : 'New inquiries', value: newInquiryCount, hint: text.newHint },
      { label: lang === 'vi' ? 'Yêu cầu hiển thị' : 'Visible inquiries', value: inquiryPagination?.totalItems ?? inquiries.length, hint: text.visibleHint },
    ],
    [categories.length, inquiries.length, newInquiryCount, productPagination?.totalItems, products.length, inquiryPagination?.totalItems, lang, text],
  )

  if (bootstrapping) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Typography>{text.loading}</Typography>
        </Paper>
      </Container>
    )
  }

  if (!auth.token) {
    return (
      <AdminLoginCard
        form={loginForm}
        error={loginError}
        loading={loginLoading}
        onChange={(field, value) => setLoginForm((current) => ({ ...current, [field]: value }))}
        onSubmit={handleLogin}
        lang={lang}
        onToggleLanguage={() => dispatch(toggleLanguage())}
      />
    )
  }

  return (
    <Box className={styles.adminRoot}>
      <AppBar position="sticky" elevation={0} className={styles.adminBar}>
        <Toolbar className={styles.adminToolbar}>
          <Box className={styles.adminBrand}>
            <img src={logo} alt="Golden Seafood" />
            <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Golden Seafood Admin
            </Typography>
            <Typography variant="caption">
              {text.loggedIn} {auth.user?.full_name || auth.user?.username || 'admin'}
            </Typography>
            </Box>
          </Box>
          <Box className={styles.adminActions}><Button variant="outlined" onClick={() => dispatch(toggleLanguage())}>{text.language}</Button><Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>{text.logout}</Button></Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" className={styles.adminContent}>
        {alert ? (
          <Alert severity="info" sx={{ mb: 2 }} onClose={() => setAlert('')}>
            {alert}
          </Alert>
        ) : null}

        <Grid container spacing={2} sx={{ mb: 3 }} className={styles.statGrid}>
          {summaryCards.map((item) => (
            <Grid key={item.label} item xs={12} sm={6} lg={3}>
              <StatCard {...item} />
            </Grid>
          ))}
        </Grid>

        <Paper className={styles.workspace}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ px: 2, pt: 1 }}>
            <Tab label={text.overview} />
            <Tab label={text.categories} />
            <Tab label={text.products} />
            <Tab label={text.inquiries} />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tab === 0 ? (
              <Stack spacing={3}>
                <SectionHeader
                  title={text.overviewTitle}
                  subtitle={text.overviewText}
                  action={null}
                />
                <Grid container spacing={2}>
                  {categories.slice(0, 5).map((category) => (
                    <Grid key={category.id} item xs={12} sm={6} md={4} lg={3}>
                      <Paper sx={{ p: 2.5, borderRadius: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {category.name_en}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.name_vi}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                          <Chip size="small" label={category.slug} />
                          <Chip size="small" label={`${category.productCount || 0} products`} />
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            ) : null}

            {tab === 1 ? (
              <Stack spacing={2}>
                <SectionHeader
                  title={text.categoryTitle}
                  subtitle={text.categoryText}
                  action={
                    <Button
                      startIcon={<AddIcon />}
                      variant="contained"
                      onClick={() => openCategoryDialog()}
                      disabled={loading.categories}
                    >
                      {text.newCategory}
                    </Button>
                  }
                />

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>EN</TableCell>
                        <TableCell>VI</TableCell>
                        <TableCell>Slug</TableCell>
                        <TableCell>{text.products}</TableCell>
                        <TableCell>{lang === 'vi' ? 'Trạng thái' : 'Status'}</TableCell>
                        <TableCell align="right">{lang === 'vi' ? 'Thao tác' : 'Actions'}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id} hover>
                          <TableCell>{category.name_en}</TableCell>
                          <TableCell>{category.name_vi}</TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell>{category.productCount || 0}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              color={category.is_active ? 'success' : 'default'}
                              label={category.is_active ? 'Active' : 'Inactive'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton onClick={() => openCategoryDialog(category)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton onClick={() => removeCategory(category)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            ) : null}

            {tab === 2 ? (
              <Stack spacing={2}>
                <SectionHeader
                  title={text.productTitle}
                  subtitle={text.productText}
                  action={
                    <Button
                      startIcon={<AddIcon />}
                      variant="contained"
                      onClick={() => openProductDialog()}
                      disabled={loading.products}
                    >
                      {text.newProduct}
                    </Button>
                  }
                />

                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label={lang === 'vi' ? 'Tìm kiếm' : 'Search'}
                      value={productFilters.search}
                      onChange={(event) =>
                        setProductFilters((current) => ({ ...current, search: event.target.value }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Select
                      fullWidth
                      size="small"
                      value={productFilters.category_id}
                      displayEmpty
                      onChange={(event) =>
                        setProductFilters((current) => ({ ...current, category_id: event.target.value }))
                      }
                    >
                      <MenuItem value="">{lang === 'vi' ? 'Tất cả danh mục' : 'All categories'}</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name_en}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Select
                      fullWidth
                      size="small"
                      value={productFilters.type}
                      displayEmpty
                      onChange={(event) =>
                        setProductFilters((current) => ({ ...current, type: event.target.value }))
                      }
                    >
                      <MenuItem value="">{lang === 'vi' ? 'Tất cả loại' : 'All types'}</MenuItem>
                      {productTypeOptions.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>

                <Button
                  variant="outlined"
                  onClick={() => loadProducts(1)}
                  sx={{ alignSelf: 'flex-start' }}
                  disabled={loading.products}
                >
                  {text.apply}
                </Button>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{lang === 'vi' ? 'Sản phẩm' : 'Product'}</TableCell>
                        <TableCell>{lang === 'vi' ? 'Danh mục' : 'Category'}</TableCell>
                        <TableCell>{lang === 'vi' ? 'Loại' : 'Type'}</TableCell>
                        <TableCell>{lang === 'vi' ? 'Thuộc tính' : 'Flags'}</TableCell>
                        <TableCell>Slug</TableCell>
                        <TableCell align="right">{lang === 'vi' ? 'Thao tác' : 'Actions'}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} hover>
                          <TableCell>
                            <Stack spacing={0.4}>
                              <Typography fontWeight={700}>{product.name_en}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {product.name_vi}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{product.category?.name_en || categoryMap[String(product.category_id)]?.name_en || '-'}</TableCell>
                          <TableCell>
                            <Chip size="small" label={product.product_type} />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Chip size="small" color={product.is_featured ? 'secondary' : 'default'} label={product.is_featured ? 'Featured' : 'Normal'} />
                              <Chip size="small" color={product.is_active ? 'success' : 'default'} label={product.is_active ? 'Active' : 'Inactive'} />
                            </Stack>
                          </TableCell>
                          <TableCell>{product.slug}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton onClick={() => openProductDialog(product)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton onClick={() => removeProduct(product)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                  <Pagination
                    page={productPagination.page || 1}
                    count={productPagination.totalPages || 1}
                    onChange={(_, value) => loadProducts(value)}
                  />
                </Box>
              </Stack>
            ) : null}

            {tab === 3 ? (
              <Stack spacing={2}>
                <SectionHeader
                  title={text.inquiryTitle}
                  subtitle={text.inquiryText}
                />

                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label={lang === 'vi' ? 'Tìm kiếm' : 'Search'}
                      value={inquiryFilters.search}
                      onChange={(event) =>
                        setInquiryFilters((current) => ({ ...current, search: event.target.value }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Select
                      fullWidth
                      size="small"
                      displayEmpty
                      value={inquiryFilters.status}
                      onChange={(event) =>
                        setInquiryFilters((current) => ({ ...current, status: event.target.value }))
                      }
                    >
                      <MenuItem value="">{lang === 'vi' ? 'Tất cả trạng thái' : 'All statuses'}</MenuItem>
                      {statusOptions.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Select
                      fullWidth
                      size="small"
                      displayEmpty
                      value={inquiryFilters.source}
                      onChange={(event) =>
                        setInquiryFilters((current) => ({ ...current, source: event.target.value }))
                      }
                    >
                      <MenuItem value="">{lang === 'vi' ? 'Tất cả nguồn' : 'All sources'}</MenuItem>
                      {sourceOptions.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>

                <Button
                  variant="outlined"
                  onClick={() => loadInquiries(1)}
                  sx={{ alignSelf: 'flex-start' }}
                  disabled={loading.inquiries}
                >
                  {text.apply}
                </Button>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{lang === 'vi' ? 'Mã' : 'Code'}</TableCell>
                        <TableCell>{lang === 'vi' ? 'Khách hàng' : 'Customer'}</TableCell>
                        <TableCell>{lang === 'vi' ? 'Công ty' : 'Company'}</TableCell>
                        <TableCell>{lang === 'vi' ? 'Trạng thái' : 'Status'}</TableCell>
                        <TableCell>{lang === 'vi' ? 'Nguồn' : 'Source'}</TableCell>
                        <TableCell>{lang === 'vi' ? 'Ngày tạo' : 'Created'}</TableCell>
                        <TableCell align="right">{lang === 'vi' ? 'Thao tác' : 'Actions'}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inquiries.map((inquiry) => (
                        <TableRow key={inquiry.id} hover>
                          <TableCell>{inquiry.inquiry_code}</TableCell>
                          <TableCell>
                            <Stack spacing={0.4}>
                              <Typography fontWeight={700}>{inquiry.full_name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {inquiry.email}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{inquiry.company_name}</TableCell>
                          <TableCell>
                            <Chip size="small" color={getStatusColor(inquiry.status)} label={inquiry.status} />
                          </TableCell>
                          <TableCell>{inquiry.source}</TableCell>
                          <TableCell>{formatDate(inquiry.created_at)}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Button size="small" variant="outlined" onClick={() => openInquiryDialog(inquiry)}>
                                {lang === 'vi' ? 'Xem' : 'View'}
                              </Button>
                              <IconButton onClick={() => removeInquiry(inquiry)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                  <Pagination
                    page={inquiryPagination.page || 1}
                    count={inquiryPagination.totalPages || 1}
                    onChange={(_, value) => loadInquiries(value)}
                  />
                </Box>
              </Stack>
            ) : null}
          </Box>
        </Paper>
      </Container>

      <Dialog open={categoryDialogOpen} onClose={() => !categoryUpload.loading && setCategoryDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{categoryForm.id ? 'Edit category' : 'New category'}</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="English name"
              value={categoryForm.name_en}
              onChange={(event) => setCategoryForm((current) => ({ ...current, name_en: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Vietnamese name"
              value={categoryForm.name_vi}
              onChange={(event) => setCategoryForm((current) => ({ ...current, name_vi: event.target.value }))}
              fullWidth
            />
            {categoryUpload.preview ? (
              <Box
                component="img"
                src={categoryUpload.preview}
                alt="Category icon preview"
                sx={{ width: 96, height: 96, objectFit: 'contain', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1 }}
              />
            ) : null}
            <Button component="label" variant="outlined" startIcon={categoryUpload.loading ? <CircularProgress size={18} /> : <UploadIcon />} disabled={categoryUpload.loading}>
              {categoryUpload.loading ? 'Uploading icon...' : 'Select and upload icon'}
              <input hidden type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" onChange={(event) => uploadIcon(event.target.files?.[0])} />
            </Button>
            {categoryUpload.success ? <Alert severity="success">Icon uploaded successfully.</Alert> : null}
            {categoryUpload.error ? <Alert severity="error">{categoryUpload.error}</Alert> : null}
            <TextField
              label="Sort order"
              type="number"
              value={categoryForm.sort_order}
              onChange={(event) => setCategoryForm((current) => ({ ...current, sort_order: event.target.value }))}
              fullWidth
            />
            <Select
              value={categoryForm.is_active ? 'true' : 'false'}
              onChange={(event) =>
                setCategoryForm((current) => ({ ...current, is_active: event.target.value === 'true' }))
              }
              fullWidth
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogOpen(false)} disabled={categoryUpload.loading || categorySaving}>Cancel</Button>
          <Button variant="contained" onClick={saveCategory} disabled={categoryUpload.loading || categorySaving || !categoryUpload.success || !categoryForm.icon_url}>
            {categorySaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={productDialogOpen} onClose={() => !productUpload.loading && setProductDialogOpen(false)} fullWidth maxWidth="md" className={styles.productDialog}>
        <DialogTitle className={styles.productDialogTitle}>
          <span>{productForm.id ? (lang === 'vi' ? 'Chỉnh sửa sản phẩm' : 'Edit product') : (lang === 'vi' ? 'Thêm sản phẩm mới' : 'New product')}</span>
          <small>{lang === 'vi' ? 'Cập nhật nội dung song ngữ, hình ảnh và thông số kỹ thuật.' : 'Manage bilingual content, imagery and technical specifications.'}</small>
        </DialogTitle>
        <DialogContent className={styles.productDialogContent}>
          <Stack spacing={3}>
            <Grid container spacing={2.2} alignItems="stretch">
              <Grid size={{ xs: 12 }}><Typography className={styles.formSectionTitle}>{lang === 'vi' ? '01 · Thông tin cơ bản' : '01 · Basic information'}</Typography></Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="English name"
                  value={productForm.name_en}
                  onChange={(event) => setProductForm((current) => ({ ...current, name_en: event.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Vietnamese name"
                  value={productForm.name_vi}
                  onChange={(event) => setProductForm((current) => ({ ...current, name_vi: event.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Select
                  fullWidth
                  value={productForm.category_id}
                  displayEmpty
                  onChange={(event) => setProductForm((current) => ({ ...current, category_id: event.target.value }))}
                >
                  <MenuItem value="">Select category</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name_en}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Select
                  fullWidth
                  value={productForm.product_type}
                  onChange={(event) => setProductForm((current) => ({ ...current, product_type: event.target.value }))}
                >
                  {productTypeOptions.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid size={{ xs: 12 }}><Typography className={styles.formSectionTitle}>{lang === 'vi' ? '02 · Hình ảnh đại diện' : '02 · Product image'}</Typography></Grid>
              <Grid size={{ xs: 12 }}>
                <Button component="label" variant="outlined" startIcon={productUpload.loading ? <CircularProgress size={18} /> : <UploadIcon />} disabled={productUpload.loading} className={styles.multiImageUpload}>
                  {productUpload.loading ? (lang === 'vi' ? 'Đang tải ảnh...' : 'Uploading images...') : (lang === 'vi' ? 'Chọn và tải nhiều ảnh' : 'Select and upload multiple images')}
                  <input hidden multiple type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { uploadProductImages(event.target.files); event.target.value = '' }} />
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                {productForm.images.length ? <div className={styles.productImageGrid}>{productForm.images.map((image, index) => <article className={`${styles.productImageCard} ${image.is_primary ? styles.primaryImageCard : ''}`} key={`${image.image_url}-${index}`}>
                  <div className={styles.productImagePreview}><img src={image.image_url} alt={image.alt_text || `Product ${index + 1}`} /><span>#{index + 1}</span>{image.is_primary ? <b>{lang === 'vi' ? 'Ảnh chính' : 'Primary'}</b> : null}</div>
                  <TextField size="small" label="Alt text" value={image.alt_text} onChange={(event) => updateProductImageAlt(index, event.target.value)} />
                  <div className={styles.productImageActions}><Button size="small" variant={image.is_primary ? 'contained' : 'outlined'} onClick={() => setPrimaryProductImage(index)}>{image.is_primary ? (lang === 'vi' ? 'Đang là ảnh chính' : 'Primary image') : (lang === 'vi' ? 'Chọn làm ảnh chính' : 'Set as primary')}</Button><IconButton color="error" onClick={() => removeProductImage(index)}><DeleteIcon /></IconButton></div>
                </article>)}</div> : <Paper variant="outlined" className={styles.noProductImages}><Typography color="text.secondary">{lang === 'vi' ? 'Chưa có ảnh sản phẩm.' : 'No product images uploaded.'}</Typography></Paper>}
              </Grid>
              {productUpload.success ? <Grid size={{ xs: 12 }}><Alert severity="success">{lang === 'vi' ? 'Tải ảnh sản phẩm thành công.' : 'Product image uploaded successfully.'}</Alert></Grid> : null}
              {productUpload.error ? <Grid size={{ xs: 12 }}><Alert severity="error">{productUpload.error}</Alert></Grid> : null}
              <Grid size={{ xs: 12 }}><Typography className={styles.formSectionTitle}>{lang === 'vi' ? '03 · Hiển thị và sắp xếp' : '03 · Display settings'}</Typography></Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Sort order"
                  type="number"
                  value={productForm.sort_order}
                  onChange={(event) => setProductForm((current) => ({ ...current, sort_order: event.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Select
                  fullWidth
                  value={productForm.is_featured ? 'true' : 'false'}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, is_featured: event.target.value === 'true' }))
                  }
                >
                  <MenuItem value="true">Featured</MenuItem>
                  <MenuItem value="false">Normal</MenuItem>
                </Select>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Select
                  fullWidth
                  value={productForm.is_active ? 'true' : 'false'}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, is_active: event.target.value === 'true' }))
                  }
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </Grid>
              <Grid size={{ xs: 12 }}><Typography className={styles.formSectionTitle}>{lang === 'vi' ? '04 · Nội dung mô tả' : '04 · Product content'}</Typography></Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Short description EN"
                  value={productForm.short_desc_en}
                  onChange={(event) => setProductForm((current) => ({ ...current, short_desc_en: event.target.value }))}
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Short description VI"
                  value={productForm.short_desc_vi}
                  onChange={(event) => setProductForm((current) => ({ ...current, short_desc_vi: event.target.value }))}
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Description EN"
                  value={productForm.description_en}
                  onChange={(event) => setProductForm((current) => ({ ...current, description_en: event.target.value }))}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Description VI"
                  value={productForm.description_vi}
                  onChange={(event) => setProductForm((current) => ({ ...current, description_vi: event.target.value }))}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
              <Grid size={{ xs: 12 }}><Typography className={styles.formSectionTitle}>{lang === 'vi' ? '05 · Thông số kỹ thuật' : '05 · Technical specifications'}</Typography></Grid>
              <Grid size={{ xs: 12 }}>
                <Stack spacing={1.4}>
                  {(productForm.specifications || []).map((specification, index) => (
                    <Box className={styles.specificationRow} key={index}>
                      <span className={styles.specificationOrder}>{index + 1}</span>
                      <TextField label={lang === 'vi' ? 'Tên thông số (EN)' : 'Specification key (EN)'} value={specification.spec_key_en} onChange={(event) => updateSpecificationRow(index, 'spec_key_en', event.target.value)} />
                      <TextField label={lang === 'vi' ? 'Tên thông số (VI)' : 'Specification key (VI)'} value={specification.spec_key_vi} onChange={(event) => updateSpecificationRow(index, 'spec_key_vi', event.target.value)} />
                      <TextField label={lang === 'vi' ? 'Giá trị thông số' : 'Specification value'} value={specification.spec_value} onChange={(event) => updateSpecificationRow(index, 'spec_value', event.target.value)} />
                      <IconButton color="error" onClick={() => removeSpecificationRow(index)} aria-label={lang === 'vi' ? `Xóa dòng ${index + 1}` : `Remove row ${index + 1}`}><DeleteIcon /></IconButton>
                    </Box>
                  ))}
                  <Button className={styles.addSpecificationButton} startIcon={<AddIcon />} variant="outlined" onClick={addSpecificationRow}>{lang === 'vi' ? 'Thêm dòng thông số' : 'Add specification row'}</Button>
                  <Typography variant="caption" color="text.secondary">{lang === 'vi' ? 'Thứ tự được tự động đánh số theo vị trí dòng.' : 'Sort order is assigned automatically from the row position.'}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions className={styles.productDialogActions}>
          <Button onClick={() => setProductDialogOpen(false)} disabled={productUpload.loading || productSaving}>Cancel</Button>
          <Button
            variant="contained"
            onClick={saveProduct}
            disabled={productUpload.loading || productSaving || !productForm.images.length}
          >
            {productSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={inquiryDialogOpen} onClose={() => setInquiryDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Inquiry detail</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          {inquiryLoading ? (
            <Typography>Loading inquiry...</Typography>
          ) : selectedInquiry ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography fontWeight={700}>{selectedInquiry.full_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedInquiry.company_name}
                    </Typography>
                    <Typography variant="body2">{selectedInquiry.email}</Typography>
                    <Typography variant="body2">{selectedInquiry.country}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={1.5}>
                      <Typography variant="body2">Code: {selectedInquiry.inquiry_code}</Typography>
                      <Typography variant="body2">Source: {selectedInquiry.source}</Typography>
                      <Select
                        value={selectedInquiry.status}
                        onChange={(event) => saveInquiryStatus(event.target.value)}
                        size="small"
                      >
                        {statusOptions.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              {selectedInquiry.source === 'inquiry_basket' ? (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography fontWeight={700} sx={{ mb: 1 }}>
                    {lang === 'vi' ? 'Sản phẩm yêu cầu báo giá' : 'Inquiry products'}
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{lang === 'vi' ? 'Sản phẩm' : 'Product'}</TableCell>
                          <TableCell>{lang === 'vi' ? 'Quy cách' : 'Specs'}</TableCell>
                          <TableCell>{lang === 'vi' ? 'Số lượng' : 'Qty'}</TableCell>
                          <TableCell>{lang === 'vi' ? 'Ghi chú' : 'Notes'}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(selectedInquiry.items || []).map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product_name_snapshot}</TableCell>
                            <TableCell>{item.specifications || '-'}</TableCell>
                            <TableCell>{item.quantity || '-'}</TableCell>
                            <TableCell>{item.notes || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              ) : null}

              {selectedInquiry.source === 'contact_form' ? (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography fontWeight={700} sx={{ mb: 1.5 }}>
                    {lang === 'vi' ? 'Nội dung từ biểu mẫu liên hệ' : 'Contact form details'}
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {lang === 'vi' ? 'Mặt hàng quan tâm' : 'Interested species'}
                      </Typography>
                      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 0.7 }}>
                        {(selectedInquiry.interested_species || []).length
                          ? selectedInquiry.interested_species.map((species) => <Chip key={species} size="small" label={species} color="secondary" variant="outlined" />)
                          : <Typography variant="body2">-</Typography>}
                      </Stack>
                    </Box>

                    <Box sx={{ pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary">
                        {lang === 'vi' ? 'Tệp Spec Sheet / Artwork đính kèm' : 'Attached Spec Sheet / Artwork'}
                      </Typography>
                      {selectedInquiry.attachment_url ? (
                        <Box sx={{ mt: 1.2 }}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" gap={1.5} sx={{ p: 1.5, bgcolor: 'rgba(201,164,92,.09)', border: '1px solid rgba(201,164,92,.35)' }}>
                            <Stack direction="row" spacing={1.2} alignItems="center">
                              <AttachFileRoundedIcon color="secondary" />
                              <Box>
                                <Typography variant="body2" fontWeight={700}>{selectedInquiry.attachment_url.split('/').pop()}</Typography>
                                <Typography variant="caption" color="text.secondary">{selectedInquiry.attachment_url}</Typography>
                              </Box>
                            </Stack>
                            <Button href={getAttachmentUrl(selectedInquiry.attachment_url)} target="_blank" rel="noreferrer" variant="contained" size="small" endIcon={<OpenInNewRoundedIcon />}>
                              {lang === 'vi' ? 'Mở tệp' : 'Open file'}
                            </Button>
                          </Stack>
                          {selectedInquiry.attachment_url.toLowerCase().endsWith('.pdf') ? (
                            <Box component="iframe" title={lang === 'vi' ? 'Xem trước tệp đính kèm' : 'Attachment preview'} src={getAttachmentUrl(selectedInquiry.attachment_url)} sx={{ width: '100%', height: { xs: 420, md: 560 }, mt: 1.5, border: '1px solid', borderColor: 'divider', bgcolor: '#f5f5f5' }} />
                          ) : null}
                        </Box>
                      ) : <Typography variant="body2" sx={{ mt: .7 }}>— {lang === 'vi' ? 'Không có tệp đính kèm' : 'No attachment'}</Typography>}
                    </Box>
                  </Stack>
                </Paper>
              ) : null}

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={700}>Message</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                  {selectedInquiry.message || selectedInquiry.special_requirements || '-'}
                </Typography>
              </Paper>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInquiryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
