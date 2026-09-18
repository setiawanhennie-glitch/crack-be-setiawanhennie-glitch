"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUsers = fetchUsers;
exports.updateUserRole = updateUserRole;
exports.toggleUserSuspend = toggleUserSuspend;
exports.updateCourseAssignments = updateCourseAssignments;
const API_URL_BASE = 'http://localhost:3001';
async function fetchUsers() {
    const token = getToken();
    const res = await fetch(`${API_URL_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
        throw new Error('Gagal memuat pengguna');
    return res.json();
}
async function updateUserRole(userId, role) {
    const token = getToken();
    const res = await fetch(`${API_URL_BASE}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
    });
    if (!res.ok)
        throw new Error('Gagal mengubah role');
    return res.json();
}
async function toggleUserSuspend(userId, suspend) {
    const token = getToken();
    const res = await fetch(`${API_URL_BASE}/users/${userId}/suspend`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ suspend }),
    });
    if (!res.ok)
        throw new Error('Gagal mengubah status');
    return res.json();
}
function getToken() {
    if (typeof window === 'undefined')
        return '';
    const stored = localStorage.getItem('token');
    if (stored)
        return stored;
    return (document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1] ?? '');
}
async function updateCourseAssignments(courseId, classes) {
    const token = getToken();
    const res = await fetch(`${API_URL_BASE}/teacher/courses/${courseId}/assignments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ classes }),
    });
    if (!res.ok)
        throw new Error('Gagal mengatur kelas tujuan');
    return res.json();
}
//# sourceMappingURL=auth-client.js.map