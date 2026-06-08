export function setCookie(
    name,
    value,
    days = 30
) {
    const date = new Date();

    date.setDate(
        date.getDate() + days
    );

    document.cookie =
        `${name}=${value};expires=${date.toUTCString()};path=/`;
}

export function removeCookie(name) {
    document.cookie =
        `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}