export const END_POINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GET_NOTES: '/notes',
    CREATE_NOTE: '/notes',
    UPDATE_NOTE: (id) => `/notes/${id}`,
    DELETE_NOTE: (id) => `/notes/${id}`,
}