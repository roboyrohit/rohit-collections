export const DOWNLOAD_REPORT = {
    url: '/api/report/download',
    method: 'GET',
    transformError: (err) => err?.message,
    debounceTime: 500,
    isDownload: true,
    filename: 'report.xlsx'
}

export const SIGN_IN = {
    url: "/login",
    method: "POST",
    transformResponse: (res) => res?.data ?? [],
    transformError: (err) => err?.message,
}

export const GET_MOVIES = {
    url: "/getMovies",
    method: "GET",
    transformResponse: (res) => res?.data ?? [],
    transformError: (err) => err?.message,
    debounceTime: 500
}

export const GET_SERIES = {
    url: "/getSeries",
    method: "GET",
    transformResponse: (res) => res?.data ?? [],
    transformError: (err) => err?.message,
    debounceTime: 500
}

export const GET_ISRO_LAUNCHS = {
    url: "/getIsro",
    method: "GET",
    transformResponse: (res) => res?.data ?? [],
    transformError: (err) => err?.message,
    debounceTime: 500
}

export const GET_DOCUMENTARIES = {
    url: "/getDocumentaries",
    method: "GET",
    transformResponse: (res) => res?.data ?? [],
    transformError: (err) => err?.message,
    debounceTime: 500
}

export const GET_DATABASE = {
    url: "/database",
    method: "GET",
    transformResponse: (res) => res?.data ?? [],
    transformError: (err) => err?.message,
    debounceTime: 500
}

export const GET_USER_LIST = {
    url: "/getUserList",
    method: "GET",
    transformResponse: (res) => res?.data ?? [],
    transformError: (err) => err?.message,
    debounceTime: 500
}