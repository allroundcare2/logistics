<script context="module">
	// the (optional) preload function takes a
	// `{ path, params, query }` object and turns it into
	// the data we need to render the page
	export async function preload(page, session) {
		// the `slug` parameter is available because this file
		// is called [slug].svelte
		const { id } = page.query;
;

		return { id };
	}
</script>
<script lang="ts">
    import axios from "axios";

    import { onMount } from "svelte";

    import Sidebar from "../../components/Sidebar.svelte";
    import {
        checkForSession,
        getDistanceFromLatLonInKm,
        getUrl,
    } from "../../functions/clientAuth";
    import { handleNotification } from "../../functions/clientNot";
    import { EorderStatus, Ilocation, Iorder } from "../../Model/accounts";
    import { goto } from "@sapper/app";
import Swal from "sweetalert2";
export let id;
    let url = "";
    let watchID: any = 0;
    let map;
    let order: Iorder = { shopper: {}, retailer:{} };
    let win: any;
    let loading = false;
    let driverMarker: any = {};
    let shopperMarker: any = {};
    let retailerMaker: any = {};
    let driverIcon: any = {};
    let dispatchLocation : Ilocation = {latitude: 0, longitude: 0};
    let distance = 1;
    let status: EorderStatus | string = "";
    let doneIcon: any = {};
    let user: any;
    let pendingIcon: any = {};
    const getLocation = (): Promise<any> => {
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
    const endOrder =()=>{
        goto(`orders/complete-order?id=${order._id}`)
    }
    const gotoShopper = async () => {
        loading = true;
        handleNotification("updating movement", window, "info", "updating...");
        try {
            const orderResp = await axios.put(
                `${url}/order/start_ride_to_shopper?id=${order._id}`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                }
            );
            if (orderResp) {
                handleNotification(
                    "you can now going to pickup the order",
                    window,
                    "success",
                    "ok"
                );
                order.current_status = EorderStatus.GOTO_SHOPPER;
                let location = await getLocation();
                distance = getDistanceFromLatLonInKm(
                    location,
                    order.shopper_location
                );
                loading = false;
            }
        } catch (error) {}
    };
    const gotoRetailer = async () => {
        loading = true;
        handleNotification("updating movement", window, "info", "updating...");
        try {
            const orderResp = await axios.put(
                `${url}/order/start_ride_to_retailer?id=${order._id}`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                }
            );
            if (orderResp) {
                loading = false;
                handleNotification(
                    "you can now going to deliver the order",
                    window,
                    "success",
                    "ok"
                );
                console.log(orderResp);
               
                order.current_status = EorderStatus.GOTO_RETAILER;
               
                distance = getDistanceFromLatLonInKm(
                    dispatchLocation,
                    order.retailer_location
                );
                //add retailer marker here
                retailerMaker = win.L.marker(
                        [order.retailer_location.latitude, order.retailer_location.longitude],
                        {
                            icon: pendingIcon,
                        }
                    ).addTo(map);
            }
        } catch (error) {
            loading = false;
            console.error(error);
            handleNotification('oops!!! order was not updated successfully', window, 'error','oops!!!');
            
        }
    };

    const watchMovement =()=>{
        watchID = navigator.geolocation.watchPosition((pos)=>{
            //success callback function
           dispatchLocation.latitude = pos.coords.latitude;
           dispatchLocation.longitude = pos.coords.longitude;
           const latlng = win.L.latLng(dispatchLocation.latitude, dispatchLocation.longitude);
           driverMarker.setLatLng(latlng);
           if(order.current_status == EorderStatus.GOTO_RETAILER){
            distance = getDistanceFromLatLonInKm(
                        dispatchLocation,
                        order.retailer_location
                    );
           }
           else{
            distance = getDistanceFromLatLonInKm(
                        dispatchLocation,
                        order.shopper_location
                    );
           }
        }, (error)=>{
            console.log(error);
            handleNotification('oops!!! your location was not properly retrieved', window,'error','oops!!')
        }, {
            enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
        });
    }
    onMount(async () => {
        win = window;
        url = getUrl();
        user = checkForSession(goto);
       let temp = JSON.parse(localStorage.getItem("arc_active_order"));
     
        driverIcon = win.L.icon({
            iconUrl: "leaflet/images/rider.svg",
            iconSize: [28, 83],
            iconAnchor: [16, 60],
            popupAnchor: [-3, -76],
        });
        doneIcon = win.L.icon({
            iconUrl: "leaflet/images/done.png",
            iconSize: [20, 20],
            iconAnchor: [22, 20],
            popupAnchor: [-3, -76],
        });
        pendingIcon = win.L.icon({
            iconUrl: "leaflet/images/pending.png",
            iconSize: [20, 20],
            iconAnchor: [20, 20],
            popupAnchor: [-3, -76],
        });
        try {
            handleNotification(
                "updating order record",
                window,
                "info",
                "loading"
            );

            const orderResp = await axios.get(
                `${url}/order/get_single_order?id=${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                }
            );
            if (orderResp) {
                handleNotification(
                    "order has been retrieved",
                    window,
                    "success",
                    "ok"
                );
                loading = true;

                order = orderResp.data;
                console.log(order);

                localStorage.setItem("arc_active_order", JSON.stringify(order));

                 dispatchLocation = await getLocation();
                if (location) {
                    distance = getDistanceFromLatLonInKm(
                        dispatchLocation,
                        order.shopper_location
                    );
                    console.log("the location link is", distance);
                    map = win.L.map("map", {
                        center: [dispatchLocation.latitude, dispatchLocation.longitude],
                        zoom: 17,
                    });
                    watchMovement();
                    win.L.tileLayer(
                        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        {
                            attribution:
                                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        }
                    ).addTo(map);
                    driverMarker = win.L.marker(
                        [dispatchLocation.latitude, dispatchLocation.longitude],
                        {
                            icon: driverIcon,
                        }
                    ).addTo(map);

                    if (
                        order.current_status == EorderStatus.DISPATCHER_ACCEPT
                    ) {
                        shopperMarker = win.L.marker(
                            [
                                order.shopper_location.latitude,
                                order.shopper_location.longitude,
                            ],
                            {
                                icon: pendingIcon,
                            }
                        ).addTo(map);
                        retailerMaker = win.L.marker(
                            [
                                order.retailer_location.latitude,
                                order.retailer_location.longitude,
                            ],
                            {
                                icon: pendingIcon,
                            }
                        ).addTo(map);
                    }
                    else if(order.current_status == EorderStatus.GOTO_SHOPPER){
                        shopperMarker = win.L.marker(
                            [
                                order.shopper_location.latitude,
                                order.shopper_location.longitude,
                            ],
                            {
                                icon: pendingIcon,
                            }
                        ).addTo(map);
                    }
                    else if(order.current_status == EorderStatus.GOTO_RETAILER){
                        retailerMaker = win.L.marker(
                            [
                                order.retailer_location.latitude,
                                order.retailer_location.longitude,
                            ],
                            {
                                icon: pendingIcon,
                            }
                        ).addTo(map);
                        shopperMarker = win.L.marker(
                            [
                                order.shopper_location.latitude,
                                order.shopper_location.longitude,
                            ],
                            {
                                icon: doneIcon,
                            }
                        ).addTo(map);
                    }
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    });

    const terminateOrder = async ()=>{
      const resp = await  Swal.fire({
        showConfirmButton: true,
        showDenyButton: true,
            confirmButtonText: 'end transcation order',
            denyButtonText: 'cancel',
            text: 'by confirming this request you have agreed to re-assign this order to another driver',
            icon:'question'
        });

        console.log(resp);
        if(resp.isConfirmed){
            //call rejection modal
            goto(`orders/cancel-order?id=${order._id}`);
        }
    }
</script>

<main>
    <nav
        class="row fixed-top"
        style="background-color: transparent; z-index:2000"
    >
        <div class="col-10" />
        <div class="col-2">
            <Sidebar />
        </div>
    </nav>
    <div id="map" />
    <div class="actionBox fixed-bottom card card-body">
        {#if order.current_status == EorderStatus.DISPATCHER_ACCEPT}
            <div>
                <small>Pickup Address</small>
                <span class="distance p-1 ml-2 float-end text-center"
                    >{distance.toFixed(2)}km</span
                >
            </div>
            <div class="row">
                <div class="col-1 padded">
                    <span class="order-status mr-2" />
                </div>
                <div class="col-11">
                    <strong> {order.shopper_address} </strong>
                </div>
            </div>
            <div>
                <small>Delivery Address</small>
            </div>
            <div class="row">
                <div class="col-1 padded">
                    <span class="order-status-delivery mr-2" />
                </div>
                <div class="col-11">
                    <strong> {order.retailer_address} </strong>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <small>Estimated fare</small>
                </div>
                <div class="col">
                    <small>Payment method</small>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <strong>₦300</strong>
                </div>
                <div class="col">
                    <strong>Pay on delivery</strong>
                </div>
            </div>
            <div class="row">
                <div class="col-6 ">
                    <strong> Order ID </strong><br />
                    <small style="overflow-x: auto;">{order._id}</small>
                </div>
                <div class="col-6">
                    <strong>status</strong><br />
                    <small>{order.current_status}</small>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col text-center">
                    {#if loading}
                        <button
                            on:click={gotoShopper}
                            class="btn btn-success my-btn my-primary"
                            >Start Ride</button
                        >
                    {:else}
                        <button
                            disabled
                            class="btn btn-success my-btn my-primary"
                            >Starting Ride...</button
                        >
                    {/if}
                </div>
            </div>
        {:else if order.current_status == EorderStatus.GOTO_SHOPPER}
            <div>
                <small>Shopper Address</small>
                <span class="distance p-1 ml-2 float-end text-center"
                    >{distance.toFixed(2)}km</span
                >
            </div>
            <div class="row">
                <div class="col-10">
                    <div>
                        <strong
                            >{order.shopper.first_name +
                                " " +
                                order.shopper.last_name}</strong
                        >
                    </div>
                    <div class="row">
                        <div class="col-1 padded">
                            <span class="order-status-delivery mr-2" />
                        </div>
                        <div class="col-11">{order.shopper_address}</div>
                    </div>
                </div>
                <div class="col-2">
                    <a href="tel:{order.shopper.phone}"
                        ><span class="fa fa-phone" /></a
                    >
                </div>
            </div>
            <div>
                <small>Contact Info</small>
            </div>
            <div>
                <strong>{order.shopper.phone}</strong>
            </div>
            <div class="mt-2">
                <button on:click="{terminateOrder}" class="btn btn-secondary float-end"
                    >request another dispatcher</button
                >
            </div>

            <div class="mt-3">
               {#if loading}
               <button on:click="{gotoRetailer}" style="width: 100%;" class="btn btn-block btn-success"
               >Recieved from shopper</button
           >
               {:else}
               <button disabled style="width: 100%;" class="btn btn-block btn-success"
                    >Recieving from shopper...</button
                >
               {/if}
            </div>
        {:else if order.current_status ==  EorderStatus.GOTO_RETAILER}

            <div>
                <small>Retailer Address</small>
                <span class="distance p-1 ml-2 float-end text-center"
                    >{distance.toFixed(2)}km</span
                >
            </div>
            <div class="row">
                <div class="col-10">
                    <div>
                        <strong
                            >{order.retailer.first_name +
                                " " +
                                order.retailer.last_name}</strong
                        >
                    </div>
                    <div class="row">
                        <div class="col-1 padded">
                            <span class="order-status-delivery mr-2" />
                        </div>
                        <div class="col-11">{order.retailer_address}</div>
                    </div>
                </div>
                <div class="col-2">
                    <a href="tel:{order.retailer.phone}"
                        ><span class="fa fa-phone" /></a
                    >
                </div>
            </div>
            <div>
                <small>Contact Info</small>
            </div>
            <div>
                <strong>{order.retailer.phone}</strong>
            </div>
            <div class="mt-2">
                <button on:click="{terminateOrder}" class="btn btn-secondary float-end"
                    >request another dispatcher</button
                >
            </div>

            <div class="mt-3">
               {#if loading}
               <button on:click="{endOrder}" style="width: 100%;" class="btn btn-block btn-success"
               >Complete Delivery</button
           >
               {:else}
               <button disabled style="width: 100%;" class="btn btn-block btn-success"
                    >completing Delivery...</button
                >
               {/if}
            </div>
        {/if}
    </div>
</main>

<style>
    small {
        color: #555b6a;
    }
    #map {
        height: 62.5vh;
    }
    main {
        height: 100vh;
        font-family: "Mulish", sans-serif;
    }
    .actionBox {
        overflow-y: auto;
        height: 40.7vh;
        width: 100vw;
        margin-bottom: -5px;
        box-shadow: 0px 4px 50px rgba(0, 0, 0, 0.1);
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }
    .padded {
        padding-top: 12px;
    }
</style>
