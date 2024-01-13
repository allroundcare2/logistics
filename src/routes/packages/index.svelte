<script lang="ts">
    import axios from "axios";

    import { onMount } from "svelte";
    import zango from "zangodb";
    import Nav from "../../components/Nav.svelte";
    import { checkForSession, getUrl } from "../../functions/clientAuth";
    import { goto } from "@sapper/app";
    import type { Iorder } from "../../Model/accounts";
    import { handleNotification } from "../../functions/clientNot";
    import Swal from "sweetalert2";
    const db = new zango.Db("arc_db", 1, { orders: ["_id"] });

    const orders_collections = db.collection("orders");
    const page = "Packages Page";
    let user: any;
    let url = "";
    let orders: Iorder[] = [];
    let dispatcherOrders: Iorder[] = [];
    let closedOrders: Iorder[] = [];
    let continueOrder: Iorder[] = [];
    let tab = "pickup";
    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                });
            } else {
                handleNotification(
                    "oops could not get your location",
                    window,
                    "error",
                    "oops!!!"
                );
                return reject(false);
            }
        });
    };
    const switchTab = (myTap) => {
        tab = myTap;
    };
    const startRide = async (order: any) => {
        console.log("my order", order);
        try {
            const isActiveOrder = await axios.get(
                `${url}/drivers/is_uncompleted_delivery`,
                {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                }
            );
            if (!isActiveOrder.data.data.status) {
                const orderResp = await axios.get(
                    `${url}/drivers/accept_delivery_request?id=${order.id}`,
                    
                    {
                        headers: {
                            Authorization: "Bearer " + user.token,
                        },
                    }
                );
                if (orderResp) {
                    order.dispatcher_id = orderResp.data.id;
                    order.current_status = orderResp.data.current_status;
                    order.status.push(orderResp.data.status);

                    localStorage.setItem(
                        "arc_active_order",
                        JSON.stringify(order)
                    );
                    let data = await Swal.fire({
                        icon: "success",
                        title: "Order has been added successfully",
                        text: "success",
                    });

                    goto(`orders/delivery?id=${order._id}`);
                }
            } else {
                Swal.fire({
                    icon: "error",
                    text: "you cant start a new ride because of unresolved ride. Check the complete tab to finish",
                    title: "oops!!!",
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                text: "something went wrong when starting this trip",
                title: "oops!!!",
            });
        }
    };

    const continueRide = async (order: any) => {
        localStorage.setItem("arc_active_delivery", JSON.stringify(order));
        goto("packages/delivery?id=" + order.id);
    };
    const makePayment = (order: Iorder) => {
        goto("orders/delivery-reciept?id=" + order._id);
    };
    const view = (order: Iorder) => {
        goto("orders/delivery-reciept?id=" + order._id);
    };
    onMount(async () => {
        try {
            user = checkForSession(goto);
            console.log(getUrl());
            url = getUrl();
            const location = await getLocation();
            console.log(location);

            const orderResp = await axios.get(`${url}/drivers/all_deliveries`, {
                headers: {
                    Authorization: "Bearer " + user.token,
                },
            });
            if (orderResp) {
                handleNotification(
                    "orders retrieved successfully",
                    window,
                    "success",
                    "ok"
                );
                console.log(orderResp);
                let orders = orderResp.data.data;
                dispatcherOrders = [];
                closedOrders = [];
                continueOrder = [];
                orders.forEach((order) => {
                    if (order.status == "start") dispatcherOrders.push(order);
                    if (order.status == "on_going") continueOrder.push(order);
                });
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

        <div class="my-tab mt-4">
            <div class="row">
                <div class="col-4 pl-2 pr-2 text-center">
                    <button
                        on:click={() => {
                            switchTab("pickup");
                        }}
                        style="width: 90%;"
                        class=" btn button-my"
                        class:active-color={tab == "pickup"}
                        class:plain-color={tab != "pickup"}>Pickup</button
                    >
                </div>
                <div class="col-4 pl-2 pr-2 text-center">
                    <button
                        on:click={() => {
                            switchTab("confirm");
                        }}
                        style="width: 90%;"
                        class=" btn button-my"
                        class:active-color={tab == "confirm"}
                        class:plain-color={tab != "confirm"}>Confirmed</button
                    >
                </div>
                <div class="col-4 pl-2 pr-2 text-center">
                    <button
                        on:click={() => {
                            switchTab("delivery");
                        }}
                        style="width: 90%;"
                        class=" btn button-my"
                        class:active-color={tab == "delivery"}
                        class:plain-color={tab != "delivery"}>Delivery</button
                    >
                </div>
            </div>
        </div>
        {#if tab == "confirm"}
            {#each continueOrder as order}
                <div class="row">
                    <div class="col-12">
                        <div class="card card-body">
                            <div class="row pt-0">
                                <div class="col-8 pt-0 mt-0">
                                    <span class="order-name"
                                        >{order.delivery_type}</span
                                    >
                                </div>
                                <div class="col-4 text-end">
                                    <p class="amount">
                                        ₦{Number(
                                            order.packages.reduce(
                                                (accumulator, currentValue) =>
                                                    accumulator +
                                                    currentValue.cost,
                                                0
                                            )
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div class="row mt-0">
                                <div class="col-9">
                                    <div class="row">
                                        <div class="col-1">
                                            <span class="order-status" />
                                        </div>
                                        <div class="col-10 pt-0">
                                            <span class="order-description"
                                                >{order.packages[0]
                                                    .pickupAddress}</span
                                            >
                                            <br />

                                            <span class="order-description"
                                                >{order.packages[0]
                                                    .destinationAddress}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <button
                                        on:click={() => {
                                            continueRide(order);
                                        }}
                                        class="btn btn-outline btn-sm btn-success"
                                        >start</button
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                no order here
            {/each}
        {:else if tab == "pickup"}
            {#each dispatcherOrders as order}
                <div class="row">
                    <div class="col-12">
                        <div class="card card-body">
                            <div class="row pt-0">
                                <div class="col-8 pt-0 mt-0">
                                    <span class="order-name"
                                        >{order.delivery_type}</span
                                    >
                                </div>
                                <div class="col-4 text-end">
                                    <p class="amount">
                                        ₦{Number(
                                            order.packages.reduce(
                                                (accumulator, currentValue) =>
                                                    accumulator +
                                                    currentValue.cost,
                                                0
                                            )
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div class="row mt-0">
                                <div class="col-9">
                                    <div class="row">
                                        <div class="col-1">
                                            <span class="order-status" />
                                        </div>
                                        <div class="col-10 pt-0">
                                            <span class="order-description"
                                                >{order.packages[0]
                                                    .pickupAddress}</span
                                            >
                                            <br />
                                            <span class="order-description"
                                                >{order.packages[0]
                                                    .destinationAddress}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div class="col-3">
                                    <button
                                        on:click={() => {
                                            startRide(order);
                                        }}
                                        class="btn btn-outline btn-sm btn-success"
                                        >continue</button
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                no order here
            {/each}
        {:else if tab == "delivery"}
            {#each closedOrders as order}
                <div class="row">
                    <div class="col-12">
                        <div class="card card-body">
                            <div class="row pt-0">
                                <div class="col-8 pt-0 mt-0">
                                    <span class="order-name">{order._id} </span>
                                </div>
                                <div class="col-4 text-end">
                                    <p class="amount">₦300</p>
                                </div>
                            </div>
                            <div class="row mt-0">
                                <div class="col-9">
                                    <div class="row">
                                        <div class="col-1">
                                            <span class="order-status" />
                                        </div>
                                        <div class="col-10 pt-0">
                                            <span class="order-description"
                                                >{order.shopper_address}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-1">
                                            <span class="order-status" />
                                        </div>
                                        <div class="col-10 pt-0">
                                            <span class="order-description"
                                                >{order.retailer_address}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div class="col-3">
                                    {#if order.current_status == "completed"}
                                        <button
                                            on:click={() => {
                                                makePayment(order);
                                            }}
                                            class="btn btn-outline btn-sm btn-success"
                                            >Pay</button
                                        >
                                    {:else}
                                        <button
                                            on:click={() => {
                                                view(order);
                                            }}
                                            class="btn btn-outline btn-sm btn-success"
                                            >View</button
                                        >
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                no order here
            {/each}
        {/if}
    </div>
</main>

<style>
    .amount {
        font-weight: 700;
        font-size: 12px;
        line-height: 32px;
        color: rgba(3, 9, 25, 1);
    }
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
    button {
        font-family: "Mulish", sans-serif;
        font-weight: 600;
        font-size: 12px;
        line-height: 25px;
        letter-spacing: 0.01em;
    }
    .main {
        font-family: "Mulish", sans-serif;
        background-color: whitesmoke;
        min-height: 100vh;

        color: #555b6a;
    }
</style>
