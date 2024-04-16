import { useEffect, useRef, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import { useFetcher, useLocation } from "react-router-dom";

import { DEFAULT_COVER_PHOTO, INITIAL_VALUE } from "../constants";
import { useEditor } from "../contexts/EditorProvider";
import "../styles/FormModal.css";
import Button from "./Button";
import RichTextbox from "./RichTextBox";

const FormModal = ({ title, article, children }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [coverImage, setCoverImage] = useState(article ? article.cover_photo : DEFAULT_COVER_PHOTO);
  const [errors, setErrors] = useState({ title: "", author: "", content: "" });
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const fetcher = useFetcher();
  const { pathname } = useLocation();
  const { changeContentValue } = useEditor();

  useEffect(() => {
    document.body.style.overflowY = isOpened ? "hidden" : "auto";
  }, [isOpened]);

  const toggleModal = () => setIsOpened(!isOpened);

  const resetContentValue = () => {
    formRef.current.reset();
    toggleModal();
    setCoverImage(article ? article.cover_photo : DEFAULT_COVER_PHOTO);
    changeContentValue(article ? article.content : null);
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    resetContentValue();
  };

  const editCoverPhoto = (e) => {
    // store the selected image to show in the form
    const img = e.target.files[0];
    if (img) setCoverImage(URL.createObjectURL(img));
  };

  const validateInput = (e) => {
    const formData = new FormData(e.target);

    // validating each input field for errors
    let hasErrors = false;
    if (formData.get("title").length === 0) {
      setErrors((prev) => ({ ...prev, title: "Title is required" }));
      hasErrors = true;
    }
    if (formData.get("author").length === 0) {
      setErrors((prev) => ({ ...prev, author: "Author is required" }));
      hasErrors = true;
    }
    const content = JSON.parse(localStorage.getItem("content"));
    if (JSON.stringify(content) === JSON.stringify(INITIAL_VALUE)) {
      setErrors((prev) => ({ ...prev, content: "Content is required" }));
      hasErrors = true;
    }

    // if there are errors, prevent the form from submitting
    if (hasErrors) e.preventDefault();
    else toggleModal();
  };

  return (
    <>
      {children(resetContentValue)}
      <div className={`form-modal ${!isOpened ? "hidden" : ""}`}>
        <div className="form-modal__overlay" onClick={handleOverlayClick} />
        <fetcher.Form
          ref={formRef}
          method="post"
          action={article ? pathname : "/"}
          className="form-modal__content"
          onSubmit={validateInput}
          encType="multipart/form-data"
        >
          <div className="form-modal__top-container">
            <h2 className="form-modal__title">{title}</h2>
            <Button type="button" variant="icon" size="icon" className="btn__icon__close" onClick={resetContentValue}>
              <IoCloseCircle size={48} />
            </Button>
          </div>
          <div className="form-modal__cover-photo">
            <img src={coverImage} alt="The article cover photo" />
            <input type="url" name="cover_photo_url" value={coverImage} readOnly hidden />
            <input
              ref={fileInputRef}
              type="file"
              name="cover_photo"
              accept="image/*"
              onChange={editCoverPhoto}
              hidden
            />
            <Button
              type="button"
              variant="accent"
              className="btn__accent__edit"
              onClick={() => fileInputRef.current.click()}
            >
              <FiEdit size={20} />
              <p>Change Photo</p>
            </Button>
          </div>
          <div className="form-modal__field">
            <label htmlFor="title">Post Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              className={errors.title && "error"}
              placeholder="Add your text here..."
              defaultValue={article && article.title}
              onChange={() => setErrors((prev) => ({ ...prev, title: "" }))}
            />
            {errors.title && <p className="form-modal__error">{errors.title}</p>}
          </div>
          <div className="form-modal__field">
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              id="author"
              name="author"
              className={errors.author && "error"}
              placeholder="Add your text here..."
              defaultValue={article && article.author}
              onChange={() => setErrors((prev) => ({ ...prev, author: "" }))}
            />
            {errors.author && <p className="form-modal__error">{errors.author}</p>}
          </div>
          <div className="form-modal__field">
            <label htmlFor="content">Content:</label>
            <RichTextbox content={article && article.content} isError={errors.content !== ""} setErrors={setErrors} />
            {errors.content && <p className="form-modal__error">{errors.content}</p>}
          </div>
          <div className="form-modal__buttons">
            {article && (
              <Button type="submit" name="intent" value="delete" size="lg" variant="destructuve">
                DELETE POST
              </Button>
            )}
            <Button type="submit" name="intent" value="edit" size="lg" variant="primary">
              {article ? "SAVE POST" : "CREATE POST"}
            </Button>
          </div>
        </fetcher.Form>
      </div>
    </>
  );
};

export default FormModal;