import React, { useEffect, useMemo } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import { withHistory } from "slate-history";
import Blur from "../components/Blur";
import Button from "../components/Button";
import FormModal from "../components/FormModal";
import { API_URL, DEFAULT_COVER_PHOTO } from "../constants";
import { useEditor } from "../contexts/EditorProvider";
import "../styles/Article.css";
import { formatDate } from "../utils";

export const articleLoader = async ({ params }) => {
  const response = await fetch(`${API_URL}/posts/${params.articleId}`);
  if (!response.ok) throw response;

  const data = await response.json();
  const path = data.cover_photo;
  const cover_photo = path ? `${API_URL}${path.split("public")[1]}` : DEFAULT_COVER_PHOTO;
  console.log(data)
  const article = {
    ...data,
    date: formatDate(new Date(data.date)),
    content: JSON.parse(data.content),
    cover_photo,
  };
  return { article };
};

export const articleEditAction = async ({ request, params }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  // for deleting article
  if (intent === "delete") {
    const response = await fetch(`${API_URL}/posts/${params.articleId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw response;
    return redirect("/");
  }

  // for editing article
  const newFormData = new FormData();
  newFormData.append("title", formData.get("title"));
  newFormData.append("author", formData.get("author"));
  newFormData.append("content", localStorage.getItem("content"));

  // if the user didn't change the cover photo,
  // fetch the current image and instantiate a new file object from the image
  const coverPhoto = formData.get("cover_photo");
  const coverPhotoUrl = formData.get("cover_photo_url");
  if (coverPhoto.name === "" && coverPhotoUrl !== DEFAULT_COVER_PHOTO) {
    try {
      const res = await fetch(coverPhotoUrl);
      const blob = await res.blob();
      const filename = coverPhotoUrl.split("\\uploads\\")[1].split("-").slice(2).join();
      const file = new File([blob], filename, { type: "image/jpeg" });
      newFormData.append("cover_photo", file);
    } catch (err) {
      const message = "Failed to fetch and process the image";
      throw new Response(message, { status: 500, statusText: message });
    }
  } else {
    newFormData.append("cover_photo", coverPhoto);
  }

  const response = await fetch(`${API_URL}/posts/${params.articleId}`, {
    method: "PUT",
    body: newFormData,
  });

  if (!response.ok) throw response;

  const data = await response.json();

  // since the 'File Too Large' message still has a 200 status code
  if (data.message === "File too large") {
    throw new Response(data.message, { status: 413, statusText: data.message });
  }
  return null;
};

const Article = () => {
  const { article } = useLoaderData();
  const { renderElement, renderLeaf, changeContentValue } = useEditor();
  const viewOnlyEditor = useMemo(() => withHistory(withReact(createEditor())), []);

  // just to prevent the horizontal scrollbar because of the blur
  document.body.style.overflowX = "hidden";

  // set the view only editor content to the article content
  viewOnlyEditor.children = article.content;

  // set the rich text editor content to the article content to be edited
  useEffect(() => changeContentValue(article.content), []);

  return (
    <div className="article">
      {/* article header blur */}
      <Blur
        h={"20%"}
        w={"40%"}
        bg={"#7000FF"}
        x={"35%"}
        y={"250px"}
        opacity={0.32}
        blur={"200px"}
        translate_x={"-50%"}
        translate_y={"-50%"}
        border_radius={"100%"}
      />
      <Blur
        h={"20%"}
        w={"40%"}
        bg={"#FF00C7"}
        x={"65%"}
        y={"250px"}
        opacity={0.32}
        blur={"200px"}
        translate_x={"-50%"}
        translate_y={"-50%"}
        border_radius={"100%"}
      />

      {/* other blurs */}
      <Blur
        h={"20%"}
        w={"40%"}
        bg={"#7000FF"}
        x={"-20px"}
        y={"60%"}
        opacity={0.32}
        blur={"200px"}
        translate_x={"-50%"}
        translate_y={"-50%"}
        border_radius={"100%"}
      />
      <Blur
        h={"20%"}
        w={"40%"}
        bg={"#60FFE7"}
        x={"105%"}
        y={"85%"}
        opacity={0.32}
        blur={"200px"}
        translate_x={"-50%"}
        translate_y={"-50%"}
        border_radius={"100%"}
      />

      <div className="article__header">
        <p className="article__header__date">{article.date}</p>
        <h1>{article.title}</h1>
        <p className="article__header__author">By: {article.author}</p>
      </div>
      <img className="article__cover-photo" src={article.cover_photo} />
      <FormModal title="Edit Post" article={article}>
        {(toggleModal) => (
          <Button variant="primary" onClick={toggleModal}>
            Edit Article
          </Button>
        )}
      </FormModal>
      <Slate editor={viewOnlyEditor} initialValue={article.content}>
        <Editable readOnly renderElement={renderElement} renderLeaf={renderLeaf} className="article__content" />
      </Slate>
    </div>
  );
};

export default Article;