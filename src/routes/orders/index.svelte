<script lang="ts">
    import axios from "axios";

    import { onMount } from "svelte";

    import Nav from "../../components/Nav.svelte";
    import { checkForSession, getUrl } from "../../functions/clientAuth";
    import { goto } from "@sapper/app";
    import type { Iorder } from "../../Model/accounts";
    import { handleNotification } from "../../functions/clientNot";
    const page = "Orders Page";
    let user: any;
    let orders: Iorder[] = [];

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                return {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
            });
        } else {
            handleNotification(
                "oops could not get your location",
                window,
                "error",
                "oops!!!"
            );
            return false;
        }
    };
    onMount(async () => {
        try {
            user = checkForSession(goto);
            console.log(getUrl());
            const url = getUrl();
            const location = getLocation();
            console.log(location);
            if (location) {
                const ordersResp = await axios.put(
                    `${url}/order/dispatcher_order`, location,
                    {
                        headers: {
                            Authorization: "Bearer " + user.token,
                        },
                    }
                );
                orders = ordersResp.data;
                console.log(orders);
            } else {
              
            }
        } catch (error) {
            console.log(error);
        }
    });
</script>

<main class="main">
    <div class="container">
        <Nav {page} />

        <div class="info">
            <p>
                You can pick only 5 multiple orders at a time. Choose the ones
                that are closer in location
            </p>
        </div>
        <div class="row">
            <div class="col text-center">
                <button class="btn btn-success btn-sm btn-rounded">all</button>
            </div>
            <div class="col text-center">
                <button class="btn btn-secondary btn-sm btn-rounded"
                    >pending</button
                >
            </div>
            <div class="col text-center">
                <button class="btn btn-secondary btn-sm btn-rounded"
                    >completed</button
                >
            </div>
        </div>
      {#each orders as order}
      <div class="row">
        <div class="col-12">
            <div class="card card-body">
                <div class="row pt-0">
                    <div class="col-6 pt-0 mt-0">
                        <span class="order-name">Order 311 </span>
                        <span class="distance p-1 ml-2">{order.distance.toFixed(2)}km</span>
                    </div>
                    <div class="col-6">
                        <span class="float-end order-number"
                            >Order ID: No1209906032</span
                        >
                    </div>
                </div>
                <div class="row">
                    <div class="col-9">
                        <span class="order-status mr-2" />
                        <span class="order-description pl-3"
                            >3rd Ave road, Ikot Ansa</span
                        >
                    </div>
                    <div class="col-3">
                        <span class="done fa fa-check p-1" />
                    </div>
                </div>

                <div class="fixed-bottom text-center pl-2 pr-2 mb-3">
                    <button class="btn btn-success submit btn-block "
                        >confirm</button
                    >
                </div>
            </div>
        </div>
    </div>
      {:else}
        no order here
      {/each}
    </div>
</main>

<style>
    .submit {
        width: 100%;
    }
    .done {
        width: 20px;
        height: 20px;
        text-align: center;
        color: white;
        border-radius: 50%;
        background: #27ad60;
    }

    .info {
        line-height: 15px;
        font-size: 12px;
    }

    .main {
        font-family: "Mulish", sans-serif;
        background-color: whitesmoke;
        min-height: 100vh;

        color: #555b6a;
    }
</style>
