import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import axios from "axios";
import queryString from "query-string";

function Callback() {
  let [params] = useSearchParams();
  const navigate = useNavigate();

  const {
    REACT_APP_AUTHORIZE_ENDPOINT: authorize_endpoint,
    REACT_APP_CLIENT_ID: client_id,
    REACT_APP_REDIRECT_URI: redirect_uri,
    REACT_APP_SCOPE: scope
  } = process.env;

  const getAccessToken = useCallback(async () => {
    const code = params.get("code");
    const qs = queryString.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri,
      client_id,
      scope
    });
    try {
      const url = `${authorize_endpoint}/token`;
      const {
        data: { access_token, refresh_token }
      } = await axios.post(url, qs, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
    } catch (e) {
      console.log(e);
    }
    navigate("../", { replace: true });
  }, [authorize_endpoint, client_id, navigate, params, redirect_uri, scope]);

  useEffect(() => {
    getAccessToken();
  }, [getAccessToken]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
      <div className="window" style={{ width: 300 }}>
        <div className="title-bar">
          <div className="title-bar-text">Processing...</div>
        </div>
        <div className="window-body">
          <p>You are logging in... 😇</p>
        </div>
      </div>
    </div>
  );
}

export default Callback;
