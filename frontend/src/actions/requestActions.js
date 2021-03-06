import axios from 'axios'
import {
    REQUEST_DETAILS_REQUEST,
    REQUEST_DETAILS_SUCCESS,
    REQUEST_DETAILS_FAIL,
    TRACK_REQUEST_REQUEST,
    TRACK_REQUEST_SUCCESS,
    TRACK_REQUEST_FAIL,
    SUBMIT_REQUEST_REQUEST,
    SUBMIT_REQUEST_SUCCESS,
    SUBMIT_REQUEST_FAIL,
    GET_REQUESTS_REQUEST,
    GET_REQUESTS_SUCCESS,
    GET_REQUESTS_FAIL,
    GET_CROSSENROL_REQUEST,
    GET_CROSSENROL_SUCCESS,
    GET_CROSSENROL_FAIL,
    REQUEST_STATS_REQUEST,
    REQUEST_STATS_SUCCESS,
    REQUEST_STATS_FAIL,
    UPDATE_REQUEST_REQUEST,
    UPDATE_REQUEST_SUCCESS,
    UPDATE_REQUEST_FAIL,
    DELETE_REQUEST_REQUEST,
    DELETE_REQUEST_SUCCESS,
    DELETE_REQUEST_FAIL,
    ASSIGN_REQUEST_REQUEST,
    ASSIGN_REQUEST_SUCCESS,
    ASSIGN_REQUEST_FAIL,
    UNASSIGN_REQUEST_REQUEST,
    UNASSIGN_REQUEST_SUCCESS,
    UNASSIGN_REQUEST_FAIL,
    CLEAR_ERRORS
} from '../constants/requestConstants'

//Get request (using tracking number)
export const trackRequest = (userInput) => async (dispatch) => {
    try {
        dispatch({
            type: TRACK_REQUEST_REQUEST
        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`/api/v1/tracker`, userInput, config)

        dispatch({
            type: TRACK_REQUEST_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: TRACK_REQUEST_FAIL,
            payload: error.response.data.message
        })
    }
}

//Submit request
export const submitRequest = (request) => async (dispatch) => {
    try {
        dispatch({
            type: SUBMIT_REQUEST_REQUEST
        })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

    const { data } = await axios.post(`/api/v1/submit`, request, config)

        dispatch({
            type: SUBMIT_REQUEST_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: SUBMIT_REQUEST_FAIL,
            payload: error.response.data.message
        })
    }
}

//get requests
export const getRequests = (role, route, requestType) => async (dispatch) => {
    try {
        dispatch({
            type: GET_REQUESTS_REQUEST
        })

        let link = ``

        if (role === 'CICS Office') {
            switch (route) {
                case 'Office':
                    link = `/api/v1/admin/cics/office/requests${requestType ? `?requestType=${requestType}` : ''}`
                    break
                case 'Trash':
                    link = `/api/v1/admin/requests/trash${requestType ? `?requestType=${requestType}` : ''}`
                    break
                case 'Available':
                    link = `/api/v1/admin/cics/available/requests${requestType ? `?requestType=${requestType}` : ''}`
                    break
                case 'All':
                    link = `/api/v1/admin/cics/all/requests${requestType ? `?requestType=${requestType}` : ''}`
                    break
                case 'Me':
                    link = `/api/v1/admin/cics/me/requests${requestType ? `?requestType=${requestType}` : ''}`
                    break
                default:
                    link = ``
            }
        } else if (role === 'Student') { //student
            link = `/api/v1/me/requests${requestType ? `?requestType=${requestType}` : ''}`
        } else {
            switch (route) {
                case 'Trash':
                    link = `/api/v1/admin/requests/trash${requestType ? `?requestType=${requestType}` : ''}`
                    break
                case 'Requests':
                    link = `/api/v1/admin/deptChair/requests${requestType ? `?requestType=${requestType}` : ''}`
                    break
                default:
                    link = ``
            }
        }

        const { data } = await axios.get(link)

        dispatch({
            type: GET_REQUESTS_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: GET_REQUESTS_FAIL,
            payload: error.response.data.message
        })
    }
}

//get stats
export const getStats = (role) => async (dispatch) => {
    try {
        dispatch({
            type: REQUEST_STATS_REQUEST
        })

        let link = ''

        if (role === 'CICS Office') {
            link = `/api/v1/admin/cics/stats`
        } else {
            link = `/api/v1/admin/deptChair/stats`
        }
        
        const { data } = await axios.get(link)

        dispatch({
            type: REQUEST_STATS_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: REQUEST_STATS_FAIL,
            payload: error.response.data.message
        })
    }
}

//get requests
export const getCrossEnrol = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_CROSSENROL_REQUEST
        })

        const { data } = await axios.get('/api/v1/admin/deptChair/crossEnrollment')

        dispatch({
            type: GET_CROSSENROL_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: GET_CROSSENROL_FAIL,
            payload: error.response.data.message
        })
    }
}

//Get single request (dashboard)
export const getRequestDetails = (requestId) => async (dispatch) => {
    try {
        dispatch({
            type: REQUEST_DETAILS_REQUEST
        })

        const { data } = await axios.get(`/api/v1/request/${requestId}`)

        dispatch({
            type: REQUEST_DETAILS_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: REQUEST_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

//update request
export const updateRequest = (requestId, request, isTrash) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_REQUEST_REQUEST
        })

        let config = { headers: {} }

        let link = ``

        if (isTrash) {
            link = `/api/v1/admin/trash/${requestId}`
            config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

        } else {
            link = `/api/v1/admin/update/${requestId}`
            config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        }

        const { data } = await axios.put(link, request, config)

        dispatch({
            type: UPDATE_REQUEST_SUCCESS,
            payload: data.success
        })
    }
    catch (error) {
        dispatch({
            type: UPDATE_REQUEST_FAIL,
            payload: error.response.data.message
        })
    }
}

//assign request to self
export const assignRequest = (requestId, request) => async (dispatch) => {
    try {
        dispatch({
            type: ASSIGN_REQUEST_REQUEST
        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/cics/assign/${requestId}`, request, config)

        dispatch({
            type: ASSIGN_REQUEST_SUCCESS,
            payload: data.success
        })
    }
    catch (error) {
        dispatch({
            type: ASSIGN_REQUEST_FAIL,
            payload: error.response.data.message
        })
    }
}

//unassign request 
export const unassignRequest = (requestId, request) => async (dispatch) => {
    try {
        dispatch({
            type: UNASSIGN_REQUEST_REQUEST
        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/cics/unassign/${requestId}`, request, config)

        dispatch({
            type: UNASSIGN_REQUEST_SUCCESS,
            payload: data.success
        })
    }
    catch (error) {
        dispatch({
            type: UNASSIGN_REQUEST_FAIL,
            payload: error.response.data.message
        })
    }
}

//delete request
export const deleteRequest = (requestId, emptyTrash) => async (dispatch) => {
    try {
        dispatch({
            type: DELETE_REQUEST_REQUEST
        })

        const { data } = await axios.delete(`/api/v1/delete/${requestId}/${emptyTrash}`)

        dispatch({
            type: DELETE_REQUEST_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: DELETE_REQUEST_FAIL,
            payload: error.response.data.message
        })
    }
}

//clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}