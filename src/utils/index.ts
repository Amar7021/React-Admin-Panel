function serializeFireBaseErrors(err: string): string {
    const strIdx = err.indexOf("/") + 1
    let errString = err.slice(strIdx, -2)

    switch (errString) {
        case "user-not-found":
            return "User not found"
        case "wrong-password":
            return "Wrong password"
        case "email-already-in-use":
            return "Email already in use"
        case "invalid-email":
            return "Invalid email"
        case "too-many-requests":
            return "Too many requests. Please try again later."
        default:
            return "Something went wrong"
    }
}

export { serializeFireBaseErrors };