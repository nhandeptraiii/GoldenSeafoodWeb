import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { appRouter } from './routes'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
      <ToastContainer position="top-right" autoClose={2600} hideProgressBar closeOnClick pauseOnHover theme="light" />
    </>
  )
}

export default App
