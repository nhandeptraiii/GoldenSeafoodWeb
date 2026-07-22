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
import { useEffect, useMemo, useState } from 'react'
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
  thumbnail_url: '',
  product_type: 'raw',
  is_featured: false,
  is_active: true,
  sort_order: 0,
  specificationsText: '[]',
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

function productSpecsToText(specifications) {
  if (!Array.isArray(specifications) || specifications.length === 0) {
    return '[]'
  }

  return JSON.stringify(
    specifications.map((item, index) => ({
      spec_key_en: item.spec_key_en || '',
      spec_key_vi: item.spec_key_vi || '',
      spec_value: item.spec_value || '',
      sort_order: item.sort_order || index + 1,
    })),
    null,
    2,
  )
}

function normalizeSpecifications(text) {
  if (!text || !text.trim()) {
    return []
  }

  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed)) {
    throw new Error('Specifications must be a JSON array.')
  }

  return parsed.map((item, index) => ({
    spec_key_en: item.spec_key_en || '',
    spec_key_vi: item.spec_key_vi || '',
    spec_value: item.spec_value || '',
    sort_order: item.sort_order || index + 1,
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

function AdminLoginCard({ form, onChange, onSubmit, loading, error }) {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)',
        }}
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 2 }}>
              Admin Portal
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              Website management
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Sign in to manage categories, products and inquiries.
            </Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            label="Username"
            value={form.username}
            onChange={(event) => onChange('username', event.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => onChange('password', event.target.value)}
            fullWidth
          />
          <Button variant="contained" size="large" onClick={onSubmit} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Stack>
      </Paper>
    </Container>
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
  const [bootstrapping, setBootstrapping] = useState(true)
  const [auth, setAuth] = useState({ token: '', user: null })
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    document.title = 'Administration | Golden Seafood'
  }, [])

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
        thumbnail_url: detail.thumbnail_url || '',
        product_type: detail.product_type || 'raw',
        is_featured: Boolean(detail.is_featured),
        is_active: Boolean(detail.is_active),
        sort_order: detail.sort_order ?? 0,
        specificationsText: productSpecsToText(detail.specifications),
      })
      setProductUpload({
        loading: false,
        error: '',
        success: Boolean(detail.thumbnail_url),
        preview: detail.thumbnail_url || '',
      })
      setProductDialogOpen(true)
    } catch (error) {
      setAlert(error.message)
    }
  }

  const saveProduct = async () => {
    if (productUpload.loading || !productUpload.success || !productForm.thumbnail_url) {
      setProductUpload((current) => ({ ...current, error: 'Upload an image successfully before saving.' }))
      return
    }

    setProductSaving(true)
    setAlert('')
    try {
      const payload = {
        ...productForm,
        category_id: Number(productForm.category_id),
        sort_order: Number(productForm.sort_order || 0),
        specifications: normalizeSpecifications(productForm.specificationsText),
      }

      delete payload.id
      delete payload.specificationsText

      if (productForm.id) {
        await updateAdminProduct(productForm.id, payload)
      } else {
        await createAdminProduct(payload)
      }

      setProductDialogOpen(false)
      await Promise.all([loadProducts(), loadCategories()])
    } catch (error) {
      setAlert(error.message)
    } finally {
      setProductSaving(false)
    }
  }

  const uploadThumbnail = async (file) => {
    if (!file) {
      return
    }

    const preview = URL.createObjectURL(file)
    setProductForm((current) => ({ ...current, thumbnail_url: '' }))
    setProductUpload({ loading: true, error: '', success: false, preview })
    try {
      const url = await uploadProductImage(file)
      setProductForm((current) => ({ ...current, thumbnail_url: url }))
      setProductUpload({ loading: false, error: '', success: true, preview: url })
    } catch (error) {
      setProductUpload({ loading: false, error: error.message, success: false, preview })
    }
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
      { label: 'Categories', value: categories.length, hint: 'Active taxonomy items' },
      { label: 'Products', value: productPagination?.totalItems ?? products.length, hint: 'Catalog entries' },
      { label: 'New inquiries', value: newInquiryCount, hint: 'Waiting for first action' },
      { label: 'Visible inquiries', value: inquiryPagination?.totalItems ?? inquiries.length, hint: 'Latest records' },
    ],
    [categories.length, inquiries.length, newInquiryCount, productPagination?.totalItems, products.length, inquiryPagination?.totalItems],
  )

  if (bootstrapping) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Typography>Loading admin portal...</Typography>
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
      />
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(18px)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Golden Seafood Admin
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Logged in as {auth.user?.full_name || auth.user?.username || 'admin'}
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {alert ? (
          <Alert severity="info" sx={{ mb: 2 }} onClose={() => setAlert('')}>
            {alert}
          </Alert>
        ) : null}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {summaryCards.map((item) => (
            <Grid key={item.label} item xs={12} sm={6} lg={3}>
              <StatCard {...item} />
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ px: 2, pt: 1 }}>
            <Tab label="Overview" />
            <Tab label="Categories" />
            <Tab label="Products" />
            <Tab label="Inquiries" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tab === 0 ? (
              <Stack spacing={3}>
                <SectionHeader
                  title="Admin overview"
                  subtitle="Quick access to the current catalog and inquiry state."
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
                  title="Category management"
                  subtitle="Create, update and remove catalog groups."
                  action={
                    <Button
                      startIcon={<AddIcon />}
                      variant="contained"
                      onClick={() => openCategoryDialog()}
                      disabled={loading.categories}
                    >
                      New category
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
                        <TableCell>Products</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
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
                  title="Product management"
                  subtitle="Manage product metadata, status and technical specifications."
                  action={
                    <Button
                      startIcon={<AddIcon />}
                      variant="contained"
                      onClick={() => openProductDialog()}
                      disabled={loading.products}
                    >
                      New product
                    </Button>
                  }
                />

                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Search"
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
                      <MenuItem value="">All categories</MenuItem>
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
                      <MenuItem value="">All types</MenuItem>
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
                  Apply filters
                </Button>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Flags</TableCell>
                        <TableCell>Slug</TableCell>
                        <TableCell align="right">Actions</TableCell>
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
                  title="Inquiry management"
                  subtitle="Review incoming requests and move them through the workflow."
                />

                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Search"
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
                      <MenuItem value="">All statuses</MenuItem>
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
                      <MenuItem value="">All sources</MenuItem>
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
                  Apply filters
                </Button>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="right">Actions</TableCell>
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
                                View
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

      <Dialog open={productDialogOpen} onClose={() => !productUpload.loading && setProductDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{productForm.id ? 'Edit product' : 'New product'}</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="English name"
                  value={productForm.name_en}
                  onChange={(event) => setProductForm((current) => ({ ...current, name_en: event.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Vietnamese name"
                  value={productForm.name_vi}
                  onChange={(event) => setProductForm((current) => ({ ...current, name_vi: event.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                {productUpload.preview ? (
                  <Box
                    component="img"
                    src={productUpload.preview}
                    alt="Product thumbnail preview"
                    sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                  />
                ) : (
                  <Paper variant="outlined" sx={{ height: 180, display: 'grid', placeItems: 'center' }}>
                    <Typography color="text.secondary">No image selected</Typography>
                  </Paper>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Button component="label" variant="outlined" startIcon={productUpload.loading ? <CircularProgress size={18} /> : <UploadIcon />} disabled={productUpload.loading} fullWidth sx={{ height: '100%' }}>
                  {productUpload.loading ? 'Uploading thumbnail...' : 'Select and upload thumbnail'}
                  <input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadThumbnail(event.target.files?.[0])} />
                </Button>
              </Grid>
              {productUpload.success ? <Grid item xs={12}><Alert severity="success">Product image uploaded successfully.</Alert></Grid> : null}
              {productUpload.error ? <Grid item xs={12}><Alert severity="error">{productUpload.error}</Alert></Grid> : null}
              <Grid item xs={12} md={4}>
                <TextField
                  label="Sort order"
                  type="number"
                  value={productForm.sort_order}
                  onChange={(event) => setProductForm((current) => ({ ...current, sort_order: event.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12}>
                <TextField
                  label="Short description EN"
                  value={productForm.short_desc_en}
                  onChange={(event) => setProductForm((current) => ({ ...current, short_desc_en: event.target.value }))}
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Short description VI"
                  value={productForm.short_desc_vi}
                  onChange={(event) => setProductForm((current) => ({ ...current, short_desc_vi: event.target.value }))}
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description EN"
                  value={productForm.description_en}
                  onChange={(event) => setProductForm((current) => ({ ...current, description_en: event.target.value }))}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description VI"
                  value={productForm.description_vi}
                  onChange={(event) => setProductForm((current) => ({ ...current, description_vi: event.target.value }))}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Specifications JSON"
                  helperText='Example: [{"spec_key_en":"Size","spec_key_vi":"Cỡ","spec_value":"16/20"}]'
                  value={productForm.specificationsText}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, specificationsText: event.target.value }))
                  }
                  fullWidth
                  multiline
                  minRows={6}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialogOpen(false)} disabled={productUpload.loading || productSaving}>Cancel</Button>
          <Button
            variant="contained"
            onClick={saveProduct}
            disabled={productUpload.loading || productSaving || !productUpload.success || !productForm.thumbnail_url}
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

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>
                  Items
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Specs</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Notes</TableCell>
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
