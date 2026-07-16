export const formatAddress = (address) => {
    if (!address) return null;
    const parts = [
        address.prefecture,
        address.city,
        address.district,
        address.address_other,
    ].filter(Boolean);
    if (parts.length === 0) return null;
    return parts.join("");
};

export const formatPostalCode = (postalCode) => {
    if (!postalCode) return null;
    return postalCode.length === 7
        ? `${postalCode.slice(0, 3)}-${postalCode.slice(3)}`
        : postalCode;
};
