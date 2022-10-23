
<script context="module">
	// the (optional) preload function takes a
	// `{ path, params, query }` object and turns it into
	// the data we need to render the page
	export async function preload(page, session) {
		// the `slug` parameter is available because this file
		// is called [slug].svelte
		const { email } = page.query;

	

		return { email };
	}
</script>

<script lang="ts">
    import axios from "axios";
    import Swal from "sweetalert2";
    import { goto } from "@sapper/app";
    import RegisterNav from "../components/RegisterNav.svelte";
    import { handleNotification } from "../functions/clientNot";
    import { getUrl } from "../functions/clientAuth";
    let loading = false;
    let password;
    let confirm;
    let token;
    export let email: string;
    const submit = async () => {
        if(!password || !confirm || confirm !== password) return handleNotification('password does not match', window,'error', 'error');
        const url = getUrl();
        handleNotification("checking details", window, "info", "loading...");
        loading = true;
        try {
            const loginResp = await (
                await axios.put(`${url}/accounts/set_password`,{email, password, token})
            ).data;
            if (loginResp.status == "success") {
                loading = false;
                const resp = await Swal.fire({
                        title: "success",
                        text: loginResp.msg,
                        icon: "success",
                    });
                    if(resp) goto('/login');
            } else {
                loading = false;
                const resp = await Swal.fire({
                    title: "oops!!",
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
        <p class="h3 mt-4">Set Password</p>
        <p class="text">
           Enter your new password and confirm your password
        </p>

        <form on:submit|preventDefault={submit} style="margin-top: 40px">
            <div class="form-group mt-4">
                <label for="email"> Token</label>
                <input
                    bind:value={token}
                    type="text"
                    class="form-control"
                    id="token"
                    required
                    placeholder="enter your token"
                />
            </div>
            <div class="form-group mt-4">
                <label for="email">Password</label>
                <input
                    bind:value={password}
                    type="password"
                    class="form-control"
                    id="password"
                    required
                    placeholder="******"
                />
            </div>
            <div class="form-group mt-4">
                <label for="email"> Confirm Password</label>
                <input
                    bind:value={confirm}
                    type="password"
                    class="form-control"
                    id="confirm"
                    required
                    placeholder="******"
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
