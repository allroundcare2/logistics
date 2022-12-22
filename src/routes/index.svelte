<script lang="ts">
    import Sidebar from "../components/Sidebar.svelte";
    import { onMount } from "svelte";
    import { checkForSession, getUrl } from "../functions/clientAuth";
    import { goto } from "@sapper/app";
    import { handleNotification } from "../functions/clientNot";
    import axios from "axios";
    import Loader from "../components/Loader.svelte";
    let session_user: any = {};
    let loader = true;
    let hasGeo = false;
    let dashboard = { wallet: 0.0, totalOrders: 0 };
    let url = "";
    //let watchID: any;
    let isOnline = false;
    const toggleOnline =async ()=>{
        if(isOnline){
            handleNotification('you are going offline', window, 'info','loading...');
            isOnline = false;
                try {
                    const resp = await axios.put(url + "/drivers/go_offline",
                    {}, {
                    headers: {
                        Authorization: "Bearer " + session_user.token,
                    },
                });
                    console.log('resp', resp);
                    if(resp.data){
                        handleNotification('you are now offline you wont be getting any new order', window, 'success','ok');
                    }
                } catch (error) {
                    isOnline = true;
                    handleNotification('oops something went wrong try again later', window, 'error','error');
                }
        }
        else{
            handleNotification('you are going online', window, 'info','loading...');
              navigator.geolocation.getCurrentPosition(async (position) => {
                isOnline = true;
                try {
                    const resp = await axios.put(url + "/drivers/go_online",
                    {latitude: position.coords.latitude, longitude: position.coords.longitude}, {
                    headers: {
                        Authorization: "Bearer " + session_user.token,
                    },
                });
                    console.log('resp', resp);
                    if(resp.data){
                        handleNotification('you are now online ready for orders', window, 'success','ok');
                    }
                } catch (error) {
                    isOnline = false;
                    handleNotification('oops something went wrong try again later', window, 'error','error');
                }
              });
        }
    }
    onMount(async () => {
        url = getUrl();
        session_user = await checkForSession(goto);
        console.log(session_user);
        if (session_user) {
            handleNotification(
                "loading dashboard details",
                window,
                "info",
                "loading..."
            );
            if ('geolocation' in navigator) {
  hasGeo = true;
  handleNotification('geolocation is available on this device', window, 'success','ok');
} else {
  hasGeo = false;
  handleNotification('your location cannot be found', window, 'error','error');
}
            try {
                const result = await axios.get(url + "/drivers/dashboard", {
                    headers: {
                        Authorization: "Bearer " + session_user.token,
                    },
                });
                if (result) {
                    loader = false;
                    handleNotification(
                        "dashboard details loaded successfully",
                        window,
                        "success",
                        "ok"
                    );
                    dashboard.wallet = result.data[0].wallet;
                    dashboard.totalOrders = result.data[1];
                }
            } catch (error) {
                handleNotification(
                    "recent data didnt load successfully",
                    window,
                    "error",
                    "error"
                );
            }
        }
    });
</script>

<svelte:head>
    <title>ARC :: logistics dashboard</title>
</svelte:head>
{#if !loader}
    <main>
        <div class="container">
            <nav class="row " style="background-color: transparent">
                <div class="col-3">
                    <Sidebar />
                </div>
                <div class="col-9">
                    <img
                        src={session_user.profile_pics || "images/indomie.jpg"}
                        alt="profile pics"
                        class="pp float-end"
                    />
                </div>
            </nav>
            <div class="row pl-2 pr-2">
                <div class="col">
                    <div class="form-check form-switch">
                        <input
                            on:change={toggleOnline}
                            class="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            checked="{isOnline}"
                        />
                        <label class="form-check-label" for="flexSwitchCheckChecked"
                            >{#if isOnline}
                                you are currently online
                            {:else}
                                you are currently offline
                            {/if}</label
                        >
                    </div>
                </div>
            </div>
            <section class="row" id="">
                <div class="col-12 col-sm-6 col-md-3">
                    <div
                        class="card card-body bg-primary text-white mb-1 mr-1 mt-0 mb-0"
                    >
                        <div class="row">
                            <div class="col-3 text-center">
                                <i class="icon fa fa-dollar" />
                            </div>
                            <div class="col-9">
                                <p class="main-txt mb-0">
                                    <strong>₦{dashboard.wallet}</strong>
                                </p>
                                <p class="mb-0">
                                    <small>wallet balance</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <div
                        class="card card-body bg-secondary text-white mb-1 mr-1 mt-0 mb-0"
                    >
                        <div class="row">
                            <div class="col-3 text-center">
                                <i class="icon fa fa-motorcycle" />
                            </div>
                            <div class="col-9">
                                <p class="main-txt mb-0">
                                    <strong>{dashboard.totalOrders}</strong>
                                </p>
                                <p class="mb-0"><small>Total Orders</small></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <div
                        class="card card-body bg-danger text-white mb-1 mr-1 mt-0 mb-0"
                    >
                        <div class="row">
                            <div class="col-3 text-center">
                                <i class="icon fa fa-times" />
                            </div>
                            <div class="col-9">
                                <p class="main-txt mb-0"><strong>0</strong></p>
                                <p class="mb-0">
                                    <small>Cancelled Order</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <div
                        class="card card-body bg-primary text-white mb-1 mr-1 mt-0 mb-0"
                    >
                        <div class="row">
                            <div class="col-3 text-center">
                                <i class="fa fa-exchange icon" />
                            </div>
                            <div class="col-9">
                                <p class="main-txt mb-0"><strong>0</strong></p>
                                <p class="mb-0">
                                    <small>Pending Transcatons</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
{:else}
    <Loader />
{/if}

<style>
    .icon {
        font-size: 30px;
    }
    main {
        font-family: "Mulish", sans-serif;
        background-color: whitesmoke;
        min-height: 100vh;
    }
    .main-txt {
        font-size: 20px;
        font-weight: 600;
    }
    .pp {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
</style>
