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
    xhr.open(option.method,url,true);
    for(let key in option.headers){
        xhr.setRequestHeader(encodeURIComponent(key),encodeURIComponent(option.headers[key]));
    }
    xhr.send(JSON.stringify(option.data));
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
export {httpRequest} ;