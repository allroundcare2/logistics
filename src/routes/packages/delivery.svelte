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
    let activePackage: any = {}; 
    let activeDestination: any ={};
    let notLoading = true;
    let driverMarker: any = {};
    let dispatchLocation : Ilocation = {latitude: 0, longitude: 0};
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
    const endOrder =()=>{
        goto(`orders/complete-order?id=${order._id}`)
    }
    const gotoShopper = async () => {
        notLoading = false;
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
                notLoading = true;
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
                
            }
        } catch (error) {
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
            handleNotification('oops!!! order was not updated successfully', window, 'error','oops!!!');
            
        }
    };

    const addDriverMarker  =()=> {
         driverMarker = new win.google.maps.Marker({
          position: { lat: dispatchLocation.latitude, lng: dispatchLocation.longitude },
          map: map,
        });
      }

    const watchMovement =()=>{
        watchID = navigator.geolocation.watchPosition((pos)=>{
            //success callback function
           dispatchLocation.latitude = pos.coords.latitude;
           dispatchLocation.longitude = pos.coords.longitude;
           const latlng = win.L.latLng(dispatchLocation.latitude, dispatchLocation.longitude);
           driverMarker.setLatLng(latlng);
       
        }, (error)=>{
            console.log(error);
            handleNotification('oops!!! your location was not properly retrieved', window,'error','oops!!')
        }, {
            enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
        });
    }

    const mapInit =()=>{
    map = new win.google.maps.Map(document.getElementById('map'), {
      center: { lat: dispatchLocation.latitude, lng: dispatchLocation.longitude }, // Set the initial map center
      zoom: 10 // Set the initial zoom level
    });
    addDriverMarker();
    }
    onMount(async () => {
        win = window;
        url = getUrl();
        user = checkForSession(goto);
       let temp = JSON.parse(localStorage.getItem("arc_active_delivery"));
       temp.packages.forEach((p : any)=>{
        console.log(p);
        if(p.current_status != 'DELIVERED'){ 
            activePackage = p;
            activeDestination = p.destinations[0];
            
             return}
       })
      
     
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
<svelte:head>
   
</svelte:head>
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
            <!-- <div>
                <small>Pickup Address</small>
                <span class="distance p-1 ml-2 float-end text-center"
                    >{distance.toFixed(2)}km</span
                >
            </div> -->
            <div class="row">
                <div class="col-1 padded">
                    <span class="order-status mr-2" />
                </div>
                <div class="col-11">
                    <strong> {activePackage.pickupAddress } </strong>
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
                    <strong> {activeDestination.destinationAddress} </strong>
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
                    <strong>{activePackage.isPaid? 'paid on pickup':'pay on delivery'}</strong>
                </div>
            </div>
            <div class="row">
                <div class="col-7 ">
                    <strong> Order ID </strong><br />
                    <small style="overflow-x: auto;">{activePackage.packageId}</small>
                </div>
                <div class="col-5">
                    <strong>status</strong><br />
                    <small>{activePackage.currentStatus}</small>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col text-center">
                    {#if notLoading}
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
               {#if notLoading}
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
               {#if notLoading}
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
