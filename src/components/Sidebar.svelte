<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import axios from "axios";
  import type { Iuser } from "../Model/accounts";
  import { checkForSession, getUrl } from "../functions/clientAuth";
  let bsOffcanvas: any;
  let win: any;
  let deferredPrompt: any = {};
  let session_user: Iuser = {};
  let url = "";
  let showInstallAppButton = false;
  let wallet = 0;
  const open = () => {
    bsOffcanvas.show();
  };

  const nav = (screen: string) => {
    goto(screen);
  };
  const logout = () => {
    localStorage.clear();
    goto("landing");
  };
  function installPWA() {
    console.log("defer", deferredPrompt);
    deferredPrompt.prompt(); // Show the install prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        // PWA was installed
      } else {
        // PWA installation was declined
      }
      deferredPrompt = null; // Reset the deferredPrompt variable
    });
  }

  onMount(async () => {
    win = window;
    url = getUrl();
    session_user = checkForSession(goto);
    window.addEventListener("beforeinstallprompt", (event) => {
      console.log("before install", event);
      event.preventDefault(); // Prevent the default install prompt
      deferredPrompt = event;

      // Show an install button or other UI element to prompt the user to install the PWA
      showInstallAppButton = true;
    });

    if ("getInstalledRelatedApps" in navigator) {
      navigator.getInstalledRelatedApps().then((relatedApps) => {
        console.log("related apps", relatedApps);
        if (relatedApps.length > 0) {
          // PWA is installed
          showInstallAppButton = false;
        } else {
          // PWA is not installed
          showInstallAppButton = true;
        }
      });
    } else {
      // The browser does not support the getInstalledRelatedApps() method
      alert("your phone does not support pwa features");
    }

    console.log(win);
    const myOffcanvas = document.getElementById("sidebar");
    bsOffcanvas = new win.bootstrap.Offcanvas(myOffcanvas);
    try {
      const result = await axios.get(url + "/drivers/dashboard", {
        headers: {
          Authorization: "Bearer " + session_user.token,
        },
      });
      if (result) {
        wallet = result.data[0].wallet;
      }
    } catch (error) {}
  });
</script>

<button on:click={open} class="btn"> <span class="fa fa-bars" /> </button>
<div
  class="offcanvas offcanvas-start"
  tabindex="-1"
  id="sidebar"
  aria-labelledby="sidebarLabel"
>
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="sidebarLabel">ARC</h5>
    <button
      type="button"
      class="btn-close text-reset"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    />
  </div>
  <div class="offcanvas-body">
    <div>
      <div class="row">
        <div class="col-6">
          <small>Balance: </small> <span class="balance">₦{wallet}</span>
        </div>
      </div>
    </div>

    <div class="container">
      <div
        class="row mb-3"
        on:click={() => {
          nav("/");
        }}
      >
        <div class="col-2"><span class="fa fa-home" /></div>
        <div class="col-8"><strong>Home</strong></div>
      </div>
      <div
        class="row mb-3"
        on:click={() => {
          nav("/earning");
        }}
      >
        <div class="col-2"><span class="fa fa-credit-card" /></div>
        <div class="col-8"><strong>Earning</strong></div>
      </div>
      <div
        on:click={() => {
          nav("/orders");
        }}
        class="row mb-3"
      >
        <div class="col-2"><span class="fa fa-calendar-o" /></div>
        <div class="col-8"><strong>Orders</strong></div>
      </div>
      <div
        on:click={() => {
          nav("/packages");
        }}
        class="row mb-3"
      >
        <div class="col-2"><span class="fa fa-cubes" /></div>
        <div class="col-8"><strong>Packages</strong></div>
      </div>
      <div
        class="row mb-3"
        on:click={() => {
          nav("/accounts");
        }}
      >
        <div class="col-2"><span class="fa fa-cog" /></div>
        <div class="col-8"><strong>Settings</strong></div>
      </div>
      <div class="row mb-3">
        <div class="col-2"><span class="fa fa-phone" /></div>
        <div class="col-8"><strong>Support</strong></div>
      </div>
      <div class="row mb-3">
        <div class="col-2"><span class="fa fa-exclamation" /></div>
        <div class="col-8"><strong>About</strong></div>
      </div>
      <div on:click={logout} class="row">
        <div class="col-2"><span class="fa fa-sign-out" /></div>
        <div class="col-8"><strong>Logout</strong></div>
      </div>
      {#if showInstallAppButton}
        <!-- content here -->
        <div on:click={installPWA} class="row mb-3">
          <div class="col-2"><span class="fa fa-exclamation" /></div>
          <div class="col-8"><strong>Install App</strong></div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .offcanvas {
    background-color: #27ad60;
    color: white;
  }
  .btn {
    width: 40px;
    height: 40px;
    background-color: white;
    border-radius: 50%;
  }
  .balance {
    font-weight: 400;
    font-size: large;
  }
</style>
