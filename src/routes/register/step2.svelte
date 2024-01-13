<script lang="ts">
    import RegisterNav from "../../components/RegisterNav.svelte";
    import { goto } from "@sapper/app";
    import { EvehicleType, Ivehicle } from "../../Model/accounts";
    import Swal from "sweetalert2";
    import axios from "axios";
import { getUrl } from "../../functions/clientAuth";
    let vehicle: Ivehicle = {};
    let url = '';
    const submit = async () => {
        try {
            url = getUrl();
            const user = JSON.parse(sessionStorage.getItem("arc_driver"));
            console.log(user);
            if (!user.id) {
                Swal.fire({
                    title: "No session",
                    text: "you do not have a current session, you can try logging in",
                    icon: "error",
                }).then(() => {
                    goto("/login");
                     return;
                });
            }
            vehicle.driver_id = user.id;
            console.log(vehicle);
            const resp = await (
                await axios.post(`${url}/accounts/vehicle`, vehicle)
            ).data;
            if (resp) {
                let myResp = await Swal.fire({
                    title: `vehicle has been added `,
                    text: `your vehicle has been added successfully to user ${user.email}! `,
                    icon: "success",
                    timer: 6000,
                });
                if (myResp) {
                    goto("register/step3");
                }
            }
        } catch (error) {
            console.log(error);
            let resp = await Swal.fire({
                    title: 'vehicle was not added. ',
                    text: 'something went wrong , we are aware of it and are on it. Please try again later',
                    icon: 'error',
                    timer: 10000
                });
        }
    };
</script>

<div class="main">
    <div class="container">
        <RegisterNav step="2" />
        <p class="h3 mt-4">Vechile Details</p>
        <p class="text">
            please provide us with your Vechile details for proper arrangement
        </p>

        <form on:submit|preventDefault={submit} style="margin-top: 40px">
            <div class="form-group mt-3">
                <label for="manufacturer">Vechile Manufacturer</label>
                <input
                    required
                    bind:value={vehicle.vehicle_manufacturer}
                    type="text"
                    class="form-control"
                    id="manufacturer"
                    placeholder="e.g Yamaha 314"
                />
            </div>
            <div class="form-group mt-3">
                <label for="type">Vechile type</label>
                <select
                    required
                    class="form-control"
                    bind:value={vehicle.vehicle_type}
                    id="type"
                >
                    <option disabled selected value="">pick Vechile type</option
                    >
                    <option value={EvehicleType.OKODA}
                        >{EvehicleType.OKODA}
                        </option
                    >  <option value={EvehicleType.CAR}
                    >{EvehicleType.CAR}</option
                >
                    <option value={EvehicleType.BICYCLE}
                    >{EvehicleType.BICYCLE}</option
                >
                    <option value={EvehicleType.TRICYCLE}
                    >{EvehicleType.TRICYCLE}</option
                >
                <option value={EvehicleType.VAN}
                    >{EvehicleType.VAN}</option
                >
                </select>
            </div>
            <div class="form-group mt-3">
                <label for="plate">License plate</label>
                <input
                    required
                    bind:value={vehicle.license_plate}
                    type="text"
                    class="form-control"
                    id="plate"
                    placeholder="e.g, BG 336 CB"
                />
            </div>
            <div class="form-group mt-3">
                <label for="permit">Riders Permit</label>
                <input
                    required
                    bind:value={vehicle.rider_permit}
                    type="text"
                    class="form-control"
                    id="permit"
                    placeholder="e.g, BG 336 CB"
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
