import { useCallback, useEffect, useRef, useState } from "react"

const MAX_IMAGE_SIZE = 1000000;

const DragNDrop = ({ image, setImage }) => {
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef(null);

  const createImage = useCallback(file => {
    let reader = new FileReader();
    reader.onload = e => {
      if (!e.target.result.includes("data:image/jpeg"))
        return alert("Wrong file type - JPG only");
      if (e.target.result.length > MAX_IMAGE_SIZE)
        return alert("Image is too large");
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }, [setImage]);

  const onChangeFiles = useCallback((e) => {
    let selectFiles = [];

    if (e.type === "drop") {
      selectFiles = e.dataTransfer.files;
    } else {
      selectFiles = e.target.files;
    }
    createImage(selectFiles[0])
  }, [createImage]);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, [])

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer && e.dataTransfer.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      onChangeFiles(e);
      setIsDragging(false);
    },
    [onChangeFiles]
  );

  const initDragEvents = useCallback(() => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener("dragenter", handleDragIn);
      dragRef.current.addEventListener("dragleave", handleDragOut);
      dragRef.current.addEventListener("dragover", handleDragOver);
      dragRef.current.addEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback(() => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener("dragenter", handleDragIn);
      dragRef.current.removeEventListener("dragleave", handleDragOut);
      dragRef.current.removeEventListener("dragover", handleDragOver);
      dragRef.current.removeEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  return (
    <div className="dragNDrop">
      <input type="file" id="fileUpload" style={{ display: "none" }} />
      <label ref={dragRef} htmlFor="fileUpload" className={`dragNDrop-file ${isDragging && "dragging"}`}>Choose a file or drag it here.</label>
      {image !== null && (
        <div style={{ width: "100%", marginTop: 10 }}>
          <img style={{ width: "100%" }} src={image} alt="upload" />
        </div>
      )}
    </div>
  )
}

export default DragNDrop