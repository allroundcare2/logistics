<script lang="ts">
    import { getUrl } from "../../functions/clientAuth";
    import { handleNotification } from "../../functions/clientNot";
    import RegisterNav from "../../components/RegisterNav.svelte";
    import { goto } from "@sapper/app";
    import axios from "axios";
    import { EuserType, Iuser } from "../../Model/accounts";
    import Swal from "sweetalert2";
    import {onMount} from 'svelte';
    let driver: Iuser = {};

    let confirm = "";
    let url = "";
    const submit = async () => {
        try {
            if (confirm != driver.password)
                return handleNotification(
                    "password does not match",
                    window,
                    "error",
                    "error"
                );
            driver.type = EuserType.DRIVER;
            console.log(url);
            const axiosData = await axios.post(
                `${url}/accounts/register`,
                driver
            );
            if (axiosData.data.msg == "success") {
                console.log(axiosData.data);
                sessionStorage.setItem(
                    "arc_driver",
                    JSON.stringify(axiosData.data)
                );
                let resp = await Swal.fire({
                    title: "user created successfully ",
                    text: "your account has been created successfully! You can continue your registeration but remember to check your mail to confirm your email",
                    icon: "success",
                    timer: 6000,
                });
                if (resp) {
                    goto("register/step2");
                }
            } else {
                let resp = await Swal.fire({
                    title: "user was not created. ",
                    text: "something went wrong , we are aware of it and are on it. Please try again later",
                    icon: "error",
                    timer: 6000,
                });
            }
        } catch (error) {
            let resp = await Swal.fire({
                title: "user was not created. ",
                text: "something went wrong , we are aware of it and are on it. Please try again later",
                icon: "error",
                timer: 6000,
            });
        }
    };

    onMount(()=>{
        url = getUrl();
    })

    
</script>

<div class="main">
    <div class="container">
        <RegisterNav step="1" />
        <p class="h3 mt-4">Personal Information</p>
        <p class="text">
            please provide us with your personal Information to know you better
        </p>

        <form on:submit|preventDefault={submit} style="margin-top: 40px">
            <div class="form-group mt-3">
                <label for="first">First name</label>
                <input
                    required
                    bind:value={driver.first_name}
                    type="text"
                    class="form-control"
                    id="first"
                    placeholder="enter first name"
                />
            </div>
            <div class="form-group mt-3">
                <label for="last">Last name</label>
                <input
                    required
                    bind:value={driver.last_name}
                    type="text"
                    class="form-control"
                    id="last"
                    placeholder="enter last name"
                />
            </div>
            <div class="form-group mt-3">
                <label for="dob">Date of Birth</label>
                <input
                    type="date"
                    class="form-control"
                    id="dob"
                    required
                    bind:value={driver.DOB}
                    placeholder="DD/MM/YYYY"
                />
            </div>
            <div class="form-group mt-3">
                <label for="email">Email Address</label>
                <input
                    required
                    bind:value={driver.email}
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="e.g johndoe@gmail.com"
                />
            </div>
            <div class="form-group mt-3">
                <label for="phone">Mobile Number</label>
                <input
                    required
                    bind:value={driver.phone}
                    type="tel"
                    class="form-control"
                    id="phone"
                    placeholder="e.g +2348034564321"
                />
            </div>
            <div class="form-group mt-3">
                <label for="password">Password</label>
                <input
                    required
                    bind:value={driver.password}
                    type="password"
                    class="form-control"
                    id="phone"
                    placeholder="e.g xZYUdjka##223"
                />
            </div>
            <div class="form-group mt-3">
                <label for="confirm">Confirm Password</label>
                <input
                    required
                    bind:value={confirm}
                    type="password"
                    class="form-control"
                    id="confirm"
                    placeholder="confirm password must match password"
                />
            </div>

            <div class="mt-5">
                <button type="submit" class="btn btn-full but">Next</button>
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
