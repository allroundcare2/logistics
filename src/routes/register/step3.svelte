<script>
    import RegisterNav from "../../components/RegisterNav.svelte";
    import {goto} from '@sapper/app';
    import axios from 'axios';
import { handleNotification } from "../../functions/clientNot";
import Swal from "sweetalert2";
import { getUrl } from "../../functions/clientAuth";
    let id;
    let pp;
    let idName = '';
    let ppName = '';
    let id_number;
    let issue_date ;
    let url = '';
    $:{
       if(typeof(id) == 'object'){
        idName = id[0].name;
       }
    }
    $:{
       if(typeof(pp) == 'object'){
        ppName = pp[0].name;
       }
    }

    const activateId =()=>{
      document.getElementById('id').click();
    }
    const activatepp =()=>{
      document.getElementById('pp').click();
    }
    const submit = async ()=>{
        url = getUrl();
        const user = JSON.parse(sessionStorage.getItem("arc_driver")).data;
        if (!user) {
                Swal.fire({
                    title: "No session",
                    text: "you do not have a current session, you can try logging in",
                    icon: "error",
                }).then(() => {
                    goto("/login");
                    return;
                });
            }
       const form = new FormData();
       form.append('pp', pp[0]);
       form.append('id', id[0]);
       form.append('id_number', id_number);
       form.append('issue_date', issue_date);
       form.append('driver_id', user.id);
       try {
       const driverResp = await axios.put(`${url}/accounts/driver_id`, form);
       if(driverResp){
        let myResp = await Swal.fire({
                    title: `User information has been added `,
                    text: `We now have personal identification record of you. You can now provide your bank details `,
                    icon: "success",
                    timer: 6000,
                });
                if (myResp) {
                    goto("register/step4");
                }
       }
       
       } catch (error) {
        console.log(error);
        let resp = await Swal.fire({
                    title: 'vehicle was not added. ',
                    text: 'something went wrong , we are aware of it and are on it. Please try again later',
                    icon: 'error',
                    timer: 10000
                });
       }
       
    }
   
</script>

<div class="main">
    <form on:submit|preventDefault="{submit}" class="container">
        <RegisterNav step="3" />
        <p class="h3 mt-4">Document</p>
        <p class="text">
            please provide us with relevant document details and capturing
        </p>

       <div class="row" style="margin-top: 40px">

        <div class="col-12 col-sm-6 mr-sm-2 mb-4">
            <div class="card">
                <div class="card-body">
                    <p class="h3">National ID card</p>

                    <div class="form-group mt-3">
                        <label for="idnumber">ID number</label>
                        <input
                        required
                        bind:value="{id_number}"
                            type="text"
                          
                            class="form-control"
                            id="idnumber"
                            placeholder="e.g, 2355432221AF"
                        />
                    </div>

                    <div class="form-group mt-3">
                        <label for="issued">Issued Date</label>
                        <input
                        required
                        bind:value="{issue_date}"
                            type="date"
                            class="form-control"
                            id="issued"
                            placeholder="e.g, DD/MM/YYYY"
                        />
                    </div>

                    <div class="mt-4">
                        <input type="file" id="id" bind:files="{id}" accept="image/*">
                       <span>{idName}</span> <span on:click="{activateId}" class="button outline float-end"><span class="fa fa-plus bordered mr-2"></span>  Upload a file</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6">
            <div class="card">
                <div class="card-body">
                    <p class="h3">Profile Photo</p>
                    <p>
                        Please provide us with a clear potrait picture of yourself picture 
                        should contain your face only.
                    </p>

                   

                    <div class="mt-5">
                        <input type="file" bind:files="{pp}" id="pp" accept="image/*">
                        <span>{ppName}</span> <span on:click="{activatepp}" class="button outline float-end"><span class="fa fa-plus bordered mr-2"></span>  Upload a file</span>
                    </div>
                </div>
            </div>
        </div>
       </div>

       
       <div class="mt-5 mb-3">
        <button type="submit" class="btn btn-full but">Next</button>
       </div>

        
    </form>
</div>

<style>

    #id{
        width: 0;
        height: 0;
    }
    #pp{
        width: 0;
        height: 0;
    }
    .main {
        font-family: "Mulish", sans-serif;
        background-color: whitesmoke;
        min-height: 100vh;
    }
  
    input {
        background-color: whitesmoke;
        color: #555b6a;
    }
    .outline {
        border: #27ad60 2px solid;
        border-radius: 6px;
        width: 154px;
        height: 45px;
        font-size: 14px;
        color:#555B6A
    }
    label {
        color: #555b6a;
        font-weight: 500;
    }
    .but {
        background-color: #27ad60;
        color: white;
        border-radius: 6px;
        width: 100%;
        height: 45px;
    }
    .h3 {
        text-align: left;
        color: #555b6a;
        font-weight: 700;
    }
    .text {
        text-align: left;
        color: #555b6a;
        line-height: 0.5cm;
    }
</style>

