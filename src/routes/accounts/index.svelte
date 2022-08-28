<script lang="ts">
    import axios from "axios";
    
    import { onMount } from "svelte";
    
        import Nav from "../../components/Nav.svelte";
    import type { Iuser } from "../../Model/accounts";
    import {goto} from "@sapper/app";
    import { checkForSession } from "../../functions/clientAuth";
    import { url } from "../../Model/public";
    import { handleNotification } from "../../functions/clientNot";
        const page = "Accounts";
        let tab = "personal";
        let user: Iuser = {};
        let loading = false;
        let tempDriver: any = {};
        let driver: any = {};
        const switchTab = (myTap) => {
            tab = myTap;
        };
    
        onMount(async ()=>{
            user = checkForSession(goto);
          try {
            const driverResp = await axios.get(`${url}accounts/driver`, {
                headers: {
                    "Authorization": "Bearer " + user.token
                }
    
            });
            console.log(driverResp.data);
           
             if(driverResp){
                loading = true;
                driver = await driverResp.data;
                tempDriver = JSON.parse(JSON.stringify(driver));
             }
          } catch (error) {
            handleNotification('user record didnt load successfully', window, 'error','oops!!!');
            loading = true;
          }
    
        })
    </script>
    
    <main>
        <div class="container">
            <Nav {page} />
    
            <div class="my-tab  mt-4">
                <div class="row">
                    <div class="col-6 pl-2 pr-2  text-center">
                        <button
                            on:click={() => {
                                switchTab("personal");
                            }}
                            style="width: 90%;"
                            class=" btn button-my"
                            class:active-color={tab == "personal"}
                            class:plain-color={tab != "personal"}>personal</button
                        >
                    </div>
                    <div class="col-6 pl-2 pr-2 text-center">
                        <button
                            on:click={() => {
                                switchTab("others");
                            }}
                            style="width: 90%;"
                            class=" btn button-my plain-color "
                            class:active-color={tab != "personal"}
                            class:plain-color={tab == "personal"}>others</button
                        >
                    </div>
                </div>
            </div>
    
           {#if loading}
           {#if tab == "personal"}
           <div id="personal">
               <div class="mt-3 text-center pt-3">
                   <img
                       class="profile"
                       src="{user.profile_pics}"
                       alt="profile pics"
                   />
               </div>
               <div class="input-gp mt-3">
                   <label class="" for="">full name</label>
                   <div class="row">
                       <div class="col-6">
                           <input
                               class="pl-3 ml-1 mr-1"
                               type="text"
                               bind:value="{driver.first_name}"
                               placeholder="first name"
                           />
                       </div>
                       <div class="col-6">
                           <input
                               class="pl-3 ml-1 mr-1"
                               type="text"
                               
                               bind:value="{driver.last_name}"
                               placeholder="last name"
                           />
                       </div>
                   </div>
               </div>
               <div class="input-gp mt-3">
                   <label class="" for="">Email Address</label>
                   <div class="row">
                       <div class="col-12">
                           <input
                           bind:value="{driver.email}"
                               class="pl-3 ml-1 mr-1"
                               type="email"
                               placeholder="eg. example@gmail.com"
                           />
                       </div>
                   </div>
               </div>
               <div class="input-gp mt-3">
                   <label class="" for="">Phone number</label>
                   <div class="row">
                       <div class="col-12">
                           <input
                               class="pl-3 ml-1 mr-1"
                               type="tel"
                               bind:value="{driver.phone}"
                               placeholder="eg. 08000034531"
                           />
                       </div>
                   </div>
               </div>
               <div class="input-gp mt-3">
                   <label class="" for="">Change city</label>
                   <div class="row">
                       <div class="col-12">
                           <select class="pl-3 ml-1 mr-1">
                               <option disabled value="">
                                   select your city</option
                               >
                               <option value="Lagos">Lagos</option>
                               <option value="Calabar">Calabar</option>
                           </select>
                       </div>
                   </div>
               </div>
    
               <div class="text-center mt-3 mb-3">
                   <button class="btn btn-success btn-block submit "
                       >confirm</button
                   >
               </div>
           </div>
       {:else}
           <div id="others">
               <p class="mt-1"><span class="category">VEHICLE</span></p>
               <div class="input-gp mt-3">
                   <label class="" for="">Vehicle type</label>
                   <div class="row">
                       <div class="col-12">
                           <select class="pl-3 ml-1 mr-1">
                               <option disabled value="">
                                   select your vehicle type</option
                               >
                               <option value="Lagos">Bicycle</option>
                               <option value="Calabar">Calabar</option>
                           </select>
                       </div>
                   </div>
               </div>
               <div class="input-gp mt-3">
                   <label class="" for="">Vehicle Manufacturer</label>
                   <div class="row">
                       <div class="col-12">
                           <input
                               class="pl-3 ml-1 mr-1"
                               type="text"
                               bind:value="{driver.vehicle_manufacturer}"
                               placeholder=""
                           />
                       </div>
                   </div>
               </div>
               <p class="mt-1">
                   <span class="category">PAYMENTS</span>
                   <span class="float-end text-success edit mt-2">EDIT</span>
               </p>
               <div class="input-gp mt-3">
                   <label class="" for="">Bank holder name</label>
                   <div class="row">
                       <div class="col-12">
                           <select class="pl-3 ml-1 mr-1">
                               <option disabled value="">
                                   choose a bank</option
                               >
                               <option value="1">Access Bank</option>
                               <option value="2">Zenith Bank</option>
                           </select>
                       </div>
                   </div>
               </div>
               <div class="input-gp mt-3">
                   <label class="" for="accnt">Bank Account Number</label>
                   <div class="row">
                       <div class="col-12">
                           <input
                               class="pl-3 ml-1 mr-1"
                               type="text"
                               bind:value="{driver.account_number}"
                               placeholder="eg. 0087652616"
                           />
                       </div>
                   </div>
               </div>
    
               <div class="text-center mt-3 mb-3">
                   <button class="btn btn-success btn-block submit "
                       >confirm</button
                   >
               </div>
           </div>
       {/if}
           {:else}
          <div class="text-center" style="padding-top: 30vh;">
            <i class="fa fa-spin fa-spinner"></i>
          </div>
           {/if}
        </div>
    </main>
    
    <style>
        
        .fa-spin{
            font-size: 30px;
        }
    
        .edit {
            font-family: "Mulish";
            font-style: normal;
            font-weight: 600;
            font-size: 12px;
            line-height: 25px;
            /* identical to box height, or 208% */
    
            letter-spacing: 0.01em;
    
            color: #27ad60;
        }
        .category {
            font-family: "Mulish";
            font-style: normal;
            font-weight: 600;
            font-size: 12px;
            line-height: 25px;
            /* identical to box height, or 208% */
    
            letter-spacing: 0.01em;
    
            color: #c4c4c4;
        }
        .submit {
            width: 100%;
        }
        .input-gp > label {
            font-family: "Mulish";
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 25px;
            /* identical to box height, or 179% */
    
            text-align: center;
            letter-spacing: 0.01em;
    
            color: #000000;
        }
    
        input {
            box-sizing: border-box;
            width: 100%;
    
            height: 45px;
    
            border: 1px solid #c9ccd3;
            border-radius: 5px;
        }
        select {
            box-sizing: border-box;
            width: 100%;
    
            height: 45px;
    
            border: 1px solid #c9ccd3;
            border-radius: 5px;
        }
        .profile {
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }
        main {
            background-color: whitesmoke;
            min-height: 100vh;
            font-family: "Mulish", sans-serif;
        }
        .button-my {
            margin: auto;
            font-style: normal;
            font-weight: 600;
            font-size: 12px;
            line-height: 25px;
    
            text-align: center;
            letter-spacing: 0.01em;
        }
    </style>