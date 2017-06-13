var ApiUtils = {  
  checkStatus: function(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      return response.json()
        .catch(() => { return {}})
        .then((body) => {
          let error = new Error(body && body['Error'] ? body['Error'] : response.statusText);
          error.response = response;
          throw error;
        })
    }
  }
};
export { ApiUtils as default };