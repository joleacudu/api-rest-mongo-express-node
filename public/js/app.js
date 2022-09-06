const form =document.getElementById('form');
const email =document.getElementById('email');
const pass =document.getElementById('pass');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        // console.log(email.value);
        // console.log(pass.value);
        const res = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: email.value, 
                password: pass.value 
            }),
        });
        console.log(res.ok, res.status);
        
        const { token } = await res.json();
        // console.log(token)
        
        // localStorage.setItem("token", token)
    
    } catch (error) {
        console.log(error);
    }
});
