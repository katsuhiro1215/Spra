export const getFullName = (admin) =>
    admin.profile
        ? `${admin.profile.last_name} ${admin.profile.first_name}`
        : "-";

export const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("ja-JP") : "-";
