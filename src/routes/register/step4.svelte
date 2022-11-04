<script lang="ts">
    
    import { goto } from "@sapper/app";
    import axios from "axios";
    import RegisterNav from "../../components/RegisterNav.svelte";
    import Swal from "sweetalert2";
import { getUrl } from "../../functions/clientAuth";
    let url = '';
    let driver: any ={};
    const submit = async () => {
       url = getUrl();
        const user = JSON.parse(sessionStorage.getItem("arc_driver"));
        if (!user) {
            Swal.fire({
                title: "No session",
                text: "you do not have a current session, you can try logging in",
                icon: "error",
            }).then(() => {
                goto("/login");
                return;
            });
        }

        try {
            driver.driver_id = user.id;
            const driverResp = await (
                await axios.put(`${url}/accounts/update_bank`, driver)
            ).data;
            if (driverResp) {
                const resp = await Swal.fire({
                    title: "welldone",
                    icon: "success",
                    text: "you are warmly welcome to the team. Your login details. Your login details will be forwarded to your mail once your information is confirmed ",
                    confirmButtonText: "Go to Login",
                });
                if (resp) {
                    goto("/login");
                }
            }
        } catch (error) {}
    };
</script>

<div class="main">
    <div class="container">
        <RegisterNav step="4" />
        <p class="h3 mt-5">Payment Details</p>
        <p class="text">
            please provide us with your banking details for quicker payments
        </p>

        <form on:submit|preventDefault={submit} style="margin-top: 40px">
            <div class="form-group mt-3">
                <label for="holder">Bank Holder</label>
                <input
                    type="text"
                    class="form-control"
                    id="holder"
                    placeholder="e.g John Doe"
                />
            </div>
            <div class="form-group mt-3">
                <label for="accnt">Account's Number</label>
                <input
                    required
                    bind:value={driver.account_number}
                    type="number"
                    min="0000000000" max="9999999999"
                    
                    class="form-control"
                    id="accnt"
                    placeholder="e.g 103567253"
                />
            </div>
            <div class="form-group mt-3">
                <label for="bnk">Bank Name</label>
                <select
                    required
                    bind:value={driver.bank_name}
                    class="form-control"
                    id="bnk"
                >
                    <option disabled selected value="">pick your bank</option>
                    <option value="access">Access Bank</option>
                    <option value="gtb">Guarantee Trust Bank</option>
                    <option value="union">Union Bank</option>
                    <option value="UBA">United Bank of Africa</option>
                </select>
            </div>

            <div class="mt-5">
                <button type="submit" class="btn btn-full but"
                    >Complete</button
                >
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
    select {
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
