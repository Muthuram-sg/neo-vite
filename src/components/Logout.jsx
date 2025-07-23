export const GraphqlErr = (err) => {
    if (err.message.includes("JWSInvalidSignature") || err.message.includes("Malformed")) {
        console.log("blood sucker ", err.message, localStorage.removeItem("neoToken"))
        window.location.reload();
    }
}
export const Logout = () => {
    localStorage.removeItem("neoToken");
    window.location.reload()
}
// eslint-disable-next-line import/no-anonymous-default-export
export default { Logout, GraphqlErr} ;