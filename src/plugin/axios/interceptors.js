function Interceptors(){
    this.list=[]
}

Interceptors.prototype.use=function(fn){
    this.list.push(fn);
} 
export default Interceptors