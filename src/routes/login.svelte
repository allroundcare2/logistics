<script lang="ts">
    import axios from "axios";
    import Swal from "sweetalert2";
    import { goto } from "@sapper/app";
    import RegisterNav from "../components/RegisterNav.svelte";
    import { handleNotification } from "../functions/clientNot";
    import { EuserType, Iuser } from "../Model/accounts";
    import { getUrl } from "../functions/clientAuth";
    let loading = false;
    let user: Iuser = {};
    const submit = async () => {
        const url = getUrl();
        handleNotification("checking details", window, "info", "loading...");
        loading = true;
        try {
            const loginResp = await (
                await axios.post(`${url}/accounts/login`, user)
            ).data;
            if (loginResp.type == "success") {
                loading = false;
                if (loginResp.body.type == EuserType.DRIVER) {
                    const resp = await Swal.fire({
                        title: "success",
                        text: "login successful",
                        icon: "success",
                    });
                    if (resp) {
                        localStorage.setItem(
                            "arc_l_users",
                            JSON.stringify(loginResp.body)
                        );

                        goto("/");
                    }
                } else {
                    const resp = await Swal.fire({
                        title: "wrong app",
                        text: "oops! Seems you have an account with us but not a rider. Please try any of our other apps",
                        icon: "error",
                    });
                }
            } else {
                loading = false;
                const resp = await Swal.fire({
                    title: "incorrect credentials",
                    text: "oops!!! Either your email or password is incorrect",
                    icon: "error",
                });
            }
        } catch (error) {
            loading = false;
            const resp = await Swal.fire({
                title: "ooops!!!",
                text: "oops! Someting went wrong. We are on it and are currently working on it",
                icon: "error",
            });
        }
    };
</script>

<div class="main">
    <div class="container">
        <RegisterNav step="0" />
        <p class="h3 mt-4">Login</p>
        <p class="text">
            please provide your login details for easy and quick access to the
            app
        </p>

        <form on:submit|preventDefault={submit} style="margin-top: 40px">
            <div class="form-group mt-4">
                <label for="email">Email Address</label>
                <input
                    bind:value={user.email}
                    type="email"
                    class="form-control"
                    id="email"
                    required
                    placeholder="e.g joedoe@gmail.com"
                />
            </div>
            <div class="form-group mt-4">
                <label for="password">Password</label>
                <input
                    type="password"
                    class="form-control"
                    id="password"
                    bind:value={user.password}
                    minlength="4"
                    required
                    placeholder="e.g ddjdnn233"
                />
            </div>
            <div class="mt-4 mb-5">
                <p class="text-center">
                    <a href="/forgot">forgot password?</a>
                </p>
            </div>
            <div class="mt-5">
                {#if loading}
                    <button type="submit" disabled class="btn btn-full but"
                        >Loging in...</button
                    >
                {:else}
                    <button type="submit" class="btn btn-full but">Login</button
                    >
                {/if}
            </div>
        </form>
    </div>
</div>

<style>
    .main {
        font-family: "Mulish", sans-serif;
        background-color: whitesmoke;
        min-height: 100vh;
    }
    input {
        background-color: transparent;
        color: #555b6a;
    }

    label {
        color: #555b6a;
        font-weight: 500;
    }
    .but {
        background-color: #27ad60;
        color: white;
        border-radius: 6px;
        width: 100%;
        height: 45px;
    }
    .h3 {
        text-align: left;
        color: #555b6a;
        font-weight: 700;
    }
    .text {
        text-align: left;
        color: #555b6a;
        line-height: 0.5cm;
    }
</style>
