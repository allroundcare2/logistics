<script lang="ts">
    import axios from "axios";
    import Swal from "sweetalert2";
    import { goto } from "@sapper/app";
    import RegisterNav from "../components/RegisterNav.svelte";
    import { handleNotification } from "../functions/clientNot";
    import { getUrl } from "../functions/clientAuth";
    import type { Iuser } from "../Model/accounts";
    let loading = false;
    let user: Iuser = {};
    const submit = async () => {
        const url = getUrl();
        handleNotification("checking details", window, "info", "loading...");
        loading = true;
        try {
            const loginResp = await (
                await axios.put(`${url}/accounts/forgot_password?email=${user.email}`)
            ).data;
            if (loginResp.status == "success") {
                loading = false;
                const resp = await Swal.fire({
                        title: "success",
                        text: loginResp.msg,
                        icon: "success",
                    });
                    if(resp) goto('/set-password?email=' + user.email)
            } else {
                loading = false;
                const resp = await Swal.fire({
                    title: "incorrect credentials",
                    text: loginResp.msg,
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
        <p class="h3 mt-4">Forgot Password</p>
        <p class="text">
           Enter your email address to get secret key to reset your password
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
       
        
            <div class="mt-5">
                {#if loading}
                    <button type="submit" disabled class="btn btn-full but"
                        >submitting...</button
                    >
                {:else}
                    <button type="submit" class="btn btn-full but">submit</button
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
