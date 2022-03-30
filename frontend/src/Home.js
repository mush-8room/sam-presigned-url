import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import DragNDrop from "./components/DragNDrop";
import Login from "./components/Login";

const API_ENDPOINT = "https://nbwpsa17tl.execute-api.ap-northeast-2.amazonaws.com/Prod/upload/";
  // "https://cd3c5jmpqd.execute-api.ap-northeast-2.amazonaws.com/prod/uploads";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("access_token"))

  const [image, setImage] = useState(null);
  const [uploadUrl, setUploadUrl] = useState('')

  const uploadImage = useCallback(
    async e => {
      const accessToken = localStorage.getItem("access_token");
      const { data: { uploadUrl, key } } = await axios({
        url: API_ENDPOINT,
        method: "GET",
        headers: {
          Authorization: accessToken
        }
      });

      const binary = atob(image.split(",")[1]);
      let array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }

      const blobData = new Blob([new Uint8Array(array)], {
        type: "image/jpeg"
      });

      await axios.put(uploadUrl, {
        method: "PUT",
        body: blobData,
      });

      setUploadUrl(uploadUrl.split("?")[0]);
    },
    [image]
  );

  const removeImage = useCallback(async () => {
    setImage(null);
  }, []);

  const alertEmoji = useCallback(() => {
    alert('😵')
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setIsLoggedIn(false)
  }, [])

  useEffect(() => {
    if (uploadUrl) {
      alert(`Success uploaded to ${uploadUrl}`)
      setImage(null)
    }
  }, [uploadUrl])

  return (
    <div>
      {!isLoggedIn ? (
        <Login alertEmoji={alertEmoji} />
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <div className="window" style={{ width: 400 }}>
              <div className="title-bar">
                <div className="title-bar-text">A Window With Tabs and Groups</div>
                <div className="title-bar-controls">
                  <button aria-label="Minimize" type="button" onClick={alertEmoji}></button>
                  <button aria-label="Maximize" type="button" onClick={alertEmoji}></button>
                  <button aria-label="Close" type="button" onClick={alertEmoji}></button>
                </div>
              </div>
              <div className="window-body">
                <article>
                  <p>Set your listening preferences</p>
                  <fieldset>
                    <legend>Today's mood</legend>
                    <DragNDrop image={image} setImage={setImage} />
                  </fieldset>
                  <section className="field-row" style={{ marginTop: 10, marginBottom: 10 }}>
                    <button type="button" onClick={removeImage}>Remove Image</button>
                    <label>Try to find another image.</label>
                  </section>
                </article>

                <section className="field-row" style={{ justifyContent: "flex-end" }}>
                  <button type="button" onClick={uploadImage}>Upload Image</button>
                  <button type="button" onClick={logout}>Logout</button>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
