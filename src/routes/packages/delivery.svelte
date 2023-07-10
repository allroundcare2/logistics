<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        // the `slug` parameter is available because this file
        // is called [slug].svelte
        const { id } = page.query;
        return { id };
    }
</script>

<script lang="ts">
    import axios from "axios";
    import { onMount } from "svelte";
    import Sidebar from "../../components/Sidebar.svelte";
    import ProductsModal from "../../components/package/ProductsModal.svelte";
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
    let productModal: any ={};
    let map;
    let delivery: any = {};
    let modalProducts: any[]= [];
    let order: Iorder = { shopper: {}, retailer: {} };
    let win: any;
    let activePackage: any = {};
    let notLoading = true;
    let driverMarker: any = {};
    let dispatchLocation: Ilocation = { latitude: 0, longitude: 0 };
    let distance = 1;
    let user: any;
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
    const endOrder = () => {
        goto(`orders/complete-order?id=${order._id}`);
    };
    const startRide = async (activeP: any) => {
        notLoading = false;
        handleNotification("updating movement", window, "info", "updating...");
        try {
            const orderResp = await axios.put(
                `${url}/drivers/start_package_delivery?packageId=${activeP.packageId}`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                }
            );
            if (orderResp) {
                notLoading = true;
                handleNotification(
                    "you can now going to pickup the order",
                    window,
                    "success",
                    "ok"
                );
             await  updateDelivery()
            }
        } catch (error) {
            handleNotification('ride could not start, you might be offline',win,'error','error');
            console.log(error);
            notLoading = true;
        }
    };
    const gotoRetailer = async () => {
        notLoading = false;
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
                notLoading = true;
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
            }
        } catch (error) {
            notLoading = true;
            console.error(error);
            handleNotification(
                "oops!!! order was not updated successfully",
                window,
                "error",
                "oops!!!"
            );
        }
    };

    const addDriverMarker = () => {
        driverMarker = new win.google.maps.Marker({
            position: {
                lat: dispatchLocation.latitude,
                lng: dispatchLocation.longitude,
            },
            map: map,
        });
    };

    const watchMovement = () => {
        watchID = navigator.geolocation.watchPosition(
            (pos) => {
                //success callback function
                dispatchLocation.latitude = pos.coords.latitude;
                dispatchLocation.longitude = pos.coords.longitude;
                const latlng = win.L.latLng(
                    dispatchLocation.latitude,
                    dispatchLocation.longitude
                );
                driverMarker.setLatLng(latlng);
            },
            (error) => {
                console.log(error);
                handleNotification(
                    "oops!!! your location was not properly retrieved",
                    window,
                    "error",
                    "oops!!"
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    };

    const mapInit = () => {
        map = new win.google.maps.Map(document.getElementById("map"), {
            center: {
                lat: dispatchLocation.latitude,
                lng: dispatchLocation.longitude,
            }, // Set the initial map center
            zoom: 10, // Set the initial zoom level
        });
        addDriverMarker();
    };
    onMount(async () => {
        win = window;
        url = getUrl();
        try {
            
        productModal = new win.bootstrap.Modal(document.getElementById('productModal'));
        } catch (error) {
            console.log(error);
        }
        user = checkForSession(goto);
        let temp = JSON.parse(localStorage.getItem("arc_active_delivery"));
        delivery = temp;
        temp.packages.forEach((p: any) => {
            console.log(p);
            if (p.current_status != "DELIVERED") {
                activePackage = p;
                return;
            }
        });
       // updateDelivery();
        mapInit();
        try {
            handleNotification(
                "updating order record",
                window,
                "info",
                "loadin"
            );
        } catch (error) {
            console.log("error", error);
        }
    });
    const openProductModal = ()=>{
        console.log('orders ', activePackage);
        modalProducts = activePackage.products;
        productModal.show();
    }

    const updateDelivery =async ()=>{
        try {
        const resp = await  axios.get(`${url}/drivers/delivery_details?id=${delivery.id}`, {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                });
        console.log('the shape of dna',resp.data);
        if(resp.data.message == 'success'){
            delivery = resp.data.data;
            console.log('deliveries', delivery);
            delivery.packages.forEach((p: any) => {
            console.log('pino code',p);
            if (p.current_status != "DELIVERED") {
                activePackage = p;
                return;
            }
        });
        handleNotification('reload is successful', win, 'success','Ok');
        }
        } catch (error) {
            
        }
    }
</script>

<svelte:head />
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
        {#if activePackage}
         
            <div class="row">
                <div class="col-1 padded">
                    <span class="order-status mr-2" />
                </div>
                <div class="col-11">
                    <strong> {activePackage.pickupAddress} </strong>
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
                    <strong> {activePackage.destinationAddress} <i on:click={openProductModal} style="color: green" class="float-end fa fa-shopping-cart "></i> </strong>
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
                    <strong>₦{Number(activePackage.cost).toFixed(2)}</strong>
                </div>
                <div class="col">
                    <strong
                        >{activePackage.isPaid
                            ? "paid on pickup"
                            : "pay on delivery"}</strong
                    >
                </div>
            </div>
            <div class="row">
                <div class="col-7">
                    <strong> Package ID </strong><br />
                    <small style="overflow-x: auto;"
                        >{activePackage.packageId}</small
                    >
                </div>
                <div class="col-5">
                    <strong>status</strong><br />
                    <small>{activePackage.currentStatus}</small>
                </div>
            </div>

            <div class="row mb-2">
              {#if activePackage.currentStatus == 'ACCEPTED'}
              <div class="col text-center">
                {#if notLoading}
                    <button
                        on:click={()=>{startRide(activePackage)}}
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
              {:else if  activePackage.currentStatus == 'IN_TRANSIT'}
              <div class="col text-center">
                {#if notLoading}
                    <button
                        on:click={startRide}
                        class="btn btn-success my-btn my-primary"
                        >Close Package</button
                    >
                {:else}
                    <button
                        disabled
                        class="btn btn-success my-btn my-primary"
                        >Starting Ride...</button
                    >
                {/if}
            </div>
            <div class="col text-center">
                <button
                class="btn btn-success my-btn my-primary"
                >Request Rider</button
            >
            </div>
              {:else if activePackage.currentStatus == 'DELIVERED'}
                 <!-- else content here -->
              {/if}
            </div>
          
         {/if}
        </div>
</main>
<ProductsModal products={modalProducts}></ProductsModal>

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
