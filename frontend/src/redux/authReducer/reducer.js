import * as types from "./actionType"

const initialState = {
    sign_up_processing: false,
    sign_up_failed: false,
    sign_up_success: false,
    sign_up_message: "",
    sign_up_user: {},

    sign_in_processing: false,
    sign_in_failed: false,
    sign_in_success: false,
    sign_in_message: "",
    sign_in_User: {},

    user_update_processing: false,
    user_update_success: false,
    user_update_failed: false,
    user_update_message: "",

    isAnonym: false,
    anonymId: null,
    anonymName: null,
}

export const reducer = (state = initialState, action) => {

    const { type, payload } = action;
    switch (type) {
        case types.SIGN_UP_REQUEST_PROCESSING:
            return {
                ...state,
                sign_up_processing: true,
                sign_up_failed: false,
                sign_up_success: false,
            };
        case types.SIGN_UP_REQUEST_FAILED:
            return {
                ...state,
                sign_up_processing: false,
                sign_up_failed: true,
                sign_up_success: false,
                sign_up_message: payload
            };
        case types.SIGN_UP_REQUEST_SUCCESS:
            return {
                ...state,
                sign_up_processing: false,
                sign_up_failed: false,
                sign_up_success: true,
                sign_up_message: "Account Successfully Created.",
                sign_up_user: payload,
            };

        case types.SIGN_IN_REQUEST_PROCESSING:
            return {
                ...state,
                sign_in_processing: true,
                sign_in_failed: false,
                sign_in_success: false,
            };
        case types.SIGN_IN_REQUEST_FAILED:
            return {
                ...state,
                sign_in_processing: false,
                sign_in_failed: true,
                sign_in_success: false,
                sign_in_message: payload
            };
        case types.SIGN_IN_REQUEST_SUCCESS:
            return {
                ...state,
                sign_in_processing: false,
                sign_in_failed: false,
                sign_in_success: true,
                sign_in_message: payload,

                isAnonym: false, // Pastikan status anonym direset saat login
                anonymId: null,
                anonymName: null,
            };
        case types.LOGOUT_REQUEST:
            return {
                ...state,
                sign_up_processing: false,
                sign_up_failed: false,
                sign_up_success: false,
                sign_up_message: "",
                sign_up_user: {},

                sign_in_processing: false,
                sign_in_failed: false,
                sign_in_success: false,
                sign_in_message: "",
                sign_in_User: {},

                isAnonym: false, // Reset status anonym saat logout
                anonymId: null,
                anonymName: null,
            };

        case types.UPDATE_USER_DATA_REQUEST_PROCESSING:
            return {
                ...state,
                user_update_processing: true,
                user_update_success: false,
                user_update_failed: false,
                user_update_message: "",
            };
        case types.UPDATE_USER_DATA_REQUEST_FAILED:
            return {
                ...state,
                user_update_processing: false,
                user_update_success: false,
                user_update_failed: true,
                user_update_message: payload,
            };
        case types.UPDATE_USER_DATA_REQUEST_SUCCESS:
            return {
                ...state,
                user_update_processing: false,
                user_update_success: true,
                user_update_failed: false,
                user_update_message: payload,
                sign_in_User: { ...state.sign_in_User, ...payload },
            };
            case types.SET_ANONYM:
            return {
                ...state,
                isAnonym: true,
                anonymId: payload.anonymId,
                anonymName: payload.anonymName,
                sign_in_User: {}, // Reset user login
                sign_in_success: false,
                sign_in_message: "",
            };
        case types.CLEAR_ANONYM:
            return {
                ...state,
                isAnonym: false,
                anonymId: null,
                anonymName: null,
            };
        default:
            return state;
    }
}