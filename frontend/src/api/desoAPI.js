import axios from "axios";

const DEFAULT_NODE_URL = "https://node.deso.org/api/v0";

const SELF_PUBLIC_KEY =
  "BC1YLgUUf3R6o9oWPTQAnLp6mNzUhSyTR26D6HZgG1Fngoa4gbCn4XJ";
//const DEFAULT_NODE_URL = "https://api.desodev.com/api"
let client = null;
const BACKEND_URL = "https://mintedtweets.cordify.app/"

class DesoApi {
  constructor() {
    this.client = null;
    this.baseUrl = DEFAULT_NODE_URL;
    this.backendURL = BACKEND_URL;
  }

  async getExpressItPosts(lastPostHash = "", NumToFetch = 18) {
    const path = DEFAULT_NODE_URL + "/get-posts-for-public-key";
    const data = {
      PublicKeyBase58Check: SELF_PUBLIC_KEY,
      Username: "ExpressIt",
      ReaderPublicKeyBase58Check:
        "BC1YLhBLE1834FBJbQ9JU23JbPanNYMkUsdpJZrFVqNGsCe7YadYiUg",
      LastPostHashHex: lastPostHash,
      NumToFetch: NumToFetch,
      MediaRequired: false,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
async mintNewNFT(message, jwt, publicKey){
    const path = BACKEND_URL + "/mintNFT";
    const data = {
      message: message,
      jwt: jwt,
      publicKey: publicKey,
    };
    try {
      const result = await this.getBackendClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
}
  getClient() {
    client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return client;
  }

  getBackendClient(){
    if (client) return client;
    client = axios.create({
      baseURL: this.backendURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return client;
  }

  getUploadClient() {
    if (client) return client;
    client = axios.create({
      baseURL: "https://node.deso.org/api",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    return client;
  }
}

export default DesoApi;
