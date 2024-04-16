import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../routes/Home'
import Root from '../routes/Root'
import Article from '../routes/Article'
import { articleLoader } from './ArticleSection'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: articleLoader
      },
      {
        path: "/article",
        element: <Article />
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}


export default App
