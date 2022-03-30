import { useCallback } from "react";

const Login = ({ alertEmoji }) => {
  const { REACT_APP_AUTHORIZE_ENDPOINT: authorize_endpoint, REACT_APP_CLIENT_ID: client_id, REACT_APP_REDIRECT_URI: redirect_uri, REACT_APP_SCOPE: scope } = process.env

  const goToLoginPage = useCallback(() => {
    window.location.replace(
      `${authorize_endpoint}/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`
    );
  }, [authorize_endpoint, client_id, redirect_uri, scope]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
      <div className="window" style={{ width: 300 }}>
        <div className="title-bar">
          <div className="title-bar-text">Get the presigned s3 upload url!</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" type="button" onClick={alertEmoji}></button>
            <button aria-label="Maximize" type="button" onClick={alertEmoji}></button>
            <button aria-label="Close" type="button" onClick={alertEmoji}></button>
          </div>
        </div>
        <div className="window-body">
          <p>You need to login 😇</p>
        </div>
        <section className="field-row" style={{ justifyContent: "flex-end", margin: 5 }}>
          <button type="button" onClick={goToLoginPage}>Login</button>
        </section>
      </div>
    </div>
  )
}

export default Login
