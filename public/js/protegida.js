document.addEventListener('DOMContentLoaded', async e => {

//Para obtener el token desde el localStorage
// try {
//     const token = localStorage.getItem("token");
//     console.log(token)
//     const res = await fetch('/api/v1/auth/protected', {
//         method: "GET",
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: "Bearer " + token,
//         },
//     });
//     console.log(res.ok, res.status);
//     const data = await res.json();
    
//     if(res.ok){
//         const app = document.getElementById('app').textContent = data.user;
//         // console.log(app)
//     };

//     console.log(data);
// } catch (error) {
//     console.log(error);
// }

//Para obtener el token desde la cookie
try {

    const resToken = await fetch("/api/v1/auth/refresh", {
        method: "GET",
        credentials: "include",
    });

    const { token }= await resToken.json();
    console.log(token)

    const res = await fetch("/api/v1/auth/protected",{
        method: "GET",
        headers:{
            "Content-type": "application/json",
            Authorization: "Bearer " + token,
        },
        // credentials: "include",
    });
    console.log(res.ok, res.status);
    const data = await res.json();

    if(res.ok){
        document.getElementById("app").textContent = data.user;
    };

    console.log(data);

} catch (error) {
    console.log(error)
}
});

const logout = document.getElementById("logout");
logout.addEventListener("click", async() => {
    const res = await fetch("/api/v1/auth/logout", {
        method: "GET",
    });
    console.log(res)
});
