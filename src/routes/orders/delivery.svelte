<script lang="ts">
    import { onMount } from "svelte";

    import Sidebar from "../../components/Sidebar.svelte";

    let map;
    let win: any;
    let myIcon: any = {};
    const getLocation = (): Promise<any> => {
       
       return new Promise((resolve, reject)=>{
           if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition((position) => {
               resolve({
                   latitude: position.coords.latitude,
                   longitude: position.coords.longitude,
               })
               
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
       })
      
   };
 
    onMount( async () => {
        win = window;
     myIcon = win.L.icon({
    iconUrl: 'leaflet/images/rider.svg',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: 'leaflet/images/marker-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});
        const location = await getLocation();
        if(location) {
            map = win.L.map("map", {
            center: [location.latitude, location.longitude],
            zoom: 17,
        });
        win.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        win.L.marker([location.latitude, location.longitude], {icon:myIcon}).addTo(map);
        }
       
    });
</script>

<main>
    <nav class="row fixed-top"  style="background-color: transparent; z-index:2000">
        <div class="col-10">
           
        </div>
        <div class="col-2">
            <Sidebar />
        </div>
    </nav>
    <div id="map" />
    <div class="actionBox fixed-bottom card card-body">
        <div>
            <small>Pickup Address</small>
            <span class="distance p-1 ml-2 float-end text-center">2.5km</span>
        </div>
        <div class="row">
            <div class="col-1 padded"><span class="order-status mr-2" /></div>
            <div class="col-11"><strong> 3rd Ave road, Ikot Ansa </strong></div>
        </div>
        <div>
            <small>Delivery Address</small>
        </div>
        <div class="row">
            <div class="col-1 padded"><span class="order-status-delivery mr-2" /></div>
            <div class="col-11"><strong> 13 SDAT Cricket Ground  </strong></div>
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
        <div><small>Order ID: No1209906032</small></div>

        <div class="row mb-2">   
            <div class="col text-center">
                <button  class="btn btn-secondary my-btn my-secondary">Cancel</button>
            </div>
            <div class="col text-center">
                <button class="btn btn-success my-btn my-primary">Confirm</button>
            </div>
        </div>
    </div>
</main>

<style>
    small {
        color: #555B6A;
    }
    #map {
        height: 62.5vh;
    }
    main {
        height: 100vh;
        font-family: "Mulish", sans-serif;
    }
    .actionBox {
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
