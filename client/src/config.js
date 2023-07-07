let apiUrl;
if (process.env.NODE_ENV === "production") {
    apiUrl = process.env.REACT_APP_API_PRODUCTION_BASE_URL;
}else{
    apiUrl = process.env.REACT_APP_API_BASE_URL;
}

export default apiUrl;