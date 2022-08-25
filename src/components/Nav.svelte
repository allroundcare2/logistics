
<script>

    export let page;
    const goback =()=>{
        history.back();
    }
</script>
<nav class="row">
    <div class="col-3"><i on:click="{goback}" class="fa  fa-arrow-left" /></div>
    <div class="col-6"><h5 class="text-center">{page}</h5></div>
    
   
</nav>



<style>
    span {
        color:#27ad60
    }
    i {
        color:#555B6A;
        font-size: 25px;
    }
    h5 {
        color: #27ad60;
        font-family: "Mulish", sans-serif;
        font-weight: 800;
    }
   
</style>
