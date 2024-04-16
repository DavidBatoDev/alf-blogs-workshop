import { useEffect, useMemo, useRef } from "react";
import {
  MdCode,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatUnderlined,
  MdImage,
  MdLooksOne,
  MdLooksTwo,
} from "react-icons/md";
import { Editor, Element, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, useSlate, withReact } from "slate-react";

import { HOTKEYS, ICON_SIZE, INITIAL_VALUE, LIST_TYPES, TEXT_ALIGN_TYPES } from "../constants";
import { useEditor } from "../contexts/EditorProvider";
import "../styles/RichTextBox.css";
import Button from "./Button";

const CustomEditor = {
  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },

  isBlockActive(editor, format, blockType = "type") {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n[blockType] === format,
      })
    );

    return !!match;
  },

  isImageUrl(url) {
    const res = url.match(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?" + // port
        "(\\/[-a-z\\d%_.~+]*)*" + // path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i" // fragment locator
    );
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".ico", ".jfif", ".svg"];

    if (!url) return false;
    if (res === null) return false;
    const ext = new URL(url).pathname.split(".").pop();
    return imageExtensions.includes(ext);
  },

  toggleMark(editor, format) {
    const isActive = CustomEditor.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },

  toggleBlock(editor, format) {
    const isActive = CustomEditor.isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type");
    const isList = LIST_TYPES.includes(format);

    // prevents two different type of list to be active at the same time
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        LIST_TYPES.includes(n.type) &&
        !TEXT_ALIGN_TYPES.includes(format),
      split: true,
    });

    // sets the alignment and type of current node block
    let newProperties;
    if (TEXT_ALIGN_TYPES.includes(format)) {
      newProperties = { align: isActive ? null : format };
    } else {
      newProperties = {
        type: isActive ? "paragraph" : isList ? "list-item" : format,
      };
    }
    Transforms.setNodes(editor, newProperties);

    // wraps the current line and next lines in a list
    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  },

  insertImage(editor, url) {
    const image = { type: "image", url, children: [{ text: "", extra: true }] };
    Transforms.insertNodes(editor, image);
    Transforms.insertNodes(editor, {
      type: "paragraph",
      children: [{ text: "", extra: false }],
    });
  },
};

const withImages = (editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            CustomEditor.insertImage(editor, url);
          });
          reader.readAsDataURL(file);
        }
      }
    } else if (CustomEditor.isImageUrl(text)) {
      CustomEditor.insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();

  return (
    <Button
      variant="icon"
      size="icon"
      active={CustomEditor.isMarkActive(editor, format)}
      onClick={(e) => {
        e.preventDefault();
        CustomEditor.toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();

  return (
    <Button
      variant="icon"
      size="icon"
      active={CustomEditor.isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? "align" : "type")}
      onClick={(e) => {
        e.preventDefault();
        CustomEditor.toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const InsertImageButton = () => {
  const editor = useSlate();
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    for (const file of e.target.files) {
      const reader = new FileReader();
      const [mime] = file.type.split("/");

      if (mime === "image") {
        reader.addEventListener("load", () => {
          const url = reader.result;
          CustomEditor.insertImage(editor, url);
        });
        reader.readAsDataURL(file);
      }
    }
    e.target.value = null;
  };

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} hidden />
      <Button type="button" variant="icon" size="icon" onClick={() => fileInputRef.current.click()}>
        <MdImage size={ICON_SIZE} />
      </Button>
    </>
  );
};

const RichTextbox = ({ content, isError, setErrors }) => {
  const { renderElement, renderLeaf, contentValue, changeContentValue } = useEditor();
  const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), []);
  const point = useMemo(() => ({ path: [0, 0], offset: 0 }), []);

  useEffect(() => {
    // set editor if there is an article content (editing)
    if (content && contentValue === content) {
      editor.selection = { anchor: point, focus: point };
      editor.history = { redos: [], undos: [] };
      editor.children = content;
    }
  }, [content, contentValue]);

  // reset the editor when closed or created (creating)
  if (!content && contentValue === INITIAL_VALUE) {
    editor.selection = { anchor: point, focus: point };
    editor.history = { redos: [], undos: [] };
    editor.children = INITIAL_VALUE;
  }

  const handleChange = (value) => {
    // save the value to Local Storage if AST is changed
    const isAstChange = editor.operations.some((op) => op.type !== "set_selection");
    if (isAstChange) {
      changeContentValue(value);
      setErrors((prev) => ({ ...prev, content: "" }));
    }
  };

  return (
    <Slate editor={editor} initialValue={contentValue} onChange={handleChange}>
      <div className={`editor ${isError ? "error" : ""}`}>
        <div className="editor__toolbar">
          <InsertImageButton />
          <MarkButton format="bold" icon={<MdFormatBold size={ICON_SIZE} />} />
          <MarkButton format="italic" icon={<MdFormatItalic size={ICON_SIZE} />} />
          <MarkButton format="underline" icon={<MdFormatUnderlined size={ICON_SIZE} />} />
          <MarkButton format="code" icon={<MdCode size={ICON_SIZE} />} />
          <BlockButton format="heading-one" icon={<MdLooksOne size={ICON_SIZE} />} />
          <BlockButton format="heading-two" icon={<MdLooksTwo size={ICON_SIZE} />} />
          <BlockButton format="block-quote" icon={<MdFormatQuote size={ICON_SIZE} />} />
          <BlockButton format="numbered-list" icon={<MdFormatListNumbered size={ICON_SIZE} />} />
          <BlockButton format="bulleted-list" icon={<MdFormatListBulleted size={ICON_SIZE} />} />
          <BlockButton format="left" icon={<MdFormatAlignLeft size={ICON_SIZE} />} />
          <BlockButton format="center" icon={<MdFormatAlignCenter size={ICON_SIZE} />} />
          <BlockButton format="right" icon={<MdFormatAlignRight size={ICON_SIZE} />} />
          <BlockButton format="justify" icon={<MdFormatAlignJustify size={ICON_SIZE} />} />
        </div>
        <Editable
          className="editor__content"
          id="content"
          name="content"
          spellCheck
          placeholder="Add your content here..."
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            if (event.ctrlKey && event.key in HOTKEYS) {
              event.preventDefault();
              const mark = HOTKEYS[event.key];
              CustomEditor.toggleMark(editor, mark);
            }
          }}
        />
      </div>
    </Slate>
  );
};

export default RichTextbox;