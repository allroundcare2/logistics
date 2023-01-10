<script lang="ts">
    import axios from "axios";

    import { onMount } from "svelte";
    import zango from "zangodb";
    import Nav from "../../components/Nav.svelte";
    import { checkForSession, getUrl } from "../../functions/clientAuth";
    import { goto } from "@sapper/app";
    import type {  Iorder } from "../../Model/accounts";
    import { handleNotification } from "../../functions/clientNot";
    import Swal from "sweetalert2";
    const db = new zango.Db("arc_db", 1, { orders: ["_id"] });

    const orders_collections = db.collection("orders");
    const page = "Orders Page";
    let user: any;
    let url = "";
    let orders: Iorder[] = [];
    let dispatcherOrders: Iorder[] = [];
    let closedOrders: Iorder[] = [];
    let tab = "confirm";
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
    const startRide = async (order: Iorder) => {
        try {
            const isActiveOrder = await axios.get(
                `${url}/drivers/is_uncompleted_ride`,
                {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                }
            );
            if (!isActiveOrder.data.status) {
                const orderResp = await axios.put(
                    `${url}/order/accept_order_dispatcher?id=${order._id}`,
                    {},
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
            }
            else{
                Swal.fire({
                icon: "error",
                text: "you cant start a new ride because of unresolved ride. Check the complete tab to finish",
                title: "oops!!!",
            });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "something went wrong when starting this trip",
                title: "oops!!!",
            });
        }
    };

    const continueRide = async (order: Iorder) => {
        localStorage.setItem("arc_active_order", JSON.stringify(order));
        goto("orders/delivery?id=" + order._id);
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

            const orderResp = await axios.get(
                `${url}/drivers/open_orders`,
                {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                }
            );
            if (orderResp) {
                handleNotification(
                    "orders retrieved successfully",
                    window,
                    "success",
                    "ok"
                );
                dispatcherOrders = orderResp.data;
                dispatcherOrders.forEach((order, i) => {
                    if (
                        order.current_status == 'completed' ||
                        order.current_status == 'reciept submitted' ||
                        order.current_status == 'declined by driver' ||
                        order.current_status == 'payment approved by admin'
                    ) {
                        console.log(order);
                        
                        dispatcherOrders.splice(i, 1);
                    }
                });
                console.log('dispatch', dispatcherOrders);
                
                dispatcherOrders = dispatcherOrders;
              
            }

            const closedResp = await axios.get(
                `${url}/drivers/closed_orders`,
                {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                }
            );
            if (closedResp) {
                handleNotification(
                    "orders retrieved successfully",
                    window,
                    "success",
                    "ok"
                );
                closedOrders = closedResp.data;
               closedOrders = closedOrders;
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

        <div class="my-tab  mt-4">
            <div class="row">
             
                <div class="col-4 pl-2 pr-2 text-center">
                    <button
                        on:click={() => {
                            switchTab("pickup");
                        }}
                        style="width: 90%;"
                        class=" btn button-my  "
                        class:active-color={tab == "pickup"}
                        class:plain-color={tab != "pickup"}>Pickup</button
                    >
                </div>
                <div class="col-4 pl-2 pr-2  text-center">
                    <button
                        on:click={() => {
                            switchTab("confirm");
                        }}
                        style="width: 90%;"
                        class=" btn button-my "
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
                        class=" btn button-my  "
                        class:active-color={tab == "delivery"}
                        class:plain-color={tab != "delivery"}>Delivery</button
                    >
                </div>
            </div>
        </div>
        {#if tab == "confirm"}
            {#each orders as order}
                <div class="row">
                    <div class="col-12">
                        <div class="card card-body">
                            <div class="row pt-0">
                                <div class="col-8 pt-0 mt-0">
                                    <span class="order-name">{order._id} </span>
                                    <span class="distance p-1 ml-2"
                                        >{order.distance.toFixed(2)}km</span
                                    >
                                </div>
                                <div class="col-4 text-end ">
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
                                            <span class="order-description "
                                                >{order.shopper_address}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-1">
                                            <span class="order-status" />
                                        </div>
                                        <div class="col-10 pt-0">
                                            <span class="order-description "
                                                >{order.retailer_address}</span
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
                                    <span class="order-name">{order._id}</span>
                                </div>
                                <div class="col-4 text-end ">
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
                                            <span class="order-description "
                                                >{order.retailer_address}</span
                                            >
                                            <br />
                                            <span class="order-description "
                                                >{order.shopper_address}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-1">
                                            <span class="order-status" />
                                        </div>
                                        <div class="col-10 pt-0">
                                            <span class="order-description "
                                                >{order.retailer_address}</span
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
                                <div class="col-4 text-end ">
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
                                            <span class="order-description "
                                                >{order.shopper_address}</span
                                            >
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-1">
                                            <span class="order-status" />
                                        </div>
                                        <div class="col-10 pt-0">
                                            <span class="order-description "
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
