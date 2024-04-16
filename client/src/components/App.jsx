
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import EditorProvider from "../contexts/EditorProvider";
import Article, { articleEditAction, articleLoader } from "../routes/Article";
import Error from "../routes/Error";
import Home from "../routes/Home";
import Root from "../routes/Root";
import { articleCreateAction, articlesLoader } from "./ArticleSection";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    action: articleCreateAction,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: articlesLoader,
        errorElement: <Error />,
      },
      {
        path: "/article/:articleId",
        element: <Article />,
        loader: articleLoader,
        action: articleEditAction,
        errorElement: <Error />,
      },
    ],
  },
]);

const App = () => {
  return (
    <EditorProvider>
      <RouterProvider router={router} />
    </EditorProvider>
  );
};

export default App;
