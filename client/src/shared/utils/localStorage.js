export function saveUser(user) {
    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );
}

export function loadUser() {
    const user = localStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;
}

export function removeUser() {
    localStorage.removeItem("user");
}