function app() {
    return {

        id: null,
        email: null,
        password: null,

        message: null,

        async postData(url = "", data) {
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify(data),
            });
            return response;
        },

        login() {

            if (this.email == '' || this.email == null && this.password == '' || this.password == null)
                return;

            const data = {
                email: this.email,
                password: this.password,
            }

            this.postData("api/sign-in", data)
                .then(async result => {
                    if (result.status == 200)
                    {
                        localStorage.setItem("user", JSON.stringify(await result.json()))
                        window.location.replace("/calendario")
                    }
                        

                    this.clean()
                    this.message = "Usuario invalido!"
                });
        },

        clean() {
            this.email = null;
            this.password = null;
        }
    }
}