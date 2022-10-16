<script lang="ts">
    import { onMount } from "svelte";
    let files;
    let filename = '';
    const selectFile = () => {
        document.getElementById('files').click();
    };
const upload =()=>{

}
const readFile =()=>{
    console.log('my test',files);
}
    onMount(() => {});
</script>

<main>
    <div class="container mb-2">
        <h2 class="strong mt-5 text-center">Confirm Payment</h2>
        <p class="comment mt-3 mb-3">Upload the payment receipt image below</p>

        <div class="card card-body p-3">
            <p class="title">Receipt Information</p>

            <form class="mt-4 mb-4">
                <div class="mb-2">
                    <input type="text" placeholder="Name" />
                </div>
                <div class="mt-4">
                    <input type="text" placeholder="amount" />
                </div>

                <div class="mt-4 d-grid gap-2">
                    <small>{filename}</small>
                    <button on:click|preventDefault="{selectFile}" class="upload btn ">upload a file</button>
                    <input accept="image/*, application/pdf" on:blur="{readFile}" id="files" {files} type="file" />
                </div>
                <div class="mt-5">
                    <button type="submit" on:click|preventDefault="{upload}" class="upload btn float-end">Submit Form</button>
                </div>
            </form>
        </div>
    </div>
</main>

<style>
    .upload {
      
        height: 45px;
        box-sizing: border-box;
        border: 1px solid #27ad60;
        border-radius: 5px;
    }
    input[type="file"] {
        width: 0;
        height: 0;
    }
    input[type="text"] {
        width: 100%;
        height: 45px;
        padding-left: 10px;
        padding-right: 10px;
        background: #f7f7f7;
        border: 0.5px solid #8b8b8b;
        border-radius: 5px;
    }
    .title {
        font-family: "Mulish";
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 25px;
        color: #535151;
    }
    .strong {
        font-family: "Mulish";
        font-style: normal;
        font-weight: 800;
        font-size: 24px;
        line-height: 30px;

        color: #2fa94e;
    }
    .comment {
        font-family: "Mulish";
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 15px;

        text-align: center;

        color: #555b6a;
    }
</style>
