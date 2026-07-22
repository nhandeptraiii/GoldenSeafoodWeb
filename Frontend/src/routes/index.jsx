import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/Home/HomePage'
import { ProductsPage } from '../pages/Products/ProductsPage'
import { ProductDetailPage } from '../pages/Products/ProductDetailPage'
import { ProcessingServicesPage } from '../pages/ProcessingServices/ProcessingServicesPage'
import { QualityPage } from '../pages/Quality/QualityPage'
import { ContactPage } from '../pages/Contact/ContactPage'
import { AdminPage } from '../pages/Admin/AdminPage'

export const appRouter = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'processing-services', element: <ProcessingServicesPage /> },
      { path: 'quality', element: <QualityPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
])
