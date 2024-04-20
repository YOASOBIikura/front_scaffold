//http请求
async function httpRequest(_this,option){
    if(!option.method){
        throw new Error("lack field method")
    }
    if(!option.target){
        throw new Error("lack field target")
    }
    let xhr=new XMLHttpRequest();
    let url=""
    if(option.httpUrl){
        url=`${option.httpUrl}${option.target}`
    }else{
        url=`${_this.httpUrl}${option.target}`
    }
    let data;
    //处理各种请求
    if(option.method=="get" || option.method == "delete"){
        data=handleGet(option.data);
        if(data && data!=''){
            url=`${url}?${data}`
        }
        xhr.open(option.method,url,true);
    }else if(option.method =="post" || option.method == "put"){
        data=JSON.stringify(option.data);
        xhr.open(option.method,url,true);
    }else{
        throw new Error("method filed  error")
    }


 
    for(let key in option.headers){
        xhr.setRequestHeader(encodeURIComponent(key),encodeURIComponent(option.headers[key]));
    }
    //发送请求
    !data? xhr.send(): xhr.send(data);
    return new Promise((resolve,reject) => {
        xhr.onreadystatechange = function () {
            if(xhr.readyState===4){
                if(xhr.status>=200 && xhr.status<300){
                    let response=  JSON.parse(xhr.response)          
                    resolve(response)
                }else{
                    reject(new Error("http request fail"))
                }
            }
        }

    })
}

function handleGet(param){
   let data="";
   for(let key in param){
      data+=`${key}=${param[key]}&`
   }
   return data.substring(0,data.length-1)
}


export {httpRequest} ;