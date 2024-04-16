import { createContext, useCallback, useContext, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Transforms } from "slate";
import { ReactEditor, useFocused, useSelected, useSlate } from "slate-react";

import Button from "../components/Button";
import { ICON_SIZE, INITIAL_VALUE } from "../constants";

const EditorContext = createContext(null);

const CustomElement = (props) => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align };

  switch (element.type) {
    case "image":
      return <Image align={element.align} {...props} />;
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Image = ({ align, attributes, children, element }) => {
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const path = ReactEditor.findPath(editor, element);
  const style = {
    position: "relative",
    marginLeft: align === undefined || align === "left" ? 0 : "auto",
    marginRight: align === undefined || align === "right" ? 0 : "auto",
  };

  return (
    <div {...attributes}>
      {children}
      <div className="image" contentEditable={false} style={style}>
        <img
          src={element.url}
          style={{
            boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
          }}
        />
        <Button
          variant="icon"
          size="icon"
          className="btn__icon__delete"
          style={{ display: selected && focused ? "inline" : "none" }}
          onMouseDown={() => Transforms.removeNodes(editor, { at: path })}
        >
          <MdDelete size={ICON_SIZE} />
        </Button>
      </div>
    </div>
  );
};

const Leaf = ({ attributes, leaf, children }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return (
    <span style={{ display: leaf.extra ? "none" : "inline" }} {...attributes}>
      {children}
    </span>
  );
};

const EditorProvider = ({ children }) => {
  const [contentValue, setContentValue] = useState(() => {
    return JSON.parse(localStorage.getItem("content")) || INITIAL_VALUE;
  });

  const renderElement = useCallback((props) => {
    return <CustomElement {...props} />;
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const changeContentValue = (value) => {
    const newValue = value ? value : INITIAL_VALUE;
    const content = JSON.stringify(newValue);
    localStorage.setItem("content", content);
    setContentValue(newValue);
  };

  return (
    <EditorContext.Provider value={{ renderElement, renderLeaf, contentValue, changeContentValue }}>
      {children}
    </EditorContext.Provider>
  );
};

const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
};

export default EditorProvider;
export { useEditor };