import type { Iuser } from "../Model/accounts";

export function checkForSession (goto){
    //retrieve client session
    if(localStorage.getItem('arc_l_users')){
        const user: Iuser  = JSON.parse(localStorage.getItem('arc_l_users'));
        return user;
    }
    else{
        return goto('/landing');
    }
}
/** this function is conncern with checking the user's registration progress 
 * and navigate the user based on that input
 */
export function registration_status(){

}

export function  getUrl(){
   return location.hostname == 'localhost'? 'http://localhost:4000' : 'http://api.allroundcare.ng';
}
