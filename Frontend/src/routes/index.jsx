import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { ProductsPage } from '../pages/Products/ProductsPage'
import { ProductDetailPage } from '../pages/Products/ProductDetailPage'
import { ContactPage } from '../pages/Contact/ContactPage'
import { AdminPage } from '../pages/Admin/AdminPage'
import { ReferencePage } from '../pages/Reference/ReferencePage'

export const appRouter = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <ReferencePage page="index" /> },
      { path: 'about', element: <ReferencePage page="about" /> },
      { path: 'seasonality', element: <ReferencePage page="seasonality" /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'processing-services', element: <ReferencePage page="processing" /> },
      { path: 'quality', element: <ReferencePage page="quality" /> },
      { path: 'contact', element: <ReferencePage page="contact"><ContactPage /></ReferencePage> },
    ],
  },
])
