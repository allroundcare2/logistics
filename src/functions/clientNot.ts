

export const handleNotification = (message: string, win: any, type: string, title: string, image: string = '', func: any = ()=>{}) => {
    console.log(type);
     win.iziToast[type]({
         title,
         message,
         position: 'bottomRight',
         image,
         onClosed: func
     })
     
     return func || 0
 }