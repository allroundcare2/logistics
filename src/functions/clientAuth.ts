import type { Iuser } from "../Model/accounts";

export interface Ilocation {
    latitude: number;
    longitude: number;
}
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
   return location.hostname == 'localhost'? 'http://localhost:4000' : 'https://api.allroundcare.ng';
}

function deg2rad(deg: number) {
    return deg * (Math.PI/180)
  }
export function getDistanceFromLatLonInKm(from:Ilocation, to: Ilocation) {
    const R = 6371; // Radius of the earth in km
    const latitudeDiff = from.latitude  - to.latitude  ;
    const longitudeDiff = from.longitude - to.longitude;
    const dLon = deg2rad(longitudeDiff); 
    const dLat = deg2rad(latitudeDiff);  // deg2rad below
    
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(from.latitude)) * Math.cos(deg2rad(to.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
